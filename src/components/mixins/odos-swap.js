import {odosApiService} from "@/services/external/odos-api-service";
import loadJSON from "@/utils/http-utils";
import {mapActions, mapGetters} from "vuex";
import {tokenLogo} from "@/components/mixins/token-logo";
import {logger} from "@/components/mixins/logger";

const ODOS_DURATION_CONFIRM_REQUEST = 60
const SECONDTOKEN_DEFAULT_SYMBOL= 'USD+';
const SECONDTOKEN_SECOND_DEFAULT_SYMBOL= 'DAI+';

export const odosSwap = {
    mixins: [
        tokenLogo,
        logger
    ],
    data() {
        return {
            baseViewType: 'SWAP',
            isChainsLoading: false,
            isPricesLoading: false,
            isBalancesLoading: false,
            isFirstBalanceLoaded: false,
            isContractLoading: false,
            isTokenExternalDataLoading: false,

            isTokensLoading: false,
            isTokensLoadedAndFiltered: false,

            chains: null,
            tokensMap: null,

            secondTokens: [],
            tokens: [],

            contractData: null,
            routerContract: null,
            executorContract: null,

            tokensContractMap: {}, // { 'contractAddress': {ABI} }
            tokenPricesMap: {},

            availableNetworksList: [
                'polygon',
                'bsc',
                'optimism',
                'arbitrum',
                'zksync',
                'base'
            ],
            dataBeInited: false,

            swapResponseInfo: null,
            quotaResponseInfo: null,
            swapResponseConfirmInfo: {
                duration: 0,
                counterId: null,
                waitingConformation: false
            },
            additionalSwapStepType: null, // 'APPROVE', 'DEPOSIT'

            isShowDecreaseAllowanceButton: true,

            updateBalancesIntervalId: null,
            lastPoolInfoData: null,
            lastNftTokenId: null,
            lastZapResponseData: null,
            lastPutIntoPoolEvent: null,
            lastReturnedToUserEvent: null,

            isShowSuccessModal: false,
            isShowSuccessPoolModal: false,
            successData: {
                inputTokens: [],
                outputTokens: []
            },
            zksyncFeeHistory: null,

            tokenSeparationScheme: null, // OVERNIGHT_SWAP, POOL_SWAP,
            typeOfPoolScheme: null, // OVN, ALL, null

            listOfBuyTokensAddresses: null, // for POOL_SWAP scheme
            odosReferalCode: 7777777,

            swapSessionId: null,
        }
    },
    async mounted() {
       this.initUpdateBalancesInterval();
    },
    beforeMount() {
        if (this.updateBalancesIntervalId) {
            clearInterval(this.updateBalancesIntervalId);
        }
    },
    beforeDestroy() {
        if (this.updateBalancesIntervalId) {
            clearInterval(this.updateBalancesIntervalId);
        }
    },
    computed: {
        ...mapGetters('web3', ['web3', 'getWeiMarker']),
        ...mapGetters('gasPrice', ['show', 'gasPrice', 'gasPriceGwei', 'gasPriceStation']),
        ...mapGetters('network', ['getParams', 'networkName', 'networkId']),
        ...mapGetters('accountData', ['account']),


        isAllLoaded: function() { // form swap window show
            if (this.baseViewType === 'SWIPE') {
                return this.account ? (this.isTokensLoadedAndFiltered && this.isFirstBalanceLoaded) : this.isTokensLoadedAndFiltered;
            }

            if (this.baseViewType === 'SWAP') {
                return this.isTokensLoadedAndFiltered;
            }

            return true;
        },

        isAllDataLoaded: function() {
            return !this.isChainsLoading && !this.isTokensLoading;
        },
        isShowDecreaseAllowance () {
            return this.isShowDecreaseAllowanceButton && this.account === '0x4473D652fb0b40b36d549545e5fF6A363c9cd686'; // test front dev address
        },
        isAvailableOnNetwork() {
            return this.availableNetworksList.includes(this.networkName)
        },
        secondTokensSelectedCount() {
            return this.secondTokens.filter(item => item.selected).length;
        },
        tokensSelectedCount() {
            return this.tokens.filter(item => item.selected).length;
        },
        stablecoinSecondTokens() {
            return this.secondTokens.filter(item => item.assetType === 'usd');
        },
        stablecoinTokens() {
            return this.tokens.filter(item => item.assetType === 'usd');
        },
        stablecoinWithoutSecondTokens() {
            return this.stablecoinTokens.filter(item => !this.stablecoinSecondTokens.map(item => item.address).includes(item.address));
        },
        tokensToBalanceUpdate() {
            if (this.baseViewType === 'SWIPE') {
                return [...this.stablecoinTokens, ...this.stablecoinSecondTokens];
            }

            return [...this.secondTokens, ...this.tokens];
        }
    },
    watch: {
        isAllDataLoaded: async function (newVal, oldValue) {
            console.log("all data loaded for odos: ", newVal, this.tokenSeparationScheme, this.listOfBuyTokensAddresses)
            if (newVal && !this.dataBeInited) {
                await this.initData(this.tokenSeparationScheme, this.listOfBuyTokensAddresses);
                this.dataBeInited = true
            }
        },

        account: function (newVal, oldVal) {
            if (newVal) {
                this.initAccountData();
            }
        },
        networkId: async function (newVal, oldVal) {
            if (newVal) {
                console.log("set network for odos: ", newVal, this.tokenSeparationScheme, this.listOfBuyTokensAddresses);
                this.isFirstBalanceLoaded = false;
                this.isBalancesLoading = false;
                this.quotaResponseInfo = null;
                await this.initContractData()
                await this.initData(this.tokenSeparationScheme, this.listOfBuyTokensAddresses);
            }
        }
    },
    methods: {
        ...mapActions("errorModal", ['showErrorModal', 'showErrorModalWithMsg']),
        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),

        async loadChains() {
            if (this.isChainsLoading) {
                return
            }

            this.isChainsLoading = true;
            odosApiService.loadChains().then(data => {
                console.log("Chains: ", data)
                this.chains = data.chains
                this.isChainsLoading = false;
            }).catch(e => {
                console.log("Error load chains", e)
                this.isChainsLoading = false;
            })
        },
        async loadTokens() {
            if (this.isTokensLoading) {
                return
            }

            this.isTokensLoading = true;
            odosApiService.loadTokens()
                .then(data => {
                    console.log("Tokens: ", data)
                    this.tokensMap = data
                    this.isTokensLoading = false;
                }).catch(e => {
                    console.log("Error load tokens", e)
                    this.isTokensLoading = false;
                })
        },


        async initData(tokenSeparationScheme, listOfBuyTokensAddresses) {
            this.clearInputData();
            this.isTokensLoadedAndFiltered = false;

            if (!tokenSeparationScheme) {
                console.error("Not found separation scheme, when init data.")
                this.isTokensLoadedAndFiltered = true;
                return;
            }

            if (!this.isAvailableOnNetwork) {
                console.info("Swap init not available on this network.", this.networkName)
                this.isTokensLoadedAndFiltered = true;
                return
            }

            if (tokenSeparationScheme === 'OVERNIGHT_SWAP') {
                await this.initOvernightSwap();
                return;
            }

            if (tokenSeparationScheme === 'POOL_SWAP') {
                await this.initPoolSwap(listOfBuyTokensAddresses);
                return;
            }

            console.error('TOKEN SEPARATION SCHEME NOT FOUND', tokenSeparationScheme);
        },
        async initPoolSwap(listOfBuyTokensAddresses) {
            if (!listOfBuyTokensAddresses || !listOfBuyTokensAddresses.length) {
                console.error("List of buy token addresses must be included in initialisation POOL_SWAP scheme.")
                return;
            }

            console.log('init pool swap data for network: ', this.networkName);
            let networkId = this.getParams(this.networkName).networkId;
            // this.tokens = await this.getFilteredPoolTokens(networkId, false, listOfBuyTokensAddresses);
            this.tokens = await this.getFilteredPoolTokens(networkId, false, [], true); // [] - none execute
            console.log("TOKENS_ ", this.tokens)
            this.secondTokens = (await this.getFilteredPoolTokens(networkId, true, listOfBuyTokensAddresses, false));
            console.log("SECOND TOKENS_ ", this.secondTokens);
            this.isTokensLoadedAndFiltered = true;

            this.loadPricesInfo(networkId);

            await this.initAccountData(networkId);
        },
        async initOvernightSwap() {
            console.log('init overnight swap data for network: ', this.networkName);
            let networkId = this.getParams(this.networkName).networkId;
            console.log('init overnight swap data for networkId: ', networkId);
            this.tokens = await this.getFilteredOvernightTokens(networkId, false);
            console.log("TOKENS_ ", this.tokens)
            this.secondTokens = await this.getFilteredOvernightTokens(networkId, true);
            console.log("SECOND TOKENS_ ", this.secondTokens);
            this.isTokensLoadedAndFiltered = true;

            this.loadPricesInfo(networkId);

            await this.initAccountData(networkId);

        },
        async initAccountData(networkId) {
            console.log('Load User data')

            if (this && this.account) {
                const ERC20 = await loadJSON('/contracts/ERC20.json');
                console.log("Contracts ERC20 loaded", ERC20);
                this.loadContractsForTokens(ERC20);

                await this.loadBalances();
            }
        },
        loadContractsForTokens(contractFile) {
            console.log("Load contracts for tokens")
            for (let i = 0; i < this.secondTokens.length; i++) {
                let secondtoken = this.secondTokens[i];
                this.tokensContractMap[secondtoken.address] = this._loadContract(contractFile, this.web3, secondtoken.address);
            }

            for (let i = 0; i < this.tokens.length; i++) {
                let token = this.tokens[i];
                this.tokensContractMap[token.address] = this._loadContract(contractFile, this.web3, token.address);
            }

            console.log("Token contracts be loaded.", this.tokensContractMap)
        },
        initUpdateBalancesInterval() {
            setTimeout(() => {
                console.log("Start loading balances for odos swap")
                this.updateBalancesIntervalId = setInterval(async () => {
                    console.log("odos balances update")
                    await this.loadBalances();
                }, 30000)
            }, 30000)

        },

        async updateDirectBalances(addresses) {
            this.isBalancesLoading = true;
            try {
                let tokens = [...this.secondTokens, ...this.tokens];

                // filter unique tokens by address
                tokens = tokens.filter((token, index, self) =>
                    index === self.findIndex((t) => (
                        t.address === token.address
                    ))
                );

                for (let i = 0; i < tokens.length; i++) {
                    let token = tokens[i];
                    if (addresses.includes(token.address)) {
                        console.log("Direct Update balance for token: ", token.address, token.symbol, token.name);
                        await new Promise(resolve => setTimeout(resolve, 500));
                        await this.loadBalance(this.tokensContractMap[token.address], token);
                    }
                }
            } catch (e) {
                console.error("Error when update direct balance", e);
            } finally {
                this.isBalancesLoading = false;
            }
        },

        async loadBalances() {
            if (this.isBalancesLoading) {
                console.log("Balance already in loading status");
                return;
            }

            this.isBalancesLoading = true;
            console.log("Load tokens balances.", this.tokensToBalanceUpdate)
            if (!this.account) {
                console.log("Balance not loaded, wallet not login", this.account);
                this.isBalancesLoading = false;
                return;
            }

           try {
               let tokens = this.tokensToBalanceUpdate;
               for (let i = 0; i < tokens.length; i++) {
                   let token = tokens[i];
                   await this.loadBalance(this.tokensContractMap[token.address], token);
               }
           } catch (e) {
                console.error("Error when load balance", e);
           } finally {
               console.log("Load tokens balances success.")
               this.isBalancesLoading = false;
               if (!this.isFirstBalanceLoaded) {
                   this.isFirstBalanceLoaded = true;
               }
           }
        },
        async loadBalance(contract, token) {
            // console.log("Load balance from contract: ", token)
            try {
                // balance for network currency
                if (token.address === "0x0000000000000000000000000000000000000000") {
                    let ethBalance = await this.web3.eth.getBalance(this.account);
                    let balance = this.web3.utils.fromWei(ethBalance, this.getWeiMarker(token.decimals));
                    token.balanceData = {
                        name: token.symbol,
                        balance: balance,
                        balanceInUsd: balance * token.price,
                        originalBalance: ethBalance,
                        decimal: token.decimals
                    }

                    return;
                }

                // balance for ERC20
                await contract.methods.balanceOf(this.account).call().then(erc20Balance => {
                    // console.log('Balance for: ', token, erc20Balance, this.getWeiMarker(token.decimals));
                    let balance = this.web3.utils.fromWei(erc20Balance, this.getWeiMarker(token.decimals));
                    token.balanceData = {
                        name: token.symbol,
                        balance: balance,
                        balanceInUsd: balance * token.price,
                        originalBalance: erc20Balance,
                        decimal: token.decimals
                    }
                }).catch(e => {
                    // todo 5 return after load balance optimization
                    // tmp ignore
                    // console.error('Error balance for: ', token, e);
                });
            } catch (e) {
                console.log("Error when load balance at token: ", token.address, e)
            }

        },

        async initContractData() {
            if (!this.isAvailableOnNetwork) {
                console.info("Swap init not available on this network for loading contract.", this.networkName)
                return
            }

            let networkId = this.getParams(this.networkName).networkId;
            await this.loadContract(networkId).then(() => {
                console.log("Contracts loaded", this.routerContract, this.executorContract);
            })

        },
        async loadContract(chainId) {
            if (this.isContractLoading) {
                return
            }
            this.isContractLoading = true;
            return odosApiService.loadContractData(chainId).then(data => {
                console.log("Swap form Contract: ", data)
                this.contractData = data
                this.routerContract = this._loadContract(this.contractData.routerAbi, this.web3, this.contractData.routerAddress)
                this.executorContract = this._loadContract(this.contractData.erc20Abi, this.web3, this.contractData.executorAddress)

                console.log("Swap form routerContract: ", this.routerContract)
                console.log("Swap form routerContract: ", this.executorContract)
                this.isContractLoading = false;
            }).catch(e => {
                console.log("Error load contract", e)
                this.isContractLoading = false;
            })
        },
        loadPricesInfo(chainId) {
            if (this.isPricesLoading) {
                return
            }

            this.isPricesLoading = true;
            this.loadPrices(chainId).then(() => {
                let tokens = [...this.secondTokens, ...this.tokens]
                for (let i = 0; i < tokens.length; i++) {
                    let token = tokens[i];
                    token.price = this.tokenPricesMap[token.address];
                    try {
                        token.estimatePerOne = this.web3.utils.fromWei(1+"", this.getWeiMarker(token.decimals))
                    } catch (e) {
                        console.error("token.estimatePerOne error", token.estimatePerOne, e);
                    }
                    // console.log("token.price", token.price);
                }

                console.log("Tokens prices be loaded.")
                this.isPricesLoading = false;
            }).catch(e => {
                console.error("Error when load prices info", e);
                this.isPricesLoading = false;
            })
        },
        async loadPrices(chainId) {
            return odosApiService.loadPrices(chainId).then(data => {
                console.log("Prices: ", data)
                this.tokenPricesMap = data.tokenPrices;
            }).catch(e => {
                console.error("Error load contract", e)
            });
        },
        async getFilteredPoolTokens(chainId, isIncludeInListAddresses, listTokensAddresses, ignoreBaseNetworkCurrency) {
            let tokens = [];
            let tokenMap = this.tokensMap.chainTokenMap[chainId + ''].tokenMap;
            let leftListTokensAddresses = listTokensAddresses;
            let keys = Object.keys(tokenMap);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let item = tokenMap[key];

                const isKeyIncludeList = leftListTokensAddresses.some(
                    address => address.toLowerCase() === key.toLowerCase()
                );

                let isNeedTokenIgnore = false;
                /*if (this.typeOfPoolScheme === 'OVN') {
                    isNeedTokenIgnore = (item.protocolId === 'overnight' && item.symbol === 'OVN');
                }*/

                let isNeedIgnore = (key === "0x0000000000000000000000000000000000000000" || isNeedTokenIgnore);
                // key === token address
                if (ignoreBaseNetworkCurrency && isNeedIgnore) {
                    console.log("Ignore item: ", item);
                    continue;
                }

                // add only included in list
                if (isIncludeInListAddresses && isKeyIncludeList) {
                    await this.addItemToFilteredTokens(tokens, key, item);
                    leftListTokensAddresses = leftListTokensAddresses.filter(address =>
                            address.toLowerCase() !== key.toLowerCase()
                    );
                    console.log('Item of secondtoken: ',  key.toLowerCase(), leftListTokensAddresses.length, item)
                    continue;
                }

                // add only non-list
                if (!isIncludeInListAddresses && !isKeyIncludeList) {
                    await this.addItemToFilteredTokens(tokens, key, item);
                }
            }

            // order tokens like as list addresses.
            if (isIncludeInListAddresses) {
                if (listTokensAddresses.length === tokens.length) {
                    tokens = tokens.sort((a, b) => {
                        const indexA = listTokensAddresses.findIndex(item => item.toLowerCase() === a.address.toLowerCase());
                        const indexB = listTokensAddresses.findIndex(item => item.toLowerCase() === b.address.toLowerCase());
                        return indexA - indexB;
                    });
                } else {
                    console.error("Error when order token by list of addresses.", listTokensAddresses, tokens);
                }
            }

            return tokens;
        },
        async getFilteredOvernightTokens(chainId, isOnlyOvnToken) {
            let tokens = [];
            let tokenMap = this.tokensMap.chainTokenMap[chainId + ''].tokenMap;
            let keys = Object.keys(tokenMap);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let item = tokenMap[key];

                // add only overnight
                if (isOnlyOvnToken && item.protocolId === 'overnight' || item.symbol === 'USD+' || item.symbol === 'DAI+' || item.symbol === 'USDT+') {
                    await this.addItemToFilteredTokens(tokens, key, item);
                    continue;
                }

                // add only overnight
                if (!isOnlyOvnToken) {
                    await this.addItemToFilteredTokens(tokens, key, item);
                    continue;
                }
            }

            return tokens;
        },
        async addItemToFilteredTokens(tokens, key, item) {
            let logoUrl;
            if (item.protocolId === 'overnight' || item.symbol === 'USD+' || item.symbol === 'DAI+' || item.symbol === 'USDT+' || item.symbol === 'OVN') {
                if (item.symbol === 'OVN') {
                    logoUrl = this.loadTokenImage(item);
                } else {
                    logoUrl = await this.loadOvernightTokenImage(item);
                }
            } else {
                logoUrl = this.loadTokenImage(item);
            }

            tokens.push({
                id: item.assetId + key,
                address: key,
                decimals: item.decimals,
                assetType: item.assetType,
                name: item.name,
                symbol: item.symbol,
                logoUrl: logoUrl,
                weiMarker: this.getWeiMarker(item.decimals),
                selected: false,
                balanceData: {},
                approveData: {
                    allowanceValue: 0,
                    approved: false
                },
                price: 0,
                estimatePerOne: 0,
            });
        },

        clearInputData() {
            this.tokens = [];
            this.secondTokens = [];
        },

        assembleRequest(requestData) {
            return odosApiService.assembleRequest(requestData).then((data) => {
                console.log("Response data for odos assemble request: ", data)
                return data;
            }).catch(e => {
                console.log("Assemble request error: ", e)
            })
        },
        swapRequest(requestData) {
            return odosApiService.quoteRequest(requestData)
                .then((data) => {
                    console.log("Response data for odos swap request: ", data)
                    this.swapResponseInfo = data;
                    return data;
                }).catch(e => {
                    console.log("Swap request error: ", e)
                    this.closeWaitingModal();
                    if (e && e.message && e.message.includes('path')) {
                        this.showErrorModalWithMsg({errorType: 'odos-path', errorMsg: e}, );
                        return;
                    }

                    this.showErrorModalWithMsg({errorType: 'odos', errorMsg: e}, );
                })
        },
        oldSwapRequest(requestData) {
             return odosApiService.swapRequest(requestData)
                 .then((data) => {
                     console.log("Response data for odos swap request: ", data)
                     this.swapResponseInfo = data;
                    return data;
                 }).catch(e => {
                     console.log("Swap request error: ", e)
                     this.closeWaitingModal();
                     this.showErrorModalWithMsg({errorType: 'odos', errorMsg: e}, );
                 })
        },

        getTokenByAddress(address) {
            let tokens = [...this.secondTokens, ...this.tokens]
            for (let i = 0; i < tokens.length; i++) {
                let token = tokens[i];
                console.log("Find tokens: ",token)
                if (token.address === address) {
                    return token;
                }
            }

            return null;
        },

        quoteRequest(requestData) {
            return odosApiService.quoteRequest(requestData)
                .then((data) => {
                    console.log("Response data for odos quota request: ", data)
                    this.quotaResponseInfo = data;
                    // { "inTokens": [ "0x0000000000000000000000000000000000000000", "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a" ], "outTokens": [ "0xe80772eaf6e2e18b651f160bc9158b2a5cafca65", "0xeb8e93a0c7504bffd8a8ffa56cd754c63aaebfe8" ], "inAmounts": [ "1000000000000000000", "1000000000000000000" ], "outAmounts": [ "748864357", "1091926251518831755264" ], "gasEstimate": 613284, "dataGasEstimate": 0, "gweiPerGas": 1000000, "gasEstimateValue": 1129317.6351027626, "inValues": [ 1841.4255542063122, 1.0001535800151131 ], "outValues": [ 748.6976540455693, 1091.9074095761437 ], "netOutValue": -1127477.030039141, "priceImpact": -0.0008666645762853047, "percentDiff": -0.09881777902469935, "pathId": "a5fc8568c59f7cf8cc8df9194d66b4f6", "pathViz": null, "blockNumber": 89177560 }
                    // this.initWalletTransaction(this.swapResponseInfo);
                    return data;
                }).catch(e => {
                    console.log("Quota request error: ", e);
                })
        },
        startSwapConfirmTimer() {
            this.swapResponseConfirmInfo.duration = ODOS_DURATION_CONFIRM_REQUEST;
            this.swapResponseConfirmInfo.waitingConformation = true;
            this.swapResponseConfirmInfo.counterId = setInterval(() => {
                this.swapResponseConfirmInfo.duration--;
                if (this.swapResponseConfirmInfo.duration <= 0) {
                    this.stopSwapConfirmTimer();
                }
            }, 1000);
        },
        stopSwapConfirmTimer() {
            this.swapResponseConfirmInfo.waitingConformation = false;
            clearInterval(this.swapResponseConfirmInfo.counterId);
            this.closeWaitingModal();
        },
        async addedZkSyncGasHistoryData(transactionData) {
            this.zksyncFeeHistory = {
                startWeiBalance: null,
                finalWeiBalance: null,
                estimateFeeInEther: null,
                ethPrice: 1884.00,
            }

            try {
                // get balance from eth token
                console.log("OdosSwap this.account: ", this.account)
                let weiBalance = await this.web3.eth.getBalance(this.account);
                let balance = this.web3.utils.fromWei(weiBalance);
                console.log("OdosSwap Balance from eth token", balance, balance * 1854.91);

                // 'gasPrice', 'gasPriceGwei', 'gasPriceStation'
                console.log("OdosSwap Get gasPrice ", this.gasPrice, this.gasPrice * 1854.91)
                this.zksyncFeeHistory.startWeiBalance = balance;

            } catch (e) {
                console.error("OdosSwap Error get balance from eth token", e);
            }


            await this.web3.eth.estimateGas(transactionData, (error, gasLimit) => {
                if (error) {
                    console.error('OdosSwap Error estimating gas:', error);
                } else {
                    console.log('OdosSwap estimating gasLimit:', gasLimit);
                    this.web3.eth.getGasPrice().then(gasPrice => {
                        console.log('OdosSwap estimating gasPrice:', gasPrice);
                        let feeInWei = gasLimit * '262500000';
                        console.log('OdosSwap estimating feeInWei:', feeInWei);
                        let feeInEther = this.web3.utils.fromWei(feeInWei.toString(), 'ether');
                        console.log('OdosSwap Estimated transaction fee in Ether:', feeInEther, feeInEther * 1854.91);
                        this.zksyncFeeHistory.estimateFeeInEther = feeInEther;
                    })
                }
            });
        },
        async initWalletTransaction(txData, selectedInputTokens, selectedOutputTokens) {
            console.debug(this.getOdosLogMsg({message: "Odos init transaction data", swapSession: this.swapSessionId, data: txData}));

            if (!this.routerContract || !this.executorContract) {
                console.error(this.getOdosLogMsg({message: "Init wallet transactions failed, odos contracts not found. txData: ", swapSession: this.swapSessionId, data: txData}));
                return;
            }

            this.startSwapConfirmTimer();

            let transactionData = {
                ...txData.transaction,
                from: this.account
            }

            if (this.networkName === 'zksync') {
                await this.addedZkSyncGasHistoryData(transactionData);
            }

            this.showWaitingModal('Swapping in process');

            let txLogMessage = this.getOdosLogMsg({message: "Odos send transaction", swapSession: this.swapSessionId, data: transactionData});
            txLogMessage += " | Current block: " + await this.web3.eth.getBlockNumber();
            console.debug(txLogMessage);
            const result = this.web3.eth.sendTransaction(transactionData)
                .then(async data => {
                    console.log("Call result: ", data);

                    console.debug(this.getOdosLogMsg({message: "Odos response from transaction", swapSession: this.swapSessionId, data: data}));
                    this.closeWaitingModal();

                    if (this.networkName === 'zksync' && this.zksyncFeeHistory) {
                        try {
                            // get balance from eth token
                            console.log("this.account after tx: ", this.account)
                            let weiBalance = await this.web3.eth.getBalance(this.account);
                            let balance = this.web3.utils.fromWei(weiBalance);
                            console.log("Balance from eth token after tx", balance, balance * 1854.91);
                            this.zksyncFeeHistory.finalWeiBalance = balance;
                        } catch (e) {
                            console.error(this.getOdosLogMsg({message: "Error get balance from eth token  after tx", swapSession: this.swapSessionId, data: e}));
                        }
                    }


                    const inputTokens = [...selectedInputTokens]
                    const outputTokens = [...selectedOutputTokens]
                    let addressesToUpdate = [...inputTokens, ...outputTokens].map(item => item.selectedToken.address);

                    this.showSuccessModal(true, inputTokens, outputTokens, data.transactionHash, txData);
                    // event
                    this.$bus.$emit('odos-transaction-finished', true);
                    this.stopSwapConfirmTimer();

                    console.log("addresses to balance update: ", addressesToUpdate);
                    setTimeout(() => {
                        this.updateDirectBalances(addressesToUpdate);
                    }, 2000)
                }).catch(e => {
                    this.handleTransactionError(e);
                    this.stopSwapConfirmTimer();
                });
        },

        getDefaultSecondtoken(symbol) {
            if (this.tokenSeparationScheme === 'OVERNIGHT_SWAP') {
                return this.innerGetDefaultSecondtokenBySymobl(symbol ? symbol : SECONDTOKEN_DEFAULT_SYMBOL)
            }

            if (this.tokenSeparationScheme === 'POOL_SWAP') {
                return this.innerGetDefaultSecondtokenByIndex(0);
            }

            console.error('TOKEN SEPARATION SCHEME NOT FOUND FOR GET DEFAULT', this.tokenSeparationScheme);
        },
        getSecondDefaultSecondtoken() {
            if (this.tokenSeparationScheme === 'OVERNIGHT_SWAP') {
                return this.innerGetDefaultSecondtokenBySymobl(SECONDTOKEN_SECOND_DEFAULT_SYMBOL)
            }

            if (this.tokenSeparationScheme === 'POOL_SWAP') {
                return this.innerGetDefaultSecondtokenByIndex(1);
            }

            console.error('TOKEN SEPARATION SCHEME NOT FOUND FOR GET SECOND DEFAULT', this.tokenSeparationScheme);
        },
        innerGetDefaultSecondtokenByIndex(index) {
            if (!this.secondTokens.length || this.secondTokens.length < index + 1) {
                console.log("Inner get default token by index fail, secondTokens is empty or index not exist", this.secondTokens);
                return null;
            }

            return this.secondTokens[index];
        },
        innerGetDefaultSecondtokenBySymobl(symbolName) {
            if (!this.secondTokens.length) {
              console.log("Inner get default token by symbol fail, secondTokens is empty.", this.secondTokens);
              return null;
            }

            for (let i = 0; i < this.secondTokens.length; i++) {
                let token = this.secondTokens[i];
                if (token.symbol === symbolName) {
                    return token;
                }
            }

            // return first if usd+ not found
            console.log('return first if usd+ not found')
            return this.secondTokens[0];
        },

        async getActualGasPrice(networkId) {
            let actualGasPriceObject = await odosApiService.getActualGasPrice(networkId);
            console.debug(this.getOdosLogMsg({
                message: "Actual price for gas.",
                swapSession: this.swapSessionId,
                data: actualGasPriceObject
            }))

            if (this.networkName === 'polygon' && actualGasPriceObject.prices && actualGasPriceObject.prices.length) {
                return actualGasPriceObject.prices[0].fee;
            }

            let actualGas = actualGasPriceObject.baseFee;
            if (!actualGas && actualGasPriceObject.prices && actualGasPriceObject.prices.length) {
                console.error(this.getOdosLogMsg({
                    message: "Actual price for gas when not found base fee.",
                    swapSession: this.swapSessionId,
                    data: actualGasPriceObject
                }))
                return actualGasPriceObject.prices[0].fee;
            }

            return actualGas;
        },
        _loadContract(file, web3, address) {
            if (!address) {
                address = file.address;
            }

            return new web3.eth.Contract(file.abi, address);
        },

        showSuccessModal(isShow,
                         inputTokens,
                         outputTokens,
                         hash,
                         txData) {
            this.successData = {
                inputTokens: inputTokens,
                outputTokens: outputTokens,
                hash: hash,
                chain: this.networkId,
                zksyncFeeHistory: this.zksyncFeeHistory,
                txData: txData
            }

            this.isShowSuccessModal = isShow;

            if (!isShow) {
                this.zksyncFeeHistory = null;
                this.successData = null;
            }
        },


        showSuccessPoolModal(isShow,
                         inputTokens,
                         outputTokens,
                         hash,
                         putIntoPoolEvent,
                         returnedToUserEvent,
                         pool) {
            this.successData = {
                inputTokens: inputTokens,
                outputTokens: outputTokens,
                hash: hash,
                chain: this.networkId,
                putIntoPoolEvent: putIntoPoolEvent,
                returnedToUserEvent: returnedToUserEvent,
                pool: pool
            }

            this.isShowSuccessPoolModal = isShow;

        },

        getNewInputToken() {
            let randomId = (Math.random() + 1).toString(36).substring(2);
            return {
                id: randomId,
                value: null,
                usdValue: null,
                contractValue: null,
                selectedToken: null
            }
        },
        getNewOutputToken() {
            let randomId = (Math.random() + 1).toString(36).substring(2);
            return {
                id: randomId,
                value: 0,
                sum: 0,
                locked: false,
                selectedToken: null
            }
        },

        maxAll() {
            console.log("Max all");
            for (let i = 0; i < this.selectedInputTokens.length; i++) {
                let token = this.selectedInputTokens[i];
                console.log(token.selectedToken.balanceData.balance);
                this.updateTokenValue(token, token.selectedToken.balanceData.balance);
            }
        },

        updateTokenValue(token, value) {
            console.log('updateTokenValue: ', token, value)
            token.value = value;
            this.updateQuotaInfo();

            if (!value) {
                token.usdValue = 0
                token.value = 0
                return
            }

            let selectedToken = token.selectedToken;
            if (selectedToken) {
                let sum = token.decimals === 6 ? token.value * 100 + '' : token.value + '';
                token.contractValue = this.web3.utils.toWei(sum, token.selectedToken.weiMarker);
                token.usdValue = token.value * selectedToken.price;
                console.log("updateTokenValue price: ", token, value, token.contractValue, selectedToken);
                console.log("updateTokenValue price: ", token.usdValue);

                console.log('updateTokenValue with selected token: ', token, value, token.contractValue);

                if (selectedToken.address === '0x0000000000000000000000000000000000000000') {
                    console.log("Check approve in update value not available. its a root token: ", token);
                    selectedToken.approveData.approved = true
                    return;
                }

                this.checkApproveForToken(token, token.contractValue);
            }
        },

        handleTransactionError(e) {
            console.log("Handle Swap odos send transaction error", e);
            if (!e) {
                console.error(this.getOdosLogMsg({message: "Swap odos send transaction error", swapSession: this.swapSessionId, data: "Error is empty"}));
                this.closeWaitingModal();
                this.showErrorModalWithMsg({errorType: 'swap', errorMsg: "Error is empty"});
                return
            }

            if (this.isUserRejectTx(e)) {
                this.stopSwapConfirmTimer();
                this.closeWaitingModal();
                console.debug(this.getOdosLogMsg({message: "User rejected the request", swapSession: this.swapSessionId, data: e}));
                return;
            }

            if (this.isNetworkHighLoad(e)) {
                console.debug(this.getOdosLogMsg({message: "Swap odos send highload network", swapSession: this.swapSessionId, data: e}));
                this.closeWaitingModal();
                this.showErrorModalWithMsg({errorType: 'highload-network', errorMsg: e});
                return;
            }

            console.error(this.getOdosLogMsg({message: "Swap odos send transaction error", swapSession: this.swapSessionId, data: e}));
            this.closeWaitingModal();
            this.showErrorModalWithMsg({errorType: 'swap', errorMsg: e});
        },
        isNetworkHighLoad(e) {
            return e.message && e.message.toLowerCase().includes('transaction was within 50 blocks');
        },
        isUserRejectTx(e) {
            return e.code === 4001 && e.message && (e.message.toLowerCase().includes('user rejected') || e.message.toLowerCase().includes('user denied'));
        },

    }
}

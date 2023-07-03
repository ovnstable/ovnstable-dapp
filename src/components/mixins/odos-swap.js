import {odosApiService} from "@/services/external/odos-api-service";
import loadJSON from "@/utils/http-utils";
import {mapActions, mapGetters} from "vuex";
import {tokenLogo} from "@/components/mixins/token-logo";

const ODOS_DURATION_CONFIRM_REQUEST = 60
const SECONDTOKEN_DEFAULT_SYMBOL= 'USD+';
const SECONDTOKEN_SECOND_DEFAULT_SYMBOL= 'DAI+';

export const odosSwap = {
    mixins: [tokenLogo],
    data() {
        return {
            isChainsLoading: false,
            isPricesLoading: false,
            isBalancesLoading: false,
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

            availableNetworksList: ['polygon', 'bsc', 'optimism', 'arbitrum'],
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

            tokenSeparationScheme: null, // OVERNIGHT_SWAP, POOL_SWAP,
            listOfBuyTokensAddresses: null // for POOL_SWAP scheme
        }
    },
    async mounted() {
       console.log("Odos swap init by scheme: ", this.tokenSeparationScheme)

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
                console.log("set network for odos: ", newVal, this.tokenSeparationScheme, this.listOfBuyTokensAddresses)
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

                this.loadBalances();
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
                this.updateBalancesIntervalId = setInterval(() => {
                    console.log("odos balances update")
                    this.loadBalances();
                }, 40000)
            }, 40000)

        },

        loadBalances() {
            if (this.isBalancesLoading) {
                console.log("Balance already in loading status");
                return;
            }

            this.isBalancesLoading = true;
            console.log("Load tokens balances.", this.secondTokens, this.tokens)
            if (!this.account) {
                console.log("Balance not loaded, wallet not login", this.account);
                this.isBalancesLoading = false;
                return;
            }

            let tokens = [...this.secondTokens, ...this.tokens]
            for (let i = 0; i < tokens.length; i++) {
                let token = tokens[i];
                this.loadBalance(this.tokensContractMap[token.address], token)
                    .then(() => {
                        this.isBalancesLoading = false;
                    }).catch(() => {
                        this.isBalancesLoading = false;
                    });
            }
        },
        async loadBalance(contract, token) {
            // console.log("Load balance from contract: ", token)
            try {
                // balance for network currency
                if (token.address === "0x0000000000000000000000000000000000000000") {
                    let ethBalance = await this.web3.eth.getBalance(this.account)
                    token.balanceData = {
                        name: token.symbol,
                        balance: this.web3.utils.fromWei(ethBalance, this.getWeiMarker(token.decimals)),
                        originalBalance: ethBalance,
                        decimal: token.decimals
                    }

                    return;
                }

                // balance for ERC20
                contract.methods.balanceOf(this.account).call().then(erc20Balance => {
                    // console.log('Balance for: ', token, erc20Balance, this.getWeiMarker(token.decimals));
                    token.balanceData = {
                        name: token.symbol,
                        balance: this.web3.utils.fromWei(erc20Balance, this.getWeiMarker(token.decimals)),
                        originalBalance: erc20Balance,
                        decimal: token.decimals
                    }

                    // console.log("Balance data: ", token.balanceData);
                }).catch(e => {
                    // todo 5 return after load balance optimization
                    // console.error('Error balance for: ', token, e);
                });
                // originAsset = asset;
                // asset = asset ? web3.web3.utils.fromWei(asset, assetDecimals === 18 ? 'ether' : 'mwei') : null;
            } catch (e) {
                // asset = getters.balance.asset;
                // originAsset = getters.originalBalance.asset;
                console.log("Error when load balance at token: ", token.address, e)
            }

        },

        async initContractData() {
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

            console.log("Tokens prices loading start.", this.tokenPricesMap)
            this.isPricesLoading = true;
            this.loadPrices(chainId).then(() => {
                let tokens = [...this.secondTokens, ...this.tokens]
                for (let i = 0; i < tokens.length; i++) {
                    let token = tokens[i];
                    token.price = this.tokenPricesMap[token.address];
                    try {
                        token.estimatePerOne = this.web3.utils.fromWei(1+"", this.getWeiMarker(token.decimals))
                    } catch (e) {
                        console.log("token.estimatePerOne error", token.estimatePerOne, e);
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
                console.log("Error load contract", e)
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

                // key === token address
                if (ignoreBaseNetworkCurrency && key === "0x0000000000000000000000000000000000000000") {
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
                if (isOnlyOvnToken && item.protocolId === 'overnight') {
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
            if (item.protocolId === 'overnight') {
                logoUrl = await this.loadOvernightTokenImage(item);
            } else {
                logoUrl = this.loadTokenImage(item);
            }

            tokens.push({
                id: item.assetId + key,
                address: key,
                decimals: item.decimals,
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


        swapRequest(requestData) {
            return odosApiService.swapRequest(requestData)
                .then((data) => {
                    console.log("Response data for odos swap request: ", data)
                    this.swapResponseInfo = data;
                   return data;
                }).catch(e => {
                    console.log("Swap request error: ", e)
                    this.closeWaitingModal();
                    this.showErrorModalWithMsg({errorType: 'swap', errorMsg: e}, );
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
        initWalletTransaction(txData, selectedInputTokens, selectedOutputTokens) {
            console.log("Odos transaction data", txData, this.routerContract, this.executorContract);

            if (!this.routerContract || !this.executorContract) {
                console.error("Init wallet transactions failed, odos contracts not found. txData: ", txData)
                return;
            }

            this.startSwapConfirmTimer();

            // this.routerContract.methods.swa(txData.data).send({
            //     to: txData.to,
            //     gas: txData.gas,
            //     gasPrice: txData.gasPrice,
            //     nonce: txData.nonce,
            // }, function(error, transactionHash) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log(transactionHash);
            //     }
            // });
            // {
            //     "inTokens": [
            //     "0x0000000000000000000000000000000000000000",
            //     "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a"
            // ],
            //     "outTokens": [
            //     "0xeb8e93a0c7504bffd8a8ffa56cd754c63aaebfe8",
            //     "0xb86fb1047a955c0186c77ff6263819b37b32440d"
            // ],
            //     "inAmounts": [
            //     "1000000000000000000",
            //     "1000000000000000000"
            // ],
            //     "outAmounts": [
            //     "868854660994279538688",
            //     "940862774"
            // ],
            //     "gasEstimate": 979112,
            //     "dataGasEstimate": 0,
            //     "gweiPerGas": 1000000,
            //     "gasEstimateValue": 1802324.3488295842,
            //     "inValues": [
            //     1840.773482115335,
            //     1.000072979038449
            // ],
            //     "outValues": [
            //     868.8546327431228,
            //     971.935412755341
            // ],
            //     "netOutValue": -1800483.5587840858,
            //     "priceImpact": -0.0009847657784032592,
            //     "percentDiff": -0.05340013668831034,
            //     "pathId": "b96a780d08a387f966d7e55c3c8cc729",
            //     "pathViz": null,
            //     "blockNumber": 89181266
            // }


            this.showWaitingModal('Swapping in process');
            const result = this.web3.eth.sendTransaction(
                {
                    ...txData.transaction,
                    from: this.account}
            ).then(data => {
                console.log("Call result: ", data);
                this.closeWaitingModal();

                const inputTokens = [...selectedInputTokens]
                const outputTokens = [...selectedOutputTokens]
                this.showSuccessModal(true, inputTokens, outputTokens, data.transactionHash);

                // event
                this.$bus.$emit('odos-transaction-finished', true);

                this.loadBalances();
            }).catch(e => {
                console.log("Swap odos call error: ", e);
                if (e && e.code === 4001) {
                    if (e.message === 'User rejected the request.') {
                        this.stopSwapConfirmTimer();
                    }
                }
                this.closeWaitingModal();
                this.showErrorModalWithMsg({errorType: 'swap', errorMsg: e}, );
            })


            // this.routerContract.methods.router(txData).on('transactionHash', function (hash) {
            //     console.log("Router contract response: ", hash);
            // });

            // this.routerContract.call({value: 0})(txData.data);

            // this.routerContract.eth.sendTransaction({from: …, to: …, data: TransactionData, …}).on(…);
            // web3.eth.call({from: …, to: …, data: TransactionData, …}).on(…);

        },
        getDefaultSecondtoken() {
            if (this.tokenSeparationScheme === 'OVERNIGHT_SWAP') {
                return this.innerGetDefaultSecondtokenBySymobl(SECONDTOKEN_DEFAULT_SYMBOL)
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

        getActualGasPrice(networkId) {
            return odosApiService.getActualGasPrice(networkId);
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
                         hash) {
            this.successData = {
                inputTokens: inputTokens,
                outputTokens: outputTokens,
                hash: hash,
                chain: this.networkId,
            }

            this.isShowSuccessModal = isShow;
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

    }
}

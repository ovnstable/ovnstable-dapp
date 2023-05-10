import {odosApiService} from "@/services/external/odos-api-service";
import loadJSON from "@/utils/http-utils";
import {mapGetters} from "vuex";

export const odosSwap = {
    data() {
        return {
            isChainsLoading: false,
            isTokensLoading: false,
            isPricesLoading: false,
            isBalancesLoading: false,
            isTokenExternalDataLoading: false,

            chains: null,
            tokensMap: null,

            ovnTokens: [],
            tokens: [],

            // contractData: null,
            // routerContract: null,
            // executorContract: null,
            tokensContractMap: {}, // { 'contractAddress': {ABI} }
            tokenPricesMap: {},

            availableNetworksList: ['polygon', 'bsc', 'optimism', 'arbitrum'],
            dataBeInited: false
        }
    },
    async mounted() {
        console.log("Odos swap init")
    },
    computed: {
        ...mapGetters('web3', ['web3', 'getWeiMarker']),
        ...mapGetters('network', ['getParams']),
        ...mapGetters('accountData', ['account']),

        isAllDataLoaded() {
            return !this.isChainsLoading && !this.isTokensLoading;
        },

    },
    watch: {
        isAllDataLoaded: async function (newVal, oldValue) {
            console.log("newVal", newVal)
            if (newVal && !this.dataBeInited) {
                await this.initData();
                this.dataBeInited = true
            }
        },

        account: function (newVal, oldVal) {
            if (newVal) {
                this.initAccountData();
            }
        }
    },
    methods: {

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
            odosApiService.loadTokens().then(data => {
                console.log("Tokens: ", data)
                this.tokensMap = data
                this.isTokensLoading = false;
            }).catch(e => {
                console.log("Error load tokens", e)
                this.isTokensLoading = false;
            })
        },


        async initData() {
            console.log('initData');
            if (this.availableNetworksList.includes(this.networkName)) {
                console.log('initData1');
                let networkId = this.getParams(this.networkName).networkId;
                console.log('initData2');
                this.tokens = await this.getFilteredTokens(networkId, false);
                console.log('initData3');
                console.log("TOKENS_ ", this.tokens)
                this.ovnTokens = await this.getFilteredTokens(networkId, true);
                console.log("OVN TOKENS_ ", this.ovnTokens);

                this.loadPricesInfo(networkId);

                await this.initAccountData(networkId);
            } else {
                this.clearInputData();
            }
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
            for (let i = 0; i < this.ovnTokens.length; i++) {
                let ovnToken = this.ovnTokens[i];
                this.tokensContractMap[ovnToken.address] = this._loadContract(contractFile, this.web3, ovnToken.address);
            }

            for (let i = 0; i < this.tokens.length; i++) {
                let token = this.tokens[i];
                this.tokensContractMap[token.address] = this._loadContract(contractFile, this.web3, token.address);
            }

            console.log("Token contracts be loaded.", this.tokensContractMap)
        },
        loadBalances() {
            if (this.isBalancesLoading) {
                console.log("Balance already in loading status");
                return;
            }

            this.isBalancesLoading = true;
            console.log("Load tokens balances.", this.ovnTokens, this.tokens)
            if (!this.account) {
                console.log("Balance not loaded, wallet not login", this.account);
                this.isBalancesLoading = false;
                return;
            }

            let tokens = [...this.ovnTokens, ...this.tokens]
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
                    console.error('Error balance for: ', token, e);
                });
                // originAsset = asset;
                // asset = asset ? web3.web3.utils.fromWei(asset, assetDecimals === 18 ? 'ether' : 'mwei') : null;
            } catch (e) {
                // asset = getters.balance.asset;
                // originAsset = getters.originalBalance.asset;
                console.log("Error when load balance at token: ", token.address, e)
            }

        },
        // async loadContract(chainId) {
        //     if (this.isContractLoading) {
        //         return
        //     }
        //     this.isContractLoading = true;
        //     return odosApiService.loadContractData(chainId).then(data => {
        //         console.log("Contract: ", data)
        //         this.contractData = data
        //         this.routerContract = this._loadContract(this.contractData.routerAbi, this.web3, this.contractData.routerAddress)
        //         this.executorContract = this._loadContract(this.contractData.erc20Abi, this.web3, this.contractData.executorAddress)
        //
        //         this.isContractLoading = false;
        //     }).catch(e => {
        //         console.log("Error load contract", e)
        //         this.isContractLoading = false;
        //     })
        // },
        loadPricesInfo(chainId) {
            if (this.isPricesLoading) {
                return
            }

            console.log("Tokens prices loading start.", this.tokenPricesMap)
            this.isPricesLoading = true;
            this.loadPrices(chainId).then(() => {
                let tokens = [...this.ovnTokens, ...this.tokens]
                for (let i = 0; i < tokens.length; i++) {
                    let token = tokens[i];
                    token.price = this.tokenPricesMap[token.address];
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
        async getFilteredTokens(chainId, isOvnToken) {
            let tokens = [];
            let tokenMap = this.tokensMap.chainTokenMap[chainId + ''].tokenMap;
            let keys = Object.keys(tokenMap);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let item = tokenMap[key];

                if (isOvnToken) {
                    if (item.protocolId === 'overnight') {
                        let logoUrl = await this.loadOvernightTokenImage(item);

                        tokens.push({
                            id: item.assetId + key,
                            address: key,
                            decimals: item.decimals,
                            name: item.name,
                            symbol: item.symbol,
                            logoUrl: logoUrl,
                            selected: false,
                            balanceData: {},
                            price: 0
                        });
                    }
                    continue;
                }

                if (item.protocolId !== 'overnight') {
                    tokens.push({
                        id: item.assetId + key,
                        address: key,
                        decimals: item.decimals,
                        name: item.name,
                        symbol: item.symbol,
                        logoUrl: 'https://assets.odos.xyz/tokens/' + item.symbol + '.webp',
                        selected: false,
                        balanceData: {},
                        price: 0
                    });
                }
            }

            return tokens;
        },

        async loadOvernightTokenImage(token) {
           try {
               let tokenUrl = await this.loadCoingeckoOvernightTokenImage(token.symbol);
               if (tokenUrl) {
                   return tokenUrl;
               }

               return '/assets/currencies/stablecoins/' + token.symbol + '.png';
           } catch (e) {
               console.error("load Overnight Token Image failed ", e)
               return '/assets/currencies/stablecoins/' + token.symbol + '.png';
           }
        },
        async loadCoingeckoOvernightTokenImage(symbol) {
            // example
            // https://api.coingecko.com/api/v3/coins/overnight-dai?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false

            let coinGeckoUrl = 'https://api.coingecko.com/api'
            let coinGeckoApiVersion = 'v3'
            let coinGeckoApiMethod = 'coins'
            let coinGeckoApiParams = 'localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false'

            let symbolInfo = 'overnight-' + symbol.replace("+", "").toLowerCase();
            let url = `${coinGeckoUrl}/${coinGeckoApiVersion}/${coinGeckoApiMethod}/${symbolInfo}?${coinGeckoApiParams}`;
            let coinInfo = await loadJSON(url);
            if (coinInfo.error) {
                console.log("Coingecko image not found", coinInfo)
                return null;
            }

            console.log('Coingeko info: ', coinInfo)
            return coinInfo.image.large
        },

        clearInputData() {
            this.tokens = [];
            this.ovnTokens = [];
        },

        _loadContract(file, web3, address) {
            if (!address) {
                address = file.address;
            }

            return new web3.eth.Contract(file.abi, address);
        },

    }
}

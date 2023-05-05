
import { odosApiService } from "@/services/external/odos-api-service";

export const odosSwap = {
    data() {
        return {
            isChainsLoading: false,
            isTokensLoading: false,
            isContractLoading: false,
            isTokenExternalDataLoading: false,

            chains: null,
            tokensMap: null,
            swapResponseInfo: null,

            contractData: null,
            routerContract: null,
            executorContract: null
        }
    },
    async mounted() {
        console.log("Odos swap init")
        // this.loadChains();
        // this.loadTokens();

        // todo: set chain to networkId after test
        // this.loadContract(1);
    },
    computed: {
        isAllDataLoaded: function() {
            return !(this.isChainsLoading && this.isTokensLoading && this.isTokenExternalDataLoading)
        },

    },
    methods: {

        swapRequest(requestData) {
            odosApiService.swapRequest(requestData)
                .then((data) => {
                    console.log("Request data: ", data)
                    this.swapResponseInfo = data;

                }).catch(e => {
                    console.log("Swap request error: ", e)
                })
        },
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

        async loadContract(chainId) {
            if (this.isContractLoading) {
                return
            }
            this.isContractLoading = true;
            return odosApiService.loadContractData(chainId).then(data => {
                console.log("Contract: ", data)
                this.contractData = data
                this.routerContract = this._loadContract(this.contractData.routerAbi, this.web3, this.contractData.routerAddress)
                this.executorContract = this._loadContract(this.contractData.erc20Abi, this.web3, this.contractData.executorAddress)

                this.isContractLoading = false;
            }).catch(e => {
                console.log("Error load contract", e)
                this.isContractLoading = false;
            })
        },

    }
}

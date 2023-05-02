
import { odosApiService } from "@/services/external/odos-api-service";
import {axios} from "@/plugins/http-axios";

export const odosSwap = {
    data() {
        return {
            isChainsLoading: false,
            isTokensLoading: false,
            isTokenExternalDataLoading: false,

            chains: null
        }
    },
    mounted() {
        console.log("Odos swap init")
        this.loadChains();
    },
    computed: {
        isAllDataLoaded: function() {
            return !(this.isChainsLoading && this.isTokensLoading && this.isTokenExternalDataLoading)
        },

    },
    methods: {
        async loadChains() {
            if (this.isChainsLoading) {
                return
            }


            // axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

            axios.get('https://api.odos.xyz/info/chains', {
                // mode: 'no-cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            })
                .then(response => console.log("Loaded odos data", response.data))
                .catch(error => console.error(error));

            this.isChainsLoading = true;
            // odosApiService.loadChains().then(data => {
            //     console.log("Chains: ", data)
            //     this.chains = data.chains
            //     this.isChainsLoading = false;
            // }).catch(e => {
            //     console.log("Error load chains", e)
            //     this.isChainsLoading = false;
            // })
        }

    }
}

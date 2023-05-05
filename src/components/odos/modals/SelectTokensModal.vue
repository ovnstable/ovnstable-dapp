<template>
    <div>
        <div v-if="isShow">
            <v-dialog
                    v-model="isShow"
                    width="600"
                    persistent>
                <v-card class="container_body airdrop-body"
                        style="border-radius: 28px!important;">
                    <v-toolbar class="container_header" flat>
                        <label v-if="selectTokenType === 'OVERNIGHT'" class="title-container">
                            Select Overnight token
                        </label>
                        <label v-else class="title-container">
                            Select token
                        </label>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="closeFunc(false)" class="mt-4">
                            <v-icon class="close-icon">mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-card-text>
                        <div class="tokens-container">
                            <div v-if="!isAllDataLoaded" class="pt-7 pb-7 cards-list-container">
                                <div class="row">
                                    <v-row align="center" justify="center">
                                        <v-progress-circular
                                                width="2"
                                                size="24"
                                                color="#8FA2B7"
                                                indeterminate
                                        ></v-progress-circular>
                                    </v-row>
                                </div>
                            </div>

                            <div v-else>
                                <div v-if="selectTokenType === 'OVERNIGHT'">
                                    <SelectTokenShort
                                            :tokens="ovnTokens"
                                            :select-token-func="selectToken"
                                            :remove-token-func="removeToken"
                                    />
                                </div>
                                <div v-else-if="selectTokenType === 'ALL'">
                                    <SelectTokenWithSearch
                                            :tokens="tokens"
                                            :select-token-func="selectToken"
                                            :remove-token-func="removeToken"/>
                                </div>
                                <div v-else>
                                    select token component not found by type: {{selectTokenType}}
                                </div>
                            </div>
                        </div>

                    </v-card-text>
                </v-card>
            </v-dialog>

            <resize-observer @notify="$forceUpdate()"/>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {odosSwap} from "@/components/mixins/odos-swap";
import {mapGetters} from "vuex";
import SelectTokenShort from "@/components/odos/SelectTokenShort.vue";
import loadJSON from "@/utils/http-utils";
import SelectTokenWithSearch from "@/components/odos/SelectTokenWithSearch.vue";

export default defineComponent({
    name: "SelectTokensModal",
    components: {
        SelectTokenWithSearch,
        SelectTokenShort

    },
    mixins: [odosSwap],
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        closeFunc: {
            type: Function,
            required: true
        },
        swapMethod: {
            type: String,
            required: true
        },
        selectTokenType: {
            type: String,
            required: true
        },

    },
    data() {
      return {
          selectedTokensFromAddresses: [],
          selectedTokensToAddresses: [],
          allTokens: [], // without ovn
          ovnTokens: [],
          tokens: [],

          availableNetworksList: ['polygon', 'bsc', 'optimism', 'arbitrum'],
      }
    },
    mounted() {
        this.loadChains();
        this.loadTokens();
    },
    computed: {
        ...mapGetters('network', ['networkId', "networkName", 'getParams']),

        isAllDataLoaded: function() {
            return !this.isChainsLoading && !this.isTokensLoading;
        },
        selectedFromTokens() {
            return this.fromTokens && this.selectedTokensFromAddresses ?
                this.fromTokens.filter(item => this.selectedTokensFromAddresses.includes(item.address)) : [];
        },
        selectedToTokens() {
            return this.toTokens && this.selectedTokensToAddresses ?
                this.toTokens.filter(item => this.selectedTokensToAddresses.includes(item.address)) : [];
        },

        toTokens() {
            if (this.swapMethod === 'BUY') {
                return this.ovnTokens;
            } else if (this.swapMethod === 'SELL') {
                return this.tokens;
            } else {
                console.error("Odos Swap method not found.", this.swapMethod)
            }
        },
        fromTokens() {
            if (this.swapMethod === 'BUY') {
                return this.tokens;
            } else if (this.swapMethod === 'SELL') {
                return this.ovnTokens;
            } else {
                console.error("Odos Swap method not found.", this.swapMethod)
            }
        }
    },
    watch: {
        isAllDataLoaded: function (newValue, oldValue) {
            if (newValue) {
                this.initData();
            }

        }
    },
    methods: {
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
                console.log("OVN TOKENS_ ", this.ovnTokens)
            } else {
                this.clearInputData();
            }
        },
        clearInputData() {
            this.tokens = [];
            this.ovnTokens = [];
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
                    });
                }
            }

            return tokens;
        },
        async loadOvernightTokenImage(token) {
            let tokenUrl = await this.loadCoingeckoOvernightTokenImage(token.symbol);
            if (tokenUrl) {
                return tokenUrl;
            }

            return '/assets/currencies/stablecoins/' + token.symbol + '.png';
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
        selectToken(token) {
            token.selected = true
        },
        removeToken(token) {
            token.selected = false
        }
    }
})
</script>

<style scoped>

.tokens-container {
    padding-top: 15px;
    padding-bottom: 15px;
}

.title-container {
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 40px;
    color: #29323E;
}
</style>

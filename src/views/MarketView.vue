<template>
    <div>
        <div class="mt-10">
            <label class="title-label">Earn</label>
        </div>

        <v-row align="start" justify="start" class="ma-0">
            <v-col class="ma-n3">
                <v-row align="center" justify="start" class="ma-0 toggle-row mt-10">
                    <label @click="tab=1" class="tab-btn mr-4" v-bind:class="activeTabFeatured">
                        Featured
                        <v-icon size="12" :color="this.tab === 1 ? '#1C95E7' : '#333333'" class="mb-1">
                            mdi-star-circle
                        </v-icon>
                    </label>
                    <label @click="tab=2" class="tab-btn mx-4" v-bind:class="activeTabHold">USD+</label>
                    <label style="color: #C5C9D1 !important" class="tab-btn tab-btn-disabled mx-4"
                           v-bind:class="activeTabPools" disabled>USD+ pools</label>
                    <label @click="tab=4" class="tab-btn ml-4" v-bind:class="activeTabHedged">ETS</label>

                    <v-spacer></v-spacer>

                    <v-menu offset-y v-if="$wu.isFull()"></v-menu>
                </v-row>
            </v-col>
        </v-row>

        <div class="mt-7 cards-list-container">
            <v-row class="d-flex" justify="start">
                <!-- removing EtsRuby from featured temporarily -->
                <component
                    class="ma-3"
                    v-for="component in (tab === 1 ? sortedCardList.filter(value => value.name !== 'EtsRuby').slice(0, 3) : sortedCardList)"
                    v-bind:is="component.name"
                    v-if="(tab === 1) || (tab === 2 && component.type === 'usd+') || (tab === 3 && component.type === 'pool') || (tab === 4 && component.type === 'ets')"
                ></component>
            </v-row>
        </div>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import WmaticUsdPlus from "@/components/market/cards/wmatic/WmaticUsdPlus";
import {mapGetters} from "vuex";
import WbnbUsdPlus from "@/components/market/cards/wbnb/WbnbUsdPlus";
import OvercapBanner from "@/components/market/cards/wbnb/banner/OvercapBanner";
import UsdPlus from "@/components/market/cards/hold/UsdPlus";
import WbnbBusd from "@/components/market/cards/busdWbnb/WbnbBusd";
import WmaticUsdc from "@/components/market/cards/wmaticUsdc/WmaticUsdc";
import EtsMoonstone from "@/components/market/cards/etsMoonstone/EtsMoonstone";
import EtsRuby from "@/components/market/cards/etsRuby/EtsRuby";
import moment from "moment";

export default {
    name: "MarketView",

    components: {
        EtsMoonstone,
        EtsRuby,
        WmaticUsdc,
        WbnbBusd,
        UsdPlus,
        OvercapBanner,
        WbnbUsdPlus,
        WmaticUsdPlus,
    },

    data: () => ({
        tab: 1,
        avgApy: null,
    }),

    computed: {
        ...mapGetters('network', ['appApiUrl', 'networkId', 'polygonConfig', 'bscConfig', 'avaxConfig', 'opConfig']),
        ...mapGetters('marketData', ['wmaticStrategyData', 'wmaticUsdcStrategyData', 'usdPlusWbnbStrategyData', 'busdWbnbStrategyData', 'etsMoonstoneStrategyData', 'etsRubyStrategyData']),
        ...mapGetters('supplyData', ['totalSupply', 'maxUsdPlusWmaticSupply', 'maxWmaticUsdcSupply', 'maxUsdPlusWbnbSupply', 'maxBusdWbnbSupply', 'maxEtsMoonstoneSupply', 'maxEtsRubySupply']),

        activeTabFeatured: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
            }
        },

        activeTabHold: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-in-active': this.tab !== 2,
            }
        },

        activeTabPools: function () {
            return {
                'tab-button': this.tab === 3,
                'tab-button-in-active': this.tab !== 3,
            }
        },

        activeTabHedged: function () {
            return {
                'tab-button': this.tab === 4,
                'tab-button-in-active': this.tab !== 4,
            }
        },

        sortedCardList: function () {

            let networkId = this.networkId;

            let cardList = [
                {
                    type: 'usd+', // usd+, pool, ets
                    name: 'UsdPlus', // real component name
                    chain: networkId,
                    hasUsdPlus: true,
                    hasCap: false,
                    weekApy: (this.avgApy && this.avgApy.value) ? this.avgApy.value : 0,
                },
                {
                    type: 'ets',
                    name: 'WmaticUsdPlus',
                    chain: this.polygonConfig.networkId,
                    hasUsdPlus: true,
                    hasCap: !this.maxUsdPlusWmaticSupply ? false : (this.totalSupply.usdPlusWmatic < this.maxUsdPlusWmaticSupply),
                    weekApy: (this.wmaticStrategyData && this.wmaticStrategyData.apy) ? this.wmaticStrategyData.apy : 0,
                },
                {
                    type: 'ets',
                    name: 'WmaticUsdc',
                    chain: this.polygonConfig.networkId,
                    hasUsdPlus: false,
                    hasCap: !this.maxWmaticUsdcSupply ? false : (this.totalSupply.wmaticUsdc < this.maxWmaticUsdcSupply),
                    weekApy: (this.wmaticUsdcStrategyData && this.wmaticUsdcStrategyData.apy) ? this.wmaticUsdcStrategyData.apy : 0,
                },
                {
                    type: 'ets',
                    name: 'WbnbUsdPlus',
                    chain: this.bscConfig.networkId,
                    hasUsdPlus: true,
                    hasCap: !this.maxUsdPlusWbnbSupply ? false : (this.totalSupply.usdPlusWbnb < this.maxUsdPlusWbnbSupply),
                    weekApy: (this.usdPlusWbnbStrategyData && this.usdPlusWbnbStrategyData.apy) ? this.usdPlusWbnbStrategyData.apy : 0,
                },
                {
                    type: 'ets',
                    name: 'WbnbBusd',
                    chain: this.bscConfig.networkId,
                    hasUsdPlus: false,
                    hasCap: !this.maxBusdWbnbSupply ? false : (this.totalSupply.busdWbnb < this.maxBusdWbnbSupply),
                    weekApy: (this.busdWbnbStrategyData && this.busdWbnbStrategyData.apy) ? this.busdWbnbStrategyData.apy : 0,
                },
                {
                    type: 'ets',
                    name: 'EtsMoonstone',
                    chain: this.polygonConfig.networkId,
                    hasUsdPlus: false,
                    hasCap: !this.maxEtsMoonstoneSupply ? false : (this.totalSupply.etsMoonstone < this.maxEtsMoonstoneSupply),
                    weekApy: (this.etsMoonstoneStrategyData && this.etsMoonstoneStrategyData.apy) ? this.etsMoonstoneStrategyData.apy : 0,
                },
                {
                    type: 'ets',
                    name: 'EtsRuby',
                    chain: this.opConfig.networkId,
                    hasUsdPlus: false,
                    hasCap: !this.maxEtsRubySupply ? false : (this.totalSupply.etsRuby < this.maxEtsRubySupply),
                    weekApy: (this.etsRubyStrategyData && this.etsRubyStrategyData.apy) ? this.etsRubyStrategyData.apy : 0,
                },
            ];

            cardList.sort(function (a, b) {
                if (a.chain === networkId && b.chain !== networkId) return -1;
                if (a.chain !== networkId && b.chain === networkId) return 1;

                if (a.hasUsdPlus && !b.hasUsdPlus) return -1;
                if (!a.hasUsdPlus && b.hasUsdPlus) return 1;

                if (a.hasCap && !b.hasCap) return -1;
                if (!a.hasCap && b.hasCap) return 1;

                return (a.weekApy > b.weekApy) ? -1 : (a.weekApy < b.weekApy ? 1 : 0);
            });

            return cardList;
        },
    },

    watch: {
        appApiUrl: function (newVal, oldVal) {
            this.getAvgWeekApy();
        },
    },

    created() {
        this.getAvgWeekApy();
    },

    methods: {

        async getUsdPlusAvgWeekApy() {
            let fetchOptions = {
                headers: {
                    "Access-Control-Allow-Origin": this.appApiUrl
                }
            };

            await fetch(this.appApiUrl + '/widget/avg-apy-info/week', fetchOptions)
                .then(value => value.json())
                .then(value => {
                    this.avgApy = value;
                    this.avgApy.date = moment(this.avgApy.date).format("DD MMM. ‘YY");
                }).catch(reason => {
                    console.log('Error get data: ' + reason);
                })
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 32px;
        line-height: 40px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }


    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }
}

.tab-button {
    border-bottom: 2px solid #1C95E7 !important;
    color: #1C95E7 !important;
    cursor: pointer;
}

.tab-button-in-active {
    cursor: pointer;
}

.mdi-star-circle {
    cursor: pointer !important;
}

.tab-btn {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #333333;
    margin-bottom: -2px;
    cursor: pointer;
}

.tab-btn-disabled {
    cursor: default;
}

.toggle-row {
    border-bottom: 2px solid #DCE3E8;
}


.cards-list-container {
    margin-bottom: 15% !important;
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #29323E;
}
</style>

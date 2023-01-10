<template>
    <div>
        <div class="mt-10">
            <label class="title-label">Earn</label>
        </div>

        <v-row align="start" justify="start" class="ma-0 mt-10 toggle-row">
            <label @click="tab=1" class="tab-btn mr-4" v-bind:class="activeTabFeatured">
                Featured
                <v-icon size="12" :color="this.tab === 1 ? '#1C95E7' : '#333333'" class="mb-1">
                    mdi-star-circle
                </v-icon>
            </label>
            <label @click="tab=2" class="tab-btn mx-4" v-bind:class="activeTabHedged">ETS</label>
            <label @click="tab=3" class="tab-btn mx-4" v-bind:class="activeTabUsd">USD+</label>
            <label @click="tab=4" class="tab-btn mx-4" v-bind:class="activeTabPools">USD+ pools</label>

            <v-spacer></v-spacer>
        </v-row>

        <div class="mt-7 cards-list-container">
            <v-row class="d-flex" justify="start" v-if="tab === 1">
                <v-col :cols="$wu.isMobile() ? 12 : ($wu.isTablet() ? 6 : 4)"
                       v-for="card in sortedCardList.filter(value => (!value.isPrototype && !value.isArchive)).slice(0, 3)">
                    <v-row class="fill-height">
                        <component
                            class="ma-3"
                            v-bind:key="card.type === 'ets' ? `${card.name}_${card.monthApy}_${card.tvl}` : card.type"
                            :card-data="card"
                            v-bind:is="card.name"
                        ></component>
                    </v-row>
                </v-col>
            </v-row>

            <template v-if="tab === 2">
                <EtsListHeader/>

                <EtsListCard class="mt-2"
                             v-for="(component, i) in sortedCardList.filter(value => (value.type === 'ets' && !value.isPrototype && !value.isOpenPrototype && !value.isArchive))"
                             v-if="component.type === 'ets'"
                             :featured="i < 3"
                             :card-data="component"/>
                <template v-if="sortedCardList.filter(value => (value.isPrototype || value.isOpenPrototype)).length > 0">
                    <v-row class="ma-0 mb-1 mt-10" align="center">
                        <v-icon class="prototypes-icon" :size="$wu.isFull() ? 20 : 16">mdi-test-tube</v-icon>
                        <label class="prototypes-label ml-2">Prototypes</label>
                    </v-row>
                    <v-divider class="prototypes-list-divider"></v-divider>

                    <EtsListHeader class="mt-3"/>

                    <EtsListCard class="mt-2"
                                 v-for="(component, i) in sortedCardList.filter(value => (value.type === 'ets' && (value.isPrototype || value.isOpenPrototype)))"
                                 v-if="component.type === 'ets'"
                                 :card-data="component"/>
                </template>

                <template v-if="sortedCardList.filter(value => value.isArchive).length > 0">
                    <v-row class="ma-0 mb-1 mt-10" align="center">
                        <v-icon class="prototypes-icon" :size="$wu.isFull() ? 20 : 16">mdi-archive-outline</v-icon>
                        <label class="prototypes-label ml-2">Archive</label>
                    </v-row>
                    <v-divider class="prototypes-list-divider"></v-divider>

                    <EtsListHeader class="mt-3"/>

                    <EtsListCard class="mt-2" v-for="(component, i) in sortedCardList.filter(value => (value.type === 'ets' && value.isArchive))"
                                 v-if="component.type === 'ets'"
                                 :card-data="component"/>
                </template>
            </template>

            <v-row class="d-flex" justify="start" v-if="tab === 3">
                <v-col :cols="$wu.isMobile() ? 12 : ($wu.isTablet() ? 6 : 4)">
                    <v-row class="fill-height">
                        <UsdPlus class="ma-3"/>
                    </v-row>
                </v-col>
            </v-row>

            <template v-if="tab === 4">
                <PoolListHeader/>

                <PoolListCard class="mt-2" v-for="(component, i) in sortedPoolList" v-if="component.type === 'pool'"
                              :card-data="component"/>
            </template>
        </div>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapGetters} from "vuex";
import Ets from "@/components/market/cards/ets/Ets";
import EtsListCard from "@/components/market/cards/ets/list/EtsListCard";
import EtsListHeader from "@/components/market/cards/ets/list/EtsListHeader";
import PoolListHeader from "@/components/market/cards/pool/list/PoolListHeader";
import PoolListCard from "@/components/market/cards/pool/list/PoolListCard";
import UsdPlus from "@/components/market/cards/hold/UsdPlus";
import InsuranceCard from "@/components/insurance/cards/insurance/InsuranceCard";
import moment from "moment";

export default {
    name: "MarketView",

    components: {
        PoolListCard,
        PoolListHeader,
        EtsListHeader,
        EtsListCard,
        Ets,
        UsdPlus,
        InsuranceCard,
    },

    data: () => ({
        tab: 1,
        avgApy: null,
        sortedCardList: [],
    }),

    computed: {
        ...mapGetters('network', ['appApiUrl', 'networkId', 'polygonConfig', 'bscConfig', 'avaxConfig', 'opConfig']),
        ...mapGetters('marketData', ['etsStrategyData']),
        ...mapGetters("statsData", ['currentTotalData', 'totalUsdPlusValue']),
        ...mapGetters('supplyData', ['totalSupply', 'totalInsuranceSupply']),
        ...mapGetters('etsAction', ['etsList']),
        ...mapGetters('poolAction', ['poolList']),
        ...mapGetters('insuranceData', ['insuranceStrategyData']),

        activeTabFeatured: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
            }
        },

        activeTabHedged: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-in-active': this.tab !== 2,
            }
        },

        activeTabUsd: function () {
            return {
                'tab-button': this.tab === 3,
                'tab-button-in-active': this.tab !== 3,
            }
        },

        activeTabPools: function () {
            return {
                'tab-button': this.tab === 4,
                'tab-button-in-active': this.tab !== 4,
            }
        },

        sortedPoolList: function () {

            let networkId = this.networkId;

            let poolList = [];

            this.poolList.forEach(pool => {
                poolList.push(
                    {
                        type: 'pool',
                        name: 'Pool',
                        data: pool,
                        chain: pool.chain,
                        hasUsdPlus: true,
                        overcapEnabled: false,
                        hasCap: true,
                        tvl: pool.tvl,
                        monthApy: 0,
                        cardOpened: false,
                    },
                );
            });

            poolList.sort(function (a, b) {
                if (a.chain === networkId && b.chain !== networkId) return -1;
                if (a.chain !== networkId && b.chain === networkId) return 1;

                return (a.tvl > b.tvl) ? -1 : (a.tvl < b.tvl ? 1 : 0);
            });

            poolList[0].cardOpened = true;

            return poolList;
        },
    },
    watch: {
        appApiUrl: function (newVal, oldVal) {
            this.getUsdPlusAvgMonthApy();
            this.getSortedCardList();
        },

        etsStrategyData: function (newVal, oldVal) {
            this.getUsdPlusAvgMonthApy();
            this.getSortedCardList();
        },

        totalSupply: function (newVal, oldVal) {
            this.getUsdPlusAvgMonthApy();
            this.getSortedCardList();
        },

        etsList: function (newVal, oldVal) {
            this.getUsdPlusAvgMonthApy();
            this.getSortedCardList();
        },

        insuranceStrategyData: function(newVal, oldVal) {
            this.getUsdPlusAvgMonthApy();
            this.getSortedCardList();
        },

        totalInsuranceSupply: function(newVal, oldVal) {
            this.getUsdPlusAvgMonthApy();
            this.getSortedCardList();
        },
    },

    created() {
        this.getUsdPlusAvgMonthApy();
        this.getSortedCardList();
    },

    methods: {

        getSortedCardList() {

            let networkId = this.networkId;

            let cardList = [
                {
                    type: 'usdPlus',
                    name: 'UsdPlus',
                    isPrototype: false,
                    isArchive: false,
                    chain: networkId,
                    hasUsdPlus: true,
                    overcapEnabled: false,
                    hasCap: true,
                    tvl: this.totalUsdPlusValue,
                    monthApy: this.avgApy ? this.avgApy.value : 0,
                },
            ];

            this.etsList.forEach(ets => {
                cardList.push(
                    {
                        type: 'ets',
                        name: 'Ets',
                        isPrototype: ets.prototype,
                        isOpenPrototype: ets.openPrototype,
                        isArchive: ets.archive,
                        data: ets,
                        chain: ets.chain,
                        hasUsdPlus: ets.hasUsdPlus,
                        overcapEnabled: (!!(ets.maxSupply && ets.maxSupply > 0)),
                        hasCap: ets.maxSupply ? (this.totalSupply[ets.name] < ets.maxSupply) : true,
                        tvl: this.totalSupply[ets.name],
                        monthApy: (this.etsStrategyData[ets.name] && this.etsStrategyData[ets.name].apy) ? this.etsStrategyData[ets.name].apy : 0,
                        cardOpened: false,
                    },
                );
            });

            if (networkId === 137) {
              cardList.push(
                  {
                    type: 'insurance',
                    name: 'InsuranceCard',
                    isPrototype: false,
                    isArchive: false,
                    chain: networkId,
                    hasUsdPlus: true,
                    overcapEnabled: false,
                    hasCap: this.totalInsuranceSupply,
                    tvl: this.insuranceStrategyData.polygon.lastApy,
                    monthApy: (this.insuranceStrategyData.polygon && this.insuranceStrategyData.polygon.apy) ? this.insuranceStrategyData.polygon.apy : 0,
                    cardOpened: false,
                  },
              );
            }

            cardList.sort(function (a, b) {
                if (!a.isPrototype && b.isPrototype) return -1;
                if (a.isPrototype && !b.isPrototype) return 1;

                if (!a.isArchive && b.isArchive) return -1;
                if (a.isArchive && !b.isArchive) return 1;

                if (a.chain === networkId && b.chain !== networkId) return -1;
                if (a.chain !== networkId && b.chain === networkId) return 1;

                if (a.monthApy > b.monthApy) return -1;
                if (a.monthApy < b.monthApy) return 1;

                if (a.hasCap && !b.hasCap) return -1;
                if (!a.hasCap && b.hasCap) return 1;

                return 0;
            });
            cardList[0].cardOpened = true;

            this.sortedCardList = cardList;
        },

        async getUsdPlusAvgMonthApy() {
            let fetchOptions = {
                headers: {
                    "Access-Control-Allow-Origin": this.appApiUrl
                }
            };

            await fetch(this.appApiUrl + '/widget/avg-apy-info/month', fetchOptions)
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

    .prototypes-label {
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.04em;
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

    .prototypes-label {
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
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

    .prototypes-label {
        font-style: normal;
        font-weight: 700;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 28px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 48px;
        line-height: 60px;
    }

    .prototypes-label {
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }
}

.tab-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
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
    color: var(--secondary-gray-text);
    margin-bottom: -2px;
    cursor: pointer;
}

.tab-btn-disabled {
    cursor: default;
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
}


.cards-list-container {
    margin-bottom: 15% !important;
    width: 100% !important;
}

.toggle-row {
    width: 100% !important;
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.prototypes-list-divider {
    border-color: var(--fourth-gray-text) !important;
}

.prototypes-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.prototypes-icon {
    color: var(--main-gray-text);
}
</style>

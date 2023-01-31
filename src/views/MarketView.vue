<template>
    <div>
        <div class="mt-10">
            <label class="title-label">exchange-traded strategies (ETS)</label>
        </div>

        <div class="mt-7 cards-list-container">
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

            <template v-if="sortedCardList.filter(value => value.isArchive).length > 0" >
                <v-row class="ma-0 mb-1 mt-10" align="center">
                    <v-icon class="prototypes-icon" :size="$wu.isFull() ? 20 : 16">mdi-archive-outline</v-icon>
                    <label class="prototypes-label ml-2">Archive</label>
                    <div class="select-bar-main-container ml-7" @click="openedList = !openedList">
                        <v-row justify="end" align="center" class="select-bar-container">
                            <v-icon color="var(--secondary-gray-text)" >
                                {{ openedList ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                            </v-icon>
                        </v-row>
                    </div>
                </v-row>

                <v-divider class="prototypes-list-divider"></v-divider>

                <template v-if="openedList">
                    <EtsListHeader class="mt-3"/>

                    <EtsListCard class="mt-2" v-for="(component, i) in sortedCardList.filter(value => (value.type === 'ets' && value.isArchive))"
                                 v-if="component.type === 'ets'"
                                 :card-data="component"/>
                </template>

            </template>
        </div>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapGetters} from "vuex";
import EtsListCard from "@/components/market/cards/ets/list/EtsListCard";
import EtsListHeader from "@/components/market/cards/ets/list/EtsListHeader";
import moment from "moment";

export default {
    name: "MarketView",

    components: {
        EtsListHeader,
        EtsListCard,
    },

    data: () => ({
        openedList: false,
        tab: 1,
        avgApy: null,
        sortedCardList: [],
    }),

    computed: {
        ...mapGetters('network', ['appApiUrl', 'networkId', 'polygonConfig', 'bscConfig', 'opConfig']),
        ...mapGetters('marketData', ['etsStrategyData']),
        ...mapGetters("statsData", ['currentTotalData', 'totalUsdPlusValue']),
        ...mapGetters('supplyData', ['totalSupply', 'totalInsuranceSupply']),
        ...mapGetters('etsAction', ['etsList']),
        ...mapGetters('poolAction', ['poolList']),
        ...mapGetters('insuranceData', ['insuranceStrategyData']),

        activeTabName: function() {
            return this.$route.query.tabName || 'featured';
        },

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

        activeTabName() {
            this.initTab();
        },
    },

    created() {
        this.getUsdPlusAvgMonthApy();
        this.getSortedCardList();
    },

    mounted() {
        console.log(this.$route.query.tabName);
        this.initTab();
    },

    methods: {

        setTab(tabId) {
            this.tab = tabId;
        },

        initTab() {
            if(this.$route.query.tabName === 'featured') {
                this.setTab(1);
            }

            if(this.$route.query.tabName === 'ets') {
                this.setTab(2);
            }

            if(this.$route.query.tabName === 'usdPlus') {
                this.setTab(3);
            }

            if(this.$route.query.tabName === 'usdPlusPools') {
                this.setTab(4);
            }
        },

        getSortedCardList() {

            let networkId = this.networkId;

            let cardList = [
                {
                    id: 'usdPlus' + networkId,
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
                        id: 'ets' + ets.chain + ets.name,
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
                        lastApy: (this.etsStrategyData[ets.name] && this.etsStrategyData[ets.name].lastApy) ? this.etsStrategyData[ets.name].lastApy : 0,
                        cardOpened: false,
                    },
                );
            });

            if (networkId === 137) {
              cardList.push(
                  {
                      id: 'insurance' + networkId,
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

.cards-list-container {
    margin-bottom: 15% !important;
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

.select-bar-main-container {
    cursor: pointer;
}
</style>

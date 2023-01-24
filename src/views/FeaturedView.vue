<template>
    <div>
        <div class="mt-10">
            <label class="title-label">featured</label>
        </div>

        <div class="mt-7 cards-list-container">
            <v-row class="d-flex" justify="start">
                <v-col :cols="$wu.isMobile() ? 12 : ($wu.isTablet() ? 6 : 4)"
                       v-for="card in sortedCardList.filter(value => (!value.isPrototype && !value.isArchive)).slice(0, 3)"
                       :key="card.id">
                    <v-row class="fill-height">
                        <component
                            class="ma-3"
                            v-bind:key="card.id"
                            :card-data="card"
                            v-bind:is="card.name"
                        ></component>
                    </v-row>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import moment from "moment";
import Ets from "@/components/market/cards/ets/Ets";
import UsdPlus from "@/components/market/cards/hold/UsdPlus";
import InsuranceCard from "@/components/insurance/cards/insurance/InsuranceCard";

export default {
    name: "FeaturedView",

    components: {
        Ets,
        UsdPlus,
        InsuranceCard,
    },

    data: () => ({
        tab: null,
        avgApy: null,
        sortedCardList: [],
    }),

    computed: {
        ...mapGetters('network', ['appApiUrl', 'networkId', 'polygonConfig', 'bscConfig', 'opConfig']),
        ...mapGetters('marketData', ['etsStrategyData']),
        ...mapGetters("statsData", ['currentTotalData', 'totalUsdPlusValue']),
        ...mapGetters('supplyData', ['totalSupply', 'totalInsuranceSupply']),
        ...mapGetters('etsAction', ['etsList']),
        ...mapGetters('insuranceData', ['insuranceStrategyData']),

        activeTabName: function() {
            return this.$route.query.tabName || 'featured';
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
            if(this.$route.query.tabName === 'optimism') {
                this.setTab(1);
            }

            if(this.$route.query.tabName === 'polygon') {
                this.setTab(2);
            }

            if(this.$route.query.tabName === 'bsc') {
                this.setTab(3);
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
    },
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
}

.tab-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer;
}

.tab-button-in-active {
    cursor: pointer;
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
</style>
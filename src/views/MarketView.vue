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
            <label @click="tab=2" class="tab-btn mx-4" v-bind:class="activeTabHold">USD+</label>
            <label style="color: #C5C9D1 !important" class="tab-btn tab-btn-disabled mx-4"
                   v-bind:class="activeTabPools" disabled>USD+ pools</label>
            <label @click="tab=4" class="tab-btn ml-4" v-bind:class="activeTabHedged">ETS</label>

            <v-spacer></v-spacer>

            <v-menu offset-y v-if="$wu.isFull()"></v-menu>
        </v-row>

        <div class="mt-7 cards-list-container">
            <v-row class="d-flex" justify="start">
                <component
                    class="ma-3"
                    v-for="component in (tab === 1 ? sortedCardList.slice(0, 3) : sortedCardList)"
                    :card-data="component"
                    v-bind:is="component.name"
                    v-if="(tab === 1) || (tab === 2 && component.type === 'usd+') || (tab === 3 && component.type === 'pool') || (tab === 4 && component.type === 'ets')"
                ></component>
            </v-row>
        </div>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapGetters} from "vuex";
import moment from "moment";
import UsdPlus from "@/components/market/cards/hold/UsdPlus";
import Ets from "@/components/market/cards/ets/Ets";

export default {
    name: "MarketView",

    components: {
        Ets,
        UsdPlus,
    },

    data: () => ({
        tab: 1,
        avgUsdPlusApy: null,
        totalUsdPlusTvl: null,
    }),

    computed: {
        ...mapGetters('network', ['appApiUrl', 'networkId', 'polygonConfig', 'bscConfig', 'avaxConfig', 'opConfig']),
        ...mapGetters('marketData', ['etsStrategyData']),
        ...mapGetters("statsData", ['currentTotalData']),
        ...mapGetters('supplyData', ['totalSupply']),
        ...mapGetters('etsAction', ['etsList']),

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
                /*{
                    type: 'usd+', // usd+, pool, ets
                    name: 'UsdPlus', // real component name
                    data: {
                        "cardBgColor": "radial-gradient(circle at 100% 0%, #001845 0%, #001845 27%, #0C255B 52%, #062E80 100%)"
                    },
                    chain: networkId,
                    hasUsdPlus: true,
                    overcapEnabled: false,
                    hasCap: false,
                    tvl: this.totalUsdPlusTvl,
                    weekApy: (this.avgUsdPlusApy && this.avgUsdPlusApy.value) ? this.avgUsdPlusApy.value : 0,
                }*/
            ];

            this.etsList.forEach(ets => {
                cardList.push(
                    {
                        type: 'ets',
                        name: 'Ets',
                        data: ets,
                        chain: ets.chain,
                        hasUsdPlus: ets.hasUsdPlus,
                        overcapEnabled: !!ets.maxSupply,
                        hasCap: ets.maxSupply ? (this.totalSupply[ets.name] < ets.maxSupply) : true,
                        tvl: this.totalSupply[ets.name],
                        weekApy: (this.etsStrategyData[ets.name] && this.etsStrategyData[ets.name].apy) ? this.etsStrategyData[ets.name].apy : 0,
                    },
                );
            });

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
        currentTotalData: function (newVal, oldVal) {
            this.getUsdPlusTotalTvl();
        },

        appApiUrl: function (newVal, oldVal) {
            this.getUsdPlusAvgWeekApy();
        },
    },

    created() {
        this.getUsdPlusAvgWeekApy();
        this.getUsdPlusTotalTvl();
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
                    this.avgUsdPlusApy = value;
                    this.avgUsdPlusApy.date = moment(this.avgUsdPlusApy.date).format("DD MMM. ‘YY");
                }).catch(reason => {
                    console.log('Error get data: ' + reason);
                })
        },

        getUsdPlusTotalTvl() {
            let sum = 0;
            this.currentTotalData.forEach(dataItem => {
                sum += dataItem.value
            });

            this.totalUsdPlusTvl = sum;
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
  border-bottom: 2px solid var(--links-blue) !important;
  color: var(--links-blue) !important;
  cursor: pointer;
}

.tab-button-in-active {
    cursor: pointer;
}

.mdi-star-circle {
  color: var(--links-blue) !important;
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
</style>

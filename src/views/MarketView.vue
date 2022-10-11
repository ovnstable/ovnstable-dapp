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
            <label style="color: #C5C9D1 !important" class="tab-btn tab-btn-disabled mx-4"
                   v-bind:class="activeTabPools" disabled>USD+ pools</label>
            <label @click="tab=4" class="tab-btn ml-4" v-bind:class="activeTabHedged">ETS</label>

            <v-spacer></v-spacer>

            <v-menu offset-y v-if="$wu.isFull()"></v-menu>
        </v-row>

        <div class="mt-7 cards-list-container">

            <v-row class="d-flex" justify="start" v-if="tab === 1">
                <v-col :cols="$wu.isMobile() ? 12 : ($wu.isTablet() ? 6 : 4)"
                       v-for="component in sortedCardList.slice(0, 3)">
                    <v-row class="fill-height">
                        <component
                            class="ma-3"
                            :card-data="component"
                            v-bind:is="component.name"
                        ></component>
                    </v-row>
                </v-col>
            </v-row>

            <v-row class="d-flex" justify="start" v-if="tab === 4">
                <v-col :cols="$wu.isMobile() ? 12 : ($wu.isTablet() ? 6 : 4)"
                       v-for="component in sortedCardList"
                       v-if="component.type === 'ets'">
                    <v-row class="fill-height">
                        <component
                            class="ma-3"
                            :card-data="component"
                            v-bind:is="component.name"
                        ></component>
                    </v-row>
                </v-col>
            </v-row>
        </div>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapGetters} from "vuex";
import moment from "moment";
import Ets from "@/components/market/cards/ets/Ets";

export default {
    name: "MarketView",

    components: {
        Ets,
    },

    data: () => ({
        tab: 1,
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

            let cardList = [];

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
    },

    created() {
    },

    methods: {
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

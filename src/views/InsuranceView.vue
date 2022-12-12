<template>
    <div>
        <div class="mt-10">
            <label class="title-label">Insure USD+</label>
        </div>

        <v-row align="start" justify="start" class="ma-0 mt-10 toggle-row">
            <label @click="tab=1" class="tab-btn mr-4" v-bind:class="activeTabAbout">About Insurance</label>
            <label style="color: #C5C9D1 !important" class="tab-btn tab-btn-disabled mx-4" v-bind:class="activeTabAll" disabled>
                All Insurance
            </label>

            <v-spacer></v-spacer>
        </v-row>

        <div class="mt-7 cards-list-container">
            <v-row class="d-flex" justify="start" v-if="tab === 1">
                <v-col :cols="$wu.isMobile() ? 12 : ($wu.isTablet() ? 6 : 4)">
                    <v-row class="fill-height">
                        <InsuranceCard class="ma-3"/>
                    </v-row>
                </v-col>
                <v-col :cols="$wu.isMobile() ? 12 : ($wu.isTablet() ? 6 : 8)">
                    <v-row class="fill-height">
                        <InsuranceInfoCard class="ma-3"/>
                    </v-row>
                </v-col>
            </v-row>

            <template v-if="tab === 2">
                <!-- TODO: add insurance list header -->
                <!-- TODO: add insurance list cards -->
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
import moment from "moment";
import InsuranceCard from "@/components/insurance/cards/insurance/InsuranceCard";
import InsuranceInfoCard from "@/components/insurance/cards/insurance/InsuranceInfoCard";


export default {
    name: "InsuranceView",

    components: {
        InsuranceInfoCard,
        InsuranceCard,
        PoolListCard,
        PoolListHeader,
        EtsListHeader,
        EtsListCard,
        Ets,
        UsdPlus,
    },

    data: () => ({
        tab: 1,
        sortedCardList: [],
    }),

    computed: {
        ...mapGetters('network', ['appApiUrl', 'networkId', 'polygonConfig', 'bscConfig', 'avaxConfig', 'opConfig']),

        activeTabAbout: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
            }
        },

        activeTabAll: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-in-active': this.tab !== 2,
            }
        },
    },

    watch: {
        appApiUrl: function (newVal, oldVal) {
        },
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
<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col class="stats-col">
                <v-row class="justify-start pt-15">
                    <label class="swap-title">
                        <v-icon class="return-btn" @click='goToAction("/")'>
                            mdi-reply
                        </v-icon>
                        Stats
                    </label>
                </v-row>

                <v-row class="desc justify-start">
                    <p>Automated Overnight DeFi total asset portfolio management dashboards. Your assets are there.</p>
                </v-row>

                <v-row class="mt-8" justify="center">
                    <v-col>
                        <div class="line-apy-container">
                            <template v-if="payoutsApyData">
                                <LineChartApy :data="payoutsApyData"/>
                            </template>
                        </div>
                    </v-col>
                    <v-col>
                        <div class="line-tvl-container">
                            <template v-if="payoutsTvlData">
                                <LineChartTvl :data="payoutsTvlData"/>
                            </template>
                        </div>
                    </v-col>
                </v-row>

                <v-row justify="center" class="toggle-row mt-8">
                    <label class="tab-btn mr-4" @click="tab=1" v-bind:class="activeTabPayouts">Payouts</label>
                    <label class="tab-btn ml-4" @click="tab=2" v-bind:class="activeTabPortfolio">Portfolio</label>
                </v-row>

                <v-row class="pt-8 pb-5" justify="center">
                    <v-col class="pa-0 ma-0 main-div" v-if="tab === 1" cols="8">
                        <v-row style="padding-top: 30px;" no-gutters>
                            <PayoutsTable class="payouts-table-part"/>
                        </v-row>
                        <v-row style="padding-top: 30px; padding-bottom: 30px" no-gutters justify="center" align="center">
                            <label class="scroll-label">scroll to see more</label>
                        </v-row>
                    </v-col>

                    <v-col class="pa-0 ma-0" v-if="tab === 2">
                        <div class="main-div">
                            <v-row style="padding-top: 30px; padding-bottom: 15px" no-gutters justify="start">
                                <label class="total-portfolio-header">Total portfolio</label>
                            </v-row>
                            <v-row style="padding-top: 15px; padding-bottom: 15px" no-gutters>
                                <v-col cols="8">
                                    <Table class="table-part" :data="currentTotalData"/>
                                </v-col>

                                <v-col cols="4">
                                    <Doughnut class="doughnut-part" :data="currentTotalData" :size="320"/>
                                </v-col>
                            </v-row>
                        </div>

                        <div class="main-div mt-8">
                            <v-row style="padding-top: 30px; padding-bottom: 15px" no-gutters justify="start">
                                <label class="total-portfolio-header">Stablecoin stats</label>
                            </v-row>
                            <v-row style="padding-top: 15px; padding-bottom: 15px" no-gutters>
                                <v-col cols="8">
                                    <TableStablecoins class="table-part" :data="stablecoinData"/>
                                </v-col>

                                <v-col cols="4">
                                    <PieStablecoins class="doughnut-part-tvl" :data="stablecoinData" :size="320"/>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import {mapGetters} from "vuex";
import PayoutsTable from "@/components/dashboard/PayoutsTable";
import Table from "@/components/dashboard/doughnut/Table"
import Doughnut from "@/components/dashboard/doughnut/Doughnut"
import LineChartApy from "@/components/dashboard/widget/LineChartApy";
import LineChartTvl from "@/components/dashboard/widget/LineChartTvl";
import TableStablecoins from "@/components/dashboard/pie/TableStablecoins";
import PieStablecoins from "@/components/dashboard/pie/PieStablecoins";

export default {
    name: "DashboardView",

    components: {
        PieStablecoins,
        TableStablecoins,
        LineChartTvl,
        LineChartApy,
        PayoutsTable,
        Table,
        Doughnut,
    },

    data: () => ({
        tab: 1,
        tabNumber: undefined,

        /* TODO: it's hardcoded, need to change */
        stablecoinData: [
            {"label": "USDC", "value": 275098.07, "link": "", "color": "#2775CA", "logo": require('@/assets/currencies/usdc.png')},
            {"label": "USDT", "value": 176885.48, "link": "", "color": "#26A17B", "logo": require('@/assets/currencies/usdt.svg')},
            {"label": "DAI", "value": 62218.44, "link": "", "color": "#FCCA46", "logo": require('@/assets/currencies/dai.svg')},
        ],
    }),

    computed: {
        ...mapGetters("profile", ['totalUsdPlusValue', 'payoutsApyData', 'payoutsTvlData', 'currentTotalData', 'totalUsdPlus', 'loadingCurrentTotalData']),

        activeTabPayouts: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
            }
        },

        activeTabPortfolio: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-in-active': this.tab !== 2,
            }
        },
    },

    created() {
    },

    methods: {
        goToAction(id) {
            this.$router.push(id);
        },
    },
}
</script>

<style scoped>

/* mobile */
@media all and (min-width: 0px) and (max-width: 650px) {

    .stats-col {
        max-width: 90vw !important;
    }

    .swap-title {
        color: white !important;
        font-weight: 300;
        font-size: 34px;
    }
}

/* tablet */
@media only screen and (min-width: 650px) and (max-width: 1400px) {

    .stats-col {
        max-width: 90vw !important;
    }

    .swap-title {
        color: white !important;
        font-weight: 300;
        font-size: 34px;
    }

    .history-minimized-table {
        display: none !important;
    }
}

@media only screen and (min-width: 1400px) {

    .stats-col {
        max-width: 90vw !important;
    }

    .swap-title {
        color: white !important;
        font-weight: 300;
        font-size: 56px;
    }

    .history-minimized-table, .return-btn {
        display: none !important;
    }
}

.desc {
    font-size: 14px;
    color: white !important;
}

.tab-btn {
    background: none !important;
    justify-content: center;
    color: #707A8B !important;
    font-family: 'Raleway', sans-serif;
    font-style: normal;
    font-weight: 800;
    font-size: 24px;
    line-height: 57px;
    text-transform: capitalize;
    border: none;
    cursor: pointer !important;
}

.tab-button {
    color: #FE7F2D !important;
    border-bottom: 2px solid #FE7F2D !important;
}

.return-btn {
    color: #FE7F2D !important;
    cursor: pointer;
    margin-top: -6px;
}

.main-div {
    width: 100% !important;
    background: #1D2029 !important;
    border-radius: 20px;
}

.table-part {
    padding-left: 4%;
}

.payouts-table-part {
    padding-left: 4%;
    padding-right: 4%;
}

.doughnut-part {
    height: 500px !important;
}

.doughnut-part-tvl {
    height: 380px !important;
}

.total-portfolio-header {
    font-family: 'Raleway', sans-serif;
    font-style: normal;
    font-weight: 800;
    font-size: 24px;
    line-height: 36px;
    color: #FFFFFF !important;
    padding-left: 3% !important;
}

.scroll-label {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #4C586D !important;
}

.toggle-row {
    border-bottom: 1px solid #4C586D;
}

.line-apy-container, .line-tvl-container {
    width: 100%;
    background: #1D2029 !important;
    border-radius: 20px;
}

.line-apy-container {
    margin-left: -2%;
}

.line-tvl-container {
    margin-left: 2%;
}
</style>

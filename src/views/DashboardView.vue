<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col lg="12" md="8" sm="8">
                <v-row class="justify-center align-center pt-15">
                    <label class="title-header">
                        <v-icon class="return-btn" @click='goToAction("/")'>
                            mdi-reply
                        </v-icon>
                        USD+ Total Portfolio
                    </label>
                </v-row>

                <v-row>
                    <v-col>
                        <v-row class="desc pr-5 pl-5 pt-8" justify="center">
                            <p>Automated Overnight DeFi total asset portfolio management dashboards. Your assets are there.</p>
                        </v-row>
                        <v-row class="desc pr-5 pl-5 pb-5" justify="center">
                            <p class="text-left font-weight-bold">Redeem anytime</p>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row justify="center">
                    <v-btn-toggle
                            v-model="tabNumber"
                            class="tab-btn-toggle"
                            mandatory>
                        <v-btn class="tab-btn" @click="tab = 1">
                            <label v-bind:class="activeTabPayouts">Payouts</label>
                        </v-btn>
                        <v-btn class="tab-btn" @click="tab = 2">
                            <label v-bind:class="activeTabPortfolio">Portfolio</label>
                        </v-btn>
                    </v-btn-toggle>
                </v-row>

                <v-row class="pt-4" justify="center">
                    <v-col lg="7" class="pa-0 ma-0" v-if="tab === 1">
                        <HistoryTotalDataTable class="history-full-table"/>
                        <HistoryTotalDataTable class="history-minimized-table" minimized/>
                    </v-col>
                    <v-col lg="4" class="pa-0 ma-0" v-if="tab === 2">
                        <CurrentTotalDataTable/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import {mapGetters} from "vuex";
import HistoryTotalDataTable from "@/components/dashboard/HistoryTotalDataTable";
import CurrentTotalDataTable from "@/components/dashboard/CurrentTotalDataTable";

export default {
    name: "DashboardView",

    components: {
        CurrentTotalDataTable,
        HistoryTotalDataTable,
    },

    data: () => ({
        tab: 1,
        tabNumber: undefined,
    }),

    computed: {
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

    .swap-title {
        color: white !important;
        font-weight: 300;
        font-size: 34px;
    }

    .history-full-table {
        display: none !important;
    }
}

/* tablet */
@media only screen and (min-width: 650px) and (max-width: 1400px) {

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

.tab-btn-toggle {
    background: none !important;
    border-radius: 40px !important;
}

.tab-btn {
    background: var(--secondary) !important;
    justify-content: center;
    color: white !important;
    font-size: 16px;
    min-width: 150px;
}

.tab-button {
    color: #FE7F2D !important;
}

.return-btn {
    color: #FE7F2D !important;
    cursor: pointer;
    margin-top: -6px;
}
</style>

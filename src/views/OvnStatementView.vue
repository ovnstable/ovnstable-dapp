<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col class="main-col">
                <v-row align="center">
                    <label class="title-label">Your Portfolio Value</label>
                    <v-spacer></v-spacer>
                </v-row>

                <v-row class="chart-row pb-8">
                    <v-col class="pa-0 ma-0">
                        <!-- TODO: add widget -->
                        <label>Widget here</label>
                    </v-col>
                </v-row>

                <v-row class="balance-cards-row pt-8 pb-8">
                    <v-col class="pa-0 ma-0">
                        <v-row align="center" justify="start">
                            <v-card class="balance-card" flat>
                                <v-card-title>
                                    <div class="money-icon">
                                        <v-img :src="require('@/assets/icon/money.svg')"/>
                                    </div>
                                </v-card-title>
                                <v-card-text>
                                    <v-row class="ml-2 pt-2">
                                        <label class="card-label label-light">Average balance</label>
                                    </v-row>
                                    <v-row class="ml-2 pt-1 pb-3">
                                        <label class="label-value">${{ $utils.formatMoney(avgBalance, 2) }}</label>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-row>
                    </v-col>
                    <v-col class="pa-0 ma-0">
                        <v-row align="center" justify="center">
                            <v-card class="profit-card" flat>
                                <v-card-title>
                                    <div class="money-icon">
                                        <v-img :src="require('@/assets/icon/sent.svg')"/>
                                    </div>
                                </v-card-title>
                                <v-card-text>
                                    <v-row class="ml-2 pt-2">
                                        <label class="card-label label-dark">Profit USD+</label>
                                    </v-row>
                                    <v-row class="ml-2 pt-1 pb-3">
                                        <label class="label-value">${{ $utils.formatMoney(profitUsdPlus, 2) }}</label>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-row>
                    </v-col>
                    <v-col class="pa-0 ma-0">
                        <v-row align="center" justify="end">
                            <v-card class="apy-card" flat>
                                <v-card-title>
                                    <div class="money-icon">
                                        <v-img :src="require('@/assets/icon/info.svg')"/>
                                    </div>
                                </v-card-title>
                                <v-card-text>
                                    <v-row class="ml-2 pt-2">
                                        <label class="card-label label-dark">APY %</label>
                                    </v-row>
                                    <v-row class="ml-2 pt-1 pb-3">
                                        <label class="label-value">{{ $utils.formatMoney(apy, 2) }}%</label>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row class="table-row pt-8">
                    <v-col class="pa-0 ma-0" cols="12">
                        <v-row>
                            <RecentActivitiesTable/>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import {mapGetters} from "vuex";
import RecentActivitiesTable from "@/components/ovn_statement/RecentActivitiesTable";

export default {
    name: "OvnStatementView",

    components: {
        RecentActivitiesTable
    },

    data: () => ({
    }),


    computed: {
        ...mapGetters('dashboardBalance', ['avgBalance', 'profitUsdPlus', 'apy']),
    },

    methods: {
    }

}
</script>

<style scoped>

.title-label {
    color: white;
    font-weight: 300;
    font-size: 56px;
}

.main-col {
    max-width: 45vw !important;
}

.chart-row {
    margin-top: 60px !important;
}

.balance-card, .profit-card, .apy-card {
    border-radius: 24px !important;
    border: none !important;
    height: 100%;
    width: 13vw !important;
}

.balance-card {
    background: var(--orange-gradient) !important;
}

.profit-card, .apy-card {
    background: var(--secondary) !important;
}

.money-icon {
    width: 40px;
    height: 40px;
}

.card-label {
    font-style: normal;
    font-weight: normal;
    line-height: 18px;
    font-size: 14px;
}

.label-light {
    color: #E7EBEF !important;
}

.label-dark {
    color: #8FA2B7 !important;
}

.label-value {
    color: white !important;
    font-style: normal;
    font-weight: 600;
    line-height: 28px;
    font-size: 18px;
}

</style>

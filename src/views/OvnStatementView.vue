<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col class="main-col">
                <v-row align="center">
                    <label class="title-label">
                        <v-icon class="return-btn" @click='goToAction("/")'>
                            mdi-reply
                        </v-icon>
                        Dashboard
                    </label>
                    <v-spacer></v-spacer>
                </v-row>

                <v-row class="chart-row">
                    <v-col class="pa-0 ma-0">
                        <!-- TODO: add widget -->
                        <label class="label-light">Widget here</label>
                    </v-col>
                </v-row>

                <v-row class="cards-full">
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

                <v-row class="cards-minimized">
                    <v-col class="pa-0 ma-0">
                        <v-row align="center" justify="center">
                            <v-card class="balance-card" flat>
                                <v-card-text>
                                    <v-list-item dense>
                                        <v-list-item-avatar>
                                            <v-img :src="require('@/assets/icon/money.svg')"/>
                                        </v-list-item-avatar>

                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <label class="label-value">${{ $utils.formatMoney(avgBalance, 2) }}</label>
                                            </v-list-item-title>

                                            <v-list-item-subtitle>
                                                <label class="card-label label-light">Average balance</label>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card-text>
                            </v-card>
                        </v-row>
                        <v-row class="pt-2" align="center" justify="center">
                            <v-card class="profit-card" flat>
                                <v-card-text>
                                    <v-list-item dense>
                                        <v-list-item-avatar>
                                            <v-img :src="require('@/assets/icon/sent.svg')"/>
                                        </v-list-item-avatar>

                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <label class="label-value">${{ $utils.formatMoney(profitUsdPlus, 2) }}</label>
                                            </v-list-item-title>

                                            <v-list-item-subtitle>
                                                <label class="card-label label-light">Profit USD+</label>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card-text>
                            </v-card>
                        </v-row>
                        <v-row class="pt-2" align="center" justify="center">
                            <v-card class="apy-card" flat>
                                <v-card-text>
                                    <v-list-item dense>
                                        <v-list-item-avatar>
                                            <v-img :src="require('@/assets/icon/info.svg')"/>
                                        </v-list-item-avatar>

                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <label class="label-value">{{ $utils.formatMoney(apy, 2) }}%</label>
                                            </v-list-item-title>

                                            <v-list-item-subtitle>
                                                <label class="card-label label-light">APY %</label>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card-text>
                            </v-card>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row class="table-row">
                    <v-col class="pa-0 ma-0" cols="12">
                        <v-row class="activities-full-table">
                            <RecentActivitiesTable/>
                        </v-row>
                        <v-row class="activities-minimized-table">
                            <RecentActivitiesTable minimized/>
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
        goToAction(id) {
            this.$router.push(id);
        },
    }

}
</script>

<style scoped>

/* mobile */
@media all and (min-width:0px) and (max-width: 650px) {

    .main-col {
        max-width: 80vw !important;
    }

    .balance-card, .profit-card, .apy-card {
        width: 80vw !important;
    }

    .activities-full-table, .cards-full {
        display: none !important;
    }

    .title-label {
        font-size: 34px;
    }

    .chart-row, .cards-minimized, .table-row {
        margin-top: 28px !important;
    }

    .chart-row {
        margin-bottom: 28px !important;
    }
}

/* tablet */
@media only screen and (min-width:650px) and (max-width: 1400px) {

    .main-col {
        max-width: 80vw !important;
    }

    .balance-card, .profit-card, .apy-card {
        width: 25vw !important;
    }

    .activities-full-table, .cards-minimized {
        display: none !important;
    }

    .title-label {
        font-size: 34px;
    }

    .chart-row, .cards-minimized, .table-row {
        margin-top: 28px !important;
    }

    .chart-row {
        margin-bottom: 28px !important;
    }
}

@media only screen and (min-width: 1400px) {

    .main-col {
        max-width: 45vw !important;
    }

    .balance-card, .profit-card, .apy-card {
        width: 13vw !important;
    }

    .activities-minimized-table, .cards-minimized, .return-btn {
        display: none !important;
    }

    .title-label {
        font-size: 56px;
    }

    .chart-row, .cards-full, .table-row {
        margin-top: 60px !important;
    }

    .chart-row {
        margin-bottom: 60px !important;
    }
}

.title-label {
    color: white;
    font-weight: 300;
}

.balance-card, .profit-card, .apy-card {
    border-radius: 24px !important;
    border: none !important;
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

.return-btn {
    color: #FE7F2D !important;
    cursor: pointer;
    margin-top: -6px;
}

</style>

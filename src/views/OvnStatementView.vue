<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col class="main-col">
                <v-row align="center">
                    <label class="title-header">
                        <v-icon class="return-btn" @click='goToAction("/")'>
                            mdi-reply
                        </v-icon>
                        Dashboard
                    </label>
                    <v-spacer></v-spacer>
                </v-row>

                <v-row class="chart-row-db mb-10" v-if="isLoading">
                    <v-col class="ma-0 pt-15">
                        <v-row align="center" justify="center">
                            <v-progress-circular
                                    width="2"
                                    size="32"
                                    color="#8FA2B7"
                                    indeterminate
                            ></v-progress-circular>
                        </v-row>
                        <v-row class="pt-2" align="center" justify="center">
                            <label class="no-activities-label">Getting account info</label>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row class="no-activities-row" v-if="!isLoading && !anyActivities">
                    <v-col cols="3"></v-col>
                    <v-col class="pa-0 ma-0" cols="6">
                        <v-row align="center" justify="center">
                            <div class="no-activities-img">
                                <v-img :src="require('@/assets/icon/box-delete.svg')"/>
                            </div>
                        </v-row>
                        <v-row class="pt-2" align="center" justify="center">
                            <label class="no-activities-label">There’re no data for you to see yet. If you want to mint USD+, just click</label>
                        </v-row>
                        <v-row class="pt-4 pb-2" align="center" justify="center">
                            <v-btn dark
                                   height="56"
                                   class='mint-usd-plus'
                                   @click='goToAction("/")'>
                                Mint USD+
                            </v-btn>
                        </v-row>
                        <v-row align="center" justify="center">
                            <label class="no-activities-label">and go ahead</label>
                        </v-row>
                    </v-col>
                    <v-col cols="3"></v-col>
                </v-row>

                <v-col class="dashboard-main-container mt-8" v-if="!isLoading && anyActivities">
                    <v-row class="chart-row-db" v-if="!isLoading && anyActivities">
                        <v-col>
                            <v-row align="center" justify="center">
                                <DashboardWidget/>
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row class="cards-full mb-4" v-if="anyActivities">
                        <v-col cols="4">
                            <v-row align="center" justify="start">
                                <v-card class="balance-card" flat>
                                    <v-card-text>
                                        <v-row class="ml-2 pt-2" justify="center">
                                            <label class="card-label label-dark">Current balance</label>
                                        </v-row>
                                        <v-row class="ml-2 pt-1 pb-3" justify="center">
                                            <label class="label-value label-orange">${{ $utils.formatMoney(balance.usdPlus, 2) }}</label>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-row>
                        </v-col>
                        <v-col cols="4" class="profit-col">
                            <v-row align="center" justify="center">
                                <v-card class="profit-card" flat>
                                    <v-card-text>
                                        <v-row class="ml-2 pt-2" justify="center">
                                            <label class="card-label label-dark">Profit USD+</label>
                                        </v-row>
                                        <v-row class="ml-2 pt-1 pb-3" justify="center">
                                            <label class="label-value label-light">${{ $utils.formatMoney(profitUsdPlus, 6) }}</label>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-row>
                        </v-col>
                        <v-col cols="4">
                            <v-row align="center" justify="end">
                                <v-card class="apy-card" flat>
                                    <v-card-text>
                                        <v-row class="ml-2 pt-2" justify="center">
                                            <label class="card-label label-dark">APY %</label>
                                        </v-row>
                                        <v-row class="ml-2 pt-1 pb-3" justify="center">
                                            <label class="label-value label-light">{{ apy === 0 ? '—' : ($utils.formatMoney(apy, 2) + '%') }}</label>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row class="cards-minimized" dense v-if="anyActivities">
                        <v-col>
                            <v-row align="center" justify="center" dense>
                                <v-card class="balance-card" flat>
                                    <v-card-text>
                                        <v-list-item dense>
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    <label class="card-label label-dark">Current balance</label>
                                                </v-list-item-title>

                                                <v-list-item-subtitle>
                                                    <label class="label-value label-orange">${{ $utils.formatMoney(balance.usdPlus, 2) }}</label>
                                                </v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-card-text>
                                </v-card>

                                <v-card class="profit-card" flat>
                                    <v-card-text>
                                        <v-list-item dense>
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    <label class="card-label label-dark">Profit USD+</label>
                                                </v-list-item-title>

                                                <v-list-item-subtitle>
                                                    <label class="label-value label-light">${{ $utils.formatMoney(profitUsdPlus, 6) }}</label>
                                                </v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-card-text>
                                </v-card>

                                <v-card class="apy-card" flat>
                                    <v-card-text>
                                        <v-list-item dense>
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    <label class="card-label label-dark">APY %</label>
                                                </v-list-item-title>

                                                <v-list-item-subtitle>
                                                    <label class="label-value label-light">{{ apy === 0 ? '—' : ($utils.formatMoney(apy, 2) + '%') }}</label>
                                                </v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-card-text>
                                </v-card>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col>
                    <v-row class="table-row" v-if="anyActivities">
                        <v-col cols="12">
                            <v-row class="activities-full-table">
                                <RecentActivitiesTable/>
                            </v-row>
                            <v-row class="activities-minimized-table">
                                <RecentActivitiesTable minimized/>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import RecentActivitiesTable from "@/components/ovn_statement/RecentActivitiesTable";
import DashboardWidget from "@/components/ovn_statement/DashboardWidget";

export default {
    name: "OvnStatementView",

    components: {
        DashboardWidget,
        RecentActivitiesTable
    },

    data: () => ({
    }),


    computed: {
        ...mapGetters('profile', ['balance']),
        ...mapGetters('web3', ['account']),
        ...mapGetters('dashboardBalance', ['avgBalance', 'profitUsdPlus', 'apy', 'activities']),

        anyActivities() {
            return this.activities && this.activities.length > 0;
        },

        isLoading() {
            return !this.account;
        }
    },

    created() {
    },

    methods: {
        ...mapActions('dashboardBalance', ['refreshClientDashboardData']),

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
        max-width: 90vw !important;
    }

    .balance-card, .profit-card, .apy-card {
        width: 90vw !important;
    }

    .activities-full-table, .cards-full {
        display: none !important;
    }

    .no-activities-img {
        width: 50px !important;
        height: 50px !important;
    }

    .mint-usd-plus {
        height: 46px;
    }

    .card-label {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
    }

    .label-value {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 600 !important;
        font-size: 20px !important;
        line-height: 32px !important;
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

    .no-activities-img {
        width: 60px !important;
        height: 60px !important;
    }

    .mint-usd-plus {
        height: 46px;
    }

    .card-label {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 24px;
    }

    .label-value {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 600 !important;
        font-size: 24px !important;
        line-height: 36px !important;
    }
}

@media only screen and (min-width: 1400px) {

    .main-col {
        max-width: 55vw !important;
    }

    .balance-card, .profit-card, .apy-card {
        width: 17vw !important;
    }

    .activities-minimized-table, .cards-minimized, .return-btn {
        display: none !important;
    }

    .table-row {
        margin-top: 4px !important;
    }

    .no-activities-img {
        width: 80px !important;
        height: 80px !important;
    }

    .mint-usd-plus {
        height: 56px;
    }

    .card-label {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 24px;
    }

    .label-value {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 600 !important;
        font-size: 24px !important;
        line-height: 36px !important;
    }

    .profit-col {
        border-left: 1px solid #4C586D !important;
        border-right: 1px solid #4C586D !important;
    }
}

.balance-card, .profit-card, .apy-card {
    border-radius: 24px !important;
    border: none !important;
}

.balance-card,.profit-card, .apy-card {
    background: var(--secondary) !important;
}

.money-icon {
    width: 40px;
    height: 40px;
}

.label-light {
    color: white !important;
}

.label-orange {
    color: #FE7F2D !important;
}

.label-dark {
    color: #707A8B !important;
}

.return-btn {
    color: #FE7F2D !important;
    cursor: pointer;
    margin-top: -6px;
}

.no-activities-row {
    margin-top: 60px;
}

.no-activities-label {
    display: block;
    text-align: center;
    color: #8FA2B7 !important;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    font-size: 14px;
}

.mint-usd-plus {
    text-transform: none !important;
    border-radius: 40px;
    color: white !important;
    background: var(--orange-gradient) !important;

    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
}

.dashboard-main-container {
    background: #1D2029 !important;
    border-radius: 20px;
}

</style>

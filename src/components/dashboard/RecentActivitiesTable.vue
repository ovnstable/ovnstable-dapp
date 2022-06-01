<template>
    <v-simple-table class="activities-table" dark height="600px">
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="table-header-recent pb-6" colspan="7">Recent activities</th>
                </tr>
                <tr class="current-table-row-header">
                    <th class="table-header-col">Date</th>
                    <th class="table-header-col text-right" v-if="!minimized">Opening balance</th>
                    <th class="table-header-col text-right" v-if="!minimized">Type</th>
                    <th class="table-header-col text-right">Balance change</th>
                    <th class="table-header-col text-right" v-if="!minimized">Fees</th>
                    <th class="table-header-col text-right" v-if="!minimized">Closing balance</th>
                    <th class="table-header-col text-right">APY</th>
                    <th class="table-header-col text-right" v-if="!minimized"></th>
                </tr>
            </thead>

            <tbody>
                <template v-for="activity in activities">
                    <tr @click="openOnScan(activity.transactionHash)" class="current-table-row">
                        <td class="table-col-value">
                            {{ formatDate(activity.date) }}
                        </td>
                        <td class="table-col-value text-right" v-if="!minimized">
                            ${{ $utils.formatMoney(activity.openingBalance, 6) }}
                        </td>
                        <td class="table-col-value text-right" v-if="!minimized">
                            {{ activity.type }}
                        </td>
                        <td class="table-col-value text-right">
                            <a class="transaction-link" @click="openOnScan(activity.transactionHash)">
                                {{ activity.balanceChange ? (activity.balanceChange < 0 ? '-' : '+') : '' }}
                                {{ activity.balanceChange ? '$' + ($utils.formatMoney((activity.balanceChange < 0 ? -1 : 1) * activity.balanceChange, 6)) : '—' }}
                            </a>
                        </td>
                        <td class="table-col-value text-right" v-if="!minimized">
                            ${{ $utils.formatMoney(activity.fee, 2) }}
                        </td>
                        <td class="table-col-value text-right" v-if="!minimized">
                            ${{ $utils.formatMoney(activity.closingBalance, 6) }}
                        </td>
                        <td class="table-col-value text-right" :class="activity.apy ? (activity.apy > 0 ? 'apy-green' : 'apy-red') : ''">
                            {{ activity.apy ? $utils.formatMoney(activity.apy, 2) + '%' : '—' }}
                        </td>
                        <td class="table-col-value text-right" v-if="!minimized">
                            <v-row justify="end">
                                <div class="out-icon mr-4">
                                    <v-img :src="require('@/assets/icon/out-white.svg')"/>
                                </div>
                            </v-row>
                        </td>
                    </tr>
                </template>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script>

import {mapActions, mapGetters} from "vuex";

export default {
    name: "RecentActivitiesTable",

    components: {
    },

    data: () => ({
    }),

    props: {
        minimized: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        ...mapGetters('dashboardData', ['activities']),
    },

    methods: {
        formatDate(date) {
            return this.$moment(date).format('DD.MM.YYYY');
        },

        openOnScan(transactionHash) {
            let url = "https://polygonscan.com/tx/" + transactionHash;
            window.open(url, '_blank').focus();
        },
    }
}
</script>

<style>

/* mobile */
@media only screen and (max-width: 1400px) {

    .table-header-col {
        font-family: 'Lato', sans-serif !important;
        font-style: normal !important;
        font-weight: 700 !important;
        line-height: 22px !important;
        font-size: 14px !important;
        color: #4C586D !important;
    }

    .table-col-value {
        font-family: 'Lato', sans-serif !important;
        color: white !important;
        font-style: normal !important;
        font-weight: 400 !important;
        line-height: 24px !important;
        font-size: 16px !important;
    }

    .table-header-recent {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 600 !important;
        font-size: 20px !important;
        line-height: 32px !important;
        color: white !important;
    }

    .current-table-row {
        height: 48px !important;
    }
}

@media only screen and (min-width: 1400px) {

    .table-header-col {
        font-family: 'Lato', sans-serif !important;
        font-style: normal !important;
        font-weight: 600 !important;
        line-height: 24px !important;
        font-size: 16px !important;
        color: #4C586D !important;
    }

    .table-col-value {
        font-family: 'Lato', sans-serif !important;
        color: white !important;
        font-style: normal !important;
        font-weight: 400 !important;
        line-height: 28px !important;
        font-size: 18px !important;
    }

    .table-header-recent {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 600 !important;
        font-size: 24px !important;
        line-height: 36px !important;
        color: white !important;
    }

    .current-table-row {
        height: 70px !important;
    }
}

.activities-table {
    width: 100% !important;
    background: none !important;
}

.activities-table > .v-data-table__wrapper {
    overflow-y: scroll;
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
}

.table-col-value {
    color: white !important;
}

.transaction-link {
    color: white !important;
}

.current-table-row {
    cursor: pointer !important;
}

.current-table-row-header {
    height: 24px !important;
}

.out-icon {
    width: 24px !important;
    height: 24px !important;
    cursor: pointer;
}

.apy-green {
    color: #23DD00 !important;
}

.apy-red {
    color: #FE7F2D !important;
}

</style>

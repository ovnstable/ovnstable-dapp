<template>
    <v-simple-table class="activities-table" dark height="200px" dense>
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="table-header" colspan="7">Recent activities</th>
                </tr>
                <tr>
                    <th class="table-label table-header-col">Date</th>
                    <th class="table-label table-header-col text-right" v-if="!minimized">Opening balance</th>
                    <th class="table-label table-header-col text-right" v-if="!minimized">Balance change</th>
                    <th class="table-label table-header-col text-right" v-if="!minimized">Fees</th>
                    <th class="table-label table-header-col text-right">Daily profit</th>
                    <th class="table-label table-header-col text-right" v-if="!minimized">Closing balance</th>
                    <th class="table-label table-header-col text-right">APY</th>
                </tr>
            </thead>

            <tbody>
                <template v-for="activity in activities">
                    <tr>
                        <td class="table-label table-col-value">
                            {{ formatDate(activity.date) }}
                        </td>
                        <td class="table-label table-col-value text-right" v-if="!minimized">
                            ${{ $utils.formatMoney(activity.openingBalance, 6) }}
                        </td>
                        <td class="table-label table-col-value text-right" v-if="!minimized">
                            {{ activity.balanceChange ? (activity.balanceChange < 0 ? '-' : '+') : '' }}
                            {{ activity.balanceChange ? '$' + ($utils.formatMoney((activity.balanceChange < 0 ? -1 : 1) * activity.balanceChange, 2)) : '—' }}
                        </td>
                        <td class="table-label table-col-value text-right" v-if="!minimized">
                            ${{ $utils.formatMoney(activity.fee, 2) }}
                        </td>
                        <td class="table-label table-col-value text-right">
                            {{ activity.dailyProfit ? '$' + $utils.formatMoney(activity.dailyProfit, 6) : '—' }}
                        </td>
                        <td class="table-label table-col-value text-right" v-if="!minimized">
                            ${{ $utils.formatMoney(activity.closingBalance, 6) }}
                        </td>
                        <td class="table-label table-col-value text-right">
                            {{ activity.apy ? $utils.formatMoney(activity.apy, 2) + '%' : '—' }}
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
        ...mapGetters('dashboardBalance', ['activities']),
    },

    methods: {
        formatDate(date) {
            return this.$moment(date).format('DD.MM.YYYY');
        }
    }
}
</script>

<style>

.activities-table {
    width: 100% !important;
    background: none !important;
    border-radius: 8px !important;
    border: 1px solid rgba(95, 151, 255, 0.15);
}

.table-header {
    font-family: 'Lato', sans-serif !important;
    color: white !important;
    font-style: normal !important;
    font-weight: 600 !important;
    line-height: 28px !important;
    font-size: 18px !important;
    padding-top: 14px !important;
    padding-bottom: 2px !important;
}

.table-header-col {
    color: #8FA2B7 !important;
}

.table-col-value {
    color: white !important;
}

.table-label {
    font-family: 'Lato', sans-serif !important;
    font-style: normal !important;
    font-weight: 400 !important;
    line-height: 24px !important;
    font-size: 14px !important;
}

</style>

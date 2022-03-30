<template>
    <v-simple-table class="history-table" dark height="40vh" dense>
        <template v-slot:default>
            <thead>
            <tr>
                <th class="table-label table-header-col">
                    Payable date (UTC)
                </th>
                <th class="table-label table-header-col text-right" v-if="!minimized">
                    Daily profit<br/>(USDC per USD+)
                </th>
                <th class="table-label table-header-col text-right">
                    Annualized yield<br/>(% per year)
                </th>
                <th class="table-label table-header-col text-center" v-if="!minimized">
                    View on PolygonScan
                </th>
            </tr>
            </thead>

            <tbody>
            <template v-for="item in payouts">
                <tr>
                    <td class="table-label table-col-value">
                        {{ formatDate(item.payableDate) }}
                    </td>
                    <td class="table-label table-col-value text-right" v-if="!minimized">
                        {{ $utils.formatMoney(item.dailyProfit, 6) }}$
                    </td>
                    <td class="table-label table-col-value text-right">
                        {{ $utils.formatMoney(item.annualizedYield, 6) }}%
                    </td>
                    <td class="table-label table-col-valu text-center" v-if="!minimized">
                        <v-icon @click="openOnScan(item)">mdi-eye</v-icon>
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
    name: "HistoryTotalDataTable",

    components: {},

    data: () => ({}),

    props: {
        minimized: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        ...mapGetters('profile', ['payouts', 'loadingPayouts'])
    },

    methods: {
        openOnScan(item) {
            let url = "https://polygonscan.com/tx/" + item.transactionHash;
            window.open(url, '_blank').focus();

        },

        formatDate(date) {
            return this.$moment.utc(date).format('DD.MM.YYYY HH:mm:ss');
        }
    }
}
</script>

<style>

.history-table {
    width: 100% !important;
    background: none !important;
    border-radius: 8px !important;
    border: 1px solid rgba(95, 151, 255, 0.15);
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

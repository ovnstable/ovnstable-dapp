<template>
    <v-simple-table class="current-table-payouts" dark height="600px">
        <thead>
        <tr class="current-table-row-header">
            <th class="table-header text-left" width="450px">
                Payable date, UTC
            </th>
            <th class="table-header text-left">
                Daily profit<br/>(USDC per USD+)
            </th>
            <th class="table-header text-left">
                Annualized yield<br/>(% per year)
            </th>
            <th class="table-header text-right" width="160px">
                PolygonScan
            </th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="item in payouts" :key="item.payableDate" class="current-table-row">
            <td class="table-label text-left">
                <label>
                    {{ formatDate(item.payableDate) }}
                </label>
                <label class="ml-6">
                    {{ formatTime(item.payableDate) }}
                </label>
            </td>
            <td class="table-label text-left">
                $ {{ $utils.formatMoney(item.dailyProfit, 6) }}
            </td>
            <td class="table-label text-left">
                <label :class="item.annualizedYield > 0 ? 'ann-yield-green' : 'ann-yield-red'">{{ $utils.formatMoney(item.annualizedYield, 1) }}%</label>
            </td>
            <td class="table-label text-right">
                <label @click="openInNewTab(item)"> {{ shortHash(item.transactionHash) }}</label>

                <!-- TODO: add link icon -->
            </td>
        </tr>
        </tbody>
    </v-simple-table>
</template>

<script>

import {mapActions, mapGetters} from "vuex";

export default {
    name: "PayoutsTable",

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
            return this.$moment.utc(date).format('DD.MM.YYYY');
        },

        formatTime(date) {
            return this.$moment.utc(date).format('HH:mm');
        },

        shortHash(s) {
            if (s) {
                return s.substring(0, 5) + '...' + s.substring(s.length - 4);
            } else {
                return '—';
            }
        }
    }
}
</script>

<style>


.current-table-payouts {
    width: 100% !important;
    background: none !important;
}

.current-table-payouts > .v-data-table__wrapper {
    overflow-y: scroll;
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
}

.v-data-table__wrapper::-webkit-scrollbar {
    display: none !important;
}

.table-header {
    font-family: 'Lato', sans-serif !important;
    font-style: normal !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    font-size: 16px !important;
    color: #4C586D !important;
}

.table-label {
    font-family: 'Lato', sans-serif !important;
    color: white !important;
    font-style: normal !important;
    font-weight: 400 !important;
    line-height: 28px !important;
    font-size: 18px !important;
}

.table-label-total {
    font-family: 'Lato', sans-serif !important;
    color: white !important;
    font-style: normal !important;
    font-weight: 600 !important;
    line-height: 28px !important;
    font-size: 18px !important;
}

.table-header, .table-label, .table-empty {
    border-bottom: 2px solid #13151C !important;
}

.current-table-row-total > td, .current-table-row-total-usd-plus > td {
    border-bottom: none !important;
}

.text-left {
    text-align: left !important;
}

.text-right {
    text-align: right !important;
}

.current-table-row {
    height: 70px !important;
}

.current-table-row-header {
    height: 24px !important;
}

.open-link-btn {
    cursor: pointer !important;
    background: none !important;
    display: flex !important;
    line-height: 24px;
}

.icon-img {
    width: 24px !important;
    height: 24px !important;
}

.ann-yield-green {
    color: #23DD00 !important;
}

.ann-yield-red {
    color: #FE7F2D !important;
}

</style>

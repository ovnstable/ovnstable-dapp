<template>
    <v-simple-table class="current-table-payouts-strategy" height="400px">
        <thead>
        <tr class="current-strategy-table-row-header">
            <th class="table-header-payouts-strategy text-left" :width="minimized ? '' : '30%'">
                Payout date, UTC
            </th>
            <th class="table-header-payouts-strategy text-right" v-if="!minimized">
                Daily profit{{ minimized ? '' : ', USDC per USD+/wMatic'}}
            </th>
            <th class="table-header-payouts-strategy text-right" :colspan="minimized ? 2 : 1">
                Annualized yield{{ minimized ? '' : ', % per year'}}
            </th>
            <th class="table-header-payouts-strategy text-right" width="180px" v-if="!minimized">
                Explorer
            </th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="item in [...wmaticStrategyData.payoutItems].reverse()" :key="item.payableDate" class="current-strategy-table-row" @click="openOnScan(item)">
            <td class="table-label-payouts-strategy text-left">
                <label>
                    {{ formatDate(item.payableDate) }}
                </label>
                <label class="ml-4" v-if="!minimized">
                    {{ formatTime(item.payableDate) }}
                </label>
            </td>
            <td class="table-label-payouts-strategy text-right" v-if="!minimized">
                $ {{ $utils.formatMoney(item.dailyProfit, 6) }}
            </td>
            <td class="table-label-payouts-strategy text-right">
                <label :class="item.annualizedYield > 0 ? 'yield-green' : 'yield-red'">
                    {{ $utils.formatMoney(item.annualizedYield, 1) }}%
                </label>
            </td>
            <td class="table-label-payouts-strategy text-right" v-if="!minimized">
                <label @click="openOnScan(item)" class="link-label">
                    {{ shortHash(item.transactionHash) }}
                    <v-img class="icon-img ml-2" :src="require('@/assets/icon/open.svg')"/>
                </label>
            </td>
            <td v-if="minimized" class="table-label-payouts-strategy text-right">
                <label class="text-right">
                    <v-img class="icon-img ml-2" :src="require('@/assets/icon/open.svg')"/>
                </label>
            </td>
        </tr>
        </tbody>
    </v-simple-table>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";

/* eslint-disable no-unused-vars,no-undef */

export default {
    name: "Table",

    components: {},

    data: () => ({}),

    props: {
        minimized: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        ...mapGetters('marketData', ['wmaticStrategyData']),
    },

    methods: {
        openOnScan(item) {
            let url = process.env.VUE_APP_NETWORK_EXPLORER + "tx/" + item.transactionHash;
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

/* mobile */
@media only screen and (max-width: 960px) {
    .table-header-payouts-strategy {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .table-label-payouts-strategy {
        font-style: normal !important;
        font-weight: 300 !important;
        font-size: 16px !important;
        line-height: 24px !important;
    }

    .current-strategy-table-row {
        height: 48px !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .table-header-payouts-strategy {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .table-label-payouts-strategy {
        font-style: normal !important;
        font-weight: 300 !important;
        font-size: 16px !important;
        line-height: 24px !important;
    }

    .current-strategy-table-row {
        height: 64px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .table-header-payouts-strategy {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .table-label-payouts-strategy {
        font-style: normal !important;
        font-weight: 300 !important;
        font-size: 16px !important;
        line-height: 24px !important;
    }

    .current-strategy-table-row {
        height: 64px !important;
    }
}

.table-header-payouts-strategy {
    font-family: 'Roboto', sans-serif !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: #ADB3BD !important;
}

.table-label-payouts-strategy {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: #333333 !important;
}

.current-table-payouts-strategy {
    width: 100% !important;
    background: none !important;
}

.current-table-payouts-strategy > .v-data-table__wrapper {
    overflow-y: scroll !important;
    -ms-overflow-style: none !important; /* for Internet Explorer, Edge */
    scrollbar-width: none !important; /* for Firefox */
}

.v-data-table__wrapper::-webkit-scrollbar {
    display: none !important;
}

.table-label-payouts-strategy {
    border-top: 1px solid #DEE1E5 !important;
}

.current-strategy-table-row-total > td, .current-strategy-table-row-total-usd-plus > td {
    border-top: none !important;
}

.text-left {
    text-align: left !important;
}

.text-right {
    text-align: right !important;
}

.current-strategy-table-row-header {
    height: 50px !important;
}

.open-link-btn {
    cursor: pointer !important;
    background: none !important;
    display: flex !important;
    line-height: 24px;
}

.yield-green {
    color: #22ABAC !important;
}

.yield-red {
    color: #CF3F92 !important;
}

.icon-img {
    width: 24px !important;
    height: 24px !important;
    margin-top: 2px;
    cursor: pointer;
}

.link-label {
    display: inline-flex !important;
}
</style>

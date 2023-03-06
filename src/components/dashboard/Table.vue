<template>
    <v-simple-table class="current-table-payouts-strategy" height="400px">
        <thead>
        <tr class="current-strategy-table-row-header">
            <th class="table-header-payouts-strategy text-left" :width="$wu.isMobile() ? '100px' : '180px'">
                Payable date, UTC
            </th>
            <th class="table-header-payouts-strategy text-right" v-if="!minimized">
                Opening balance
            </th>
            <th class="table-header-payouts-strategy text-center" v-if="!$wu.isMobile()">
                Transaction type
            </th>
            <th class="table-header-payouts-strategy text-right">
                Balance change
            </th>
            <th class="table-header-payouts-strategy text-right" v-if="!minimized">
                Fees
            </th>
            <th class="table-header-payouts-strategy text-right" v-if="!minimized">
                Closing balance
            </th>
            <th class="table-header-payouts-strategy text-right">
                Return
            </th>
            <th class="table-header-payouts-strategy text-right" v-if="!$wu.isMobile()">
                Explorer
            </th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="item in data" :key="item.date" class="current-strategy-table-row" @click="openOnScan(item)">
            <td class="table-label-payouts-strategy text-left">
                <label>
                    {{ formatDate(item.date) }}
                </label>
                <label class="ml-4" v-if="!minimized">
                    {{ formatTime(item.date) }}
                </label>
            </td>
            <td class="table-label-payouts-strategy text-right" v-if="!minimized">
                $ {{ $utils.formatMoney(item.openingBalance, 6) }}
            </td>
            <td class="table-label-payouts-strategy text-center" v-if="!$wu.isMobile()">
                {{ item.type }}
            </td>
            <td class="table-label-payouts-strategy text-right">
                {{ item.balanceChange ? (item.balanceChange < 0 ? '-' : '+') : '' }}
                {{ item.balanceChange ? '$' + ($utils.formatMoney((item.balanceChange < 0 ? -1 : 1) * item.balanceChange, 6)) : '—' }}
            </td>
            <td class="table-label-payouts-strategy text-right" v-if="!minimized">
                {{ (item.fee == null || item.fee === 0) ? '—' : ('$' + $utils.formatMoney(item.fee, 2)) }}
            </td>
            <td class="table-label-payouts-strategy text-right" v-if="!minimized">
                ${{ $utils.formatMoney(item.closingBalance, 6) }}
            </td>
            <td class="table-label-payouts-strategy text-right">
                <label :class="(item.comp == null || item.comp === 0) ? 'yield-default' : (item.comp > 0 ? 'yield-green' : 'yield-red')">
                    {{ (item.comp == null || item.comp === 0) ? '—' : ($utils.formatMoney(item.comp, 3) + '%') }}
                </label>
            </td>
            <td class="table-label-payouts-strategy text-right" @click="openOnScan(item)" v-if="!$wu.isMobile()">
                <v-row align="center" justify="end">
                    <v-spacer></v-spacer>
                    <div class="icon-img">
                        <v-img :src="require('@/assets/icon/open.svg')"/>
                    </div>
                </v-row>
            </td>
        </tr>
        </tbody>

        <resize-observer @notify="$forceUpdate()"/>
    </v-simple-table>
</template>

<script>

/* eslint-disable no-unused-vars,no-undef */

import {mapGetters} from "vuex";

export default {
    name: "Table",

    components: {},

    data: () => ({}),

    props: {
        minimized: {
            type: Boolean,
            default: false,
        },

        data: {
            type: Array,
            default: () => {},
        },
    },

    computed: {
        ...mapGetters('network', ['explorerUrl']),
    },

    methods: {
        openOnScan(item) {
            let url = this.explorerUrl + "tx/" + item.transactionHash;
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
        font-weight: 400 !important;
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
        font-weight: 400 !important;
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
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 24px !important;
    }

    .current-strategy-table-row {
        height: 64px !important;
    }
}

.current-strategy-table-row:hover {
    background: var(--current-table-hover) !important;
}

.table-header-payouts-strategy {
    font-family: 'Roboto', sans-serif !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: var(--third-gray-text) !important;
}

.table-label-payouts-strategy {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: var(--secondary-gray-text) !important;
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
    border-top: 1px solid var(--main-border) !important;
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

.yield-green {
    color: #22ABAC !important;
}

.yield-red {
    color: #CF3F92 !important;
}

.yield-default {
    color: var(--secondary-gray-text) !important;
}

.icon-img {
    width: 24px !important;
    height: 24px !important;
    cursor: pointer;
}
</style>

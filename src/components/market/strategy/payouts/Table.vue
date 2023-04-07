<template>
    <v-simple-table class="current-table-payouts-strategy" height="400px">
        <thead>
        <tr class="current-strategy-table-row-header">
            <th class="table-header-payouts-strategy text-left" :width="minimized ? '' : '30%'">
                Payout date, UTC
            </th>
            <th class="table-header-payouts-strategy text-right" v-if="!minimized">
                Daily profit{{ minimized ? '' : (profitLabel ? ', ' + profitLabel : '')}}
            </th>
            <th v-if="(payoutData && payoutData[0]) ? payoutData[0].comp : false" class="table-header-payouts-strategy text-right" :colspan="minimized ? 2 : 1">
              <div class="return-container">
                <label>
                  Cumulative return
                </label>

                <div class="tooltip-compound">
                  <v-row align="center" justify="end">
                    <Tooltip :size="16" :icon-color="light ? '#ADB3BD' :  '#707A8B'" text="Cumulative return since inception date"/>
                  </v-row>
                </div>
              </div>
            </th>
            <th v-else-if="payoutData && payoutData[0] ? payoutData[0].annualizedYield : false" class="table-header-payouts-strategy text-right" :colspan="minimized ? 2 : 1">
                Annualized yield{{ minimized ? '' : ', % per year'}}
            </th>
            <th class="table-header-payouts-strategy text-right" width="180px" v-if="!minimized">
                Explorer
            </th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="item in payoutData" :key="item.payableDate" class="current-strategy-table-row" @click="openOnScan(item)">
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
            <td v-if="item.comp" class="table-label-payouts-strategy text-right">
                <label :class="item.comp >= 0 ? 'yield-green' : 'yield-red'">
                    {{ $utils.formatMoney(item.comp, 2) }}%
                </label>
            </td>
            <td v-else-if="item.annualizedYield" class="table-label-payouts-strategy text-right">
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

import {mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";


/* eslint-disable no-unused-vars,no-undef */

export default {
    name: "Table",

    components: {Tooltip},

    data: () => ({}),

    props: {
        minimized: {
            type: Boolean,
            default: false,
        },

        profitLabel: {
            type: String,
            default: '',
        },

        payoutData: {
            type: Array,
            default: () => {},
        },

        networkName: {
            type: String,
            default: 'optimism'
        }
    },

    computed: {
        ...mapGetters('network', ['getParams', 'opConfig', 'polygonConfig', 'bscConfig', 'arConfig', 'zkConfig']),
        ...mapGetters('theme', ['light']),
    },

    methods: {
        openOnScan(item) {
            let url;
            switch (this.networkName) {
                case 'polygon':
                    url = this.polygonConfig.explorerUrl;
                    break;
                case 'optimism':
                    url = this.opConfig.explorerUrl;
                    break;
                case 'bsc':
                    url = this.bscConfig.explorerUrl;
                    break;
                case 'arbitrum':
                    url = this.arConfig.explorerUrl;
                    break;
                case 'zksync':
                    url = this.zkConfig.explorerUrl;
                    break;
            }
            window.open(url + `tx/${item.transactionHash}`, '_blank').focus();
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

<style scoped>

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

    .icon-img {
        width: 22px !important;
        height: 22px !important;
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

    .icon-img {
        width: 22px !important;
        height: 22px !important;
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

    .icon-img {
        width: 22px !important;
        height: 22px !important;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .table-header-payouts-strategy {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 13px !important;
        line-height: 18px !important;
    }

    .table-label-payouts-strategy {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 15px !important;
        line-height: 24px !important;
    }

    .current-strategy-table-row {
        height: 64px !important;
    }

    .icon-img {
        width: 18px !important;
        height: 18px !important;
        margin-top: 3px !important;
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

.icon-img {
    cursor: pointer;
}

.link-label {
    display: inline-flex !important;
}

.tooltip-compound {
  position: relative;
  right: -7px;
  bottom: 4px
}

.return-container {
  position: relative;
}
</style>

<template>
    <v-simple-table class="current-table">
        <thead>
        <tr class="current-table-row-header">
            <th class="table-header-don text-left" :colspan="2">
                Stablecoin
            </th>
            <th class="table-header-don text-left" v-if="!minimized">
                Safety score
                <!-- TODO: add info -->
            </th>
            <th class="table-header-don text-left" :colspan="minimized ? 2 : 1">
                Net Asset Value
                <!-- TODO: add info -->
            </th>
            <th class="table-header-don text-left" width="180px" v-if="!minimized">
                Percent in portfolio
            </th>
            <th class="table-header-don" v-if="!minimized"></th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="item in data" :key="item.label" class="current-table-row" @click="openTokenOnScan(item.link)">
            <td class="table-label-don text-right" width="1%">
                <v-img class="currency-icon" :src="item.logo"/>
            </td>
            <td class="table-label-don text-left">
                <v-row>
                    <label class="link-label">
                        {{ item.label }}
                    </label>
                    <v-spacer></v-spacer>
                    <label class="link-label mr-6">
                        <v-img class="icon-img-link" v-if="!minimized" :src="require('@/assets/icon/open-in-new.svg')"/>
                    </label>
                </v-row>
            </td>
            <td class="table-label-don text-left high-label" v-if="!minimized">
                VERY HIGH
            </td>
            <td class="table-label-don text-left">
                ${{ $utils.formatMoney(item.value, 2)}}
            </td>
            <td class="table-label-don text-left progress-col" v-if="!minimized">
                <v-progress-linear :value="getPercent(item)"
                                   :color="item.color"
                                   rounded
                                   height="16">
                </v-progress-linear>
            </td>
            <td class="table-label-don text-left">
                {{ getPercent(item) }}%
            </td>
        </tr>
        </tbody>
    </v-simple-table>
</template>

<script>

/* eslint-disable no-unused-vars,no-undef */

import {mapGetters} from "vuex";

export default {
    name: "TableStablecoins",

    props: {
        data: {
            type: Array,
            default: null,
        },

        minimized: {
            type: Boolean,
            default: false,
        },
    },

    components: {},

    data: () => ({
    }),

    computed: {
        ...mapGetters('network', ['explorerUrl']),
    },

    mounted() {
    },

    created() {
    },

    methods: {
        getPercent(item) {
            let sum = this.data.map(dataItem => dataItem.value).reduce((prev, next) => prev + next);

            return (item.value * 100 / sum).toFixed(1) - 0;
        },

        getTotal() {
            let sum = 0;
            this.data.forEach(dataItem => {
                sum += dataItem.value
            });

            return sum;
        },

        getLiquidationTotal() {
            let sum = 0;
            this.data.forEach(dataItem => {
                sum += dataItem.liquidationValue
            });

            return sum;
        },

        openTokenOnScan(hash) {
            if (hash && hash !== '') {
                window.open(this.explorerUrl + "token/" + hash, '_blank').focus();
            }
        }
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .table-header-don {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        line-height: 16px !important;
    }

    .table-label-don {
        font-style: normal !important;
        font-weight: 300 !important;
        font-size: 14px !important;
        line-height: 22px !important;
    }

    .current-table-row {
        height: 48px !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .table-header-don {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .table-label-don {
        font-style: normal !important;
        font-weight: 300 !important;
        font-size: 16px !important;
        line-height: 24px !important;
    }

    .current-table-row {
        height: 64px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .table-header-don {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .table-label-don {
        font-style: normal !important;
        font-weight: 300 !important;
        font-size: 16px !important;
        line-height: 24px !important;
    }

    .current-table-row {
        height: 64px !important;
    }
}

.current-table {
    width: 100% !important;
    background: none !important;
}

.current-table > .v-data-table__wrapper {
    overflow-y: scroll !important;
    -ms-overflow-style: none !important; /* for Internet Explorer, Edge */
    scrollbar-width: none !important; /* for Firefox */
}

.v-data-table__wrapper::-webkit-scrollbar {
    display: none !important;
}

.table-header-don {
     font-family: 'Roboto', sans-serif !important;
     font-feature-settings: 'pnum' on, 'lnum' on !important;
     color: var(--third-gray-text) !important;
 }

.table-label-don {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: var(--secondary-gray-text) !important;
}

.table-label-don {
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

.current-table-row-header {
    height: 50px !important;
}

.high-label {
    color: #22ABAC !important;
}

.icon-img-link {
    width: 20px !important;
    height: 20px !important;
    cursor: pointer;
}

.link-label {
    display: inline-flex !important;
}
</style>

<template>
    <v-simple-table class="current-table" dark>
        <thead>
        <tr class="current-table-row-header">
            <th class="table-header-pools" width="1%" v-if="!minimized"></th>
            <th class="table-header-pools text-left">
                Strategy
            </th>
            <th class="table-header-pools text-left">
                Net Asset Value (USDC)
                <!-- TODO: add info -->
            </th>
            <th class="table-header-pools text-left" v-if="!minimized">
                Liquidation value (USDC)
                <!-- TODO: add info -->
            </th>
            <th class="table-header-pools text-left" :class="minimized ? 'text-right' : 'text-left'" :width="minimized ? '' : '180px'" :colspan="minimized ? 2 : 1">
                Percent in portfolio
            </th>
            <th class="table-header-pools" v-if="!minimized"></th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="item in data" :key="item.label" class="current-table-row">
            <td class="table-label-pools text-right" v-if="!minimized">
                <div class="color-rectangle" :style="{background: item.color}"></div>
            </td>
            <td class="table-label-pools text-left">
                <label @click="openInNewTab(item.link)" class="link-label">
                    {{ item.label }}
                    <v-img class="icon-img-link ml-2" v-if="!minimized" :src="require('@/assets/icon/out-white.svg')"/>
                </label>
            </td>
            <td class="table-label-pools text-left">
                ${{ $utils.formatMoney(item.value, 2)}}
            </td>
            <td class="table-label-pools text-left" v-if="!minimized">
                ${{ $utils.formatMoney(item.liquidationValue, 2)}}
            </td>
            <td class="table-label-pools text-left progress-col">
                <v-progress-linear :value="getPercent(item)"
                                   :color="item.color"
                                   rounded
                                   v-if="!minimized"
                                   height="16">
                </v-progress-linear>
            </td>
            <td class="table-label-pools text-left">
                {{ getPercent(item) }}%
            </td>
        </tr>
        <tr class="current-table-row-total">
            <td class="table-empty" v-if="!minimized"></td>
            <td class="table-label-total-pools text-left">
                Total
            </td>
            <td class="table-label-total-pools text-left" :colspan="minimized ? 3 : 1">
                ${{ $utils.formatMoney(getTotal(), 2)}}
            </td>
            <td class="table-label-total-pools text-left" v-if="!minimized">
                ${{ $utils.formatMoney(getLiquidationTotal(), 2)}}
            </td>
            <td class="table-empty" v-if="!minimized"></td>
            <td class="table-empty" v-if="!minimized"></td>
        </tr>
        <tr class="current-table-row-total-usd-plus">
            <td class="table-empty" v-if="!minimized"></td>
            <td class="table-label-total-pools text-left">
                Total USD+ in circulation
            </td>
            <td class="table-label-total-pools text-left" :colspan="minimized ? 3 : 1">
                ${{ $utils.formatMoney(totalUsdPlusValue, 2)}}
            </td>
            <td class="table-empty" v-if="!minimized"></td>
            <td class="table-empty" v-if="!minimized"></td>
            <td class="table-empty" v-if="!minimized"></td>
        </tr>
        </tbody>
    </v-simple-table>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";

/* eslint-disable no-unused-vars,no-undef */

export default {
    name: "Table",

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

    data: () => ({}),

    computed: {
        ...mapGetters("profile", ['totalUsdPlusValue', 'currentTotalData', 'totalUsdPlus', 'loadingCurrentTotalData']),
    },

    mounted() {
    },

    created() {
    },

    methods: {
        ...mapActions([]),

        ...mapMutations([]),

        getPercent(item) {
            let sum = this.data.map(dataItem => dataItem.value).reduce((prev, next) => prev + next);

            return (item.value * 100 / sum).toFixed(0) - 0;
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

        openInNewTab(url) {
            if (url && url !== '') {
                window.open(url, '_blank').focus();
            }
        }
    }
}
</script>

<style>

/* mobile */
@media only screen and (max-width: 1400px) {

    .table-header-pools {
        font-family: 'Lato', sans-serif !important;
        font-style: normal !important;
        font-weight: 700 !important;
        line-height: 22px !important;
        font-size: 14px !important;
        color: #4C586D !important;
    }

    .table-label-pools {
        font-family: 'Lato', sans-serif !important;
        color: white !important;
        font-style: normal !important;
        font-weight: 400 !important;
        line-height: 24px !important;
        font-size: 14px !important;
    }

    .table-label-total-pools {
        font-family: 'Lato', sans-serif !important;
        color: white !important;
        font-style: normal !important;
        font-weight: 600 !important;
        line-height: 24px !important;
        font-size: 16px !important;
    }

    .current-table-row, .current-table-row-total {
        height: 48px !important;
    }
}

@media only screen and (min-width: 1400px) {

    .table-header-pools {
        font-family: 'Lato', sans-serif !important;
        font-style: normal !important;
        font-weight: 600 !important;
        line-height: 24px !important;
        font-size: 16px !important;
        color: #4C586D !important;
    }

    .table-label-pools {
        font-family: 'Lato', sans-serif !important;
        color: white !important;
        font-style: normal !important;
        font-weight: 400 !important;
        line-height: 28px !important;
        font-size: 18px !important;
    }

    .table-label-total-pools {
        font-family: 'Lato', sans-serif !important;
        color: white !important;
        font-style: normal !important;
        font-weight: 600 !important;
        line-height: 28px !important;
        font-size: 18px !important;
    }

    .current-table-row, .current-table-row-total {
        height: 70px !important;
    }
}

.current-table {
    width: 100% !important;
    background: none !important;
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

.color-rectangle {
    width: 20px;
    height: 20px;
    border-radius: 4px;
}

.current-table-row-total-usd-plus, .current-table-row-header {
    height: 24px !important;
}

.progress-col > .v-progress-linear > .v-progress-linear__buffer {
    background-color: #29323E !important;
}

.progress-col > .v-progress-linear > .v-progress-linear__determinate {
    left: 0 !important;
    right: auto !important;
}

.open-link-btn {
    cursor: pointer !important;
    background: none !important;
    display: flex !important;
    line-height: 24px;
}

.icon-img-link {
    width: 24px !important;
    height: 24px !important;
    margin-top: 2px;
}

.link-label {
    display: inline-flex !important;
}
</style>
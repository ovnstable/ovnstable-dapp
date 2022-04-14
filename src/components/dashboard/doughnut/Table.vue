<template>
    <v-simple-table class="current-table" dark>
        <thead>
        <tr class="current-table-row-header">
            <th class="table-header" width="1%"></th>
            <th class="table-header text-left">
                Strategy
            </th>
            <th class="table-header text-left">
                Net Asset Value (USDC)
                <!-- TODO: add info -->
            </th>
            <th class="table-header text-left">
                Liquidation value (USDC)
                <!-- TODO: add info -->
            </th>
            <th class="table-header text-left" width="180px">
                Percent in portfolio
            </th>
            <th class="table-header"></th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="item in data" :key="item.label" class="current-table-row">
            <td class="table-label text-right">
                <div class="color-rectangle" :style="{background: item.color}"></div>
            </td>
            <td class="table-label text-left" @click="openInNewTab(item.link)">
                <label @click="openTokenOnScan(item.link)" class="link-label">
                    {{ item.label }}
                    <v-img class="icon-img-link ml-2" :src="require('@/assets/icon/out-white.svg')"/>
                </label>
            </td>
            <td class="table-label text-left">
                ${{ $utils.formatMoney(item.value, 2)}}
            </td>
            <td class="table-label text-left">
                ${{ $utils.formatMoney(item.liquidationValue, 2)}}
            </td>
            <td class="table-label text-left progress-col">
                <v-progress-linear :value="getPercent(item)"
                                   :color="item.color"
                                   rounded
                                   height="16">
                </v-progress-linear>
            </td>
            <td class="table-label text-left">
                {{ getPercent(item) }}%
            </td>
        </tr>
        <tr class="current-table-row-total">
            <td class="table-empty"></td>
            <td class="table-label-total text-left">
                Total
            </td>
            <td class="table-label-total text-left">
                ${{ $utils.formatMoney(getTotal(), 2)}}
            </td>
            <td class="table-label-total text-left">
                ${{ $utils.formatMoney(getLiquidationTotal(), 2)}}
            </td>
            <td class="table-empty"></td>
            <td class="table-empty"></td>
        </tr>
        <tr class="current-table-row-total-usd-plus">
            <td class="table-empty"></td>
            <td class="table-label-total text-left">
                Total USD+ in circulation
            </td>
            <td class="table-label-total text-left">
                ${{ $utils.formatMoney(totalUsdPlusValue, 2)}}
            </td>
            <td class="table-empty"></td>
            <td class="table-empty"></td>
            <td class="table-empty"></td>
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

        openTokenOnScan(hash) {
            if (hash && hash !== '') {
                window.open("https://polygonscan.com/token/" + hash, '_blank').focus();
            }
        }
    }
}
</script>

<style>

.current-table {
    width: 100% !important;
    background: none !important;
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

.color-rectangle {
    width: 20px;
    height: 20px;
    border-radius: 4px;
}

.current-table-row, .current-table-row-total {
    height: 70px !important;
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
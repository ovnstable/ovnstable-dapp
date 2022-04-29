<template>
    <v-simple-table class="current-table" dark>
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
                <label class="link-label" style="margin-left: -20px !important;">
                    {{ item.label }}
                    <v-img v-if="!minimized" class="icon-img-link ml-2" :src="require('@/assets/icon/out-white.svg')"/>
                </label>
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

import {mapActions, mapGetters, mapMutations} from "vuex";

/* eslint-disable no-unused-vars,no-undef */

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
                window.open("https://polygonscan.com/token/" + hash, '_blank').focus();
            }
        }
    }
}
</script>

<style>

/* mobile */
@media only screen and (max-width: 1400px) {

    .table-header-don {
        font-family: 'Lato', sans-serif !important;
        font-style: normal !important;
        font-weight: 700 !important;
        line-height: 22px !important;
        font-size: 14px !important;
        color: #4C586D !important;
    }

    .table-label-don {
        font-family: 'Lato', sans-serif !important;
        color: white !important;
        font-style: normal !important;
        font-weight: 400 !important;
        line-height: 24px !important;
        font-size: 14px !important;
    }
    .current-table-row {
        height: 48px !important;
    }

    .currency-icon {
        width: 24px;
        height: 24px;
    }
}

@media only screen and (min-width: 1400px) {

    .table-header-don {
        font-family: 'Lato', sans-serif !important;
        font-style: normal !important;
        font-weight: 600 !important;
        line-height: 24px !important;
        font-size: 16px !important;
        color: #4C586D !important;
    }

    .table-label-don {
        font-family: 'Lato', sans-serif !important;
        color: white !important;
        font-style: normal !important;
        font-weight: 400 !important;
        line-height: 28px !important;
        font-size: 18px !important;
    }

    .current-table-row {
        height: 70px !important;
    }

    .currency-icon {
        width: 40px;
        height: 40px;
    }
}

.current-table {
    width: 100% !important;
    background: none !important;
}

.table-header-don, .table-label-don {
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

.icon-img {
    width: 24px !important;
    height: 24px !important;
}

.high-label {
    color: #23DD00 !important;
}

.icon-img-link {
    width: 24px !important;
    height: 24px !important;
    margin-top: 2px;
    cursor: pointer;
}

.link-label {
    display: inline-flex !important;
}
</style>
<template>
    <v-simple-table class="current-table" dark height="40vh" dense>
        <template v-slot:default>
            <thead>
            <tr>
                <th class="table-label table-header-col">
                    Strategy
                </th>
                <th class="table-label table-header-col text-right">
                    Net Asset Value (USDC)
                </th>
                <th class="table-label table-header-col text-right">
                    Liquidation value (USDC)
                </th>
            </tr>
            </thead>

            <tbody>
            <template v-for="item in currentTotalData">
                <tr>
                    <td class="table-label table-col-value">
                        {{ item.name }}
                    </td>
                    <td class="table-label table-col-value text-right" v-if="!minimized">
                        {{ $utils.formatMoney(item.netAssetValue, 2)}}
                    </td>
                    <td class="table-label table-col-value text-right">
                        {{ $utils.formatMoney(item.liquidationValue, 2)}}
                    </td>
                </tr>
            </template>
            <tr>
                <td class="table-label table-col-value">
                    <b>Total</b>
                </td>
                <td class="table-label table-col-value text-right" v-if="!minimized">
                    <b>{{ $utils.formatMoney(netAssetValueTotal, 2)}}</b>
                </td>
                <td class="table-label table-col-value text-right">
                    <b>{{ $utils.formatMoney(liquidationValueTotal, 2)}}</b>
                </td>
            </tr>
            <tr>
                <td class="table-label table-col-value">
                    <b>Total USD+ in circulation</b>
                </td>
                <td class="table-label table-col-value text-right">
                    <b>{{ $utils.formatMoney(totalSupply, 2) }}</b>
                </td>
                <td></td>
            </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import BigNumber from "bignumber.js";

export default {
    name: "CurrentTotalDataTable",

    components: {},

    data: () => ({}),

    computed: {
        ...mapGetters("profile", ['currentTotalData', 'totalUsdPlus', 'loadingCurrentTotalData']),
        ...mapGetters("web3", ['web3']),

        totalSupply: function (){
            return new BigNumber(this.totalUsdPlus.totalSupply / 10 ** 6).toFixed(6);
        },

        liquidationValueTotal: function () {
            let value = new BigNumber(0);

            if (this.currentTotalData) {
                for (let key in this.currentTotalData) {
                    let item = this.currentTotalData[key];
                    if (item.liquidationValue){
                        value = value.plus(new BigNumber(item.liquidationValue))
                    }
                }
            }

            return value.toFixed(6);
        },

        netAssetValueTotal: function () {
            let value = new BigNumber(0);

            if (this.currentTotalData) {
                for (let key in this.currentTotalData) {
                    let item = this.currentTotalData[key];
                    if (item.netAssetValue){
                        value = value.plus(new BigNumber(item.netAssetValue))
                    }
                }
            }

            return value.toFixed(6);
        },
    },

    methods: {},
}
</script>

<style>

.current-table {
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

<template>
    <v-container class="governance-subpage-container">
        <v-row>
            <v-data-table
                :loading="financeLoading"
                loading-text="Loading M2M items"
                dense
                :items="m2mItems"
                :headers="headersM2M"
                hide-default-footer
                disable-filtering
                disable-pagination
            >
                <template v-slot:body="{items}">
                    <tbody>
                    <tr v-for="item in items" v-bind:key="item.name">
                        <td class="strategy-name-col" @click="openOnScan(item.address)">
                            {{ item.name }}
                        </td>
                        <td class="text-right">
                            ${{ $utils.formatMoney(item.netAssetValue, 2) }}
                        </td>
                        <td class="text-right">
                            ${{ $utils.formatMoney(item.liquidationValue, 2) }}
                        </td>
                        <td class="text-right">
                            <b>{{ item.currentWeight }}</b>
                        </td>
                        <td>
                            <v-row class="fill-height" align="center" justify="center">
                                <v-text-field
                                    class="m2m-field"
                                    :rules="[rules.required, checkNumber]"
                                    dense
                                    outlined
                                    v-model="item.minWeight"
                                    :disabled="financeLoading || !hasChangeAccount">
                                </v-text-field>
                            </v-row>
                        </td>
                        <td>
                            <v-row class="fill-height" align="center" justify="center">
                                <v-text-field
                                    class="m2m-field"
                                    :rules="[rules.required, checkNumber]"
                                    dense
                                    outlined
                                    v-model="item.targetWeight"
                                    :disabled="financeLoading || !hasChangeAccount">
                                </v-text-field>
                            </v-row>
                        </td>
                        <td>
                            <v-row class="fill-height" align="center" justify="center">
                                <v-text-field
                                    class="m2m-field"
                                    :rules="[rules.required, checkNumber]"
                                    dense
                                    outlined
                                    v-model="item.maxWeight"
                                    :disabled="financeLoading || !hasChangeAccount"
                                >
                                </v-text-field>
                            </v-row>
                        </td>
                        <td>
                            <v-switch
                                :disabled="financeLoading || !hasChangeAccount"
                                v-model="item.enabled"
                            ></v-switch>
                        </td>
                        <td>
                            <v-switch
                                :disabled="financeLoading || !hasChangeAccount"
                                v-model="item.enabledReward"
                            ></v-switch>
                        </td>
                        <td>
                            <v-row class="fill-height" align="center" justify="center">
                                <v-text-field
                                    class="m2m-field"
                                    :rules="[rules.required, checkNumber]"
                                    dense
                                    outlined
                                    v-model="item.riskFactor"
                                    :disabled="financeLoading || !hasChangeAccount">
                                </v-text-field>
                            </v-row>
                        </td>
                    </tr>

                    <tr>
                        <td :colspan="networkId === 137 ? 10 : 9"></td>
                    </tr>

                    <tr>
                        <td>
                            <b>Total</b>
                        </td>
                        <td class="text-right">
                            <b>${{ $utils.formatMoney(m2mTotal, 2) }}</b>
                        </td>
                        <td class="text-right">
                            <b>${{ $utils.formatMoney(totalLiquidationSum, 2) }}</b>
                        </td>
                        <td :colspan="networkId === 137 ? 7 : 6"></td>
                    </tr>

                    <tr>
                        <td>
                            <b>Total USD+</b>
                        </td>
                        <td class="text-right">
                            <b>${{ $utils.formatMoney(totalUsdPlusValue, 2) }}</b>
                        </td>
                        <td :colspan="networkId === 137 ? 7 : 6"></td>
                    </tr>
                    </tbody>
                </template>
            </v-data-table>
        </v-row>
    </v-container>
</template>

<script>

import { usdPlusApiService } from "@/services/usd-plus-api-service";
import * as numberUtils from '@/utils/number-utils'

export default {
    name: "ChangeWeightPanel",
    props: [
        'm2mItems', 'm2mTotal', 'financeLoading', 'hasChangeAccount', 'usdPlusLiquidityIndex',
        'contracts',
        'account',
        'explorerUrl', 'networkId', 'apiUrl', 'networkName',
        'contractType'
    ],

    data: () => ({
        headersM2M: [
            {text: 'Name', value: 'name', width: '170px'},
            {text: 'Net Asset Value', value: 'netAssetValue', width: '140px', align: 'end'},
            {text: 'Liquidation Value', value: 'liquidationValue', width: '140px', align: 'end'},
            {text: 'Current Weight', value: 'currentWeight', align: 'end'},
            {text: 'Min Weight', value: 'minWeight'},
            {text: 'Target Weight', value: 'targetWeight'},
            {text: 'Max Weight', value: 'maxWeight'},
            {text: 'Enabled', value: 'enabled'},
            {text: 'Enabled Reward', value: 'enabledReward'},
        ],
        totalUsdPlusValue: null,

        rules: {
            required: val => (val === 0 || !!val) || 'Need to be filled',
        },
    }),

    watch: {
        networkId: function (newValue, oldValue) {
            this.updateHeaders();
            this.loadData();
        },

        account: function (newValue, oldValue) {
            this.loadData();
        },

        contractType: function (val, oldVal) {
            this.loadData();
        }
    },

    computed: {

        totalLiquidationSum: function () {

            let result = 0.0;

            this.m2mItems.forEach(item => {
              console.log("m2mItems: ", this.m2mItems, item);

                if (item && item.liquidationValue) {
                    result += parseFloat(item.liquidationValue);
                }
            });

            return result;
        },
    },

    created() {
        this.updateHeaders();
        this.loadData();
    },

    methods: {
        openOnScan(address) {
            let url = this.explorerUrl + "address/" + address;
            window.open(url, '_blank').focus();
        },

        shortAddress(address) {
            if (address) {
                return address.substring(0, 5) + '...' + address.substring(address.length - 4);
            } else {
                return null;
            }
        },

        checkNumber(number) {
            if (number) {
                try {
                    number = parseFloat(number);
                } catch (e) {
                    return "Invalid number";
                }

                if (0.0 <= number && number <= 100.0) {
                    return true;
                } else {
                    return "Invalid number";
                }
            } else {
                return true;
            }
        },

        updateHeaders() {
            if (this.networkId === 137 || this.networkId === 42161) {
                if (!this.headersM2M.find(value => value.text === 'Risk Factor')) {
                    this.headersM2M.push({text: 'Risk Factor', value: 'riskFactor'});
                }
            } else {
                this.headersM2M = this.headersM2M.filter(value => value.text !== 'Risk Factor');
            }
        },
        loadData() {
          this.loadTotalUsdPlusPlus();
        },
        loadTotalUsdPlusPlus() {
          if (!this.account) {
            this.loadApiTotalUsdPlusValue();
            return;
          }

          this.loadBlockchainTotalUsdPlusValue();
        },
        loadApiTotalUsdPlusValue() {
           let url = this.apiUrl + `/${this.networkName}/${this.contractType.toLowerCase()}`

          usdPlusApiService.getTotalUsdPlus(url)
              .then(data => {
                this.totalUsdPlusValue = data;
              })
              .catch(e => {
                console.error("Error when load " + this.contractType + " total in governance", e);
              });

        },
        async loadBlockchainTotalUsdPlusValue() {
          setTimeout(async () => {
                let contractTokenPlus = this.getTokenPlusContract();
                if (!contractTokenPlus) {
                    console.log("loadBlockchainTotalUsdPlusValue error, contractTokenPlus not found")
                    return
                }

                let assetDecimals = (await contractTokenPlus.methods.decimals().call()) * 1;
                let blockchainValue = await contractTokenPlus.methods.totalSupply().call();
                let fromAsset6 = assetDecimals === 6;
                this.totalUsdPlusValue = (fromAsset6 ? numberUtils._fromE6(blockchainValue.toString()) : numberUtils._fromE18(blockchainValue.toString()))
          }, 3000)
        },

        getTokenPlusContract() {
            if (this.contractType === 'USD+') {
                return this.contracts.usdPlus;
            }

            if (this.contractType === 'DAI+') {
                return  this.contracts.daiPlus;
            }

            if (this.contractType === 'USDT+') {
                return this.contracts.usdtPlus;
            }

            console.log("Error when load blockchain total values contract type not found: ", this.contractType)
            return null;
        }
    }
}
</script>

<style scoped>

.governance-subpage-container {
    min-width: 100% !important;
}

.strategy-name-col {
    cursor: pointer !important;
}

.strategy-name-col:hover {
    text-decoration: underline !important;
}
</style>

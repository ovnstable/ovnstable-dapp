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
                    <tr v-for="(item, i) in items">
                        <td>{{ item.name }}</td>
                        <td>{{ shortAddress(item.address) }}</td>
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
                            <v-text-field
                                type="number"
                                :rules="[rules.required, checkNumber]"
                                dense
                                outlined
                                v-model="item.minWeight"
                                :disabled="financeLoading || !hasChangeAccount">
                            </v-text-field>
                        </td>
                        <td>
                            <v-text-field
                                type="number"
                                :rules="[rules.required, checkNumber]"
                                dense
                                outlined
                                v-model="item.maxWeight"
                                :disabled="financeLoading || !hasChangeAccount"
                            >
                            </v-text-field>
                        </td>
                        <td>
                            <v-text-field
                                type="number"
                                :rules="[rules.required, checkNumber]"
                                dense
                                outlined
                                v-model="item.targetWeight"
                                :disabled="financeLoading || !hasChangeAccount">
                            </v-text-field>
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
                    </tr>

                    <tr>
                        <td>
                            <b>Total</b>
                        </td>
                        <td></td>
                        <td class="text-right">
                            <b>${{ $utils.formatMoney(m2mTotal, 2) }}</b>
                        </td>
                        <td class="text-right">
                            <b>${{ $utils.formatMoney(totalLiquidationSum, 2) }}</b>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tbody>
                </template>
            </v-data-table>
        </v-row>
    </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "ChangeWeightPanel",

    data: () => ({
        headersM2M: [
            {text: 'Name', value: 'name', width: '200px'},
            {text: 'Address', value: 'address'},
            {text: 'Net Asset Value', value: 'netAssetValue', width: '140px', align: 'end'},
            {text: 'Liquidation Value', value: 'liquidationValue', width: '140px', align: 'end'},
            {text: 'Current Weight', value: 'currentWeight', width: '80px', align: 'end'},
            {text: 'Min Weight', value: 'minWeight'},
            {text: 'Max Weight', value: 'maxWeight'},
            {text: 'Target Weight', value: 'targetWeight'},
            {text: 'Enabled', value: 'enabled'},
            {text: 'Enabled Reward', value: 'enabledReward'},
        ],

        rules: {
            required: val => (val === 0 || !!val) || 'Need to be filled',
        },
    }),

    computed: {
        ...mapGetters('governance', ['m2mItems', 'm2mTotal', 'financeLoading', 'hasChangeAccount']),
        ...mapGetters('network', ['explorerUrl']),

        totalLiquidationSum: function () {

            let result = 0.0;

            this.m2mItems.forEach(item => {
                if (item && item.liquidationValue) {
                    result += item.liquidationValue;
                }
            });

            return result;
        },
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
    }
}
</script>

<style scoped>

.governance-subpage-container {
    min-width: 100% !important;
}
</style>

<template>
    <v-container class="governance-page-container">
        <v-row justify="center">
            <h1>Finance</h1>
        </v-row>

        <v-row>
            <template>
                <v-tabs>
                    <v-tab v-if="contracts && contracts.usdPlus" @click="setTab('USD+')">Usd+</v-tab>
                    <v-tab v-if="contracts && contracts.daiPlus" @click="setTab('DAI+')">Dai+</v-tab>
                    <v-tab v-if="contracts && contracts.usdtPlus" @click="setTab('USDT+')">Usdt+</v-tab>
                </v-tabs>
            </template>
        </v-row>

        <v-row >
            <v-col cols="10">
                <ChangeWeightPanel
                    :m2m-items="m2mItems"
                    :m2m-total="m2mTotal"
                    :finance-loading="financeLoading"
                    :has-change-account="hasChangeAccount"
                    :usd-plus-liquidity-index="usdPlusLiquidityIndex"
                    :contracts="contracts"
                    :account="account"
                    :explorer-url="explorerUrl"
                    :network-id="networkId"
                    :api-url="apiUrl"
                    :network-name="networkName"
                    :contract-type="tab"/>
            </v-col>
            <v-col cols="2">
                <WeightActionsPanel
                    :m2m-items="m2mItems"
                    :finance-loading="financeLoading"
                    :has-change-account="hasChangeAccount"
                    :contract-type="tab"/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ChangeWeightPanel from "../../components/governance/finance/ChangeWeightPanel";
import {mapActions, mapGetters} from "vuex";
import WeightActionsPanel from "@/components/governance/finance/WeightActionsPanel";

export default {
    name: "Finance",
    components: {WeightActionsPanel, ChangeWeightPanel},
    data() {
        return {
            tab: 'USD+'
        }
    },

    computed: {
        ...mapGetters('governance', ['m2mItems', 'm2mTotal', 'financeLoading', 'hasChangeAccount', 'usdPlusLiquidityIndex', 'hasChangeAccount']),
        ...mapGetters('web3', ['contracts']),
        ...mapGetters('accountData', ['account']),
        ...mapGetters('network', ['explorerUrl', 'networkId', 'appApiUrl', 'apiUrl', 'networkName']),
    },

    watch: {
        contracts: async function (newVal, oldVal) {
            await this.getFinance(this.tab);
        },
    },

    methods: {
        ...mapActions('governance', ['getFinance']),
        setTab(tab) {
            this.tab = tab;
            this.getFinance(this.tab);
        }
    },
}
</script>

<style scoped>

.governance-page-container {
    min-width: 96% !important;
}
</style>

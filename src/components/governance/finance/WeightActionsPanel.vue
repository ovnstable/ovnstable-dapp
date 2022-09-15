<template>
    <v-container class="governance-subpage-container">
        <template v-if="m2mItems != null">
            <v-row class="ma-0 mt-n3">
                <v-btn @click="updateM2MItems" outlined :disabled="financeLoading">
                    <v-icon>mdi-refresh</v-icon>
                    &nbsp;Refresh M2M
                </v-btn>
            </v-row>
            <v-row class="ma-0 mt-4">
                <v-btn @click="rebalanceAction" outlined :disabled="financeLoading || !hasChangeAccount">
                    Rebalance
                </v-btn>
            </v-row>
            <v-row class="ma-0 mt-4">
                <v-btn @click="changeWeightsAction"
                       outlined
                       :disabled="!hasChangeAccount ||financeLoading || !weightsIsBtnEnabled || !weightsIsBtnEnabledMinMax || !weightsIsBtnEnabledTargetWeight || !weightsIsBtnEnabledTurnOn">
                    Change Weights
                </v-btn>
            </v-row>
            <v-row class="ma-0 mt-1">
                <label class="error-label" v-if="!hasChangeAccount">Current wallet is not Portfolio Agent</label>
            </v-row>
            <v-row class="ma-0 mt-1">
                <label class="error-label" v-if="!financeLoading && !weightsIsBtnEnabledTurnOn">At least one strategy or reward should be enabled</label>
            </v-row>
            <v-row class="ma-0 mt-1">
                <label class="error-label" v-if="!financeLoading && !weightsIsBtnEnabled">The sum of all target weights must be equal to 100</label>
            </v-row>
            <v-row class="ma-0 mt-1">
                <label class="error-label" v-if="!financeLoading && !weightsIsBtnEnabledMinMax">Min weight must be lower than max weight</label>
            </v-row>
            <v-row class="ma-0 mt-1">
                <label class="error-label" v-if="!financeLoading && !weightsIsBtnEnabledTargetWeight">Target weight must be between min and max weights</label>
            </v-row>
        </template>
    </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";

export default {
    name: "WeightActionsPanel",
    components: {Tooltip},
    data: () => ({
    }),

    computed: {
        ...mapGetters('governance', ['m2mItems', 'financeLoading', 'hasChangeAccount']),

        weightsIsBtnEnabled: function () {
            let targetWeightSum = 0.0;

            this.m2mItems.forEach(item => {
                if (item && item.targetWeight && (item.enabled || item.enabledReward)) {
                    targetWeightSum += parseFloat(item.targetWeight);
                }
            })

            return (targetWeightSum == 100);
        },

        weightsIsBtnEnabledMinMax: function () {

            let result = true;

            this.m2mItems.forEach(item => {
                if (item && item.minWeight && item.maxWeight) {
                    if (parseFloat(item.minWeight) > parseFloat(item.maxWeight)) {
                        result = false;
                    }
                }
            });

            return result;
        },

        weightsIsBtnEnabledTargetWeight: function () {

            let result = true;

            this.m2mItems.forEach(item => {
                if (item && item.minWeight && item.maxWeight && item.targetWeight) {
                    if ((parseFloat(item.minWeight) > parseFloat(item.targetWeight)) || (parseFloat(item.maxWeight) < parseFloat(item.targetWeight))) {
                        result = false;
                    }
                }
            });

            return result;
        },

        weightsIsBtnEnabledTurnOn: function () {

            let result = 0;

            this.m2mItems.forEach(item => {
                if (item && (item.enabled || item.enabledReward)) {
                    result++;
                }
            });

            return result > 0;
        },
    },

    methods: {
        ...mapActions('governance', ['setStrategiesM2MWeights', 'rebalancePortfolio', 'getFinance']),

        async changeWeightsAction() {
            await this.setStrategiesM2MWeights(this.m2mItems);
            await this.getFinance();
        },

        async rebalanceAction() {
            await this.rebalancePortfolio();
            await this.getFinance();
        },

        updateM2MItems() {
            this.getFinance();
        },
    }
}
</script>

<style scoped>

.governance-subpage-container {
    min-width: 100% !important;
}

.error-label {
    color: #CF3F92;
    font-family: 'Raleway', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 20px;
}

</style>

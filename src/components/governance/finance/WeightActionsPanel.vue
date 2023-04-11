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
                <v-btn @click="rebalanceAction"
                       outlined
                       :disabled="financeLoading || !hasChangeAccount">
                    Rebalance
                </v-btn>
            </v-row>
            <v-row class="ma-0 mt-4">
                <v-btn @click="changeWeightsAction"
                       outlined
                       :disabled="!hasChangeAccount || financeLoading || !weightsIsBtnEnabled || !weightsIsBtnEnabledMinMax || !weightsIsBtnEnabledTargetWeight">
                    Change Weights
                </v-btn>
            </v-row>
            <v-row class="ma-0 mt-1">
                <label class="error-label" v-if="!hasChangeAccount">Current wallet is not Portfolio Agent</label>
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

        <ErrorModal/>
    </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";
import {axios} from "@/plugins/http-axios";
import ErrorModal from "@/components/common/modal/action/ErrorModal";

export default {
    name: "WeightActionsPanel",
    components: {ErrorModal, Tooltip},
    props: [
        'm2mItems', 'financeLoading', 'hasChangeAccount', 'contractType'
    ],
    data: () => ({
    }),

    computed: {

        weightsIsBtnEnabled: function () {
            let targetWeightSum = 0.000;

            this.m2mItems.forEach(item => {
                if (item && item.targetWeight) {
                    targetWeightSum += parseFloat(item.targetWeight);
                }
            })

            return (targetWeightSum.toFixed(3) == 100.000);
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
    },

    watch: {

    },

    methods: {
        ...mapActions('governance', ['setStrategiesM2MWeights', 'estimateSetStrategiesM2MWeights', 'rebalancePortfolio', 'estimateRebalancePortfolio', 'getFinance']),
        ...mapActions("errorModal", ['showErrorModal', 'showErrorModalWithMsg']),

        async changeWeightsAction() {

            let estimatedGasValue = await this.estimateSetStrategiesM2MWeights({weights: this.m2mItems, contractType: this.contractType});

            if (estimatedGasValue) {
                if (estimatedGasValue.haveError) {
                    this.showErrorModalWithMsg({errorType: 'governanceChangeWeights', errorMsg: estimatedGasValue});
                }

                await this.setStrategiesM2MWeights({weights: this.m2mItems, contractType: this.contractType});
                await this.getFinance(this.contractType);
            } else {
                this.showErrorModal('governanceChangeWeights');
            }
        },

        async rebalanceAction() {

            let estimatedGasValue = await this.estimateRebalancePortfolio(this.contractType);

            if (estimatedGasValue) {
                if (estimatedGasValue.haveError) {
                    this.showErrorModalWithMsg({errorType: 'governanceRebalance', errorMsg: estimatedGasValue});
                }

                await this.rebalancePortfolio(this.contractType);
                await this.getFinance(this.contractType);
            } else {
                this.showErrorModal('governanceRebalance');
            }
        },

        updateM2MItems() {
            this.getFinance(this.contractType);
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

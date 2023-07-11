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
            <v-row class="ma-0 mt-4">
                <v-btn @click="toggleZeroStrategies(!isZeroStrategiesShow)"
                       outlined
                       :disabled="financeLoading">
                    <span v-if="isZeroStrategiesShow">
                        Hide
                    </span>
                    <span v-else>
                        Show
                    </span>
                    Strategies
                </v-btn>
            </v-row>
            <v-row class="ma-0 mt-4">
                <v-btn @click="swapWeightsAction()" outlined :disabled="financeLoading">
                    Swap Weights
                </v-btn>
            </v-row>
            <v-row class="ma-0 mt-4">
                <label>Total Target Weight: </label>
            </v-row>
            <v-row class="ma-0 mt-1">
                {{ $utils.formatMoney(totalTargetWeight, 3) }}
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
        'm2mItems',
        'financeLoading',
        'hasChangeAccount',
        'contractType',
        'hideZeroStrategiesAction',
        'showZeroStrategiesAction'
    ],
    data: () => ({
        isZeroStrategiesShow: false
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

        totalTargetWeight: function() {
            let result = 0.000;

            this.m2mItems.forEach(item => {
                console.log("m2mItems: ", this.m2mItems, item);

                if (item && item.targetWeight) {
                    result += parseFloat(item.targetWeight);
                }
            });

            return result;
        }
    },

    watch: {

    },

    methods: {
        ...mapActions('governance', ['setStrategiesM2MWeights', 'estimateSetStrategiesM2MWeights', 'rebalancePortfolio', 'estimateRebalancePortfolio', 'getFinance']),
        ...mapActions("errorModal", ['showErrorModal', 'showErrorModalWithMsg']),

        swapWeightsAction() {
            console.debug("Start swapWeightsAction")
            let temp = 0;
            for (let i = 0; i < this.m2mItems.length; i++) {
                let item = this.m2mItems[i];
                item.targetWeight = parseFloat(item.currentWeight).toFixed(3);

                console.debug("Target weight swapped: ", item)

                temp += parseFloat(item.targetWeight);
            }
            console.debug("Check sum of target weights: ", temp)
        },

        async changeWeightsAction() {
            console.debug("ChangeWeightsAction: ", this.m2mItems, this.contractType)
            let estimatedGasValue = await this.estimateSetStrategiesM2MWeights({weights: this.m2mItems, contractType: this.contractType});
            console.debug("Change weight button clicked: ", estimatedGasValue)

            if (estimatedGasValue) {
                if (estimatedGasValue.haveError) {
                    this.showErrorModalWithMsg({errorType: 'governanceChangeWeights', errorMsg: estimatedGasValue});
                }
                console.debug("If error in estimatedGasValue: ", estimatedGasValue)

                await this.setStrategiesM2MWeights({weights: this.m2mItems, contractType: this.contractType});
                console.debug("If error in StrategiesM2MWeights: ", this.m2mItems, this.contractType)
                await this.getFinance(this.contractType);
                console.debug("If error in GetFinance: ", this.contractType)
            } else {
                this.showErrorModal('governanceChangeWeights');
                console.debug("ShowErrorModal:")
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

        async updateM2MItems() {
            await this.getFinance(this.contractType);
            this.toggleZeroStrategies(this.isZeroStrategiesShow);
        },

        toggleZeroStrategies(isShow) {
            if (isShow) {
                this.showZeroStrategiesAction();
                this.isZeroStrategiesShow = isShow;
                return
            }

            this.hideZeroStrategiesAction()
            this.isZeroStrategiesShow = isShow;
        }

    }
}
</script>

<style scoped>

.governance-subpage-container {
    min-width: 100% !important;
    background-color: #FFFFFF !important;
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

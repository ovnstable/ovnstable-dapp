<template>
    <div>

        <div class="zap-steps-container">
            <v-row class="mt-5" :class="$wu.isFull() ? '' : 'mb-4'">
                <v-slider
                    readonly
                    class="step-slider"
                    color="#1C95E7"
                    track-color="var(--main-border)"
                    track-fill-color="#1C95E7"
                    tick-size="10"
                    min="0"
                    :max="stepLabels.length - 1"
                    v-model="step"
                    step="1"
                    ticks
                    :tick-labels="stepLabels"
                ></v-slider>
            </v-row>

            <!--            <div class="row">
                            <div class="col-3 step-container">
                                <div class="load-line"></div>
                                <div class="">
                                    <img src="/assets/icon/swap/step-passed.svg" class="step-image" alt="step passed">
                                    <div class="step-text">

                                    </div>
                                </div>
                            </div>
                            <div class="col-6 step-container">
                                <div class="load-line"></div>
                                <div class="text-center">
                                    <img v-if="approvedTokensCount===selectedInputTokens.length" src="/assets/icon/swap/step-passed.svg" class="step-image" alt="step passed">
                                    <img v-else src="/assets/icon/swap/step.svg" class="step-image" alt="step passed">
                                    <div class="step-text step-big-text">
                                        Approve tokens ({{approvedTokensCount}}/{{selectedInputTokens.length}})
                                    </div>
                                </div>
                            </div>
                            <div class="col-3 step-container">
                                <div class="load-line"></div>
                                <div class="text-right">
                                    <img src="/assets/icon/swap/step.svg" class="step-image" alt="step passed">
                                    <div class="step-text step-text-right">
                                        Stake LP
                                    </div>
                                </div>
                            </div>
                        </div>-->
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "ZapSteps",
    props: {
        selectedInputTokens: {
            type: Array,
            required: true
        },
        clickOnStake: {
            type: Boolean,
            required: true
        },
        currentZapPlatformContractType: {
            type: Object,
            required: true
        },
        additionalSwapStepType: {
            type: String,
            required: false // 'APPROVE', 'DEPOSIT'
        }
    },
    data() {
        return {

        }
    },
    computed: {
        stepLabels: function () {
            let approvesLabel = `Approve tokens (${this.approvedTokensCount}/${this.selectedInputTokens.length})`;

            if (this.currentZapPlatformContractType.type === 'LP_WITH_STAKE_IN_ONE_STEP') {
                return ['', approvesLabel, 'Stake LP'];
            }

            if (this.currentZapPlatformContractType.type === 'LP_STAKE_DIFF_STEPS') {
                return ['', approvesLabel, 'Deposit', 'Approve Gauge', 'Stake LP'];
            }

            console.error("Type zap not found for steps labels", this.currentZapPlatformContractType);
            return [];
        },
        step: function () {
            if (this.currentZapPlatformContractType.type === 'LP_WITH_STAKE_IN_ONE_STEP') {
                if (this.clickOnStake) {
                    return 2;
                }

                if (this.approvedTokensCount === this.selectedInputTokens.length) {
                    return 1;
                }

                return 1;
            }

            if (this.currentZapPlatformContractType.type === 'LP_STAKE_DIFF_STEPS') {
                if (this.additionalSwapStepType === 'APPROVE') {
                    return 3
                }

                if (this.additionalSwapStepType === 'DEPOSIT') {
                    return 4
                }

                if (this.clickOnStake) {
                    return 2;
                }

                if (this.approvedTokensCount === this.selectedInputTokens.length) {
                    return 1;
                }

                return 1;
            }

            console.error("this.currentZapPlatformContractType not found:", this.currentZapPlatformContractType);
            return 1;
        },
        approvedTokensCount: function () {
            return this.selectedInputTokens.filter(token => token.selectedToken.approveData.approved).length;
        }
    }
})
</script>


<style scoped>

</style>

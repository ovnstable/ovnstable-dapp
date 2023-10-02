
<template>
    <div>
        <div class="pt-2">
            <div class="row">
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <div class="title-step-container">
                            <div class="title-step-text">
                                claim and hold in wallet
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/claim-wallet.svg" alt="Benefit">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="step-container">
                        <div>
                            <div class="step-title">
                                benefit from ovn growth
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/benefit.svg" alt="Benefit">
                                </div>
                            </div>
                            <div class="step-container-separator"></div>
                        </div>

                        <div>
                            <div class="step-info-description info-group">
                                <div>
                                    Benefit from $OVN's potential price growth and governance features by simply holding OVN tokens in your wallet. Since we end of we sale token has shown growth.
                                </div>
                                <div class="pt-7">
                                    You can check it on <a href="https://dexscreener.com/base/0x61366a4e6b1db1b85dd701f2f4bfa275ef271197" target="_blank">Dexscreen</a>.
                                </div>
                            </div>


                            <div class="info-group" style="cursor: pointer">
                                <v-row @click="clickOnButton('HOLD')"
                                       class="ma-0 pt-4" justify="center" align="center">
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        v-if="currentStepType === 'CLAIM_REFUND'"
                                         @click="claimRefund">
                                        CLAIM AND HOLD REFUND
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'WAITING_FOR_CLAIM_BONUS'">
                                        WAITING CLAIM BONUS
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        v-else-if="currentStepType === 'CLAIM_BONUS'"
                                         @click="claimBonus">
                                        CLAIM AND HOLD BONUS
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'WAITING_FOR_CLAIM_SALES_FIRST_PART'">
                                        WAITING CLAIM
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        v-else-if="currentStepType === 'CLAIM_SALES_FIRST_PART'"
                                         @click="claimSalesPart1">
                                        CLAIM AND HOLD OVN (25%)
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'WAITING_FOR_CLAIM_VESTING'">
                                        WAITING CLAIM VESTING
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        v-else-if="currentStepType === 'CLAIM_VESTING'"
                                         @click="claimVesting">
                                        CLAIM AND HOLD VESTING
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'NOTHING_TO_DO'">
                                        VESTING FINISHED
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else>
                                        NOT STARTED
                                    </v-btn>
                                </v-row>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <div class="title-step-container title-step-container-premium">
                            <div class="title-step-text">
                                claim and farm on op
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/claim-farm-on.svg" alt="op">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="step-container step-container-premium">
                        <div class="step-title-container">
                            <div class="step-title">
                                provide Ovn/USD+ LP
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/provide-velodrome.svg" alt="velo">
                                </div>
                            </div>

                            <div class="step-container-separator"></div>
                        </div>
                        <div>
                            <div class="step-info-description info-group">
                                <div>
                                    Diversify your income sources by bridging OVN tokens to Optimism and participating in farming on Velodrome.
                                </div>
                                <div class="pt-7">
                                    You also can experience a huge <span class="font-weight-bold">2 week boost in Beefy vault.</span>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <BestShortAprPromotion  :init-pool="velodromePool"/>
                                </div>
                            </div>


                            <div class="info-group" style="cursor: pointer">
                                <v-row @click="clickOnButton('BRIDGE')"
                                       class="ma-0 pt-4" justify="center" align="center">
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        v-if="currentStepType === 'CLAIM_REFUND'"
                                        @click="claimRefund">
                                        CLAIM AND BRIDGE TO OP
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'WAITING_FOR_CLAIM_BONUS'">
                                        WAITING CLAIM BONUS
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        v-else-if="currentStepType === 'CLAIM_BONUS'"
                                        @click="claimBonus">
                                        CLAIM AND BRIDGE TO OP
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'WAITING_FOR_CLAIM_SALES_FIRST_PART'">
                                        WAITING CLAIM
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        v-else-if="currentStepType === 'CLAIM_SALES_FIRST_PART'"
                                        @click="claimSalesPart1">
                                        CLAIM AND BRIDGE TO OP
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'WAITING_FOR_CLAIM_VESTING'">
                                        WAITING CLAIM VESTING
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        v-else-if="currentStepType === 'CLAIM_VESTING'"
                                        @click="claimVesting">
                                        CLAIM AND BRIDGE TO OP
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'NOTHING_TO_DO'">
                                        VESTING FINISHED
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else>
                                        NOT STARTED
                                    </v-btn>
                                </v-row>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <div class="title-step-container title-step-container-premium">
                            <div class="title-step-text">
                                claim and farm on base
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/claim-farm-on.svg" alt="base">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="step-container step-container-premium">
                        <div class="step-title-container">
                            <div class="step-title">
                                provide Ovn/USD+ LP
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/provide-aerodrome.svg" alt="aero">
                                </div>
                            </div>

                            <div v-if="currentStepType" class="step-container-separator"></div>
                        </div>

                        <div>
                            <div class="step-info-description info-group">
                                <div>
                                    Earn yield by staking OVN tokens on the Aerodrome platform and get high APRs.
                                </div>
                                <div class="pt-7">
                                    Our pools are heavily bribed with USD+ backed by our protocol's profit.
                                </div>
                            </div>

                            <div>
                                <div>
                                    <BestShortAprPromotion  :init-pool="aerodromePool"/>
                                </div>
                            </div>


                            <div class="info-group" style="cursor: pointer">
                                <v-row @click="clickOnButton('FARM')"
                                       class="ma-0 pt-4" justify="center" align="center">
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined-lined"
                                        height="40px"
                                        outlined
                                        v-if="currentStepType === 'CLAIM_REFUND'"
                                        @click="claimRefund">
                                        CLAIM AND FARM ON BASE
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'WAITING_FOR_CLAIM_BONUS'">
                                        WAITING CLAIM BONUS
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined-lined"
                                        height="40px"
                                        outlined
                                        v-else-if="currentStepType === 'CLAIM_BONUS'"
                                        @click="claimBonus">
                                        CLAIM AND FARM ON BASE
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'WAITING_FOR_CLAIM_SALES_FIRST_PART'">
                                        WAITING CLAIM
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined-lined"
                                        height="40px"
                                        outlined
                                        v-else-if="currentStepType === 'CLAIM_SALES_FIRST_PART'"
                                        @click="claimSalesPart1">
                                        CLAIM AND FARM ON BASE
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'WAITING_FOR_CLAIM_VESTING'">
                                        WAITING CLAIM VESTING
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined-lined"
                                        height="40px"
                                        outlined
                                        v-else-if="currentStepType === 'CLAIM_VESTING'"
                                        @click="claimVesting">
                                        CLAIM AND FARM ON BASE
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'NOTHING_TO_DO'">
                                        VESTING FINISHED
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else>
                                        NOT STARTED
                                    </v-btn>
                                </v-row>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div v-if="turnOfStatusControls">
                        <div class="step-container-separator"></div>
                        <div>
                            (step: {{currentStepType}} | finish: {{finishType}})
                        </div>
                        <div class="row">
                            <div class="col-6 col-lg-6 col-md-6 col-xs-6">
                                <button @click="prevStep" class="pr-5" style="cursor:pointer;">
                                    prev
                                </button>
                            </div>
                            <div class="col-6 col-lg-6 col-md-6 col-xs-6">
                                <button @click="nextStep" style="cursor:pointer;">
                                    next
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div @click="devStepsUpper"
                             class="title-step-container">
                            <div class="title-step-text">
                                claim and provide insurance
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/claim-provide.svg" alt="insurance">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="step-container">
                        <div class="step-title">
                            <div class="step-title-container">
                                get premiums every day
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/title-participate.svg" alt="part">
                                </div>
                            </div>


                            <div class="step-container-separator"></div>
                        </div>

                        <div>
                            <div class="step-info-description info-group">
                                <div>
                                    By holding OVN, you not only benefit from the potential increase in value but also gain the unique advantage of participating in the <a href="/insurance" target="_blank">Overnight Insurance Vault</a>, allowing you to stake OVN for getting insurance premiums every day.
                                </div>
                            </div>


                            <div class="info-group" style="cursor: pointer">
                                <v-row @click="clickOnButton('INSURANCE')"
                                       class="ma-0 pt-4" justify="center" align="center">
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        v-if="currentStepType === 'CLAIM_REFUND'"
                                        @click="claimRefund">
                                        CLAIM AND MINT INSURANCE
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'WAITING_FOR_CLAIM_BONUS'">
                                        WAITING CLAIM BONUS
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        v-else-if="currentStepType === 'CLAIM_BONUS'"
                                        @click="claimBonus">
                                        CLAIM AND MINT INSURANCE
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'WAITING_FOR_CLAIM_SALES_FIRST_PART'">
                                        WAITING CLAIM
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        v-else-if="currentStepType === 'CLAIM_SALES_FIRST_PART'"
                                        @click="claimSalesPart1">
                                        CLAIM AND MINT INSURANCE
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'WAITING_FOR_CLAIM_VESTING'">
                                        WAITING CLAIM VESTING
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        v-else-if="currentStepType === 'CLAIM_VESTING'"
                                        @click="claimVesting">
                                        CLAIM AND MINT INSURANCE
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else-if="currentStepType === 'NOTHING_TO_DO'">
                                        VESTING FINISHED
                                    </v-btn>
                                    <v-btn
                                        x-large
                                        width="90%"
                                        class="button btn-outlined"
                                        height="40px"
                                        outlined
                                        disabled
                                        v-else>
                                        NOT STARTED
                                    </v-btn>
                                </v-row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pb-10 pt-5">
                <a href="/presale" class="go-back">
                    <img src="/assets/icon/presale/go-to-presale.svg" alt="<- go to presale">
                </a>
            </div>
        </div>


        <ZapModal :set-show-func='setIsZapModalShow'
                  :zap-pool="currentZapPool"
                  :is-show="isZapModalShow"
                  :type-of-pool="typeOfPool"
                  :pool-tokens-for-zap-map="poolTokensForZapMap">
        </ZapModal>

        <SuccessPresaleModal :is-show="isShowSuccessModal"
                          :set-show-func="showSuccessModal"
                          :success-data="successData"
        />

        <WaitingModal/>
        <ErrorModal/>
    </div>
</template>

<script>
import SuccessPresaleModal from "@/components/presale/modals/SuccessPresaleModal.vue";
import WaitingModal from "@/components/common/modal/action/WaitingModal.vue";
import ErrorModal from "@/components/common/modal/action/ErrorModal.vue";
import {presale} from "@/components/mixins/presale";
import {pool} from "@/components/mixins/pool";
import BestShortAprPromotion from "@/components/common/modal/action/component/BestShortAprPromotion.vue";
import ZapModal from "@/components/zap/modals/ZapModal.vue";
const moment = require('moment'); // import moment.js


export default {
    name: "ClaimBodyComponent",
    mixins: [presale],
    components: {
        ZapModal,
        BestShortAprPromotion,
        ErrorModal,
        WaitingModal,
        SuccessPresaleModal,
    },
    data() {
        return {
        }
    },
    mounted() {
        this.loadPools();
    },
    methods: {
        clickOnButton(buttonType) {
            console.log("Button type", buttonType);
            this.finishType = buttonType;
        },

        claimAndHold() {
            console.log("Claim and hold")
        },
        claimAndBridgeToOp() {
            console.log("Claim and bridge to op")
        },
        claimAndFarmOnBase() {
            console.log("Claim and farm on base")
        },
        claimAndMintInsurance() {
            console.log("Claim and mint insurance")
        },
    }
}
</script>


<style scoped>
.step-container-premium {
    border: 3px solid #0968AE;
    box-shadow: 0px 10px 20px rgba(9, 55, 98, 0.25);
    border-radius: 8px;
    min-height: 610px!important;
    padding: 28px 15px!important;
}


.step-container {
    /* Frame 28910 */
    position: relative;

    /* Auto layout */
    display: flex;
    flex-direction: column;
    padding: 28px;
    gap: 20px;

    color: var(--secondary-gray-text);

    min-height: 400px;

    background: var(--main-background);
    box-shadow: 0px 10px 20px rgba(9, 55, 98, 0.25);
    border-radius: 20px;
}

.step-container-separator {
    padding: 8px;
    border-bottom: 1px solid #E5E5E5;
    width: 100%;
}

.step-title {
    /* read information */
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 40px;
    /* identical to box height, or 167% */
    letter-spacing: 0.03em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;

    /* Grey/Grey 19_text */
    color: var(--swipe-info);

    padding-left: 25px;
    position: relative;
}


.title-logo {
    position: absolute;
    left: -3px;
    top: 3px;
}

.step-info-description {
    /* Secondary text regular */
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    /* or 150% */
    font-feature-settings: 'liga' off;
    /* Grey/Grey 16 */
    color: var(--theme-icon-color-selected);
}

.claim-step-description {
    padding-top: 15px;
}

.info-group {
    padding-top: 10px;
}

.info-sub-title {

    /* Caption */
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    /* identical to box height, or 157% */
    /* Grey/Grey 10 */
    color: #8D95A3;

}

.info-text {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
    /* identical to box height, or 156% */
    font-feature-settings: 'liga' off;
    color: #29323E;
}

.info-text-blue {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    /* or 156% */
    font-feature-settings: 'liga' off;

    /* Main blue */
    color: #1C95E7;
}

.info-text-black {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    /* or 156% */
    font-feature-settings: 'liga' off;

    /* Main blue */
    color: rgba(41, 50, 62, 1);
}

.info-title {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 800;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height, or 150% */
    letter-spacing: 0.5px;
    font-feature-settings: 'liga' off;

    /* Grey/Grey 19_text */
    color: #29323E;
}

.link-container {
    position: relative;
    cursor: pointer;
}

.link-image {
    position: absolute;
    left: 115px;
    top: 2px;
}

.link-title {
    color: #0678C4;
    cursor: pointer;
}

.button-buy {

    /* Auto layout */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 8px;
    gap: 8px;

    height: 40px;
    max-width: 180px;

    /* Blue gradient */
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    //background: linear-gradient(91.26deg, #989b9d 0%, rgba(120, 136, 146, 0.99) 100%);
    border-radius: 2px;

    color: white;

    cursor: pointer;
}

.button-buy-disabled {

    /* Auto layout */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 8px;
    gap: 8px;

    height: 40px;
    max-width: 215px;

    /* Blue gradient */
//background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    background: linear-gradient(91.26deg, #989b9d 0%, rgba(120, 136, 146, 0.99) 100%);
    border-radius: 2px;

    color: white;

    cursor: pointer;
}

.btn-outlined-disabled {
    //color: var(--links-blue) !important;
    color: #989b9d;
    max-width: 150px;
    font-size: 13px;
}

.btn-outlined-lined {
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    border-radius: 2px;
    color: white;
    font-size: 13px;
}

.btn-outlined {
    color: var(--links-blue) !important;
    font-size: 13px;
//color: #989b9d;
    //max-width: 150px;
}

.timer-container-center {
    display: flex;
    justify-content: center!important;
    align-items: center!important;
}


.bottom-contract-info {
    position: absolute;
    bottom: 30px;
    width: 80%;
}

.contract-info-label {
    position: absolute;
    left: 107px;
    top: 3px;
}

.contract-link {
    position:relative;
    font-size: 18px;
    cursor: pointer
}

.check-nft-status-container {
    /* Auto layout */
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 12px;
    gap: 8px;

    width: 100%;
    height: 52px;

    /* Grey/Grey 1 */
    background: #F5F5F5;
    border-radius: 8px;

    position: relative;
}

.check-nft-status-image {
    position: absolute;
    left: -20px;
    top: 3px;
    //left: 0;
}

.title-statistics {
    color: #8D95A3;
    font-weight: bold;
}

.funds-in-hard-cap-percent {
    position: relative;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;

    color: #22ABAC;
    border-radius: 5px;
    padding: 3px 23px 3px 7px;

    background-color: rgba(34, 171, 172, 0.1);
    cursor: pointer;

}

.funds-percent-image {
    position: absolute;
    top: 3px;
    right: 3px;
    cursor: pointer;
}


.nft-info {
    color: #8D95A3;
}

.presale-status {
    padding: 15px 20px;
    background-color: rgba(28, 149, 231, 0.1);
    border-radius: 12px;
    width: 100%;
    font-weight: bold;
}

.presale-status-success {
    color: #00c852;
}

.switch-to-support-chain-message {
    color: #0e7ec9;
    font-weight: bold;
}

.title-step-container-premium {
    background: #0968AE!important;
}

.title-step-container {
    padding: 10px;
    background: linear-gradient(90deg, #3BA9F2 2.58%, #2499E5 109.45%);
    border-radius: 8px;

    margin-bottom: 10px;
    min-height: 90px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.title-step-text {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    padding-left: 35px;;

    /* White */
    color: #FFFFFF;
    text-transform: uppercase;

    position: relative;
}

.theme--light.v-btn.v-btn--disabled {
    color: var(--theme-icon-color-selected) !important;
}
</style>

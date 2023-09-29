
<template>
    <div>
        <div class="pt-2">
            <div class="row">
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <div class="title-step-container">
                            <div class="title-step-text">
                                claim and hold in wallet
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


                                <v-row class="ma-0 pt-4" justify="start" align="center">
                                    <div>
                                        <v-btn
                                            @click="claimAndHold"
                                            x-large
                                               width="90%"
                                               class="button btn-outlined"
                                               height="40px"
                                               outlined>
                                            CLAIM AND HOLD
                                        </v-btn>
                                    </div>
                                </v-row>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <div class="title-step-container">
                            <div class="title-step-text">
                                claim and farm on op
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


                            <div class="info-group" style="cursor: pointer">


                                <v-row class="ma-0 pt-4" justify="start" align="center">
                                    <div>
                                        <v-btn
                                            @click="claimAndBridgeToOp"
                                            x-large
                                            width="90%"
                                            class="button btn-outlined"
                                            height="40px"
                                            outlined>
                                            CLAIM AND BRIDGE TO OP
                                        </v-btn>
                                    </div>
                                </v-row>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <div class="title-step-container">
                            <div class="title-step-text">
                                claim and farm on base
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
                                <div v-if="!isPoolsLoading">
                                    <BestShortAprPromotion  :pool="topPool"/>
                                </div>
                            </div>


                            <div class="info-group" style="cursor: pointer">
                                <v-row class="ma-0 pt-4" justify="start" align="center">
                                    <div>
                                        <v-btn
                                            @click="claimAndFarmOnBase"
                                            x-large
                                            width="90%"
                                            class="button btn-outlined-lined"
                                            height="40px"
                                            outlined>
                                            CLAIM AND FARM ON BASE
                                        </v-btn>
                                    </div>
                                </v-row>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <div class="title-step-container">
                            <div class="title-step-text">
                                claim and provide insurance
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
                                <v-row class="ma-0 pt-4" justify="start" align="center">
                                    <div>
                                        <v-btn
                                            @click="claimAndHold"
                                            x-large
                                            width="90%"
                                            class="button btn-outlined"
                                            height="40px"
                                            outlined>
                                            CLAIM/MINT INSURANCE
                                        </v-btn>
                                    </div>
                                </v-row>
                            </div>
                        </div>


<!--                        <div>
                            <div class="info-sub-title">
                                Farming bonus
                            </div>
                            <div class="info-text-blue">
                                {{ formattedAccountFarmingBonus }} USD+
                            </div>

                            <div v-if="currentStep >= 2" class="info-group">
                                <div class="info-sub-title">
                                    Overflow funds
                                </div>
                                <div class="info-text-black">
                                    {{ formattedAccountOverflowFunds }} USD+
                                </div>
                            </div>

                            <div class="info-group">
                                <div v-if="currentStepType === 'CLAIM_REFUND'"
                                     @click="claimRefund"
                                     class="button-buy">
                                    CLAIM REFUND
                                </div>
                                <div v-else-if="currentStepType === 'WAITING_FOR_CLAIM_BONUS'"
                                     class="button-buy-disabled">
                                    WAITING CLAIM BONUS
                                </div>
                                <div v-else-if="currentStepType === 'CLAIM_BONUS'"
                                      @click="claimBonus"
                                     class="button-buy">
                                    CLAIM BONUS
                                </div>
                                <div v-else-if="currentStepType === 'WAITING_FOR_CLAIM_SALES_FIRST_PART'"
                                     class="button-buy-disabled">
                                    WAITING CLAIM
                                </div>
                                <div v-else-if="currentStepType === 'CLAIM_SALES_FIRST_PART'"
                                     @click="claimSalesPart1"
                                     class="button-buy">
                                    CLAIM SALES (25%)
                                </div>
                                <div v-else-if="currentStepType === 'WAITING_FOR_CLAIM_VESTING'"
                                     class="button-buy-disabled">
                                    WAITING CLAIM VESTING
                                </div>
                                <div v-else-if="currentStepType === 'CLAIM_VESTING'"
                                      @click="claimVesting"
                                     class="button-buy">
                                    CLAIM VESTING
                                </div>
                                <div v-else-if="currentStepType === 'NOTHING_TO_DO'"
                                     class="button-buy-disabled">
                                    VESTING FINISHED
                                </div>
                                <div v-else class="button-buy-disabled">
                                    NOT STARTED
                                </div>
                            </div>
                        </div>-->

<!--
                        <v-btn class="button btn-outlined-disabled" @click="claimFunds" outlined>
                            CLAIM FUNDS
                        </v-btn>-->

                    </div>
                </div>
            </div>
        </div>

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
const moment = require('moment'); // import moment.js


export default {
    name: "ClaimBodyComponent",
    mixins: [presale, pool],
    components: {
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
}

.step-container {
    /* Frame 28910 */
    position: relative;

    /* Auto layout */
    display: flex;
    flex-direction: column;
    padding: 28px;
    gap: 20px;

    min-height: 400px;

    background: #FFFFFF;
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
    color: #29323E;

    padding-left: 20px;
    position: relative;
}


.title-logo {
    position: absolute;
    left: -11px;
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
    color: #4C586D;
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
}

.btn-outlined-lined {
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    border-radius: 2px;
    color: white;
}

.btn-outlined {
    color: var(--links-blue) !important;
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

    /* White */
    color: #FFFFFF;
    text-transform: uppercase;
}
</style>

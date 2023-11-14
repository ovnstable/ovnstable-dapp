
<template>
    <div>
        <div class="pt-2">
            <div class="row">
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <img :src="require('@/assets/icon/presale/step/step1.svg')" width="100%" alt="Step1">
                    </div>

                    <div class="step-container">
                        <div>
                            <div class="step-title">
                                Read information
                                <div class="title-logo">
                                    <img :src="require('@/assets/icon/presale/title-private-round.svg')" alt="Private Round">
                                </div>
                            </div>
                            <div class="step-container-separator"></div>
                        </div>


                        <div class="info-group">
                            <TokenOvnInfo></TokenOvnInfo>
                        </div>

                        <div>
                            <div class="step-info-description info-group">
                                Discover incredible opportunities with Overnight! Join our launchpad and become a part of the core community. With us, you'll consistently lead the way in the DeFi realm, securing access to cutting-edge solutions.
                            </div>

                            <div class="step-container-separator"></div>

                            <div class="info-group">
                                <div class="info-sub-title">
                                    Sale Method
                                </div>
                                <div class="info-text">
                                    Overflow Farming
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-sub-title">
                                    Chains
                                </div>
                                <div class="info-text">
                                    Base
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-sub-title">
                                    Soft cap
                                </div>
                                <div class="info-text-black">
                                    {{ formattedSoftCap }} USD+
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-sub-title">
                                    Hard cap
                                </div>
                                <div class="info-text-black">
                                    {{ formattedHardCap }} USD+
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-sub-title">
                                    Presale Pool
                                </div>
                                <div class="info-text-black">
                                    {{ formattedOvnTotal }} OVN
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-sub-title">
                                    Farming bonus
                                </div>
                                <div class="info-text">
                                    Formed with rebase of committed USD+
                                </div>
                            </div>

                            <div class="step-container-separator"></div>

                            <div class="info-group">
                                <div class="pt-5">
                                    <div class="link-container">
                                        <a href="https://overnight.fi/blog/2023/09/11/ovn-token-sale/" target="_blank">
                                            <label class="link-title ml-auto">
                                                OVN token sale
                                            </label>
                                            <div class="link-image">
                                                <img :src="require('@/assets/icon/presale/link-blue.svg')" style="width: 15px" alt="->"/>
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                <div class="pt-5">
                                    <div class="link-container">
                                        <a href="https://overnight.fi/blog/2023/09/12/overnight-tokenomics/" target="_blank">
                                            <label class="link-title ml-auto">
                                                 Overnight Tokenomics
                                            </label>
                                            <div class="link-image" style="left: 160px;">
                                                <img :src="require('@/assets/icon/presale/link-blue.svg')" style="width: 15px" alt="->"/>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <img :src="require('@/assets/icon/presale/step/step2.svg')" width="100%" alt="Step1">
                    </div>

                    <div class="step-container">
                        <div class="step-title-container">
                            <div class="step-title">
                                get presale NFT
                                <div class="title-logo">
                                    <img :src="require('@/assets/icon/presale/title-nft.svg')" alt="nft">
                                </div>
                            </div>

                            <div class="step-container-separator"></div>
                        </div>
                        <div>
                            <div class="step-info-description">
                                You should get OVN presale NFT on Base chain
                            </div>

                            <div class="step-container-separator"></div>

                             <div class="info-group">
                                <div class="info-title">
                                    Check status
                                </div>

                                 <div v-if="!account" class="check-nft-status-container">
                                     <div>
                                         <div class="switch-to-support-chain-message">
                                             Please connect wallet
                                         </div>
                                     </div>
                                 </div>
                                <div v-else-if="!isSupportedNetwork" class="check-nft-status-container">
                                    <div>
                                        <div class="switch-to-support-chain-message">
                                            Please switch to Base chain
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                   <div v-if="nftLoading" class="check-nft-status-container">
                                        <div>
                                             <v-row align="center" justify="center">
                                                 <v-progress-circular
                                                     width="2"
                                                     size="24"
                                                     color="#8FA2B7"
                                                     indeterminate
                                                 ></v-progress-circular>
                                             </v-row>
                                        </div>
                                   </div>
                                   <div v-else class="check-nft-status-container">
                                        <div v-if="!nftStatus" style="position:relative;">
                                             You don’t have Presale NFT

                                             <div class="check-nft-status-image">
                                                 <img :src="require('@/assets/icon/presale/cancel.svg')" alt="X">
                                             </div>
                                        </div>
                                        <div v-else style="position:relative;">
                                             <div style="color: #00c853; font-weight: bold">
                                                 You have Presale NFT [{{ availableNftCount }}]
                                             </div>
                                        </div>
                                   </div>
                                </div>
                                 <div>
                                     <div>
                                         <div class="nft-info">
                                             <div>
                                                 ATTENTION:
                                             </div>
                                             <div>
                                                 1 NFT = 1 "Buy OVN and Farm" action.
                                             </div>

                                             <div class="pt-1">
                                                 After you have made one OVN purchase, the NFT is marked as used. If you want to buy more OVN tokens, you need to mint more NFT.
                                             </div>
                                          </div>
                                     </div>
                                 </div>
                            </div>

                            <div class="info-group pt-3">
                                <div class="info-title">
                                    How to get Presale NFT
                                </div>

                                <div class="step-info-description">
                                    <div>
                                        1. Participate in a Galxe campaign
                                    </div>
                                    <div>
                                        2. Via one of our launch partners
                                    </div>
                                </div>
                            </div>

<!--                            <div class="info-group">
                                <div class="step-info-description">
                                    <div class="info-group">
                                        As part of the Galxe campaign, please complete the following tasks:
                                    </div>

                                    <div class="info-group">
                                        <div>
                                            1. Follow Overnight on Twitter
                                        </div>
                                        <div>
                                            2. Like/retweet our tweet about Presale
                                        </div>
                                        <div>
                                            3. Join <a href="https://discord.com/invite/overnight-fi" target="_blank">our Discord</a>
                                        </div>
                                        <div>
                                            4. Check USD+ in your wallet on any chain (USD+ is needed to buy $OVN token)
                                        </div>
                                        <div>
                                            5. Mint NFT on Galxe
                                        </div>
                                    </div>
                                </div>
                            </div>-->

                            <div class="info-group" style="cursor: pointer">


                                <v-row class="ma-0" justify="start" align="center">
                                    <a href="https://galxe.com/overnight/campaign/GCkGqUPaji" target="_blank">
                                        <v-btn x-large
                                               width="90%"
                                               class="button btn-outlined"
                                               height="30px"
                                               outlined>
                                                    MINT NFT ON GALXE
                                            <img :src="require('@/assets/icon/presale/link-blue.svg')" alt="->" style="width: 21px; padding-left: 5px">
                                        </v-btn>
                                    </a>
                                </v-row>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div v-if="!nftStatus">
                        <img src="/assets/icon/presale/step/step3.svg" width="100%" alt="Step1">
                    </div>
                    <div v-else>
                        <img src="/assets/icon/presale/step/step3-active.svg" width="100%" alt="Step1">
                    </div>

                    <div class="step-container">
                        <div class="step-title-container">
                            <div class="step-title">
                                Participate
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/title-participate.svg" alt="time">
                                </div>
                            </div>

                            <div v-if="currentStepType" class="step-container-separator"></div>
                        </div>

                        <div v-if="!isFirstLoading">
                            <div v-if="currentStepType === 'WAITING_FOR_PRESALE_START'" class="timer-container-center">
                                <div class="info-group">
                                    <Timer
                                        v-if="presaleTimestamp"
                                        :timestamp="presaleTimestamp"
                                        title="Presale starts in"
                                        :updateStatus="updateStatus"
                                    />
                                </div>
                            </div>
                            <div v-else-if="currentStepType === 'COMMIT'" class="timer-container-center">
                                <div class="info-group">
                                    <Timer
                                        v-if="presaleEndTimestamp"
                                        :timestamp="presaleEndTimestamp"
                                        title="Presale ends in"
                                        :updateStatus="updateStatus"
                                    />
                                </div>
                            </div>
                            <div v-else class="timer-container-center">
                                <div class="info-group">
                                    <div class="presale-status">
                                        Presale Finished
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div>
                            <div  v-if="presaleTimestamp">
                                <div class="info-sub-title">
                                    Start Presale
                                </div>
                                <div class="info-text">
                                    {{ presaleStartDate }}
                                </div>
                            </div>

                            <div v-if="presaleEndTimestamp">
                                <div class="info-sub-title">
                                    End of Presale
                                </div>
                                <div class="info-text">
                                    {{ presaleEndDate }}
                                </div>
                            </div>

                            <div v-if="presaleTimestamp && presaleEndTimestamp">
                                <div class="info-sub-title">
                                    Duration
                                </div>
                                <div class="info-text">
                                    {{ differentdDysBeetwinStartAndEndPresale }} days
                                </div>
                            </div>
                        </div>

                        <div>
                            <div class="info-sub-title">
                                Funds in Presale contract
                            </div>
                            <div class="info-text">
                                {{ formattedFundsInPresale }} USD+

                                <span class="funds-in-hard-cap-percent">
                                    {{formattedDifferentHowManyPercentFundInPresaleByHardCap}}%

                                    <span class="funds-percent-image">
                                        <v-tooltip
                                            color="var(--tooltip-bg)"
                                            min-width="50px"
                                            min-height="50px"
                                            top
                                        >
                                            <template v-slot:activator="{on, attrs}">
                                                <div :style="{width: 50 + 'px', height: 30 + 'px'}"
                                                     v-bind="attrs"
                                                     v-on="on">
                                                    <img src="/assets/icon/presale/funds-percent.svg" class="funds-percent-image">
                                                </div>
                                            </template>

                                            <div style="color: var(--main-gray-text); font-weight: bold;">
                                               <div>
                                                   % of collected funds from hard cap
                                               </div>
                                            </div>
                                        </v-tooltip>
                                    </span>

<!--                                    <img src="/assets/icon/presale/funds-percent.svg" class="funds-percent-image">-->
                                </span>
                            </div>
                        </div>

                        <div>
                            <div class="info-sub-title">
                                Farming bonus
                            </div>
                            <div class="info-text">
                                {{ formattedFarmingBonus }} USD+
                            </div>
                        </div>

                        <div class="step-container-separator"></div>

                        <div class="info-group">

                            <div>
                                <PresaleBuyForm
                                    :ovnICOContract="ovnICOContract"
                                    :ovnTokenContract="ovnTokenContract"
                                    :ovnWhitelistContract="ovnWhitelistContract"
                                    :currentStepType="currentStepType"
                                    :currentStep="currentStep"
                                    :ovnWeiType='ovnWeiType'
                                    :usdPlusWeiType='usdPlusWeiType'
                                    :galxeNftsIds="galxeNftsIds"
                                    :partnerNftsIds="partnerNftsIds"
                                    :showSuccessModal="showSuccessModal"
                                    :timeoutUpdateCurrentUserStep="timeoutUpdateCurrentUserStep">
                                </PresaleBuyForm>
                            </div>
                        </div>


                        <div class="bottom-contract-info">
                            <div class="step-container-separator"></div>

                            <div class="info-group">
                                <div class="row">
                                    <div class="col-6 col-lg-6 col-md-6 col-sm-6">
                                        <div class="info-sub-title" style="position:relative;">
                                            Presale contract
                                            <div class="contract-info-label">
                                                <img src="/assets/icon/presale/base.svg" height="16px" alt="Base">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6 col-lg-6 col-md-6 col-sm-6">
                                       <a :href="'https://basescan.org/address/' + presaleContractAddress" target="_blank">
                                           <div class="info-text contract-link">
                                               {{ formattedPresaleContractAddress }}
                                               <div class="contract-info-label">
                                                   <img src="/assets/icon/presale/link.svg" height="16px" alt="Base">
                                               </div>
                                           </div>
                                       </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div v-if="turnOfStatusControls">
                        <div class="step-container-separator"></div>
                        <div>
                            (step: {{currentStepType}})
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

                    <div v-if="currentStep > 1">
                        <img src="/assets/icon/presale/step/step4.svg" width="100%" alt="Step4">
                    </div>
                    <div v-else>
                        <img src="/assets/icon/presale/step/step4-active.svg" width="100%" alt="Step4">
                    </div>

                    <div class="step-container">
                        <div class="step-title">
                            <div @click="devStepsUpper"
                                 class="step-title-container">
                                {{ formattedClaimTitle }}
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/title-claim.svg" alt="claim">
                                </div>
                            </div>


                            <div class="step-container-separator"></div>
                        </div>

                        <!--          CLAIM_VESTING              -->
                        <div v-if="!isFirstLoading && currentStep >= 2">
                            <div v-if="currentStepType === 'CLAIM_REFUND'">
                                <div class="info-group">
                                    <div class="presale-status presale-status-success">
                                        Now you can claim your refund
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="currentStepType === 'WAITING_FOR_CLAIM_BONUS'">
                                <div class="info-group">
                                    <Timer
                                        v-if="claimBonusTimestamp"
                                        :timestamp="claimBonusTimestamp"
                                        title="Claim bonus starts in"
                                        :updateStatus="updateStatus"
                                    />
                                </div>
                            </div>
                            <div v-else-if="currentStepType === 'CLAIM_BONUS'">
                                <div class="info-group">
                                    <div class="presale-status presale-status-success">
                                        Now you can claim your bonus
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="currentStepType === 'WAITING_FOR_CLAIM_SALES_FIRST_PART'">
                                <div class="info-group">
                                    <Timer
                                        v-if="claimSalesFirstPartTimestamp"
                                        :timestamp="claimSalesFirstPartTimestamp"
                                        title="Claim starts in"
                                        :updateStatus="updateStatus"
                                    />
                                </div>
                            </div>
                            <div v-else-if="currentStepType === 'CLAIM_SALES_FIRST_PART'">
                                <div class="info-group">
                                    <div class="presale-status presale-status-success">
                                        Now you can claim 25% of your OVN
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="currentStepType === 'WAITING_FOR_CLAIM_VESTING'"
                                 class="timer-container-center">
                                <div class="info-group">
                                    <Timer
                                        v-if="vestingTimestamp"
                                        :timestamp="vestingTimestamp"
                                        title="Vesting starts in"
                                        :updateStatus="updateStatus"
                                    />
                                </div>
                            </div>
                            <div v-else-if="currentStepType === 'CLAIM_VESTING'" class="timer-container-center">
                                <div v-if="presaleEndTimestamp" class="info-group">
                                    <div class="info-group">
                                        <Timer
                                            v-if="vestingEndTimestamp"
                                            :timestamp="vestingEndTimestamp"
                                            title="Vesting ends in"
                                            :updateStatus="updateStatus"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div v-else class="timer-container-center">
                                <div class="info-group">
                                    <div class="presale-status">
                                        Vesting Finished
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div class="step-info-description">
                                <div class="claim-step-description">
                                    - Overflow funds and farming bonus claimable on the End of sale
                                </div>
                                <div class="claim-step-description">
                                    - 25% of OVN will be claimable at the End of OVN Sale
                                </div>
                                <div class="claim-step-description">
                                    - 75% of OVN will be linearly vested over 4 weeks period, beginning 5 days after the End of sale
                                </div>
                            </div>
                        </div>

                        <div class="step-container-separator"></div>

                        <div >
                            <div class="title-statistics">
                                YOUR PRESALE INFO
                            </div>
                        </div>

                        <div>
                            <div class="info-sub-title">
                                Total  purchased
                            </div>
                            <div class="info-text-black">
                                {{formattedAccountTotalUsdPurchased}} USD+
                            </div>
                            <div class="info-text-black">
                                {{formattedAccountTotalOvnPurchased}} OVN
                            </div>
                        </div>

                        <div>
                            <div class="info-sub-title">
                                Vesting amounts
                            </div>
                            <div class="info-text-black">
                                 {{ formattedAccountVestingAmount }} OVN
                            </div>
                        </div>

                        <div >
                            <div class="info-sub-title">
                                Claimable
                            </div>
                            <div class="info-text-black">
                                {{ formattedAccountClaimableAmount }} OVN
                            </div>
                        </div>

                        <div>
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
                                     @click="goToClaim"
                                     class="button-buy">
                                    CLAIM REFUND
                                </div>
                                <div v-else-if="currentStepType === 'WAITING_FOR_CLAIM_BONUS'"
                                     class="button-buy-disabled">
                                    WAITING CLAIM BONUS
                                </div>
                                <div v-else-if="currentStepType === 'CLAIM_BONUS'"
                                      @click="goToClaim"
                                     class="button-buy">
                                    CLAIM BONUS
                                </div>
                                <div v-else-if="currentStepType === 'WAITING_FOR_CLAIM_SALES_FIRST_PART'"
                                     class="button-buy-disabled">
                                    WAITING CLAIM
                                </div>
                                <div v-else-if="currentStepType === 'CLAIM_SALES_FIRST_PART'"
                                     @click="goToClaim"
                                     class="button-buy">
                                    CLAIM SALES (25%)
                                </div>
                                <div v-else-if="currentStepType === 'WAITING_FOR_CLAIM_VESTING'"
                                     class="button-buy-disabled">
                                    WAITING CLAIM VESTING
                                </div>
                                <div v-else-if="currentStepType === 'CLAIM_VESTING'"
                                      @click="goToClaim"
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

<!--                            <div class="info-group">
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
                            </div>-->
                        </div>

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
import Timer from "@/components/presale/tools/Timer.vue";
import TokenOvnInfo from "@/components/presale/tools/TokeOvnInfo.vue";
import PresaleBuyForm from "@/components/presale/tools/PresaleBuyForm.vue";
import SuccessPresaleModal from "@/components/presale/modals/SuccessPresaleModal.vue";
import WaitingModal from "@/components/common/modal/action/WaitingModal.vue";
import ErrorModal from "@/components/common/modal/action/ErrorModal.vue";
import {presale} from "@/components/mixins/presale";
const moment = require('moment'); // import moment.js


export default {
    name: "PresaleBodyComponent",
    mixins: [presale],
    components: {
        ErrorModal,
        WaitingModal,
        SuccessPresaleModal,
        PresaleBuyForm,
        TokenOvnInfo,
        Timer
    },
    data() {
        return {

        }
    },
}
</script>


<style scoped>
.step-container {
    /* Frame 28910 */
    position: relative;

    /* Auto layout */
    display: flex;
    flex-direction: column;
    padding: 28px;
    gap: 20px;

    min-height: 1100px;

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
</style>


<template>
    <div>
        <div class="pt-2">
            <div class="row">
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <img src="/assets/icon/presale/step/step1.svg" width="100%" alt="Step1">
                    </div>

                    <div class="step-container">
                        <div>
                            <div class="step-title">
                                Read information
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/title-private-round.svg" alt="Private Round">
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
                                                <img src="/assets/icon/presale/link-blue.svg" style="width: 15px" alt="->"/>
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
                                                <img src="/assets/icon/presale/link-blue.svg" style="width: 15px" alt="->"/>
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
                        <img src="/assets/icon/presale/step/step2.svg" width="100%" alt="Step1">
                    </div>

                    <div class="step-container">
                        <div class="step-title-container">
                            <div class="step-title">
                                get presale NFT
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/title-nft.svg" alt="nft">
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
                                                 <img src="/assets/icon/presale/cancel.svg" alt="X">
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
                                            <img src="/assets/icon/presale/link-blue.svg" alt="->" style="width: 21px; padding-left: 5px">
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

                        <div v-if="isFirstLoading">
                            <div class="timer-container-center">
                                <div class="info-group">
                                    <Timer
                                        v-if="presaleTimestamp"
                                        :timestamp="presaleTimestamp"
                                        title="Presale starts in"
                                        :updateStatus="updateStatus"
                                    />
                                </div>
                            </div>
                        </div>
                        <div v-else>
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
                            <div class="step-title-container" @click="devStepsUpper">
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
                                        title="Claim sales starts in"
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
                                    WAITING CLAIM SALES
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
import {mapActions, mapGetters} from "vuex";
import loadJSON from "@/utils/http-utils";
import SuccessPresaleModal from "@/components/presale/modals/SuccessPresaleModal.vue";
import WaitingModal from "@/components/common/modal/action/WaitingModal.vue";
import ErrorModal from "@/components/common/modal/action/ErrorModal.vue";
import {balanceApiService} from "@/services/balance-api-service";
const moment = require('moment'); // import moment.js

const USER_PRESALE_STATE_MAP = {
    0: 'WAITING_FOR_PRESALE_START',
    1: 'COMMIT',
    2: 'CLAIM_REFUND',
    3: 'WAITING_FOR_CLAIM_BONUS',
    4: 'CLAIM_BONUS',
    5: 'WAITING_FOR_CLAIM_SALES_FIRST_PART',
    6: 'CLAIM_SALES_FIRST_PART',
    7: 'WAITING_FOR_CLAIM_VESTING',
    8: 'CLAIM_VESTING',
    9: 'NOTHING_TO_DO',
}


export default {
    name: "PresaleBodyComponent",
    components: {ErrorModal, WaitingModal, SuccessPresaleModal, PresaleBuyForm, TokenOvnInfo, Timer},
    data() {
        return {
            isFirstLoading: true,
            isContractDataLoading: false,

            isShowSuccessModal: false,
            successData: null,


            presaleTimestamp: 1695038400 * 1000,
            presaleEndTimestamp: 1695639600 * 1000,
            vestingTimestamp: 0,
            vestingDurationTimestamp: 0,
            claimBonusTimestamp: 0,
            claimSalesFirstPartTimestamp: 0,

            overflowFarmingPool: 25000,
            fundsInPresale: 0,
            farmingBonus: 0,
            softCap: 350000,
            hardCap: 500000,

            // personal data
            accountTotalUsdPurchased: 0,
            accountTotalOvnPurchased: 0,
            accountVestingAmount: 0,
            accountClaimableAmount: 0,
            accountFarmingBonus: 0,
            accountOverflowFunds: 0,

            nftStatus: false,
            nftLoading: true,

            nftGalxeAddress: "0x512cc325bae1dd4590f6d67733aaf8e6a0526eab",
            nftPartnerAddress: "0xe750a85e77bb505d5465f8045f25b27a3437b5f1",
            galxeNftsIds: [],
            partnerNftsIds: [],

            ovnTokenAddress: "0xa3d1a8deb97b111454b294e2324efad13a9d8396", // ovn for test 0x2a40eab5dc171924937f242c5d73e1cd5a19e160
            presaleContractAddress: "0x98e923e8D5f9E09AB87319dCEC36F17b95d48b7a",

            ovnTokenContract: null,
            ovnWhitelistContract: null,
            ovnICOContract: null,

            currentStep: null,
            currentStepType: null,
            ovnWeiType: 'ether',
            usdPlusWeiType: 'mwei',

            turnOfStatusControls: false,
            devSteps: 0, // if 10 => turn of controls

            supportedNetwork: ['base'],

            initRefreshIntervalId: null
        }
    },
    mounted() {
        this.initRefreshData();
        this.loadAllData();
    },

    watch: {

        account: function (newVal, oldVal) {
            console.log("Account changed", newVal, oldVal)
            if (newVal) {
                this.loadAllData();
            }
        },

        networkName: function (newVal, oldVal) {
            console.log("Network changed", newVal, oldVal)
            if (newVal) {
                this.loadAllData();
            }
        },

    },

    computed: {
        ...mapGetters('network', ['networkName', 'networkId']),
        ...mapGetters('accountData', ['account']),
        ...mapGetters("web3", ["web3"]),
        ...mapGetters("gasPrice", ["gasPriceGwei", "gasPrice", "gasPriceStation"]),

        isSupportedNetwork() {
            return this.supportedNetwork.includes(this.networkName);
        },

        formattedPresaleContractAddress() {
            if (!this.presaleContractAddress) {
                return 'XXXX...XXXX';
            }

            return this.presaleContractAddress.substring(0, 5) + '...' + this.presaleContractAddress.substring(this.presaleContractAddress.length - 4);
        },

        availableNftCount() {
            if (!this.isWhitelist) {
                return 0;
            }

            // 0 [true, false, true] - galxe
            // 1 [false, false, true, true, true, true, true, true, true, true] - partner
            let serviceNfts = this.isWhitelist[0];
            let serviceAvailableNftsCount = 0;
            if (serviceNfts && serviceNfts.length) {
                serviceAvailableNftsCount = serviceNfts.filter(item => item).length;
            }

            let partnerNfts = this.isWhitelist[1];
            let partnerAvailableNftsCount = 0;
            if (partnerNfts && partnerNfts.length) {
                partnerAvailableNftsCount = partnerNfts.filter(item => item).length;
            }

            return serviceAvailableNftsCount + partnerAvailableNftsCount;
        },

        formattedClaimTitle() {
            if (this.currentStepType === null || this.currentStep === null) {
                return "Claim";
            }

            if (this.currentStepType === 'CLAIM_REFUND') {
                return 'Claim Refund';
            }

            if (this.currentStepType === 'WAITING_FOR_CLAIM_BONUS') {
                return 'Waiting bonus';
            }

            if (this.currentStepType === 'CLAIM_BONUS') {
                return 'Claim bonus';
            }

            if (this.currentStepType === 'WAITING_FOR_CLAIM_SALES_FIRST_PART') {
                return 'Waiting sales';
            }

            if (this.currentStepType === 'CLAIM_SALES_FIRST_PART') {
                return 'Claim sales';
            }

            if (this.currentStepType === 'WAITING_FOR_CLAIM_VESTING') {
                return 'Waiting vesting';
            }

            if (this.currentStepType === 'CLAIM_VESTING') {
                return 'Claim vesting';
            }

            return "Claim";
        },

        presaleStartDate() {
            return moment(this.presaleTimestamp).utc().format('MMMM DD, YYYY hh:mm [UTC]');
        },
        presaleEndDate() {
            return moment(this.presaleEndTimestamp).utc().format('MMMM DD, YYYY hh:mm [UTC]');
        },
        differentdDysBeetwinStartAndEndPresale() {
            return moment(this.presaleEndTimestamp).diff(moment(this.presaleTimestamp), 'days') + 1;
        },
        vestingStartDate() {
            return moment(this.vestingTimestamp).utc().format('MMMM DD, YYYY hh:mm [UTC]');
        },

        vestingEndTimestamp() {
            if (!this.vestingTimestamp || !this.vestingDurationTimestamp) {
                return 0;
            }

            return this.vestingTimestamp + (this.vestingDurationTimestamp);
        },

        // vestingEndDate() {
        //     return moment(this.vestingDurationTimestamp).utc().format('MMMM DD, YYYY hh:mm [UTC]');
        // },
        formattedSoftCap() {
            if (!this.softCap) {
                return "000,000";
            }

            return this.softCap.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        formattedHardCap() {
            if (!this.hardCap) {
                return "000,000";
            }

            return this.hardCap.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        formattedOvnTotal() {
            if (!this.overflowFarmingPool) {
                return "000,000";
            }

            return this.overflowFarmingPool.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        formattedFarmingBonus() {
            if (!this.farmingBonus) {
                return "000,000";
            }

            return this.farmingBonus.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        formattedFundsInPresale() {
            if (!this.fundsInPresale) {
                return "000,000";
            }

            return this.fundsInPresale.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedDifferentHowManyPercentFundInPresaleByHardCap() {
            if (!this.fundsInPresale || !this.hardCap) {
                return "0";
            }

            let percentage = (this.fundsInPresale / this.hardCap) * 100;
            return Math.round(percentage);
        },

        formattedAccountTotalUsdPurchased() {
            if (!this.accountTotalUsdPurchased) {
                return "000,000.00";
            }

            return this.accountTotalUsdPurchased.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountTotalOvnPurchased() {
            if (!this.accountTotalOvnPurchased) {
                return "000,000.00";
            }

            return this.accountTotalOvnPurchased.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountVestingAmount() {
            if (!this.accountVestingAmount) {
                return "000,000.00";
            }

            return this.accountVestingAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountClaimableAmount() {
            if (!this.accountClaimableAmount) {
                return "000,000.00";
            }

            return this.accountClaimableAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountFarmingBonus() {
            if (!this.accountFarmingBonus) {
                return "000,000.00";
            }

            return this.accountFarmingBonus.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountOverflowFunds() {
            if (!this.accountOverflowFunds) {
                return "000,000.00";
            }

            return this.accountOverflowFunds.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
    },
    beforeDestroy() {
        if (this.initRefreshIntervalId) {
            clearInterval(this.initRefreshIntervalId);
        }
    },

    methods: {
        ...mapActions("gasPrice", ['refreshGasPrice']),

        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions("errorModal", ['showErrorModal', 'showErrorModalWithMsg']),

        initRefreshData() {
            this.initRefreshIntervalId = setInterval(this.loadContractData, 20000);
        },

        async loadAllData() {
            await this.loadApiData();
            await this.loadIcoData();
            await this.loadContractData();
        },
        async loadApiData() {
            if (!this.account || !this.isSupportedNetwork) {
                console.log("Not loading api data when loadApiData. Account not exist or notwork not support.", this.account, this.isSupportedNetwork);
                return;
            }

            await this.loadContracts();
            this.loadNftData();
        },

        async loadNftData() {
            await this.loadNft();
        },
        async loadContractData() {
            if (!this.account || !this.isSupportedNetwork) {
                console.log("Not loading contract data when loadContractData. Account not exist or notwork not support.", this.account, this.isSupportedNetwork);
                return;
            }

            console.log("Load contract data")
            if (this.isContractDataLoading) {
                console.log("Data already in status loading")
                return;
            }

            this.isContractDataLoading = true;
            try {
                this.updateBaseAndUserInfo();
            } catch (e) {
                console.log("Load contract data Error", e);
            } finally {
                this.isContractDataLoading = false;
            }
        },

        timeoutUpdateCurrentUserStep() {
            setTimeout(() => {
                this.loadContractData();
            }, 2500);
        },
        updateBaseAndUserInfo() {
            if (!this.account || !this.isSupportedNetwork) {
                console.log("Not loading contract data when updateBaseAndUserInfo. Account not exist or notwork not support.", this.account, this.isSupportedNetwork);
                return;
            }

            this.updateCurrentUserStep();
            this.updateUserInfo();
        },


    /*    async loadData() {

        },*/

        showSuccessModal(isShow, hash, text, type) {
            this.isShowSuccessModal = isShow;
            console.log("Show success modal", isShow, hash, text);

            if (!isShow) {
                this.successData = null;
                this.isShowSuccessModal = false;
                return
            }

            this.successData = {
                chain: this.networkId,
                hash: hash,
                text: text,
                type: type
            }

            this.isShowSuccessModal = isShow;
            console.log("Show success modal", isShow, hash, text);
        },
        loadIcoData() {
            console.log("Load ICO data")

            this.presaleContractAddress = this.ovnICOContract.options.address
            console.log('presaleContractAddress: ', this.presaleContractAddress);

            this.ovnICOContract.methods.hardCap().call().then((result) => {
                console.log("Hard cap result", result)
                let fromWei = this.web3.utils.fromWei(result.toString(), this.usdPlusWeiType); // mwei - 6, gwei - 9, ether - 18
                this.hardCap = fromWei * 1;
                console.log("Hard cap", this.hardCap, fromWei)
            });

            this.ovnICOContract.methods.softCap().call().then((result) => {
                console.log("Soft cap result", result)
                let fromWei = this.web3.utils.fromWei(result.toString(), this.usdPlusWeiType); // mwei - 6, gwei - 9, ether - 18
                this.softCap = fromWei * 1;
                console.log("Soft cap", this.softCap, fromWei)
            });


            this.ovnICOContract.methods.totalSales().call().then((result) => {
                console.log("Overflow farming pool result", result)
                let fromWei = this.web3.utils.fromWei(result.toString(), this.ovnWeiType); // mwei - 6, gwei - 9, ether - 18
                this.overflowFarmingPool = fromWei * 1;
                console.log("Overflow farming pool", this.overflowFarmingPool, fromWei)
            });

            // start time
            this.ovnICOContract.methods.startTime().call().then((result) => {
                console.log("Start time result", result)
                this.presaleTimestamp = result * 1000;
                console.log("Start time", this.presaleTimestamp)
            });

            // end time
            this.ovnICOContract.methods.endTime().call().then((result) => {
                console.log("End time result", result)
                this.presaleEndTimestamp = result * 1000;
                console.log("End time", this.presaleEndTimestamp)
            });

            // vestingBegin
            this.ovnICOContract.methods.vestingBeginTime().call().then((result) => {
                console.log("Vesting begin result", result)
                this.vestingTimestamp = result * 1000;
                console.log("Vesting begin", this.vestingTimestamp)
            });

            // vestingDuration
            this.ovnICOContract.methods.vestingDuration().call().then((result) => {
                console.log("Vesting duration result", result)
                this.vestingDurationTimestamp = result * 1000;
                console.log("Vesting duration", this.vestingDurationTimestamp)
            });

            // claimBonusTime
            this.ovnICOContract.methods.claimBonusTime().call().then((result) => {
                console.log("Claim bonus time result", result)
                this.claimBonusTimestamp = result * 1000;
                console.log("Claim bonus time", this.claimBonusTimestamp)
            });

            //claimSalesFirstPartTime
            this.ovnICOContract.methods.claimSalesFirstPartTime().call().then((result) => {
                console.log("Claim sales first part time result", result)
                this.claimSalesFirstPartTimestamp = result * 1000;
                console.log("Claim sales first part time", this.claimSalesFirstPartTimestamp)
            });


            // farmingBonus
            this.ovnICOContract.methods.totalCommitToBonus().call().then((result) => {
                console.log("Farming bonus result", result)
                let fromWei = this.web3.utils.fromWei(result.toString(), this.usdPlusWeiType); // mwei - 6, gwei - 9, ether - 18
                this.farmingBonus = fromWei * 1;
                console.log("Farming bonus", this.farmingBonus, fromWei)
            });

            // fundsInPresale
            this.ovnICOContract.methods.totalCommitments().call().then((result) => {
                console.log("Funds in presale result", result)
                let fromWei = this.web3.utils.fromWei(result.toString(), this.usdPlusWeiType); // mwei - 6, gwei - 9, ether - 18
                this.fundsInPresale = fromWei * 1;
                console.log("Funds in presale", this.fundsInPresale, fromWei)
            });

            // user step
            this.updateCurrentUserStep();

            // getUserInfo
           this.updateUserInfo();
        },

        async loadContracts() {
            console.log("Load contracts for tokens")

            const ERC20 = await loadJSON('/contracts/ERC20.json');
            console.log("Contracts ERC20 loaded", ERC20);
            this.ovnTokenContract = this._loadContract(ERC20, this.web3, this.ovnTokenAddress);
            console.log("Token contract be loaded.", this.ovnTokenContract)

            const whitelistFile = await loadJSON(`/contracts/${this.networkName}/presale/Whitelist.json`);
            this.ovnWhitelistContract = this._loadContract(whitelistFile, this.web3);
            console.log("Whitelist contract be loaded.", this.ovnWhitelistContract)

            const icoFile = await loadJSON(`/contracts/${this.networkName}/presale/OverflowICO.json`);
            this.ovnICOContract = this._loadContract(icoFile, this.web3);
            console.log("ICO contract be loaded.", this.ovnICOContract)
        },

        _loadContract(file, web3, address) {
            if (!address) {
                address = file.address;
            }

            return new web3.eth.Contract(file.abi, address);

        },
        async claimVesting() {
            if (this.currentStepType !== 'CLAIM_VESTING') {
                console.log("Not claim vesting step");
                return;
            }

            this.showWaitingModal('Claim Vesting in process');

            try {
                let buyParams;
                await this.refreshGasPrice();
                if (this.gas == null) {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei};
                } else {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei, gas: this.gas};
                }

                // claimVesting
                let result = await this.ovnICOContract.methods.claimVesting(this.account).send({
                    ...buyParams
                }).on('transactionHash', (hash) => {
                    console.log("Claim vesting result", hash)
                    this.showSuccessModal(true, hash, "You successfully claimed OVN tokens");
                })
                console.log("Result: ", result)

                this.closeWaitingModal();
            } catch (e) {
                console.log("Claim vesting error", e)
                this.closeWaitingModal();
                this.showErrorModalWithMsg({errorType: 'claim-vesting', errorMsg: e.message});
            } finally {
                this.timeoutUpdateCurrentUserStep();
            }
            console.log("claim vesting");
        },

        async claimSalesPart1() {
            if (this.currentStepType !== 'CLAIM_SALES_FIRST_PART') {
                console.log("Not claim sales step");
                return;
            }

            this.showWaitingModal('Claim Sales First Part in process');

            try {

                let buyParams;
                await this.refreshGasPrice();
                if (this.gas == null) {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei};
                } else {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei, gas: this.gas};
                }

                // claimSalesPart1
                let result = await this.ovnICOContract.methods.claimSalesFirstPart().send({
                    ...buyParams
                }).on('transactionHash', (hash) => {
                    console.log("Claim sales part 1 result", hash)
                    this.closeWaitingModal();
                    this.showSuccessModal(true, hash, "You successfully claimed OVN tokens");
                })

                console.log("Result: ", result)

                this.closeWaitingModal();
            } catch (e) {
                console.log("Claim sales part 1 error", e)
                this.closeWaitingModal();
                this.showErrorModalWithMsg({errorType: 'claim-sales-first-part', errorMsg: e.message});
            } finally {
                this.timeoutUpdateCurrentUserStep();
            }
            console.log("claim sales part 1");
        },

        async claimBonus() {
            if (this.currentStepType !== 'CLAIM_BONUS') {
                console.log("Not claim bonus step");
                return;
            }

            this.showWaitingModal('Claim Bonus in process');

            try {
                let buyParams;
                await this.refreshGasPrice();
                if (this.gas == null) {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei};
                } else {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei, gas: this.gas};
                }

            // claimBonus
                let result = await this.ovnICOContract.methods.claimBonus().send({
                    ...buyParams
                }).on('transactionHash', (hash) => {
                    console.log("Claim bonus result", hash)
                    this.closeWaitingModal();
                    this.showSuccessModal(true, hash, "You successfully claimed OVN tokens");
                    this.timeoutUpdateCurrentUserStep();
                })

                console.log("Result: ", result)

                this.closeWaitingModal();
            } catch (e) {
                console.log("Claim bonus error", e)
                this.closeWaitingModal();
                this.showErrorModalWithMsg({errorType: 'claim-bonus', errorMsg: e.message});
            } finally {
                this.timeoutUpdateCurrentUserStep();
            }

            console.log("claim bonus");
        },

        async claimRefund() {
            if (this.currentStepType !== 'CLAIM_REFUND') {
                console.log("Not claim refund step");
                return;
            }

            this.showWaitingModal('Claim Bonus in process');
            try {
                let buyParams;
                await this.refreshGasPrice();
                if (this.gas == null) {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei};
                } else {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei, gas: this.gas};
                }

                // claimRefund
                console.log("Claim refund", buyParams)
                let result = await this.ovnICOContract.methods.claimRefund().send({
                    ...buyParams
                }).on('transactionHash', (hash) => {
                    console.log("Claim refund result", hash)
                    this.closeWaitingModal();
                    this.showSuccessModal(true, hash, "You successfully get your funds back", 'usd+');
                })

                console.log("Result: ", result)

                this.closeWaitingModal();
            } catch (e) {
                console.log("Claim refund error", e)
                this.closeWaitingModal();
                this.showErrorModalWithMsg({errorType: 'claim-refund', errorMsg: e.message});
            } finally {
                this.timeoutUpdateCurrentUserStep();
            }

            console.log("claim refund");
        },
        claimFunds() {
            console.log("claim funds")
        },
        async checkNftsInBlockchain() {
            // if not galaxe nfts and not partner nfts return null
            if (!this.galxeNftsIds.length && !this.partnerNftsIds.length) {
                this.nftStatus = false;
                return;
            }

           let isWhitelist;
            try {
                let account = this.account
                isWhitelist = await this.ovnWhitelistContract.methods.isWhitelist(account, this.galxeNftsIds, this.partnerNftsIds).call();
                this.isWhitelist = isWhitelist;
                console.log("Is whitelist result: ", isWhitelist)
            } catch (e) {
                console.log("Check nfts in blockchain error", e)
                this.nftStatus = false;
                return;
            }

            if (!isWhitelist) {
                this.nftStatus = false;
                console.log("NFT isWhitelist error", isWhitelist)
                return;
            }

            // service
            if (isWhitelist[0].includes(true)) {
                console.log("NFT service exist at user")
                this.nftStatus = true;
                return;
            }

            // partner
            if (isWhitelist[1].includes(true)) {
                console.log("NFT partner exist at user")
                this.nftStatus = true;
                return;
            }

            this.nftStatus = false;
        },
        async loadNft() {
            if (!this.account) {
                this.nftLoading = false;
                return;
            }

            this.nftLoading = true;

            let account = this.account;
            let url = "https://app.overnight.fi/api/presale";
            balanceApiService.checkBaseBalanceWithNft(url, account)
            .then(async (result) => {
                console.log("NFT result", result)

                if (!result || !result.data || !result.data.items || !result.data.items.length) {
                    this.nftStatus = false;
                    this.nftLoading = false;
                    return;
                }

                let galxeNfts = result.data.items.find((item) => {
                    return item.contract_address === this.nftGalxeAddress;
                });

                if (galxeNfts) {
                    this.galxeNftsIds = galxeNfts.nft_data.map((item) => {
                        return item.token_id;
                    })
                }

                // console.log()

                let partnerNfts = result.data.items.find((item) => {
                    return item.contract_address === this.nftPartnerAddress;
                });

                if (partnerNfts) {
                    this.partnerNftsIds = partnerNfts.nft_data.map((item) => {
                        return item.token_id;
                    })
                }

                console.log("Nfts galxe: ", galxeNfts, this.galxeNftsIds);
                console.log("Nfts partner: ", partnerNfts, this.partnerNftsIds);

                await this.checkNftsInBlockchain()
                this.nftLoading = false;
            }).catch(e => {
                console.log("NFT LOADING error", e)
                this.nftLoading = false;
            });
        },
        updateCurrentUserStep() {
            // current step
            this.ovnICOContract.methods.getUserState(this.account).call().then((result) => {
                console.log("Current step result", result)
                this.currentStep = result;
                this.currentStepType = USER_PRESALE_STATE_MAP[result];
                console.log("Current step", this.currentStep, this.currentStepType)
            });
        },
        updateUserInfo() {
            this.ovnICOContract.methods.getUserInfo(this.account).call().then((result) => {
                console.log("User info result", result)

                let fromWei = this.web3.utils.fromWei(result.userCommitments.toString(), this.usdPlusWeiType);
                this.accountTotalUsdPurchased = fromWei * 1;
                console.log("Total usd purchased", this.accountTotalUsdPurchased, fromWei)

                // salesToReceive
                let salesToReceive = this.web3.utils.fromWei(result.salesToReceive.toString(), this.ovnWeiType);
                this.accountTotalOvnPurchased = salesToReceive * 1;
                console.log("Total ovn purchased", this.accountTotalOvnPurchased, salesToReceive)

                //lockedSales
                let lockedSales = this.web3.utils.fromWei(result.lockedSales.toString(), this.ovnWeiType);
                this.accountVestingAmount = lockedSales * 1;
                console.log("Vesting amount", this.accountVestingAmount, lockedSales)

                // unlockedSales
                let unlockedSales = this.web3.utils.fromWei(result.unlockedSales.toString(), this.ovnWeiType);
                this.accountClaimableAmount = unlockedSales * 1;
                console.log("Claimable amount", this.accountClaimableAmount, unlockedSales)

                // commitToReceive
                let commitToReceive = this.web3.utils.fromWei(result.commitToReceive.toString(), this.usdPlusWeiType);
                this.accountFarmingBonus = commitToReceive * 1;
                console.log("Farming bonus", this.accountFarmingBonus, commitToReceive)

                // commitToRefund
                let commitToRefund = this.web3.utils.fromWei(result.commitToRefund.toString(), this.usdPlusWeiType);
                this.accountOverflowFunds = commitToRefund * 1;
                console.log("Overflow funds", this.accountOverflowFunds, commitToRefund)

                // end of loading
                this.isFirstLoading = false;
            });
        },
        updateStatus() {
            this.updateBaseAndUserInfo();
        },

        nextStep() {
            if (this.currentStep === null) {
                return;
            }

            if (this.currentStep >= 9) {
                this.currentStep = 9;
                return;
            }

            this.currentStep++
            this.currentStepType = USER_PRESALE_STATE_MAP[this.currentStep];
        },
        prevStep() {
            if (this.currentStep === null) {
                return;
            }

            if (this.currentStep <= 0) {
                this.currentStep = 0;
                return;
            }

            this.currentStep--
            this.currentStepType = USER_PRESALE_STATE_MAP[this.currentStep];
        },
        devStepsUpper() {
            if (this.devSteps === 8) {
                this.devSteps = 0;
                this.turnOfStatusControls = true;
            } else {
                this.devSteps++;
            }
        }

    }
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

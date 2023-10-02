<template>
    <div>
        <div v-if="zapPool.chain !== networkId" class="swap-container">
            <div class="swap-body">
                <div>
                    <div class="mb-4 mt-1">
                        <PoolLabel :pool="zapPool">
                        </PoolLabel>
                    </div>
                </div>
                <ZapChangeNetwork :zap-pool="zapPool" ></ZapChangeNetwork>
            </div>
        </div>
        <div v-else class="swap-container">
            <div v-if="!isTokensLoadedAndFiltered"
                 class="loader-container pb-15">
                <div class="row">
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

            <div v-else>
                <div class="swap-body">
                    <div>
                        <div class="mb-4 mt-1">
                            <PoolLabel :pool="zapPool">
                            </PoolLabel>
                        </div>

                        <div class="input-swap-container">

                            <div v-for="token in inputTokens" :key="token.id" class="input-component-container">
                                <div v-if="isShowDecreaseAllowance && token.selectedToken"
                                     @click="disapproveToken(token)"
                                     class="decrease-allowance">
                                    Decrease Allowance
                                </div>

                                <InputToken
                                    :token-info="token"
                                    :remove-item-func="removeInputToken"
                                    :is-token-removable="isInputTokensRemovable"
                                    :select-token-func="selectInputToken"
                                    :update-token-value-func="updateTokenValue"
                                />
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <div v-if="isInputTokensAddAvailable"
                                         @click="addNewInputToken"
                                         class="add-token-text">
                                        + Select token
                                    </div>
                                </div>
                                <div v-if="inputTokensWithSelectedTokensCount" class="col-6">
                                    <div @click="maxAll"
                                         class="add-token-text max-all">
                                        Max all
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="pt-5">
                            <div class="change-swap-container">
                                <div class="change-swap-image" >
                                    <img src="/assets/icon/swap/change-swap-vector.svg" alt="change-swap">
                                </div>
                            </div>
                        </div>

                        <div class="out-swap-container pt-5">
                            <div v-for="token in outputTokens" :key="token.id"
                                 class="input-component-container">
                                <OutputToken
                                    :token-info="token"
                                    :swap-method="swapMethod"
                                    :remove-item-func="removeOutputToken"
                                    :is-token-removable="isOutputTokensRemovable"
                                    :is-token-without-slider="isTokenWithoutSlider"
                                    :lock-proportion-func="lockProportion"
                                    :update-slider-value-func="updateSliderValue"
                                    :select-token-func="selectOutputToken"
                                    :is-hide-lock-icon="true"
                                    :is-disable-select="true"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="sumOfAllSelectedTokensInUsd">
                    <div class="transaction-info-container">
                        <div class="transaction-info-body">
                            <div class="row">
                                <div class="col-6 py-0">
                                    <div class="transaction-info-title">
                                        Slippage
                                    </div>
                                </div>
                                <div class="col-6 py-0">
                                    <div class="transaction-info">
                                        {{slippagePercent*1}}% <span class="transaction-info-additional">
                                            ({{$utils.formatMoney(sumOfAllSelectedTokensInUsd * slippagePercent / 100, 3)}})$
                                            </span>
                                    </div>
                                </div>
                            </div>

                            <div class="row py-2" v-if="ifMoreThanOneSelectedTokensAdded">
                                <div class="col-6 py-0 with-tooltip">
                                    <div class="transaction-info-title">
                                        Multi-swap Odos fee
                                    </div>
                                    <div>
                                        <Tooltip
                                            text="This fee is charged by Odos for using multi-input/multi-output"
                                        />
                                    </div>
                                </div>
                                <div class="col-6 py-0">
                                    <div class="transaction-info">
                                        {{multiSwapOdosFeePercent*1}}% <span class="transaction-info-additional">
                                            ({{$utils.formatMoney(sumOfAllSelectedTokensInUsd * multiSwapOdosFeePercent / 100, 3)}})$
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-6 py-0 with-tooltip">
                                    <div class="transaction-info-title">
                                        Single-swap Odos fee
                                    </div>
                                    <div>
                                        <Tooltip
                                            text="Single-input/output swaps are free"
                                        />
                                    </div>
                                </div>
                                <div class="col-6 py-0">
                                    <div class="transaction-info">
                                        0.00% <span class="transaction-info-additional">(0)$</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

<!--                <div @click="depositAllAtGauge(account, lastPoolInfoData)">
                    STAKE LP
                </div>-->

                <div style="padding-top: 10px">
                    <SwapSlippageSettings :currentSlippageChanged="handleCurrentSlippageChanged" />
                </div>

                <div v-if="zapPool && this.zapPool.platform === 'Swapbased'" class="slippage-info-container">
                    <div class="slippage-info-title">
                        <img src="/assets/icon/swap/warn-info-icon.svg" alt="info" style="margin-right: 2px;"/>
                        By joining this pool, you are being notified that SwapBased takes a 1% deposit fee.
                    </div>
                </div>

                <div class="odos-fees-container mt-5" v-if="ifMoreThanOneSelectedTokensAdded">
                    <div>
                        <v-img class="alert-icon mr-2" :src="require('@/assets/icon/alert-circle-outline.svg')"/>
                    </div>
                    <div>
                        <label class="odos-fees-title">
                            Odos collects 0.01% fee for multi-input/multi-output swaps.
                        </label>
                    </div>

                </div>

                <div class="swap-footer pt-5">
                    <div v-if="!account" class="swap-button-container">
                        <div @click="connectWallet"
                             class="swap-button">
                            <div class="swap-button-title">
                                <div>
                                    CONNECT WALLET
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="swap-button-container">
                        <div v-if="isDisableButton"
                             class="disable-button">
                            <div class="disable-button-title">
                                <div>
                                    {{disableButtonMessage}}
                                </div>
                            </div>
                        </div>
                        <div v-else-if="isAnyInputsNeedApprove"
                             @click="approve(firstInputInQueueForToApprove)"
                             class="swap-button">
                            <div class="swap-button-title">
                                <div>
                                    APPROVE {{firstInputInQueueForToApprove.selectedToken.symbol}}
                                </div>
                            </div>
                        </div>
                        <div v-else-if="additionalSwapStepType === 'APPROVE'"
                             @click="toApproveAndDepositSteps(lastZapResponseData, lastPoolInfoData)"
                             class="swap-button">
                            <div class="swap-button-title">
                                <div>
                                    APPROVE GAUGE
                                </div>
                            </div>
                        </div>
                        <div v-else-if="additionalSwapStepType === 'DEPOSIT'"
                             @click="depositGauge(lastPutIntoPoolEvent, lastReturnedToUserEvent, lastPoolInfoData, lastNftTokenId)"
                             class="swap-button">
                            <div class="swap-button-title">
                                <div>
                                    STAKE LP
                                </div>
                            </div>
                        </div>
                        <div v-else
                             @click="stake()"
                             class="swap-button">
                            <div class="swap-button-title">
                                <div v-if="currentZapPlatformContractType && currentZapPlatformContractType.type === 'LP_STAKE_DIFF_STEPS'">
                                    DEPOSIT
                                </div>
                                <div v-else>
                                    STAKE
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="label-container pt-3">
                        <div v-if="selectedInputTokens.length > 0" class="row">
                            <div class="col-12">
                               <ZapSteps :selected-input-tokens="selectedInputTokens"
                                         :click-on-stake="clickOnStake"
                                         :additional-swap-step-type="additionalSwapStepType"
                                         :current-zap-platform-contract-type="currentZapPlatformContractType">
                               </ZapSteps>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <SelectTokensModal :is-show="isShowSelectTokensModal"
                           :set-show-func="showSelectTokensModals"
                           :swap-method="swapMethod"
                           :select-token-type="selectTokenType"
                           :add-selected-token-to-list-func="addSelectedTokenToList"
                           :remove-selected-token-from-list-func="removeSelectedTokenFromList"
                           :second-tokens="secondTokens"
                           :tokens="tokens"
                           :is-all-data-loaded="isAllDataLoaded"
                           :is-ovn-swap="false"
                           :selected-token-count="selectTokenType === 'OVERNIGHT' ? secondTokensSelectedCount : tokensSelectedCount"
                           :max-token-count="selectTokenType === 'OVERNIGHT' ? secondTokens.length : 6"
        />

        <SuccessZapModal :is-show="isShowSuccessPoolModal"
                          :set-show-func="showSuccessPoolModal"
                          :success-data="successData"/>

        <WaitingModal/>
        <ErrorModal/>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import InputToken from "@/components/swap-module/InputToken.vue";
import OutputToken from "@/components/swap-module/OutputToken.vue";
import {odosSwap} from "@/components/mixins/odos-swap";
import {mapActions, mapGetters} from "vuex";
import SelectTokensModal from "@/components/swap-module/modals/SelectTokensModal.vue";
import WaitingModal from "@/components/common/modal/action/WaitingModal.vue";
import ErrorModal from "@/components/common/modal/action/ErrorModal.vue";
import SwapSlippageSettings from "@/components/swap-module/SwapSlippageSettings.vue";
import SuccessZapModal from "@/components/zap/modals/SuccessZapModal.vue";
import ZapSteps from "@/components/zap/ZapSteps.vue";
import {zap} from "@/components/mixins/zap";
import PoolLabel from "@/components/zap/PoolLabel.vue";
import ZapChangeNetwork from "@/components/zap/ZapChangeNetwork.vue";
import axios from "axios";
import {contractApprove} from "@/components/mixins/contract-approve";
import Tooltip from "@/components/common/element/Tooltip";
import BigNumber from "bignumber.js";

export default defineComponent({
    name: "ZapForm",
    mixins: [odosSwap, zap, contractApprove],
    components: {
        Tooltip,
        ZapChangeNetwork,
        PoolLabel,
        ZapSteps,
        SuccessZapModal,
        SwapSlippageSettings,
        ErrorModal,
        WaitingModal,
        SelectTokensModal,
        OutputToken,
        InputToken,
    },
    props: {
        zapPool: {
            type: Object,
            required: false,
            default: null
        },

        poolTokensForZapMap: {
            type: Object,
            required: true,
        },

        typeOfPool: { // OVN or ALL
            type: String,
            required: true,
        }

    },
    data() {
        return {
            inputTokens: [],
            outputTokens: [],
            maxInputTokens: 6,
            maxOutputTokens: 6,

            isShowSelectTokensModal: false,
            swapMethod: 'BUY', // BUY (secondTokens) / SELL (secondTokens)
            selectTokenType: 'OVERNIGHT', // OVERNIGHT / ALL

            isSwapLoading: false,
            isSumulateSwapLoading: false,
            pathViz: null,
            slippagePercent: 0.05,
            multiSwapOdosFeePercent: 0.01,

            tokensQuotaCounterId: null,
            tokensQuotaCheckerSec: 0,

            clickOnStake: false,

            sourceLiquidityBlacklist: ["Hashflow", 'Wombat'], // "Overnight Exchange"
            mapExcludeLiquidityPlatform: { // Schema for hot exclude: {'Ovn pool platform name from db': ['odos', 'api/info/liquidity-sources', 'related', 'with', 'platform'] }
                'Chronos': ["Chronos Volatile"] //"Chronos Stable"
            },
        }
    },
    mounted() {
        if (this.zapPool.chain !== this.networkId) {
            return;
        }

        this.firstInit();
    },
    computed: {
        ...mapGetters('network', ['getParams', 'networkId']),
        ...mapGetters('theme', ['light']),
        ...mapGetters('accountData', ['account']),

        noneOvnTokens() {
            return this.tokens.filter(item => item.symbol !== 'OVN')
        },

        isInputTokensRemovable() {
            return this.inputTokens.length > 1;
        },

        isOutputTokensRemovable() {
            return false;//this.outputTokens.length > 1;
        },

        isTokenWithoutSlider() {
            return this.outputTokens.length <= 1;
        },

        isInputTokensAddAvailable() {
            return this.inputTokens.length < this.maxInputTokens && this.inputTokensWithoutSelectedTokensCount === 0;
        },

        isOutputTokensAddAvailable() {
            return this.outputTokens.length < this.maxOutputTokens && this.outputTokensWithoutSelectedTokensCount === 0;
        },

        inputTokensWithoutSelectedTokensCount() {
            return this.inputTokens.filter(item => !item.selectedToken).length;
        },

        outputTokensWithoutSelectedTokensCount() {
            return this.outputTokens.filter(item => !item.selectedToken).length;
        },

        inputTokensWithSelectedTokensCount() {
            return this.inputTokens.filter(item => item.selectedToken).length;
        },

        outputTokensWithSelectedTokensCount() {
            return this.outputTokens.filter(item => item.selectedToken).length;
        },

        ifMoreThanOneSelectedTokensAdded() {
            return this.inputTokens.length > 1 || this.outputTokens.length > 1;
        },

        selectedInputTokens() {
            return this.inputTokens.filter(item => item.selectedToken)
        },
        selectedOutputTokens() {
            return this.outputTokens.filter(item => item.selectedToken)
        },

        noneOvnInputTokens() {
            return this.inputTokens.filter(item => item.selectedToken && item.selectedToken.symbol !== 'OVN')
        },

        noneOvnOutputTokens() {
            return this.outputTokens.filter(item => item.selectedToken && item.selectedToken.symbol !== 'OVN')
        },

        selectedOvnInputTokens() {
            return this.selectedInputTokens.filter(item => item.selectedToken.symbol === 'OVN');
        },
        selectedOvnOutputTokens() {
            return this.selectedOutputTokens.filter(item => item.selectedToken.symbol === 'OVN');
        },
        selectedNoneOvnInputTokens() {
            return this.selectedInputTokens.filter(item => item.selectedToken.symbol !== 'OVN');
        },
        selectedNoneOvnOutputTokens() {
            return this.selectedOutputTokens.filter(item => item.selectedToken.symbol !== 'OVN');
        },
        totalNoneOvnUsdInputsUsdBalance() {
            let totalBalance = 0;
            for (let i = 0; i < this.selectedNoneOvnInputTokens.length; i++) {
                let token = this.selectedNoneOvnInputTokens[i];
                totalBalance += token.selectedToken.balanceData.balanceInUsd;
            }

            return totalBalance;
        },
        totalNoneOvnUsdInputsUsdValue() {
            let totalValue = 0;
            for (let i = 0; i < this.selectedNoneOvnInputTokens.length; i++) {
                let token = this.selectedNoneOvnInputTokens[i];
                totalValue += token.usdValue;
            }

            return totalValue;
        },
        totalOvnUsdInputsUsdValue() {
            let totalValue = 0;
            for (let i = 0; i < this.selectedOvnInputTokens.length; i++) {
                let token = this.selectedOvnInputTokens[i];
                totalValue += token.usdValue;
            }

            return totalValue;
        },

        isOvnValueOverflow() {
            return this.typeOfPool === 'OVN' && this.totalOvnUsdInputsUsdValue > this.totalNoneOvnUsdInputsUsdValue;
        },

        isAnyInputsNeedApprove() {
            return this.allInputsWithNotApproved.length > 0
        },
        allInputsWithNotApproved() {
            return this.selectedInputTokens.filter(token => !token.selectedToken.approveData.approved);
        },
        firstInputInQueueForToApprove() {
            return this.isAnyInputsNeedApprove ? this.allInputsWithNotApproved[0] : null
        },

        isDisableButton() {
            return this.inputTokensWithSelectedTokensCount === 0 ||
                this.outputTokensWithSelectedTokensCount === 0 ||
                this.swapResponseConfirmInfo.waitingConformation ||
                !this.isAvailableOnNetwork ||
                !this.isAnyTokensBalanceIsInsufficient ||
                !this.isAmountEntered ||
                this.isOvnValueOverflow
        },

        disableButtonMessage() {
            if (this.inputTokensWithSelectedTokensCount === 0 ||
                this.outputTokensWithSelectedTokensCount === 0) {
                if (this.isAvailableOnNetwork) {
                    return 'SELECT TOKENS';
                }

                return "SWITCH CHAIN"
            }

            if (!this.isAmountEntered) {
                return 'ENTER AMOUNT';
            }

            if (!this.isAnyTokensBalanceIsInsufficient) {
                return 'BALANCE IS INSUFFICIENT';
            }

            if (this.isOvnValueOverflow) {
                return 'OVN VALUE IS OVERFLOW';
            }

            if (this.swapResponseConfirmInfo.waitingConformation) {
                return "Confirm in your wallet (" + this.swapResponseConfirmInfo.duration + " sec)"
            }

            return null;
        },
        isAmountEntered() {
            let tokens = this.selectedInputTokens;
            for (let i = 0; i < tokens.length; i++) {
                let token = tokens[i];
                if (token.value > 0) {
                    return true;
                }
            }

            return false;
        },
        sumOfAllSelectedTokensInUsd() {
            let sum = 0
            for (let i = 0; i < this.selectedInputTokens.length; i++) {
                let token = this.selectedInputTokens[i];
                let selectedTokenUsdValue = token.usdValue;
                sum += selectedTokenUsdValue;
            }

            return sum;
        },

        isAnyTokensBalanceIsInsufficient () {
            let tokens = this.selectedInputTokens;
            for (let i = 0; i < tokens.length; i++) {
                let token = tokens[i];
                if (token.value*1 > token.selectedToken.balanceData.balance*1) {
                    return false; // any with value > balance
                }
            }

            return true;
        }

    },
    watch: {

        sumOfAllSelectedTokensInUsd: function (val, oldVal) {
            this.recalculateOutputTokensSum();
        },

        isTokensLoadedAndFiltered: function (val, oldVal) {
            if (val) {
                this.clearForm();
            }
        },
        networkId: function (newVal, oldVal) {
            if (newVal) {
                // hide swap form and clear all(watch function) data,
                // after new token loaded collection
                this.isTokensLoadedAndFiltered = false;

                if (!this.isAvailableOnNetwork) {
                    this.mintAction();
                }

                if (this.zapPool.chain === this.networkId) {
                    this.firstInit();

                    setTimeout(() => {
                        this.loadZapContract();
                    }, 300)
                    return
                }

            }
        },
        isDisableButton: function (val, oldVal) {
            if (val) {
                this.clearQuotaInfo();
            }
            // this.updateButtonDisabledFunc(val);
        },

        isFirstBalanceLoaded: function (val, oldVal) {
            if (val) {
                // this.initDefaultTopInputTokensByBalance(this.inputTokens);
            }
        },
    },
    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),

        ...mapActions("errorModal", ['showErrorModal', 'showErrorModalWithMsg']),
        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions('walletAction', ['connectWallet']),
        ...mapActions('track', ['trackClick']),

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        firstInit() {
            this.zapPoolRoot = this.zapPool;

            this.tokenSeparationScheme = 'POOL_SWAP';
            this.typeOfPoolScheme = this.typeOfPool;
            console.log("Zap form odos init by scheme: ", this.tokenSeparationScheme, this.typeOfPoolScheme)
            console.log("Zap pool: ", this.zapPool)
            // todo: move to backend
            let poolTokens = this.poolTokensForZapMap[this.zapPool.address];
            if (!poolTokens) {
                console.log("Pool address not found:");
                return;
            }

            console.log("poolTokens: ", poolTokens, this.zapPool.address);
            this.listOfBuyTokensAddresses = [];
            this.listOfBuyTokensAddresses.push(poolTokens[0].address);
            this.listOfBuyTokensAddresses.push(poolTokens[1].address);

            this.init();

            if (!this.isAvailableOnNetwork) {
                this.mintAction();
            }
        },

        init() {
            this.loadChains();
            this.loadTokens();
            this.initContractData();

            this.$bus.$on('zap-transaction-finished', (data) => {
                this.finishTransaction();
            })
        },
        addDefaultPoolToken() {
            let poolSelectedToken = this.getDefaultSecondtoken();
            let ovnSelectSelectedToken = this.getSecondDefaultSecondtoken();
            if (!poolSelectedToken || !ovnSelectSelectedToken) {
                this.addNewInputToken();
                this.addNewOutputToken();
                return;
            }

            poolSelectedToken.selected = true;
            ovnSelectSelectedToken.selected = true;
            console.log("poolSelectedToken: ", poolSelectedToken, ovnSelectSelectedToken);

            if (this.swapMethod === 'BUY') {
                this.addSelectedTokenToOutputList(poolSelectedToken, true, 50);
                this.addSelectedTokenToOutputList(ovnSelectSelectedToken, true, 50);
                this.addNewInputToken();
                return;
            }

            if (this.swapMethod === 'SELL') {
                this.addSelectedTokenToInputList(poolSelectedToken, true);
                this.addSelectedTokenToInputList(ovnSelectSelectedToken, true);
                this.addNewOutputToken();
                return;
            }

            console.error("Error when add default ovn token. Method not found: ", this.swapMethod);
        },
        addNewOutputToken() {
            this.outputTokens.push(this.getNewOutputToken());
        },
        removeOutputToken(id) {
            this.removeToken(this.outputTokens, id);
            this.resetOutputs();
        },
        addNewInputToken() {
            this.inputTokens.push(this.getNewInputToken());
        },
        removeInputToken(id) {
            this.removeToken(this.inputTokens, id);
            this.recalculateOvnTokenByAnotherTotalBalances();
        },
        removeToken(tokens, id) {
            // removing by token.id or token.selectedToken.id
            const index = tokens.findIndex(item => item.id === id || (item.selectedToken ? item.selectedToken.id === id : false));
            console.log("removeToken: ", id, index);
            if (index !== -1) {
                if (tokens[index].selectedToken) {
                    tokens[index].selectedToken.selected = false;
                }

                tokens.splice(index, 1);
            }
        },

        changeSwap() {
            console.log("Change swap");
            if (this.swapMethod === 'BUY') {
                this.setSwapMethod('SELL');
                this.clearForm();
                return;
            }

            if (this.swapMethod === 'SELL') {
                this.setSwapMethod('BUY');
                this.clearForm();
                return;
            }

            console.error('Change swap method not found.', this.swapMethod);
        },

        handleCurrentSlippageChanged(newSlippage) {
            console.log('currentSlippage has changed:', newSlippage);

            this.slippagePercent = newSlippage.value;
        },

        finishTransaction() {
            console.log("Finish transaction");
            this.clearForm()
            this.closeWaitingModal();
        },

        clearForm() {
            this.clearAllSelectedTokens();

            if (this.swapMethod === 'BUY') {
                this.addDefaultPoolToken();
                return;
            }

            if (this.swapMethod === 'SELL') {
                this.addDefaultPoolToken();
                return;
            }

            console.error('Clear form, swap method not found.', this.swapMethod);
        },
        resetOutputs() {
            console.log("Reset outputs");
            if (!this.selectedOutputTokens.length) {
                return
            }

            if (this.selectedOutputTokens.length === 2) {
                for (let i = 0; i < this.selectedOutputTokens.length; i++) {
                    let token = this.selectedOutputTokens[i];
                    token.value = 50;
                }
                return;
            }

            for (let i = 0; i < this.selectedOutputTokens.length; i++) {
                let token = this.selectedOutputTokens[i];
                token.value = 0;
            }


            // init first token value
            this.selectedOutputTokens[0].value = 100;

            console.log("selectedOutputTokens after reset: ", this.selectedOutputTokens)
        },
        async stake() {
            try {
                this.trackClick({action: 'click_form_zap_in_stake', event_category: 'Button click', event_label: 'Button zap in stake click' });
            } catch (e) {
                console.error("Track error:", e);
            }

            if (!this.zapPool) {
                console.log("Error when stake. Zap pool not found.")
                return;
            }

            this.lastPoolInfoData = this.poolsInfoMap[this.zapPool.address];
            if (!this.lastPoolInfoData) {
                console.log("Error when stake. Gauge pool not found by pool address: ", this.zapPool.address)
                return;
            }

            if (this.isSwapLoading) {
                console.log('Swap method not available, prev swap in process');
                return;
            }

            console.log("Swap", this.inputTokensWithSelectedTokensCount, this.outputTokensWithSelectedTokensCount);
            if (this.inputTokensWithSelectedTokensCount < 1 || this.outputTokensWithSelectedTokensCount < 1) {
                return;
            }

            this.clickOnStake = true;
            this.isSwapLoading = true;

            let actualGasPriceObject = await this.getActualGasPrice(this.networkId);
            console.log("Actual price for gas. network: ", this.networkId, actualGasPriceObject)
            console.log("Actual price for gas from us calculation. ", this.gasPriceGwei, this.gasPrice, this.gasPriceStation)
            let actualGas = actualGasPriceObject.baseFee;
            if (!actualGas && actualGasPriceObject.prices && actualGasPriceObject.prices.length) {
                actualGas = actualGasPriceObject.prices[0].fee;
                console.log("Actual price for gas when not found base fee. network: ", this.networkId, actualGasPriceObject)
            }

            let outputToken0Price = this.selectedOutputTokens[0].selectedToken.price;
            console.log("outputToken0Price: ", outputToken0Price);
            let outputToken1Price = this.selectedOutputTokens[1].selectedToken.price;
            console.log("outputToken1Price: ", outputToken1Price);

            let reserves = await this.getProportion(this.zapPool.address, this.zapPool);
            console.log("reserves 1: ", reserves.token0Amount);
            console.log("reserves 2: ", reserves.token1Amount);
            let sumReserves = (reserves.token0Amount * outputToken0Price) + (reserves.token1Amount * outputToken1Price);
            console.log("sumReserves: ", sumReserves);

            let userInputTokens = this.selectedInputTokens;
            console.log("User input tokens: ", userInputTokens);
            let poolOutputTokens = this.selectedOutputTokens;
            console.log("Pool output tokens: ", poolOutputTokens);
            let formulaInputTokens = [];
            let formulaOutputTokens = [];
            for (let i = 0; i < userInputTokens.length; i++) {
                let inputToken = userInputTokens[i];
                let userInputToken = inputToken.selectedToken;

                let isFindUserInputTokenInPoolTokens = poolOutputTokens.find((poolToken) => poolToken.selectedToken.address === userInputToken.address);
                console.log("User token find in pool: ", isFindUserInputTokenInPoolTokens, userInputToken);
                if (isFindUserInputTokenInPoolTokens) {
                    // if user token exist in pool pair, move to output for proportion formula
                    formulaOutputTokens.push({
                        decimals: userInputToken.decimals,
                        address: userInputToken.address,
                        contractValue: inputToken.contractValue,
                        price: userInputToken.price
                    });
                    continue;
                }

                // if user token don't exist in pool pair, move to input for proportion formula
                formulaInputTokens.push({
                    decimals: userInputToken.decimals,
                    address: userInputToken.address,
                    contractValue: inputToken.contractValue,
                    price: userInputToken.price
                });
            }

            console.log("formulaInputTokens: ", formulaInputTokens);
            console.log("formulaOutputTokens: ", formulaOutputTokens);

            // sort output formula and fill amount by 0;
            let formulaResultOutputWithZero = [];
            for (let i = 0; i < poolOutputTokens.length; i++) {
                let outputToken = poolOutputTokens[i];
                let poolOutputToken = outputToken.selectedToken;
                let userInputTokenInFormulaOutputTokens = formulaOutputTokens.find((formulaToken) => formulaToken.address === poolOutputToken.address);
                console.log("Pool token find in formula output token: ", userInputTokenInFormulaOutputTokens, poolOutputToken);
                if (userInputTokenInFormulaOutputTokens) {
                    // if user token exist in pool pair, move to output for proportion formula
                    formulaResultOutputWithZero.push(userInputTokenInFormulaOutputTokens);
                    continue;
                }

                // fill amount with 0
                formulaResultOutputWithZero.push(
                    {
                        decimals: poolOutputToken.decimals,
                        address: poolOutputToken.address,
                        contractValue: 0,
                        price: poolOutputToken.price
                    }
                );
            }

            // formulaOutputTokens sorted by pool pair and with zero for not exist in output formula.
            formulaOutputTokens = formulaResultOutputWithZero;
            console.log('formulaOutputTokens after sort and fill zero', formulaOutputTokens);

            let inputDecimals = formulaInputTokens.map(token => token.decimals);
            console.log('inputDecimals', inputDecimals);
            let inputAddresses = formulaInputTokens.map(token => token.address);
            console.log('inputAddresses', inputAddresses);
            let inputAmounts = formulaInputTokens.map(token => token.contractValue);
            console.log('inputAmounts', inputAmounts);
            let inputPrices = formulaInputTokens.map(token => token.price);
            console.log('inputPrices', inputPrices);

            // (!) List - formulaOutputTokens with 0 amount and sort like in pool pair.
            let outputDecimals = formulaOutputTokens.map(token => token.decimals);
            console.log('outputDecimals', outputDecimals);
            let outputAddresses = formulaOutputTokens.map(token => token.address);
            console.log('outputAddresses', outputAddresses);
            let outputAmounts = formulaOutputTokens.map(token => token.contractValue);
            console.log('outputAmounts', outputAmounts);
            let outputPrices = formulaOutputTokens.map(token => token.price);
            console.log('outputPrices', outputPrices);

            const proportions = this.calculateProportionForPool({
                inputTokensDecimals: [...inputDecimals],
                inputTokensAddresses: [...inputAddresses],
                inputTokensAmounts: [...inputAmounts],
                inputTokensPrices: [...inputPrices],
                outputTokensDecimals: [...outputDecimals],
                outputTokensAddresses: [...outputAddresses],
                outputTokensAmounts: [...outputAmounts],
                outputTokensPrices: [...outputPrices],
                proportion0: (reserves[0] * outputPrices[0]) / sumReserves
            });


            console.log("Proportion for odos: ", proportions);
            proportions.outputTokens = proportions.outputTokens.filter((item, index) => item.proportion > 0);
            console.log("Proportion for odos after filter: ", proportions);

            let requestOutputTokens = this.getRequestOutputTokens();
            let requestInputTokens = this.getRequestInputTokens();
            console.log("requestOutputTokens: ", requestOutputTokens);
            console.log("requestInputTokens: ", requestInputTokens);

            let request = {
                "chainId": this.networkId,
                "inputTokens": proportions.inputTokens,
                "outputTokens": proportions.outputTokens,
                "gasPrice": actualGas,
                "userAddr": this.zapContract.options.address,
                "slippageLimitPercent": this.getSlippagePercent(),
            }

            let requestData = {
                chainId: request.chainId,
                inputTokens: request.inputTokens,
                outputTokens: request.outputTokens,
                gasPrice: request.gasPrice,
                userAddr: request.userAddr,
                slippageLimitPercent: request.slippageLimitPercent,
                sourceBlacklist: this.getSourceLiquidityBlackList(),
                sourceWhitelist: [],
                simulate: false,
                pathViz: false,
                disableRFQs: false,
                referralCode: this.odosReferalCode
            }

            console.log("Odos request data", requestData, this.zapPool);

            this.swapRequest(requestData)
                .then(async data => {
                    console.log("Odos swap request quota from zap", data)
                    console.log("Odos swap request quota from zap proportions", proportions)

                    let assembleData = {
                        "userAddr": request.userAddr,
                        "pathId": data.pathId,
                        "simulate": true
                    }

                    this.assembleRequest(assembleData).then(async responseAssembleData => {
                        console.log("Assemble data: ", responseAssembleData)

                        // if (responseAssembleData.simulation && !responseAssembleData.simulation.isSuccess) {
                        //     this.closeWaitingModal();
                        //     let errMsg = responseAssembleData.simulation.simulationError && responseAssembleData.simulation.simulationError.errorMessage ? responseAssembleData.simulation.simulationError.errorMessage : 'Transaction simulation is failed';
                        //     console.error("Error before send zap swap transaction: ", errMsg)
                        //     this.showErrorModalWithMsg({errorType: 'slippage', errorMsg: errMsg},);
                        //     this.isSwapLoading = false;
                        //     return;
                        // }

                        // { "inTokens": [ "0x0000000000000000000000000000000000000000", "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a" ], "outTokens": [ "0xe80772eaf6e2e18b651f160bc9158b2a5cafca65", "0xeb8e93a0c7504bffd8a8ffa56cd754c63aaebfe8" ], "inAmounts": [ "1000000000000000000", "1000000000000000000" ], "outAmounts": [ "748864357", "1091926251518831755264" ], "gasEstimate": 613284, "dataGasEstimate": 0, "gweiPerGas": 1000000, "gasEstimateValue": 1129317.6351027626, "inValues": [ 1841.4255542063122, 1.0001535800151131 ], "outValues": [ 748.6976540455693, 1091.9074095761437 ], "netOutValue": -1127477.030039141, "priceImpact": -0.0008666645762853047, "percentDiff": -0.09881777902469935, "pathId": "a5fc8568c59f7cf8cc8df9194d66b4f6", "pathViz": null, "blockNumber": 89177560 }
                        await this.initZapInTransaction(responseAssembleData, proportions.inputTokens, proportions.outputTokens, proportions, this.lastPoolInfoData, this.zapPool, request.gasPrice);

                        this.isSwapLoading = false;
                        this.clickOnStake = false;
                    }).catch(e => {
                        console.error("Odos assemble request failed swap form", e)
                        this.isSwapLoading = false;
                        this.clickOnStake = false;
                    })
                }).catch(e => {
                    console.error("Odos swap request failed from zap", e)
                    this.isSwapLoading = false;
                    this.clickOnStake = false;
                })
        },

        async getOdosRequest(request) {
            let swapParams = {
                "chainId": request.chainId,
                "inputTokens": request.inputTokens,
                "outputTokens": request.outputTokens,
                "gasPrice": request.gasPrice,
                "userAddr": request.userAddr,
                "slippageLimitPercent": request.slippageLimitPercent,
                "sourceBlacklist": this.getSourceLiquidityBlackList(),
                "sourceWhitelist": [],
                "simulate": false,
                "pathViz": false,
                "disableRFQs": false
            }

            console.log("Odos request function: ", swapParams)

            // @ts-ignore
            const url = 'https://api.overnight.fi/root/odos/sor/swap';
            let transaction;
            try {
                // transaction = (await axios.post(url, swapParams, { headers: { "Accept-Encoding": "br" } }));
                transaction = (await axios.post(url, swapParams));
                console.log("Odos success response function: ", transaction)
            } catch (e) {
                console.error("[chronosZap] getSwapTransaction: " + e);
                return 0;
            }

            if (transaction.statusCode === 400) {
                console.error(`[chronosZap]  ${transaction.description}`);
                return 0;
            }

            if (transaction.data.transaction === undefined) {
                console.error("[chronosZap] transaction.tx is undefined");
                return 0;
            }

            console.log('Success get data from Odos!', transaction);
            return transaction.data.transaction;
        },

        getSourceLiquidityBlackList() {
            let sourceBlacklist = [...this.sourceLiquidityBlacklist];
            console.log("this.zapPool for exclude liquidity: ", this.zapPool);
            let excludeLiquidityByPlatform = this.mapExcludeLiquidityPlatform[this.zapPool.platform];
            if (excludeLiquidityByPlatform && excludeLiquidityByPlatform.length) {
                sourceBlacklist = [...sourceBlacklist, ...excludeLiquidityByPlatform];
            }

            return sourceBlacklist;
        },
        toApproveAndDepositSteps: async function (data, lastPoolInfoData) {
            console.log("Approve and deposit tx steps.", data, this.poolTokenContract, this.gaugeContract, lastPoolInfoData)
            let putIntoPoolEvent;
            let returnedToUserEvent;
            for (const key of Object.keys(data.events)) {
                const value = data.events[key];

                console.log(`Key: ${key}`);
                console.log(`Value:`, value);

                if (key === 'PutIntoPool') {
                    putIntoPoolEvent = value;
                    this.lastPutIntoPoolEvent = putIntoPoolEvent;
                    console.log(`Tokens put into pool: ${putIntoPoolEvent.returnValues.amountsPut} ${putIntoPoolEvent.returnValues.tokensPut}`);
                }

                if (key === 'ReturnedToUser') {
                    returnedToUserEvent = value;
                    this.lastReturnedToUserEvent = returnedToUserEvent;
                    console.log(`Tokens returned to user: ${returnedToUserEvent.returnValues.amountsReturned} ${returnedToUserEvent.returnValues.tokensReturned}`);
                }

            }

            this.stopSwapConfirmTimer();
            this.additionalSwapStepType = 'APPROVE';

            if (lastPoolInfoData.approveType === 'NFT') {
                console.log("Approve NFT gauge", lastPoolInfoData);
                this.approveNftGauge(putIntoPoolEvent, returnedToUserEvent, lastPoolInfoData);
                return;
            }

            console.log("Approve gauge", lastPoolInfoData);
            this.approveGauge(putIntoPoolEvent, returnedToUserEvent, lastPoolInfoData);

        },
        async approveNftGauge(putIntoPoolEvent, returnedToUserEvent, lastPoolInfoData) {
            console.log(this.gaugeContract);
            this.showWaitingModal('Approving NFT in process');

            if (!this.lastNftTokenId) {
                try {
                    let tokenId = await this.getLastNftId();
                    this.lastNftTokenId = tokenId;
                    console.log("Last nft id: ", tokenId);
                    let params = {from: this.account, gasPrice: this.gasPriceGwei};
                    this.gaugeContract.methods.approve(this.poolTokenContract.options.address, tokenId).send(params).then(data => {
                        console.log("Approve nft gauge success", data);
                        this.additionalSwapStepType = 'DEPOSIT';
                        this.closeWaitingModal();
                        this.depositGauge(putIntoPoolEvent, returnedToUserEvent, lastPoolInfoData, this.lastNftTokenId);
                    }).catch(e => {
                        console.error("Approve nft gauge failed", e);
                        this.lastNftTokenId = null;
                        this.closeWaitingModal();
                    });
                } catch (e) {
                    console.error("Approve nft gauge failed", e);
                    this.lastNftTokenId = null;
                    this.closeWaitingModal();
                }
            } else {
                this.additionalSwapStepType = 'DEPOSIT';
                this.depositGauge(putIntoPoolEvent, returnedToUserEvent, lastPoolInfoData, this.lastNftTokenId);
            }

        },
        getLastNftId() {
            return this.gaugeContract.methods.balanceOf(this.account).call().then(count => {
                console.log("Nft count: ", count);
                return this.gaugeContract.methods.tokenOfOwnerByIndex(this.account, count - 1).call().then(tokenId => {
                    console.log("Last nft id: ", tokenId);
                    return tokenId;
                });
            });
        },
        async approveGauge(putIntoPoolEvent, returnedToUserEvent, lastPoolInfoData) {
            console.log(this.gaugeContract);
            let isGaugeApproved = await this.checkApproveForGauge(this.poolTokenContract, this.gaugeContract.options.address, 1000000000000000);
            console.log("Approving gauge", isGaugeApproved);
            if (!isGaugeApproved) {
                this.showWaitingModal('Approving gauge in process');
                this.approveGaugeForStake().then(data => {
                    console.log("Success gauge approve: ", data);
                    this.additionalSwapStepType = 'DEPOSIT';
                    this.closeWaitingModal();
                    this.depositGauge(putIntoPoolEvent, returnedToUserEvent, lastPoolInfoData);
                }).catch(e => {
                    console.error("Error when gauge approve: ", e);
                    this.closeWaitingModal();
                });
            } else {
                this.additionalSwapStepType = 'DEPOSIT';
                this.depositGauge(putIntoPoolEvent, returnedToUserEvent, lastPoolInfoData);
            }
        },
        depositGauge(putIntoPoolEvent, returnedToUserEvent, lastPoolInfoData, lastNftTokenId) {
            this.showWaitingModal('Stake LP in process');

            this.depositAllAtGauge(this.account, lastPoolInfoData, lastNftTokenId).then(data => {
                this.closeWaitingModal();

                console.log("Deposit success!", data);

                const inputTokens = [...this.selectedInputTokens]
                const outputTokens = [...this.selectedOutputTokens]
                this.showSuccessPoolModal(
                    true,
                    inputTokens,
                    outputTokens,
                    data.transactionHash,
                    putIntoPoolEvent,
                    returnedToUserEvent,
                    this.zapPool
                );

                // event
                this.$bus.$emit('zap-transaction-finished', true);
                this.additionalSwapStepType = null;
                this.clearZapData();

                this.loadBalances();
            }).catch(e => {
                console.log("Deposit error!", e);
                this.closeWaitingModal();
                this.additionalSwapStepType = 'DEPOSIT';
            });
        },
        clearZapData() {
            this.lastPutIntoPoolEvent = null;
            this.lastReturnedToUserEvent = null;
            this.lastZapResponseData = null;
        },
        finishSingleStepTransaction: function (data) {
            console.log("Finish single tx step.", data)
            let putIntoPoolEvent;
            let returnedToUserEvent;
            for (const key of Object.keys(data.events)) {
                const value = data.events[key];

                console.log(`Key: ${key}`);
                console.log(`Value:`, value);

                if (key === 'PutIntoPool') {
                    putIntoPoolEvent = value;
                    this.lastPutIntoPoolEvent = putIntoPoolEvent;
                    console.log(`Tokens put into pool: ${putIntoPoolEvent.returnValues.amountsPut} ${putIntoPoolEvent.returnValues.tokensPut}`);
                }

                if (key === 'ReturnedToUser') {
                    returnedToUserEvent = value;
                    this.lastReturnedToUserEvent = returnedToUserEvent;
                    console.log(`Tokens returned to user: ${returnedToUserEvent.returnValues.amountsReturned} ${returnedToUserEvent.returnValues.tokensReturned}`);
                }

            }

            const inputTokens = [...this.selectedInputTokens]
            const outputTokens = [...this.selectedOutputTokens]
            this.showSuccessPoolModal(
                true,
                inputTokens,
                outputTokens,
                data.transactionHash,
                putIntoPoolEvent,
                returnedToUserEvent,
                this.zapPool
            );

            // event
            this.$bus.$emit('zap-transaction-finished', true);
            this.clearZapData();
            this.loadBalances();
        },
        async initZapInTransaction(responseData, requestInputTokens, requestOutputTokens, proportions, poolInfo, zapPool, gasPrice) {
            console.log("Chronos-odos transaction data", responseData, this.zapContract, poolInfo, zapPool);
            let gaugeAddress = poolInfo.gauge;
            if (!this.zapContract) {
                console.error("Init zap transactions failed, chronos contract not found. responseData: ", responseData)
                return;
            }

            this.startSwapConfirmTimer();

            console.log("Odos swap request success", responseData, this.zapContract, requestInputTokens, requestOutputTokens, gaugeAddress)
            // console.log("Odos swap request success", data)
            let requestInput = [];
            for (let i = 0; i < requestInputTokens.length; i++) {
                requestInput.push({
                    tokenAddress: requestInputTokens[i].tokenAddress,
                    amountIn: requestInputTokens[i].amount,
                })
            }

            let requestOutput = [];
            for (let i = 0; i < requestOutputTokens.length; i++) {
                requestOutput.push({
                    tokenAddress: requestOutputTokens[i].tokenAddress,
                    receiver: this.zapContract.options.address,
                })
            }

            let txData = {
                inputs: requestInput,
                outputs: requestOutput,
                data: responseData.transaction.data
            };

            let gaugeData;
            if (zapPool.platform === 'Arbidex' || zapPool.platform === 'Baseswap' || zapPool.platform === 'Alienbase') {
                gaugeData = {
                    gauge: gaugeAddress,
                    amountsOut: [proportions.amountToken0Out, proportions.amountToken1Out],
                    poolId: poolInfo.poolId
                }
            } else if (zapPool.platform === 'Defiedge') {
                gaugeData = {
                    chef: this.lastPoolInfoData.chef,
                    pid: this.lastPoolInfoData.poolId,
                    gauge: gaugeAddress,
                    amountsOut: [proportions.amountToken0Out, proportions.amountToken1Out],
                }
            } else {
                gaugeData = {
                    gauge: gaugeAddress,
                    amountsOut: [proportions.amountToken0Out, proportions.amountToken1Out],
                }
            }

            console.log("Odos zap request data:", txData, gaugeData, this.zapContract);

            this.showWaitingModal('Staking in process');

            let params = {from: this.account, gasPrice: this.gasPriceGwei};
            this.zapContract.methods.zapIn(
                txData,
                gaugeData).send(params)
                .then(data => {
                    this.lastZapResponseData = data;

                    if (this.currentZapPlatformContractType.type === 'LP_WITH_STAKE_IN_ONE_STEP') {
                        console.log("Finish single step transaction: ", this.lastZapResponseData);
                        this.finishSingleStepTransaction(this.lastZapResponseData);
                        return;
                    }

                    if (this.currentZapPlatformContractType.type === 'LP_STAKE_DIFF_STEPS') {
                        console.log("Finish single step transaction: ", this.lastZapResponseData);
                        this.toApproveAndDepositSteps(this.lastZapResponseData, poolInfo);
                        return;
                    }

                    console.error("Error when end of transaction, method type not found. ", this.currentZapPlatformContractType);
                }).catch(e => {
                console.log("Zap odos call error: ", e);
                if (e && e.code === 4001) {
                    if (e.message === 'User rejected the request.') {
                        this.stopSwapConfirmTimer();
                        this.clickOnStake = false;
                    }
                }
                this.closeWaitingModal();
                this.showErrorModalWithMsg({errorType: 'zap', errorMsg: e}, );
            })

            this.isSwapLoading = false;
        },
        clearQuotaInfo() {
            this.pathViz = null
            this.quotaResponseInfo = null;
            this.swapResponseInfo = null;
            // this.updatePathViewFunc(this.pathViz, [], []);
        },
        async recalculateProportion() {
            console.log("recalculateProportion Zap address: ", this.zapPool.address, this.zapPool)
            let reserves = await this.getProportion(this.zapPool.address, this.zapPool);
            console.log("recalculateProportion Reserves data ", reserves);

            let outputToken0Price = this.selectedOutputTokens[0].selectedToken.price;
            console.log("recalculateProportion outputToken0Price: ", outputToken0Price);
            let outputToken1Price = this.selectedOutputTokens[1].selectedToken.price;
            console.log("recalculateProportion outputToken1Price: ", outputToken1Price);

            let sumReserves = (reserves.token0Amount * outputToken0Price) + (reserves.token1Amount * outputToken1Price);
            console.log("recalculateProportion Reserves sumReserves: ", sumReserves);
            // "proportion": reserves[0] / sumReserves
            this.selectedOutputTokens[0].value = (reserves[0] * outputToken0Price) / sumReserves * 100;
            this.selectedOutputTokens[1].value = (reserves[1] * outputToken1Price) / sumReserves * 100;

            console.log("recalculateProportion selectedOutputTokens after reset: ", this.selectedOutputTokens)

            this.recalculateOutputTokensSum();
        },
        async simulateSwap() {
            if (this.isSumulateSwapLoading) {
                console.log('Simulate Swap method not available, prev swap in process');
                return;
            }

            console.log("Simulate Swap", this.inputTokensWithSelectedTokensCount, this.outputTokensWithSelectedTokensCount);
            if (this.inputTokensWithSelectedTokensCount < 1 || this.outputTokensWithSelectedTokensCount < 1) {
                return;
            }

            this.updateIsLoadingDataFunc(true);
            this.isSumulateSwapLoading = true;

            let actualGasPriceObject = await this.getActualGasPrice(this.networkId);
            console.log("Actual price for gas. network: ", this.networkId, actualGasPriceObject)
            let actualGas = actualGasPriceObject.baseFee;
            if (!actualGas && actualGasPriceObject.prices && actualGasPriceObject.prices.length) {
                actualGas = actualGasPriceObject.prices[0].fee;
                console.log("Actual price for gas when not found base fee. network: ", this.networkId, actualGasPriceObject)
            }

            let input = this.getRequestInputTokens(false);
            let output = this.getRequestOutputTokens(false);
            if (!input.length || !output.length) {
                this.isSumulateSwapLoading = false;
                console.log('simulate Swap not allowed', input, output);
                return;
            }

            let requestData = {
                chainId: this.networkId,
                // chainId: 1,
                inputTokens: input,
                outputTokens: output,
                gasPrice: actualGas,
                userAddr: this.account,
                slippageLimitPercent: this.getSlippagePercent(),
                sourceBlacklist: ['Hashflow', 'Wombat'],
                sourceWhitelist: [],
                simulate: true,
                pathViz: true,
                // disableRFQs: false
            }

            this.clearQuotaInfo();

            console.log("Odos simulate swap request data", requestData);
            this.quoteRequest(requestData)
                .then(data => {
                    console.log("Odos simulate swap request success", data)
                    this.isSumulateSwapLoading = false;
                    this.updateIsLoadingDataFunc(false);

                    // todo 5 filter by value > 0 this.selectedInputTokens.filer(item => item.selectedToken.value > 0);
                    // .filter(item => item.selectedToken.value && item.selectedToken.value > 0)
                    // .filter(item => item.selectedToken.value && item.selectedToken.value > 0)
                    // .filter(item => item.selectedToken.value && item.selectedToken.value > 0)
                    this.updatePathViewFunc(data.pathViz,
                        this.selectedInputTokens,
                        this.selectedOutputTokens)
                    this.pathViz = data.pathViz;
                }).catch(e => {
                console.error("Odos simulate swap request failed", e)
                this.isSumulateSwapLoading = false;
                this.updateIsLoadingDataFunc(false);
            })
        },

        getSlippagePercent() {
            // slippage
            let slippageInfo = localStorage.getItem('odos_slippage_value');
            let slippagePercent = 0.05; // default
            if (!slippageInfo || slippageInfo === 'undefined' || slippageInfo === 'null') {
                slippageInfo = null;
            }

            if (slippageInfo) {
                console.log('slippageInfo: ', slippageInfo)
                let slippageInfoObject = JSON.parse(slippageInfo);
                slippagePercent = slippageInfoObject.value;
            }

            this.slippagePercent = slippagePercent;
            return slippagePercent;
        },

        async disapproveToken(token) {
            let selectedToken = token.selectedToken;
            if (!selectedToken || !selectedToken.approveData.approved) {
                return
            }

            let tokenContract = this.tokensContractMap[selectedToken.address];
            // this.clearApproveToken(tokenContract, this.routerContract.options.address)
            this.clearApproveToken(tokenContract, this.zapContract.options.address)
                .then(data => {
                    console.log("Clear approve success. ", token, data);
                    this.checkApproveForToken(token);
                    this.isShowDecreaseAllowanceButton = false;
                }).catch(e => {
                this.isShowDecreaseAllowanceButton = true;
                console.error("Clear approve failed. ", e)
            })
        },
        async checkApproveForToken(token, checkedAllowanceValue) { // checkedAllowanceValue in wei
            let selectedToken = token.selectedToken;
            if (selectedToken.address === '0x0000000000000000000000000000000000000000') {
                console.log("Check approve not available. its a root token: ", token);
                selectedToken.approveData.approved = true
                return;
            }

            let tokenContract = this.tokensContractMap[selectedToken.address];
            console.log('Check Approve contract: ', token, tokenContract, this.account, this.zapContract.options.address);
            // let allowanceValue = await this.getAllowanceValue(tokenContract, this.account, this.routerContract.options.address);
            let allowanceValue = await this.getAllowanceValue(tokenContract, this.account, this.zapContract.options.address);
            console.log('Approve value: ', allowanceValue);

            selectedToken.approveData.allowanceValue = allowanceValue * 1;
            if (!selectedToken.approveData.allowanceValue) {
                selectedToken.approveData.approved = false
                return;
            }

            if (!checkedAllowanceValue) {
                selectedToken.approveData.approved = true
                return;
            }

            selectedToken.approveData.approved = selectedToken.approveData.allowanceValue >= checkedAllowanceValue;
        },

        async approve(token) {
            this.showWaitingModal('Approving in process');
            console.log("Approve contract token: ", token)

            await this.checkApproveForToken(token, token.contractValue);
            let selectedToken = token.selectedToken;
            if (selectedToken.approveData.approved) {
                console.log("Approve not needed for token: ", token);
                this.closeWaitingModal();
                return;
            }

            let tokenContract = this.tokensContractMap[selectedToken.address];
            // let approveValue = selectedToken.balanceData.originalBalance*1 ? selectedToken.balanceData.originalBalance : (10000000000000 + '');
            let approveValue = this.web3.utils.toWei("10000000", token.selectedToken.weiMarker);
            console.log('Approve contract approveValue: ', approveValue);
            console.log('Approve contract newApproveValue: ', token, selectedToken, selectedToken.decimals, tokenContract, this.account, this.zapContract.options.address, approveValue);
            this.approveToken(tokenContract, this.zapContract.options.address, approveValue)
                .then(data => {
                    console.log("Success approving", data);
                    this.checkApproveForToken(token, token.contractValue);
                    this.closeWaitingModal();
                })
                .catch(e => {
                    console.error("Error when approve token.", e);
                    this.closeWaitingModal();
                    this.showErrorModalWithMsg({errorType: 'approve', errorMsg: e}, );
                });
        },

        getRequestInputTokens(ignoreNullable) {
            let inputTokens = [];
            for (let i = 0; i < this.selectedInputTokens.length; i++) {
                let token = this.selectedInputTokens[i];
                let selectedToken = token.selectedToken;
                console.log("input token: ", token);
                if (!ignoreNullable && !token.value) {
                    console.log("token value is 0: ", token);
                    continue;
                }

                if (token.value > 0) {
                    inputTokens.push({
                        tokenAddress: selectedToken.address,
                        amount: token.contractValue
                    })
                }
            }
            return inputTokens;
        },
        getRequestOutputTokens(ignoreNullable) {
            let outputTokens = [];
            for (let i = 0; i < this.selectedOutputTokens.length; i++) {
                let token = this.selectedOutputTokens[i];
                let selectedToken = token.selectedToken;
                if (!ignoreNullable && !token.value) {
                    console.log("output token value is 0: ", token);
                    continue;
                }

                outputTokens.push({
                    tokenAddress: selectedToken.address,
                    proportion: token.value
                })
            }
            return outputTokens;
        },

        lockProportion(isLock, token) {
            console.log("lockProportionFunc", isLock, token);
            if (this.outputTokensWithSelectedTokensCount <= 1 && !isLock) {
                console.log("Its first token, unlock is disable");
                return
            }

            token.locked = isLock
        },
        updateSliderValue(token, value) {
            console.log("Swap form", token.id, value, !this.isSlidersOutOfLimit());
            let oldTokenValue = token.value;

            token.value = value;

            // if(!this.isSlidersOutOfLimit()) {
            token.value = value;
            this.subtraction(token, 100 - value);
            this.recalculateOutputTokensSum();

            // this.updateQuotaInfo();

            // if (oldTokenValue > value) {
            //     this.subTokensProportions(token, 100 - value)
            // } else {
            //     this.addTokensProportions(token, 100 - value)
            // }
            // }
        },
        recalculateOutputTokensSum() {
            console.log(`recalculateOutputTokensSum. recalculate token count ${this.selectedOutputTokens.length} usdSum: ${this.sumOfAllSelectedTokensInUsd}`);
            for (let i = 0; i < this.selectedOutputTokens.length; i++) {
                let token = this.selectedOutputTokens[i];
                let tokenSum = this.sumOfAllSelectedTokensInUsd * token.value / 100;
                let sum = this.swapMethod === 'BUY' ? tokenSum / token.selectedToken.price : tokenSum * token.selectedToken.price;
                console.log(`Recalculate token.selectedToken ${token.selectedToken.symbol} price: ${token.selectedToken.price}, newUsdSum: ${sum} tokenSum ${tokenSum}`, token);
                token.sum = this.$utils.formatMoney(sum, 4)
            }
        },
        subTokensProportions(currentToken, difference) {
            let tokens = this.getActiveTokens(currentToken);
            if (tokens.length === 0) {
                return;
            }

            let proportion = Math.floor(difference / tokens.length)
            let remains = difference % tokens.length
            console.log('proportion', proportion);
            console.log('remains', remains);

            for (let i = 0; i < tokens.length; i++) {
                let token = tokens[i];
                let tokenValue = token.value - proportion;
                if (tokenValue <= 0) {
                    token.value = 0;
                    continue;
                }

                token.value = tokenValue;
            }

            let lastToken = tokens[0].value;
            let lastTokenValue = lastToken - remains;
            if (lastTokenValue <= 0) {
                lastToken.value = 0;
            } else {
                lastToken.value = lastTokenValue;
            }
        },
        addTokensProportions(currentToken, difference) {
            let tokens = this.getActiveTokens(currentToken);
            if (tokens.length === 0) {
                return;
            }

            let proportion = Math.floor(difference / tokens.length)
            let remains = difference % tokens.length
            console.log('proportion', proportion);
            console.log('remains', remains);

            for (let i = 0; i < tokens.length; i++) {
                let token = tokens[i];
                let tokenValue = token.value + proportion;
                // if (tokenValue >= 100) {
                //     token.value = 0;
                //     continue;
                // }

                token.value = tokenValue;
            }

            let lastToken = tokens[0].value;
            let lastTokenValue = lastToken + remains;
            // if (lastTokenValue <= 0) {
            //     lastToken.value = 0;
            // } else {
            lastToken.value = lastTokenValue;
            // }
        },
        subtraction(token, difference) {

            let tokens = this.getActiveTokens(token)
            // tokens.sort((a, b) => a.percentage - b.percentage)
            console.log('tokens', tokens, difference)
            if (tokens.length === 0) {
                return;
            }

            let proportion = Math.floor(difference / tokens.length)
            let remains = difference % tokens.length
            console.log('proportion', proportion);
            console.log('remains', remains);

            this.calculateProportions(tokens, proportion);
            // integer (natural)
            // if (difference >= tokens.length) {
            //     remains += this.calculateProportions(tokens, proportion)
            //     this.subtractionOnAllSlidersWithProportion(tokens)
            // }

            // while (remains > 0) {
            //     let slider = null
            //     if (this.lastChangeIndexNumber + 1 > tokens.length) {
            //         this.lastChangeIndexNumber = 1
            //         slider = this.getByNumber(tokens, this.lastChangeIndexNumber)
            //     } else {
            //         this.lastChangeIndexNumber++
            //         slider = this.getByNumber(tokens, this.lastChangeIndexNumber)
            //     }
            //
            //     if (!slider) {
            //         console.error("Slider not found by lastChangeIndexNumber: " + this.lastChangeIndexNumber)
            //         return
            //     }
            //
            //     if (slider.percentage >= 1) {
            //         slider.percentage--
            //         remains--
            //     }
            // }
        },
        calculateProportions(tokens, proportion) {
            tokens.value = proportion;
            for (let i = 0; i < proportion; i++) {
                for (let i = 0; i < tokens.length; i++) {
                    let token = tokens[i];
                    // token.value++
                    token.value = proportion;
                }
            }

            this.recalculateOutputTokensSum();
        },
        getOutputsTokensPercentage() {
            let tokensPercentage = 0;
            for(let token of this.outputTokens) {
                tokensPercentage += token.value
            }

            console.log("Outs percent: ", tokensPercentage)
            return tokensPercentage;
        },

        recalculateOvnTokenByAnotherTotalBalances() {
            console.log("Recalculate ovn token by another total balances: ", this.selectedOvnInputTokens, this.selectedNoneOvnInputTokens);
            if (!this.selectedOvnInputTokens || !this.selectedOvnInputTokens.length) {
                return;
            }

            if (!this.selectedNoneOvnInputTokens.length) {
                this.clearAllInputSelectedTokens();
                this.addNewInputToken();
                return;
            }

            this.recalcualteOvnInputValue();
        },
        recalcualteOvnInputValue() {
            setTimeout(() => {
                let ovnToken = this.selectedOvnInputTokens[0];
                console.log("Recalculate ovn token Total balance more than ovn token:", ovnToken, ovnToken.usdValue);
                let ovnUsdValue = ovnToken.usdValue;

                let totalBalance = this.totalNoneOvnUsdInputsUsdBalance;
                if (totalBalance >= ovnUsdValue) {
                    console.log("Recalculate ovn token Total balance more than ovn token balance: ", totalBalance, ovnUsdValue);
                    return;
                }

                let diffInUsd = ovnUsdValue - totalBalance;
                let diff = diffInUsd / ovnToken.selectedToken.price;
                let newValue = ovnToken.value - diff;

                // console.log("Total balance less than ovn token balance: ", totalBalance, ovnTokenBalance, diffInUsd, diff);
                console.log(`Recalculate ovn token Total balance less than ovn token balance.
            totalBalance: ${totalBalance} ovnUsdValue: ${ovnUsdValue} diffInUsd: ${diffInUsd} diff: ${diff} newValue: ${newValue}`)

                if (newValue <= 0) {
                    this.updateTokenValue(ovnToken, 0);
                    return;
                }

                this.updateTokenValue(ovnToken, newValue);
            }, 30)
        },

        initDefaultTopInputTokensByBalance(tokens) {
            console.log("Top any tokens by balance: ", tokens);
            console.log("Top any tokens by balance selectedOvnInputTokens: ", this.selectedOvnInputTokens);
            console.log("Top any tokens by balance selectedOvnOutputTokens: ", this.selectedOvnOutputTokens);
            console.log("Top any tokens by balance noneOvnInputTokens: ", this.noneOvnInputTokens);

            if (!tokens || !tokens.length) {
                return;
            }

            if (!this.selectedOvnInputTokens || !this.selectedOvnInputTokens.length) {
                return;
            }

            let onvToken = this.selectedOvnInputTokens[0];
            this.clearAllInputSelectedTokens(onvToken)
            let ovnTokenBalance = onvToken.selectedToken.balanceData.balanceInUsd;

            // find top 5 tokens by balance and order desc
            let topTokens = tokens.sort((a, b) => {
                return b.balanceData.balance - a.balanceData.balance;
            }).slice(0, 5);

            // find all with balance
            topTokens = topTokens.filter((token) => {
                return token.balanceData.balance > 0;
            });

            console.log("Top any tokens by balance tokensByBalance: ", topTokens);

            let tokensByBalanceSum = 0;
            let tokensByBalanceResult = [];
            for (let i = 0; i < topTokens.length; i++) {
                let token = topTokens[i];
                if (!token.balanceData.balance) {
                    continue;
                }

                tokensByBalanceSum += token.balanceData.balanceInUsd;
                tokensByBalanceResult.push(token);
                if (tokensByBalanceSum >= ovnTokenBalance) {
                    break;
                }
            }

            console.log("Top tokens after filter: ", tokensByBalanceSum, tokensByBalanceResult)

            for (let i = 0; i < tokensByBalanceResult.length; i++) {
                let token = tokensByBalanceResult[i];
                token.selected = true;
                console.log("Top tokens after filter token: ", token)
                this.addSelectedTokenToInputList(token, true);
                // this.addNewOutputToken();
            }

            this.recalcualteOvnInputValue();
        },

        addSelectedTokenToList(selectedToken, swapMethod, selectTokenType) {
            console.log(this.isInputToken(swapMethod, selectTokenType) ? 'INPUT TOKEN' :  'OUTPUT TOKEN');
            if (this.isInputToken(swapMethod, selectTokenType)) {
                this.addSelectedTokenToInputList(selectedToken, true);
                return;
            }

            this.addSelectedTokenToOutputList(selectedToken, true, 50);
        },
        addSelectedTokenToInputList(selectedToken, isAddAllBalance) {
            // todo computed ovn input tokens and logic here
            console.log("computed ovn input tokens and logic here!", selectedToken, isAddAllBalance);

            let newInputToken = this.getNewInputToken();
            newInputToken.selectedToken = selectedToken;
            this.inputTokens.push(newInputToken);
            this.removeAllWithoutSelectedTokens(this.inputTokens);

            if (isAddAllBalance) {
                console.log("computed ovn input tokens and logic here! 2", newInputToken, isAddAllBalance);
                setTimeout(() => {
                    this.updateTokenValue(newInputToken, newInputToken.selectedToken.balanceData.balance);
                }, 10);
            }

            if (newInputToken.selectedToken.symbol === 'OVN') {
                this.initDefaultTopInputTokensByBalance(this.noneOvnTokens);
            }

            this.checkApproveForToken(newInputToken);
        },
        addSelectedTokenToOutputList(selectedToken, isLocked, startPercent) {
            let newOutputToken = this.getNewOutputToken();
            newOutputToken.locked = isLocked;
            newOutputToken.value = startPercent;
            newOutputToken.selectedToken = selectedToken;
            this.outputTokens.push(newOutputToken);
            this.removeAllWithoutSelectedTokens(this.outputTokens);
            this.recalculateOutputTokensSum();
            this.resetOutputs();
        },
        removeSelectedTokenFromList(selectedToken, swapMethod, selectTokenType) {
            console.log(this.isInputToken(swapMethod, selectTokenType) ? 'INPUT TOKEN' :  'OUTPUT TOKEN');
            if (this.isInputToken(swapMethod, selectTokenType)) {
                this.removeInputToken(selectedToken.id);
                if (this.inputTokens.length === 0) {
                    this.addNewInputToken();
                }
                return;
            }

            this.removeOutputToken(selectedToken.id);
            if (this.outputTokens.length === 0) {
                this.addNewOutputToken();
            }
        },
        removeAllWithoutSelectedTokens(tokens) {
            let tokensToRemove = []
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].selectedToken) {
                    continue;
                }

                tokensToRemove.push(tokens[i]);
            }

            console.log("removeAllWithoutSelectedTokens: ", tokens, tokensToRemove);
            for (let i = 0; i < tokensToRemove.length; i++) {
                this.removeToken(tokens, tokensToRemove[i].id);
            }
        },
        clearAllInputSelectedTokens(exclude) {
            for (let i = 0; i < this.inputTokens.length; i++) {
                if (this.inputTokens[i].selectedToken) {
                    if (exclude && this.inputTokens[i].selectedToken.symbol === exclude.selectedToken.symbol) {
                        continue;
                    }

                    this.inputTokens[i].selectedToken.selected = false;
                }
            }

            if (exclude) {
                this.inputTokens = [exclude];
                return
            }

            this.inputTokens = [];
        },
        clearAllOutputSelectedTokens() {
            for (let i = 0; i < this.outputTokens.length; i++) {
                if (this.outputTokens[i].selectedToken) {
                    this.outputTokens[i].selectedToken.selected = false;
                }
            }

            this.outputTokens = [];
        },
        clearAllSelectedTokens() {
            this.clearAllInputSelectedTokens();
            this.clearAllOutputSelectedTokens();
            this.clearAllTokens();
        },
        clearAllTokens() {
            this.inputTokens = [];
            this.outputTokens = [];
        },
        isInputToken(swapMethod, selectTokenType) {
            if (swapMethod === 'BUY' && selectTokenType === 'ALL') {
                return true;
            }

            if (swapMethod === 'SELL' && selectTokenType === 'OVERNIGHT') {
                return true;
            }

            if (swapMethod === 'BUY' && selectTokenType === 'OVERNIGHT') {
                return false;
            }

            if (swapMethod === 'SELL' && selectTokenType === 'ALL') {
                return false;
            }

            console.error("Token type not detected by method and selected type.", swapMethod, selectTokenType);
            throw Error;
        },
        isOutputToken(swapMethod, selectTokenType) {
            return !this.isInputToken(swapMethod, selectTokenType);
        },
        isSlidersOutOfLimit(additionalPercent) {
            if (!additionalPercent) {
                additionalPercent = 0;
            }
            return this.getOutputsTokensPercentage() + additionalPercent > 100;
        },
        getActiveTokens(currentToken) {
            let sliders = []
            // let count = 1
            for (let i = 0; i < this.outputTokens.length; i++) {
                let token = this.outputTokens[i];
                if(token.id === currentToken.id) {
                    continue
                }

                if(!token.locked) {
                    // stockIndex.number = count
                    // count++
                    sliders.push(token)
                }
            }
            return sliders
        },

        showSelectTokensModals(isShow) {
            this.isShowSelectTokensModal = isShow;
        },
        selectInputToken(token) {
            if (this.swapMethod === "BUY") {
                this.openModalWithSelectTokenAndBySwapMethod('ALL');
                return;
            }

            if (this.swapMethod === "SELL") {
                this.openModalWithSelectTokenAndBySwapMethod('OVERNIGHT');
                return
            }

            console.error("Swap method type not found when select input tokens. ", this.swapMethod);
        },
        selectOutputToken(token) {
            if (this.swapMethod === "BUY") {
                this.openModalWithSelectTokenAndBySwapMethod('OVERNIGHT');
                return;
            }

            if (this.swapMethod === "SELL") {
                this.openModalWithSelectTokenAndBySwapMethod('ALL');
                return
            }

            console.error("Swap method type not found when select output tokens. ", this.swapMethod);
        },
        openModalWithSelectTokenAndBySwapMethod(tokenType) {
            this.setSelectTokenType(tokenType);
            this.showSelectTokensModals(true)
        },
        setSwapMethod(method) {
            this.swapMethod = method;
        },
        setSelectTokenType(type) {
            this.selectTokenType = type;
        },

        updateQuotaInfo() {
            if (!this.tokensQuotaCounterId) {
                // first call
                this.tokensQuotaCounterId = -1;
                // update
                console.log("UPDATE Proportion FIRST DATA")
                this.recalculateProportion()
                return;
            }

            this.tokensQuotaCheckerSec = 0;
            let intervalId = setInterval(async () => {
                this.tokensQuotaCheckerSec++;

                if (this.tokensQuotaCheckerSec >= 1) {
                    if (this.tokensQuotaCounterId === intervalId) {
                        this.tokensQuotaCheckerSec = 0;
                        try {
                            // update
                            console.log("UPDATE Proportion SECOND DATA")
                            this.recalculateProportion()
                        } catch (e) {
                            // ignore
                        } finally {
                            clearInterval(intervalId)
                        }
                    } else {
                        clearInterval(intervalId)
                    }

                }
            }, 1000);

            this.tokensQuotaCounterId = intervalId;
        }
    }
})
</script>

<style scoped>
@media only screen and (max-width: 960px) {
    .add-token-text {
        font-size: 16px;
        line-height: 24px;
    }

    .swap-button-title {
        font-size: 16px;
        line-height: 22px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .add-token-text {
        font-size: 16px;
        line-height: 24px;
    }

    .swap-button-title {
        font-size: 18px;
        line-height: 22px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .add-token-text {
        font-size: 16px;
        line-height: 24px;
    }

    .swap-button-title {
        font-size: 18px;
        line-height: 22px;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .add-token-text {
        font-size: 16px;
        line-height: 24px;
    }

    .swap-button-title {
        font-size: 18px;
        line-height: 22px;
    }
}

div {
    font-family: 'Roboto',serif;
}

.swap-container {
    //padding: 40px 30px;
    //gap: 8px;
    //background: var(--swap-main-banner-background);
    //box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    //border-radius: 28px;
    //max-width: 600px;
}

.swap-header {
}

.swap-settings {
    text-align: end;
    cursor: pointer;
}

.swap-body {
}

.swap-footer {
}

.add-token-text {
    font-style: normal;
    font-weight: 400;

    color: #1C95E7;
    cursor: pointer;
}

.add-token-text-disabled {
    cursor: default!important;
    color: #707A8B;
}


.input-swap-container {
}

.out-swap-container {
}

.swap-title {

    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;

    color: var(--main-gray-text);

}

.input-component-container {
    margin-bottom: 4px;
}

.max-all {
    text-align: end;
}
.change-swap-container {
    width: 44px;
    height: 44px;

    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
    border-radius: 12px;


    display: flex;
    justify-content: center;
    align-items: center;

    display: table;
    margin: 0 auto;
}

.change-swap-image {
    text-align: center; /* center the child element's content horizontally */
    padding-top: 8px;
}

.powered-image {
}

.swap-button {
    text-align: center;
    align-items: center;
    gap: 8px;

    width: 100%;
    height: 48px;

    padding-top: 15px;

    /* Blue gradient */

    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    border-radius: 2px;

    cursor: pointer;
}

.swap-button-title {
    font-style: normal;
    font-weight: 400;

    color: #FFFFFF;
}

.disable-button {
    justify-content: center;
    align-items: center;
    padding: 8px 12px;

    height: 48px;

    background: var(--action-btn-bg);
    border-radius: 2px;
}

.disable-button-title {
    text-align: center;
    align-items: center;
    gap: 8px;

    width: 100%;

    padding-top: 7px;

    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;

    color: var(--progress-text);
}

.decrease-allowance {
    font-family: Lato, sans-serif;
    font-size: 14px;
    font-weight: 400;
    height: auto;
    color: var(--main-gray-text);
    letter-spacing: 0.1px;
    line-height: 22px;
    cursor: pointer;
}

.transaction-info-container {
    padding: 20px;
    max-width: 600px;
}

.transaction-info-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: #707A8B;
}

.transaction-info {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: end;

    color: var(--main-gray-text);
}

.transaction-info-additional {
    font-style: normal;
    font-weight: 200;
    font-size: 16px;
    line-height: 24px;

    color: var(--main-gray-text);
}

.transaction-info-address {
    text-decoration: underline;
    font-weight: bold;
    text-align: end;
    color: var(--main-gray-text);
}

.transaction-info-footer {
    border-top: 1px solid #DEE1E5;
    padding-top: 22px;
}

.transaction-info-body {
    padding-bottom: 20px;
}

.loader-container {
    padding-top: 50px;
    min-height: 80px;
}

.rotate {
    transform-origin: center;
    transition: transform 0.7s ease;
}

.rotate:hover {
    transform: rotate(180deg);
}

.dont-work-on-network {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: #CF3F92;
}

.dont-work-on-network-container {
    text-align: center;
}

.slippage-info-container {
    background: rgba(254, 127, 45, 0.1);
    padding: 8px;
    width: 100%;
    margin-top: 10px;
    text-align: center;
}

.slippage-info-title {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0em;
    text-align: left;
    color: rgba(254, 127, 45, 1);
}


.odos-fees-container {
    display: flex;
    flex-direction: row;
}

.odos-fees-title {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: end;

    color: var(--secondary-gray-text);
}

.with-tooltip {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>

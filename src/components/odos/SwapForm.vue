<template>
    <div>
        <div v-if="!isAvailableOnNetwork">
            <NetworkNotAvailable :network-name="'ZkSync'">
            </NetworkNotAvailable>
        </div>

        <div v-else class="swap-container">
            <div v-if="!isTokensLoadedAndFiltered"
                 class="loader-container">
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
                        <div class="input-swap-container">
                            <div class="swap-title pb-lg-2 mt-2">
                                <div>
                                    <span v-if="swapMethod === 'SELL'">
                                     Swap from Overnight
                                </span>
                                    <span v-else>
                                    Swap from
                                </span>
                                </div>
                            </div>
                            <div v-for="token in inputTokens" :key="token.id" class="input-component-container">
<!--                                {{token.selectedToken ? token.selectedToken.address : '-'}}-->
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
                           <div @click="changeSwap()" class="change-swap-container">
                               <div class="change-swap-image rotate" >
                                   <img src="/assets/icon/swap/change-swap-vector.svg" alt="change-swap">
                               </div>
                           </div>
                       </div>

                        <div class="out-swap-container">
                            <div class="swap-title pb-2">
                                <span v-if="swapMethod === 'BUY'">
                                    Swap to Overnight
                                </span>
                                <span v-else>
                                    Swap to
                                </span>
                            </div>
                            <div v-for="token in outputTokens" :key="token.id" class="input-component-container">
                                <OutputToken
                                        :token-info="token"
                                        :swap-method="swapMethod"
                                        :remove-item-func="removeOutputToken"
                                        :is-token-removable="isOutputTokensRemovable"
                                        :is-token-without-slider="isTokenWithoutSlider"
                                        :lock-proportion-func="lockProportion"
                                        :update-slider-value-func="updateSliderValue"
                                        :select-token-func="selectOutputToken"
                                        :is-tokens-prices-loading="isSumulateSwapLoading"
                                />
                            </div>

                            <div class="row">
                                <div class="col-6">
                                    <div v-if="isOutputTokensAddAvailable"
                                         @click="addNewOutputToken"
                                         class="add-token-text">
                                        + Select token
                                    </div>
                                </div>
                                <div v-if="outputTokensWithSelectedTokensCount >= 2" class="col-6">
                                    <div @click="resetOutputs"
                                         class="add-token-text max-all">
                                        Reset output %
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SwapSlippageSettings/>

                <div v-if="networkName === 'zksync'" class="slippage-info-container">
                    <div class="slippage-info-title">
                        <img src="/assets/icon/swap/warn-info-icon.svg" alt="info" style="margin-right: 2px;"/>
                        30-90% of the displayed gas fee on zkSynk will be refunded automatically.
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
                        <div v-else
                             @click="swap()"
                             id="click_form_swap"
                             class="swap-button">
                            <div class="swap-button-title">
                                <div>
                                    SWAP
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="label-container pt-3">
                        <div class="row">
                            <div class="col-6 pr-1" style="padding-top:15px">
                                <div class="powered-text">
                                    Powered by
                                </div>
                            </div>
                            <div class="col-6 pl-0">
                                <div class="powered-image">
                                    <img src="/assets/icon/swap/powered-by-odos.svg" alt="powered by odos">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="quotaResponseInfo">
            <div class="transaction-info-container">
                <div class="transaction-info-body">
<!--                    <div class="row py-2">
                        <div class="col-6 py-0">
                            <div class="transaction-info-title">
                                Output Value
                            </div>
                        </div>
                        <div class="col-6 py-0">
                            <div class="transaction-info">
                                ~1.09 <span class="transaction-info-additional">(+116.76%)</span>
                            </div>
                        </div>
                    </div>-->

<!--                    <div v-if="getTokenByAddress('0x0000000000000000000000000000000000000000')" class="row py-2">
                        <div class="col-6 py-0">
                            <div class="transaction-info-title">
                                Gas estimate
                            </div>
                        </div>
                        <div class="col-6 py-0">
                            <div class="transaction-info">
                                ~{{quotaResponseInfo.gasEstimate}} Gwei
                                <span class="transaction-info-additional">
                                    (~{{$utils.formatMoney(quotaResponseInfo.gasEstimate *  getTokenByAddress('0x0000000000000000000000000000000000000000').estimatePerOne, 2) }}$)
                                </span>
                            </div>
                        </div>
                    </div>-->

                    <div class="row py-2">
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

                    <div class="row py-2">
                        <div class="col-6 py-0">
                            <div class="transaction-info-title">
                                Minimum received
                            </div>
                        </div>
                        <div class="col-6 py-0">
                            <div class="transaction-info">
                                {{$utils.formatMoney(sumOfAllSelectedTokensInUsd, 3)}}$
                            </div>
                        </div>
                    </div>
                </div>
                <div class="transaction-info-footer">
                    <div class="row py-2">
                        <div class="col-6 py-0">
                            <div class="transaction-info-title">
                                Recipient
                            </div>
                        </div>
                        <div class="col-6 py-0">
                            <div class="transaction-info-address">
                                {{account.substring(0, 5) + '...' + account.substring(account.length - 4)}}
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
                           :is-ovn-swap="true"
                           :selected-token-count="selectTokenType === 'OVERNIGHT' ? secondTokensSelectedCount : tokensSelectedCount"
                           :max-token-count="selectTokenType === 'OVERNIGHT' ? secondTokens.length : 6"

        />

        <SuccessOdosModal :is-show="isShowSuccessModal"
                          :set-show-func="showSuccessModal"
                          :success-data="successData"/>

        <WaitingModal/>
        <ErrorModal/>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import InputToken from "@/components/swap-module/InputToken.vue";
import OutputToken from "@/components/swap-module/OutputToken.vue";
import SelectTokensModal from "@/components/swap-module/modals/SelectTokensModal.vue";
import {mapActions, mapGetters} from "vuex";
import SwapSlippageSettings from "@/components/swap-module/SwapSlippageSettings.vue";
import {odosSwap} from "@/components/mixins/odos-swap";
import WaitingModal from "@/components/common/modal/action/WaitingModal.vue";
import SuccessModal from "@/components/common/modal/action/SuccessModal.vue";
import ErrorModal from "@/components/common/modal/action/ErrorModal.vue";
import SuccessOdosModal from "@/components/odos/modals/SuccessOdosModal.vue";
import NetworkNotAvailable from "@/components/swap-module/network-not-available.vue";
import {contractApprove} from "@/components/mixins/contract-approve";

export default defineComponent({
    name: "SwapForm",
    mixins: [odosSwap, contractApprove],
    components: {
        NetworkNotAvailable,
        SuccessOdosModal,
        ErrorModal,
        SuccessModal,
        WaitingModal,
        SwapSlippageSettings,
        SelectTokensModal,
        InputToken,
        OutputToken
    },
    props: {
        updatePathViewFunc: {
            type: Function,
            required: true
        },
        updateButtonDisabledFunc: {
            type: Function,
            required: true
        },
        updateIsLoadingDataFunc: {
            type: Function,
            required: true
        },
        handleFormResetFunc: {
            type: Function,
            required: true
        }
    },
    mounted() {
        this.tokenSeparationScheme = 'OVERNIGHT_SWAP'
        console.log("Swap form odos init by scheme: ", this.tokenSeparationScheme)

        this.init();

        if (!this.isAvailableOnNetwork) {
            this.mintAction();
        }

        try {
            this.trackClick({action: 'swap_page_view', event_category: 'Page view', event_label: 'View swap page' });
        } catch (e) {
            console.error("Track error:", e);
        }

        if (this.$route.query.action === 'swap-in') {
            console.log("Swap action: swap-in")
            // ignore
        }

        if (this.$route.query.action === 'swap-out') {
            console.log("Swap action: swap-out")
            this.changeSwap()
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

            isShowSettingsModal: false,
            isSwapLoading: false,
            isSumulateSwapLoading: false,
            pathViz: null,
            slippagePercent: 0.05,

            tokensQuotaCounterId: null,
            tokensQuotaCheckerSec: 0
        }
    },
    computed: {
        ...mapGetters('network', ['getParams', 'networkId', 'networkName']),
        ...mapGetters('theme', ['light']),
        ...mapGetters('web3', ['web3', 'getWeiMarker']),
        ...mapGetters('gasPrice', ['show', 'gasPrice', 'gasPriceGwei', 'gasPriceStation']),


        isInputTokensRemovable() {
          return this.inputTokens.length > 1;
        },

        isOutputTokensRemovable() {
          return this.outputTokens.length > 1;
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

        selectedInputTokens() {
            //todo: add check balance
            return this.inputTokens.filter(item => item.selectedToken)
        },
        selectedOutputTokens() {
            //todo: add check proportion values
            return this.outputTokens.filter(item => item.selectedToken)
        },

        isAnyInputsNeedApprove() {
            return this.allInputsWithNotApproved.length > 0
        },
        allInputsWithNotApproved() {
            return this.selectedInputTokens.filter(token => !token.selectedToken.approveData.approved && token.value > 0);
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
                !this.isAmountEntered
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
                let selectedTokenUsdValue = token.value * token.selectedToken.price;
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
        },
    },
    watch: {
        outputTokensWithSelectedTokensCount: function (val, oldVal) {

            // lock first
            if (val === 1) {
                let token = this.selectedOutputTokens[0];
                token.value = 100;
                this.lockProportion(true, token);
                this.recalculateOutputTokensSum();
                return;
            }

            // unlock first
            if (val === 2 && oldVal === 1) {
                let token = this.selectedOutputTokens[0];
                this.lockProportion(false, token);
                this.recalculateOutputTokensSum();
                return;
            }
        },
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
            }
        },
        isDisableButton: function (val, oldVal) {
            if (val) {
                this.clearQuotaInfo();
            }
            this.updateButtonDisabledFunc(val);
        }
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

        init() {
            this.loadChains();
            this.loadTokens();
            this.initContractData();

            this.$bus.$on('odos-transaction-finished', (data) => {
                this.finishTransaction();
            })
        },
        addDefaultOvnToken() {
            let ovnSelectedToken = this.getDefaultSecondtoken();
            if (!ovnSelectedToken) {
                this.addNewInputToken();
                this.addNewOutputToken();
                return;
            }

            ovnSelectedToken.selected = true;

            if (this.swapMethod === 'BUY') {
                this.addSelectedTokenToOutputList(ovnSelectedToken);
                this.addNewInputToken();
                return;
            }

            if (this.swapMethod === 'SELL') {
                this.addSelectedTokenToInputList(ovnSelectedToken);
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
            this.removeToken(this.inputTokens, id)
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
            this.updateQuotaInfo();
        },
        getNewInputToken() {
            let randomId = (Math.random() + 1).toString(36).substring(2);
            return {
                id: randomId,
                value: null,
                contractValue: null,
                selectedToken: null
            }
        },
        getNewOutputToken() {
            let randomId = (Math.random() + 1).toString(36).substring(2);
            return {
                id: randomId,
                value: 0,
                sum: 0,
                locked: false,
                selectedToken: null
            }
        },

        maxAll() {
            console.log("Max all");
            for (let i = 0; i < this.selectedInputTokens.length; i++) {
                let token = this.selectedInputTokens[i];
                console.log(token.selectedToken.balanceData.balance);
                this.updateTokenValue(token, token.selectedToken.balanceData.balance);
            }
        },
        changeSwap() {
            console.log('INPUT SELECTED TOKENS: ', this.inputTokens)
            console.log('OUTPUT SELECTED TOKENS: ', this.outputTokens)

            // Transform Input Tokens into Output format by adding temporary variable "tempOutputArray"
            let tempOutputArray = [];
            for (let i = 0; i < this.inputTokens.length; i++) {
                let tokenIn = this.inputTokens[i];
                if (!tokenIn.selectedToken) {
                   continue
                }

                let transformInputToOutputToken = this.getNewOutputToken()
                transformInputToOutputToken.id = tokenIn.id
                transformInputToOutputToken.selectedToken = tokenIn.selectedToken
                tempOutputArray.push(transformInputToOutputToken)
            }

            // Transform Output Tokens into Input format by adding temporary variable "tempInputArray"
            let tempInputArray = [];
            for (let i = 0; i < this.outputTokens.length; i++) {
                let tokenOut = this.outputTokens[i];
                if (!tokenOut.selectedToken) {
                    continue
                }

                let transformOutputToInputToken = this.getNewInputToken()
                transformOutputToInputToken.id = tokenOut.id
                transformOutputToInputToken.selectedToken = tokenOut.selectedToken
                tempInputArray.push(transformOutputToInputToken)
            }

            this.inputTokens = tempInputArray;
            console.log("Tokens Transformed from Output to Input: ", this.inputTokens)
            this.outputTokens = tempOutputArray;
            console.log("Tokens Transformed from Input to Output: ", this.outputTokens)

            if (this.swapMethod === 'BUY') {
                this.setSwapMethod('SELL');
                this.addTokensEmptyIsNeeded();
                this.resetOutputs();
                this.initTabName('/swap', {action: 'swap-out'})

                return;
            }

            if (this.swapMethod === 'SELL') {
                this.setSwapMethod('BUY');
                this.addTokensEmptyIsNeeded();
                this.resetOutputs();
                this.initTabName('/swap', {action: 'swap-in'})
                return;
            }

            console.error('Change swap method not found.', this.swapMethod);
        },
        finishTransaction() {
            console.log("Finish transaction");
            this.clearForm()
            this.handleFormResetFunc(true);
        },

        clearForm() {
            this.clearAllSelectedTokens();

            if (this.swapMethod === 'BUY') {
                this.addDefaultOvnToken();
                return;
            }

            if (this.swapMethod === 'SELL') {
                this.addDefaultOvnToken();
                return;
            }

            console.error('Clear form, swap method not found.', this.swapMethod);
        },
        resetOutputs() {
            console.log("Reset outputs");
            if (!this.selectedOutputTokens.length) {
                return;
            }

            let totalValue = 100;
            let totalTokens = this.selectedOutputTokens.length;
            let proportion = Math.floor(totalValue / totalTokens);
            let remains = totalValue % totalTokens;

            for (let i = 0; i < totalTokens; i++) {
                this.selectedOutputTokens[i].value = proportion;
            }

            for (let i = 0; i < remains; i++) {
                this.selectedOutputTokens[i].value += 1;
            }

            console.log("this.selectedOutputTokens: ", this.selectedOutputTokens);
        },
        async swap() {
            if (this.isSwapLoading) {
                console.log('Swap method not available, prev swap in process');
                return;
            }

            console.log("Swap", this.inputTokensWithSelectedTokensCount, this.outputTokensWithSelectedTokensCount);
            if (this.inputTokensWithSelectedTokensCount < 1 || this.outputTokensWithSelectedTokensCount < 1) {
                return;
            }

            try {
                this.trackClick({action: 'click_form_swap', event_category: 'Click Button', event_label: 'Click on swap', value: this.sumOfAllSelectedTokensInUsd });
            } catch (e) {
                console.error("Track error:", e);
            }

            this.isSwapLoading = true;


            let actualGasPriceObject = await this.getActualGasPrice(this.networkId);
            console.log("Actual price for gas. network: ", this.networkId, actualGasPriceObject)
            let actualGas = actualGasPriceObject.baseFee;
            if (!actualGas && actualGasPriceObject.prices && actualGasPriceObject.prices.length) {
                actualGas = actualGasPriceObject.prices[0].fee;
                console.log("Actual price for gas when not found base fee. network: ", this.networkId, actualGasPriceObject)
            }

            let requestData = {
                chainId: this.networkId,
                // chainId: 1,
                inputTokens: this.getRequestInputTokens(),
                outputTokens: this.getRequestOutputTokens(),
                gasPrice: actualGas,
                userAddr: this.account,
                slippageLimitPercent: this.getSlippagePercent(),
                sourceBlacklist: ['Hashflow', 'Wombat'],
                sourceWhitelist: [],
                simulate: true,
                pathViz: true,
                // disableRFQs: false
            }

            console.log("Odos request data", requestData);
            this.swapRequest(requestData)
                .then(async data => {
                    console.log("Odos swap request success from swap form", data)
                    if (data.simulation && !data.simulation.isSuccess) {
                        this.closeWaitingModal();
                        let errMsg = data.simulation.simulationError && data.simulation.simulationError.errorMessage ? data.simulation.simulationError.errorMessage : 'Transaction simulation is failed';
                        console.log("Error before send swap transaction: ", errMsg)
                        this.showErrorModalWithMsg({errorType: 'slippage', errorMsg: errMsg}, );
                        this.isSwapLoading = false;
                        return;
                    }
                    // { "inTokens": [ "0x0000000000000000000000000000000000000000", "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a" ], "outTokens": [ "0xe80772eaf6e2e18b651f160bc9158b2a5cafca65", "0xeb8e93a0c7504bffd8a8ffa56cd754c63aaebfe8" ], "inAmounts": [ "1000000000000000000", "1000000000000000000" ], "outAmounts": [ "748864357", "1091926251518831755264" ], "gasEstimate": 613284, "dataGasEstimate": 0, "gweiPerGas": 1000000, "gasEstimateValue": 1129317.6351027626, "inValues": [ 1841.4255542063122, 1.0001535800151131 ], "outValues": [ 748.6976540455693, 1091.9074095761437 ], "netOutValue": -1127477.030039141, "priceImpact": -0.0008666645762853047, "percentDiff": -0.09881777902469935, "pathId": "a5fc8568c59f7cf8cc8df9194d66b4f6", "pathViz": null, "blockNumber": 89177560 }
                    await this.initWalletTransaction(data, this.selectedInputTokens, this.selectedOutputTokens);

                    this.isSwapLoading = false;
                }).catch(e => {
                console.error("Odos swap request failed swap form", e)
                this.isSwapLoading = false;
            })
        },
        clearQuotaInfo() {
            this.pathViz = null
            this.quotaResponseInfo = null;
            this.swapResponseInfo = null;
            // this.updatePathViewFunc(this.pathViz, [], []);
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
                    console.log("data.outTokens:", data.outTokens);
                    console.log("data.outAmounts:", data.outAmounts);
                    this.updateSelectedOutputTokens(data);

                    this.isSumulateSwapLoading = false;
                    this.updateIsLoadingDataFunc(false);

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
        // function get data.outTokens and data.outAmounts and find matches in selectedOutputTokens
        // and update selectedOutputTokens with new values
        updateSelectedOutputTokens(data) {
            if (!data || !data.outTokens || !data.outAmounts) {
                return;
            }

            let outTokens = data.outTokens;
            let outAmounts = data.outAmounts;
            let selectedOutputTokens = this.selectedOutputTokens;
            let selectedOutputTokensCount = selectedOutputTokens.length;
            let outTokensCount = outTokens.length;
            let outAmountsCount = outAmounts.length;

            if (selectedOutputTokensCount < 1 || outTokensCount < 1 || outAmountsCount < 1) {
                return;
            }

            let selectedOutputTokensMap = {};
            for (let i = 0; i < selectedOutputTokensCount; i++) {
                let token = selectedOutputTokens[i];
                console.log("Token for update price: ", token);
                selectedOutputTokensMap[token.selectedToken.address.toLowerCase()] = token;
            }

            for (let i = 0; i < outTokensCount; i++) {
                let tokenAddress = outTokens[i];
                let tokenAmount = outAmounts[i];
                let token = selectedOutputTokensMap[tokenAddress.toLowerCase()];
                if (token) {
                    let selectedToken = token.selectedToken;
                    console.log("Token for update : ", token, selectedToken, tokenAmount);
                    let amount = this.web3.utils.fromWei(tokenAmount, this.getWeiMarker(selectedToken.decimals));
                    console.log("Token for update amount: ", token, selectedToken, tokenAmount, amount);
                    token.sum = amount;
                }
            }
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
            this.clearApproveToken(tokenContract, this.routerContract.options.address)
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
            console.log('Check Approve contract: ', token, tokenContract, this.account, this.routerContract.options.address);
            let allowanceValue = await this.getAllowanceValue(tokenContract, this.account, this.routerContract.options.address);
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

            await this.checkApproveForToken(token, token.contractValue);
            let selectedToken = token.selectedToken;
            if (selectedToken.approveData.approved) {
                console.log("Approve not needed for token: ", token);
                this.closeWaitingModal();
                return;
            }

            let tokenContract = this.tokensContractMap[selectedToken.address];
            console.log('Approve contract: ', token, tokenContract, this.account, this.routerContract.options.address);
            let approveValue = selectedToken.balanceData.originalBalance*1 ? selectedToken.balanceData.originalBalance : (10000000000000 + '');
            this.approveToken(tokenContract, this.routerContract.options.address, approveValue)
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

        updateTokenValue(token, value) {
            console.log('updateTokenValue: ', token, value)
            token.value = value;
            this.updateQuotaInfo();

            if (!value) {
                return
            }

            let selectedToken = token.selectedToken;
            if (selectedToken) {
                let sum = token.decimals === 6 ? token.value * 100 + '' : token.value + '';
                token.contractValue = this.web3.utils.toWei(sum, token.selectedToken.weiMarker);

                console.log('updateTokenValue with selected token: ', token, value, token.contractValue);

                if (selectedToken.address === '0x0000000000000000000000000000000000000000') {
                    console.log("Check approve in update value not available. its a root token: ", token);
                    selectedToken.approveData.approved = true
                    return;
                }

                this.checkApproveForToken(token, token.contractValue);
            }
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

            token.value = value;

            this.subtraction(token, 100 - value);
            this.recalculateOutputTokensSum();

            this.updateQuotaInfo();

            if (token.value === 0 || !token.value) {
                this.updateQuotaInfo();
            }
        },
        recalculateOutputTokensSum() {
            console.log(`recalculateOutputTokensSum. recalculate token count ${this.selectedOutputTokens.length} usdSum: ${this.sumOfAllSelectedTokensInUsd}`);
            for (let i = 0; i < this.selectedOutputTokens.length; i++) {
                let token = this.selectedOutputTokens[i];
                let sum = this.sumOfAllSelectedTokensInUsd * token.value / 100;
                sum = this.swapMethod === 'BUY' ? sum * token.selectedToken.price : sum / token.selectedToken.price
                console.log(`Recalculate token.selectedToken price: ${token.selectedToken.price}, newUsdSum: ${sum}`, token);

                // token.sum = this.$utils.formatMoney(sum, 4)
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
            let tokens = this.getActiveTokens(token);
            console.log('tokens', tokens, difference);

            if (tokens.length === 0) {
                return;
            }

            let proportion = Math.floor(difference / tokens.length);
            let remains = difference % tokens.length;
            console.log('proportion', proportion);
            console.log('remains', remains);

            this.calculateProportions(tokens, proportion);

            // Distribute the remains among the tokens
            for (let i = 0; i < remains; i++) {
                tokens[i].value += 1;
            }
        },
        calculateProportions(tokens, proportion) {
            for (let i = 0; i < tokens.length; i++) {
                tokens[i].value = proportion;
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

        addSelectedTokenToList(selectedToken, swapMethod, selectTokenType) {
            console.log(this.isInputToken(swapMethod, selectTokenType) ? 'INPUT TOKEN' :  'OUTPUT TOKEN');
            if (this.isInputToken(swapMethod, selectTokenType)) {
                this.addSelectedTokenToInputList(selectedToken);
                this.removeOutputToken(selectedToken.id);
                this.addTokensEmptyIsNeeded();
                return;
            }

            this.addSelectedTokenToOutputList(selectedToken);
            this.removeInputToken(selectedToken.id);
            this.addTokensEmptyIsNeeded();
        },
        addTokensEmptyIsNeeded() {
            this.addInputTokenEmptyIsNeeded()
            this.addOutputTokenEmptyIsNeeded()
        },
        addInputTokenEmptyIsNeeded() {
            if (this.inputTokens.length === 0) {
                this.addNewInputToken();
            }
        },
        addOutputTokenEmptyIsNeeded() {
            if (this.outputTokens.length === 0) {
                this.addNewOutputToken();
            }
        },
        addSelectedTokenToInputList(selectedToken) {
            let newInputToken = this.getNewInputToken()
            newInputToken.selectedToken = selectedToken;
            this.inputTokens.push(newInputToken);
            this.removeAllWithoutSelectedTokens(this.inputTokens);

            this.checkApproveForToken(newInputToken);
        },
        addSelectedTokenToOutputList(selectedToken) {
            let newOutputToken = this.getNewOutputToken()
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
        clearAllSelectedTokens() {
            for (let i = 0; i < this.inputTokens.length; i++) {
                if (this.inputTokens[i].selectedToken) {
                    this.inputTokens[i].selectedToken.selected = false;
                }
            }

            for (let i = 0; i < this.outputTokens.length; i++) {
                if (this.outputTokens[i].selectedToken) {
                    this.outputTokens[i].selectedToken.selected = false;
                }
            }

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
                console.log("UPDATE QUOTA FIRST DATA")
                this.simulateSwap()
                return;
            }

            this.tokensQuotaCheckerSec = 0;
            let intervalId = setInterval(async () => {
                this.tokensQuotaCheckerSec++;

                if (this.tokensQuotaCheckerSec >= 3) {
                    if (this.tokensQuotaCounterId === intervalId) {
                        this.tokensQuotaCheckerSec = 0;
                        try {
                            // update
                            console.log("UPDATE QUOTA SECOND DATA")
                            this.simulateSwap()
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
        },

        initTabName(path, queryParams) {
            this.$router.push({
                path: path,
                query: queryParams ? queryParams : {}
            });
        },
    }
})
</script>

<style scoped>
@media only screen and (max-width: 960px) {
    .swap-container {
        padding: 10px 20px;
        gap: 8px;
        background: var(--swap-main-banner-background);
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
        border-radius: 28px;
        max-width: 600px;
    }

    .add-token-text {
        font-size: 14px;
        line-height: 24px;
    }

    .swap-title {
        font-size: 18px;
        line-height: 28px;
    }

    .swap-button-title {
        font-size: 16px;
        line-height: 22px;
    }

    .disable-button-title {
        font-size: 16px;
        line-height: 22px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .swap-container {
        padding: 40px 30px;
        gap: 8px;
        background: var(--swap-main-banner-background);
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
        border-radius: 28px;
        max-width: 600px;
    }
    .add-token-text {
        font-size: 16px;
        line-height: 24px;
    }

    .swap-title {
        font-size: 18px;
        line-height: 28px;
    }

    .swap-button-title {
        font-size: 18px;
        line-height: 22px;
    }

    .disable-button-title {
        font-size: 18px;
        line-height: 22px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .swap-container {
        padding: 40px 30px;
        gap: 8px;
        background: var(--swap-main-banner-background);
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
        border-radius: 28px;
        max-width: 600px;
    }

    .add-token-text {
        font-size: 16px;
        line-height: 24px;
    }

    .swap-title {
        font-size: 18px;
        line-height: 28px;
    }

    .swap-button-title {
        font-size: 18px;
        line-height: 22px;
    }

    .disable-button-title {
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
    .swap-container {
        padding: 30px 20px;
        gap: 8px;
        background: var(--swap-main-banner-background);
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
        border-radius: 28px;
        max-width: 600px;
    }

    .add-token-text {
        font-size: 16px;
        line-height: 24px;
    }

    .swap-title {
        font-size: 18px;
        line-height: 28px;
    }

    .swap-button-title {
        font-size: 18px;
        line-height: 22px;
    }

    .disable-button-title {
        font-size: 18px;
        line-height: 22px;
    }
}

div {
    font-family: 'Roboto',serif;
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
    display: flex;
    justify-content: space-between;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;

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

    background: var(--swap-arrow-bg);
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    cursor: pointer;


    display: flex;
    justify-content: center;
    align-items: center;

    display: table;
    margin: 0 auto;
    margin-bottom: 10px;
}

.change-swap-image {
    text-align: center; /* center the child element's content horizontally */
    padding-top: 8px;
}

.powered-image {
}

.powered-text {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;

    color: #ADB3BD;

    text-align: end;
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
    border-top: 1px solid var(--dividers);
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

</style>

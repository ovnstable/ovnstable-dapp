<template>
    <div>
        <div class="swap-container">
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
                <div class="swap-header">
                    <div @click="showSettingsModals(true)" class="swap-settings">
                        <img v-if="light" src="/assets/icon/swap/settings.svg" alt="settings">
                        <img v-else src="/assets/icon/swap/settings-dark.svg" alt="settings">
                    </div>
                </div>

                <div class="swap-body">
                    <div>
                        <div class="input-swap-container">
                            <div class="swap-title pb-2">
                                <span v-if="swapMethod === 'SELL'">
                                     Swap from Overnight
                                </span>
                                <span v-else>
                                    Swap from
                                </span>
                            </div>
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
                                <div class="col-6">
                                    <div @click="maxAll"
                                         :class="inputTokensWithSelectedTokensCount === 0 ? 'add-token-text-disabled' : ''"
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
                                        :remove-item-func="removeOutputToken"
                                        :is-token-removable="isOutputTokensRemovable"
                                        :lock-proportion-func="lockProportion"
                                        :update-slider-value-func="updateSliderValue"
                                        :select-token-func="selectOutputToken"
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
                                <div class="col-6">
                                    <div @click="resetOutputs"
                                         :class="outputTokensWithSelectedTokensCount === 0 ? 'add-token-text-disabled' : ''"
                                         class="add-token-text max-all">
                                        Reset output %
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="swap-footer pt-5">
                    <div class="swap-button-container">
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

<!--        swapResponseInfo:-->
<!--        {{swapResponseInfo}}-->

<!--        <div v-if="swapResponseInfo">-->
<!--            {{swapResponseInfo}}-->
<!--        </div>-->
<!--        <div v-if="false && swapResponseInfo">
            <div class="transaction-info-container">
                <div class="transaction-info-body">
                    <div class="row py-2">
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
                    </div>

                    <div class="row py-2">
                        <div class="col-6 py-0">
                            <div class="transaction-info-title">
                                Gas estimate
                            </div>
                        </div>
                        <div class="col-6 py-0">
                            <div class="transaction-info">
                                ~124 Gwei <span class="transaction-info-additional">(~0.67$)</span>
                            </div>
                        </div>
                    </div>

                    <div class="row py-2">
                        <div class="col-6 py-0">
                            <div class="transaction-info-title">
                                Slippage
                            </div>
                        </div>
                        <div class="col-6 py-0">
                            <div class="transaction-info">
                                0.05% <span class="transaction-info-additional">(~0.67$)</span>
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
                                1.098$
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
        </div>-->


        <SelectTokensModal :is-show="isShowSelectTokensModal"
                           :set-show-func="showSelectTokensModals"
                           :swap-method="swapMethod"
                           :select-token-type="selectTokenType"
                           :add-selected-token-to-list-func="addSelectedTokenToList"
                           :remove-selected-token-from-list-func="removeSelectedTokenFromList"

                           :ovn-tokens="ovnTokens"
                           :tokens="tokens"
                           :is-all-data-loaded="isAllDataLoaded"

        />

        <AdvancedSettingsModal :is-show="isShowSettingsModal"
                               :set-show-func="showSettingsModals"/>

        <WaitingModal/>
        <SuccessModal/>
        <ErrorModal/>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import InputToken from "@/components/odos/InputToken.vue";
import OutputToken from "@/components/odos/OutputToken.vue";
import SelectTokensModal from "@/components/odos/modals/SelectTokensModal.vue";
import {odosApiService} from "@/services/external/odos-api-service";
import {mapActions, mapGetters} from "vuex";
import AdvancedSettingsModal from "@/components/odos/modals/AdvancedSettingsModal.vue";
import {odosSwap} from "@/components/mixins/odos-swap";
import WaitingModal from "@/components/common/modal/action/WaitingModal.vue";
import SuccessModal from "@/components/common/modal/action/SuccessModal.vue";
import ErrorModal from "@/components/common/modal/action/ErrorModal.vue";

export default defineComponent({
    name: "SwapForm",
    mixins: [odosSwap],
    components: {
        ErrorModal, SuccessModal,
        WaitingModal,
        AdvancedSettingsModal,
        SelectTokensModal,
        InputToken,
        OutputToken
    },
    mounted() {
        this.init();
    },
    data() {
        return {
            inputTokens: [],
            outputTokens: [],
            maxInputTokens: 6,
            maxOutputTokens: 6,

            isShowSelectTokensModal: false,
            swapMethod: 'BUY', // BUY (ovnTokens) / SELL (ovnTokens)
            selectTokenType: 'OVERNIGHT', // OVERNIGHT / ALL

            isShowSettingsModal: false,
            isSwapLoading: false,

        }
    },
    computed: {
        ...mapGetters('network', ['getParams', 'networkId']),
        ...mapGetters('theme', ['light']),
        ...mapGetters('web3', ['web3', 'getWeiMarker']),

        isInputTokensRemovable() {
          return this.inputTokens.length > 1;
        },

        isOutputTokensRemovable() {
          return this.outputTokens.length > 1;
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
            return this.selectedInputTokens.filter(token => !token.selectedToken.approveData.approved);
        },
        firstInputInQueueForToApprove() {
            return this.isAnyInputsNeedApprove ? this.allInputsWithNotApproved[0] : null
        },

        isDisableButton() {
            return this.inputTokensWithSelectedTokensCount === 0 ||
                this.outputTokensWithSelectedTokensCount === 0 ||
                this.swapResponseConfirmInfo.waitingConformation;
        },

        disableButtonMessage() {
            if (this.inputTokensWithSelectedTokensCount === 0 ||
                this.outputTokensWithSelectedTokensCount === 0) {
                return 'SELECT TOKENS';
            }

            if (this.swapResponseConfirmInfo.waitingConformation) {
                return "Confirm in your wallet (" + this.swapResponseConfirmInfo.duration + " sec)"
            }

            return null;
        },
        sumOfAllSelectedTokensInUsd() {
            let sum = 0
            for (let i = 0; i < this.selectedInputTokens.length; i++) {
                let token = this.selectedInputTokens[i];
                let selectedTokenUsdValue = token.value * token.selectedToken.price;
                sum += selectedTokenUsdValue;
            }

            return sum;
        }

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
                this.addDefaultOvnToken();
            }
        },
        networkId: function (newVal, oldVal) {
            if (newVal) {
                this.clearForm();
            }
        }
    },

    methods: {
        ...mapActions("errorModal", ['showErrorModal', 'showErrorModalWithMsg']),
        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions("successModal", ['showSuccessModal']),

        init() {
            this.loadChains();
            this.loadTokens();
            this.initContractData();

            this.$bus.$on('odos-transaction-finished', (data) => {
                this.finishTransaction();
            })
        },
        addDefaultOvnToken() {
            let ovnSelectedToken = this.getDefaultOvnToken();
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
        finishTransaction() {
            console.log("Finish transaction");
            this.clearForm()
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
                return
            }

            for (let i = 0; i < this.selectedOutputTokens.length; i++) {
                let token = this.selectedOutputTokens[i];
                token.value = 0;
            }

            // init first token value
            this.selectedOutputTokens[0].value = 100;
            console.log("this.selectedOutputTokens: ", this.selectedOutputTokens)
        },
        swap() {
            if (this.isSwapLoading) {
                console.log('Swap method not available, rev sap in process');
                return;
            }

            console.log("Swap", this.inputTokensWithSelectedTokensCount, this.outputTokensWithSelectedTokensCount);
            if (this.inputTokensWithSelectedTokensCount < 1 || this.outputTokensWithSelectedTokensCount < 1) {
                return;
            }

            this.isSwapLoading = true;

            // slippage
            let slippageInfo = localStorage.getItem('odos_slippage_value');
            let slippagePercent = 0.05; // default
            if (slippageInfo) {
                let slippageInfoObject = JSON.parse(slippageInfo);
                slippagePercent = slippageInfoObject.value;
            }

            let requestData = {
                chainId: this.networkId,
                // chainId: 1,
                inputTokens: this.getRequestInputTokens(),
                outputTokens: this.getRequestOutputTokens(),
                gasPrice: 0.001048154,
                userAddr: this.account,
                slippageLimitPercent: slippagePercent,
                sourceBlacklist: [],
                sourceWhitelist: [],
                simulate: true,
                pathViz: true,
                // disableRFQs: false
            }

            console.log("Odos request data", requestData);
            this.quoteRequest(requestData);
            // this.swapRequest(requestData)
            //     .then(data => {
            //         console.log("Odos swap request success", data)
            //         this.isSwapLoading = false;
            //     }).catch(e => {
            //         console.error("Odos swap request failed", e)
            //         this.isSwapLoading = false;
            //     })
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
            this.approveToken(tokenContract, this.routerContract.options.address, token.contractValue ? token.contractValue : selectedToken.balanceData.originalBalance)
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

        getRequestInputTokens() {
            let inputTokens = [];
            for (let i = 0; i < this.selectedInputTokens.length; i++) {
                let token = this.selectedInputTokens[i];
                let selectedToken = token.selectedToken;
                console.log("token: ", token)

                inputTokens.push({
                    tokenAddress: selectedToken.address,
                    amount: token.contractValue
                })
            }
            return inputTokens;
        },
        getRequestOutputTokens() {
            let outputTokens = [];
            for (let i = 0; i < this.selectedOutputTokens.length; i++) {
                let token = this.selectedOutputTokens[i];
                let selectedToken = token.selectedToken;
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
            let oldTokenValue = token.value;

            token.value = value;

            // if(!this.isSlidersOutOfLimit()) {
                token.value = value;
                this.subtraction(token, 100 - value);
                this.recalculateOutputTokensSum();
                // if (oldTokenValue > value) {
                //     this.subTokensProportions(token, 100 - value)
                // } else {
                //     this.addTokensProportions(token, 100 - value)
                // }
            // }
        },
        recalculateOutputTokensSum() {
            console.log('recalculateOutputTokensSum')
            for (let i = 0; i < this.selectedOutputTokens.length; i++) {
                let token = this.selectedOutputTokens[i];
                let sum = this.sumOfAllSelectedTokensInUsd * token.value / 100;
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

        addSelectedTokenToList(selectedToken, swapMethod, selectTokenType) {
            console.log(this.isInputToken(swapMethod, selectTokenType) ? 'INPUT TOKEN' :  'OUTPUT TOKEN');
            if (this.isInputToken(swapMethod, selectTokenType)) {
                this.addSelectedTokenToInputList(selectedToken);
                return;
            }

            this.addSelectedTokenToOutputList(selectedToken);
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
        showSettingsModals(isShow) {
            this.isShowSettingsModal = isShow;
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
    }
})
</script>

<style scoped>
div {
    font-family: 'Roboto',serif;
}

.swap-container {
    padding: 40px 30px;
    gap: 8px;
    background: var(--swap-main-banner-background);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    border-radius: 28px;
    max-width: 600px;
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
    font-size: 16px;
    line-height: 24px;

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

    background: var(--main-banner-background);
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    cursor: pointer;


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
    font-size: 18px;
    line-height: 22px;

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

    color: #BABFC8;
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
</style>

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
<!--                <div class="swap-header">
                    <div @click="showSettingsModals(true)" class="swap-settings">
                        <img v-if="light" src="/assets/icon/swap/settings.svg" alt="settings">
                        <img v-else src="/assets/icon/swap/settings-dark.svg" alt="settings">
                    </div>
                </div>-->

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
                        </div>
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
                             @click="stake()"
                             class="swap-button">
                            <div class="swap-button-title">
                                <div>
                                    STAKE
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="label-container pt-3">
                        <div v-if="selectedInputTokens.length > 0" class="row">
                            <div class="col-12">
                               <ZapSteps :selected-input-tokens="selectedInputTokens"
                               :click-on-stake="clickOnStake">
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

        <AdvancedSettingsModal :is-show="isShowSettingsModal"
                               :set-show-func="showSettingsModals"/>

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
import AdvancedSettingsModal from "@/components/swap-module/modals/AdvancedSettingsModal.vue";
import SuccessZapModal from "@/components/zap/modals/SuccessZapModal.vue";
import ZapSteps from "@/components/zap/ZapSteps.vue";
import {zap} from "@/components/mixins/zap";
import PoolLabel from "@/components/zap/PoolLabel.vue";
import ZapChangeNetwork from "@/components/zap/ZapChangeNetwork.vue";

export default defineComponent({
    name: "ZapForm",
    mixins: [odosSwap, zap],
    components: {
        ZapChangeNetwork,
        PoolLabel,
        ZapSteps,
        SuccessZapModal,
        AdvancedSettingsModal,
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
            tokensQuotaCheckerSec: 0,

            clickOnStake: false,

            sourceLiquidityBlacklist: ["Hashflow"],
            mapExcludeLiquidityPlatform: { // Schema for hot exclude: {'Ovn pool platform name from db': ['odos', 'api/info/liquidity-sources', 'related', 'with', 'platform'] }
                'Chronos': ["Chronos Volatile"] //"Chronos Stable"
            },

            poolTokensMap: {
                // pool address
                '0xb260163158311596ea88a700c5a30f101d072326': [
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                    {name: 'DAI+', address: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8'},
                ],
                '0xbbd7ff1728963a5eb582d26ea90290f84e89bd66': [
                    {name: 'DOLA', address: '0x6a7661795c374c0bfc635934efaddff3a7ee23b6'},
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                ],

                '0x0d20ef7033b73ea0c9c320304b05da82e2c14e33': [
                    {name: 'FRAX', address: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F'},
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                ],

                '0xcd78e225e36e724c9fb4bd8287296557d728cda7': [
                    {name: 'LUSD', address: '0x93b346b6BC2548dA6A1E7d98E9a421B42541425b'},
                    {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
                ],

            }
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
                this.swapResponseConfirmInfo.waitingConformation ||
                !this.isAvailableOnNetwork ||
                !this.isAnyTokensBalanceIsInsufficient
        },

        disableButtonMessage() {
            if (this.inputTokensWithSelectedTokensCount === 0 ||
                this.outputTokensWithSelectedTokensCount === 0) {
                if (this.isAvailableOnNetwork) {
                    return 'SELECT TOKENS';
                }

                return "SWITCH CHAIN"
            }

            if (!this.isAnyTokensBalanceIsInsufficient) {
                return 'BALANCE IS INSUFFICIENT';
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
                    return
                }

            }
        },
        isDisableButton: function (val, oldVal) {
            if (val) {
                this.clearQuotaInfo();
            }
            // this.updateButtonDisabledFunc(val);
        }
    },
    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),

        ...mapActions("errorModal", ['showErrorModal', 'showErrorModalWithMsg']),
        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions('walletAction', ['connectWallet']),

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        firstInit() {

            this.tokenSeparationScheme = 'POOL_SWAP';
            console.log("Zap form odos init by scheme: ", this.tokenSeparationScheme)
            console.log("Zap pool: ", this.zapPool)
            // todo: move to backend
            let poolTokens = this.poolTokensMap[this.zapPool.address];
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
                this.addSelectedTokenToInputList(poolSelectedToken);
                this.addSelectedTokenToInputList(ovnSelectSelectedToken);
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
            if (!this.zapPool) {
                console.log("Error when stake. Zap pool not found.")
                return;
            }

            let gaugeAddress = this.pollsMap[this.zapPool.address];
            if (!gaugeAddress) {
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


            let reserves = await this.getProportion(this.zapPool.address);
            console.log("reserves 1: ", reserves.token0Amount);
            console.log("reserves 2: ", reserves.token1Amount);
            let sumReserves = reserves.token0Amount*1 + reserves.token1Amount*1;
            console.log("sumReserves: ", sumReserves);

            let requestOutputTokens = this.getRequestOutputTokens();
            let requestInputTokens = this.getRequestInputTokens();
            // requestOutputTokens[0].proportion = reserves.token0Amount*1 / sumReserves;
            // requestOutputTokens[1].proportion = reserves.token1Amount*1 / sumReserves;
            let request = {
                "chainId": this.networkId,
                "inputTokens": requestInputTokens,
                "outputTokens": [
                    {
                        "tokenAddress": requestOutputTokens[0].tokenAddress,
                        "proportion": reserves[0] / sumReserves
                    },
                    {
                        "tokenAddress": requestOutputTokens[1].tokenAddress,
                        "proportion": reserves[1] / sumReserves
                    },

                ],
                "gasPrice": actualGas,
                "userAddr": this.chronosContract.options.address,
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
                disableRFQs: false
                // chainId: this.networkId,
                // // chainId: 1,
                // inputTokens: requestInputTokens,
                // outputTokens: requestTokens,
                // gasPrice: actualGas,
                // userAddr: this.chronosContract.options.address,
                // slippageLimitPercent: this.getSlippagePercent(),
                // sourceBlacklist: ['Hashflow'],
                // sourceWhitelist: [],
                // simulate: true,
                // pathViz: true,
                // // disableRFQs: false
            }

            console.log("Odos request data", requestData);
            // this.testZapIn(requestOutputTokens, requestInputTokens, gaugeAddress);
            this.swapRequest(requestData, this.selectedInputTokens, this.selectedOutputTokens)
                .then(data => {
                    console.log("Odos swap request success", data)
                    this.initZapInTransaction(data, requestInputTokens, requestOutputTokens, gaugeAddress, request.gasPrice);
                    this.isSwapLoading = false;
                }).catch(e => {
                console.error("Odos swap request failed", e)
                this.isSwapLoading = false;
                this.clickOnStake = false;
            })
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
        async initZapInTransaction(responseData, requestInputTokens, requestOutputTokens, gaugeAddress, gasPrice) {
            console.log("Chronos-odos transaction data", responseData, this.chronosContract);

            if (!this.chronosContract) {
                console.error("Init zap transactions failed, chronos contract not found. responseData: ", responseData)
                return;
            }

            this.startSwapConfirmTimer();

            console.log("Odos swap request success", responseData, this.chronosContract, requestInputTokens, requestOutputTokens, gaugeAddress)
            // console.log("Odos swap request success", data)
            let requestInput = [];
            for (let i = 0; i < requestInputTokens.length; i++) {
                requestInput.push({
                    tokenAddress: requestInputTokens[i].tokenAddress,
                    amountIn: requestInputTokens[i].amount,
                })
            }

            let requestOutput = [
                {
                    tokenAddress: requestOutputTokens[0].tokenAddress,
                    receiver: this.chronosContract.options.address,
                },
                {
                    tokenAddress: requestOutputTokens[1].tokenAddress,
                    receiver: this.chronosContract.options.address,
                },
            ]

            let txData = {
                inputs: requestInput,
                outputs: requestOutput,
                data: responseData.transaction.data
            };

            console.log("Odos zap request data:", txData, this.chronosContract);

            this.showWaitingModal('Staking in process');

            let params = {from: this.account, gasPrice: this.gasPriceGwei};
            this.chronosContract.methods.zapIn(
                txData,
                gaugeAddress).send(params)
                .then(data => {
                                // let data = this.getZapMocInfo();  // Retrieve event logs
            let putIntoPoolEvent;
            let returnedToUserEvent;
            for (const key of Object.keys(data.events)) {
                const value = data.events[key];

                console.log(`Key: ${key}`);
                console.log(`Value:`, value);

                if (key === 'PutIntoPool') {
                    putIntoPoolEvent = value;
                    console.log(`Tokens put into pool: ${putIntoPoolEvent.returnValues.amountsPut} ${putIntoPoolEvent.returnValues.tokensPut}`);
                }

                if (key === 'ReturnedToUser') {
                    returnedToUserEvent = value;
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

                this.loadBalances();
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
            let reserves = await this.getProportion(this.zapPool.address);
            console.log("reserves 1: ", reserves.token0Amount);
            console.log("reserves 2: ", reserves.token1Amount);
            let sumReserves = reserves.token0Amount*1 + reserves.token1Amount*1;
            console.log("sumReserves: ", sumReserves);
            // "proportion": reserves[0] / sumReserves
            this.selectedOutputTokens[0].value = reserves[0] / sumReserves;
            this.selectedOutputTokens[1].value = reserves[1] / sumReserves;

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
                sourceBlacklist: ['Hashflow'],
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
            this.clearApproveToken(tokenContract, this.chronosContract.options.address)
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
            console.log('Check Approve contract: ', token, tokenContract, this.account, this.chronosContract.options.address);
            // let allowanceValue = await this.getAllowanceValue(tokenContract, this.account, this.routerContract.options.address);
            let allowanceValue = await this.getAllowanceValue(tokenContract, this.account, this.chronosContract.options.address);
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
            // console.log('Approve contract: ', token, tokenContract, this.account, this.routerContract.options.address);
            console.log('Approve contract: ', token, tokenContract, this.account, this.chronosContract.options.address);
            let approveValue = selectedToken.balanceData.originalBalance*1 ? selectedToken.balanceData.originalBalance : (10000000000000 + '');
            // this.approveToken(tokenContract, this.routerContract.options.address, approveValue)
            this.approveToken(tokenContract, this.chronosContract.options.address, approveValue)
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

                inputTokens.push({
                    tokenAddress: selectedToken.address,
                    amount: token.contractValue
                })
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
            console.log('recalculateOutputTokensSum')
            for (let i = 0; i < this.selectedOutputTokens.length; i++) {
                let token = this.selectedOutputTokens[i];
                let sum = this.sumOfAllSelectedTokensInUsd * token.value;
                sum = this.swapMethod === 'BUY' ? sum * token.selectedToken.price : sum / token.selectedToken.price
                // console.log('recalculateOutputTokensSum', this.sumOfAllSelectedTokensInUsd, token.value, sum);

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

            this.addSelectedTokenToOutputList(selectedToken, true, 50);
        },
        addSelectedTokenToInputList(selectedToken) {
            let newInputToken = this.getNewInputToken()
            newInputToken.selectedToken = selectedToken;
            this.inputTokens.push(newInputToken);
            this.removeAllWithoutSelectedTokens(this.inputTokens);

            this.checkApproveForToken(newInputToken);
        },
        addSelectedTokenToOutputList(selectedToken, isLocked, startPercent) {
            let newOutputToken = this.getNewOutputToken()
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
</style>

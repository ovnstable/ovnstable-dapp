<template>
    <div>
        <div class="swap-container">
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
                           :ovn-tokens="ovnTokens"
                           :tokens="tokens"
                           :is-all-data-loaded="isAllDataLoaded"

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

export default defineComponent({
    name: "ZapForm",
    mixins: [odosSwap, zap],
    components: {
        ZapSteps,
        SuccessZapModal,
        AdvancedSettingsModal,
        ErrorModal,
        WaitingModal,
        SelectTokensModal,
        OutputToken,
        InputToken
    },
    props: {
        zapPool: {
            type: Object,
            required: false,
            default: null
        },
    },
    mounted() {
        this.init();

        if (!this.isAvailableOnNetwork) {
            this.mintAction();
        }
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
            isSumulateSwapLoading: false,
            pathViz: null,
            slippagePercent: 0.05,

            tokensQuotaCounterId: null,
            tokensQuotaCheckerSec: 0,

            clickOnStake: false,
        }
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

        init() {
            this.loadChains();
            this.loadTokens();
            this.initContractData();

            this.$bus.$on('zap-transaction-finished', (data) => {
                this.finishTransaction();
            })
        },
        addDefaultOvnToken() {
            let ovnSelectedToken = this.getDefaultOvnToken();
            let ovnSelectSelectedToken = this.getSecondDefaultOvnToken();
            if (!ovnSelectedToken || !ovnSelectSelectedToken) {
                this.addNewInputToken();
                this.addNewOutputToken();
                return;
            }

            ovnSelectedToken.selected = true;
            ovnSelectSelectedToken.selected = true;
            console.log("ovnSelectedToken: ", ovnSelectedToken, ovnSelectSelectedToken);

            if (this.swapMethod === 'BUY') {
                this.addSelectedTokenToOutputList(ovnSelectedToken, true, 50);
                this.addSelectedTokenToOutputList(ovnSelectSelectedToken, true, 50);
                this.addNewInputToken();
                return;
            }

            if (this.swapMethod === 'SELL') {
                this.addSelectedTokenToInputList(ovnSelectedToken);
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
                console.log('Swap method not available, prev sap in process');
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
                sourceBlacklist: ["Hashflow"],
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
                    // { "inTokens": [ "0x0000000000000000000000000000000000000000", "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a" ], "outTokens": [ "0xe80772eaf6e2e18b651f160bc9158b2a5cafca65", "0xeb8e93a0c7504bffd8a8ffa56cd754c63aaebfe8" ], "inAmounts": [ "1000000000000000000", "1000000000000000000" ], "outAmounts": [ "748864357", "1091926251518831755264" ], "gasEstimate": 613284, "dataGasEstimate": 0, "gweiPerGas": 1000000, "gasEstimateValue": 1129317.6351027626, "inValues": [ 1841.4255542063122, 1.0001535800151131 ], "outValues": [ 748.6976540455693, 1091.9074095761437 ], "netOutValue": -1127477.030039141, "priceImpact": -0.0008666645762853047, "percentDiff": -0.09881777902469935, "pathId": "a5fc8568c59f7cf8cc8df9194d66b4f6", "pathViz": null, "blockNumber": 89177560 }
                    this.initZapInTransaction(data, requestInputTokens, requestOutputTokens, gaugeAddress);
                    this.isSwapLoading = false;
                }).catch(e => {
                console.error("Odos swap request failed", e)
                this.isSwapLoading = false;
                this.clickOnStake = false;
            })
        },
        async initZapInTransaction(responseData, requestInputTokens, requestOutputTokens, gaugeAddress) {
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

            let params = {from: this.account};
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
        getZapMocInfo() {
            return {
                "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                "blockNumber": 94091706,
                "contractAddress": null,
                "cumulativeGasUsed": 3572854,
                "effectiveGasPrice": 100000000,
                "from": "0x4473d652fb0b40b36d549545e5ff6a363c9cd686",
                "gasUsed": 3572854,
                "gasUsedForL1": "0x2272e2",
                "l1BlockNumber": "0x108779e",
                "logsBloom": "0x10000000000000000000404000000000000008000400140080141000000001500000000080000400000000018000001008080090001040080000001000204000050000000000010011000008000000000800008000000000000000004020000000810080020410000000600080000c00000000400008002100000010020002000004008000608002810200c4000000020820100044021210000000000200000002004000100400800204000800004004000000000000000001100000800000000000404200001000000000040a020000a02000000000200000000000000020000010010020100040000804004000000004480000400000000080040000000000",
                "status": true,
                "to": "0xf26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                "transactionIndex": 1,
                "type": "0x0",
                "events": {
                    "0": {
                        "address": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 0,
                        "removed": false,
                        "id": "log_0d7ef12a",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x0000000000000000000000004473d652fb0b40b36d549545e5ff6a363c9cd686",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4"
                            ]
                        }
                    },
                    "1": {
                        "address": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 1,
                        "removed": false,
                        "id": "log_45c97321",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
                            "topics": [
                                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x000000000000000000000000dd94018f54e565dbfc939f7c44a16e163faab331"
                            ]
                        }
                    },
                    "2": {
                        "address": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 2,
                        "removed": false,
                        "id": "log_7e3f441c",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x0000000000000000000000002d7d00424d7e61a198afda2109407d60199ecffe"
                            ]
                        }
                    },
                    "3": {
                        "address": "0x2d7D00424D7E61A198AfDa2109407d60199eCFFe",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 3,
                        "removed": false,
                        "id": "log_5d7e05f9",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000de000cd866f800000000000000000000000000000000000000000000000000000000000000f417a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b5e620f48000",
                            "topics": [
                                "0xc528cda9e500228b16ce84fadae290d9a49aecb17483110004c5af0a07f6fd73",
                                "0x000000000000000000000000cfedfa1734528a1ad96a5ee999b034623785c6ae",
                                "0x000000000000000000000000cfedfa1734528a1ad96a5ee999b034623785c6ae",
                                "0x00000000000000000000000000000000000000000000000000000000007bc89c"
                            ]
                        }
                    },
                    "4": {
                        "address": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 4,
                        "removed": false,
                        "id": "log_d339bd48",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x00000000000000000000000000000000000000000000000000000000000f417a",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x0000000000000000000000002d7d00424d7e61a198afda2109407d60199ecffe",
                                "0x000000000000000000000000cfedfa1734528a1ad96a5ee999b034623785c6ae"
                            ]
                        }
                    },
                    "5": {
                        "address": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 5,
                        "removed": false,
                        "id": "log_2c57abf0",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x000000000000000000000000000000000000000000000000000000000006de99",
                            "topics": [
                                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                                "0x000000000000000000000000cfedfa1734528a1ad96a5ee999b034623785c6ae",
                                "0x000000000000000000000000cf20fda54e37f3fb456930f02fb07fccf49e4849"
                            ]
                        }
                    },
                    "6": {
                        "address": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 6,
                        "removed": false,
                        "id": "log_77e2e93e",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x000000000000000000000000000000000000000000000000000000000006de99",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x000000000000000000000000cfedfa1734528a1ad96a5ee999b034623785c6ae",
                                "0x0000000000000000000000006add078996308547c57b052549a19c5f66bf42c8"
                            ]
                        }
                    },
                    "7": {
                        "address": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 7,
                        "removed": false,
                        "id": "log_1c214a47",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000000000000000000",
                            "topics": [
                                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                                "0x000000000000000000000000cfedfa1734528a1ad96a5ee999b034623785c6ae",
                                "0x000000000000000000000000cf20fda54e37f3fb456930f02fb07fccf49e4849"
                            ]
                        }
                    },
                    "8": {
                        "address": "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 8,
                        "removed": false,
                        "id": "log_d2a32dd0",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x000000000000000000000000000000000000000000000000063f33f374dfb9ce",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x00000000000000000000000051e073d92b0c226f7b0065909440b18a85769606",
                                "0x000000000000000000000000dd94018f54e565dbfc939f7c44a16e163faab331"
                            ]
                        }
                    },
                    "9": {
                        "address": "0xCF20fDA54e37f3fB456930f02fb07FccF49e4849",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 9,
                        "removed": false,
                        "id": "log_d4c5e1f4",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc8000000000000000000000000eb8e93a0c7504bffd8a8ffa56cd754c63aaebfe8000000000000000000000000000000000000000000000000000000000006de99000000000000000000000000000000000000000000000000063f33f374dfb9ce",
                            "topics": [
                                "0x54787c404bb33c88e86f4baf88183a3b0141d0a848e6a9f7a13b66ae3a9b73d1",
                                "0x000000000000000000000000cfedfa1734528a1ad96a5ee999b034623785c6ae",
                                "0x000000000000000000000000dd94018f54e565dbfc939f7c44a16e163faab331"
                            ]
                        }
                    },
                    "10": {
                        "address": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 10,
                        "removed": false,
                        "id": "log_61b94520",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x00000000000000000000000000000000000000000000000000000000000862e1",
                            "topics": [
                                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                                "0x000000000000000000000000cfedfa1734528a1ad96a5ee999b034623785c6ae",
                                "0x0000000000000000000000004a8686df475d4c44324210ffa3fc1dea705296e0"
                            ]
                        }
                    },
                    "11": {
                        "address": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 11,
                        "removed": false,
                        "id": "log_f90fe0bd",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x00000000000000000000000000000000000000000000000000000000000862e1",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x000000000000000000000000cfedfa1734528a1ad96a5ee999b034623785c6ae",
                                "0x000000000000000000000000502a88ffceb9363befd1b1c78265fc3ac8abd3a2"
                            ]
                        }
                    },
                    "12": {
                        "address": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 12,
                        "removed": false,
                        "id": "log_4de3e87c",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000000000000000000",
                            "topics": [
                                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                                "0x000000000000000000000000cfedfa1734528a1ad96a5ee999b034623785c6ae",
                                "0x0000000000000000000000004a8686df475d4c44324210ffa3fc1dea705296e0"
                            ]
                        }
                    },
                    "13": {
                        "address": "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 13,
                        "removed": false,
                        "id": "log_bf91df1b",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x000000000000000000000000000000000000000000000000000000000008630c",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x000000000000000000000000f9c2356a21b60c0c4ddf2397f828dd158f82a274",
                                "0x000000000000000000000000dd94018f54e565dbfc939f7c44a16e163faab331"
                            ]
                        }
                    },
                    "14": {
                        "address": "0x4a8686df475D4c44324210FFA3Fc1DEA705296e0",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 14,
                        "removed": false,
                        "id": "log_6ed7574b",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc8000000000000000000000000e80772eaf6e2e18b651f160bc9158b2a5cafca6500000000000000000000000000000000000000000000000000000000000862e1000000000000000000000000000000000000000000000000000000000008630c",
                            "topics": [
                                "0x54787c404bb33c88e86f4baf88183a3b0141d0a848e6a9f7a13b66ae3a9b73d1",
                                "0x000000000000000000000000cfedfa1734528a1ad96a5ee999b034623785c6ae",
                                "0x000000000000000000000000dd94018f54e565dbfc939f7c44a16e163faab331"
                            ]
                        }
                    },
                    "15": {
                        "address": "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 15,
                        "removed": false,
                        "id": "log_df89362d",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x000000000000000000000000000000000000000000000000000000000008630c",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x000000000000000000000000dd94018f54e565dbfc939f7c44a16e163faab331",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4"
                            ]
                        }
                    },
                    "16": {
                        "address": "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 16,
                        "removed": false,
                        "id": "log_2c99dd95",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x000000000000000000000000000000000000000000000000063f33f374dfb9ce",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x000000000000000000000000dd94018f54e565dbfc939f7c44a16e163faab331",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4"
                            ]
                        }
                    },
                    "17": {
                        "address": "0xdd94018F54e565dbfc939F7C44a16e163FaAb331",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 17,
                        "removed": false,
                        "id": "log_a463b6cb",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b400000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000052b2a7acad7ded3ab7d80000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da10000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000008630c000000000000000000000000000000000000000000000000063f33f374dfb9ce0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000e80772eaf6e2e18b651f160bc9158b2a5cafca650000000000000000000000000000000000000000000000056badfb37ce674000000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4000000000000000000000000eb8e93a0c7504bffd8a8ffa56cd754c63aaebfe80000000000000000000000000000000000000000000000000000000005f5ed78000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                            "topics": [
                                "0xe87568fe5934cb7524b96e16b225ee2e7e738ccbb706c7bee52ce07bf0360e69"
                            ]
                        }
                    },
                    "18": {
                        "address": "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 20,
                        "removed": false,
                        "id": "log_347835eb",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000001a17538ac2c1f",
                            "topics": [
                                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x000000000000000000000000e708aa9e887980750c040a6a2cb901c37aa34f3b"
                            ]
                        }
                    },
                    "19": {
                        "address": "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 21,
                        "removed": false,
                        "id": "log_908437fc",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000016ae3ec8ca7a5d6fec71f25",
                            "topics": [
                                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x000000000000000000000000e708aa9e887980750c040a6a2cb901c37aa34f3b"
                            ]
                        }
                    },
                    "20": {
                        "address": "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 22,
                        "removed": false,
                        "id": "log_c024df79",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000000000000000000",
                            "topics": [
                                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x000000000000000000000000e708aa9e887980750c040a6a2cb901c37aa34f3b"
                            ]
                        }
                    },
                    "21": {
                        "address": "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 23,
                        "removed": false,
                        "id": "log_efcaaa18",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x00000000000000000000000000000000000000000000000000000000000741bb",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x000000000000000000000000b260163158311596ea88a700c5a30f101d072326"
                            ]
                        }
                    },
                    "22": {
                        "address": "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 24,
                        "removed": false,
                        "id": "log_98e8c189",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000296feb79897ad5cf25",
                            "topics": [
                                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x000000000000000000000000e708aa9e887980750c040a6a2cb901c37aa34f3b"
                            ]
                        }
                    },
                    "23": {
                        "address": "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 25,
                        "removed": false,
                        "id": "log_f2e5f73e",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x000000000000000000000000000000000000000000000000063f333cd95f1a5d",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x000000000000000000000000b260163158311596ea88a700c5a30f101d072326"
                            ]
                        }
                    },
                    "24": {
                        "address": "0xB260163158311596Ea88a700C5a30f101D072326",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 26,
                        "removed": false,
                        "id": "log_02bbc28f",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000000006bc4154d75",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x0000000000000000000000000000000000000000000000000000000000000000",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4"
                            ]
                        }
                    },
                    "25": {
                        "address": "0xB260163158311596Ea88a700C5a30f101D072326",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 27,
                        "removed": false,
                        "id": "log_607ba8ac",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000000083fa51542750000000000000000000000000000000000000000000719c754eb2f3b9362754c",
                            "topics": [
                                "0xcf2aa50876cdfbb541206f89af0ee78d44a2abf8d328e37fa4917f982149848a"
                            ]
                        }
                    },
                    "26": {
                        "address": "0xB260163158311596Ea88a700C5a30f101D072326",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 28,
                        "removed": false,
                        "id": "log_05468fad",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x00000000000000000000000000000000000000000000000000000000000741bb000000000000000000000000000000000000000000000000063f333cd95f1a5d",
                            "topics": [
                                "0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f",
                                "0x000000000000000000000000e708aa9e887980750c040a6a2cb901c37aa34f3b"
                            ]
                        }
                    },
                    "27": {
                        "address": "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 29,
                        "removed": false,
                        "id": "log_84d48455",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000000000000012151",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x0000000000000000000000004473d652fb0b40b36d549545e5ff6a363c9cd686"
                            ]
                        }
                    },
                    "28": {
                        "address": "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 30,
                        "removed": false,
                        "id": "log_bdc45ac5",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x000000000000000000000000000000000000000000000000000000b69b809f71",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x0000000000000000000000004473d652fb0b40b36d549545e5ff6a363c9cd686"
                            ]
                        }
                    },
                    "29": {
                        "address": "0xB260163158311596Ea88a700C5a30f101D072326",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 33,
                        "removed": false,
                        "id": "log_64dc5d56",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000000006bc4154d75",
                            "topics": [
                                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x000000000000000000000000cd4a56221175b88d4fb28ca2138d670cc1197ca9"
                            ]
                        }
                    },
                    "30": {
                        "address": "0x9774Ae804E6662385F5AB9b01417BC2c6E548468",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 34,
                        "removed": false,
                        "id": "log_47b00b33",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x0000000000000000000000000000000000000000000000000000000000000000",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x000000000000000000000000000000000000000000000000000000000000627c"
                            ]
                        }
                    },
                    "31": {
                        "address": "0x9774Ae804E6662385F5AB9b01417BC2c6E548468",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 35,
                        "removed": false,
                        "id": "log_4ade1392",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4000000000000000000000000000000000000000000000000000000000000627c000000000000000000000000cd4a56221175b88d4fb28ca2138d670cc1197ca9",
                            "topics": [
                                "0xbcad3d7d3dfccb90d49c6063bf70f828901fefc88937d90af74e58e6e55bc39d"
                            ]
                        }
                    },
                    "32": {
                        "address": "0xB260163158311596Ea88a700C5a30f101D072326",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 36,
                        "removed": false,
                        "id": "log_42125a5b",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000000000000000000",
                            "topics": [
                                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x000000000000000000000000cd4a56221175b88d4fb28ca2138d670cc1197ca9"
                            ]
                        }
                    },
                    "33": {
                        "address": "0xB260163158311596Ea88a700C5a30f101D072326",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 37,
                        "removed": false,
                        "id": "log_97d41a75",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000000006bc4154d75",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x000000000000000000000000cd4a56221175b88d4fb28ca2138d670cc1197ca9"
                            ]
                        }
                    },
                    "34": {
                        "address": "0xCD4A56221175b88d4fb28CA2138d670Cc1197CA9",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 38,
                        "removed": false,
                        "id": "log_0334d0ee",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x000000000000000000000000000000000000000000000000000000000000627c0000000000000000000000000000000000000000000000000000006bc4154d75",
                            "topics": [
                                "0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4"
                            ]
                        }
                    },
                    "35": {
                        "address": "0x9774Ae804E6662385F5AB9b01417BC2c6E548468",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 39,
                        "removed": false,
                        "id": "log_988df888",
                        "returnValues": {},
                        "signature": null,
                        "raw": {
                            "data": "0x",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x000000000000000000000000f26f6193c7ce56a696cd90cc7cc5c3f3a0f365b4",
                                "0x0000000000000000000000004473d652fb0b40b36d549545e5ff6a363c9cd686",
                                "0x000000000000000000000000000000000000000000000000000000000000627c"
                            ]
                        }
                    },
                    "InputTokens": {
                        "address": "0xf26F6193C7cE56A696Cd90cc7cC5c3F3a0F365B4",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 18,
                        "removed": false,
                        "id": "log_1964d8b2",
                        "returnValues": {
                            "0": [
                                "1000000000000000000"
                            ],
                            "1": [
                                "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
                            ],
                            "amountsIn": [
                                "1000000000000000000"
                            ],
                            "tokensIn": [
                                "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
                            ]
                        },
                        "event": "InputTokens",
                        "signature": "0xb5ad02132d64b1e89c5196397a95b3e268e3f5c555b5845f2ddcdf24684d2aad",
                        "raw": {
                            "data": "0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da1",
                            "topics": [
                                "0xb5ad02132d64b1e89c5196397a95b3e268e3f5c555b5845f2ddcdf24684d2aad"
                            ]
                        }
                    },
                    "OutputTokens": {
                        "address": "0xf26F6193C7cE56A696Cd90cc7cC5c3F3a0F365B4",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 19,
                        "removed": false,
                        "id": "log_d9b62dc8",
                        "returnValues": {
                            "0": [
                                "549644",
                                "450135608491227598"
                            ],
                            "1": [
                                "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65",
                                "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8"
                            ],
                            "amountsOut": [
                                "549644",
                                "450135608491227598"
                            ],
                            "tokensOut": [
                                "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65",
                                "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8"
                            ]
                        },
                        "event": "OutputTokens",
                        "signature": "0x0c9e5a590aa4a07e734c28846ee575ea53d4ddf0fc046c45c367faaa2e034238",
                        "raw": {
                            "data": "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000008630c000000000000000000000000000000000000000000000000063f33f374dfb9ce0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000e80772eaf6e2e18b651f160bc9158b2a5cafca65000000000000000000000000eb8e93a0c7504bffd8a8ffa56cd754c63aaebfe8",
                            "topics": [
                                "0x0c9e5a590aa4a07e734c28846ee575ea53d4ddf0fc046c45c367faaa2e034238"
                            ]
                        }
                    },
                    "PutIntoPool": {
                        "address": "0xf26F6193C7cE56A696Cd90cc7cC5c3F3a0F365B4",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 31,
                        "removed": false,
                        "id": "log_ac25c23b",
                        "returnValues": {
                            "0": [
                                "475579",
                                "450134824198281821"
                            ],
                            "1": [
                                "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65",
                                "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8"
                            ],
                            "amountsPut": [
                                "475579",
                                "450134824198281821"
                            ],
                            "tokensPut": [
                                "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65",
                                "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8"
                            ]
                        },
                        "event": "PutIntoPool",
                        "signature": "0xf471c761d3d5d25c66f3d23a33cf7f9aaea894aa0fbcbb3bb158b1bea3c2ed45",
                        "raw": {
                            "data": "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000741bb000000000000000000000000000000000000000000000000063f333cd95f1a5d0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000e80772eaf6e2e18b651f160bc9158b2a5cafca65000000000000000000000000eb8e93a0c7504bffd8a8ffa56cd754c63aaebfe8",
                            "topics": [
                                "0xf471c761d3d5d25c66f3d23a33cf7f9aaea894aa0fbcbb3bb158b1bea3c2ed45"
                            ]
                        }
                    },
                    "ReturnedToUser": {
                        "address": "0xf26F6193C7cE56A696Cd90cc7cC5c3F3a0F365B4",
                        "blockNumber": 94091706,
                        "transactionHash": "0xfd594bd6df5e9705c2ce8e2f50765b80eec045f7e5ca90f3bba78206e2644e45",
                        "transactionIndex": 1,
                        "blockHash": "0x036f3cc35375654c89f3e69ca821d73cf1052f0673ab1addfde1e5a28b6a85ee",
                        "logIndex": 32,
                        "removed": false,
                        "id": "log_ff922f8c",
                        "returnValues": {
                            "0": [
                                "74065",
                                "784292945777"
                            ],
                            "1": [
                                "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65",
                                "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8"
                            ],
                            "amountsReturned": [
                                "74065",
                                "784292945777"
                            ],
                            "tokensReturned": [
                                "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65",
                                "0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8"
                            ]
                        },
                        "event": "ReturnedToUser",
                        "signature": "0xb4df4b62c251866b0421eb65c2beafa02a7d9e8a267e952174b984257924e175",
                        "raw": {
                            "data": "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000012151000000000000000000000000000000000000000000000000000000b69b809f710000000000000000000000000000000000000000000000000000000000000002000000000000000000000000e80772eaf6e2e18b651f160bc9158b2a5cafca65000000000000000000000000eb8e93a0c7504bffd8a8ffa56cd754c63aaebfe8",
                            "topics": [
                                "0xb4df4b62c251866b0421eb65c2beafa02a7d9e8a267e952174b984257924e175"
                            ]
                        }
                    }
                }
            }
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
                console.log('Simulate Swap method not available, prev sap in process');
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

<template>
    <div>
        <div class="swap-container">
            <div class="swap-header">
                <div @click="showSettingsModals(true)" class="swap-settings">
                    <img src="/assets/icon/swap/settings.svg" alt="settings">
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
                                <div @click="maxAll" class="add-token-text max-all">
                                    Max all
                                </div>
                            </div>
                        </div>
                    </div>

                   <div class="pt-5">
                       <div @click="changeSwap()" class="change-swap-container">
                           <div class="change-swap-image">
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
                                <div @click="resetOutputs" class="add-token-text max-all">
                                    Reset output %
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="swap-footer pt-5">
                <div class="swap-button-container">
                    <div @click="swap()" class="swap-button">
                        <div class="swap-button-title">
                            SWAP
                        </div>
                    </div>
                </div>

                <div class="label-container pt-3">
                    <div class="row">
                        <div class="col-6">
                            <div class="powered-text">
                                Powered by
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="powered-image">
                                <img src="/assets/icon/swap/powered-by-odos.svg" alt="powered by odos">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        swapResponseInfo:
<!--        {{swapResponseInfo}}-->

        <div v-if="swapResponseInfo">
            {{swapResponseInfo}}
        </div>


        <SelectTokensModal :is-show="isShowSelectTokensModal"
                           :set-show-func="showSelectTokensModals"
                           :swap-method="swapMethod"
                           :select-token-type="selectTokenType"
                           :add-selected-token-to-list-func="addSelectedTokenToList"
                           :remove-selected-token-from-list-func="removeSelectedTokenFromList"

        />

        <AdvancedSettingsModal :is-show="isShowSettingsModal"
                               :set-show-func="showSettingsModals"/>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import InputToken from "@/components/odos/InputToken.vue";
import OutputToken from "@/components/odos/OutputToken.vue";
import SelectTokensModal from "@/components/odos/modals/SelectTokensModal.vue";
import {odosApiService} from "@/services/external/odos-api-service";
import {mapGetters} from "vuex";
import AdvancedSettingsModal from "@/components/odos/modals/AdvancedSettingsModal.vue";

export default defineComponent({
    name: "SwapForm",
    components: {
        AdvancedSettingsModal,
        SelectTokensModal,
        InputToken,
        OutputToken
    },
    mounted() {
        this.addNewInputToken();
        this.addNewOutputToken();
        this.initData()
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

            swapResponseInfo: null,

            isContractLoading: false,
            contractData: null,
            routerContract: null,
            executorContract: null,

            isShowSettingsModal: false,

        }
    },
    computed: {
        ...mapGetters('network', ['getParams', 'networkId']),
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

        selectedFromTokens() {
            //todo: add check balance
            return this.inputTokens.filter(item => item.selectedToken)
        },
        selectedToTokens() {
            //todo: add check proportion values
            return this.outputTokens.filter(item => item.selectedToken)
        },
    },
    watch: {
        networkId: function (newVal, oldVal) {
            if (newVal) {
                this.initData()
            }
        }
    },
    methods: {
        async initData() {
            let networkId = this.getParams(this.networkName).networkId;
            await this.loadContract(networkId).then(() => {
                console.log("Contracts loaded", this.routerContract, this.executorContract);
            })

        },
        addNewOutputToken() {
            this.outputTokens.push(this.getNewOutputToken());
        },
        removeOutputToken(id) {
            this.removeToken(this.outputTokens, id)
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
                selectedToken: null
            }
        },
        getNewOutputToken() {
            let randomId = (Math.random() + 1).toString(36).substring(2);
            return {
                id: randomId,
                value: 0,
                locked: false,
                selectedToken: null
            }
        },

        maxAll() {
            console.log("Max all");
            for (let i = 0; i < this.selectedFromTokens.length; i++) {
                let token = this.selectedFromTokens[i];
                console.log(token.selectedToken.balanceData.balance);
                this.updateTokenValue(token, token.selectedToken.balanceData.balance);
            }
        },
        changeSwap() {
            console.log("Change swap");
            this.clearAllSelectedTokens();

            if (this.swapMethod === 'BUY') {
                this.setSwapMethod('SELL');
                return;
            }

            if (this.swapMethod === 'SELL') {
                this.setSwapMethod('BUY');

                return;
            }

            console.error('Change swap method not found.', this.swapMethod);
        },
        resetOutputs() {
            console.log("Reset outputs");
        },
        swap() {
            console.log("Swap", this.inputTokensWithSelectedTokensCount, this.outputTokensWithSelectedTokensCount);
            if (this.inputTokensWithSelectedTokensCount < 1 || this.outputTokensWithSelectedTokensCount < 1) {
                return;
            }

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
                gasPrice: 1000000,
                userAddr: this.account,
                slippageLimitPercent: slippagePercent,
                sourceBlacklist: [],
                sourceWhitelist: [],
                simulate: false,
                pathViz: false,
                disableRFQs: false
            }

            console.log("Odos request data", requestData);
            this.swapRequest(requestData);
        },

        getRequestInputTokens() {
            let inputTokens = [];
            for (let i = 0; i < this.selectedFromTokens.length; i++) {
                let token = this.selectedFromTokens[i];
                let selectedToken = token.selectedToken;
                console.log("token: ", token)

                let weiMarker = this.getWeiMarker(selectedToken.decimals);
                let sum = token.decimals === 6 ? token.value * 100 + '' : token.value + '';
                inputTokens.push({
                    tokenAddress: selectedToken.address,
                    amount: this.web3.utils.toWei(sum, weiMarker)
                })
            }
            return inputTokens;
        },
        getRequestOutputTokens() {
            let outputTokens = [];
            for (let i = 0; i < this.selectedToTokens.length; i++) {
                let token = this.selectedToTokens[i];
                let selectedToken = token.selectedToken;
                outputTokens.push({
                    tokenAddress: selectedToken.address,
                    proportion: token.value
                })
            }
            return outputTokens;
        },

        swapRequest(requestData) {
            return odosApiService.quoteRequest(requestData)
                .then((data) => {
                    console.log("Response data for odos request: ", data)
                    this.swapResponseInfo = data;
                    // { "inTokens": [ "0x0000000000000000000000000000000000000000", "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a" ], "outTokens": [ "0xe80772eaf6e2e18b651f160bc9158b2a5cafca65", "0xeb8e93a0c7504bffd8a8ffa56cd754c63aaebfe8" ], "inAmounts": [ "1000000000000000000", "1000000000000000000" ], "outAmounts": [ "748864357", "1091926251518831755264" ], "gasEstimate": 613284, "dataGasEstimate": 0, "gweiPerGas": 1000000, "gasEstimateValue": 1129317.6351027626, "inValues": [ 1841.4255542063122, 1.0001535800151131 ], "outValues": [ 748.6976540455693, 1091.9074095761437 ], "netOutValue": -1127477.030039141, "priceImpact": -0.0008666645762853047, "percentDiff": -0.09881777902469935, "pathId": "a5fc8568c59f7cf8cc8df9194d66b4f6", "pathViz": null, "blockNumber": 89177560 }
                    this.initWalletTransaction(this.swapResponseInfo);
                }).catch(e => {
                    console.log("Swap request error: ", e)
                })
        },
        initWalletTransaction(txData) {
            console.log("Odos transaction data", txData, this.routerContract, this.executorContract);

            if (!this.routerContract || !this.executorContract) {
                console.error("Init wallet transactions failed, odos contracts not found. txData: ", txData)
                return;
            }

            // this.routerContract.methods.swa(txData.data).send({
            //     to: txData.to,
            //     gas: txData.gas,
            //     gasPrice: txData.gasPrice,
            //     nonce: txData.nonce,
            // }, function(error, transactionHash) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log(transactionHash);
            //     }
            // });
            // {
            //     "inTokens": [
            //     "0x0000000000000000000000000000000000000000",
            //     "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a"
            // ],
            //     "outTokens": [
            //     "0xeb8e93a0c7504bffd8a8ffa56cd754c63aaebfe8",
            //     "0xb86fb1047a955c0186c77ff6263819b37b32440d"
            // ],
            //     "inAmounts": [
            //     "1000000000000000000",
            //     "1000000000000000000"
            // ],
            //     "outAmounts": [
            //     "868854660994279538688",
            //     "940862774"
            // ],
            //     "gasEstimate": 979112,
            //     "dataGasEstimate": 0,
            //     "gweiPerGas": 1000000,
            //     "gasEstimateValue": 1802324.3488295842,
            //     "inValues": [
            //     1840.773482115335,
            //     1.000072979038449
            // ],
            //     "outValues": [
            //     868.8546327431228,
            //     971.935412755341
            // ],
            //     "netOutValue": -1800483.5587840858,
            //     "priceImpact": -0.0009847657784032592,
            //     "percentDiff": -0.05340013668831034,
            //     "pathId": "b96a780d08a387f966d7e55c3c8cc729",
            //     "pathViz": null,
            //     "blockNumber": 89181266
            // }
            let transactionData = [
                {
                    inputs: {
                        tokenAddress: txData.inTokens,
                        amountIn: txData.inAmounts,
                    },
                    outputs: {
                        tokenAddress: txData.outTokens,
                        amountIn: txData.outAmounts,
                    },
                }
            ]

            this.routerContract.methods.swap(transactionData).on('transactionHash', function (hash) {
                console.log("Router contract response: ", hash);
            });

            // (bool success, bytes memory result) = this.routerContract.call{value: 0}(txData.data)

            // const result = this.web3.eth.call({
            //     to: this.routerContract.options.address,
            //     data: txData.data
            // }).then(data => {
            //     console.log("Call result: ", data);
            // }).catch(e => {
            //     console.log("Call error: ", e);
            // })


            // this.routerContract.methods.router(txData).on('transactionHash', function (hash) {
            //     console.log("Router contract response: ", hash);
            // });

            // this.routerContract.call({value: 0})(txData.data);

            // this.routerContract.eth.sendTransaction({from: …, to: …, data: TransactionData, …}).on(…);
            // web3.eth.call({from: …, to: …, data: TransactionData, …}).on(…);

        },

        async loadContract(chainId) {
            if (this.isContractLoading) {
                return
            }
            this.isContractLoading = true;
            return odosApiService.loadContractData(chainId).then(data => {
                console.log("Swap form Contract: ", data)
                this.contractData = data
                this.routerContract = this._loadContract(this.contractData.routerAbi, this.web3, this.contractData.routerAddress)
                this.executorContract = this._loadContract(this.contractData.erc20Abi, this.web3, this.contractData.executorAddress)

                console.log("Swap form routerContract: ", this.routerContract)
                console.log("Swap form routerContract: ", this.executorContract)
                this.isContractLoading = false;
            }).catch(e => {
                console.log("Error load contract", e)
                this.isContractLoading = false;
            })
        },

        updateTokenValue(token, value) {
            console.log('updateTokenValue1: ', token, value)
            token.value = value;
            console.log('updateTokenValue2: ', token, value)
        },

        lockProportion(isLock, token) {
            console.log("lockProportionFunc", isLock, token);
            token.locked = isLock
        },
        updateSliderValue(token, value) {
            console.log("Swap form", token.id, value, !this.isSlidersOutOfLimit());
            let oldTokenValue = token.value;

            if(!this.isSlidersOutOfLimit()) {
                token.value = value;
                this.subtraction(token, 100 - value);
                // if (oldTokenValue > value) {
                //     this.subTokensProportions(token, 100 - value)
                // } else {
                //     this.addTokensProportions(token, 100 - value)
                // }
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
                let newInputToken = this.getNewInputToken()
                newInputToken.selectedToken = selectedToken;
                this.inputTokens.push(newInputToken);
                this.removeAllWithoutSelectedTokens(this.inputTokens);
                return;
            }

            let newOutputToken = this.getNewOutputToken()
            newOutputToken.selectedToken = selectedToken;
            this.outputTokens.push(newOutputToken);
            this.removeAllWithoutSelectedTokens(this.outputTokens);
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
            this.addNewInputToken();
            this.addNewOutputToken();
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

        isSlidersOutOfLimit() {
            return this.getOutputsTokensPercentage() > 100;
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
        _loadContract(file, web3, address) {
            if (!address) {
                address = file.address;
            }

            return new web3.eth.Contract(file.abi, address);
        },

        checkApproves() {

        },
    }
})
</script>

<style scoped>
div {
    font-family: 'Roboto',serif;
}

.swap-container {
    padding: 40px;
    gap: 8px;
    background: #FFFFFF;
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

    color: #29323E;

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

    background: #FFFFFF;
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

</style>

<template>
    <div>
        <div>
            <div class="pt-10">
                <label class="title-label">
                    Swap
                </label>
            </div>


            <div class="pt-20">
                <div class="row">
                    <div class="col-6">
                        <SwapForm></SwapForm>
                    </div>
                    <div class="col-6">
                        <SwapInformation>
                        </SwapInformation>
                    </div>
                </div>
            </div>



<!--            <div v-if="!isAllDataLoaded" class="mt-7 cards-list-container">
                <v-row>
                    <v-row align="center" justify="center" class="py-15">
                        <v-progress-circular
                                width="2"
                                size="24"
                                color="#8FA2B7"
                                indeterminate
                        ></v-progress-circular>
                    </v-row>
                </v-row>
            </div>
            <div v-else class="">
                <v-row class="pt-1">
                    <v-row>
                        <v-col cols="12">
                            <v-select
                                    v-model="selectedTokensFromAddresses"
                                    :items="fromTokens"
                                    item-value="address"
                                    item-text="symbol"
                                    label="Select items"
                                    chips
                                    multiple
                                    hint="Pick your from tokens"
                                    persistent-hint
                            ></v-select>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="3" v-for="token in selectedFromTokens" :key="token.id">
                            <v-text-field  :placeholder="token.symbol + ' 0.0'"
                                          @keypress="isNumber($event)"
                                          flat
                                          solo
                                          class="field-sum"
                                          hide-details
                                          background-color="transparent"
                                          v-model="sumMap[token.id]"
                                          @input="inputValue(sumMap[token.id])">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-row>


                <v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-select
                                    v-model="selectedTokensToAddresses"
                                    :items="toTokens"
                                    item-value="address"
                                    item-text="symbol"
                                    label="Select items"
                                    chips
                                    multiple
                                    hint="Pick your to tokens"
                                    persistent-hint
                            ></v-select>
                        </v-col>
                    </v-row>


                    <v-row>
                        <v-col cols="3" v-for="token in selectedToTokens" :key="token.id">
                            {{proportionMap[token.id]}}
                            <v-text-field  :placeholder="token.symbol + ' 0.0'"
                                          @keypress="isNumber($event)"
                                          flat
                                          solo
                                          class="field-sum"
                                          hide-details
                                          background-color="transparent"
                                          v-model="proportionMap[token.id]"
                                          @input="inputProportionValue(proportionMap[token.id])">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-row>

                <v-row class="pt-1">
                    <v-btn @click="innerSwapRequest()">
                        Swap
                    </v-btn>
                </v-row>


                <v-row v-if="swapResponseInfo" class="pt-10">
                    {{swapResponseInfo}}

                    <v-row>
                        <v-col cols="6">
                            Gas estimate:
                        </v-col>

                        <v-col cols="6">
                            {{swapResponseInfo.gasEstimate}}
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="6">
                            Gas estimate value:
                        </v-col>

                        <v-col cols="6">
                            {{swapResponseInfo.gasEstimateValue}}
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-row>
                            Transaction info:
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                Gas:
                            </v-col>

                            <v-col cols="6">
                                {{swapResponseInfo.transaction.gas}}
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                Gas Price:
                            </v-col>

                            <v-col cols="6">
                                {{swapResponseInfo.transaction.gasPrice}}
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                To:
                            </v-col>

                            <v-col cols="6">
                                {{swapResponseInfo.transaction.to}}
                            </v-col>
                        </v-row>
                    </v-row>
                </v-row>--><!--            <div v-if="!isAllDataLoaded" class="mt-7 cards-list-container">
                <v-row>
                    <v-row align="center" justify="center" class="py-15">
                        <v-progress-circular
                                width="2"
                                size="24"
                                color="#8FA2B7"
                                indeterminate
                        ></v-progress-circular>
                    </v-row>
                </v-row>
            </div>
            <div v-else class="">
                <v-row class="pt-1">
                    <v-row>
                        <v-col cols="12">
                            <v-select
                                    v-model="selectedTokensFromAddresses"
                                    :items="fromTokens"
                                    item-value="address"
                                    item-text="symbol"
                                    label="Select items"
                                    chips
                                    multiple
                                    hint="Pick your from tokens"
                                    persistent-hint
                            ></v-select>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="3" v-for="token in selectedFromTokens" :key="token.id">
                            <v-text-field  :placeholder="token.symbol + ' 0.0'"
                                          @keypress="isNumber($event)"
                                          flat
                                          solo
                                          class="field-sum"
                                          hide-details
                                          background-color="transparent"
                                          v-model="sumMap[token.id]"
                                          @input="inputValue(sumMap[token.id])">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-row>


                <v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-select
                                    v-model="selectedTokensToAddresses"
                                    :items="toTokens"
                                    item-value="address"
                                    item-text="symbol"
                                    label="Select items"
                                    chips
                                    multiple
                                    hint="Pick your to tokens"
                                    persistent-hint
                            ></v-select>
                        </v-col>
                    </v-row>


                    <v-row>
                        <v-col cols="3" v-for="token in selectedToTokens" :key="token.id">
                            {{proportionMap[token.id]}}
                            <v-text-field  :placeholder="token.symbol + ' 0.0'"
                                          @keypress="isNumber($event)"
                                          flat
                                          solo
                                          class="field-sum"
                                          hide-details
                                          background-color="transparent"
                                          v-model="proportionMap[token.id]"
                                          @input="inputProportionValue(proportionMap[token.id])">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-row>

                <v-row class="pt-1">
                    <v-btn @click="innerSwapRequest()">
                        Swap
                    </v-btn>
                </v-row>


                <v-row v-if="swapResponseInfo" class="pt-10">
                    {{swapResponseInfo}}

                    <v-row>
                        <v-col cols="6">
                            Gas estimate:
                        </v-col>

                        <v-col cols="6">
                            {{swapResponseInfo.gasEstimate}}
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="6">
                            Gas estimate value:
                        </v-col>

                        <v-col cols="6">
                            {{swapResponseInfo.gasEstimateValue}}
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-row>
                            Transaction info:
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                Gas:
                            </v-col>

                            <v-col cols="6">
                                {{swapResponseInfo.transaction.gas}}
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                Gas Price:
                            </v-col>

                            <v-col cols="6">
                                {{swapResponseInfo.transaction.gasPrice}}
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                To:
                            </v-col>

                            <v-col cols="6">
                                {{swapResponseInfo.transaction.to}}
                            </v-col>
                        </v-row>
                    </v-row>
                </v-row>-->


            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {odosSwap} from "@/components/mixins/odos-swap";
import {mapGetters} from "vuex";
import SwapForm from "@/components/odos/SwapForm.vue";
import SwapInformation from "@/components/odos/SwapInformation.vue";

export default defineComponent({
    name: "SwapView",
    components: {SwapInformation, SwapForm},
    mixins: [odosSwap],
    data() {
        return {
            proportionMap: {},

            sum: null,
            sumMap: {},
            selectedTokensFromAddresses: [],
            selectedTokensToAddresses: [],
            allTokens: [], // without ovn
            ovnTokens: [],
            tokens: [],

            swapMethod: 'BUY', // BUY (ovnTokens) / SELL (ovnTokens)

            availableNetworksList: ['polygon', 'bsc', 'optimism', 'arbitrum'],

        }
    },
    mounted() {

    },
    computed: {
        ...mapGetters('network', ['networkId', "networkName", 'getParams']),
        ...mapGetters('web3', ['web3', 'getWeiMarker']),
        ...mapGetters('accountData', ['account']),


        selectedFromTokens() {
            return this.fromTokens && this.selectedTokensFromAddresses ?
                this.fromTokens.filter(item => this.selectedTokensFromAddresses.includes(item.address)) : [];
        },
        selectedToTokens() {
            return this.toTokens && this.selectedTokensToAddresses ?
                this.toTokens.filter(item => this.selectedTokensToAddresses.includes(item.address)) : [];
        },

        toTokens() {
            if (this.swapMethod === 'BUY') {
                return this.ovnTokens;
            } else if (this.swapMethod === 'SELL') {
                return this.tokens;
            } else {
                console.error("Odos Swap method not found.", this.swapMethod)
            }
        },
        fromTokens() {
            if (this.swapMethod === 'BUY') {
                return this.tokens;
            } else if (this.swapMethod === 'SELL') {
                return this.ovnTokens;
            } else {
                console.error("Odos Swap method not found.", this.swapMethod)
            }
        }
    },
    watch: {
        networkName: function (newVal, oldVal) {
            this.initData();
        },

        tokensMap: function (newVal, oldVal) {
            if (newVal) {
                this.initData();
            }
        },
        swapResponseInfo: function (newVal, oldVal) {
            if (newVal) {
                this.initWalletTransaction(newVal.transaction)
            }

        }
    },
    methods: {
        async initData() {
            if (this.availableNetworksList.includes(this.networkName)) {
                let networkId = this.getParams(this.networkName).networkId;
                this.tokens = this.getFilteredTokens(networkId, false);
                console.log("TOKENS_ ", this.tokens)
                this.ovnTokens = this.getFilteredTokens(networkId, true);
                console.log("OVN TOKENS_ ", this.ovnTokens)
            } else {
                this.clearInputData();
            }
        },
        clearInputData() {
            this.tokens = [];
            this.ovnTokens = [];

            this.sumMap = {}
            this.sum = null;
        },
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            let charCode = (evt.which) ? evt.which : evt.keyCode;

            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                if (charCode === 46 && (!this.sum || this.sum.includes('.'))) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            }
        },
        inputValue(value) {
            console.log("Input: ", value);
        },

        inputProportionValue(value) {
            console.log("Input proportion: ", value);
        },
        getFilteredTokens(chainId, isOvnToken) {
            let tokens = [];
            let tokenMap = this.tokensMap.chainTokenMap[chainId + ''].tokenMap;
            let keys = Object.keys(tokenMap);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let item = tokenMap[key];

                if (isOvnToken) {
                    if (item.protocolId === 'overnight') {
                        tokens.push({
                            id: item.assetId + key,
                            address: key,
                            decimals: item.decimals,
                            name: item.name,
                            symbol: item.symbol,
                        });
                    }
                    continue;
                }

                if (item.protocolId !== 'overnight') {
                    tokens.push({
                        id: item.assetId + key,
                        address: key,
                        decimals: item.decimals,
                        name: item.name,
                        symbol: item.symbol,
                    });
                }
            }

            return tokens;
        },
        initWalletTransaction(txData) {
            console.log("Odos transaction data", txData, this.routerContract, this.executorContract);

            this.routerContract.methods.swap(txData).on('transactionHash', function (hash) {
                console.log("Router contract response: ", hash);
            });

            // this.routerContract.methods.router(txData).on('transactionHash', function (hash) {
            //     console.log("Router contract response: ", hash);
            // });

            // this.routerContract.call({value: 0})(txData.data);

            // this.routerContract.eth.sendTransaction({from: …, to: …, data: TransactionData, …}).on(…);
            // web3.eth.call({from: …, to: …, data: TransactionData, …}).on(…);

        },

        _loadContract(file, web3, address) {
            if (!address) {
                address = file.address;
            }

            return new web3.eth.Contract(file.abi, address);
        },
        innerSwapRequest() {
            let requestData = {
                // chainId: this.networkId,
                chainId: 1,
                inputTokens: this.getRequestInputTokens(),
                outputTokens: this.getRequestOutputTokens(),
                gasPrice: 1000000,
                userAddr: this.account,
                slippageLimitPercent: 0.3,
                sourceBlacklist: [],
                sourceWhitelist: [],
                simulate: false,
                pathViz: false,
                disableRFQs: false
            }

            console.log("Odos request data", requestData)
            this.swapRequest(requestData);
        },

        getRequestInputTokens() {
            let test = true;
            if (test) {
                return [
                    {
                        "tokenAddress": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
                        "amount": 189000000
                    }
                ]
            }

            let inputTokens = [];
            for (let i = 0; i < this.selectedFromTokens.length; i++) {
                let token = this.selectedFromTokens[i];

                let weiMarker = this.getWeiMarker(token.decimals);
                let sum = token.decimals === 6 ? this.sumMap[token.id] * 100 + '' :  this.sumMap[token.id] + '';
                inputTokens.push({
                    tokenAddress: token.address,
                    amount: this.web3.utils.toWei(sum, weiMarker)
                })
            }
            return inputTokens;
        },
        getRequestOutputTokens() {
            let test = true;
            if (test) {
                return    [
                    {
                        "tokenAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                        "proportion": 1
                    }
                ]
            }


            let outputTokens = [];
            for (let i = 0; i < this.selectedToTokens.length; i++) {
                let token = this.selectedToTokens[i];
                outputTokens.push({
                    tokenAddress: token.address,
                    proportion: this.proportionMap[token.id]
                })
            }
            return outputTokens;
            },


    }
})
</script>

<style scoped>

</style>

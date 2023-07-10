<template>
    <div>
        <div v-if="isShow">
            <v-dialog
                    v-model="isShow"
                    width="570"
                    persistent>
                <v-card class="container_body container-body airdrop-body pt-4 px-4"
                        style="border-radius: 28px!important;">
                    <v-toolbar class="container_header container-header" flat>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="setShowFunc(false)">
                            <v-icon class="close-icon">mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-card-text>
                        <div class="tokens-container">
                            <div class="success-logo-container">
                                <img src="/assets/icon/swap/success.svg"
                                     alt="success">
                            </div>
                            <div class="success-text-container py-10">
                                You successfully swapped
                            </div>

                            <div class="success-table-info-container">
                                <div class="row">
                                    <div class="col-12 col-lg-5 col-md-5 col-sm-12">
                                        <div class="text-center">
                                            <div class="success-token-title">
                                                Swapped from
                                            </div>

                                            <div v-for="(token, index) in successData.inputTokens" :key="token.symbol"
                                                 class="success-data-item">

                                                <div>
                                                    {{$utils.formatMoney(web3.utils.fromWei((successData.txData.inputTokens[index].amount + ""), getWeiMarker(token.selectedToken.decimals)), 2)}}  {{token.selectedToken.symbol}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="!$wu.isMobile()" class="col-12 col-lg-2 col-md-2 col-sm-12">
                                        <div class="text-center" style="height: 100%;">
                                            <div class="vert-line"></div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-lg-5 col-md-5 col-sm-12">
                                        <div class="text-center">
                                            <div class="success-token-title">
                                                Swapped to
                                            </div>

                                            <div v-for="(token, index) in successData.outputTokens" :key="token.symbol"
                                                 class="success-data-item-out">
                                                <div>
                                                    {{$utils.formatMoney(web3.utils.fromWei(successData.txData.outputTokens[index].amount + "", getWeiMarker(token.selectedToken.decimals)), 2)}} {{token.selectedToken.symbol}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="successData.zksyncFeeHistory"
                                 @click="isRefundInfoOpen = !isRefundInfoOpen"
                                 class="success-gas-refund-table-info-container">
                                <div class="gas-refund-title" style="text-align: center;">
                                    Gas Refund +{{$utils.formatMoney(gasRefundPercents, 2)}}% (${{$utils.formatMoney(gasRefundInUsd, 2)}})
                                </div>

                                <div v-if="isRefundInfoOpen">
                                    <div>
                                        <div class="input-token-container">
                                            <div class="success-token-title">
                                                Gross cost
                                            </div>
                                            <div class="success-data-list">
                                               <span class="success-data-item">
                                                   {{$utils.formatMoney(successData.zksyncFeeHistory.estimateFeeInEther, 6)}} ETH
                                               </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="input-token-container">
                                            <div class="success-token-title">
                                                Refunded
                                            </div>
                                            <div class="success-data-list">
                                               <span class="success-data-item">
                                                   +{{$utils.formatMoney(refundEth, 6)}} ETH
                                               </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="input-token-container">
                                            <div class="success-token-title">
                                                Net cost
                                            </div>
                                            <div class="success-data-list">
                                               <span class="success-data-item">
                                                   -{{$utils.formatMoney(netEthCost, 6) }} ETH (${{$utils.formatMoney(netEthCost * successData.zksyncFeeHistory.ethPrice, 2)}})
                                               </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="scan-container pt-5">
                                <div @click="openOnExplorer" class="scan-title">
                                    View on Scan
                                </div>
                                <div class="scan-icon">
                                    <img src="/assets/icon/swap/scan-open.svg" alt="scan">
                                </div>
                            </div>
                        </div>

                    </v-card-text>
                </v-card>
            </v-dialog>

            <resize-observer @notify="$forceUpdate()"/>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import SelectTokenShort from "@/components/swap-module/SelectTokenShort.vue";
import SelectTokenWithSearch from "@/components/swap-module/SelectTokenWithSearch.vue";
import {mapActions, mapGetters} from "vuex";

export default defineComponent({
    name: "SuccessOdosModal",
    components: {
        SelectTokenWithSearch,
        SelectTokenShort
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        setShowFunc: {
            type: Function,
            required: true
        },

        successData: {
            type: Object,
            required: true
        },
    },
    data() {
      return {
          isRefundInfoOpen: false
      }
    },
    mounted() {
    },
    computed: {
        ...mapGetters('network', ['getParams']),
        ...mapGetters('web3', ['web3', 'getWeiMarker']),

        gasRefundPercents: function() {
            if (!this.successData) {
                return 0;
            }
            if (!this.successData.zksyncFeeHistory) {
                return 0;
            }

            return this.refundEth * 100 / this.successData.zksyncFeeHistory.estimateFeeInEther;
        },
        gasRefundInUsd: function() {
            if (!this.successData) {
                return 0;
            }
            if (!this.successData.zksyncFeeHistory) {
                return 0;
            }

            return this.refundEth * this.successData.zksyncFeeHistory.ethPrice
        },
        netEthCost: function() {
            if (!this.successData) {
                return 0;
            }
            if (!this.successData.zksyncFeeHistory) {
                return 0;
            }

            return this.successData.zksyncFeeHistory.estimateFeeInEther - (this.successData.zksyncFeeHistory.startWeiBalance - this.successData.zksyncFeeHistory.finalWeiBalance);
        },
        refundEth: function() {
            if (!this.successData) {
                return 0;
            }
            if (!this.successData.zksyncFeeHistory) {
                return 0;
            }

            return this.successData.zksyncFeeHistory.startWeiBalance - this.successData.zksyncFeeHistory.finalWeiBalance;
        }
    },
    watch: {
        isShow: function (val, oldVal) {
            if (val) {
                try {
                    this.trackClick({action: 'success_swap_view', event_category: 'Page view', event_label: 'View success swap page' });
                } catch (e) {
                    console.error("Track error:", e);
                }
            }
        }

    },
    methods: {
        ...mapActions('track', ['trackClick']),

        openOnExplorer() {
            let explorerUrl = this.getParams(this.successData.chain).explorerUrl;
            window.open(explorerUrl + `tx/${this.successData.hash}`, '_blank').focus();
        }
    }
})
</script>

<style scoped>
@media only screen and (max-width: 960px) {
    .success-text-container {
        font-size: 20px;
        line-height: 40px;
    }

    .success-table-info-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .input-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .output-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .success-text-container {
        font-size: 30px;
        line-height: 40px;
    }

    .success-table-info-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .input-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .output-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .success-text-container {
        font-size: 30px;
        line-height: 40px;
    }

    .success-table-info-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .input-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .output-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .success-text-container {
        font-size: 30px;
        line-height: 40px;
    }

    .success-table-info-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .input-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .output-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}

div {
    font-family: 'Roboto',serif;
}

.tokens-container {
    padding-top: 15px;
    padding-bottom: 15px;
}

.container-body {
    background: var(--secondary)!important;
}

.container-header {
    background: var(--secondary)!important;
}

.success-logo-container {
    text-align: center;
}

.success-text-container {
    text-align: center;
    font-style: normal;
    font-weight: 400;
    color: var(--main-gray-text);
}

.success-token-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #707A8B;
}

.success-data-item {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: var(--main-gray-text);
}

.success-data-item-out {
    font-family: Roboto;
    font-size: 16px;
    font-weight: 800;
    line-height: 24px;
    color: rgba(34, 171, 172, 1);
}

.scan-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #1C95E7;
    display: inline-block;
}

.scan-container {
    text-align: center;
    position: relative;
    cursor: pointer;
}

.scan-icon {
    position: absolute;
    top: 22px;
    padding-left: 4px;
    display: inline-block;
}

.success-table-info-container {
    margin-bottom: 15px;
}

.success-gas-refund-table-info-container {
    background: rgba(34, 171, 172, 0.08);
    padding: 10px;
    cursor: pointer;
}

.gas-refund-title {
    color: rgba(34, 171, 172, 1);
    font-weight: bold;
}

.vert-line {
    width: 1px;
    background: rgba(173, 179, 189, 1);
    height: 100%;
    margin-left: 30px;
}
</style>

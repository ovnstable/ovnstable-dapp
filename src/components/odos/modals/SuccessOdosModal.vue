<template>
    <div>
        <div v-if="isShow">
            <v-dialog
                    v-model="isShow"
                    width="650"
                    persistent>
                <v-card class="container_body container-body airdrop-body pt-4 px-4 pb-10"
                        style="border-radius: 28px!important;">
                    <v-toolbar class="container_header container-header" flat>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="setShowFunc(false)">
                            <img :src="light ? require('@/assets/icon/swap/search-close.svg') : require('@/assets/icon/light-close.svg')" alt="close icon">
                        </v-btn>
                    </v-toolbar>

                    <v-card-text>
                        <div class="tokens-container">
                            <div class="success-logo-container">
                                <img
                                    :src="require('@/assets/icon/swap/success.svg')"
                                    alt="success"
                                >
                            </div>
                            <div class="success-text-container py-10">
                                You successfully swapped
                            </div>

                            <div v-if="successData" class="success-table-info-container">
                                <div class="row">
                                    <div class="col-12 col-lg-5 col-md-5 col-sm-12">
                                        <div class="text-center">
                                            <div class="success-token-title">
                                                Swapped from
                                            </div>

                                            <div v-for="token in successData.inputTokens" :key="token.symbol"
                                                 class="success-data-item">

                                                <div v-if="getIndexOfTokenByAddress(successData.txData.inputTokens, token) != -1">
                                                    {{
                                                        $utils.formatMoney(web3.utils.fromWei((successData.txData.inputTokens[getIndexOfTokenByAddress(successData.txData.inputTokens, token)].amount + ""),
                                                        getWeiMarker(token.selectedToken.decimals)), 2)
                                                    }}
                                                    {{token.selectedToken.symbol}}
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

                                            <div v-for="token in successData.outputTokens" :key="token.symbol"
                                                 class="success-data-item-out">
                                                <div v-if="getIndexOfTokenByAddress(successData.txData.outputTokens, token) != -1">
                                                    {{
                                                        $utils.formatMoney(web3.utils.fromWei(successData.txData.outputTokens[getIndexOfTokenByAddress(successData.txData.outputTokens, token)].amount + "",
                                                        getWeiMarker(token.selectedToken.decimals)), 2)
                                                    }}
                                                    {{token.selectedToken.symbol}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="successData && successData.zksyncFeeHistory">
                                <RefundInfo :zksync-fee-history="successData.zksyncFeeHistory"></RefundInfo>
                            </div>

                            <div class="scan-container pt-5">
                                <div @click="openOnExplorer" class="scan-title">
                                    View on Scan
                                </div>
                                <div class="scan-icon">
                                    <img
                                        :src="require('@/assets/icon/swap/scan-open.svg')"
                                        alt="scan"
                                    >
                                </div>
                            </div>
                        </div>
                    </v-card-text>

                    <div v-if="!isPoolsLoading">
                        <BestAprPromotion  :pool="topPool"/>
                    </div>
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
import RefundInfo from "@/components/common/modal/RefundInfo.vue";
import { pool } from "@/components/mixins/pool";
import BestAprPromotion from "@/components/common/modal/action/component/BestAprPromotion";

export default defineComponent({
    name: "SuccessOdosModal",
    mixins: [pool],

    components: {
        RefundInfo,
        SelectTokenWithSearch,
        SelectTokenShort,
        BestAprPromotion
    },
    props: {
        viewType : {
            type: String,
            required: true
        },
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
            required: false,
        },

    },
    data() {
      return {
          isRefundInfoOpen: false
      }
    },
    mounted() {
        this.loadPools();
    },
    computed: {
        ...mapGetters('network', ['getParams']),
        ...mapGetters('web3', ['web3', 'getWeiMarker']),
        ...mapGetters("theme", ["light"]),
    },
    watch: {
        isShow: function (val, oldVal) {
            if (val) {

                try {
                    if (this.viewType === 'SWIPE') {
                        this.trackClick({action: 'success_swipe_view', event_category: 'Page view', event_label: 'View success swipe page' });
                    } else if (this.viewType === 'SWAP') {
                        this.trackClick({action: 'success_swap_view', event_category: 'Page view', event_label: 'View success swap page' });
                    } else {
                        console.log("Unknown success view type for view tracking: ", this.viewType);
                    }
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
        },
        getIndexOfTokenByAddress(listOfTokens, token) {
            return listOfTokens.findIndex((item) => {
                return item.tokenAddress.toLowerCase() === token.selectedToken.address.toLowerCase()
            })
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

@media only screen and (min-width: 1300px) {
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

.divider {
    border-top: 1px solid #ADB3BD;
}
</style>

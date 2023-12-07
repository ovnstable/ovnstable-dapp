<template>
    <div>
        <div v-if="zksyncFeeHistory"
             @click="isRefundInfoOpen = !isRefundInfoOpen"
             class="success-gas-refund-table-info-container">
            <div class="gas-refund-title">
                <div class="gas-refund-text-img-container">
                    <span>
                        Gas Refund +{{$utils.formatMoney(gasRefundPercents, 2)}}% (${{$utils.formatMoney(gasRefundInUsd, 2)}})
                        <img
                            :class="isRefundInfoOpen ? 'gas-refund-arrow-revert' : ''"
                            :src="require('@/assets/icon/swap/gas-refund-arrow.svg')"
                            alt="change-swap"
                            class="swap-refund-img">
                    </span>
                </div>

            </div>

            <div v-if="isRefundInfoOpen">
                <div>
                    <div class="input-token-container">
                        <div class="success-token-title">
                            Gross cost
                        </div>
                        <div class="success-data-list">
                           <span class="success-data-item">
                               {{$utils.formatMoney(zksyncFeeHistory.estimateFeeInEther, 6)}} ETH
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
                               -{{$utils.formatMoney(netEthCost, 6) }} ETH (${{$utils.formatMoney(netEthCost * zksyncFeeHistory.ethPrice, 2)}})
                           </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "RefundInfo",
    props: ['zksyncFeeHistory'],
    data: () => ({
        isRefundInfoOpen: false,
    }),
    computed: {
        gasRefundPercents: function() {
            if (!this.zksyncFeeHistory) {
                return 0;
            }

            return this.refundEth * 100 / this.zksyncFeeHistory.estimateFeeInEther;
        },
        gasRefundInUsd: function() {
            if (!this.zksyncFeeHistory) {
                return 0;
            }

            return this.refundEth * this.zksyncFeeHistory.ethPrice
        },
        netEthCost: function() {
            if (!this.zksyncFeeHistory) {
                return 0;
            }

            return this.zksyncFeeHistory.estimateFeeInEther - (this.zksyncFeeHistory.startWeiBalance - this.zksyncFeeHistory.finalWeiBalance);
        },
        refundEth: function() {
            if (!this.zksyncFeeHistory) {
                return 0;
            }

            return this.zksyncFeeHistory.startWeiBalance - this.zksyncFeeHistory.finalWeiBalance;
        },
    },
}
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
    text-align: center;
    position: relative;
}

.vert-line {
    width: 1px;
    background: rgba(173, 179, 189, 1);
    height: 100%;
    margin-left: 30px;
}

.swap-refund-img {
    position: absolute;
}

.gas-refund-text-img-container {
    position: relative;
}

.gas-refund-arrow-revert {
    transform: rotate(180deg);
}
</style>

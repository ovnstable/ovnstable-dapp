<template>
    <div>
        <div class="input-container">
            <div class="input-data-container">
                <div class="row">
                    <div class="col-7">
                        <input
                               v-model="token.value"
                               type="text"
                               @keypress="isNumber($event)"
                               placeholder="0"
                               @input="inputUpdate(token.value)"
                               class="input-style"/>
                    </div>
                    <div class="col-5 selected-image-right">
                        <div v-if="token.selectedToken"
                             @click="selectTokenFunc(token)"
                             class="selected-token-container">
                            <div>
                                <div class="selected-token-item-img">
                                    <img :src="token.selectedToken.logoUrl"
                                         class="selected-token"
                                         alt="select-token">
                                </div>
                                <div class="selected-token-item-text">
                                    {{token.selectedToken.symbol}}
                                </div>
                                <div class="select-token-with-token-item-img">
                                    <img :src="require('@/assets/icon/swap/token-select-closed.svg')" alt="select-token">
                                </div>
                            </div>
                        </div>
                        <div v-else
                             @click="selectTokenFunc(token)"
                             class="select-token-container">
                            <div class="select-token-item-text">
                                Select token
                            </div>
                            <div class="select-token-item-img">
                                <img :src="require('@/assets/icon/swap/token-select-closed.svg')" alt="select-token">
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="isTokenRemovable" class="remove-container">
                    <div @click="removeItemFunc(tokenInfo.id)" class="remove-button">
                        <img :src="require('@/assets/icon/swap/remove-token.svg')" alt="remove-token">
                    </div>
                </div>
            </div>
            <div class="founds-container">
                <div class="row">
                    <div class="col-6">
                       <div class="usd-equal-text">
                           <div v-if="token.value && token.selectedToken && token.selectedToken.balanceData.balance">
                              ~ ${{$utils.formatMoney(token.usdValue, 2)}}
                           </div>
                           <div v-else-if="token.value && token.selectedToken">
                               ~ ${{$utils.formatMoney(token.usdValue, 2)}}
                           </div>
                           <div v-else>
                               $0
                           </div>
                       </div>
                    </div>
                    <div class="col-6 text-right">
                        <div @click="clickOnBalance()" class="select-token-balance-container">
                            <div v-if="token.selectedToken && token.selectedToken.balanceData.balance"
                                 class="select-token-balance-img">
                                <img :src="require('@/assets/icon/swap/wallet-active.svg')" alt="select-token">
                            </div>
                            <div v-else class="select-token-balance-img">
                                <img :src="require('@/assets/icon/swap/wallet.svg')" alt="select-token">
                            </div>
                            <div class="select-token-balance-text">
                                <div v-if="token.selectedToken && token.selectedToken.balanceData.balance">
                                    <span class="select-token-balance-text-enabled">
                                        {{$utils.formatMoney(token.selectedToken.balanceData.balance, 2)}}
                                    </span>
                                </div>
                                <div v-else>
                                    00.<span class="numeric-change numeric-blue">00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import PathView from "@/components/swap-module/PathView";

export default defineComponent({
    name: "InputToken",
    components: { PathView },
    props: [
        'tokenInfo',
        'removeItemFunc',
        'isTokenRemovable',
        'selectTokenFunc',
        'updateTokenValueFunc',
    ],
    mounted() {
        this.token.selectedToken = this.tokenInfo.selectedToken;
    },
    data() {
        return {
            token: {
                value: null,
                usdValue: null,
                selectedToken: null,
            }
        }
    },
    watch: {
        'tokenInfo.value'(val, oldVal) {
            if (val) {
                this.token.value = val
            }
        },
        'tokenInfo.usdValue'(val, oldVal) {
            if (val) {
                this.token.usdValue = val
            }
        }
    },
    methods: {
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            let charCode = (evt.which) ? evt.which : evt.keyCode;

            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                if (charCode === 46 && (!this.token.value || this.token.value.includes('.'))) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            }
        },
        inputUpdate(value) {
           /* if (this.token.selectedToken) {
                if (value*1 > this.token.selectedToken.balanceData.balance*1) {
                    value = this.$utils.formatMoney(this.token.selectedToken.balanceData.balance*1, 6);
                    this.token.value = value;
                }
            }*/

            this.updateTokenValueFunc(this.tokenInfo, value)
        },
        clickOnBalance() {
            if (this.token.selectedToken && this.token.selectedToken.balanceData.balance) {
                this.token.value = this.token.selectedToken.balanceData.balance
                this.inputUpdate(this.token.value);
            }
        }
    }
})
</script>

<style scoped>
@media only screen and (max-width: 960px) {
    .select-token-item-text {
        font-size: 16px;
        line-height: 24px;
    }

    .selected-token-item-text {
        font-size: 16px;
        line-height: 24px;
    }

    .select-token-balance-text {
        font-size: 16px;
        line-height: 24px;
    }

    .usd-equal-text {
        font-size: 16px;
        line-height: 28px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .select-token-item-text {
        font-size: 18px;
        line-height: 24px;
    }

    .selected-token-item-text {
        font-size: 18px;
        line-height: 24px;
    }

    .select-token-balance-text {
        font-size: 18px;
        line-height: 28px;
    }

    .usd-equal-text {
        font-size: 18px;
        line-height: 28px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .select-token-item-text {
        font-size: 18px;
        line-height: 24px;
    }

    .selected-token-item-text {
        font-size: 18px;
        line-height: 24px;
    }

    .select-token-balance-text {
        font-size: 18px;
        line-height: 28px;
    }

    .usd-equal-text {
        font-size: 18px;
        line-height: 28px;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .select-token-item-text {
        font-size: 18px;
        line-height: 24px;
    }

    .selected-token-item-text {
        font-size: 18px;
        line-height: 24px;
    }

    .select-token-balance-text {
        font-size: 18px;
        line-height: 28px;
    }


    .usd-equal-text {
        font-size: 18px;
        line-height: 28px;
    }
}

div {
    font-family: 'Roboto',serif;
}

.input-container {

    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;

    background: var(--swap-input-placeholder);
    border-radius: 20px;
}

.input-data-container {
    position: relative;
}

.founds-container {
}

.select-token-container {
    position: absolute;
    padding: 12px;
    background: var(--swap-select-token);
    border-radius: 40px;
    cursor: pointer;
}

.selected-token-container {
    position: absolute;
    padding: 12px;
    background: var(--swap-select-token);
    border-radius: 40px;
    cursor: pointer;
}

.select-token-item-text {
    display: inline-block;
    font-style: normal;
    font-weight: 600;
    color: var(--main-gray-text);
    margin-right: 15px;
}

.selected-token-item-text {
    display: inline-block;
    font-style: normal;
    font-weight: 600;
    color: var(--main-gray-text);
    margin-right: 15px;
    padding-left: 30px;
}

.select-token-item-img {
    position: absolute;
    right: 0;
    top: 12px;
}

.select-token-with-token-item-img {
    position: absolute;
    right: 0;
    top: 12px;
}
.selected-token-item-img {
    display: inline-block;
    position: absolute;
    top: 8px;
    left: 8px;
}

.select-token-balance-container {
    text-align: end;
    position: relative;
    cursor: pointer;
    display: inline-flex
}

.select-token-balance-text {
    font-style: normal;
    font-weight: 500;
    color: #1C95E7;
    padding-left: 2px;
}

.select-token-balance-text-enabled {
    color: #1C95E7;
}

.select-token-balance-img {
}

.input-style {
    border:none;
    background: transparent;
    outline: 0;

    max-width: 100%;

    color: var(--main-gray-text);

    font-style: normal;
    font-weight: 400;
    font-size: 40px;
    line-height: 48px;

}

.input-style::placeholder {
    color: #C5C9D1;
}

.usd-equal-text {
    font-style: normal;
    font-weight: 500;
    color: #707A8B;
}

.numeric-change {
    font-size: 14px;
}

.numeric-blue {
    color: var(--links-blue);
}

.remove-container {
    position: absolute;
    top: 10px;
    right: -10px;
    cursor: pointer;
}

.selected-token {
    height: 32px;
    width: 32px;
}

.selected-image-right {
    display: flex;
    justify-content: flex-end;
    padding-right: 25px;
}
</style>

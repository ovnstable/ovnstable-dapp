<template>
    <div>
        <div class="input-container">
            <div class="input-data-container">
                <div class="row">
                    <div class="col-7">
                        <div>
                            <input
                                    disabled
                                    v-model="tokenInfo.sum"
                                    type="text"
                                    placeholder="0"
                                    class="input-style"/>
                        </div>
                    </div>
                    <div class="col-5 selected-image-right">
                        <div v-if="token.selectedToken"
                             @click="() => isDisableSelect ? () => {} : selectTokenFunc(token)"
                             :class="isDisableSelect ? 'selected-token-container-disable-select' : ''"
                             class="selected-token-container">
                            <div>
                                <div class="selected-token-item-img">
                                    <img :src="token.selectedToken.logoUrl"
                                         class="selected-token"
                                         alt="select-token">
                                </div>
                                <div :class="isDisableSelect ? 'selected-token-item-text-disable-select' : ''"
                                     class="selected-token-item-text">
                                    {{token.selectedToken.symbol}}
                                </div>
                                <div v-if="!isDisableSelect" class="select-token-with-token-item-img">
                                    <img
                                        :src="require('@/assets/icon/swap/token-select-closed.svg')"
                                        alt="select-token"
                                    >
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
                                <img
                                    :src="require('@/assets/icon/swap/token-select-closed.svg')"
                                    alt="select-token"
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="isTokenRemovable" class="remove-container">
                    <div @click="removeItemFunc(tokenInfo.id)" class="remove-button">
                        <img
                            :src="require('@/assets/icon/swap/remove-token.svg')"
                            alt="remove-token"
                        >
                    </div>
                </div>
            </div>
            <div class="founds-container">
                <div class="row">
                    <div class="col-6">
                        <div class="usd-equal-text">
                            <div v-if="token.selectedToken && token.selectedToken.balanceData.balance">
                                ~
                                ${{ $utils.formatMoney((tokenInfo.sum ? tokenInfo.sum.replaceAll(' ', '') : 0) * 1 * token.selectedToken.price, 2) }}
                            </div>
                            <div v-else-if="token.selectedToken">
                                ~
                                ${{ $utils.formatMoney((tokenInfo.sum ? tokenInfo.sum.replaceAll(' ', '') : 0) * 1 * token.selectedToken.price, 2) }}
                            </div>
                            <div v-else>
                                $00.<span class="numeric-change">00</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 text-right">
                        <div class="select-token-balance-container">
                            <div class="select-token-balance-img">
                                <img :src="require('@/assets/icon/swap/wallet.svg')" alt="select-token">
                            </div>
                            <div class="select-token-balance-text">
                                <div v-if="token.selectedToken && token.selectedToken.balanceData.balance">
                                    {{$utils.formatMoney(token.selectedToken.balanceData.balance, 2)}}
                                </div>
                                <div v-else>
                                    00.<span class="numeric-change">00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="!isTokenWithoutSlider" class="slider-container">
              <div>
                  <div class="slider-item-container">
                      <Slider
                          :update-slider-value-func="updateSliderValue"
                          :token-info="tokenInfo"
                          :free-output-tokens-percentage="freeOutputTokensPercentage"
                          :is-token-without-line-slider="isTokenWithoutLineSlider"
                      />
                  </div>
                  <div class="lock-container">
                      <div v-if="tokenInfo.locked"
                           @click="lockProportionFunc(false, tokenInfo)">
                          <img :src="require('@/assets/icon/swap/proportion-lock-close.svg')" alt="select-token">
                      </div>
                      <div v-else
                           @click="lockProportionFunc(true, tokenInfo)">
                          <img :src="require('@/assets/icon/swap/proportion-lock-open.svg')" alt="select-token">
                      </div>
                  </div>

              </div>
            </div>
        </div>

    </div>
</template>

<script>
import {defineComponent} from 'vue'
import Slider from "@/components/swap-module/Slider.vue";

export default defineComponent({
    name: "OutputToken",
    components: {Slider},
    props: [
        'tokenInfo',
        'swapMethod',
        'removeItemFunc',
        'isTokenRemovable',
        'isTokenWithoutSlider',
        'isTokenWithoutLineSlider',
        'lockProportionFunc',
        'updateSliderValueFunc',
        'selectTokenFunc',
        'isDisableSelect',
        'isTokensPricesLoading',
        'freeOutputTokensPercentage'
    ],
    data() {
        return {
            token: {
                proportion: null,
                selectedToken: null,
            }
        }
    },
    mounted() {
        this.token.selectedToken = this.tokenInfo.selectedToken;
    },
    methods: {
        updateSliderValue(tokenInfo, value) {
            this.updateSliderValueFunc(tokenInfo, value);
        },
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
    padding: 12px 20px;
    border: 2px solid var(--swap-output-border);
    border-radius: 20px;
}

.input-data-container {
    position: relative;
}

.founds-container {
}

.select-token-container {
    position: absolute;

    padding: 8px;
    border: 2px solid var(--swap-output-border);
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

.selected-token-container-disable-select {
    position: absolute;
    padding: 12px;
    border: 2px solid var(--card-coin-background);
    background: transparent !important;
    border-radius: 40px;
    cursor: default!important;
}



.select-token-item-text {
    display: inline-block;
    font-weight: 700;
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

.selected-token-item-text-disable-select {
    margin-right: 0 !important;
}


.select-token-item-img {
    position: absolute;
    right: 0;
    top: 8px;
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
    display: inline-flex;
}

.select-token-balance-text {
    font-style: normal;
    font-weight: 500;
    color: var(--links-blue);
    padding-left: 2px;
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

.remove-container {
    position: absolute;
    top: 10px;
    right: -10px;
    cursor: pointer;
}

.slider-container {
    padding-top: 14px;
}


.slider-item-container {
    display: inline-block;
    width: 95%;
}

.lock-container {
    cursor: pointer;
    display: inline-block;
    width: 5%;
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

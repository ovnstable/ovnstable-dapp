<template>
    <div>
        <div class="input-container">
            <div class="input-data-container">
                <div class="row">
                    <div class="col-7">
                        <input
                                disabled
                                v-model="token.value"
                                type="text"
                                placeholder="0"
                                class="input-style"/>
                    </div>
                    <div class="col-5">
                        <div v-if="token.selectedToken"
                             @click="selectTokenFunc(token)"
                             class="select-token-container">
                            <div class="selected-token-item-img">
                                <img :src="token.selectedToken.logo" alt="select-token">
                            </div>
                            <div class="select-token-item-text">
                                {{token.selectedToken.symbol}}
                            </div>
                        </div>
                        <div v-else
                             @click="selectTokenFunc(token)"
                             class="select-token-container">
                            <div class="select-token-item-text">
                                Select token
                            </div>
                            <div class="select-token-item-img">
                                <img src="/assets/icon/swap/token-select-closed.svg" alt="select-token">
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="isTokenRemovable" class="remove-container">
                    <div @click="removeItemFunc(tokenInfo.id)" class="remove-button">
                        <img src="/assets/icon/swap/remove-token.svg" alt="remove-token">
                    </div>
                </div>
            </div>
            <div class="founds-container">
                <div class="row">
                    <div class="col-6">
                        <div class="usd-equal-text">
                            <div v-if="token.selectedToken">
                                {{token.selectedToken.price}}
                            </div>
                            <div v-else>
                                $00.<span class="numeric-change">00</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="select-token-balance-container">
                            <div class="select-token-balance-img">
                                <img src="/assets/icon/swap/wallet.svg" alt="select-token">
                            </div>
                            <div class="select-token-balance-text">
                                00.<span class="numeric-change">00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="slider-container">
              <div>
                  <div class="slider-item-container">
                      <Slider
                              :update-slider-value-func="updateSliderValue"
                              :token-info="tokenInfo"
                              :value="40"
                              :model-value="tokenInfo.value"/>
                  </div>
                  <div v-if="tokenInfo.locked"
                       @click="lockProportionFunc(false, tokenInfo)"
                       class="lock-container">
                      <img src="/assets/icon/swap/proportion-lock-open.svg" alt="select-token">
                  </div>
                  <div v-else
                       @click="lockProportionFunc(true, tokenInfo)"
                       class="lock-container">
                      <img src="/assets/icon/swap/proportion-lock-close.svg" alt="select-token">
                  </div>
              </div>
            </div>
        </div>

    </div>
</template>

<script>
import {defineComponent} from 'vue'
import Slider from "@/components/odos/Slider.vue";
import SelectTokensModal from "@/components/odos/modals/SelectTokensModal.vue";

export default defineComponent({
    name: "OutputToken",
    components: {Slider},
    props: [
        'tokenInfo',
        'removeItemFunc',
        'isTokenRemovable',
        'lockProportionFunc',
        'updateSliderValueFunc',
        'selectTokenFunc',
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

    },
    methods: {
        updateSliderValue(tokenInfo, value) {
            this.updateSliderValueFunc(tokenInfo, value);
        },
    }
})
</script>

<style scoped>

div {
    font-family: 'Roboto',serif;
}

.input-container {
    padding: 12px 20px;
    border: 2px solid #F5F5F5;
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
    border: 2px solid #F5F5F5;
    border-radius: 40px;

    cursor: pointer;
}

.select-token-item-text {
    display: inline-block;
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: #29323E;
    margin-right: 15px;
}

.select-token-item-img {
    position: absolute;
    right: 0;
    top: 10px;
}

.selected-token-item-img {
    position: absolute;
    left: 0;
    top: 10px;
}

.select-token-balance-container {
    text-align: end;
    position: relative;
    cursor: pointer;
}

.select-token-balance-text {
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    color: #707A8B;
}

.select-token-balance-img {
    position: absolute;
    right: 45px;
    top: 2px;
}

.input-style {
    border:none;
    background: transparent;
    outline: 0;

    max-width: 100%;

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
    font-size: 18px;
    line-height: 28px;
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

</style>

<template>
    <div>
        <div class="input-container">
            <div class="input-data-container">
                <div class="row">
                    <div class="col-7">
                        <input
                               v-model="token.value"
                               type="text"
                               placeholder="0"
                               class="input-style"/>
                    </div>
                    <div class="col-5">
                        <div v-if="token.selectedToken" class="select-token-container">
                            <div class="selected-token-item-img">
                                <img :src="token.selectedToken.logo" alt="select-token">
                            </div>
                            <div class="select-token-item-text">
                                {{token.selectedToken.symbol}}
                            </div>
                        </div>
                        <div v-else class="select-token-container">
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
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "InputToken",
    props: ['tokenInfo', 'removeItemFunc', 'isTokenRemovable'],
    data() {
        return {
            token: {
                value: null,
                selectedToken: null,
            }
        }
    }
})
</script>

<style scoped>

div {
    font-family: 'Roboto',serif;
}

.input-container {

    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;

    background: #F5F5F5;
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
    background: #E5E7EA;
    border-radius: 40px;
    cursor: pointer;
}

.select-token-item-text {
    display: inline-block;
    font-style: normal;
    font-weight: 600;
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
</style>

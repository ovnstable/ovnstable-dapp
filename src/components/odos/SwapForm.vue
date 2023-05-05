<template>
    <div>
        <div class="swap-container">
            <div class="swap-header">
                <div class="swap-settings">
                    <img src="/assets/icon/swap/settings.svg" alt="settings">
                </div>
            </div>

            <div class="swap-body">
                <div>
                    <div class="input-swap-container">
                        <div class="swap-title pb-2">
                            Swap from
                        </div>
                        <div v-for="token in inputTokens" :key="token.id" class="input-component-container">
                            <InputToken
                                    :token-info="token"
                                    :remove-item-func="removeInputToken"
                                    :is-token-removable="isInputTokensRemovable"
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
                            Swap to Overnight
                        </div>
                        <div v-for="token in outputTokens" :key="token.id" class="input-component-container">
                            <OutputToken
                                    :token-info="token"
                                    :remove-item-func="removeOutputToken"
                                    :is-token-removable="isOutputTokensRemovable"
                                    :lock-proportion-func="lockProportion"
                                    :update-slider-value-func="updateSliderValue"
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
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import InputToken from "@/components/odos/InputToken.vue";
import OutputToken from "@/components/odos/OutputToken.vue";

export default defineComponent({
    name: "SwapForm",
    components: {
        InputToken,
        OutputToken
    },
    mounted() {
        this.addNewInputToken();
        this.addNewOutputToken();
    },
    data() {
        return {
            inputTokens: [],
            outputTokens: [],
            maxInputTokens: 6,
            maxOutputTokens: 6,
        }
    },
    computed: {
      isInputTokensRemovable() {
          return this.inputTokens.length > 1;
      },

      isOutputTokensRemovable() {
          return this.outputTokens.length > 1;
      },

      isInputTokensAddAvailable() {
          return this.inputTokens.length < this.maxInputTokens;
      },

      isOutputTokensAddAvailable() {
          return this.outputTokens.length < this.maxOutputTokens;
      },
    },
    methods: {
        addNewOutputToken() {
            this.outputTokens.push(this.getNewOutputTokens());
        },
        removeOutputToken(id) {
            this.removeToken(this.outputTokens, id)
        },
        addNewInputToken() {
            this.inputTokens.push(this.getNewInputTokens());
        },
        removeInputToken(id) {
            this.removeToken(this.inputTokens, id)
        },
        removeToken(tokens, id) {
            const index = tokens.findIndex(item => item.id === id);
            if (index !== -1) {
                tokens.splice(index, 1);
            }
        },
        getNewInputTokens() {
            let randomId = (Math.random() + 1).toString(36).substring(7);
            return {
                id: randomId,
                value: null,
            }
        },
        getNewOutputTokens() {
            let randomId = (Math.random() + 1).toString(36).substring(7);
            return {
                id: randomId,
                value: 0,
                locked: false
            }
        },

        maxAll() {
            console.log("Max all");
        },
        changeSwap() {
            console.log("Change swap");
        },
        resetOutputs() {
            console.log("Reset outputs");
        },
        swap() {
            console.log("Swap");
        },



        lockProportion(isLock, token) {
            console.log("lockProportionFunc", isLock, token);
            token.locked = isLock
        },
        updateSliderValue(token, value) {
            console.log("Swap form", token.id, value, !this.isSlidersOutOfLimit());
            let oldTokenValue = token.value;
            token.value = value;

            if(!this.isSlidersOutOfLimit()) {
                if (oldTokenValue > value) {
                    this.subTokensProportions(token, 100 - value)
                } else {
                    this.addTokensProportions(token, 100 - value)
                }
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

           /* while (lostPercents > 0) {
                if (countOfNull === tokens.length) {
                    console.log("All tokens is nullable")
                    break
                }

                countOfNull = 0;
                for (let i = 0; i < tokens.length; i++) {
                    let token = tokens[i];
                    if (token.value <= 0) {
                        token.value = 0;
                        countOfNull++
                        continue
                    }

                    token.value--
                    lostPercents--;
                    console.log('token: ', token, token.id, token.value)
                    console.log('lostPercents: ', lostPercents)
                    if (lostPercents <= 0) break;
                }
            }*/
            // for (let i = lostPercents; i > 0; i--) {

            // }

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

            this.calculateProportions(tokens, proportion)
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
            for (let i = 0; i < proportion; i++) {
                for (let i = 0; i < tokens.length; i++) {
                    let token = tokens[i];
                    token.value++
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
}

.swap-header {
}

.swap-settings {
    text-align: end;
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

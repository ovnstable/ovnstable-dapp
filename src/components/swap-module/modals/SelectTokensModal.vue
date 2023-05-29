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
                        <div v-if="isOvnSwap">
                            <label v-if="selectTokenType === 'OVERNIGHT'" class="title-container">
                                Select Overnight tokens
                            </label>
                            <label v-else class="title-container">
                                Select non-Overnight tokens
                            </label>
                        </div>
                        <div v-else>
                            <label class="title-container">
                                Select tokens
                            </label>
                        </div>

                        <v-spacer></v-spacer>
                        <v-btn icon @click="setShowFunc(false)">
                            <v-icon class="close-icon">mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-card-text>
                        <div class="tokens-container">
                            <div v-if="!isAllDataLoaded" class="pt-7 pb-7 cards-list-container">
                                <div class="row">
                                    <v-row align="center" justify="center">
                                        <v-progress-circular
                                                width="2"
                                                size="24"
                                                color="#8FA2B7"
                                                indeterminate
                                        ></v-progress-circular>
                                    </v-row>
                                </div>
                            </div>

                            <div v-else>
                                <div v-if="selectTokenType === 'OVERNIGHT'">
                                    <SelectTokenShort
                                            :tokens="secondTokens"
                                            :select-token-func="selectToken"
                                            :remove-token-func="removeToken"
                                    />
                                </div>
                                <div v-else-if="selectTokenType === 'ALL'">
                                    <SelectTokenWithSearch
                                            :tokens="tokens"
                                            :select-token-func="selectToken"
                                            :remove-token-func="removeToken"/>
                                </div>
                                <div v-else>
                                    select token component not found by type: {{selectTokenType}}
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

export default defineComponent({
    name: "SelectTokensModal",
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

        swapMethod: {
            type: String,
            required: true
        },
        selectTokenType: {
            type: String,
            required: true
        },


        removeSelectedTokenFromListFunc: {
            type: Function,
            required: true
        },

        addSelectedTokenToListFunc: {
            type: Function,
            required: true
        },

        secondTokens: {
            type: Array,
            required: true
        },

        tokens: {
            type: Array,
            required: true
        },

        isAllDataLoaded: {
            type: Boolean,
            required: true
        },

        isOvnSwap: {
            type: Boolean,
            required: true,
        }
    },
    data() {
      return {
          selectedTokensFromAddresses: [],
          selectedTokensToAddresses: [],
      }
    },
    mounted() {

    },
    computed: {

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
                return this.secondTokens;
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
                return this.secondTokens;
            } else {
                console.error("Odos Swap method not found.", this.swapMethod)
            }
        }
    },
    watch: {

    },
    methods: {

        selectToken(token) {
            token.selected = true
            console.log("Token select: ", token, this.swapMethod, this.selectTokenType)
            this.addSelectedTokenToListFunc(token, this.swapMethod, this.selectTokenType);
        },
        removeToken(token) {
            token.selected = false
            console.log("Token remove: ", token, this.swapMethod, this.selectTokenType)
            this.removeSelectedTokenFromListFunc(token, this.swapMethod, this.selectTokenType);
        }
    }
})
</script>

<style scoped>
@media only screen and (max-width: 960px) {
    .title-container {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 40px;
        color: var(--main-gray-text);
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .title-container {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 40px;
        color: var(--main-gray-text);
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .title-container {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 40px;
        color: var(--main-gray-text);
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .title-container {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 40px;
        color: var(--main-gray-text);
    }
}

div {
    font-family: 'Roboto',serif;
}

.tokens-container {
    padding-top: 15px;
    padding-bottom: 15px;
}

.title-container {
    font-style: normal;
    font-weight: 400;
    color: var(--main-gray-text);
}

.container-body {
    background: var(--secondary)!important;
}

.container-header {
    background: var(--secondary)!important;
}
</style>

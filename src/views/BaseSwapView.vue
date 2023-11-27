<template>
    <div>
        <div class="page-container">
            <div class="mt-10">
                <label v-if="viewType === 'SWAP'" class="title-label">SWAP</label>
                <label v-else-if="viewType === 'SWIPE'" class="title-label">SWIPE</label>
                <label v-else class="title-label">SWAP</label>
            </div>

            <v-row v-if="viewType === 'SWIPE'">
                <div class="mb-20" style="height: 20px"></div>
            </v-row>
            <v-row v-else align="start" justify="start" class="ma-0 mt-5 mb-5 toggle-row">
                <label class="tab-btn mr-4 tab-button">SWAP</label>

                <label @click="mintAction()"
                        class="tab-btn tab-btn-disabled mx-4"
                       style="cursor: pointer"
                       disabled>Mint/Redeem v. 1.0</label>
                <v-spacer></v-spacer>
            </v-row>

            <div class="pt-20">
                <div class="row">
                    <div class="col-lg-5 col-md-6 col-sm-12">
                        <SwapForm
                                :view-type="viewType"
                                :update-path-view-func="updatePathView"
                                :update-button-disabled-func="updateButtonDisabled"
                                :update-is-loading-data-func="updateIsLoadingData"
                                :handle-form-reset-func="handleFormReset"
                                :update-stablecoins-list-func="updateStablecoinsList"/>
                    </div>
                    <div v-if="viewType === 'SWIPE'"
                         class="col-lg-7 col-md-7 col-sm-12">
                        <SwipeDetalization v-if="account" :stablecoin-tokens="stablecoinTokens"/>
                        <SwipeInformation v-else/>
                    </div>
                    <div v-else
                         class="col-lg-7 col-md-7 col-sm-12">
                        <div v-if="isFirstInitializationForPath">
                            <SwapInformation/>
                        </div>
                        <div v-else>
                            <PathView :path-object="pathViz"
                                      :input-tokens="inputTokens"
                                      :output-tokens="outputTokens"
                                      :is-loading-data="isLoadingData"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import SwapForm from "@/components/odos/SwapForm.vue";
import SwapInformation from "@/components/swap-module/SwapInformation.vue";
import {mapActions, mapGetters} from "vuex";
import PathView from "@/components/swap-module/PathView.vue";
import SwipeDetalization from "@/components/swap-module/swipe/SwipeDetalization.vue";
import SwipeInformation from "@/components/swap-module/swipe/SwipeInformation.vue";

export default defineComponent({
    name: "BaseSwapView",
    components: {
        SwipeDetalization,
        SwipeInformation,
        PathView,
        SwapInformation,
        SwapForm
    },
    props: {
      viewType : {
        type: String,
        default: 'SWAP'
      },
    },
    data() {
        return {
            pathViz: null,
            inputTokens: [],
            outputTokens: [],
            buttonDisabled: true,
            isLoadingData: true,
            isFirstInitializationForPath: true,
            stablecoinTokens: []
        }
    },
    mounted() {
    },

    computed: {
        ...mapGetters('accountData', ['account']),
    },
    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },
        updatePathView(path, inputTokens, outputTokens) {
            this.pathViz = path;
            this.inputTokens = inputTokens;
            this.outputTokens = outputTokens;
            this.isFirstInitializationForPath = false;
        },
        handleFormReset() {
            this.isFirstInitializationForPath = true; // Set to true when SwapForm is reset
        },
        updateButtonDisabled(value) {
            this.buttonDisabled = value
        },
        updateIsLoadingData(value) {
            this.isLoadingData = value
        },
        updateStablecoinsList(stablecoinTokens) {
            this.stablecoinTokens = stablecoinTokens;
        }
    }
})
</script>

<style scoped>
@media only screen and (max-width: 960px) {
    .title-label {
        font-size: 32px;
        line-height: 40px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .title-label {
        font-size: 54px;
        line-height: 60px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .title-label {
        font-size: 54px;
        line-height: 60px;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .title-label {
        font-size: 54px;
        line-height: 60px;
    }
}

.title-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;

    color: var(--main-gray-text);

    padding-bottom: 28px;
}


.tab-button-in-active {
    color: var(--secondary-gray-text) !important;
    cursor: default;
}

.tab-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer;
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
    /* //width: 200% !important; */
    color: var(--main-gray-text);
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}
</style>

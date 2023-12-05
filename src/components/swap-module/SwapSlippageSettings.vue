
<template>
    <div>
        <div>
            <div>
                <div>
                    <div class="tokens-container">

                        <div class="row">
                            <div class="col-12 col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                <div class="sub-title">
                                    <div style="position:relative;">
                                        Slippage Tolerance
                                        <div class="sub-title-icon">
                                            <v-tooltip
                                                color="var(--tooltip-bg)"
                                                min-width="50px"
                                                min-height="50px"
                                                right
                                            >
                                                <template v-slot:activator="{on, attrs}">
                                                    <div :style="{width: 50 + 'px', height: 30 + 'px'}"
                                                         v-bind="attrs"
                                                         v-on="on">
                                                        <img v-if="light" :src="require('@/assets/icon/swap/slippage-tolerance-info.svg')" alt="?">
                                                        <img v-else :src="require('@/assets/icon/swap/slippage-tolerance-info-dark.svg')" alt="?">
                                                    </div>
                                                </template>

                                                <div style="color: var(--main-gray-text);">
                                                    <div>
                                                        <span style="font-weight: bold">0.05% – Low.</span> Recommended
                                                        <div>
                                                            for stablecoins only.
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span style="font-weight: bold">0.1% – Medium</span> Recommended
                                                        <div>
                                                            for mix of stablecoins and volatile
                                                        </div>
                                                        <div>
                                                            assets.
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span style="font-weight: bold">1% – High.</span> Recommended
                                                        <div>
                                                           for volatile assets
                                                        </div>
                                                    </div>
                                                </div>
                                            </v-tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-xl-9 col-lg-9 col-md-9 col-sm-12">
                                <div class="slippage-container">
                                    <div v-for="setting in slippageSettings" :key="setting.id"
                                         @click="newSlippageSetting(setting)"
                                            class="slippage-item-container">
                                        <div :class="currentSlippage && currentSlippage.type === setting.type  ? 'slippage-item-selected' : ''"
                                             class="slippage-item">
                                            <div
                                                :class="setting.type === 'AUTO' ? 'auto-value' : ''"
                                                class="slippage-value">
                                                {{setting.value}}% <span v-if="setting.type === 'AUTO'" class="auto-message">(auto)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="currentSlippage" class="warn-message-container">
                                        <div class="warn-message">
                                            {{currentSlippage.info}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <resize-observer @notify="$forceUpdate()"/>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {mapGetters} from "vuex";

export default defineComponent({
    name: "SwapSlippageSettings",
    props: {
        currentSlippageChanged: {
            type: Function,
            required: true
        },
        selectedInputTokens: {
            type: Array,
            required: true
        },
        selectedOutputTokens: {
            type: Array,
            required: true
        },
    },
    data() {
        return {
            currentSlippage: null,
            slippageSettings: [
                {id: 4, type: "AUTO", name: 'Auto', value: 0.1, info: 'Automatic selection by current tokens'},
                {id: 2, type: "LOW", name: 'Low', value: 0.05, info: 'For stablecoins only'},
                {id: 3, type: "MEDIUM", name: 'Medium', value: 0.5, info: 'For mix of stablecoins and volatile assets'},
                {id: 1, type: "HIGH", name: 'High', value: 1, info: 'For volatile assets'},
            ]
        }
    },
    mounted() {
        // auto
        this.autoUpdateSlippage();
    },
    computed: {
        ...mapGetters('theme', ['light']),

        isAnyNonStablecoinSelected() {
            return this.selectedInputTokens.some(token => token.selectedToken.assetType !== 'usd') ||
                this.selectedOutputTokens.some(token => token.selectedToken.assetType !== 'usd');
        }

    },
    watch: {
        isAnyNonStablecoinSelected: {
            handler: function (val) {
                this.autoUpdateSlippage();
            },
            immediate: true
        }
    },
    methods: {
        newSlippageSetting(setting) {
            this.currentSlippage = setting;
            // Emit an event when currentSlippage changes
            this.currentSlippageChanged(this.currentSlippage);
        },
        // method get setting by id
        getSlippageSettingById(id) {
            return this.slippageSettings.find(setting => setting.id === id);
        },
        autoUpdateSlippage() {
            if (this.isAnyNonStablecoinSelected) {
                let updatedValue = this.getSlippageSettingById(3);
                let auto = this.getSlippageSettingById(4);
                auto.value = updatedValue.value;
                this.newSlippageSetting(auto);
                return;
            }

            let auto = this.getSlippageSettingById(4);
            auto.value = 0.1
            this.newSlippageSetting(auto);
        }
    }
})
</script>

<style scoped>

@media only screen and (max-width: 960px) {
    .title-container {
        font-size: 24px;
        line-height: 40px;
    }

    .sub-title {
        text-align: left!important;
    }

    .slippage-container {
        text-align: left!important;
    }


    .warn-message {
        float: left!important;;
    }

    .sub-title-icon {
        left: 150px;
        right: unset;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .title-container {
        font-size: 30px;
        line-height: 40px;
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

@media (min-width: 1300px) {
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

.container-body {
    background: var(--secondary);
}

.container-header {
    background: var(--secondary)!important;
}

.title-container {
    font-style: normal;
    font-weight: 400;
    color: var(--main-gray-text);
}

.sub-title {
    position: relative;
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0px;
    text-align: left;

    color: var(--main-gray-text);
}

.slippage-container {
    position: relative;
    text-align: right;
}

.slippage-item {
    align-items: center;

    height: 32px;
    min-width: 55px;

    border: 1px solid #D7DADF;
    border-radius: 12px;

    text-align: center;
    cursor: pointer;

    transition: box-shadow 0.3s;
}

.slippage-item-selected {
    box-shadow: 0px 0px 0px 1px #1C95E7;
}

.slippage-name {
    font-style: normal;
    font-weight: 800;
    font-size: 16px;
    line-height: 24px;

    color: var(--main-gray-text);
}

.slippage-value {
    font-style: normal;
    padding-top: 3px;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: var(--main-gray-text);
}

.slippage-item-container {
    display: inline-block;
    margin-right: 10px;
}

.warn-message {
    font-family: Roboto;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0px;
    text-align: left;
    color: rgba(173, 179, 189, 1);
    float: right;
}

.warn-message-container {
    position: relative;
    padding-top: 10px;
}

.warn-message-icon {
    position: absolute;
    top: 13px;
    left: 0;
}

.sub-title-icon {
    position: absolute;
    right: -50px;
    top: 4px;
}

.auto-message {
    font-size: 13px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0px;
    text-align: left;
    //color: rgba(173, 179, 189, 1);
}

.auto-value {
    font-size: 14px;
    padding-left: 3px;
    padding-right: 3px;
}
</style>

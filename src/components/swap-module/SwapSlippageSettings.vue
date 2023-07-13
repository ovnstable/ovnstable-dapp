
<template>
    <div>
        <div>
            <div>
                <div>
                    <div class="tokens-container">

                        <div class="row">
                            <div class="col-12 col-xl-4 col-lg-4 col-md-4 col-sm-12">
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
                                                        <img v-if="light" src="/assets/icon/swap/slippage-tolerance-info.svg" alt="?">
                                                        <img v-else src="/assets/icon/swap/slippage-tolerance-info-dark.svg" alt="?">
                                                    </div>
                                                </template>

                                                <div style="color: var(--main-gray-text);">
                                                    <div>
                                                        <span style="font-weight: bold">0.05% – Low.</span> Recommended
                                                        <div>
                                                            for swapping stablecoins.
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span style="font-weight: bold">0.1% – Medium</span>
                                                    </div>
                                                    <div>
                                                        <span style="font-weight: bold">1% – High.</span> Recommended
                                                        <div>
                                                            for swapping volatile assets.
                                                        </div>
                                                    </div>
                                                </div>
                                            </v-tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-xl-8 col-lg-8 col-md-8 col-sm-12">
                                <div class="slippage-container">
                                    <div v-for="setting in slippageSettings" :key="setting.id"
                                         @click="newSlippageSetting(setting)"
                                            class="slippage-item-container">
                                        <div :class="currentSlippage && currentSlippage.type === setting.type  ? 'slippage-item-selected' : ''"
                                             class="slippage-item">
                                            <div class="slippage-value">
                                                {{setting.value}}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="currentSlippage && currentSlippage.type === 'LOW'" class="warn-message-container">
                        <div class="warn-message">
                            With 0.05% of slippage your tx may fail if you swap volatile assets
                            <div class="warn-message-icon">
                                <img src="/assets/icon/swap/slippage-warn.svg" alt="!">
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
    },
    data() {
        return {
            odosSlippageKey: 'odos_slippage_value',
            currentSlippage: null,
            slippageSettings: [
                {id: 3, type: "LOW", name: 'Low', value: 0.05},
                {id: 2, type: "MEDIUM", name: 'Medium', value: 0.1},
                {id: 1, type: "HIGH", name: 'High', value: 1},
            ]
        }
    },
    mounted() {
        this.initSlippageSettings();
    },
    computed: {
        ...mapGetters('theme', ['light']),
    },
    methods: {
        initSlippageSettings() {
            let value = localStorage.getItem(this.odosSlippageKey);
            if (!value || value === 'undefined' || value === 'null') {
                this.newSlippageSetting(this.slippageSettings[0]); // default
                return
            }

            this.currentSlippage = JSON.parse(value);
        },
        newSlippageSetting(setting) {
            this.currentSlippage = setting;
            localStorage.setItem(this.odosSlippageKey, JSON.stringify(this.currentSlippage));
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
    min-width: 71px;

    border: 1px solid #D7DADF;
    border-radius: 12px;

    text-align: center;
    cursor: pointer;
}

.slippage-item-selected {
    border: 2px solid #1C95E7;
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
    color: rgba(254, 127, 45, 1);
    padding-left: 20px;
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
    left: 140px;
    top: 4px;
}
</style>

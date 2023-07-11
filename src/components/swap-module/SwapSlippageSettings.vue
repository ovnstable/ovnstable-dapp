
<template>
    <div>
        <div>
            <div>
                <div>
                    <div class="tokens-container">

                        <div class="sub-title">
                            Slippage Tolerance (%)
                        </div>
                        <div class="slippage-container">
                            <div class="row">
                                <div v-for="setting in slippageSettings" :key="setting.id"
                                     @click="newSlippageSetting(setting)"
                                     class="col-lg-3 col-md-3 col-sm-12">
                                    <div :class="currentSlippage && currentSlippage.type === setting.type  ? 'slippage-item-selected' : ''"
                                         class="slippage-item">
                                        <div class="slippage-name">
                                            {{setting.name}}
                                        </div>
                                        <div class="slippage-value">
                                            {{setting.value}}
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

export default defineComponent({
    name: "SwapSlippageSettings",
    props: {
    },
    data() {
        return {
            odosSlippageKey: 'odos_slippage_value',
            currentSlippage: null,
            slippageSettings: [
                {id: 1, type: "HIGH", name: 'High', value: 1},
                {id: 2, type: "MEDIUM", name: 'Medium', value: 0.1},
                {id: 3, type: "LOW", name: 'Low', value: 0.05},
            ]
        }
    },
    mounted() {
        this.initSlippageSettings();
    },
    methods: {
        initSlippageSettings() {
            let value = localStorage.getItem(this.odosSlippageKey);
            if (!value || value === 'undefined' || value === 'null') {
                this.newSlippageSetting(this.slippageSettings[2]); // default
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
        font-size: 20px;
        line-height: 36px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .title-container {
        font-size: 30px;
        line-height: 40px;
    }

    .sub-title {
        font-size: 24px;
        line-height: 36px;
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

    .sub-title {
        font-size: 24px;
        line-height: 36px;
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


    .sub-title {
        font-size: 24px;
        line-height: 36px;
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
    font-style: normal;
    font-weight: 400;
    color: var(--main-gray-text);


    padding-bottom: 8px;
}

.slippage-container {

}

.slippage-item {
    align-items: center;
    padding: 12px 20px;

    height: 78px;

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
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: var(--main-gray-text);
}
</style>

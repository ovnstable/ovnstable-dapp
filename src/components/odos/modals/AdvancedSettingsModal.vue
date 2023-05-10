
<template>
    <div>
        <div v-if="isShow">
            <v-dialog
                    v-model="isShow"
                    width="600"
                    persistent>
                <v-card class="container_body airdrop-body pt-4 px-4"
                        style="border-radius: 28px!important;">
                    <v-toolbar class="container_header" flat>
                        <label class="title-container">
                            Advanced Settings
                        </label>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="setShowFunc(false)">
                            <v-icon class="close-icon">mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-card-text>
                        <div class="tokens-container">

                            <div class="sub-title">
                                Slippage Tolerance (%)
                            </div>
                            <div class="slippage-container">
                                <div class="row">
                                    <div v-for="setting in slippageSettings" :key="setting.id"
                                         @click="newSlippageSetting(setting)"
                                         class="col-3">
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

                    </v-card-text>
                </v-card>
            </v-dialog>

            <resize-observer @notify="$forceUpdate()"/>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "AdvancedSettingsModal",
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        setShowFunc: {
            type: Function,
            required: true
        },
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
            if (!value) {
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
div {
    font-family: 'Roboto',serif;
}

.title-container {
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 40px;
    color: #29323E;
}

.sub-title {
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 36px;
    color: #29323E;

    padding-bottom: 8px;
}

.slippage-container {

}

.slippage-item {
    align-items: center;
    padding: 12px 20px;

    height: 78px;

    background: #FFFFFF;

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

    color: #29323E;
}

.slippage-value {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: #29323E;
}
</style>

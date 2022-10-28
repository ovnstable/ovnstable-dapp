<template>
    <v-dialog
            :value="show"
            :width="width"
            @input="close"
            :persistent="persistent"
            scrollable>
        <v-card class="container_body">
            <v-toolbar class="container_header" flat>
                <v-row>
                    <label class="title-modal ml-4">
                        Customize Gas
                    </label>
                    <v-spacer></v-spacer>
                    <v-btn icon class="ml-auto" @click="close" dark>
                        <v-icon class="close-icon">mdi-close</v-icon>
                    </v-btn>
                </v-row>
            </v-toolbar>

            <v-card-text class="px-5 pt-5">
                <v-row dense>
                    <v-col>
                        <label class="estimated-label">
                            Estimated Processing Times
                        </label>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <label class="estimated-sub-label">
                            Select a higher gas fee accelerate the processing of your transaction*
                        </label>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <!-- TODO: add updating -->
                        <v-card class="gas-price-card" :class="currentType === 'low' ? 'selected-type' : ''" flat>
                            <v-card-text @click="selectGasSpeed('low')">
                                <v-row>
                                    <label class="gas-price-title">Slow</label>
                                </v-row>
                                <v-row>
                                    <label class="gas-price-info">{{ gasPriceStation['low'] }} Gwei</label>
                                </v-row>
                                <v-row>
                                    <label class="gas-price-info gas-sub-info"><b>> 1 min</b></label>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card class="gas-price-card" :class="currentType === 'standard' ? 'selected-type' : ''" flat>
                            <v-card-text @click="selectGasSpeed('standard')">
                                <v-row>
                                    <label class="gas-price-title">Average</label>
                                </v-row>
                                <v-row>
                                    <label class="gas-price-info">{{ gasPriceStation['standard'] }} Gwei</label>
                                </v-row>
                                <v-row>
                                    <label class="gas-price-info gas-sub-info" style=""><b>~35 sec</b></label>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card class="gas-price-card" :class="currentType === 'fast' ? 'selected-type' : ''" flat>
                            <v-card-text @click="selectGasSpeed('fast')">
                                <v-row>
                                    <label class="gas-price-title">Top</label>
                                </v-row>
                                <v-row>
                                    <label class="gas-price-info">{{ gasPriceStation['fast'] }} Gwei</label>
                                </v-row>
                                <v-row>
                                    <label class="gas-price-info gas-sub-info"><b>5 - 20 sec</b></label>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <label class="note-label">
                            * Accelerating a transaction by using a higher gas price increases its chances of getting processed by the network faster, but it is not always guaranteed.
                        </label>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <button class="btn-save" v-on:click="saveGasSpeed">
                            Save
                        </button>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "GasSettings",

    props: {
        persistent: {
            type: Boolean,
            default: false,
        },

        width: {
            type: String,
            default: '400',
        }
    },

    computed: {
        ...mapGetters('gasPrice', ['show', 'gasPrice', 'gasPriceGwei', 'gasPriceStation']),
    },

    data: () => ({
        currentType: 'standard',
    }),

    methods: {
        ...mapActions('gasPrice', ['refreshGasPrice', 'hideGasSettings']),
        ...mapMutations('gasPrice', ['setGasPriceType']),

        selectGasSpeed(type){
            this.currentType = type;
        },

        saveGasSpeed() {
            this.setGasPriceType(this.currentType);
            this.refreshGasPrice();

            this.close();
        },

        close() {
            this.hideGasSettings();

            this.$emit('input', false);
            this.$emit('m-close');
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {
    .note-label, .gas-price-title {
        font-size: 14px;
    }
}

@media only screen and (min-width: 1400px) {
    .note-label, .gas-price-title {
        font-size: 12px;
    }
}

.btn-save:hover {
    filter: brightness(110%);
}

.btn-save {
    font-size: 16px;
    font-weight: normal;
    background: #181A21;
    color: var(--links-blue);
    width: 100%;
    height: 56px;
    border-radius: 40px;
}

.title {
    color: white;
    font-weight: 300;
    font-size: 20px;
}

.estimated-label {
    color: white;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
}

.estimated-sub-label {
    color: white;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
}

.note-label {
    color: #6A84A0;
    font-style: normal;
    font-weight: normal;
    line-height: 18px;
}

.gas-price-card {
    background: none !important;
    border-radius: 8px !important;
    border: 1px solid rgba(95, 151, 255, 0.15);
    cursor: pointer;
    height: 100%;
}

.selected-type {
    border: 1px solid #3D8DFF !important;
}

.gas-price-title {
    margin-left: 10px;
    color: #8FA2B7;
    font-style: normal;
    font-weight: normal;
    line-height: 18px;
}

.gas-price-info {
    margin-left: 10px;
    color: white;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
}

.gas-sub-info {
    opacity: 0.4;
}

.container_body {
    border-radius: 24px !important;
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
}
</style>

<template>
    <div class="page-container">
        <div class="mt-10">
            <label class="title-label">Collateral</label>
        </div>

        <v-row class="d-flex justify-space-between ma-0 mt-7" v-if="networkId === 10">
            <template>
                <v-col class="mr-1">
                    <v-row>
                        <v-btn class="wide-btn" @click="tab=1" v-bind:class="activeTabUsd">USD+</v-btn>
                    </v-row>
                </v-col>
                <v-col class="ml-1">
                    <v-row>
                        <v-btn class="wide-btn" @click="tab=2" v-bind:class="activeTabDai">DAI+</v-btn>
                    </v-row>
                </v-col>
            </template>
        </v-row>

        <UsdPlusTab :class="networkId === 10 ? '' : 'mt-7'" v-if="tab === 1"/>
        <DaiPlusTab v-if="tab === 2"/>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import UsdPlusTab from "@/views/performance/view/tab/UsdPlusTab";
import DaiPlusTab from "@/views/performance/view/tab/DaiPlusTab";


export default {
    name: "CollateralView",

    components: {
        UsdPlusTab,
        DaiPlusTab,
    },

    data: () => ({
        tab: 1,
    }),

    watch: {
        networkId: function (newValue, oldValue) {
            if (newValue !== 10) {
                this.tab = 1;
            }
        },
    },

    computed: {
        ...mapGetters("network", ['networkId']),
        ...mapGetters("statsData", ['currentTotalData', 'stablecoinData']),

        activeTabUsd: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-inactive': this.tab !== 1,
            }
        },

        activeTabDai: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-inactive': this.tab !== 2,
            }
        },
    },

    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 32px;
        line-height: 40px;
    }

    .wide-btn {
        font-size: 14px;
        line-height: 18px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .wide-btn {
        font-size: 16px;
        line-height: 20px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .wide-btn {
        font-size: 16px;
        line-height: 20px;
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
        font-style: normal;
        font-weight: 300;
        font-size: 48px;
        line-height: 60px;
    }

    .wide-btn {
        font-size: 14px;
        line-height: 20px;
    }
}

.page-container {
    margin-bottom: 5% !important;
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.wide-btn {
    min-width: 100% !important;
    height: 40px;
    border: 1px solid var(--input-placeholder);

    background-color: var(--action-btn-bg) !important;
    color: var(--zoom-btn-color);

    font-weight: 400;
    font-family: "Roboto", sans-serif;

    letter-spacing: 0.2;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    box-shadow: none;
}

.wide-btn:hover {
    background: var(--hover);
    color: rgba(28, 149, 231, 1) !important;
}

.tab-button-inactive {
    background: transparent !important;
}

.tab-button-upper {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer;
}
</style>

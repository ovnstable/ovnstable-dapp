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
    .tab-btn {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 32px;
        line-height: 40px;
    }

    .title-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .ready-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled {
        width: 100%;
        height: 36px !important;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .wide-btn {
        font-size: 14px;
        line-height: 18px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .tab-btn {
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 28px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .title-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .ready-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 32px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled {
        width: 20%;
        height: 40px !important;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .wide-btn {
        font-size: 16px;
        line-height: 20px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .tab-btn {
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 28px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .title-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .ready-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 32px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled {
        width: 20%;
        height: 40px !important;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .wide-btn {
        font-size: 16px;
        line-height: 20px;
    }
}

.page-container {
    margin-bottom: 5% !important;
}

.tab-btn {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
    margin-bottom: -2px;
}

.tab-chain-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer !important;
}

.tab-chain-button-in-active {
    color: var(--secondary-gray-text) !important;
    cursor: pointer !important;
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.title-info-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.info-link {
    font-weight: 400;
    color: var(--links-blue) !important;
    cursor: pointer;
}

.ready-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--main-gray-text);
}

.header-btn {
    border-radius: 4px !important;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}

.info-card-container {
    background: var(--secondary);
    border-radius: 4px;
}

.info-card-body-bottom {
    margin: 2% 2% !important;
}

.section-title-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    text-transform: capitalize;
    color: var(--secondary-gray-text);
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
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

.tab-button {
}

.tab-button-inactive {
    background: transparent !important;
}

</style>

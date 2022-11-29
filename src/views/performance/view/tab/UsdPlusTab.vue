<template>
    <div class="page-container">
        <v-row class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-5'" justify="start" align="center">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <label class="section-title-label">USD+ collateral assets</label>
                </v-row>

                <v-row align="center" justify="center">
                    <v-col :cols="!$wu.isFull() ? 12 : 8">
                        <TableStablecoins
                            v-if="!$wu.isMobile()"
                            :data="stablecoinData"/>

                        <TableStablecoins
                            v-else
                            minimized
                            :data="stablecoinData"/>
                    </v-col>

                    <v-col :cols="!$wu.isFull() ? 12 : 4">
                        <PieStablecoins :data="stablecoinData" :size="!$wu.isFull() ? 200 : 300"/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- TODO: add collateral time rate -->

        <v-row class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-3'" justify="start" align="center">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <label class="section-title-label">USD+ portfolio</label>
                </v-row>

                <v-row align="center" justify="center">
                    <v-col :cols="!$wu.isFull() ? 12 : 8">
                        <TableStrategies
                            v-if="!$wu.isMobile()"
                            :data="currentTotalData"/>

                        <TableStrategies
                            v-else
                            minimized
                            :data="currentTotalData"/>
                    </v-col>

                    <v-col :cols="!$wu.isFull() ? 12 : 4">
                        <DoughnutStrategies :data="currentTotalData" :size="!$wu.isFull() ? 200 : 300"/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row class="d-flex justify-space-between mt-0">
            <template>
                <v-col>
                    <div class="currency-box d-flex" :class="$wu.isMobile() ? 'pa-5' : 'pa-5'">
                        <div>
                            <v-img class="currency" :class="$wu.isMobile() ? 'mt-1' : 'ml-5'" :src="require('@/assets/currencies/USD+_NEW.svg')" />
                        </div>
                        <div :class="$wu.isMobile() ? 'ml-1 mt-2' : 'mt-2 ml-2'">
                            <label class="currency-text">USD+ token address</label>
                        </div>
                        <div class="ml-auto d-flex" :class="$wu.isMobile() ? 'mt-2 ml-1' : 'mt-2 ml-2'">
                            <label class="address-text ml-auto">0x9ff...x9ob</label>
                            <v-img class="open-new mt-0 ml-1" :src="require('@/assets/icon/open-in-new.svg')"/>
                        </div>
                    </div>
                </v-col>
                <v-col>
                    <div class="currency-box d-flex" :class="$wu.isMobile() ? 'pa-5' : 'pa-5'">
                        <div>
                            <v-img class="currency" :class="$wu.isMobile() ? '' : 'ml-5'" :src="require('@/assets/currencies/Hacken.svg')" />
                        </div>
                        <div :class="$wu.isMobile() ? 'mt-1 ml-1' : 'mt-2 ml-2'">
                            <label class="currency-text">Audit</label>
                        </div>
                        <div class="ml-auto d-flex" :class="$wu.isMobile() ? 'mt-2 ml-1' : 'mt-2 ml-2'">
                            <label class="address-text ml-auto">0x9ff...x9ob</label>
                            <v-img class="open-new mt-0 ml-1" :src="require('@/assets/icon/open-in-new.svg')"/>
                        </div>
                    </div>
                </v-col>
            </template>
        </v-row>

        <v-row align="start" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-5 mb-10' : 'mt-3'">
            <v-btn class="header-btn btn-filled" @click="mintAction">
                Mint USD+
            </v-btn>
        </v-row>
        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import TableStablecoins from "@/components/stats/pie/TableStablecoins";
import PieStablecoins from "@/components/stats/pie/PieStablecoins";
import TableStrategies from "@/components/stats/doughnut/TableStrategies";
import DoughnutStrategies from "@/components/stats/doughnut/DoughnutStrategies";

export default {
    name: "CollateralView",

    components: {
        DoughnutStrategies,
        TableStrategies,
        PieStablecoins,
        TableStablecoins
    },

    data: () => ({

    }),

    computed: {
        ...mapGetters("network", ['networkId']),
        ...mapGetters("statsData", ['currentTotalData', 'stablecoinData']),

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

    .currency {
        width: 30px ;
        height: 30px;
    }

    .currency-text {
        font-size: 14px;
        line-height: 22px;
    }

    .address-text {
        font-size: 14px;
        line-height: 22px;
    }

    .open-new {
        width: 20px;
        height: 20px;
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

    .currency {
        width: 38px;
        height: 38px;
    }

    .currency-text {
        font-size: 18px;
        line-height: 28px;
    }

    .address-text {
        font-size: 18px;
        line-height: 28px;
    }

    .open-new {
        width: 24px;
        height: 24px;
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

    .currency {
        width: 38px !important;
        height: 38px !important;
    }

    .currency-text {
        font-size: 18px;
        line-height: 28px;
    }

    .address-text {
        font-size: 18px;
        line-height: 28px;
    }

    .open-new {
        width: 24px;
        height: 24px;
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
    border-radius: 12px;
}

.currency-box {
    background: var(--secondary);
    border-radius: 12px;
}

.info-card-body-bottom {
    margin: 2% 2% !important;
}

.section-title-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    text-transform: none;
    color: var(--secondary-gray-text);
}

.currency-text {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 400;
    color: var(--secondary-gray-text);
}

.open-link {
    width: 18px;
    height: 18px;
}

.address-text {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 300;
    color: var(--secondary-gray-text);
}


</style>

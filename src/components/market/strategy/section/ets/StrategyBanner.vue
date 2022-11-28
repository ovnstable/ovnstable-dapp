<template>
    <v-row class="banner-container ma-0" :style="{'background': etsData.cardBgColor}">
        <v-col class="main-col">
            <v-row align="start" :justify="$wu.isMobile() ? 'start' : 'end'" class="ma-0">
                <template v-if="$wu.isMobile()">
                    <div class="currency-icon">
                        <v-img :src="require('@/assets/currencies/market/ets_' + etsData.name + '.svg')"/>
                    </div>
                    <v-spacer></v-spacer>
                </template>

                <div :class="$wu.isMobile() ? 'currency-icon' : 'icon'" class="mr-3">
                    <v-img :src="require('@/assets/network/' + etsData.chainName + '.svg')"/>
                </div>

                <div class="bordered-col">
                    <div :class="$wu.isMobile() ? 'currency-icon' : 'icon'" class="mx-3">
                        <v-img :src="require('@/assets/cards/platform/' + etsData.dex + '.svg')"/>
                    </div>
                </div>
                <div class="icon ml-3">
                    <v-img :src="require('@/assets/cards/token_pair/' + etsData.tokenPair + '.svg')"/>
                </div>
            </v-row>

            <v-row align="start" class="ma-0 mt-5">
                <v-col cols="2" v-if="!$wu.isMobile()">
                    <v-row align="center">
                        <div class="currency-icon">
                            <v-img :src="require('@/assets/currencies/market/ets_' + etsData.name + '.svg')"/>
                        </div>
                    </v-row>
                </v-col>

                <v-col>
                    <v-row align="center" :justify="$wu.isMobile() ? 'center' : 'start'">
                        <label class="banner-title" :class="$wu.isMobile() ? 'mt-4 mb-2' : 'ml-4'">ETS {{ etsData.nameUp }}</label>
                    </v-row>

                    <v-row align="center" class="ma-0 mt-8">
                        <div>
                            <v-col>
                                <v-row :justify="$wu.isMobile() ? 'start' : 'center'" class="mr-3">
                                    <label class="info-value">
                                        {{ (etsStrategyData[etsData.name] && etsStrategyData[etsData.name].apy) ? ($utils.formatMoneyComma(etsStrategyData[etsData.name].apy, 0)) + '%' : '—' }}
                                    </label>
                                </v-row>
                                <v-row :justify="$wu.isMobile() ? 'start' : 'center'" class="mr-3 mt-5">
                                    <label class="info-title">APY</label>
                                    <div style="margin-top: -2px">
                                        <Tooltip icon-color="rgba(255, 255, 255, 0.6)" size="16" text="Strategy net APY based on 30-day average, includes fees taken (fee-adjusted)"/>
                                    </div>
                                </v-row>
                            </v-col>
                        </div>

                        <div class="bordered-col" v-if="!$wu.isMobile()">
                            <v-col>
                                <v-row justify="center" class="mx-3">
                                    <label class="info-value">
                                        {{ (etsStrategyData[etsData.name] && etsStrategyData[etsData.name].diffApy) ? (etsStrategyData[etsData.name].diffApy > 0 ? '+' : '') + ($utils.formatMoneyComma(etsStrategyData[etsData.name].diffApy, 0)) + '%' : '—' }}
                                    </label>
                                </v-row>
                                <v-row justify="center" class="mx-3 mt-5">
                                    <label class="info-title">Diff. to USD+</label>
                                </v-row>
                            </v-col>
                        </div>
                        <v-spacer v-else></v-spacer>

                        <div>
                            <v-col>
                                <v-row :justify="$wu.isMobile() ? 'end' : 'center'" class="ml-3">
                                    <label class="info-value">
                                        {{ (etsStrategyData[etsData.name] && etsStrategyData[etsData.name].tvl) ? ('$' + $utils.formatMoneyComma(etsStrategyData[etsData.name].tvl, 2)) : '—' }}
                                    </label>
                                </v-row>
                                <v-row :justify="$wu.isMobile() ? 'end' : 'center'" class="ml-3 mt-5">
                                    <label class="info-title">Current TVL</label>
                                </v-row>
                            </v-col>
                        </div>
                    </v-row>
                </v-col>
            </v-row>
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import {mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";
import polygonIcon from "@/assets/network/polygon.svg";
import avaxIcon from "@/assets/network/avalanche.svg";
import optimismIcon from "@/assets/network/op.svg";
import bscIcon from "@/assets/network/bsc.svg";

export default {
    name: "StrategyBanner",

    components: {
        Tooltip
    },

    props: {

        etsData: {
            type: Object,
        },
    },

    computed: {
        ...mapGetters('marketData', ['etsStrategyData']),
        ...mapGetters('supplyData', ['totalSupply']),

        icon: function (){
            switch (this.etsData.chain){
                case 137:
                    return polygonIcon;
                case 43114:
                    return avaxIcon;
                case 10:
                    return optimismIcon;
                case 56:
                    return bscIcon;
            }
        },
    },

    data: () => ({
    }),

    watch: {
    },

    created() {
    },

    methods: {
        openLink(url) {
            window.open(url, '_blank').focus();
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .banner-container {
        /*height: 350px !important;*/
    }

    .currency-icon {
        width: 36px;
        height: 36px;
    }

    .banner-title {
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 24px;
    }

    .network-icon {
        width: 28px;
        height: 28px;
    }

    .info-container {
        width: 100% !important;
        height: 70px !important;
    }

    .info-container-capacity {
        width: 100% !important;
        height: 110px !important;
    }

    .info-title {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
    }

    .info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
    }

    .capacity-status-text {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
    }

    .capacity-status-value {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .capacity-status-sub-text {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .icon {
        height: 36px !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .banner-container {
        /*height: 420px !important;*/
    }

    .currency-icon {
        width: 120px;
        height: 120px;
    }

    .banner-title {
        font-style: normal;
        font-weight: 500;
        font-size: 36px;
        line-height: 46px;
    }

    .network-icon {
        width: 40px;
        height: 40px;
    }

    .info-container {
        width: 100% !important;
        height: 110px !important;
    }

    .info-container-capacity {
        width: 100% !important;
        height: 100px !important;
    }

    .info-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
    }

    .info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 40px;
    }

    .capacity-status-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .capacity-status-value {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .capacity-status-sub-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .icon {
        height: 36px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .banner-container {
        /*height: 300px !important;*/
    }

    .currency-icon {
        width: 150px;
        height: 150px;
    }

    .banner-title {
        font-style: normal;
        font-weight: 500;
        font-size: 40px;
        line-height: 48px;
    }

    .network-icon {
        width: 40px;
        height: 40px;
    }

    .info-container {
        width: 100% !important;
        height: 110px !important;
    }

    .info-container-capacity {
        width: 100% !important;
        height: 110px !important;
    }

    .info-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
    }

    .info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 40px;
    }

    .capacity-status-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .capacity-status-value {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .capacity-status-sub-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .icon {
        height: 36px !important;
    }
}

.banner-container {
    width: 100% !important;
    border-radius: 8px;
}

.main-col {
    margin: 2%;
}

.banner-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    color: white;
}

.info-container, .info-container-capacity {
    background-color: var(--main-banner-background) !important;
    border: 1px solid var(--secondary-border);
    border-radius: 6px;
}

.info-title {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: rgba(255, 255, 255, 0.6);
}

.info-value {
    font-family: 'Roboto', sans-serif;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: white;
}

.bordered-col {
    border-left: 1px solid rgba(255, 255, 255, 0.6) !important;
    border-right: 1px solid rgba(255, 255, 255, 0.6) !important;
}

.label-error {
    color: #CF3F92 !important;
}

.progress-info {
    background: var(--progress-info);
}

.capacity-status-text {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.capacity-status-value {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--links-blue);
}

.capacity-status-sub-text {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--fourth-gray-text);
}

.icon {
    width: auto !important;
}
</style>

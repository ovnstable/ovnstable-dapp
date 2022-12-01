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

                <div class="icon-border">
                    <div :class="$wu.isMobile() ? 'currency-icon' : 'icon'" class="mx-3">
                        <v-img :src="require('@/assets/cards/platform/' + etsData.dex + '.svg')"/>
                    </div>
                </div>
                <div class="icon ml-3">
                    <v-img class="token-pair" :src="require('@/assets/cards/token_pair/' + etsData.tokenPair + '.svg')"/>
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

                        <template v-if="!$wu.isFull()">
                            <v-spacer></v-spacer>
                            <div class="range-container">
                                <label class="range-title">{{ (etsData.range) }} range</label>
                                <Tooltip
                                    icon-color="#FFFFFF"
                                    :size="$wu.isFull() ? 20 : ($wu.isTablet() ? 18 : 18)"
                                    text="WETH price range which depends on the market and conditions on it"
                                    top />
                            </div>
                        </template>
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

                        <div class="bordered-col">
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

                        <template v-if="etsData.maxSupply">
                            <div class="bordered-box" v-if="!$wu.isMobile()">
                                <v-col>
                                    <v-row :justify="$wu.isMobile() ? 'end' : 'center'" class="">
                                        <label class="info-value" :class="$wu.isMobile() ? 'mt-2 ml-3' : 'ml-3'">
                                            {{ (etsStrategyData[etsData.name] && etsStrategyData[etsData.name].tvl) ? ('$' + $utils.formatMoneyComma(etsStrategyData[etsData.name].tvl, 2)) : '—' }}
                                        </label>
                                        <label class="info-value-max ml-15 mt-3">
                                            {{ ('$' + $utils.formatMoneyComma(etsData.maxSupply, 2)) }}
                                        </label>
                                    </v-row>
                                    <v-row class="mb-1" :justify="$wu.isMobile() ? 'end' : 'center'">
                                        <label class="info-title" :class="$wu.isMobile() ? 'ml-4' : 'ml-4'">Current TVL</label>
                                        <label class="info-title ml-auto">Max TVL</label>
                                    </v-row>
                                    <v-row class="ml-2">
                                        <v-progress-linear
                                            rounded
                                            height="7"
                                            class="progress-info"
                                            background-opacity="0"
                                            :value="(totalSupply[etsData.name] / etsData.maxSupply) * 100"
                                            :color="etsData.mainColor"
                                        ></v-progress-linear>
                                    </v-row>
                                </v-col>
                            </div>
                            <div class="bordered-box mt-5" v-else>
                                <v-row>
                                    <v-col>
                                        <v-row :justify="$wu.isMobile() ? 'end' : 'center'" class="">
                                            <label class="info-value" :class="$wu.isMobile() ? 'mt-2 ml-3' : 'ml-3'">
                                                {{ (etsStrategyData[etsData.name] && etsStrategyData[etsData.name].tvl) ? ('$' + $utils.formatMoneyComma(etsStrategyData[etsData.name].tvl, 2)) : '—' }}
                                            </label>
                                            <label class="info-value-max ml-15 mt-3">
                                                {{ ('$' + $utils.formatMoneyComma(etsData.maxSupply, 2)) }}
                                            </label>
                                        </v-row>
                                        <v-row class="mb-1" :justify="$wu.isMobile() ? 'end' : 'center'">
                                            <label class="info-title" :class="$wu.isMobile() ? 'ml-4' : 'ml-4'">Current TVL</label>
                                            <label class="info-title ml-auto">Max TVL</label>
                                        </v-row>
                                        <v-row class="ml-0">
                                            <v-progress-linear
                                                rounded
                                                height="7"
                                                class="progress-info"
                                                background-opacity="0"
                                                :value="(totalSupply[etsData.name] / etsData.maxSupply) * 100"
                                                :color="etsData.mainColor"
                                            ></v-progress-linear>
                                        </v-row>
                                    </v-col>
                                </v-row>

                            </div>

                            <div class="range-container ml-auto" v-if="$wu.isFull()">
                                <label class="range-title">{{ (etsData.range) }} range</label>
                                <Tooltip
                                    icon-color="#FFFFFF"
                                    :size="$wu.isFull() ? 20 : ($wu.isTablet() ? 18 : 18)"
                                    text="WETH price range which depends on the market and conditions on it"
                                    top />
                            </div>
                        </template>

                        <template v-else>
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
                        </template>
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

    .icon {
        height: 36px !important;
    }

    .range-title {
        font-size: 12px;
        line-height: 16px;
    }

    .info-value-max {
        font-size: 12px;
    }

    .range-container {
        padding: 5px 10px;
        margin-top: 10px;
    }

    .bordered-box {
        padding: 10px 35px 25px 25px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
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

    .icon {
        height: 36px !important;
    }

    .range-title {
        font-size: 14px;
        line-height: 16px;
    }

    .info-value-max {
        font-size: 14px;
    }

    .range-container {
        padding: 10px 15px;
        margin-top: 30px;
        margin-left: 10px;
    }

    .bordered-box {
        padding: 10px 20px 10px 0;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
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

    .icon {
        height: 36px !important;
    }

    .info-value-max {
        font-size: 14px;
    }

    .range-title {
        font-size: 14px;
        line-height: 18px;
    }

    .range-container {
        padding: 10px 20px;
        margin-top: 75px;
    }

    .bordered-box {
        padding: 20px 30px 20px 5px;
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

.info-value-max {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: rgba(255, 255, 255, 0.6);
}

.bordered-col {
    border-left: 1px solid rgba(255, 255, 255, 0.6) !important;
}

.icon-border {
    border-left: 1px solid rgba(255, 255, 255, 0.6) !important;
    border-right: 1px solid rgba(255, 255, 255, 0.6) !important;
}

.progress-info {
    background: var(--progress-info);
}

.icon {
    width: auto !important;
}

.bordered-box {
    border: solid 1px rgba(255, 255, 255, 0.6);
    border-radius: 4px;
}

.token-pair {
    width: 70px;
    height: 100%;
}

.range-container {
    display: flex;
    align-items: end;

    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 4px;
}

.range-title {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 400;
    text-transform: uppercase;
    color: #FFFFFF;
    letter-spacing: 0.03em;
}
</style>

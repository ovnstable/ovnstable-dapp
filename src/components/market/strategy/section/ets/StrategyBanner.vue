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
                        <v-img class="platform" :src="require('@/assets/cards/platform/' + etsData.dex + '.svg')"/>
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

                        <v-spacer v-if="etsData.range"></v-spacer>
                        <div class="range-container" v-if="etsData.range" :class="$wu.isMobile() ? 'mt-4 mb-2' : 'ml-4'">
                            <v-row :class="$wu.isMobile() ? 'ma-1' : 'ma-2'" align="center">
                                <label class="range-title">{{ etsData.range }}</label>
                                <Tooltip
                                    icon-color="#FFFFFF"
                                    :size="$wu.isFull() ? 20 : ($wu.isTablet() ? 18 : 18)"
                                    :text="rangePercents"
                                    top />
                            </v-row>
                        </div>
                    </v-row>

                    <v-row align="center" :justify="$wu.isMobile() ? 'center' : 'start'" class="ma-0 mt-8">
                        <v-col class="bordered-col" :cols="$wu.isMobile() ? 6 : 2">
                            <v-row class="ml-n2 justify-center">
                                <label class="info-value">
                                    {{ (etsStrategyData[etsData.name] && etsStrategyData[etsData.name].lastApy && !isNaN(etsStrategyData[etsData.name].lastApy))  ? ($utils.formatMoneyComma(etsStrategyData[etsData.name].lastApy, 0)) + '%' : '0%' }}
                                </label>
                            </v-row>
                            <v-row class="ml-n2 mt-5 justify-center">
                                <label class="info-title">Last day apy</label>
                            </v-row>
                        </v-col>
                        <v-col class="bordered-col" :cols="$wu.isMobile() ? 6 : 2">
                            <v-row class="ml-n2 justify-center">
                                <label class="info-value">
                                    {{ (etsStrategyData[etsData.name] && etsStrategyData[etsData.name].apy && !isNaN(etsStrategyData[etsData.name].apy)) ? ($utils.formatMoneyComma(etsStrategyData[etsData.name].apy, 0)) + '%' : '0%' }}
                                </label>
                            </v-row>
                            <v-row class="ml-n2 mt-5 justify-center">
                                <label class="info-title">30-day apy</label>
                            </v-row>
                        </v-col>

                        <template v-if="etsData.maxSupply">
                            <v-col :cols="$wu.isMobile() ? 12 : 6">
                                <v-row :class="$wu.isMobile() ? 'mt-4' : ''" justify="end">
                                    <v-col :class="$wu.isMobile() ? '' : 'mr-n3'">
                                        <v-row class="mx-2 mt-1" align="end">
                                            <label class="info-value">
                                                {{ (totalSupply && totalSupply[etsData.name]) ? ('$' + $utils.formatMoneyComma(totalSupply[etsData.name], 2)) : '—' }}
                                            </label>
                                            <v-spacer></v-spacer>
                                            <label class="info-value-max">
                                                {{ ('$' + $utils.formatMoneyComma(etsData.maxSupply, 2)) }}
                                            </label>
                                        </v-row>
                                        <v-row class="mx-2 mb-1" align="center">
                                            <label class="info-title">Current TVL</label>
                                            <v-spacer></v-spacer>
                                            <label class="info-title ml-auto">Max TVL</label>
                                        </v-row>
                                        <v-row class="mx-2 mb-1">
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
                            </v-col>
                        </template>

                        <template v-else>
                            <v-col :cols="$wu.isMobile() ? 12 : 7">
                                <v-row :class="$wu.isMobile() ? 'mt-4' : ''" justify="end">
                                    <v-col :class="$wu.isMobile() ? '' : 'mr-n3'">
                                        <v-row :justify="!$wu.isMobile() ? 'end' : 'center'">
                                            <label class="info-value">
                                                {{ (totalSupply && totalSupply[etsData.name]) ? ('$' + $utils.formatMoneyComma(totalSupply[etsData.name], 2)) : '—' }}
                                            </label>
                                        </v-row>
                                        <v-row :justify="!$wu.isMobile() ? 'end' : 'center'" class="mt-5">
                                            <label class="info-title">Current TVL</label>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-col>
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
import optimismIcon from "@/assets/network/op.svg";
import arbitrumIcon from "@/assets/network/ar.svg";
import zksyncIcon from "@/assets/network/zk.svg";
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
        ...mapGetters('marketData', ['etsStrategyData', 'compoundData']),
        ...mapGetters('supplyData', ['totalSupply']),

        icon: function (){
            switch (this.etsData.chain){
                case 137:
                    return polygonIcon;
                case 10:
                    return optimismIcon;
                case 56:
                    return bscIcon;
                case 42161:
                    return arbitrumIcon;
                case 324:
                    return zksyncIcon;
            }
        },

        rangePercents: function (){
            if (this.etsData.range) {
                let plusmnSign = '±';

                return this.etsData.range + ' price range is set by Overnight, and can be from '
                    + (this.etsData.range === 'NARROW' ? (plusmnSign + '1% to ' + plusmnSign + '10%') : (plusmnSign + '10% to ' + plusmnSign + '100%'))
                    + ' of the current price';
            } else {
                return '';
            }
        },
        compoundStyle: function () {
          return `border: 1px solid #ffffff; color: #ffffff;`;
        }
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
        line-height: 18px;
    }

    .info-value-max {
        font-size: 12px;
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
        margin-top: 2px !important;
        font-size: 14px;
        line-height: 18px;
    }

    .info-value-max {
        font-size: 14px;
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
        margin-top: 2px !important;
        font-size: 14px;
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
    .currency-icon {
        width: 140px;
        height: 140px;
    }

    .banner-title {
        font-style: normal;
        font-weight: 500;
        font-size: 34px;
        line-height: 40px;
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
        font-size: 25px;
        line-height: 28px;
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
    text-transform: none;
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
    border-right: 1px solid rgba(255, 255, 255, 0.6) !important;
}

.icon-border {
    border-left: 1px solid rgba(255, 255, 255, 0.6) !important;
    border-right: 1px solid rgba(255, 255, 255, 0.6) !important;
}

.progress-info {
    background: #D7DADF;
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

.info-value-per100 {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 30px;
  line-height: 36px;
  color: #FFFFFF;
}

.info-value-compound-container {
  border-radius: 5px;
  margin-left: 8px;
  padding: 4px 4px 4px;
}

.info-value-compound {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 26px;

  text-align: center;
}

.platform {
    width: 34px !important;
    height: 34px !important;
}
</style>

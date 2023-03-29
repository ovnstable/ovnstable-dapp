<template>
    <v-row class="banner-container ma-0" :style="{'background': 'radial-gradient(128.35% 221.83% at 66.7% -84.67%, #011845 0%, #011439 31.55%, #011233 56.82%, #6135BD 93.94%)'}">
        <v-col class="main-col">
            <v-row align="start" :justify="$wu.isMobile() ? 'start' : 'end'" class="ma-0">
                <template v-if="$wu.isMobile()">
                    <div class="currency-icon">
                        <v-img :src="require('@/assets/currencies/insurance/insurancePolygon.svg')"/>
                    </div>
                    <v-spacer></v-spacer>
                </template>

                <div :class="$wu.isMobile() ? 'currency-icon' : 'icon'" class="mr-3">
                    <v-img :src="require('@/assets/network/polygon.svg')"/>
                </div>
            </v-row>

            <v-row align="start" class="ma-0 mt-5">
                <v-col cols="2" v-if="!$wu.isMobile()">
                    <v-row align="center">
                        <div class="currency-icon">
                            <v-img :src="require('@/assets/currencies/insurance/insurancePolygon.svg')"/>
                        </div>
                    </v-row>
                </v-col>

                <v-col>
                    <v-row align="center" :justify="$wu.isMobile() ? 'center' : 'start'">
                        <label class="banner-title" :class="$wu.isMobile() ? 'mt-4 mb-2' : 'ml-4'">USD+ INSURANCE ON POLYGON</label>
                    </v-row>

                    <v-row align="center" :justify="$wu.isMobile() ? 'center' : 'start'" class="ma-0 mt-8">
                        <v-col :cols="$wu.isMobile() ? 6 : 2">
                            <v-row :justify="$wu.isMobile() ? 'center' : 'start'" class="ml-n2">
                                <label class="info-value">
                                    {{ (insuranceStrategyData.polygon) ? (insuranceStrategyData.polygon.apy > 500 ? '>500' : $utils.formatMoneyComma(insuranceStrategyData.polygon.apy, 0)) + '%' : '—' }}
                                </label>
                            </v-row>
                            <v-row :justify="$wu.isMobile() ? 'center' : 'start'" class="ml-n2 mt-5">
                                <label class="info-title">APY</label>
                                <div style="margin-top: -2px">
                                    <Tooltip icon-color="rgba(255, 255, 255, 0.6)" :size="16" text="Last day net APY, includes fees taken (fee-adjusted)"/>
                                </div>
                            </v-row>
                        </v-col>

                        <v-col :cols="$wu.isMobile() ? 6 : 2">
                            <v-row :justify="$wu.isMobile() ? 'center' : 'start'" class="ml-n2">
                                <label class="info-value">
                                    {{ (totalInsuranceSupply && totalInsuranceSupply.polygon) ? ('$' + $utils.formatMoneyComma(totalInsuranceSupply.polygon, 2)) : '—'  }}
                                </label>
                            </v-row>
                            <v-row :justify="$wu.isMobile() ? 'center' : 'start'" class="ml-n2 mt-5">
                                <label class="info-title">Insurance fund</label>
                            </v-row>
                        </v-col>
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
    name: "InsuranceBanner",

    components: {
        Tooltip
    },

    props: {

        insuranceData: {
            type: Object,
        },
    },

    computed: {
        ...mapGetters('insuranceData', ['insuranceStrategyData']),
        ...mapGetters('supplyData', ['totalSupply', 'totalInsuranceSupply']),

        icon: function (){
            switch (this.insuranceData.chainId){
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

    .icon {
        width: 36px;
        height: 36px;
    }

    .banner-title {
        font-style: normal;
        font-weight: 500;
        font-size: 36px;
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
        font-size: 26px;
        line-height: 28px;
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
</style>

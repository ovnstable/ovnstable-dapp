<template>
    <v-row align="center" justify="start" class="banner-container ma-0">
        <v-col class="main-col">
            <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-1 mb-3' : 'mb-12'">
                <div class="currency-icon">
                    <v-img :src="require('@/assets/currencies/market/WmaticUsdPlus.svg')"/>
                </div>
                <label class="banner-title ml-4">ETS: USD+ / WMatic</label>
                <v-spacer></v-spacer>
                <div class="network-icon">
                    <v-img :src="require('@/assets/network/polygon.svg')"/>
                </div>
            </v-row>

            <v-row class="d-flex">
                <v-col :cols="$wu.isFull() ? 8 : 12">
                    <v-row align="center" justify="start" class="info-container ma-0">
                        <v-col>
                            <v-row justify="center" align="center" class="ma-0">
                                <label class="info-title">APY</label>
                            </v-row>
                            <v-row justify="center" align="center" class="mt-2">
                                <label class="info-value mr-n1">{{ (wmaticStrategyData && wmaticStrategyData.apy) ? ($utils.formatMoneyComma(wmaticStrategyData.apy, 0)) + '%' : '—' }}</label>
                                <Tooltip text="Strategy APY based on 7-day average, includes fees taken (fee-adjusted)"/>
                            </v-row>
                        </v-col>
                        <v-col class="bordered-col" cols="5">
                            <v-row justify="center" align="center" class="ma-0">
                                <label class="info-title">TVL</label>
                            </v-row>
                            <v-row justify="center" align="center" class="mt-2">
                                <label class="info-value" :class="(totalSupply.usdPlusWmatic >= maxUsdPlusWmaticSupply) ? 'label-error' : ''">
                                    {{ (wmaticStrategyData && wmaticStrategyData.tvl) ? ('$' + $utils.formatMoneyComma(wmaticStrategyData.tvl, 2)) : '—' }}
                                </label>
                                <Tooltip text="Past 2 hours"/>
                            </v-row>
                        </v-col>
                        <v-col>
                            <v-row justify="center" align="center" class="ma-0">
                                <label class="info-title">Users</label>
                            </v-row>
                            <v-row justify="center" align="center" class="mt-2">
                                <label class="info-value">{{ (wmaticStrategyData && wmaticStrategyData.holders) ? $utils.formatMoneyComma(wmaticStrategyData.holders, 0) : '—' }}</label>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row align="center" justify="start" class="info-container-capacity ma-0">
                        <v-col class="card-banner-body">
                            <v-row class="ma-0" justify="start" align="center">
                                <label class="capacity-status-text">ETS capacity status</label>
                                <v-spacer></v-spacer>
                                <label class="capacity-status-value" :class="totalSupply.usdPlusWmatic >= maxUsdPlusWmaticSupply ? 'label-error' : ''">
                                    {{ totalSupply.usdPlusWmatic >= maxUsdPlusWmaticSupply ? 'FULL' : 'AVAILABLE' }}
                                </label>
                            </v-row>
                            <v-row class="ma-0 mt-2" justify="start" align="center">
                                <v-progress-linear
                                        rounded
                                        height="7"
                                        class="progress-info"
                                        background-opacity="0"
                                        :value="(totalSupply.usdPlusWmatic / maxUsdPlusWmaticSupply) * 100"
                                        :color="totalSupply.usdPlusWmatic >= maxUsdPlusWmaticSupply ? '#CF3F92' : '#1C95E7'"
                                ></v-progress-linear>
                            </v-row>
                            <v-row class="ma-0 mt-2" justify="start" align="center">
                                <label class="capacity-status-sub-text">${{ $utils.formatMoneyComma(totalSupply.usdPlusWmatic, 2) }}</label>
                                <v-spacer></v-spacer>
                                <label class="capacity-status-sub-text">${{ $utils.formatMoneyComma(maxUsdPlusWmaticSupply, 2) }}</label>
                            </v-row>
                            <v-row class="ma-0" justify="start" align="center">
                                <label class="capacity-status-sub-text">CURRENT TVL</label>
                                <v-spacer></v-spacer>
                                <label class="capacity-status-sub-text">MAX TVL</label>
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
import moment from "moment";
import Tooltip from "@/components/common/element/Tooltip";

export default {
    name: "StrategyBanner",

    components: {
        Tooltip
    },

    props: {
    },

    computed: {
        ...mapGetters('marketData', ['wmaticStrategyData']),
        ...mapGetters('supplyData', ['totalSupply', 'maxUsdPlusWmaticSupply']),
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
        height: 350px !important;
    }

    .currency-icon {
        width: 28px;
        height: 28px;
    }

    .banner-title {
        font-style: normal;
        font-weight: 400;
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
        line-height: 20px;
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
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .banner-container {
        height: 420px !important;
    }

    .currency-icon {
        width: 60px;
        height: 60px;
    }

    .banner-title {
        font-style: normal;
        font-weight: 300;
        font-size: 56px;
        line-height: 65px;
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
        line-height: 16px;
    }

    .info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 36px;
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
}

/* full */
@media only screen and (min-width: 1400px) {
    .banner-container {
        height: 300px !important;
    }

    .currency-icon {
        width: 60px;
        height: 60px;
    }

    .banner-title {
        font-style: normal;
        font-weight: 300;
        font-size: 56px;
        line-height: 65px;
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
        line-height: 16px;
    }

    .info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 36px;
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
}

.banner-container {
    width: 100% !important;
    background-image: url("~@/assets/bg/banner_strategy_bg.svg");
    background-color: #E5E7EA !important;
}

.main-col {
    margin-left: 3%;
    margin-right: 3%;
}

.banner-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    color: #333333;
}

.info-container, .info-container-capacity {
    background-color: #E5E7EA !important;
    border: 1px solid #CED2D8;
    border-radius: 6px;
}

.info-title {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.info-value {
    font-family: 'Roboto', sans-serif;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #1C95E7;
}

.bordered-col {
    border-left: 1px solid #CED2D8 !important;
    border-right: 1px solid #CED2D8 !important;
}

.label-error {
    color: #CF3F92 !important;
}

.progress-info {
    background: #D7DADF;
}

.capacity-status-text {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #29323E;
}

.capacity-status-value {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #1C95E7;
}

.capacity-status-sub-text {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #ADB3BD;
}
</style>

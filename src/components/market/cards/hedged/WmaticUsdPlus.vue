<template>
    <v-row class="card-container ma-0">
        <v-col>
            <v-row class="card-row mt-7" justify="end" align="center">
                <label class="tag-label">Exchange-traded strategy / moderate risk</label>
                <v-icon class="tag-icon" :class="$wu.isMobile() ? 'ml-1' : 'ml-2'" :size="$wu.isMobile() ? 12 : 16">mdi-star-circle</v-icon>
            </v-row>

            <v-row class="card-row mt-12" justify="start" align="center">
                <div class="currency-icon">
                    <v-img :src="require('@/assets/currencies/market/WmaticUsdPlus.svg')"/>
                </div>
                <label class="card-title ml-3">ETS: USD+ / WMatic</label>
                <v-spacer></v-spacer>
                <div class="currency-icon">
                    <v-img :src="require('@/assets/network/polygon.svg')"/>
                </div>
            </v-row>

            <v-row class="card-row mt-12" :class="$wu.isMobile ? '' : 'mb-15'" justify="start" align="center">
                <label class="card-info">Earn Yields on your USD+/WMATIC while hedging against WMatic's volatility by borrowing it</label>
            </v-row>

            <v-row class="card-row info-row mt-15" justify="start" align="center">
                <label class="card-info mt-1">APY</label>
                <v-spacer></v-spacer>
                <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.apy) ? ($utils.formatMoneyComma(wmaticStrategyData.apy, 1)) + '%' : '—' }}</label>
                <Tooltip text="Strategy APY based on 7-day average, includes fees taken (fee-adjusted)"/>
            </v-row>

            <v-row class="card-row info-row mt-6" justify="start" align="center">
                <label class="card-info mt-1">Diff. to USD+</label>
                <v-spacer></v-spacer>
                <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.diffApy) ? ((wmaticStrategyData.diffApy >= 0 ? '+' : '') + $utils.formatMoneyComma(wmaticStrategyData.diffApy, 1)) + '%' : '—' }}</label>
                <Tooltip text="APY difference compared to the base APY USD+ (based on 7-day average)"/>
            </v-row>

            <v-row class="card-row info-row mt-6" justify="start" align="center">
                <label class="card-info mt-1">Risk factor</label>
                <v-spacer></v-spacer>
                <label class="card-info-value card-info-risk">Moderate</label>
                <Tooltip text="Risk Factor is determined by a Pool's downside volatility. Pools that have a low Risk Factor translates to smaller downside volatility."/>
            </v-row>

            <v-row class="card-row info-row mt-6" justify="start" align="center">
                <label class="card-info mt-1">TVL</label>
                <v-spacer></v-spacer>
                <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.tvl) ? ('$' + $utils.formatMoneyComma(wmaticStrategyData.tvl, 2)) : '—' }}</label>
            </v-row>

            <v-row class="card-row card-banner-status-container mt-12" justify="start" align="center">
                <v-col class="card-banner-body">
                    <v-row justify="start" align="center">
                        <label class="capacity-status-text">ETS capacity status</label>
                        <v-spacer></v-spacer>
                        <label class="capacity-status-value" :class="totalSupply.usdPlusWmatic >= maxUsdPlusWmaticSupply ? 'label-error' : ''">
                            {{ totalSupply.usdPlusWmatic >= maxUsdPlusWmaticSupply ? 'FULL' : 'AVAILABLE' }}
                        </label>
                    </v-row>
                    <v-row justify="start" align="center" class="mt-5">
                        <v-progress-linear
                                rounded
                                height="7"
                                class="progress-info"
                                background-opacity="0"
                                :value="(totalSupply.usdPlusWmatic / maxUsdPlusWmaticSupply) * 100"
                                :color="totalSupply.usdPlusWmatic >= maxUsdPlusWmaticSupply ? '#CF3F92' : '#1C95E7'"
                        ></v-progress-linear>
                    </v-row>
                    <v-row justify="start" align="center" class="mt-5">
                        <label class="capacity-status-sub-text">${{ $utils.formatMoneyComma(totalSupply.usdPlusWmatic, 2) }}</label>
                        <v-spacer></v-spacer>
                        <label class="capacity-status-sub-text">${{ $utils.formatMoneyComma(maxUsdPlusWmaticSupply, 2) }}</label>
                    </v-row>
                    <v-row justify="start" align="center">
                        <label class="capacity-status-sub-text">CURRENT TVL</label>
                        <v-spacer></v-spacer>
                        <label class="capacity-status-sub-text">MAX TVL</label>
                    </v-row>
                </v-col>
            </v-row>

            <v-row class="card-row card-banner-container mt-7" justify="start" align="center">
                <v-col class="card-banner-body">
                    <v-row align="center">
                        <div class="card-banner-icon">
                            <v-img :src="require('@/assets/icon/history.svg')"/>
                        </div>
                        <label :class="$wu.isMobile() ? 'card-info-banner' : 'card-info'" class="ml-2">Hedging against MATIC price volatility</label>
                    </v-row>
                    <v-row align="center">
                        <div class="card-banner-icon mt-4">
                            <v-img :src="require('@/assets/icon/refresh.svg')"/>
                        </div>
                        <label :class="$wu.isMobile() ? 'card-info-banner' : 'card-info'" class="mt-4 ml-2">Automatically managed liquidation ratio</label>
                    </v-row>
                    <v-row align="center">
                        <div class="card-banner-icon mt-4">
                            <v-img :src="require('@/assets/icon/coins.svg')"/>
                        </div>
                        <label :class="$wu.isMobile() ? 'card-info-banner' : 'card-info'" class="mt-4 ml-2">Low fees</label>
                    </v-row>
                </v-col>
            </v-row>

            <v-row class="card-row mt-15 mb-7" justify="center" align="center">
                <v-btn class="open-strategy-btn" @click="openStrategyAction">open strategy</v-btn>
            </v-row>
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import Tooltip from "@/components/common/element/Tooltip";
import {mapGetters} from "vuex";

export default {
    name: "WmaticUsdPlus",

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
        openStrategyAction() {
            this.$router.push('/ets');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .tag-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        letter-spacing: 0.04em;
    }

    .currency-icon {
        width: 40px;
        height: 40px;
    }

    .card-banner-icon {
        width: 24px;
        height: 24px;
    }

    .card-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 28px;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-banner {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .open-strategy-btn {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
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
    .tag-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.04em;
    }

    .currency-icon {
        width: 40px;
        height: 40px;
    }

    .card-banner-icon {
        width: 24px;
        height: 24px;
    }

    .card-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 36px;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .card-info-banner {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .open-strategy-btn {
        height: 40px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
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
    .tag-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.04em;
    }

    .currency-icon {
        width: 40px;
        height: 40px;
    }

    .card-banner-icon {
        width: 24px;
        height: 24px;
    }

    .card-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 36px;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .card-info-banner {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .open-strategy-btn {
        height: 40px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
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

.card-container {
    background: #FFFFFF !important;
    border-radius: 4px !important;
    max-width: 480px !important;
}

.card-banner-status-container {
    background: #F5F5F5;
    border-radius: 4px;
}

.card-banner-container {
    background: linear-gradient(91.26deg, rgba(40, 160, 240, 0.1) 0%, rgba(6, 120, 196, 0.09917) 100%);
    border-radius: 4px;
}

.tag-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #CF3F92;
}

.tag-icon {
    color: #CF3F92;
}

.card-title {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.card-info {
    font-family: 'Roboto', sans-serif;
    color: #333333;
}

.card-info-banner {
    font-family: 'Roboto', sans-serif;
    color: #333333;
}

.card-info-value {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #3E5463;
}

.card-info-risk {
    color: #CF3F92 !important;
}

.info-row {
    border-top: 1px solid #CED2D8;
}

.card-banner-body {
    margin: 5% 3%;
}

.open-strategy-btn {
    width: 100% !important;
    border-radius: 2px;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    background: var(--blue-gradient);
    color: #FFFFFF !important;
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

<template>
    <v-row align="center" justify="start" class="banner-container ma-0">
        <v-col class="main-col">
            <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-1 mb-3' : 'mb-12'">
                <div class="currency-icon">
                    <v-img :src="require('@/assets/currencies/market/BusdWbnb.svg')"/>
                </div>
                <label class="banner-title ml-4">ETS: BUSD / WBNB</label>
                <v-icon class="mb-9" color="#333333">mdi-beta</v-icon>
                <v-spacer></v-spacer>
                <div class="network-icon">
                    <v-img :src="require('@/assets/network/bsc.svg')"/>
                </div>
            </v-row>

            <v-row class="d-flex">
                <v-col :cols="$wu.isFull() ? 7 : 12">
                    <v-row align="center" justify="start" class="info-container ma-0">
                        <v-col>
                            <v-row justify="center" align="center" class="ma-0">
                                <label class="info-title mt-1">APY</label>
                                <Tooltip text="Strategy APY based on 7-day average, includes fees taken (fee-adjusted)"/>
                            </v-row>
                            <v-row justify="center" align="center" class="mt-2">
                                <label class="info-value mr-n1">{{ (busdWbnbStrategyData && busdWbnbStrategyData.apy) ? ($utils.formatMoneyComma(busdWbnbStrategyData.apy, 0)) + '%' : '—' }}</label>
                            </v-row>
                        </v-col>
                        <v-col class="bordered-col" cols="5">
                            <v-row justify="center" align="center" class="ma-0">
                                <label class="info-title mt-1">TVL</label>
                                <Tooltip text="Past 2 hours"/>
                            </v-row>
                            <v-row justify="center" align="center" class="mt-2">
                                <label class="info-value">
                                    {{ (busdWbnbStrategyData && busdWbnbStrategyData.tvl) ? ('$' + $utils.formatMoneyComma(busdWbnbStrategyData.tvl, 2)) : '—' }}
                                </label>
                            </v-row>
                        </v-col>
                        <v-col>
                            <v-row justify="center" align="center" class="ma-0">
                                <label class="info-title mt-1">Users</label>
                            </v-row>
                            <v-row justify="center" align="center" class="mt-2">
                                <label class="info-value">{{ (busdWbnbStrategyData && busdWbnbStrategyData.holders) ? $utils.formatMoneyComma(busdWbnbStrategyData.holders, 0) : '—' }}</label>
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
                                <label class="capacity-status-value" :class="totalSupply.busdWbnb >= maxBusdWbnbSupply ? 'label-error' : ''">
                                    {{ totalSupply.busdWbnb >= maxBusdWbnbSupply ? 'FULL' : 'AVAILABLE' }}
                                </label>
                            </v-row>
                            <v-row class="ma-0 mt-2" justify="start" align="center">
                                <v-progress-linear
                                        rounded
                                        height="7"
                                        class="progress-info"
                                        background-opacity="0"
                                        :value="(totalSupply.busdWbnb / maxBusdWbnbSupply) * 100"
                                        :color="totalSupply.busdWbnb >= maxBusdWbnbSupply ? '#CF3F92' : '#1C95E7'"
                                ></v-progress-linear>
                            </v-row>
                            <v-row class="ma-0 mt-2" justify="start" align="center">
                                <label class="capacity-status-sub-text">${{ $utils.formatMoneyComma(totalSupply.busdWbnb, 2) }}</label>
                                <v-spacer></v-spacer>
                                <label class="capacity-status-sub-text">${{ $utils.formatMoneyComma(maxBusdWbnbSupply, 2) }}</label>
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
import Tooltip from "@/components/common/element/Tooltip";

export default {
    name: "StrategyBanner",

    components: {
        Tooltip
    },

    props: {
    },

    computed: {
        ...mapGetters('marketData', ['busdWbnbStrategyData']),
        ...mapGetters('supplyData', ['totalSupply', 'maxBusdWbnbSupply']),
        ...mapGetters('accountData', ['balance']),
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
    background-color: var(--main-banner-background) !important;
}

.main-col {
    margin-left: 3%;
    margin-right: 3%;
}

.banner-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    color: var(--secondary-gray-text);
}

.info-container, .info-container-capacity {
    background-color: var(--main-banner-background) !important;
    border: 1px solid var(--secondary-border);
    border-radius: 6px;
}

.info-title {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.info-value {
    font-family: 'Roboto', sans-serif;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.bordered-col {
    border-left: 1px solid var(--secondary-border) !important;
    border-right: 1px solid var(--secondary-border) !important;
}

.label-error {
    color: #CF3F92 !important;
}

.label-overcap {
    color: #F3BA2F !important;
}

.label-success {
    color: #22ABAC !important;
}

.progress-info {
    background: #D7DADF;
}

.capacity-status-text {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--info-base);
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
    color: var(--third-gray-text);
}
</style>

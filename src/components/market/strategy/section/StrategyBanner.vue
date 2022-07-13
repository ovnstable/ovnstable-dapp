<template>
    <v-row align="center" justify="start" class="banner-container ma-0">
        <v-col class="main-col">
            <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-1 mb-3' : 'mb-12'">
                <div class="currency-icon">
                    <v-img :src="require('@/assets/currencies/market/WmaticUsdPlus.svg')"/>
                </div>
                <label class="banner-title ml-4">USD+ / WMatic</label>
                <v-spacer></v-spacer>
                <div class="network-icon">
                    <v-img :src="require('@/assets/network/polygon.svg')"/>
                </div>
            </v-row>

            <v-row align="center" justify="start" class="info-container ma-0">
                <v-col>
                    <v-row justify="center" align="center" class="ma-0">
                        <label class="info-title">APY</label>
                    </v-row>
                    <v-row justify="center" align="center" class="mt-2">
                        <label class="info-value">{{ (wmaticStrategyData && wmaticStrategyData.apy) ? ($utils.formatMoneyComma(wmaticStrategyData.apy, 0)) + '%' : '—' }}</label>
                    </v-row>
                </v-col>
                <v-col class="bordered-col">
                    <v-row justify="center" align="center" class="ma-0">
                        <label class="info-title">TVL</label>
                    </v-row>
                    <v-row justify="center" align="center" class="mt-2">
                        <label class="info-value">{{ (wmaticStrategyData && wmaticStrategyData.tvl) ? ('$' + $utils.formatMoneyComma(wmaticStrategyData.tvl, 2)) : '—' }}</label>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row justify="center" align="center" class="ma-0">
                        <label class="info-title">Investors</label>
                    </v-row>
                    <v-row justify="center" align="center" class="mt-2">
                        <label class="info-value">{{ (wmaticStrategyData && wmaticStrategyData.holders) ? $utils.formatMoneyComma(wmaticStrategyData.holders, 0) : '—' }}</label>
                    </v-row>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
import {mapGetters} from "vuex";
import moment from "moment";

export default {
    name: "StrategyBanner",

    components: {
    },

    props: {
    },

    computed: {
        ...mapGetters('marketData', ['wmaticStrategyData']),
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
        height: 150px !important;
    }

    .currency-icon {
        width: 40px;
        height: 40px;
    }

    .banner-title {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 28px;
    }

    .network-icon {
        width: 28px;
        height: 28px;
    }

    .info-container {
        width: 100% !important;
        height: 70px !important;
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
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
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
        width: 60% !important;
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

.info-container {
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
</style>

<template>
    <div>
        <!-- TODO: add rates container -->

        <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-5' : 'mt-10'">
            <label class="section-title-label">
                Owned/Lent/Borrowed Assets
            </label>
        </v-row>

        <v-row align="start" justify="start" class="ma-0 mt-6">
            <v-col :cols="$wu.isMobile() ? 12 : 0">
                <v-row class="info-card-container" justify="start" align="center">
                    <v-col class="info-card-body">
                        <v-row align="center">
                            <label class="title-card-text">OWNED</label>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-1">Token</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">{{ wmaticStrategyData ? wmaticStrategyData.ownedAsset.token : '—' }}</label>
                            <div class="info-card-icon ml-2">
                                <v-img :src="require('@/assets/currencies/usdPlus.svg')"/>
                            </div>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-1">Balance</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">
                                {{ wmaticStrategyData ? $utils.formatMoneyComma(wmaticStrategyData.ownedAsset.amount, 0) : '—' }}
                                {{ wmaticStrategyData ? wmaticStrategyData.ownedAsset.token : '—' }}
                            </label>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-1">Value</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">
                                {{ wmaticStrategyData ? $utils.formatMoneyComma(wmaticStrategyData.ownedAsset.amountUsdc, 0) : '—' }}
                                USDC
                            </label>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>

            <v-col :class="$wu.isMobile() ? 'mt-4' : 'ml-5'" :cols="$wu.isMobile() ? 12 : 0">
                <v-row class="info-card-container" justify="start" align="center">
                    <v-col class="info-card-body">
                        <v-row align="center">
                            <label class="title-card-text">lent</label>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-1">Token</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">{{ wmaticStrategyData ? wmaticStrategyData.depositAsset.token : '—' }}</label>
                            <div class="info-card-icon ml-2">
                                <v-img :src="require('@/assets/currencies/usdc.png')"/>
                            </div>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-1">Balance</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">
                                {{ wmaticStrategyData ? $utils.formatMoneyComma(wmaticStrategyData.depositAsset.amount, 0) : '—' }}
                                {{ wmaticStrategyData ? wmaticStrategyData.depositAsset.token : '—' }}
                            </label>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-1">Value</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">
                                {{ wmaticStrategyData ? $utils.formatMoneyComma(wmaticStrategyData.depositAsset.amountUsdc, 0) : '—' }}
                                USDC
                            </label>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>

            <v-col :class="$wu.isMobile() ? 'mt-4' : 'ml-5'" :cols="$wu.isMobile() ? 12 : 0">
                <v-row class="info-card-container" justify="start" align="center">
                    <v-col class="info-card-body">
                        <v-row align="center">
                            <label class="title-card-text">borrowed</label>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-1">Token</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">{{ wmaticStrategyData ? wmaticStrategyData.borrowedAsset.token : '—' }}</label>
                            <div class="info-card-icon ml-2">
                                <v-img :src="require('@/assets/currencies/wMatic.svg')"/>
                            </div>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-1">Balance</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">
                                {{ wmaticStrategyData ? $utils.formatMoneyComma(wmaticStrategyData.borrowedAsset.amount, 0) : '—' }}
                                {{ wmaticStrategyData ? wmaticStrategyData.borrowedAsset.token : '—' }}
                            </label>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-1">Value</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">
                                {{ wmaticStrategyData ? $utils.formatMoneyComma(wmaticStrategyData.borrowedAsset.amountUsdc, 0) : '—' }}
                                USDC
                            </label>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row align="start" justify="start" class="ma-0 mt-6">
            <v-col cols="12" v-if="!$wu.isMobile()">
                <v-row class="info-card-container-bottom" justify="start" align="center">
                    <v-col class="info-card-body-bottom">
                        <v-row align="center">
                            <div class="info-card-icon">
                                <v-img :src="require('@/assets/currencies/market/Aave.svg')"/>
                            </div>
                            <label class="title-card-text-bottom ml-2">Aave V2</label>
                            <v-spacer></v-spacer>
                            <label class="card-info">Current health factor</label>
                            <label class="card-info-value ml-2">{{ (wmaticStrategyData && wmaticStrategyData.currentHealthFactor) ? ($utils.formatMoneyComma(wmaticStrategyData.currentHealthFactor, 2)) : '—' }}</label>
                            <Tooltip text="What is Health Factor?" link="https://docs.aave.com/risk/asset-risk/risk-parameters#health-factor"/>
                            <v-spacer></v-spacer>
                            <label class="card-info">Target Health factor</label>
                            <label class="card-info-value ml-2">{{ (wmaticStrategyData && wmaticStrategyData.targetHealthFactor) ? ($utils.formatMoneyComma(wmaticStrategyData.targetHealthFactor, 2)) : '—' }}</label>
                            <v-spacer></v-spacer>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="12" v-else>
                <v-row class="info-card-container-bottom">
                    <v-col class="info-card-body-bottom">
                        <v-row align="center" justify="center">
                            <div class="info-card-icon">
                                <v-img :src="require('@/assets/currencies/market/Aave.svg')"/>
                            </div>
                            <label class="title-card-text-bottom ml-2">Aave V2</label>
                        </v-row>
                        <v-row align="center" justify="center" class="mt-6">
                            <label class="card-info">Current health factor</label>
                            <label class="card-info-value ml-2">{{ (wmaticStrategyData && wmaticStrategyData.currentHealthFactor) ? ($utils.formatMoneyComma(wmaticStrategyData.currentHealthFactor, 2)) : '—' }}</label>
                            <Tooltip text="What is Health Factor?" link="https://docs.aave.com/risk/asset-risk/risk-parameters#health-factor"/>
                        </v-row>
                        <v-row align="center" justify="center" class="mt-4">
                            <label class="card-info">Target Health factor</label>
                            <label class="card-info-value ml-2">{{ (wmaticStrategyData && wmaticStrategyData.targetHealthFactor) ? ($utils.formatMoneyComma(wmaticStrategyData.targetHealthFactor, 2)) : '—' }}</label>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-6'" justify="start" align="center">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <label class="section-title-label">USD+/wMatic payouts</label>
                </v-row>

                <v-row align="center" justify="center">
                    <v-col :cols="!$wu.isFull() ? 12 : 8">
                        <Table v-if="!$wu.isMobile()"/>
                        <Table minimized v-else/>
                        <v-row justify="center" align="center" class="ma-0 mb-10 scroll-container">
                            <label class="table-scroll-label">scroll to see more</label>
                        </v-row>
                    </v-col>

                    <v-col :cols="!$wu.isFull() ? 12 : 4">
                        <Doughnut :size="280"/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";
import Table from "@/components/market/strategy/payouts/Table";
import Doughnut from "@/components/market/strategy/payouts/Doughnut";
export default {
    name: "PerformanceTab",

    components: {
        Doughnut,
        Table,
        Tooltip,
    },

    data: () => ({
    }),

    computed: {
        ...mapGetters('marketData', ['wmaticStrategyData']),
    },

    methods: {
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.03em;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.03em;
    }

    .info-card-icon {
        width: 20px;
        height: 20px;
    }

    .title-card-text-bottom {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.02em;
    }

    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .title-card-text-bottom {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.02em;
    }

    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .title-card-text-bottom {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }
}

.section-title-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    text-transform: uppercase;
    color: #333333;
}

.info-card-container {
    background: #FFFFFF;
    border-radius: 4px;
}

.info-card-container-bottom {
    background: #E5E7EA;
    border-radius: 4px;
}

.info-card-body {
    margin: 5% 3%;
}

.info-card-body-bottom {
    margin: 2% 2%;
}

.info-row {
    border-top: 1px solid #CED2D8;
}

.title-card-text {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.card-info {
    font-family: 'Roboto', sans-serif;
    color: #333333;
}

.card-info-value {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #3E5463;
}

.title-card-text-bottom {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.table-scroll-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #ADB3BD;
}

.scroll-container {
    height: 24px !important;
    background: #F5F5F5;
}
</style>

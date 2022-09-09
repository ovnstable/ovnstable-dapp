<template>
    <div>
        <v-row class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-10'" justify="start" align="center">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <v-col class="ml-n3 mt-n3">
                        <v-btn outlined class="rate-tab-btn" @click="rateTab=1" v-bind:class="activeRateApy">
                            APY
                        </v-btn>
                    </v-col>
                    <v-col class="mr-n3 mt-n3">
                        <v-btn outlined class="rate-tab-btn" @click="rateTab=3" v-bind:class="activeRateTvl">
                            TVL
                        </v-btn>
                    </v-col>
                </v-row>

                <ChartApy class="mx-n3" v-if="rateTab === 1" :data="apyData" :usdPlusData="payoutsApyDataDict" ets-name="USD+/WBNB"/>
                <ChartTvl class="mx-n3" v-if="rateTab === 3" :data="tvlData" ets-name="USD+/WBNB"/>
            </v-col>
        </v-row>

        <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-5' : 'mt-10'">
            <label class="section-title-label">
                Owned/Lent/Borrowed Assets
            </label>

            <v-spacer></v-spacer>

            <div v-if="!$wu.isMobile()" class="info-card-container-debank" @click="openLink('https://debank.com/profile/0xFA8c193168A38911687cFfC511a1ECf465F2E6ee')">
                <v-row class="ma-0" justify="start" align="center">
                    <div class="info-card-icon ml-2 my-2">
                        <v-img class="debank-icon" :src="require('@/assets/currencies/market/debank.svg')"/>
                    </div>
                    <label class="title-card-debank ma-2">View on DeBank</label>
                </v-row>
            </div>
        </v-row>

        <v-row v-if="$wu.isMobile()" align="center" justify="start" class="ma-0 mt-5">
            <div class="info-card-container-debank" style="width: 100% !important;" @click="openLink('https://debank.com/profile/0xFA8c193168A38911687cFfC511a1ECf465F2E6ee')">
                <v-row class="ma-0" justify="center" align="center">
                    <div class="info-card-icon ml-2 my-2">
                        <v-img class="debank-icon" :src="require('@/assets/currencies/market/debank.svg')"/>
                    </div>
                    <label class="title-card-debank ma-2">View on DeBank</label>
                </v-row>
            </div>
        </v-row>

        <v-row v-if="wmaticStrategyData.ownedAsset" align="start" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-4' : 'mt-4'">
            <v-col :cols="$wu.isMobile() ? 12 : 0">
                <v-row class="info-card-container" justify="start" align="center">
                    <v-col class="info-card-body">
                        <v-row align="center">
                            <label class="title-card-text">OWNED</label>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-2">Token</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">{{ wmaticStrategyData ? wmaticStrategyData.ownedAsset.token : '—' }}</label>
                            <div class="info-card-icon ml-2">
                                <v-img :src="require('@/assets/currencies/usdPlus_new.svg')"/>
                            </div>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-2">Balance</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">
                                {{ wmaticStrategyData ? $utils.formatMoneyComma(wmaticStrategyData.ownedAsset.amount, 0) : '—' }}
                                {{ wmaticStrategyData ? wmaticStrategyData.ownedAsset.token : '—' }}
                            </label>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-2">Value</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">
                                {{ wmaticStrategyData ? $utils.formatMoneyComma(wmaticStrategyData.ownedAsset.amountUsdc, 0) : '—' }}
                                USD
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
                            <label class="card-info mt-2">Token</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">{{ wmaticStrategyData ? wmaticStrategyData.depositAsset.token : '—' }}</label>
                            <div class="info-card-icon ml-2">
                                <v-img :src="require('@/assets/currencies/busd.svg')"/>
                            </div>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-2">Balance</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">
                                {{ wmaticStrategyData ? $utils.formatMoneyComma(wmaticStrategyData.depositAsset.amount, 0) : '—' }}
                                {{ wmaticStrategyData ? wmaticStrategyData.depositAsset.token : '—' }}
                            </label>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-2">Value</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">
                                {{ wmaticStrategyData ? $utils.formatMoneyComma(wmaticStrategyData.depositAsset.amountUsdc, 0) : '—' }}
                                USD
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
                            <label class="card-info mt-2">Token</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">{{ wmaticStrategyData ? wmaticStrategyData.borrowedAsset.token : '—' }}</label>
                            <div class="info-card-icon ml-2">
                                <v-img :src="require('@/assets/currencies/wBnb.svg')"/>
                            </div>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-2">Balance</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">
                                {{ wmaticStrategyData ? $utils.formatMoneyComma(wmaticStrategyData.borrowedAsset.amount, 0) : '—' }}
                                {{ wmaticStrategyData ? wmaticStrategyData.borrowedAsset.token : '—' }}
                            </label>
                        </v-row>
                        <v-row class="info-row mt-8" justify="start" align="center">
                            <label class="card-info mt-2">Value</label>
                            <v-spacer></v-spacer>
                            <label class="card-info-value">
                                {{ wmaticStrategyData ? $utils.formatMoneyComma(wmaticStrategyData.borrowedAsset.amountUsdc, 0) : '—' }}
                                USD
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
                                <v-img :src="require('@/assets/currencies/market/Venus.png')"/>
                            </div>
                            <label class="title-card-text-bottom ml-2">VENUS</label>
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
                                <v-img :src="require('@/assets/currencies/market/Venus.png')"/>
                            </div>
                            <label class="title-card-text-bottom ml-2">VENUS</label>
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
                    <label class="section-title-label">USD+/WBNB payouts</label>
                </v-row>

                <v-row align="center" justify="center">
                    <v-col :cols="!$wu.isFull() ? 12 : 8">
                        <Table
                                v-if="!$wu.isMobile()"
                                profit-label="BUSD per USD+/WBNB"
                                :payout-data="[...wmaticStrategyData.payoutItems].reverse()"/>

                        <Table
                                v-else
                                minimized
                                profit-label="BUSD per USD+/WBNB"
                                :payout-data="[...wmaticStrategyData.payoutItems].reverse()"/>

                        <v-row justify="center" align="center" class="ma-0 mb-10 scroll-container">
                            <label class="table-scroll-label">scroll to see more</label>
                        </v-row>
                    </v-col>

                    <v-col :cols="!$wu.isFull() ? 12 : 4">
                        <Doughnut :size="280" color="#F3BA2F" :last-date="lastPayoutDate"/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";
import Table from "@/components/market/strategy/payouts/Table";
import Doughnut from "@/components/market/strategy/payouts/Doughnut";
import LineChartApy from "@/components/stats/widget/LineChartApy";
import ChartApy from "@/components/market/strategy/chart/ChartApy";
import ChartTvl from "@/components/market/strategy/chart/ChartTvl";
export default {
    name: "PerformanceTab",

    components: {
        ChartTvl,
        ChartApy,
        LineChartApy,
        Doughnut,
        Table,
        Tooltip,
    },

    data: () => ({
        rateTab: 1,
    }),

    computed: {
        ...mapGetters('marketData', ['wmaticStrategyData', 'apyData', 'tvlData']),
        ...mapGetters("statsData", ['payoutsApyDataDict']),

        activeRateApy: function () {
            return {
                'rate-tab-button': this.rateTab === 1,
                'rate-tab-button-in-active': this.rateTab !== 1,
            }
        },

        activeRateDist: function () {
            return {
                'rate-tab-button': this.rateTab === 2,
                'rate-tab-button-in-active': this.rateTab !== 2,
            }
        },

        activeRateTvl: function () {
            return {
                'rate-tab-button': this.rateTab === 3,
                'rate-tab-button-in-active': this.rateTab !== 3,
            }
        },

        lastPayoutDate: function () {
            return (this.wmaticStrategyData.payoutItems.length > 0) ? this.wmaticStrategyData.payoutItems[this.wmaticStrategyData.payoutItems.length - 1].payableDate : [];
        },
    },

    methods: {
        openLink(url) {
            window.open(url, '_blank').focus();
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 32px;
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
        font-weight: 400;
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

    .title-card-debank {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .rate-tab-btn {
        height: 32px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
        letter-spacing: 0.03em !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 36px;
        letter-spacing: 0.04em;
    }

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.02em;
    }

    .card-info {
        font-style: normal;
        font-weight: 400;
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

    .title-card-debank {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .rate-tab-btn {
        height: 40px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 36px;
        letter-spacing: 0.04em;
    }

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.02em;
    }

    .card-info {
        font-style: normal;
        font-weight: 400;
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

    .title-card-debank {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .rate-tab-btn {
        height: 40px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }
}

.section-title-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    text-transform: capitalize;
    color: var(--secondary-gray-text);
}

.info-card-container {
    background: #FFFFFF;
    border-radius: 4px;
}

.info-card-container-bottom {
    background: #E5E7EA;
    border-radius: 4px;
}

.info-card-container-debank {
    background: #FFFFFF;
    border-radius: 4px;
    cursor: pointer !important;
}

.info-card-body {
    margin: 5% 3%;
}

.info-card-body-bottom {
    margin: 2% 2% !important;
}

.info-row {
    border-top: 1px solid #CED2D8;
}

.title-card-text {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.card-info {
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text);
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
    color: var(--secondary-gray-text);
}

.title-card-debank {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #fe815f;
    cursor: pointer !important;
}

.table-scroll-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-lightgray-text);
}

.scroll-container {
    height: 24px !important;
    background: var(--main-background);
}

.rate-tab-btn {
    width: 100% !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.rate-tab-button {
    background: rgba(28, 149, 231, 0.1);
    border-radius: 4px;
    border: none !important;
    color: #1C95E7 !important;
}

.rate-tab-button-in-active {
    border-radius: 4px;
    color: #707A8B !important;
    border: 1px solid #DEE1E5 !important;
}

.debank-icon {
    margin-top: -2px !important;
}
</style>

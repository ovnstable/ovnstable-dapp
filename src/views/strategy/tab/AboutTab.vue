<template>
    <div>
        <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-5' : 'mt-10'">
            <label class="strategy-info-label">
                The exchange-traded strategy USD+/WMATIC ($USD+WMATIC), is an ERC-20 structured product built on Polygon that lets you leverage a collateralized debt position (USDC lent on AAVE) to borrow a volatile asset (WMATIC), pair it with USD+ stablecoin, and provide USD+/WMATIC liquidity on Dystopia / Penrose all in one action. This allows earning high APY and hedging against WMATIC volatility.
                <br/><br/>
                The unique feature of USD+/WMATIC ETS is that it automatically administers a health factor of 1.5x on AAVE and rebalances your Lent/Borrowed amounts to maintain a stringent 1.5x Health Factor. Payouts are happening every day and are auto compounded back into the strategy to further amplify rewards.
                <br/><br/>
                Users also benefit from minimal gas costs associated with minting, redeeming, and all other DeFi activities because this product is deployed on Polygon - a highly scalable L2 chain.
            </label>
        </v-row>

        <v-row align="start" justify="start" class="ma-0 mt-10">
            <v-col :cols="$wu.isMobile() ? 12 : 6">
                <v-row class="info-card-container" justify="start" align="center">
                    <v-col class="info-card-body">
                        <v-row align="center">
                            <label class="title-card-text">Your benefits</label>
                            <v-spacer></v-spacer>
                            <div class="title-card-icon">
                                <v-img :src="require('@/assets/icon/addtask.svg')"/>
                            </div>
                        </v-row>
                        <v-row align="center">
                            <div class="info-card-icon mt-5">
                                <v-img :src="require('@/assets/icon/checkbox.svg')"/>
                            </div>
                            <label class="info-card-text mt-5 ml-2">Hedging against MATIC price volatility</label>
                        </v-row>
                        <v-row align="center">
                            <div class="info-card-icon mt-4">
                                <v-img :src="require('@/assets/icon/checkbox.svg')"/>
                            </div>
                            <label class="info-card-text mt-4 ml-2">Hassle-free all-in-one swap action</label>
                        </v-row>
                        <v-row align="center">
                            <div class="info-card-icon mt-4">
                                <v-img :src="require('@/assets/icon/checkbox.svg')"/>
                            </div>
                            <label class="info-card-text mt-4 ml-2">Automatically monitored and managed</label>
                            <label class="info-card-text" :class="$wu.isMobile() ? 'ml-7' : 'ml-8'">liquidation ratio of 1.5</label>
                        </v-row>
                        <v-row align="center">
                            <div class="info-card-icon mt-4">
                                <v-img :src="require('@/assets/icon/checkbox.svg')"/>
                            </div>
                            <label class="info-card-text mt-4 ml-2">Low fees</label>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
            <v-col :class="$wu.isMobile() ? 'mt-2' : 'ml-5'">
                <v-row class="info-card-container-red" justify="start" align="center">
                    <v-col class="info-card-body">
                        <v-row align="center">
                            <label class="title-card-text">Your risks</label>
                            <v-spacer></v-spacer>
                            <div class="title-card-icon">
                                <v-img :src="require('@/assets/icon/bell.svg')"/>
                            </div>
                        </v-row>
                        <v-row align="center">
                            <div class="info-card-icon mt-5">
                                <v-img :src="require('@/assets/icon/remove.svg')"/>
                            </div>
                            <label class="info-card-text mt-5 ml-2">Impermanent loss</label>
                        </v-row>
                        <v-row align="center">
                            <div class="info-card-icon mt-4">
                                <v-img :src="require('@/assets/icon/remove.svg')"/>
                            </div>
                            <label class="info-card-text mt-4 ml-2">AMM contract hack risk</label>
                        </v-row>
                        <v-row align="center">
                            <label class="info-card-link mt-4 ml-1" @click="showRiskModal">Learn more about risks</label>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row align="center" justify="start" class="ma-0 mt-15">
            <label class="section-title-label">
                HOW IT WORKS
            </label>
        </v-row>

        <v-row align="start" justify="start" class="ma-0 mt-7">
            <v-col :cols="$wu.isMobile() ? 12 : 5">
                <v-row justify="start" align="start">
                    <v-col cols="1">
                        <v-row justify="start" align="start">
                            <label class="list-title-num">1</label>
                        </v-row>
                    </v-col>
                    <v-col class="ml-3">
                        <v-row justify="start" align="start">
                            <label class="list-title-text">Deposit Into Strategy</label>
                        </v-row>
                        <v-row class="mt-8">
                            <label class="list-sub-title-text">Deposit USD+ into the vault. This triggers an automatic borrow of value of WMATIC (from AAVE v3 markets), which is invested alongside your USD+ deposit into Dystopia’s WMATIC/USD+ pool.</label>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row justify="start" align="start" class="mt-15">
                    <v-col cols="1">
                        <v-row justify="start" align="start">
                            <label class="list-title-num">2</label>
                        </v-row>
                    </v-col>
                    <v-col class="ml-3">
                        <v-row justify="start" align="start">
                            <label class="list-title-text">Strategy Generates Yield</label>
                        </v-row>
                        <v-row class="mt-8">
                            <label class="list-sub-title-text">Strategy automatically stakes the earned pool LP tokens into Penrose and auto-compounds the rewards by re-investing into the pool for more LP tokens to maximise Yields.</label>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row justify="start" align="start" class="mt-15">
                    <v-col cols="1">
                        <v-row justify="start" align="start">
                            <label class="list-title-num">3</label>
                        </v-row>
                    </v-col>
                    <v-col class="ml-3">
                        <v-row justify="start" align="start">
                            <label class="list-title-text">Withdraw From Strategy</label>
                        </v-row>
                        <v-row class="mt-8">
                            <label class="list-sub-title-text">Withdraw at any time by choosing what percent of your position you want to withdraw.</label>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="1" v-if="!$wu.isMobile()">
            </v-col>
            <v-col cols="6" v-if="!$wu.isMobile()">
                <v-row justify="end">
                    <v-img class="scheme-img" :src="require('@/assets/market/scheme.svg')"/>
                </v-row>
            </v-col>
        </v-row>

        <v-row align="center" justify="start" class="ma-0 mt-15" v-if="$wu.isMobile()">
            <v-img class="scheme-img" :src="require('@/assets/market/scheme.svg')"/>
        </v-row>

        <v-row align="center" justify="start" class="ma-0 mt-15">
            <label class="section-title-label">
                fee structure
            </label>
        </v-row>

        <v-row align="center" justify="start" class="ma-0 mt-7">
            <v-col :cols="$wu.isMobile() ? 12 : 0">
                <v-row justify="start" align="start">
                    <v-progress-linear
                            rounded
                            height="7"
                            class="progress-info"
                            background-opacity="0"
                            value="10"
                            color="#1C95E7"
                    ></v-progress-linear>
                </v-row>
                <v-row justify="start" align="start" class="mt-5">
                    <label class="progress-text">{{ performanceFee ? $utils.formatMoneyComma(performanceFee, 0) + '%' : '—' }}</label>
                </v-row>
                <v-row justify="start" align="start">
                    <label class="progress-text">Performance weekly fee</label>
                    <v-spacer></v-spacer>
                    <label class="progress-sub-text">your profit</label>
                </v-row>
            </v-col>

            <v-col :class="$wu.isMobile() ? 'mt-4' : 'ml-8'" :cols="$wu.isMobile() ? 12 : 0">
                <v-row justify="start" align="start">
                    <v-progress-linear
                            rounded
                            height="7"
                            class="progress-info"
                            background-opacity="0"
                            value="1"
                            color="#1C95E7"
                    ></v-progress-linear>
                </v-row>
                <v-row justify="start" align="start" class="mt-5">
                    <label class="progress-text">1/365 of {{ managementFee ? $utils.formatMoneyComma(managementFee, 0) + '%' : '—' }}</label>
                    <v-spacer></v-spacer>
                    <label class="progress-sub-text">your balance</label>
                </v-row>
                <v-row justify="start" align="start">
                    <label class="progress-text">management daily fee</label>
                    <v-spacer></v-spacer>
                    <label class="progress-sub-text">in strategy</label>
                </v-row>
            </v-col>

            <v-col :class="$wu.isMobile() ? 'mt-4' : 'ml-8'" :cols="$wu.isMobile() ? 12 : 0">
                <v-row justify="start" align="start">
                    <v-progress-linear
                            rounded
                            height="7"
                            class="progress-info"
                            background-opacity="0"
                            value="1"
                            color="#1C95E7"
                    ></v-progress-linear>
                </v-row>
                <v-row justify="start" align="start" class="mt-5">
                    <label class="progress-text">{{ entryFee ? $utils.formatMoneyComma(entryFee, 2) + '%' : '—' }}</label>
                    <v-spacer></v-spacer>
                    <label class="progress-sub-text">your balance</label>
                </v-row>
                <v-row justify="start" align="start">
                    <label class="progress-text">Enter/exit</label>
                    <v-spacer></v-spacer>
                    <label class="progress-sub-text">in strategy</label>
                </v-row>
            </v-col>
        </v-row>

        <v-row align="center" justify="start" class="ma-0 mt-7">
            <label class="list-sub-title-text">If the daily strategy is profitable, the daily performance fee is charged on the premiums earned, and the day-to-day management fee is set on the assets managed by the strategy. If the daily strategy is unprofitable, there are no performance fees charged.</label>
        </v-row>

        <v-row align="center" justify="start" class="ma-0 mt-15">
            <label class="section-title-label">
                important data
            </label>
        </v-row>

        <v-row class="ma-0 mt-7" justify="start" align="start">
            <v-col>
                <v-row class="info-row" justify="start" align="center">
                    <label class="card-info mt-1">APY</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.apy) ? ($utils.formatMoneyComma(wmaticStrategyData.apy, 1)) + '%' : '—' }}</label>
                    <Tooltip text="Strategy APY based on 7-day average, includes fees taken (fee-adjusted)"/>
                </v-row>
                <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="card-info mt-1">Diff. to USD+</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.diffApy) ? ((wmaticStrategyData.diffApy >= 0 ? '+' : '') + $utils.formatMoneyComma(wmaticStrategyData.diffApy, 1)) + '%' : '—' }}</label>
                    <Tooltip text="APY difference compared to the base APY USD+ (based on 7-day average)"/>
                </v-row>
                <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="card-info mt-1">Risk factor</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-risk">High</label>
                    <Tooltip text="Risk Factor is determined by a Pool's downside volatility. Pools that have a low Risk Factor translates to smaller downside volatility."/>
                </v-row>
                <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="card-info mt-1">TVL</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.tvl) ? ('$' + $utils.formatMoneyComma(wmaticStrategyData.tvl, 2)) : '—' }}</label>
                </v-row>
                <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="card-info mt-1">Users</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.holders) ? $utils.formatMoneyComma(wmaticStrategyData.holders, 0) : '—' }}</label>
                </v-row>

                <v-row class="info-row" justify="start" align="center" v-if="$wu.isMobile()">
                    <label class="card-info mt-1">Target Health Factor</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.targetHealthFactor) ? ($utils.formatMoneyComma(wmaticStrategyData.targetHealthFactor, 1)) : '—' }}</label>
                    <Tooltip text="What is Health Factor?" link="https://docs.aave.com/risk/asset-risk/risk-parameters#health-factor"/>
                </v-row>
                <v-row class="info-row mt-6" justify="start" align="center" v-if="$wu.isMobile()">
                    <label class="card-info mt-1">Health Factor check interval</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.healthFactorCheckInterval) ? wmaticStrategyData.healthFactorCheckInterval : '—' }}<label style="text-transform: none">&nbsp;hours</label></label>
                    <Tooltip text="What is Health Factor?" link="https://docs.aave.com/risk/asset-risk/risk-parameters#health-factor"/>
                </v-row>
            </v-col>
            <v-col cols="1" v-if="!$wu.isMobile()"></v-col>
            <v-col v-if="!$wu.isMobile()">
                <v-row class="info-row" justify="start" align="center">
                    <label class="card-info mt-1">Target Health Factor</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.targetHealthFactor) ? ($utils.formatMoneyComma(wmaticStrategyData.targetHealthFactor, 1)) : '—' }}</label>
                    <Tooltip text="What is Health Factor?" link="https://docs.aave.com/risk/asset-risk/risk-parameters#health-factor"/>
                </v-row>
                <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="card-info mt-1">Health Factor check interval</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.healthFactorCheckInterval) ? wmaticStrategyData.healthFactorCheckInterval : '—' }}<label style="text-transform: none">&nbsp;hours</label></label>
                    <Tooltip text="What is Health Factor?" link="https://docs.aave.com/risk/asset-risk/risk-parameters#health-factor"/>
                </v-row>
            </v-col>
        </v-row>

        <v-row align="center" justify="start" class="ma-0 mt-7 info-container">
            <v-col :class="!$wu.isFull() ? '' : 'ml-5'" :cols="!$wu.isFull() ? 12 : 0">
                <v-row justify="center" align="center" @click="openTokenOnScan(wmaticStrategyData.rebaseAddress)">
                    <label class="address-card-text" :class="!$wu.isFull() ? 'ml-2' : ''">Token address</label>
                    <v-spacer v-if="!$wu.isFull()"></v-spacer>
                    <label class="address-card-link ml-3">{{ (wmaticStrategyData && wmaticStrategyData.rebaseAddress) ? shortAddress(wmaticStrategyData.rebaseAddress) : '—' }}</label>
                    <div class="icon-img ml-2" :class="!$wu.isFull() ? 'mr-2' : ''">
                        <v-img :src="require('@/assets/icon/openBlue.svg')"/>
                    </div>
                </v-row>
            </v-col>
            <v-col :cols="!$wu.isFull() ? 12 : 0">
                <v-row justify="center" align="center" @click="openStrategyOnScan(wmaticStrategyData.exchangerAddress)">
                    <label class="address-card-text" :class="!$wu.isFull() ? 'ml-2' : ''">Pool address</label>
                    <v-spacer v-if="!$wu.isFull()"></v-spacer>
                    <label class="address-card-link ml-3">{{ (wmaticStrategyData && wmaticStrategyData.exchangerAddress) ? shortAddress(wmaticStrategyData.exchangerAddress) : '—' }}</label>
                    <div class="icon-img ml-2" :class="!$wu.isFull() ? 'mr-2' : ''">
                        <v-img :src="require('@/assets/icon/openBlue.svg')"/>
                    </div>
                </v-row>
            </v-col>
            <v-col :cols="!$wu.isFull() ? 12 : 0">
                <v-row justify="center" align="center" @click="openStrategyOnScan(wmaticStrategyData.strategyAddress)">
                    <label class="address-card-text" :class="!$wu.isFull() ? 'ml-2' : ''">Vault address</label>
                    <v-spacer v-if="!$wu.isFull()"></v-spacer>
                    <label class="address-card-link ml-3">{{ (wmaticStrategyData && wmaticStrategyData.strategyAddress) ? shortAddress(wmaticStrategyData.strategyAddress) : '—' }}</label>
                    <div class="icon-img ml-2" :class="!$wu.isFull() ? 'mr-2' : ''">
                        <v-img :src="require('@/assets/icon/openBlue.svg')"/>
                    </div>
                </v-row>
            </v-col>
            <v-col :class="!$wu.isFull() ? '' : 'mr-5'" :cols="!$wu.isFull() ? 12 : 0">
                <v-row justify="center" align="center">
                    <label class="address-card-text" :class="!$wu.isFull() ? 'ml-2' : ''">Inception date</label>
                    <v-spacer v-if="!$wu.isFull()"></v-spacer>
                    <label class="address-card-text ml-3" :class="!$wu.isFull() ? 'mr-2' : ''"><b>1 July 2022</b></label>
                </v-row>
            </v-col>
        </v-row>

        <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-10 mb-10' : 'mt-15'">
            <v-btn class="header-btn btn-filled" @click="showInvestModal">
                Invest
            </v-btn>
        </v-row>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";
export default {
    name: "AboutTab",

    components: {
        Tooltip,
    },

    data: () => ({
    }),


    computed: {
        ...mapGetters('marketData', ['wmaticStrategyData']),

        entryFee: function () {
            if (this.wmaticStrategyData && this.wmaticStrategyData.fees) {
                let result = this.wmaticStrategyData.fees.find(x => x.id === 'buy');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        exitFee: function () {
            if (this.wmaticStrategyData && this.wmaticStrategyData.fees) {
                let result = this.wmaticStrategyData.fees.find(x => x.id === 'redeem');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        performanceFee: function () {
            if (this.wmaticStrategyData && this.wmaticStrategyData.fees) {
                let result = this.wmaticStrategyData.fees.find(x => x.id === 'profit');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        managementFee: function () {
            if (this.wmaticStrategyData && this.wmaticStrategyData.fees) {
                let result = this.wmaticStrategyData.fees.find(x => x.id === 'tvl');
                return result ? result.value : null;
            } else {
                return null;
            }
        },
    },

    methods: {
        ...mapActions('riskModal', ['showRiskModal']),
        ...mapActions('investModal', ['showInvestModal']),

        shortAddress(address) {
            if (address) {
                return address.substring(0, 5) + '...' + address.substring(address.length - 4);
            } else {
                return null;
            }
        },

        openTokenOnScan(hash) {
            if (hash && hash !== '') {
                window.open(process.env.VUE_APP_NETWORK_EXPLORER + "token/" + hash, '_blank').focus();
            }
        },

        openStrategyOnScan(hash) {
            if (hash && hash !== '') {
                window.open(process.env.VUE_APP_NETWORK_EXPLORER + "address/" + hash, '_blank').focus();
            }
        },
    }

}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .info-card-icon {
        width: 20px;
        height: 20px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .strategy-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .info-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
    }

    .title-card-icon {
        width: 24px;
        height: 24px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .list-title-text {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .list-title-num {
        font-style: normal;
        font-weight: 600;
        font-size: 54px;
        line-height: 54px;
    }

    .list-sub-title-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .progress-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.03em;
    }

    .progress-sub-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.03em;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-value, .card-info-risk {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .info-container {
        height: 150px !important;
    }

    .btn-filled {
        width: 100%;
        height: 44px !important;
    }

    .address-card-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .address-card-link {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .strategy-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .info-card-text {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .title-card-icon {
        width: 32px;
        height: 32px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .list-title-text {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
    }

    .list-title-num {
        font-style: normal;
        font-weight: 600;
        font-size: 54px;
        line-height: 54px;
    }

    .list-sub-title-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .progress-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .progress-sub-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .card-info-value, .card-info-risk {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .info-container {
        height: 150px !important;
    }

    .btn-filled {
        width: 100%;
        height: 50px !important;
    }

    .address-card-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .address-card-link {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .strategy-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .info-card-text {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .title-card-icon {
        width: 32px;
        height: 32px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .list-title-text {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
    }

    .list-title-num {
        font-style: normal;
        font-weight: 600;
        font-size: 54px;
        line-height: 54px;
    }

    .list-sub-title-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .progress-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .progress-sub-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .card-info-value, .card-info-risk {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .info-container {
        height: 64px !important;
    }

    .btn-filled {
        width: 40%;
        height: 50px !important;
    }

    .address-card-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .address-card-link {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
    }
}

.strategy-info-label {
    font-family: 'Roboto', sans-serif;
    color: #333333;
}

.info-card-container {
    background: linear-gradient(91.26deg, rgba(40, 160, 240, 0.1) 0%, rgba(6, 120, 196, 0.09917) 100%), #FFFFFF;
    border: 1px solid rgba(28, 149, 231, 0.4);
    border-radius: 4px;
}

.info-card-container-red {
    background: #FBF0F6;
    border: 1px solid rgba(207, 63, 146, 0.4);
    border-radius: 4px;
}

.info-card-body {
    margin: 5% 3%;
}

.info-card-text {
    font-family: 'Roboto', sans-serif;
    color: #333333;
}

.title-card-text {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.info-card-link {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    font-feature-settings: 'liga' off;
    color: #1C95E7;
    cursor: pointer;
}

.section-title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.scheme-img {
    width: 100% !important;
}

.list-title-num {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
}

.list-title-text {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #333333;
}

.list-sub-title-text {
    font-family: 'Roboto', sans-serif;
    color: #333333;
}

.progress-info {
    background: #D7DADF;
}

.progress-text {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
}

.progress-sub-text {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #BABFC8;
}

.info-row {
    border-top: 1px solid #CED2D8;
}

.card-info {
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
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #CF3F92;
}

.address-card-text {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.address-card-link {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #1C95E7;
    cursor: pointer;
}

.info-container {
    width: 100% !important;
    background: #E5E7EA;
    border-radius: 4px;
}

.icon-img {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.header-btn {
    border-radius: 4px;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}
</style>

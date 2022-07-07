<template>
    <div>
        <div class="mt-10">
            <v-row align="center" justify="start" class="ma-0">
                <label class="parent-page-label" @click="goToAction('/')">Market</label>
                <label class="current-page-label">
                    <v-icon size="18" class="mx-2">mdi-chevron-right</v-icon>
                    USD+ / WMatic
                </label>
            </v-row>
        </div>

        <div class="mt-1">
            <v-row align="start" justify="start" class="main-container ma-0">
                <v-col cols="9" class="ml-n3">
                    <StrategyBanner/>

                    <InvestModal/>

                    <v-row align="center" justify="start" class="ma-0 toggle-row mt-10">
                        <label class="tab-btn mr-4" @click="tab=1" v-bind:class="activeTabAbout">About strategy</label>
                        <label class="tab-btn mx-4" v-bind:class="activeTabPerformance">Performance</label>
                        <label class="tab-btn ml-4" v-bind:class="activeTabTransactions">Transactions</label>
                    </v-row>

                    <v-row align="center" justify="start" class="ma-0 mt-10">
                        <label class="strategy-info-label">
                            The Hedged strategy USD+/WMATIC ($USD+WMATIC), is an ERC-20 structured product built on Polygon that lets you leverage a collateralized debt position in a safe and efficient way by abstracting its management into a simple index. Its enables market participants to take on leverage while minimizing the transaction costs and risks associated while maintaining an appropriately collateralized debt. Users also benefit from minimal gas costs associated with minting, redeeming, and all other DeFi activities because this product is deployed on Polygon - a highly scalable L2 chain.
                        </label>
                    </v-row>

                    <v-row align="start" justify="start" class="ma-0 mt-10">
                        <v-col>
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
                                        <label class="info-card-text mt-5 ml-2">Monitoring your leveraged loan 24/7</label>
                                    </v-row>
                                    <v-row align="center">
                                        <div class="info-card-icon mt-4">
                                            <v-img :src="require('@/assets/icon/checkbox.svg')"/>
                                        </div>
                                        <label class="info-card-text mt-4 ml-2">Automatically managed liquidation ratio</label>
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
                        <v-col class="ml-5">
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
                                        <label class="info-card-text mt-4 ml-2">Flash crash of automated market maker</label>
                                        <label class="info-card-text ml-8">(in this case, Dystopia)</label>
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
                        <v-col cols="5">
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
                                        <label class="list-sub-title-text">Deposit USD+ into the vault. This triggers an automatic borrow of an equal value of WMATIC (from AAVE v2 markets), which is invested alongside your USD+ deposit into Dystopia’s WMATIC/USD+ pool.</label>
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
                                    <v-row class="info-card-container-red mt-8" justify="start" align="center">
                                        <v-col class="info-card-body">
                                            <v-row align="start">
                                                <v-col cols="1">
                                                    <v-row justify="start" align="start">
                                                        <div class="title-card-icon">
                                                            <v-img :src="require('@/assets/icon/bell.svg')"/>
                                                        </div>
                                                    </v-row>
                                                </v-col>
                                                <v-col class="ml-3">
                                                    <v-row justify="start" align="start">
                                                        <label class="list-sub-title-text">It's important to compare the price invested at and the current price as a greater volatility may result in a greater loss; the LP tokens may be be smaller in amount as to what was lent in which case the strategy will swap the corresponding amount to repay the lender.</label>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-col>
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
                        <v-col cols="1">
                        </v-col>
                        <v-col cols="6">
                            <v-row justify="end">
                                <v-img class="scheme-img" :src="require('@/assets/market/scheme.svg')"/>
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row align="center" justify="start" class="ma-0 mt-15">
                        <label class="section-title-label">
                            fee structure
                        </label>
                    </v-row>

                    <v-row align="center" justify="start" class="ma-0 mt-7">
                        <v-col>
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
                                <label class="progress-text">10%</label>
                            </v-row>
                            <v-row justify="start" align="start">
                                <label class="progress-text">Performance weekly fee</label>
                                <v-spacer></v-spacer>
                                <label class="progress-sub-text">your profit</label>
                            </v-row>
                        </v-col>

                        <v-col class="ml-8">
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
                                <label class="progress-text">1/365</label>
                                <v-spacer></v-spacer>
                                <label class="progress-sub-text">your balance</label>
                            </v-row>
                            <v-row justify="start" align="start">
                                <label class="progress-text">management daily fee</label>
                                <v-spacer></v-spacer>
                                <label class="progress-sub-text">in strategy</label>
                            </v-row>
                        </v-col>

                        <v-col class="ml-8">
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
                                <label class="progress-text">0.04%</label>
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
                        <label class="list-sub-title-text">If the daily strategy is profitable, the daily performance fee is charged on the premiums earned, and the day-to-day management fee is set on the assets managed by the strategy. If the daily strategy is unprofitable, there are no fees charged.</label>
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
                                <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.apy) ? ($utils.formatMoneyComma(wmaticStrategyData.apy, 0)) + '%' : '—' }}</label>
                                <Tooltip text="Strategy APY based on 7-day average, includes fees taken (fee-adjusted)"/>
                            </v-row>
                            <v-row class="info-row mt-6" justify="start" align="center">
                                <label class="card-info mt-1">Diff. to Hold USD+</label>
                                <v-spacer></v-spacer>
                                <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.diffApy) ? ((wmaticStrategyData.diffApy >= 0 ? '+' : '') + $utils.formatMoneyComma(wmaticStrategyData.diffApy, 1)) + '%' : '—' }}</label>
                                <Tooltip text="APY difference compared to the base APY USD+"/>
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
                                <label class="card-info mt-1">Investors</label>
                                <v-spacer></v-spacer>
                                <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.holders) ? $utils.formatMoneyComma(wmaticStrategyData.holders, 0) : '—' }}</label>
                            </v-row>
                        </v-col>
                        <v-col cols="1"></v-col>
                        <v-col>
                            <v-row class="info-row" justify="start" align="center">
                                <label class="card-info mt-1">Target Health Factor</label>
                                <v-spacer></v-spacer>
                                <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.targetHealthFactor) ? ($utils.formatMoneyComma(wmaticStrategyData.targetHealthFactor, 1)) : '—' }}</label>
                                <!-- TODO: add tooltip what is health factor -->
                            </v-row>
                            <v-row class="info-row mt-6" justify="start" align="center">
                                <label class="card-info mt-1">Health Factor check interval</label>
                                <v-spacer></v-spacer>
                                <label class="card-info-value">{{ (wmaticStrategyData && wmaticStrategyData.healthFactorCheckInterval) ? wmaticStrategyData.healthFactorCheckInterval : '—' }}<label style="text-transform: none">&nbsp;hours</label></label>
                                <!-- TODO: add tooltip what is health factor -->
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row align="center" justify="start" class="ma-0 mt-7 info-container">
                        <v-col class="ml-5">
                            <v-row justify="start" align="center" @click="openTokenOnScan(wmaticStrategyData.rebaseAddress)">
                                <label class="address-card-text">Token address</label>
                                <label class="address-card-link ml-3">{{ (wmaticStrategyData && wmaticStrategyData.rebaseAddress) ? shortAddress(wmaticStrategyData.rebaseAddress) : '—' }}</label>
                                <div class="icon-img ml-2">
                                    <v-img :src="require('@/assets/icon/openBlue.svg')"/>
                                </div>
                            </v-row>
                        </v-col>
                        <v-col>
                            <v-row justify="center" align="center" @click="openStrategyOnScan(wmaticStrategyData.exchangerAddress)">
                                <label class="address-card-text">Pool address</label>
                                <label class="address-card-link ml-3">{{ (wmaticStrategyData && wmaticStrategyData.exchangerAddress) ? shortAddress(wmaticStrategyData.exchangerAddress) : '—' }}</label>
                                <div class="icon-img ml-2">
                                    <v-img :src="require('@/assets/icon/openBlue.svg')"/>
                                </div>
                            </v-row>
                        </v-col>
                        <v-col>
                            <v-row justify="center" align="center" @click="openStrategyOnScan(wmaticStrategyData.strategyAddress)">
                                <label class="address-card-text">Vault address</label>
                                <label class="address-card-link ml-3">{{ (wmaticStrategyData && wmaticStrategyData.strategyAddress) ? shortAddress(wmaticStrategyData.strategyAddress) : '—' }}</label>
                                <div class="icon-img ml-2">
                                    <v-img :src="require('@/assets/icon/openBlue.svg')"/>
                                </div>
                            </v-row>
                        </v-col>
                        <v-col class="mr-5">
                            <v-row justify="end" align="center">
                                <label class="address-card-text">Inception date</label>
                                <label class="address-card-text ml-3"><b>1 July 2022</b></label>
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row align="center" justify="start" class="ma-0 mt-15">
                        <v-btn class="header-btn btn-filled" @click="showInvestModal">
                            Invest
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="3">
                    <v-row align="center" justify="start" class="ma-0 sticky" style="width: 20%;">
                        <v-btn class="header-btn btn-filled-red" @click="showInvestorModal">
                            <div class="info-card-icon mr-2">
                                <v-img :src="require('@/assets/icon/bellWhite.svg')"/>
                            </div>
                            Should you be an investor?
                        </v-btn>
                    </v-row>

                    <v-row class="info-card-container-white ma-0 sticky mt-15" justify="start" align="center" style="width: 20%;">
                        <v-col class="my-10 mx-8">
                            <v-row align="center">
                                <label class="investor-card-title">Your share</label>
                            </v-row>
                            <v-row align="center" class="mt-10">
                                <label class="investor-card-sub-title">Your balance in strategy</label>
                            </v-row>
                            <v-row align="center" class="mt-4">
                                <label class="investor-card-sub-title-value">{{ this.balance.usdPlusWmatic ? ($utils.formatMoneyComma(this.balance.usdPlusWmatic, 2) + ' USD+') : '—' }}</label>
                            </v-row>
                            <v-row align="center" class="mt-10">
                                <label class="investor-card-sub-title">Profit/loss</label>
                            </v-row>
                            <v-row align="center" class="mt-4">
                                <label class="investor-card-sub-title-value">{{ profit ? ('$' + $utils.formatMoneyComma(profit, 2)) : '—' }}</label>
                            </v-row>
                            <v-row align="center" class="mt-15">
                                <label class="investor-card-title">Fee structure</label>
                            </v-row>
                            <v-row class="info-row mt-8" justify="start" align="center">
                                <label class="fee-structure-label mt-1">Entry</label>
                                <v-spacer></v-spacer>
                                <label class="fee-structure-value mt-1">{{ entryFee ? $utils.formatMoneyComma(entryFee, 2) + '%' : '—' }}</label>
                            </v-row>
                            <v-row class="info-row mt-8" justify="start" align="center">
                                <label class="fee-structure-label mt-1">Exit</label>
                                <v-spacer></v-spacer>
                                <label class="fee-structure-value mt-1">{{ exitFee ? $utils.formatMoneyComma(exitFee, 2) + '%' : '—' }}</label>
                            </v-row>
                            <v-row class="info-row mt-8" justify="start" align="center">
                                <label class="fee-structure-label mt-1">Performance</label>
                                <v-spacer></v-spacer>
                                <label class="fee-structure-value mt-1">{{ managementFee ? $utils.formatMoneyComma(managementFee, 2) + '%' : '—' }}</label>
                            </v-row>
                            <v-row class="info-row mt-8" justify="start" align="center">
                                <label class="fee-structure-label mt-1">Management</label>
                                <v-spacer></v-spacer>
                                <label class="fee-structure-value mt-1">{{ performanceFee ? $utils.formatMoneyComma(performanceFee, 2) + '%' : '—' }}</label>
                                <Tooltip text="An annual fee that will be charged per block, regardless of the pool's performance. "/>
                            </v-row>

                            <v-row align="center" justify="center" class="ma-0 mt-15">
                                <v-btn class="header-btn btn-investor-invest" @click="showInvestModal">
                                    Invest
                                </v-btn>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>

        <RiskDisclosureModal/>
        <InvestorModal/>
    </div>
</template>

<script>

import StrategyBanner from "@/components/market/strategy/section/StrategyBanner";
import RiskDisclosureModal from "@/components/market/modal/RiskDisclosureModal";
import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";
import InvestorModal from "@/components/market/modal/InvestorModal";
import InvestModal from "@/components/market/modal/invest/InvestModal";
export default {
    name: "WmaticPageView",

    components: {
        InvestModal,
        InvestorModal,
        Tooltip,
        RiskDisclosureModal,
        StrategyBanner
    },

    data: () => ({
        tab: 1,

        profit: null,
    }),


    computed: {
        ...mapGetters('marketData', ['wmaticStrategyData']),
        ...mapGetters('accountData', ['balance', 'account']),

        activeTabAbout: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
            }
        },

        activeTabPerformance: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-in-active': this.tab !== 2,
            }
        },

        activeTabTransactions: function () {
            return {
                'tab-button': this.tab === 3,
                'tab-button-in-active': this.tab !== 3,
            }
        },

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
                let result = this.wmaticStrategyData.fees.find(x => x.id === 'tvl');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        managementFee: function () {
            if (this.wmaticStrategyData && this.wmaticStrategyData.fees) {
                let result = this.wmaticStrategyData.fees.find(x => x.id === 'profit');
                return result ? result.value : null;
            } else {
                return null;
            }
        },
    },

    methods: {
        ...mapActions('riskModal', ['showRiskModal']),
        ...mapActions('investorModal', ['showInvestorModal']),
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

        goToAction(id) {
            this.$router.push(id);
        },
    }

}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {

}

@media only screen and (min-width: 1400px) {

}

.main-container {
    margin-bottom: 5% !important;
}

.parent-page-label {
    cursor: pointer;

    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    font-feature-settings: 'liga' off;
    color: #1C95E7;
}

.current-page-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    font-feature-settings: 'liga' off;
    color: #333333;
}

.toggle-row {
    border-bottom: 2px solid #DCE3E8;
}

.tab-btn {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 32px;
    font-feature-settings: 'liga' off;
    color: #333333;
    cursor: pointer;
    margin-bottom: -2px;
}

.tab-button {
    color: #1C95E7 !important;
    border-bottom: 2px solid #1C95E7 !important;
}

.tab-button-in-active {
    cursor: default !important;
    color: #C5C9D1 !important;
}

.strategy-info-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 32px;
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

.info-card-container-white {
    background: #FFFFFF;
    border-radius: 8px;
}

.info-card-body {
    margin: 5% 3%;
}

.info-card-icon {
    width: 24px;
    height: 24px;
}

.title-card-icon {
    width: 32px;
    height: 32px;
}

.info-card-text {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 32px;
    color: #333333;
}

.title-card-text {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.04em;
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
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.scheme-img {
    width: 100% !important;
}

.list-title-num {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 54px;
    line-height: 54px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
}

.list-title-text {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    font-feature-settings: 'liga' off;
    color: #333333;
}

.list-sub-title-text {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: #333333;
}

.progress-info {
    background: #D7DADF;
}

.progress-text {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.02em;
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
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #BABFC8;
}

.info-row {
    border-top: 1px solid #CED2D8;
}

.card-info {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 32px;
    color: #333333;
}

.card-info-value {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #3E5463;
}

.card-info-risk {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #CF3F92;
}

.address-card-text {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.address-card-link {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'liga' off;
    color: #1C95E7;
    cursor: pointer;
}

.info-container {
    width: 100% !important;
    height: 64px !important;
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
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    text-align: center !important;
    letter-spacing: 0.02em !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-filled {
    width: 40%;
    height: 50px !important;
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}

.btn-investor-invest {
    width: 100%;
    height: 44px !important;
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}

.btn-filled-red {
    width: 100%;
    height: 44px !important;
    background: #CF3F92 !important;
    color: #FFFFFF !important;
}

.sticky {
    margin-right: 4% !important;
    position: fixed !important;
}

.investor-card-title {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.investor-card-sub-title {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.investor-card-sub-title-value {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    font-feature-settings: 'liga' off;
    color: #333333;
}

.fee-structure-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.fee-structure-value {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #3E5463;
}
</style>

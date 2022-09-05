<template>
    <div>
        <div class="mt-10">
            <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'ml-3' : ''">
                <label class="parent-page-label" @click="goToAction('/market')">Earn</label>
                <label class="current-page-label">
                    <v-icon size="18" class="mx-2">mdi-chevron-right</v-icon>
                    ETS: BUSD / WBNB
                </label>
            </v-row>
        </div>

        <div class="mt-1">
            <v-row align="start" justify="start" class="main-container ma-0">
                <v-col :cols="$wu.isFull() ? 9 : 12" :class="$wu.isFull() ? 'ml-n3' : ''">
                    <StrategyBanner/>

                    <v-row align="center" justify="start" class="ma-0 mt-5" v-if="!$wu.isFull()">
                        <v-btn class="header-btn btn-filled-red" @click="showRiskModal">
                            <div class="info-card-icon mr-2">
                                <v-img :src="require('@/assets/icon/bellWhite.svg')"/>
                            </div>
                            Investment risks
                        </v-btn>
                    </v-row>

                    <v-row class="info-card-container-white ma-0 mt-5" justify="start" align="center" v-if="!$wu.isFull()">
                        <v-col class="my-10 mx-8">
                            <v-row align="center">
                                <v-col cols="12">
                                    <v-row align="center">
                                        <label class="investor-card-sub-title">Your balance in ETS</label>
                                    </v-row>
                                    <v-row align="center" class="mt-5">
                                        <label class="investor-card-sub-title-value">{{ this.balance.busdWbnb ? ($utils.formatMoneyComma(this.balance.busdWbnb, 2) + ' USD+') : '—' }}</label>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row align="center">
                                <v-col cols="12">
                                    <v-row align="center" :class="$wu.isMobile() ? 'mt-2' : 'mt-4'">
                                        <label class="investor-card-sub-title">Profit/loss</label>
                                    </v-row>
                                    <v-row class="info-row mt-6" justify="start" align="center">
                                        <label class="fee-structure-label mt-1">Last day</label>
                                        <v-spacer></v-spacer>
                                        <label class="investor-card-sub-title-value" :class="clientProfitDayBusdWbnb > 0 ? 'success-color' : ''">
                                            {{ clientProfitDayBusdWbnb ? ((clientProfitDayBusdWbnb > 0 ? '+' : '') + '$' + $utils.formatMoneyComma(clientProfitDayBusdWbnb, 4)) : '—' }}
                                        </label>
                                    </v-row>
                                    <v-row class="info-row mt-6" justify="start" align="center">
                                        <label class="fee-structure-label mt-1">All time</label>
                                        <v-spacer></v-spacer>
                                        <label class="investor-card-sub-title-value value-disabled">Soon</label>
                                    </v-row>
                                </v-col>
                            </v-row>

                            <template v-if="networkSupport">
                                <v-row align="center" justify="center" class="ma-0" :class="$wu.isMobile() ? 'mt-10' : 'mt-12'" v-if="totalSupply.busdWbnb >= maxBusdWbnbSupply">
                                    <label class="full-status-error-label">TVL > ${{ $utils.formatMoneyComma(maxBusdWbnbSupply, 0) }}. Please check status later.</label>
                                </v-row>

                                <v-row align="center" justify="center" class="ma-0" :class="(totalSupply.busdWbnb >= maxBusdWbnbSupply) ? 'mt-2' : 'mt-12'">
                                    <v-btn class="header-btn btn-investor-invest" :class="(totalSupply.busdWbnb >= maxBusdWbnbSupply) ? 'disabled-btn' : ''" :disabled="totalSupply.busdWbnb >= maxBusdWbnbSupply"  @click="mintAction">
                                        MINT ETS: BUSD/WBNB
                                    </v-btn>
                                </v-row>

                                <v-row align="center" justify="center" class="ma-0 mt-4">
                                    <v-btn class="header-btn btn-investor-invest btn-investor-outline" outlined @click="redeemAction">
                                        REDEEM ETS: BUSD/WBNB
                                    </v-btn>
                                </v-row>
                            </template>

                            <template v-else>
                                <v-row align="center" justify="center" class="ma-0" :class="$wu.isMobile() ? 'mt-10' : 'mt-12'">
                                    <v-btn class="header-btn btn-investor-invest" @click="setNetwork('56')">
                                        SWITCH TO BSC TO MINT
                                    </v-btn>
                                </v-row>
                            </template>

                            <v-row align="center" :class="$wu.isMobile() ? 'mt-10' : 'mt-12'">
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
                                <label class="fee-structure-value mt-1">{{ performanceFee ? $utils.formatMoneyComma(performanceFee, 2) + '%' : '—' }}</label>
                            </v-row>
                            <v-row class="info-row mt-8" justify="start" align="center">
                                <label class="fee-structure-label mt-1">Management</label>
                                <v-spacer></v-spacer>
                                <label class="fee-structure-value mt-1">{{ managementFee ? $utils.formatMoneyComma(managementFee, 2) + '%' : '—' }}</label>
                                <Tooltip text="An annual fee that will be charged 1/365 per day, regardless of the strategy's performance."/>
                            </v-row>
                            <v-row class="mt-8" justify="start" align="start" v-if="$wu.isMobile()">
                                <v-col cols="1">
                                    <v-row justify="start" align="start">
                                        <div class="alert-icon mt-1">
                                            <v-img :src="require('@/assets/icon/alert.svg')"/>
                                        </div>
                                    </v-row>
                                </v-col>
                                <v-col>
                                    <v-row justify="start" align="start">
                                        <label class="fee-structure-label-ets">
                                            All ETS commissions are routed to vote for the underlying gauge pool on Unknown to keep the high APRs.
                                        </label>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row class="mt-8" justify="start" align="start" v-if="$wu.isTablet()">
                                <v-col>
                                    <v-row justify="start" align="start">
                                        <div class="alert-icon mr-1">
                                            <v-img :src="require('@/assets/icon/alert.svg')"/>
                                        </div>
                                        <label class="fee-structure-label-ets">
                                            All ETS commissions are routed to vote for the underlying gauge pool on Unknown to keep the high APRs.
                                        </label>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row align="center" justify="start" class="ma-0 toggle-row mt-10">
                        <label class="tab-btn mr-4" @click="tab=1" v-bind:class="activeTabPerformance">Performance</label>
                        <label class="tab-btn ml-4" @click="tab=2" v-bind:class="activeTabAbout">About ETS</label>
                    </v-row>

                    <v-row justify="start" align="center" class="ma-0 mt-6">
                        <v-img v-if="$wu.screenWidthIn(700, null)"
                               :class="totalSupply.busdWbnb >= maxBusdWbnbSupply ? 'banner-img-disabled' : 'banner-img'"
                               max-width="1200px"
                               :src="require('@/assets/bg/busd_wbnb_beta_banner.svg')"
                               @click="networkSupport ? (totalSupply.busdWbnb >= maxBusdWbnbSupply ? noAction() : mintAction()) : setNetwork('56')"
                        />

                        <v-img v-else
                               :class="totalSupply.busdWbnb >= maxBusdWbnbSupply ? 'banner-img-disabled' : 'banner-img'"
                               max-width="700"
                               :src="require('@/assets/bg/busd_wbnb_beta_banner_mobile.svg')"
                               @click="networkSupport ? (totalSupply.busdWbnb >= maxBusdWbnbSupply ? noAction() : mintAction()) : setNetwork('56')"
                        />
                    </v-row>

                    <PerformanceTab v-if="tab === 1"/>
                    <AboutTab v-if="tab === 2"/>

                    <v-row align="center" justify="start" class="ma-0 mt-6" v-if="tab === 1">
                        <label class="about-link-label" @click="tab=2">
                            About ETS
                        </label>
                    </v-row>
                </v-col>

                <v-col cols="3" v-if="$wu.isFull()">
                    <v-row align="center" justify="start" class="ma-0 sticky" style="width: 20%;">
                        <v-btn class="header-btn btn-filled-red" @click="showRiskModal">
                            <div class="info-card-icon mr-2">
                                <v-img :src="require('@/assets/icon/bellWhite.svg')"/>
                            </div>
                            Investment risks
                        </v-btn>
                    </v-row>

                    <v-row class="info-card-container-white ma-0 sticky mt-15" justify="start" align="center" style="width: 20%;">
                        <v-col class="my-10 mx-8">
                            <v-row align="center">
                                <label class="investor-card-sub-title">Your balance in ETS</label>
                            </v-row>
                            <v-row align="center" class="mt-5">
                                <label class="investor-card-sub-title-value">{{ this.balance.busdWbnb ? ($utils.formatMoneyComma(this.balance.busdWbnb, 2) + ' USD+') : '—' }}</label>
                            </v-row>
                            <v-row align="center" class="mt-10">
                                <label class="investor-card-sub-title">Profit/loss</label>
                            </v-row>
                            <v-row class="info-row mt-6" justify="start" align="center">
                                <label class="fee-structure-label mt-1">Last day</label>
                                <v-spacer></v-spacer>
                                <label class="investor-card-sub-title-value" :class="clientProfitDayBusdWbnb > 0 ? 'success-color' : ''">
                                    {{ clientProfitDayBusdWbnb ? ((clientProfitDayBusdWbnb > 0 ? '+' : '') + '$' + $utils.formatMoneyComma(clientProfitDayBusdWbnb, 4)) : '—' }}
                                </label>
                            </v-row>
                            <v-row class="info-row mt-6" justify="start" align="center">
                                <label class="fee-structure-label mt-1">All time</label>
                                <v-spacer></v-spacer>
                                <label class="investor-card-sub-title-value value-disabled">Soon</label>
                            </v-row>

                            <template v-if="networkSupport">
                                <v-row align="center" justify="center" class="ma-0 mt-12" v-if="totalSupply.busdWbnb >= maxBusdWbnbSupply">
                                    <label class="full-status-error-label">TVL > ${{ $utils.formatMoneyComma(maxBusdWbnbSupply, 0) }}. Please check status later.</label>
                                </v-row>

                                <v-row align="center" justify="center" class="ma-0" :class="totalSupply.busdWbnb >= maxBusdWbnbSupply ? 'mt-2' : 'mt-12'">
                                    <v-btn class="header-btn btn-investor-invest" :class="totalSupply.busdWbnb >= maxBusdWbnbSupply ? 'disabled-btn' : ''" :disabled="totalSupply.busdWbnb >= maxBusdWbnbSupply" @click="mintAction">
                                        MINT ETS: BUSD/WBNB
                                    </v-btn>
                                </v-row>

                                <v-row align="center" justify="center" class="ma-0 mt-4">
                                    <v-btn class="header-btn btn-investor-invest btn-investor-outline" outlined @click="redeemAction">
                                        REDEEM ETS: BUSD/WBNB
                                    </v-btn>
                                </v-row>
                            </template>

                            <template v-else>
                                <v-row align="center" justify="center" class="ma-0 mt-12">
                                    <v-btn class="header-btn btn-investor-invest" @click="setNetwork('56')">
                                        SWITCH TO BSC TO MINT
                                    </v-btn>
                                </v-row>
                            </template>

                            <v-row align="center" class='mt-12'>
                                <label class="investor-card-title">Fee structure</label>
                            </v-row>

                            <v-row class="mt-8" justify="start" align="center">
                                <v-col cols="4">
                                    <v-row class="info-row" justify="start" align="center">
                                        <label class="fee-structure-label">Entry</label>
                                        <v-spacer></v-spacer>
                                        <label class="fee-structure-value">{{ entryFee ? $utils.formatMoneyComma(entryFee, 2) + '%' : '—' }}</label>
                                    </v-row>
                                </v-col>
                                <v-col class="ml-6">
                                    <v-row class="info-row" justify="start" align="center">
                                        <label class="fee-structure-label">Performance</label>
                                        <v-spacer></v-spacer>
                                        <label class="fee-structure-value">{{ performanceFee ? $utils.formatMoneyComma(performanceFee, 2) + '%' : '—' }}</label>
                                    </v-row>
                                </v-col>
                            </v-row>

                            <v-row class="mt-8" justify="start" align="center">
                                <v-col cols="4">
                                    <v-row class="info-row" justify="start" align="center">
                                        <label class="fee-structure-label">Exit</label>
                                        <v-spacer></v-spacer>
                                        <label class="fee-structure-value">{{ exitFee ? $utils.formatMoneyComma(exitFee, 2) + '%' : '—' }}</label>
                                    </v-row>
                                </v-col>
                                <v-col class="ml-6">
                                    <v-row class="info-row" justify="start" align="center">
                                        <label class="fee-structure-label">Management</label>
                                        <Tooltip text="An annual fee that will be charged 1/365 per day, regardless of the strategy's performance."/>
                                        <v-spacer></v-spacer>
                                        <label class="fee-structure-value">{{ managementFee ? $utils.formatMoneyComma(managementFee, 2) + '%' : '—' }}</label>
                                    </v-row>
                                </v-col>
                            </v-row>

                            <v-row class="mt-8" justify="start" align="start">
                                <v-col cols="1">
                                    <v-row justify="start" align="start">
                                        <div class="alert-icon mt-1">
                                            <v-img :src="require('@/assets/icon/alert.svg')"/>
                                        </div>
                                    </v-row>
                                </v-col>
                                <v-col>
                                    <v-row justify="start" align="start">
                                        <label class="fee-structure-label-ets">
                                            All ETS commissions are routed to vote for the underlying gauge pool on Unknown to keep the high APRs.
                                        </label>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>

        <RiskDisclosureModal/>
        <InvestorModal/>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import StrategyBanner from "@/components/market/strategy/section/busdWbnb/StrategyBanner";
import RiskDisclosureModal from "@/components/market/modal/busdWbnb/RiskDisclosureModal";
import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";
import InvestorModal from "@/components/market/modal/InvestorModal";
import AboutTab from "@/views/strategy/busdWbnb/tab/AboutTab";
import PerformanceTab from "@/views/strategy/busdWbnb/tab/PerformanceTab";
export default {
    name: "WbnbPageView",

    components: {
        PerformanceTab,
        AboutTab,
        InvestorModal,
        Tooltip,
        RiskDisclosureModal,
        StrategyBanner
    },

    data: () => ({
        tab: 1,

        get overcapRemaining() {

            let overcapValue = localStorage.getItem('overcapRemaining');

            if (overcapValue == null) {
                localStorage.setItem('overcapRemaining', '-1');
                overcapValue = localStorage.getItem('overcapRemaining');
            }

            try {
                return parseFloat(overcapValue);
            } catch (e) {
                return null;
            }
        },
    }),


    computed: {
        ...mapGetters('network', ['networkId']),
        ...mapGetters('marketData', ['busdWbnbStrategyData', 'clientProfitDayBusdWbnb']),
        ...mapGetters('accountData', ['balance']),
        ...mapGetters('supplyData', ['totalSupply', 'maxBusdWbnbSupply']),
        ...mapGetters('overcapData', ['isOvercapAvailable', 'totalOvercap', 'walletOvercapLimit']),

        activeTabPerformance: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
            }
        },

        activeTabAbout: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-in-active': this.tab !== 2,
            }
        },

        entryFee: function () {
            if (this.busdWbnbStrategyData && this.busdWbnbStrategyData.fees) {
                let result = this.busdWbnbStrategyData.fees.find(x => x.id === 'buy');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        exitFee: function () {
            if (this.busdWbnbStrategyData && this.busdWbnbStrategyData.fees) {
                let result = this.busdWbnbStrategyData.fees.find(x => x.id === 'redeem');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        performanceFee: function () {
            if (this.busdWbnbStrategyData && this.busdWbnbStrategyData.fees) {
                let result = this.busdWbnbStrategyData.fees.find(x => x.id === 'profit');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        managementFee: function () {
            if (this.busdWbnbStrategyData && this.busdWbnbStrategyData.fees) {
                let result = this.busdWbnbStrategyData.fees.find(x => x.id === 'tvl');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        networkSupport: function () {
            return this.networkId === 56;
        },
    },

    methods: {
        ...mapActions('web3', ['setNetwork']),
        ...mapActions('riskModal', ['showRiskModal']),
        ...mapActions('investModal', ['showBusdWbnbModal', 'showMintView', 'showRedeemView']),

        goToAction(id) {
            this.$router.push(id);
        },

        mintAction() {
            this.showMintView();
            this.showBusdWbnbModal();
        },

        noAction() {
        },

        redeemAction() {
            this.showRedeemView();
            this.showBusdWbnbModal();
        }
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

    .investor-card-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.03em;
    }

    .investor-card-sub-title-value {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
    }

    .investor-card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.03em;
    }

    .fee-structure-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .fee-structure-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-investor-invest {
        width: calc(100% + 24px) !important;
        height: 40px !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .about-link-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
    }

    .capacity-status-sub-text {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        letter-spacing: 0.02em;
    }

    .fee-structure-label-ets {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
    }

    .card-banner-body {
        margin: 1% 3% !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .investor-card-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .investor-card-sub-title-value {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 36px;
    }

    .investor-card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .fee-structure-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .fee-structure-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .parent-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .current-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .btn-investor-invest {
        width: calc(100% + 24px) !important;
        height: 44px !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 32px;
    }

    .parent-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .current-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .about-link-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 18px !important;
        line-height: 24px !important;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
    }

    .capacity-status-sub-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .fee-structure-label-ets {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .card-banner-body {
        margin: 1% 3% !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .investor-card-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .investor-card-sub-title-value {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 36px;
    }

    .investor-card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .fee-structure-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .fee-structure-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-investor-invest {
        width: calc(100% + 24px) !important;
        height: 44px !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 32px;
    }

    .parent-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .current-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .about-link-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 18px !important;
        line-height: 24px !important;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .capacity-status-sub-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .fee-structure-label-ets {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .card-banner-body {
        margin: 5% 3% !important;
    }
}

.main-container {
    margin-bottom: 5% !important;
}

.parent-page-label {
    cursor: pointer;

    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #1C95E7;
}

.current-page-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #333333;
}

.toggle-row {
    border-bottom: 2px solid #DCE3E8;
}

.tab-btn {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #333333;
    margin-bottom: -2px;
}

.tab-button {
    border-bottom: 2px solid #1C95E7 !important;
    color: #1C95E7 !important;
    cursor: pointer !important;
}

.tab-button-in-active {
    color: #333333 !important;
    cursor: pointer !important;
}

.info-card-container-white {
    background: #FFFFFF;
    border-radius: 8px;
}

.info-row {
    border-top: 1px solid #CED2D8;
}

.header-btn {
    border-radius: 4px;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-investor-invest {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}

.btn-investor-outline {
    background: none !important;
    color: #1C95E7 !important;
}

.btn-filled-red {
    width: 100%;
    height: 44px !important;
    background: #CF3F92 !important;
    color: #FFFFFF !important;
}

.success-color {
    color: #22ABAC !important;
}

.sticky {
    margin-right: 4% !important;
    position: fixed !important;
}

.investor-card-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #ADB3BD;
}

.investor-card-sub-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #ADB3BD;
}

.investor-card-sub-title-value {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
}

.value-disabled {
    font-weight: 400 !important;
    text-transform: uppercase !important;
    color: #C5C9D1 !important;
    font-size: 16px;
    line-height: 20px;
}

.fee-structure-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.fee-structure-value {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #3E5463;
}

.about-link-label {
    font-family: 'Roboto', sans-serif !important;
    font-feature-settings: 'liga' off !important;
    color: #1C95E7 !important;
    cursor: pointer !important;
}

.about-link-label:hover {
    text-decoration: underline !important;
}

.disabled-btn {
    background: #E5E7EA !important;
    color: #9DA4B0 !important;
}

.full-status-error-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #CF3F92;
}

.alert-icon {
    width: 20px !important;
    height: 20px !important;
}

.progress-info {
    background: #D7DADF;
}

.capacity-status-sub-text {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #ADB3BD;
}

.minor-card-label {
    font-size: 16px !important;
    line-height: 24px !important;
}

.fee-structure-label-ets {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #707A8B;
}

.card-banner-status-container {
    background: #F5F5F5;
    border-radius: 4px;
}

.banner-img, .banner-img-disabled {
    width: 100% !important;
}

.banner-img:hover {
    cursor: pointer !important;
}
</style>

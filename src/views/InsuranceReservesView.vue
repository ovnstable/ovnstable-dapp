<template>
    <div>
        <div class="mt-10">
            <label class="title-label">Insurance Reserves</label>
        </div>

        <div class="mt-1">
            <v-row align="start" justify="start" class="main-container ma-0">
                <v-col :cols="$wu.isFull() ? 9 : 12" :class="$wu.isFull() ? 'ml-n3' : ''">

                    <v-row align="center" justify="start" class="ma-0 mt-5" v-if="!$wu.isFull()">
                        <v-btn class="header-btn btn-filled-red" @click="showRiskModal">
                            Investment risks
                        </v-btn>
                    </v-row>

                    <v-row class="ma-0 mt-5" justify="start" align="center" v-if="!$wu.isFull()">
                        <v-col class="info-card-container-white" cols="12">
                            <div class="my-4">
                                <template v-if="networkSupport">
                                    <v-row align="center" class="ma-0">
                                        <v-col cols="12">
                                            <v-row align="center">
                                                <label class="investor-card-sub-title">Your balance in INSURANCE</label>
                                            </v-row>
                                            <v-row align="center" class="mt-5">
                                                <label class="investor-card-sub-title-value" :class="dataHidden ? 'hidden-label' : ''">{{ dataHidden ? '' : insuranceBalance.polygon ? ('$' + $utils.formatMoneyComma(insuranceBalance.polygon, 2)) : '—' }}</label>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                    <v-row align="center" class="ma-0">
                                        <v-col cols="12">
                                            <v-row align="center" :class="$wu.isMobile() ? 'mt-2' : 'mt-4'">
                                                <label class="investor-card-sub-title">Profit/loss</label>
                                            </v-row>
                                            <v-row class="info-row mt-6" justify="start" align="center">
                                                <label class="fee-structure-label mt-1">Last day</label>
                                                <v-spacer></v-spacer>
                                                <label class="investor-card-sub-title-value" :class="dataHidden ? 'hidden-label mt-1' : (insuranceClientData.polygon > 0 ? 'success-color' : '')">
                                                    {{ dataHidden ? '' : insuranceClientData.polygon ? ((insuranceClientData.polygon > 0 ? '+' : '') + '$' + $utils.formatMoneyComma(insuranceClientData.polygon, 4)) : '—' }}
                                                </label>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </template>

                                <template v-if="networkSupport">
                                    <v-row align="center" justify="center" class="ma-0 mt-12">
                                        <v-btn class="header-btn btn-investor-invest"  @click="mintAction">
                                            MINT INSURANCE
                                        </v-btn>
                                    </v-row>

                                    <v-row align="center" justify="center" class="ma-0 mt-4">
                                        <template v-if="insuranceRedemptionData.request === 'CAN_WITHDRAW'">
                                            <v-btn class="header-btn btn-investor-invest btn-investor-outline" outlined @click="redeemAction">
                                                WITHDRAW WITHIN {{ $utils.formatMoneyComma(insuranceRedemptionData.hours, 0) }} HOURS
                                            </v-btn>
                                        </template>
                                        <template v-if="insuranceRedemptionData.request === 'NEED_WAIT'">
                                            <v-btn class="header-btn btn-investor-invest btn-investor-outline disabled-btn-outline" disabled outlined>
                                                <label style="color: var(--progress-text)">
                                                    WITHDRAW IN {{ $utils.formatMoneyComma(insuranceRedemptionData.hours, 0) }} HOURS
                                                </label>
                                            </v-btn>
                                        </template>
                                        <template v-if="insuranceRedemptionData.request === 'NEED_REQUEST'">
                                            <v-btn class="header-btn btn-investor-invest btn-investor-outline" outlined @click="redemptionRequestAction">
                                                REDEMPTION REQUEST
                                            </v-btn>
                                        </template>
                                    </v-row>
                                </template>

                                <template v-else>
                                    <v-row align="center" justify="center" class="ma-0">
                                        <v-btn class="header-btn btn-investor-invest" @click="setWalletNetwork('polygon')">
                                            SWITCH TO POLYGON TO MINT1
                                        </v-btn>
                                    </v-row>
                                </template>
                            </div>
                        </v-col>

                        <v-col class="info-card-container-white mt-4" cols="12">
                            <div class="my-4">
                                <v-row align="center" class="ma-0">
                                    <label class="investor-card-title">One-time fees</label>
                                    <div style="margin-top: -2px">
                                        <Tooltip :size="16" text="Overnight retains part of the yield. APY figure is net of those retentions. You see what you get."/>
                                    </div>
                                </v-row>
                                <v-row class="info-row ma-0 mt-8" justify="start" align="center">
                                    <label class="fee-structure-label mt-1">Mint fee</label>
                                    <v-spacer></v-spacer>
                                    <label class="fee-structure-value mt-1">
                                        {{ (insuranceStrategyData.polygon && insuranceStrategyData.polygon.mintFee > 0) ? $utils.formatMoneyComma(insuranceStrategyData.polygon.mintFee, 2) + '%' : '—' }}
                                    </label>
                                </v-row>
                                <v-row class="info-row ma-0 mt-4" justify="start" align="center">
                                    <label class="fee-structure-label mt-1">Redeem fee</label>
                                    <v-spacer></v-spacer>
                                    <label class="fee-structure-value mt-1">
                                        {{ (insuranceStrategyData.polygon && insuranceStrategyData.polygon.redeemFee > 0) ? $utils.formatMoneyComma(insuranceStrategyData.polygon.redeemFee, 2) + '%' : '—' }}
                                    </label>
                                </v-row>
                            </div>
                        </v-col>
                    </v-row>

                    <v-row align="center" justify="start" class="ma-0 toggle-row">
                        <label class="tab-btn mr-4" @click="setTab(1)" v-bind:class="activeTabPolygon">
                            Polygon
                        </label>
                        <label style="color: #C5C9D1 !important" class="tab-btn tab-btn-disabled ml-4" disabled>
                            Optimism
                        </label>
                        <label style="color: #C5C9D1 !important" class="tab-btn tab-btn-disabled ml-4" disabled>
                            Arbitrum
                        </label>
                    </v-row>

                    <AboutTab v-if="tab === 1" :insurance-data="insuranceStrategyData"/>
                </v-col>

                <v-col cols="3" v-if="$wu.isFull()">
                    <v-row align="center" justify="start" class="ma-0 sticky" style="width: 20%;">
                        <v-btn class="header-btn btn-filled-red" @click="showRiskModal">
                            Investment risks
                        </v-btn>
                    </v-row>

                    <v-row class="ma-0 sticky mt-15" justify="start" align="center" style="width: 20%;">
                        <v-col class="info-card-container-white" cols="12">
                            <div class="my-6 mx-6">
                                <template v-if="networkSupport">
                                    <v-row align="center">
                                        <label class="investor-card-sub-title">Your balance in INSURANCE</label>
                                    </v-row>
                                    <v-row align="center" class="mt-5">
                                        <label class="investor-card-sub-title-value" :class="dataHidden ? 'hidden-label' : ''">{{ dataHidden ? '' : insuranceBalance.polygon ? ('$' + $utils.formatMoneyComma(insuranceBalance.polygon, 2)) : '—' }}</label>
                                        <v-icon class="ml-1" color="var(--disabled-value)">
                                            {{ insuranceRedemptionData.request === 'CAN_WITHDRAW' ? 'mdi-lock-open-variant' : 'mdi-lock' }}
                                        </v-icon>
                                    </v-row>
                                    <v-row align="center" class="mt-10">
                                        <label class="investor-card-sub-title">Profit/loss</label>
                                    </v-row>
                                    <v-row class="info-row mt-6" justify="start" align="center">
                                        <label class="fee-structure-label mt-1">Last day</label>
                                        <v-spacer></v-spacer>
                                        <label class="investor-card-sub-title-value" :class="dataHidden ? 'hidden-label mt-1' : (insuranceClientData.polygon > 0 ? 'success-color' : '')">
                                            {{ dataHidden ? '' : insuranceClientData.polygon ? ((insuranceClientData.polygon > 0 ? '+' : '') + '$' + $utils.formatMoneyComma(insuranceClientData.polygon, 4)) : '—' }}
                                        </label>
                                    </v-row>
                                </template>

                                <template v-if="networkSupport">
                                    <v-row align="center" justify="center" class="mt-15">
                                        <v-btn class="header-btn btn-investor-invest" @click="mintAction">
                                            MINT INSURANCE
                                        </v-btn>
                                    </v-row>

                                    <v-row align="center" justify="center" class="mt-6">
                                        <template v-if="insuranceRedemptionData.request === 'CAN_WITHDRAW'">
                                            <v-btn class="header-btn btn-investor-invest btn-investor-outline" outlined @click="redeemAction">
                                                WITHDRAW WITHIN {{ $utils.formatMoneyComma(insuranceRedemptionData.hours, 0) }} HOURS
                                            </v-btn>
                                        </template>
                                        <template v-if="insuranceRedemptionData.request === 'NEED_WAIT'">
                                            <v-btn class="header-btn btn-investor-invest btn-investor-outline disabled-btn-outline" disabled outlined>
                                                <label style="color: var(--progress-text)">
                                                    WITHDRAW IN {{ $utils.formatMoneyComma(insuranceRedemptionData.hours, 0) }} HOURS
                                                </label>
                                            </v-btn>
                                        </template>
                                        <template v-if="insuranceRedemptionData.request === 'NEED_REQUEST'">
                                            <v-btn class="header-btn btn-investor-invest btn-investor-outline" outlined @click="redemptionRequestAction">
                                                REDEMPTION REQUEST
                                            </v-btn>
                                        </template>
                                    </v-row>
                                </template>

                                <template v-else>
                                    <v-row align="center" justify="center" class="mt-0">
                                        <v-btn class="header-btn btn-investor-invest" @click="setWalletNetwork('polygon')">
                                            SWITCH TO POLYGON TO MINT
                                        </v-btn>
                                    </v-row>
                                </template>
                            </div>
                        </v-col>

                        <v-col class="info-card-container-white mt-4" cols="12">
                            <div class="my-6 mx-6">
                                <v-row align="center">
                                    <label class="investor-card-title">One-time fees</label>
                                    <Tooltip :size="16" text="Overnight retains part of the yield. APY figure is net of those retentions. You see what you get."/>
                                </v-row>

                                <v-row class="mt-8" justify="start" align="center">
                                    <v-col>
                                        <v-row class="info-row" justify="start" align="center">
                                            <label class="fee-structure-label">Mint fee</label>
                                            <v-spacer></v-spacer>
                                            <label class="fee-structure-value">
                                                {{ (insuranceStrategyData.polygon && insuranceStrategyData.polygon.mintFee > 0) ? $utils.formatMoneyComma(insuranceStrategyData.polygon.mintFee, 2) + '%' : '—' }}
                                            </label>
                                        </v-row>
                                    </v-col>
                                </v-row>

                                <v-row class="mt-8" justify="start" align="center">
                                    <v-col>
                                        <v-row class="info-row" justify="start" align="center">
                                            <label class="fee-structure-label">Redeem fee</label>
                                            <v-spacer></v-spacer>
                                            <label class="fee-structure-value">
                                                {{ (insuranceStrategyData.polygon && insuranceStrategyData.polygon.redeemFee > 0) ? $utils.formatMoneyComma(insuranceStrategyData.polygon.redeemFee, 2) + '%' : '—' }}
                                            </label>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>

        <InsuranceRiskModal/>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";
import AboutTab from "@/views/insurance/tab/AboutTab";
import InsuranceBanner from "@/components/insurance/section/InsuranceBanner";
import InsuranceRiskModal from "@/components/insurance/modal/InsuranceRiskModal";
import PerformanceTab from "@/views/insurance/tab/PerformanceTab";

export default {
    name: "InsurancePageView",

    components: {
        PerformanceTab,
        InsuranceRiskModal,
        InsuranceBanner,
        AboutTab,
        Tooltip,
    },

    data: () => ({
        tab: 1,
    }),

    computed: {
        ...mapGetters('network', ['networkId']),
        ...mapGetters('accountData', ['insuranceBalance']),
        ...mapGetters('supplyData', ['totalSupply']),
        ...mapGetters('etsAction', ['etsList']),
        ...mapGetters('overcapData', ['isOvercapAvailable']),
        ...mapGetters('insuranceData', ['insuranceStrategyData', 'insuranceClientData', 'insuranceRedemptionData']),
        ...mapGetters("statsData", ['currentTotalData', 'stablecoinData']),
        ...mapGetters('magicEye', ['dataHidden']),

        activeTabPolygon: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
            }
        },

        networkSupport: function () {
            return this.networkId === this.insuranceStrategyData.polygon.chainId ? this.insuranceStrategyData.polygon.chainId : null;
        },
    },

    watch: {
    },

    created() {
        this.refreshInsuranceAssetData();
        this.refreshInsuranceTotalData();
    },

    mounted() {
        console.log(this.$route.query.tabName);
        this.initTab();
    },

    methods: {
        ...mapActions('network', ['setWalletNetwork']),
        ...mapActions('insuranceRiskModal', ['showRiskModal']),
        ...mapActions('insuranceInvestModal', ['showInvestModal', 'showMintView', 'showRedeemView', 'showRedemptionRequestModal']),
        ...mapActions('statsData', ['refreshInsuranceAssetData', 'refreshInsuranceTotalData']),

        setTab(tabId) {
            this.tab = tabId;
        },

        initTab() {
            if(this.$route.query.tabName === 'reserves') {
                this.setTab(1);
            }
        },

        goToAction(id) {
            this.$router.push(id);
        },

        mintAction() {
            this.showMintView();
            this.showInvestModal();
        },

        redeemAction() {
            this.showRedeemView();
            this.showInvestModal();
        },

        redemptionRequestAction() {
            this.showRedemptionRequestModal();
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 32px;
        line-height: 40px;
    }

    .info-card-icon {
        width: 20px;
        height: 20px;
    }

    .investor-card-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
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
        width: 100% !important;
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
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .investor-card-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.02em;
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
        width: 100% !important;
        height: 44px !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
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

    .hidden-label {
        width: 130px;
        height: 28px;
        background: var(--hide-account);
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .investor-card-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.02em;
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
        width: 100% !important;
        height: 44px !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
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

    .hidden-label {
        width: 130px;
        height: 28px;
        background: var(--hide-account);
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 48px;
        line-height: 60px;
    }

    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .investor-card-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 24px;
        letter-spacing: 0.02em;
    }

    .investor-card-sub-title-value {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .investor-card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 15px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .fee-structure-label {
        font-style: normal;
        font-weight: 300;
        font-size: 15px;
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
        font-size: 14px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-investor-invest {
        width: 100% !important;
        height: 36px !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 28px;
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
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.main-container {
    margin-bottom: 5% !important;
}

.parent-page-label {
    cursor: pointer;

    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--links-blue);
}

.current-page-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
}

.tab-btn {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
    margin-bottom: -2px;
    cursor: pointer;
}

.tab-btn-disabled {
    cursor: default;
}


.tab-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer;
}

.tab-button-in-active {
    cursor: pointer;
}

.info-card-container-white {
    background: var(--secondary);
    border-radius: 8px;
}

.info-row {
    border-top: 1px solid var(--secondary-border);
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
    color: var(--links-blue) !important;
}

.btn-filled-red {
    width: 100%;
    height: 44px !important;
    background: rgba(207, 63, 146, 0.1) !important;
    color: #CF3F92 !important;
    border-radius: 4px;
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
    color: var(--fourth-gray-text);
}

.investor-card-sub-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
}

.investor-card-sub-title-value {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
}

.value-disabled {
    font-weight: 300 !important;
    text-transform: uppercase !important;
    color: var(--disabled-value) !important;
}

.fee-structure-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.fee-structure-value {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--fee-structure-value);
}

.about-link-label {
    font-family: 'Roboto', sans-serif !important;
    font-feature-settings: 'liga' off !important;
    color: var(--links-blue) !important;
    cursor: pointer !important;
}

.about-link-label:hover {
    text-decoration: underline !important;
}

.disabled-btn {
    background: var(--main-banner-background) !important;
    color: #9DA4B0 !important;
}

.full-status-error-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #CF3F92;
}

.disabled-btn-outline {
    color: var(--progress-text) !important;
    border-color: var(--progress-text) !important;
}
</style>

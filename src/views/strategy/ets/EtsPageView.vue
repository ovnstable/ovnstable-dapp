<template>
    <div>
        <div class="mt-10">
            <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'ml-3' : ''">
                <label class="parent-page-label" @click="goToAction('/market')">Earn</label>
                <label class="current-page-label">
                    <v-icon size="18" class="mx-2">mdi-chevron-right</v-icon>
                    ETS {{ etsData.nameUp }}
                </label>
            </v-row>
        </div>

        <div class="mt-1">
            <v-row align="start" justify="start" class="main-container ma-0">
                <v-col :cols="$wu.isFull() ? 9 : 12" :class="$wu.isFull() ? 'ml-n3' : ''">
                    <StrategyBanner :ets-data="etsData"/>

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
                            <template v-if="networkSupport">
                                <v-row align="center">
                                    <v-col cols="12">
                                        <v-row align="center">
                                            <label class="investor-card-sub-title">Your balance in ETS</label>
                                        </v-row>
                                        <v-row align="center" class="mt-5">
                                            <label class="investor-card-sub-title-value">{{ etsBalance[etsData.name] ? ($utils.formatMoneyComma(etsBalance[etsData.name], 2) + ' USD+') : '—' }}</label>
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
                                            <label class="investor-card-sub-title-value" :class="etsClientData[this.etsData.name] > 0 ? 'success-color' : ''">
                                                {{ etsClientData[this.etsData.name] ? ((etsClientData[this.etsData.name] > 0 ? '+' : '') + '$' + $utils.formatMoneyComma(etsClientData[this.etsData.name], 4)) : '—' }}
                                            </label>
                                        </v-row>
                                        <v-row class="info-row mt-6" justify="start" align="center">
                                            <label class="fee-structure-label mt-1">All time</label>
                                            <v-spacer></v-spacer>
                                            <label class="investor-card-sub-title-value value-disabled">Soon</label>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </template>

                            <template v-if="networkSupport">
                                <v-row align="center" justify="center" class="ma-0" :class="$wu.isMobile() ? 'mt-10' : 'mt-12'" v-if="this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply">
                                    <label class="full-status-error-label">TVL > ${{ $utils.formatMoneyComma(etsData.maxSupply, 0) }}. Please check status later.</label>
                                </v-row>

                                <v-row align="center" justify="center" class="ma-0" :class="(this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply) ? 'mt-2' : 'mt-12'">
                                    <v-btn class="header-btn btn-investor-invest" :class="(this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply) ? 'disabled-btn' : ''" :disabled="this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply"  @click="mintAction">
                                        MINT ETS {{ etsData.nameUp }}
                                    </v-btn>
                                </v-row>

                                <v-row align="center" justify="center" class="ma-0 mt-4">
                                    <v-btn class="header-btn btn-investor-invest btn-investor-outline" outlined @click="redeemAction">
                                        REDEEM ETS {{ etsData.nameUp }}
                                    </v-btn>
                                </v-row>
                            </template>

                            <template v-else>
                                <v-row align="center" justify="center" class="ma-0">
                                    <v-btn class="header-btn btn-investor-invest" @click="setWalletNetwork(etsData.chain.toString())">
                                        SWITCH TO {{ etsData.chainName.toUpperCase() }} TO MINT
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
                        </v-col>
                    </v-row>

                    <v-row align="center" justify="start" class="ma-0 toggle-row mt-10">
                        <label class="tab-btn mr-4" @click="tab=1" v-bind:class="activeTabPerformance">Performance</label>
                        <label class="tab-btn ml-4" @click="tab=2" v-bind:class="activeTabAbout">About ETS</label>
                    </v-row>

                    <PerformanceTab v-if="tab === 1" :ets-data="etsData"/>
                    <AboutTab v-if="tab === 2" :ets-data="etsData"/>

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
                            <template v-if="networkSupport">
                                <v-row align="center">
                                    <label class="investor-card-sub-title">Your balance in ETS</label>
                                </v-row>
                                <v-row align="center" class="mt-5">
                                    <label class="investor-card-sub-title-value">{{ etsBalance[etsData.name] ? ($utils.formatMoneyComma(etsBalance[etsData.name], 2) + ' USD+') : '—' }}</label>
                                </v-row>
                                <v-row align="center" class="mt-10">
                                    <label class="investor-card-sub-title">Profit/loss</label>
                                </v-row>
                                <v-row class="info-row mt-6" justify="start" align="center">
                                    <label class="fee-structure-label mt-1">Last day</label>
                                    <v-spacer></v-spacer>
                                    <label class="investor-card-sub-title-value" :class="etsClientData[this.etsData.name] > 0 ? 'success-color' : ''">
                                        {{ etsClientData[this.etsData.name] ? ((etsClientData[this.etsData.name] > 0 ? '+' : '') + '$' + $utils.formatMoneyComma(etsClientData[this.etsData.name], 4)) : '—' }}
                                    </label>
                                </v-row>
                                <v-row class="info-row mt-6" justify="start" align="center">
                                    <label class="fee-structure-label mt-1">All time</label>
                                    <v-spacer></v-spacer>
                                    <label class="investor-card-sub-title-value value-disabled">Soon</label>
                                </v-row>
                            </template>

                            <template v-if="networkSupport">
                                <v-row align="center" justify="center" class="ma-0 mt-12" v-if="this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply">
                                    <label class="full-status-error-label">TVL > ${{ $utils.formatMoneyComma(etsData.maxSupply, 0) }}. Please check status later.</label>
                                </v-row>

                                <v-row align="center" justify="center" class="ma-0" :class="(this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply) ? 'mt-2' : 'mt-12'">
                                    <v-btn class="header-btn btn-investor-invest" :class="(this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply) ? 'disabled-btn' : ''" :disabled="this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply" @click="mintAction">
                                        MINT ETS {{ etsData.nameUp }}
                                    </v-btn>
                                </v-row>

                                <v-row align="center" justify="center" class="ma-0 mt-4">
                                    <v-btn class="header-btn btn-investor-invest btn-investor-outline" outlined @click="redeemAction">
                                        REDEEM ETS {{ etsData.nameUp }}
                                    </v-btn>
                                </v-row>
                            </template>

                            <template v-else>
                                <v-row align="center" justify="center" class="ma-0">
                                    <v-btn class="header-btn btn-investor-invest" @click="setWalletNetwork(etsData.chain.toString())">
                                        SWITCH TO {{ etsData.chainName.toUpperCase() }} TO MINT
                                    </v-btn>
                                </v-row>
                            </template>

                            <v-row align="center" class="mt-12">
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
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>

        <RiskDisclosureModal :ets-data="etsData"/>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import StrategyBanner from "@/components/market/strategy/section/ets/StrategyBanner";
import RiskDisclosureModal from "@/components/market/modal/ets/RiskDisclosureModal";
import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";
import AboutTab from "@/views/strategy/ets/tab/AboutTab";
import PerformanceTab from "@/views/strategy/ets/tab/PerformanceTab";

export default {
    name: "EtsPageView",

    components: {
        PerformanceTab,
        AboutTab,
        Tooltip,
        RiskDisclosureModal,
        StrategyBanner
    },

    data: () => ({
        tab: 1,
        etsData: null,
    }),


    computed: {
        ...mapGetters('network', ['networkId']),
        ...mapGetters('marketData', ['etsStrategyData', 'etsClientData']),
        ...mapGetters('accountData', ['etsBalance']),
        ...mapGetters('supplyData', ['totalSupply']),
        ...mapGetters('etsAction', ['etsList']),

        activeTabPerformance: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
                trackClick(trackParams) {
                    this.$gtm.trackEvent({
                        event: null,
                        category: 'ETS performance',
                        action: 'click',
                        label: 'Open ETS performance Tab',
                        value: 1,
                        noninteraction: false, // Optional
                    });
                },
            }
        },

        activeTabAbout: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-in-active': this.tab !== 2,
                trackClick(trackParams) {
                    this.$gtm.trackEvent({
                        event: null,
                        category: 'ETS about',
                        action: 'click',
                        label: 'Open About ETS Tab',
                        value: 1,
                        noninteraction: false, // Optional
                    });
                },
            }
        },

        entryFee: function () {
            if (this.strategyData && this.strategyData.fees) {
                let result = this.strategyData.fees.find(x => x.id === 'buy');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        exitFee: function () {
            if (this.strategyData && this.strategyData.fees) {
                let result = this.strategyData.fees.find(x => x.id === 'redeem');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        performanceFee: function () {
            if (this.strategyData && this.strategyData.fees) {
                let result = this.strategyData.fees.find(x => x.id === 'profit');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        managementFee: function () {
            if (this.strategyData && this.strategyData.fees) {
                let result = this.strategyData.fees.find(x => x.id === 'tvl');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        networkSupport: function () {
            return this.networkId === this.etsData.chain;
        },

        strategyData: function () {
            if (this.etsStrategyData && this.etsData.name) {
                return this.etsStrategyData[this.etsData.name];
            } else {
                return null;
            }
        },
    },

    watch: {
        etsList: function (newVal, oldVal) {
            this.updateEtsData();
        },
    },

    created() {
        this.updateEtsData();
    },

    mounted() {
        this.updateEtsData();
    },

    methods: {
        ...mapActions('network', ['setWalletNetwork']),
        ...mapActions('riskModal', ['showRiskModal']),
        ...mapActions('investModal', ['showInvestModal', 'showMintView', 'showRedeemView']),

        goToAction(id) {
            this.$router.push(id);
        },

        mintAction() {
            this.showMintView();
            this.showInvestModal(this.etsData);
        },

        redeemAction() {
            this.showRedeemView();
            this.showInvestModal(this.etsData);
        },

        updateEtsData() {
            if (this.etsList) {
                let resultList = this.etsList.filter(ets => ets.name === this.$route.params.name);
                this.etsData = (resultList && resultList.length > 0) ? resultList[0] : {};
            }
        },

        trackClick(trackParams) {
            this.$gtm.trackEvent({
                event: null,
                category: 'ETS',
                action: 'click',
                label: '',
                value: 1,
                noninteraction: false, // Optional
            });
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
}

.tab-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer !important;
}

.tab-button-in-active {
    color: var(--secondary-gray-text) !important;
    cursor: pointer !important;
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
</style>

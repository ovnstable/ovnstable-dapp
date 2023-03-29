<template>
    <div>
        <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-5' : 'mt-10'">
            <label class="strategy-info-label" v-html="etsData.aboutText"></label>
        </v-row>

        <v-row align="start" justify="start" class="ma-0 mt-10">
            <v-col :cols="$wu.isMobile() ? 12 : 6">
                <v-row class="info-card-container" :style="{'border-left': `2px solid ${etsData.mainColor}`}" justify="start" align="center">
                    <v-col class="info-card-body">
                        <v-row align="center">
                            <label class="title-card-text" :style="{'color': etsData.mainColor}">Your benefits</label>
                            <div class="title-card-icon ml-2">
                                <svg :style="{'width': ($wu.isFull() ? 24 : 18).toString() + 'px !important', 'height': ($wu.isFull() ? 24 : 18).toString() + 'px !important'}" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" id="addtask-svg">
                                    <g>
                                        <path d="M29.3334 6.9065L14.12 22.1332L8.46669 16.4798L10.3467 14.5998L14.12 18.3732L27.4534 5.03984L29.3334 6.9065ZM16 26.6665C10.12 26.6665 5.33335 21.8798 5.33335 15.9998C5.33335 10.1198 10.12 5.33317 16 5.33317C18.0934 5.33317 20.0534 5.9465 21.7067 6.99984L23.64 5.0665C21.4667 3.55984 18.84 2.6665 16 2.6665C8.64002 2.6665 2.66669 8.63984 2.66669 15.9998C2.66669 23.3598 8.64002 29.3332 16 29.3332C18.3067 29.3332 20.48 28.7465 22.3734 27.7065L20.3734 25.7065C19.04 26.3198 17.56 26.6665 16 26.6665ZM25.3334 19.9998H21.3334V22.6665H25.3334V26.6665H28V22.6665H32V19.9998H28V15.9998H25.3334V19.9998Z"
                                              :fill="etsData.mainColor"/>
                                    </g>
                                </svg>

                            </div>
                        </v-row>
                        <v-row align="center">
                            <div class="info-card-icon mt-4">
                                <v-icon :color="etsData.mainColor">mdi-checkbox-marked</v-icon>
                            </div>
                            <label class="info-card-text mt-5 ml-2">Monitoring your leveraged loan 24/7</label>
                        </v-row>
                        <v-row align="center">
                            <div class="info-card-icon mt-3">
                                <v-icon :color="etsData.mainColor">mdi-checkbox-marked</v-icon>
                            </div>
                            <label v-if="!$wu.isHuge()" class="info-card-text mt-4 ml-2">Automatically managed liquidation ratio</label>
                        </v-row>
                        <v-row align="center">
                            <div class="info-card-icon mt-3">
                                <v-icon :color="etsData.mainColor">mdi-checkbox-marked</v-icon>
                            </div>
                            <label class="info-card-text mt-4 ml-2">Low fees</label>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
            <v-col :class="$wu.isMobile() ? 'mt-10' : 'ml-5'">
                <v-row class="info-card-container-red" justify="start" align="center">
                    <v-col class="info-card-body">
                        <v-row align="center">
                            <label class="title-card-text" style="color:#CF3F92">Your risks</label>
                            <div class="title-card-icon ml-2">
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
                            <label class="list-sub-title-text">Deposit {{ etsData.actionTokenName }} into the vault. This triggers an automatic borrow of value of {{ etsData.token1 }} (from {{ etsData.borrowFrom }}{{ etsData.borrowFrom === "AAVE" ? ' V3' : ''}} markets), which is invested alongside your {{ etsData.actionTokenName }} deposit into {{ etsData.dex }}’s {{ etsData.poolName }} pool.</label>
                        </v-row>

                        <v-row v-if="etsData.chainName === 'arbitrum'" class="mt-8">
                            <label class="list-sub-title-text label-error">
                              By making a deposit to this strategy, you accept the risk of {{ etsData.dex }} protocol.
                            </label>
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
                            <label class="list-sub-title-text">Strategy automatically stakes the earned pool LP tokens into {{ (etsData.gauge && etsData.gauge !== '') ? (etsData.gauge + "'s gauge") : etsData.dex }} and auto-compounds the rewards by re-investing into the pool for more LP tokens to maximise Yields.</label>
                        </v-row>

                        <v-row class="important-card-container mt-8" justify="start">
                            <v-col cols="1" class="ml-3 mt-6">
                                <v-row align="start">
                                    <div class="title-card-icon">
                                        <v-img :src="require('@/assets/icon/bell.svg')"/>
                                    </div>
                                </v-row>
                            </v-col>
                            <v-col class="mr-3 mb-4">
                                <v-row align="start">
                                    <label class="important-card-text mt-5">
                                        It's important to compare your price invested and the current price, as a greater volatility causes a greater loss - is leading to  the LP tokens may result in an amount of tokens that are smaller than what was lent, in which case Strategy will swap the corresponding amount to repay the lender.
                                    </label>
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
            <v-col cols="1" v-if="!$wu.isMobile()">
            </v-col>
            <v-col cols="6" v-if="!$wu.isMobile()">
                <v-row justify="end">
                    <v-img class="scheme-img" max-width="700px" :src="require('@/assets/market/scheme_ets_' + etsData.name + '.svg')"/>
                </v-row>
            </v-col>
        </v-row>

        <v-row align="center" justify="start" class="ma-0 mt-15" v-if="$wu.isMobile()">
            <v-img class="scheme-img" :src="require('@/assets/market/scheme_ets_' + etsData.name + '.svg')"/>
        </v-row>

        <v-row class="ma-0 mt-7 info-card-container-bottom" justify="start" align="start" :style="{'background': etsData.cardBgColor}">
            <v-col class="info-card-body-bottom" :cols="$wu.isMobile() ? 0 : 5">
                <v-row class="info-row" justify="start" align="center">
                    <label class="card-info mt-1">Investors</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">{{ (etsStrategyData[etsData.name] && etsStrategyData[etsData.name].holders) ? $utils.formatMoneyComma(etsStrategyData[etsData.name].holders, 0) : '—' }}</label>
                </v-row>
                <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="card-info mt-1">Risk factor</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">{{ etsData.highRisk ? 'HIGH' : 'MODERATE' }}</label>
                    <Tooltip :size="16" text="Risk Factor is determined by a Pool's downside volatility. Pools that have a low Risk Factor translates to smaller downside volatility."/>
                </v-row>

                <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="card-info mt-1">Target Health Factor</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">{{ (etsStrategyData[etsData.name] && etsStrategyData[etsData.name].targetHealthFactor) ? ($utils.formatMoneyComma(etsStrategyData[etsData.name].targetHealthFactor, 2)) : '—' }}</label>
                    <Tooltip :size="16" text="What is Health Factor?" link="https://docs.aave.com/risk/asset-risk/risk-parameters#health-factor"/>
                </v-row>

                <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="card-info mt-1">Health Factor check</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">24 hours</label>
                    <Tooltip :size="16" text="What is Health Factor?" link="https://docs.aave.com/risk/asset-risk/risk-parameters#health-factor"/>
                </v-row>
            </v-col>

            <v-col :cols="$wu.isMobile() ? 12 : 1"></v-col>

            <v-col class="info-card-body-bottom" :cols="$wu.isMobile() ? 0 : 5">
                <v-row class="info-row" justify="start" align="center">
                    <label class="card-info mt-1">Token address</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value info-value-address" @click="openTokenOnScan(etsStrategyData[etsData.name].rebaseAddress)">
                        {{ (etsStrategyData[etsData.name] && etsStrategyData[etsData.name].rebaseAddress) ? shortAddress(etsStrategyData[etsData.name].rebaseAddress) : '—' }}
                    </label>
                    <div class="icon-img ml-2" :class="!$wu.isFull() ? 'mr-2' : ''" @click="openTokenOnScan(etsStrategyData[etsData.name].rebaseAddress)">
                        <v-icon size="20" style="margin-top: -2px" color="rgba(255, 255, 255, 0.5)">mdi-open-in-new</v-icon>
                    </div>
                </v-row>
                <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="card-info mt-1">Pool address</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value info-value-address" @click="openStrategyOnScan(etsStrategyData[etsData.name].exchangerAddress)">
                        {{ (etsStrategyData[etsData.name] && etsStrategyData[etsData.name].exchangerAddress) ? shortAddress(etsStrategyData[etsData.name].exchangerAddress) : '—' }}
                    </label>
                    <div class="icon-img ml-2" :class="!$wu.isFull() ? 'mr-2' : ''" @click="openStrategyOnScan(etsStrategyData[etsData.name].exchangerAddress)">
                        <v-icon size="20" style="margin-top: -2px" color="rgba(255, 255, 255, 0.5)">mdi-open-in-new</v-icon>
                    </div>
                </v-row>
                <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="card-info mt-1">Vault address</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value info-value-address" @click="openStrategyOnScan(etsStrategyData[etsData.name].strategyAddress)">
                        {{ (etsStrategyData[etsData.name] && etsStrategyData[etsData.name].strategyAddress) ? shortAddress(etsStrategyData[etsData.name].strategyAddress) : '—' }}
                    </label>
                    <div class="icon-img ml-2" :class="!$wu.isFull() ? 'mr-2' : ''" @click="openStrategyOnScan(etsStrategyData[etsData.name].strategyAddress)">
                        <v-icon size="20" style="margin-top: -2px" color="rgba(255, 255, 255, 0.5)">mdi-open-in-new</v-icon>
                    </div>
                </v-row>
                <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="card-info mt-1">Inception date</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">{{ etsData.inceptionDate }}</label>
                </v-row>
            </v-col>
        </v-row>

        <template v-if="networkSupport">
            <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-10 mb-10' : 'mt-15'">
                <v-btn class="header-btn btn-filled" :class="(!isOvercapAvailable && etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply) ? 'disabled-btn' : ''" @click="mintAction" :disabled="!isOvercapAvailable && etsData.maxSupply && totalSupply[etsData.name] > etsData.maxSupply">
                    MINT ETS {{ etsData.nameUp }}
                </v-btn>
                <template v-if="!isOvercapAvailable && etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply">
                    <label v-if="$wu.isFull()" class="full-status-error-label ml-4">TVL > ${{ $utils.formatMoneyComma(etsData.maxSupply, 0) }}. Please check status later.</label>
                </template>
            </v-row>

            <v-row align="center" justify="center" class="ma-0" :class="$wu.isMobile() ? 'mt-n8' : 'mt-2'" v-if="!$wu.isFull()">
                <template v-if="!isOvercapAvailable && etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply">
                    <label class="full-status-error-label">TVL > ${{ $utils.formatMoneyComma(etsData.maxSupply, 0) }}. Please check status later.</label>
                </template>
            </v-row>
        </template>

        <template v-else>
            <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-10 mb-10' : 'mt-15'">
                <v-btn class="header-btn btn-filled" @click="setWalletNetwork(etsData.chain.toString())">
                    SWITCH TO {{ etsData.chainName.toUpperCase() }} TO MINT
                </v-btn>
            </v-row>
        </template>

        <resize-observer @notify="$forceUpdate()"/>
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

    props: {

        etsData: {
            type: Object,
        },
    },

    watch: {
    },

    computed: {
        ...mapGetters('network', ['networkId', 'polygonConfig', 'bscConfig', 'opConfig', 'arConfig', 'zkConfig']),
        ...mapGetters('marketData', ['etsStrategyData']),
        ...mapGetters('supplyData', ['totalSupply']),
        ...mapGetters('overcapData', ['isOvercapAvailable']),

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

        etsChainConfig: function () {
            switch (this.etsData.chain) {
                case 137:
                    return this.polygonConfig;
                case 10:
                    return this.opConfig;
                case 56:
                    return this.bscConfig;
                case 42161:
                    return this.arConfig;
                case 324:
                    return this.zkConfig;
                default:
                    return this.polygonConfig;
            }
        }
    },

    methods: {
        ...mapActions('network', ['setWalletNetwork']),
        ...mapActions('riskModal', ['showRiskModal']),
        ...mapActions('investModal', ['showInvestModal', 'showMintView']),

        shortAddress(address) {
            if (address) {
                return address.substring(0, 5) + '...' + address.substring(address.length - 4);
            } else {
                return null;
            }
        },

        openTokenOnScan(hash) {
            if (hash && hash !== '') {
                window.open(this.etsChainConfig.explorerUrl + "token/" + hash, '_blank').focus();
            }
        },

        openStrategyOnScan(hash) {
            if (hash && hash !== '') {
                window.open(this.etsChainConfig.explorerUrl + "address/" + hash, '_blank').focus();
            }
        },

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        mintAction() {
            this.showMintView();
            this.showInvestModal(this.etsData);
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

    .important-card-text {
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 20px;
    }

    .title-card-icon {
        width: 18px;
        height: 18px;
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
        font-size: 24px;
        line-height: 20px;

        /*padding: 2px;*/
        width: 26px;
        height: 26px;
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

    .alert-icon {
        width: 24px !important;
        height: 24px !important;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
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
        font-size: 18px;
        line-height: 28px;
    }

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }

    .info-card-text {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 28px;
    }

    .important-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .title-card-icon {
        width: 24px;
        height: 24px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }

    .list-title-text {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .list-title-num {
        font-style: normal;
        font-weight: 600;
        font-size: 36px;
        line-height: 30px;

        /*padding: 2px;*/
        width: 38px;
        height: 38px;
    }

    .list-sub-title-text {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 28px;
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
        font-size: 18px;
        line-height: 28px;
    }

    .card-info-value, .card-info-risk {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
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

    .alert-icon {
        width: 28px !important;
        height: 28px !important;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
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
        font-size: 18px;
        line-height: 28px;
    }

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }

    .info-card-text {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 28px;
    }

    .important-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .title-card-icon {
        width: 24px;
        height: 24px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }

    .list-title-text {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .list-title-num {
        font-style: normal;
        font-weight: 600;
        font-size: 36px;
        line-height: 30px;

        /*padding: 2px;*/
        width: 38px;
        height: 38px;
    }

    .list-sub-title-text {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 28px;
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
        font-size: 18px;
        line-height: 28px;
    }

    .card-info-value, .card-info-risk {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
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

    .alert-icon {
        width: 28px !important;
        height: 28px !important;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .info-card-icon {
        width: 22px;
        height: 22px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 15px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .strategy-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 28px;
    }

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 17px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }

    .info-card-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 28px;
    }

    .important-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .title-card-icon {
        width: 22px;
        height: 22px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }

    .list-title-text {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .list-title-num {
        font-style: normal;
        font-weight: 600;
        font-size: 30px;
        line-height: 32px;

        /*padding: 5px;*/
        width: 48px;
        height: 48px;
    }

    .list-sub-title-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 28px;
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
        font-size: 16px;
        line-height: 28px;
    }

    .card-info-value, .card-info-risk {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }

    .info-container {
        height: 64px !important;
    }

    .btn-filled {
        width: 40%;
        height: 40px !important;
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

    .alert-icon {
        width: 28px !important;
        height: 28px !important;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }
}

.strategy-info-label {
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text);
}

.info-card-container {
}

.info-card-container-red {
    border-left: 2px solid #CF3F92;
}

.important-card-container {
    background: rgba(207, 63, 146, 0.08);
    border-radius: 4px;
}

.info-card-body {
    margin: 0% 3%;
}

.info-card-text {
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text);
}

.important-card-text {
    font-family: 'Roboto', sans-serif;
    color: var(--main-gray-text);
}

.title-card-text {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.info-card-link {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    font-feature-settings: 'liga' off;
    color: var(--links-blue);
    cursor: pointer;
}

.section-title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.scheme-img {
    width: 100% !important;
}

.list-title-num {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);

    border-radius: 50%;
    text-align: center;
    /*border: 1px solid var(--progress-card-info) !important;*/
}

.list-title-text {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
}

.list-sub-title-text {
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text);
}

.progress-info {
    background: var(--progress-card-info);
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
    color: var(--progress-text);
}

.info-row {
    border-top: 1px solid var(--secondary-border);
}

.card-info {
    font-family: 'Roboto', sans-serif;
    color: white;
}

.card-info-value {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: white;
}

.info-value-address {
    cursor: pointer;
}

.card-info-risk {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FE7F2D;
}

.risk-high {
    color: #CF3F92;
}

.address-card-text {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.address-card-link {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--links-blue);
    cursor: pointer;
}

.info-container {
    width: 100% !important;
    background: var(--main-banner-background);
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

.open-link-label {
    color: #1C95E7 !important;
    text-decoration: underline;
    cursor: pointer;
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

.label-error {
    color: #CF3F92 !important;
}

.info-card-container-bottom {
    border-radius: 8px;
}

.info-card-body-bottom {
    margin: 2% 2% !important;
}
</style>

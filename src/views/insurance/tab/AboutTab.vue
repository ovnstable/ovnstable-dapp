<template>
    <div class="page-container">
        <v-row class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-5'" justify="start" align="center">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <label class="section-title-label">Insurance reserves assets</label>
                </v-row>

                <v-row align="center" justify="center">

                    <v-col :cols="!$wu.isFull() ? 12 : 12">
                        <TableStablecoins
                            v-if="!$wu.isMobile()"
                            :data="insuranceAssetData"/>

                        <TableStablecoins
                            v-else
                            minimized
                            :data="insuranceAssetData"/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-3'" justify="start" align="center">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <label class="section-title-label">Insurance reserves portfolio</label>
                </v-row>

                <v-row align="center" justify="center">
                    <v-col :cols="!$wu.isFull() ? 12 : 12">
                        <TableStrategies
                            v-if="!$wu.isMobile()"
                            :data="insuranceTotalData"
                            :total-supply="totalInsuranceSupply.polygon * 1"
                            :total-title="'Total USD+ Insurance in circulation'"/>

                        <TableStrategies
                            v-else
                            minimized
                            :data="insuranceTotalData"
                            :total-supply="totalInsuranceSupply * 1"
                            :total-title="'Total USD+ Insurance in circulation'"/>
                    </v-col>

                </v-row>
            </v-col>
        </v-row>

        <template v-if="networkSupport" >
            <v-row align="start" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-5 mb-5' : 'mt-3'">
                <v-btn class="header-btn btn-investor-invest btn-filled"  @click="mintAction">
                    MINT INSURANCE
                </v-btn>

                <template v-if="insuranceRedemptionData.request === 'CAN_WITHDRAW'">
                    <v-btn class="header-btn btn-investor-invest btn-outlined " :class="$wu.isMobile() ? 'mt-3' : 'ml-3'" outlined @click="redeemAction">
                        WITHDRAW WITHIN {{ $utils.formatMoneyComma(insuranceRedemptionData.hours, 0) }} HOURS
                    </v-btn>
                </template>
                <template v-if="insuranceRedemptionData.request === 'NEED_WAIT'">
                    <v-btn class="header-btn btn-investor-invest btn-outlined" :class="$wu.isMobile() ? 'mt-3' : 'ml-3'" outlined>
                        <label style="color: var(--blue-link)">
                            WITHDRAW IN {{ $utils.formatMoneyComma(insuranceRedemptionData.hours, 0) }} HOURS
                        </label>
                    </v-btn>
                </template>
                <template v-if="insuranceRedemptionData.request === 'NEED_REQUEST'">
                    <v-btn class="header-btn btn-investor-invest btn-outlined" :class="$wu.isMobile() ? 'mt-3' : 'ml-3'" outlined @click="redemptionRequestAction">
                        REDEMPTION REQUEST
                    </v-btn>
                </template>
            </v-row>
        </template>
        <template v-else>
            <v-row align="start" justify="start" class=" ma-0 mt-5">
                <v-btn class="header-btn btn-investor-invest btn-filled" @click.stop="setWalletNetwork('137')">
                    SWITCH TO POLYGON TO MINT
                </v-btn>
            </v-row>
        </template>

        <v-row align="center" justify="center" class="ma-0 mt-4">

        </v-row>
        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import TableStablecoins from "@/components/stats/pie/TableStablecoins";
import PieStablecoins from "@/components/stats/pie/PieStablecoins";
import TableStrategies from "@/components/stats/doughnut/TableStrategies";
import DoughnutStrategies from "@/components/stats/doughnut/DoughnutStrategies";

export default {
    name: "CollateralView",

    components: {
        TableStrategies,
        TableStablecoins
    },

    data: () => ({

    }),

    computed: {
        ...mapGetters("network", ['networkId', 'polygonConfig']),
        ...mapGetters("statsData", ['currentTotalData', 'stablecoinData', 'insuranceTotalData', 'insuranceAssetData', 'insuranceTotalSupplyData']),
        ...mapGetters("web3", ['contracts']),
        ...mapGetters('insuranceData', ['insuranceStrategyData', 'insuranceClientData', 'insuranceRedemptionData']),
        ...mapGetters("supplyData", ["totalInsuranceSupply"]),

        networkSupport: function () {
            return this.networkId === this.insuranceStrategyData.polygon.chainId;
        },

        insuranceChainConfig: function() {
            return this.polygonConfig;
        }
    },

    methods: {
        ...mapActions('insuranceInvestModal', ['showInvestModal', 'showMintView', 'showRedeemView', 'showRedemptionRequestModal']),
        ...mapActions("network", ["setWalletNetwork"]),

        openLink(url) {
            window.open(url, '_blank').focus();
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

        shortAddress(address) {
            if (address) {
                return address.substring(0, 5) + '...' + address.substring(address.length - 4);
            } else {
                return null;
            }
        },

        openTokenOnScan(hash) {
            if (hash && hash !== '') {
                window.open(this.insuranceChainConfig.explorerUrl + "token/" + hash, '_blank').focus();
            }
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
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

    .btn-filled {
        width: 100%;
        height: 36px !important;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .currency {
        width: 30px ;
        height: 30px;
    }

    .currency-text {
        font-size: 14px;
        line-height: 22px;
    }

    .address-text {
        font-size: 14px;
        line-height: 22px;
    }

    .open-new {
        width: 20px;
        height: 20px;
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
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled {
        width: 20%;
        height: 40px !important;
    }

    .btn-investor-invest {
        width: 25% !important;
        height: 44px !important;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .currency {
        width: 38px;
        height: 38px;
    }

    .currency-text {
        font-size: 18px;
        line-height: 28px;
    }

    .address-text {
        font-size: 18px;
        line-height: 28px;
    }

    .open-new {
        width: 24px;
        height: 24px;
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
}

/* full */
@media only screen and (min-width: 1400px) {
    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled {
        width: 20%;
        height: 40px !important;
    }

    .btn-investor-invest {
        width: 25% !important;
        height: 44px !important;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .currency {
        width: 38px !important;
        height: 38px !important;
    }

    .currency-text {
        font-size: 18px;
        line-height: 28px;
    }

    .address-text {
        font-size: 18px;
        line-height: 28px;
    }

    .open-new {
        width: 24px;
        height: 24px;
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
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled {
        width: 20%;
        height: 40px !important;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .currency {
        width: 32px !important;
        height: 32px !important;
    }

    .currency-text {
        font-size: 16px;
        line-height: 25px;
    }

    .address-text {
        font-size: 16px;
        line-height: 28px;
    }

    .open-new {
        width: 22px;
        height: 22px;
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
}

.page-container {
    margin-bottom: 5% !important;
}

.tab-chain-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer !important;
}

.tab-chain-button-in-active {
    color: var(--secondary-gray-text) !important;
    cursor: pointer !important;
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
}

.info-link {
    font-weight: 400;
    color: var(--links-blue) !important;
    cursor: pointer;
}

.header-btn {
    border-radius: 4px !important;
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

.btn-outlined {
    background: none !important;
    color: var(--links-blue) !important;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}

.info-card-container {
    background: var(--secondary);
    border-radius: 12px;
}

.currency-box {
    background: var(--secondary);
    border-radius: 12px;
}

.info-card-body-bottom {
    margin: 2% 2% !important;
}

.section-title-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    text-transform: none;
    color: var(--secondary-gray-text);
}

.currency-text {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 400;
    color: var(--secondary-gray-text);
}

.open-link {
    width: 18px;
    height: 18px;
}

.address-text {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 300;
    color: var(--secondary-gray-text);
}

.currency-box, .currency-box >>> * {
    cursor: pointer;
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

.info-row {
    border-top: 1px solid var(--secondary-border);
}

.info-card-container-bottom {
    border-radius: 8px;
}

.icon-img, .info-value-address {
    cursor: pointer;
}
</style>

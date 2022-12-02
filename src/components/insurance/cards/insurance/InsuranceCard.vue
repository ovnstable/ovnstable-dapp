<template>
    <v-row class="card-container" v-on:click.prevent @click="openInsurance">
        <v-col cols="12" align-self="start">
            <v-row class="d-flex flex-row align-center header-row" justify="center" :style="{'--card-background': getBgColor()}">
                <span class="currency ml-5">
                    <v-img :src="require('@/assets/currencies/insurance/insurancePolygon.svg')"/>
                </span>
                <v-row class="d-flex flex-column align-start mr-3 ml-8">
                    <v-row class="d-flex" align="center">
                        <label class="card-title">USD+ Insurance</label>
                    </v-row>
                    <v-row class="d-flex" align="center">
                        <label class="card-title">ON polygon</label>
                    </v-row>
                    <v-row class="d-flex mt-4">
                        <label class="percentage">
                            {{ insuranceStrategyData.polygon ? ($utils.formatMoneyComma(insuranceStrategyData.polygon.lastApy, 0) + '%') : '—' }}
                        </label>
                        <label class="apy ml-3">APY</label>
                        <div class="tooltip">
                            <Tooltip icon-color="#FFFFFF"
                                     :size="$wu.isFull() ? 18 : ($wu.isTablet() ? 16 : 14)"
                                     text="Last day net APY, includes fees taken (fee-adjusted)"/>
                        </div>
                    </v-row>
                </v-row>
            </v-row>

            <v-container class="mt-6">
                <v-row class="ma-0 box">
                    <v-col cols="12">
                        <v-row class="ma-0 mb-2" justify="center">
                            <label class="apy-box-total-label">
                                Total apy – {{ insuranceStrategyData.polygon ? ($utils.formatMoneyComma(insuranceStrategyData.polygon.lastApy, 0) + '%') : '—' }}
                            </label>
                        </v-row>
                        <v-divider class="card-divider"></v-divider>
                        <v-row class="ma-0 mt-2">
                            <v-col>
                                <v-row justify="center">
                                    <label class="apy-box-subtitle-label">insurance premiums</label>
                                </v-row>
                                <v-row justify="center" class="mt-4" align="center">
                                    <label class="apy-box-total-label">
                                        {{ insuranceStrategyData.polygon ? ($utils.formatMoneyComma(insuranceStrategyData.polygon.lastApyPremium, 0) + '%') : '—' }} APY
                                    </label>
                                    <Tooltip :size="$wu.isFull() ? 18 : ($wu.isTablet() ? 16 : 14)"
                                             :maxWidth="300"
                                             text="APY which comes from USD+ collateral and depend on Risk Factor of each strategy in collateral.<br/><br/>Premiums (share of yield):<ul><li>Strategy with low risk – 0%</li><li>Strategy with medium risk – 2%</li><li>Strategy with high risk – 10%</li></ul>"/>
                                </v-row>
                            </v-col>
                            <v-col>
                                <v-row justify="center">
                                    <label class="apy-box-subtitle-label">reserve investment</label>
                                </v-row>
                                <v-row justify="center" class="mt-4" align="center">
                                    <label class="apy-box-total-label">
                                        {{ insuranceStrategyData.polygon ? ($utils.formatMoneyComma(insuranceStrategyData.polygon.lastApyInvestment, 0) + '%') : '—' }} APY
                                    </label>
                                    <Tooltip :size="$wu.isFull() ? 18 : ($wu.isTablet() ? 16 : 14)"
                                             text="APY which comes from reserving USD+ Insurance token in other assets."/>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row class="ma-0 mt-5 insurance-card-info-row d-flex justify-space-between">
                    <label class="card-info-label mt-2">Insurance fund</label>
                    <label class="card-info-value mt-2">${{ $utils.formatMoneyComma(totalInsuranceSupply.polygon, 2) }}</label>
                </v-row>

                <v-row class="ma-0 mt-3 insurance-card-info-row d-flex justify-space-between">
                    <label class="card-info-label mt-2">Insurance coverage</label>
                    <label class="card-info-value mt-2">{{ (coverageValue !== null) ? ($utils.formatMoneyComma(coverageValue, 0) + '%') : '—' }}</label>
                </v-row>

                <v-row class="ma-0 mt-3 insurance-card-info-row d-flex justify-space-between">
                    <label class="card-info-label mt-2">Risk factor</label>
                    <label class="card-info-value mt-2">HIGH</label>
                </v-row>
            </v-container>
        </v-col>

        <v-col align-self="end">
            <v-container :class="$wu.isFull() ? 'mb-6' : 'mb-6'">
                <v-row class="d-flex justify-space-between ma-0">
                    <label class="your-deposit">Your deposit</label>
                    <label class="your-deposit">
                        {{ this.insuranceBalance.polygon ? ('$' + $utils.formatMoneyComma(this.insuranceBalance.polygon, 2)) : "—"  }}
                    </label>
                    <!-- TODO: add lock icon -->
                </v-row>

                <v-row class="d-flex justify-space-between ma-0 mt-2">
                    <template v-if="networkId === 137">
                        <v-col class="mr-1">
                            <v-row>
                                <v-btn class="button btn-filled" @click.stop="mintAction">Mint</v-btn>
                            </v-row>
                        </v-col>
                        <v-col class="ml-1">
                            <v-row>
                                <v-btn class="button btn-outlined" @click.stop="redeemAction" outlined>
                                    REDEEM
                                </v-btn>
                            </v-row>
                        </v-col>
                    </template>

                    <template v-else>
                        <v-col>
                            <v-row>
                                <v-btn class="button btn-outlined" @click.stop="setWalletNetwork('137')" outlined>
                                    SWITCH TO POLYGON TO MINT
                                </v-btn>
                            </v-row>
                        </v-col>
                    </template>
                </v-row>
            </v-container>

            <v-row class="footer-row d-flex align-center justify-center" @click.stop="openInsurance">
                <label class="footer-link">View USD+ Insurance performance</label>
                <img class="open-icon ml-1" src="@/assets/icon/open-in-new.svg">
            </v-row>
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import Tooltip from "@/components/common/element/Tooltip";
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "InsuranceCard",

    components: {
        Tooltip
    },

    props: {},

    computed: {
        ...mapGetters("accountData", ["insuranceBalance"]),
        ...mapGetters("supplyData", ["totalInsuranceSupply"]),
        ...mapGetters("statsData", ["totalUsdPlusValue"]),
        ...mapGetters("insuranceData", ["insuranceStrategyData"]),
        ...mapGetters("network", ["appApiUrl", "networkId", "networkName"]),

        coverageValue: function () {
            if (this.totalInsuranceSupply && this.totalUsdPlusValue) {
                return 100.00 * this.totalInsuranceSupply / this.totalUsdPlusValue;
            } else {
                return null;
            }
        },
    },

    data: () => ({
    }),

    watch: {
    },

    created() {
    },

    methods: {
        ...mapActions("swapModal", ["showSwapModal", "showMintView"]),
        ...mapActions("swapModal", ["showSwapModal", "showRedeemView"]),
        ...mapActions("network", ["setWalletNetwork"]),
        ...mapActions("insuranceData", ["refreshInsurance"]),


        mintAction() {
            /* TODO: show mint insurance modal */
            /*this.showMintView();
            this.showSwapModal();*/
        },

        redeemAction() {
            /* TODO: show redeem insurance modal */
            /*this.showRedeemView();
            this.showSwapModal();*/
        },

        openInsurance() {
            /* TODO: open insurance page view */
            // this.goToAction('/stats');
        },

        goToAction(id) {
            this.$router.push(id);
        },

        getBgColor() {
            /*switch (this.insuranceStrategyData.polygon.chainId) {
                case 137:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #001845 0%, #001845 27.05%, #0C255B 52.07%, #7E46E3 100%)';
                case 43114:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #001845 0%, #001845 27.05%, #0C255B 52.07%, #D74F49 100%)';
                case 10:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #001845 0%, #001845 27.05%, #0C255B 52.07%, #FF0420 100%)';
                case 56:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #001845 0%, #001845 27.05%, #0C255B 52.07%, #F3BA2F 100%)';
            }*/

            return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #001845 0%, #001845 27.05%, #0C255B 52.07%, #7E46E3 100%)';
        },
    }
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .button {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .currency {
        height: 60px !important;
        width: 60px !important;
    }

    .your-deposit {
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 22px;
    }

    .footer-link {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }

    .header-row {
        height: 100px !important;
    }

    .card-container {
    }

    .card-title {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.04em;
    }

    .percentage {
        font-style: normal;
        font-weight: 600;
        font-size: 40px;
        line-height: 40px;
    }

    .apy {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
    }

    .tooltip {
        margin-top: -4px;
    }

    .apy-box-total-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .apy-box-subtitle-label {
        font-style: normal;
        font-weight: 400;
        font-size: 11px;
        line-height: 16px;
        letter-spacing: 0.03em;
    }

    .card-info-label {
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
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .button {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .currency {
        height: 60px !important;
        width: 60px !important;
    }

    .your-deposit {
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 22px;
    }

    .footer-link {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .header-row {
        height: 110px !important;
    }

    .card-container {
    }

    .card-title {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .percentage {
        font-style: normal;
        font-weight: 600;
        font-size: 50px;
        line-height: 56px;
    }

    .apy {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
    }

    .tooltip {
        margin-top: 1px;
    }

    .apy-box-total-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .apy-box-subtitle-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.03em;
    }

    .card-info-label {
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
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .button {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .currency {
        height: 78px !important;
        width: 78px !important;
    }

    .your-deposit {
        font-style: normal;
        font-weight: 800;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.05em;
    }

    .footer-link {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .header-row {
        max-width: 460px;
        height: 130px !important;
    }

    .card-container {
        max-width: 460px;
    }

    .card-title {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 18px;
        letter-spacing: 0.04em;
    }

    .percentage {
        font-style: normal;
        font-weight: 600;
        font-size: 50px;
        line-height: 48px;
    }

    .apy {
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
    }

    .tooltip {
        margin-top: 2px;
    }

    .apy-box-total-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .apy-box-subtitle-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.03em;
    }

    .card-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 28px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }
}

.card-container {
    background: var(--secondary) !important;
    border-radius: 15px !important;
    height: 100% !important;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

.header-row {
    border-radius: 15px 15px 0 0;
    background: var(--card-background);
}

.card-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.percentage {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.apy {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.box {
    background-color: var(--scroll-color);
    border-radius: 4px;
    text-align: center;
    width: 100%;
}

.your-deposit {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-feature-settings: 'liga' off;
}

.your-deposit {
    color: var(--main-gray-text);
}

.button {
    border-radius: 2px;
    box-shadow: none !important;
    width: 100% !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}

.btn-outlined {
    color: var(--links-blue) !important;
}

.footer-row {
    background-color: var(--scroll-color) !important;
    padding: 5px;
    border-radius: 0 0 15px 15px;
}

.footer-link {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #707A8B;
}

.open-icon {
    color: #707A8B;
    height: 18px;
    width: 18px;
}

.card-container:hover {
    filter: none !important;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05), 0 4px 4px 0 rgba(0, 0, 0, 0.05);
}

* {
    cursor: pointer;
}

.card-divider {
    border-color: var(--fourth-gray-text) !important;
}

.card-divider {
    border-color: var(--box-divider) !important;
}

.apy-box-total-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.apy-box-subtitle-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--fourth-gray-text);
}

.insurance-card-info-row {
    border-top: 1px solid var(--main-border) !important;
}

.card-info-label, .card-info-value {
    font-family: 'Roboto', sans-serif;
    color: var(--main-gray-text);
}
</style>

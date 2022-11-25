<template>
    <v-row class="card-container" v-on:click.prevent @click="openCard">
        <v-col cols="12" align-self="start">
            <v-row class="d-flex flex-row align-center header-row" justify="center" :style="{'--card-background': getBgColor()}">
                <span class="currency ml-5">
                    <v-img :src="require('@/assets/currencies/usdPlus.svg')"/>
                </span>
                <v-row class="d-flex flex-column align-start mr-3 ml-8">
                    <v-row class="d-flex" align="center">
                        <label class="card-title">USD+ ON {{ networkName }}</label>
                    </v-row>
                    <v-row class="d-flex mt-5">
                        <label class="percentage">
                            {{ $utils.formatMoneyComma(avgApy.value, 0) + '%' }}
                        </label>
                        <label class="apy ml-3">APY</label>
                        <div class="tooltip">
                            <Tooltip icon-color="#FFFFFF"
                                     :size="$wu.isFull() ? 18 : ($wu.isTablet() ? 16 : 14)"
                                     text="Strategy APY based on 30-day average, includes fees taken (fee-adjusted)"/>
                        </div>
                    </v-row>
                </v-row>
            </v-row>

            <v-container class="mt-3">
                <v-row align="center" justify="center" class="ma-0">
                    <label class="full-status-error-label">&nbsp;</label>
                </v-row>

                <v-row class="d-flex justify-space-between ma-0 mt-3">
                    <label class="progress-label-value">CURRENT TVL</label>
                    <label class="progress-label-value mb-5" v-if="true">
                        ${{ $utils.formatMoneyComma(totalUsdPlusValue, 2) }}
                    </label>
                    <v-progress-circular
                        v-else
                        class="mb-5"
                        width="1.5"
                        size="16"
                        color="#9DA4B0"
                        indeterminate
                    ></v-progress-circular>
                </v-row>
                <v-divider class="card-divider"></v-divider>

                <v-row class="ma-0 mt-8">
                    <label class="card-info">Park your stables in USD+, and watch your balance grow in your wallet
                        overnight. No
                        staking required</label>
                </v-row>

                <v-row class="mt-3">
                    <v-col cols="12">
                        <v-row class="ma-0">
                            <div class="box">
                                <label class="box-name mt-2">Chain</label>
                                <div class="icon">
                                    <v-img :src="icon"
                                           class="mt-1"
                                           alt="chain icon"/>
                                </div>
                                <label class="chain-name mb-2 mt-1">{{ networkName }}</label>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-col>

        <v-col align-self="end">
            <v-container :class="$wu.isFull() ? 'mb-6' : 'mb-6'">
                <v-row class="d-flex justify-space-between ma-0">
                    <label class="your-deposit">Current balance</label>
                    <label
                        class="your-deposit">{{
                            this.balance.usdPlus ? ($utils.formatMoneyComma(this.balance.usdPlus, 2) + " USD+") : "—"
                        }}</label>
                </v-row>

                <v-row class="d-flex justify-space-between ma-0 mt-2">
                    <template>
                        <v-col class="mr-1">
                            <v-row>
                                <v-btn class="button btn-filled" @click.stop="mintAction">Mint USD+</v-btn>
                            </v-row>
                        </v-col>
                        <v-col class="ml-1">
                            <v-row>
                                <v-btn class="button btn-outlined" @click.stop="redeemAction" outlined>
                                    REDEEM USD+
                                </v-btn>
                            </v-row>
                        </v-col>
                    </template>
                </v-row>
            </v-container>

            <v-row class="footer-row d-flex align-center justify-center" @click.stop="openPerformance">
                <label class="footer-link">View USD+ performance</label>
                <img class="open-icon ml-1" src="@/assets/icon/open-in-new.svg">
            </v-row>
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import Tooltip from "@/components/common/element/Tooltip";
import {mapActions, mapGetters, mapMutations} from "vuex";
import polygonIcon from "@/assets/network/polygon.svg";
import avaxIcon from "@/assets/network/avalanche.svg";
import optimismIcon from "@/assets/network/op.svg";
import bscIcon from "@/assets/network/bsc.svg";
import moment from "moment";

export default {
    name: "UsdPlus",

    components: {
        Tooltip
    },

    props: {},

    computed: {
        ...mapGetters("dashboardData", ["profitUsdPlus", "apy", "slice"]),
        ...mapGetters("statsData", ["totalUsdPlusValue"]),
        ...mapGetters("accountData", ["balance"]),
        ...mapGetters("wrapUI", ["showWrap"]),
        ...mapGetters("network", ["appApiUrl", "networkId", "networkName"]),

        icon: function () {
            switch (this.networkId) {
                case 137:
                    return polygonIcon;
                case 43114:
                    return avaxIcon;
                case 10:
                    return optimismIcon;
                case 56:
                    return bscIcon;
            }
        },

        sliceLabel() {
            switch (this.slice) {
                case 7:
                    return "WEEK";
                case 30:
                    return "MONTH";
                default:
                    return "ALL";
            }
        }
    },

    data: () => ({
        avgApy: null,
    }),

    watch: {
        appApiUrl: function (newVal, oldVal) {
            this.getUsdPlusAvgMonthApy();
        }
    },

    created() {
        this.getUsdPlusAvgMonthApy();
    },

    methods: {
        ...mapActions("swapModal", ["showSwapModal", "showMintView"]),
        ...mapActions("swapModal", ["showSwapModal", "showRedeemView"]),


        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        redeemAction() {
            this.showRedeemView();
            this.showSwapModal();
        },

        openCard() {
            this.mintAction();
        },

        openPerformance() {
            this.goToAction('/stats');
        },

        goToAction(id) {
            this.$router.push(id);
        },

        getBgColor() {
            switch (this.networkId) {
                case 137:
                    return 'radial-gradient(117.22% 424.06% at 96.59% -5.17%, #7E46E2 0%, #4088F5 28.42%, #3430AF 52.52%, #7E46E2 100%)';
                case 43114:
                    return 'radial-gradient(circle at 100% 0%, #4E0B1B 0%, #D0225D 27%, #FD0420 52%, #4E0B1B 100%)';
                case 10:
                    return 'radial-gradient(circle at 100% 0%, #FD0420 0%, #D0225D 27%, #4E0B1B 52%, #FD0420 100%)';
                case 56:
                    return 'radial-gradient(circle at 100% 0%, #E9B430 0%, #001845 27%, #001845 52%, #E9B430 100%)';
            }
        },

        async getUsdPlusAvgMonthApy() {
            let fetchOptions = {
                headers: {
                    "Access-Control-Allow-Origin": this.appApiUrl
                }
            };

            await fetch(this.appApiUrl + '/widget/avg-apy-info/month', fetchOptions)
                .then(value => value.json())
                .then(value => {
                    this.avgApy = value;
                    this.avgApy.date = moment(this.avgApy.date).format("DD MMM. ‘YY");
                }).catch(reason => {
                    console.log('Error get data: ' + reason);
                })
        },
    }
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 22px;
    }

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

    .progress-label-value {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
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

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 22px;
    }

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

    .progress-label-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.03em;
    }

    .footer-link {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .header-row {
        max-width: 440px;
        height: 110px !important;
    }

    .card-container {
        max-width: 440px;
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

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

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

    .progress-label-value {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.04em;
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

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
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

.card-info {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.box {
    background-color: var(--scroll-color);
    border-radius: 4px;
    text-align: center;

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-transform: capitalize;
}

.box-name {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.03em;
    color: #707A8B;
    text-transform: uppercase;
}

.icon {
    height: 36px !important;
    width: 36px !important;
}

.chain-name {
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: var(--main-gray-text);
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

.progress-label-value {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.card-divider {
    border-color: var(--fourth-gray-text) !important;
}

.full-status-error-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
}
</style>

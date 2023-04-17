<template>
    <v-row class="card-container" v-on:click.prevent @click="openPerformance">
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
                            {{ $utils.formatMoneyComma((avgApy ? avgApy.value : 0), 0) + '%' }}
                        </label>
                        <label class="apy ml-3">APY</label>
                        <div class="tooltip">
                            <Tooltip icon-color="#FFFFFF"
                                     :size="$wu.isFull() ? 18 : ($wu.isTablet() ? 16 : 14)"
                                     text="Strategy net APY based on 30-day average, includes fees taken (fee-adjusted)"/>
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
                <v-row class="d-flex justify-space-between ma-0" align="center">
                    <label class="your-deposit">Current balance</label>
                    <label
                        class="your-deposit" :class="dataHidden ? 'hidden-label' : ''">
                      {{dataHidden ? '' : this.balance.usdPlus ? ($utils.formatMoneyComma(this.balance.usdPlus, 2) + " USD+") : "—" }}
                    </label>
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
import optimismIcon from "@/assets/network/op.svg";
import arbitrumIcon from "@/assets/network/ar.svg";
import zksyncIcon from "@/assets/network/zk.svg";
import bscIcon from "@/assets/network/bsc.svg";
import moment from "moment";
import {axios} from "@/plugins/http-axios";
import network from "@/store/modules/common/web3/network";

export default {
    name: "UsdPlus",

    components: {
        Tooltip
    },

    props: {
        networkName: {
            type: String,
            default: 'optimism',
        }
    },

    computed: {
        ...mapGetters("dashboardData", ["profitUsdPlus", "apy", "slice"]),
        ...mapGetters("accountData", ["balance"]),
        ...mapGetters("wrapUI", ["showWrap"]),
        ...mapGetters("network", ['getParams']),
        ...mapGetters('magicEye', ['dataHidden']),


        networkParams: function() {
            return this.getParams(this.networkName);
        },

        icon: function () {
            switch (this.networkParams.networkId) {
                case 137:
                    return polygonIcon;
                case 10:
                    return optimismIcon;
                case 56:
                    return bscIcon;
                case 42161:
                    return arbitrumIcon;
                case 324:
                    return zksyncIcon;
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
        totalUsdPlusValue: null
    }),

    watch: {
        networkName: function (newVal, oldVal) {
          this.loadData();
        }
    },

    mounted() {
        this.loadData();
    },

    methods: {
        ...mapActions("swapModal", ["showSwapModal", "showMintView"]),
        ...mapActions("swapModal", ["showSwapModal", "showRedeemView"]),
        ...mapActions('magicEye', ['switchEye']),

        loadData() {
          this.getUsdPlusAvgMonthApy();
          this.loadTotalUsdPlus();
        },

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        redeemAction() {
            this.showRedeemView();
            this.showSwapModal();
        },

        openPerformance() {
            this.goToAction('/stats');
        },

        goToAction(id) {
            this.$router.push(id);
        },

        getBgColor() {
            switch (this.networkParams.networkId) {
                case 137:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #001845 0%, #001845 27.05%, #0C255B 52.07%, #7E46E3 100%)';
                case 42161:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #95bfdc 0%, #545e71 27.05%, #2d374b 52.07%, #27a0ef 100%)';
                case 324:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #95bfdc 0%, #545e71 27.05%, #2d374b 52.07%, #27a0ef 100%)';
                case 10:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #001845 0%, #001845 27.05%, #0C255B 52.07%, #FF0420 100%)';
                case 56:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #001845 0%, #001845 27.05%, #0C255B 52.07%, #F3BA2F 100%)';
            }
        },

      async loadTotalUsdPlus() {
        let usdPlusValue = (await axios.get(this.networkParams.appApiUrl + '/dapp/getTotalUsdPlusValue')).data;
        this.totalUsdPlusValue = usdPlusValue
      },

        async getUsdPlusAvgMonthApy() {
            let fetchOptions = {
                headers: {
                    "Access-Control-Allow-Origin": this.networkParams.appApiUrl
                }
            };

            await fetch(this.networkParams.appApiUrl + '/widget/avg-apy-info/month', fetchOptions)
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

    .hidden-label {
        width: 130px;
        height: 28px;
        background: var(--hide-account);
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
    .button {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 15px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .card-title {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .percentage {
        font-style: normal;
        font-weight: 600;
        font-size: 38px;
        line-height: 42px;
    }

    .apy {
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
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

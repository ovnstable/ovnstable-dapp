<template>
    <v-row class="card-container ma-0" v-on:click.prevent @click="openStrategyCard">
        <v-col cols="12" align-self="start">
            <v-row class="card-row mt-7" justify="end" align="center">
                <label class="tag-label">cash management / low risk</label>
            </v-row>

            <v-row class="card-row mt-12" justify="start" align="center">
                <div class="currency-icon">
                    <v-img :src="require('@/assets/currencies/usdPlus.svg')"/>
                </div>
                <label class="card-title ml-3">USD+</label>
                <v-spacer></v-spacer>
                <div class="currency-icon">
                    <v-img :src="icon"/>
                </div>
            </v-row>

            <v-row class="card-row mt-12" :class="$wu.isMobile ? '' : 'mb-15'" justify="start" align="center">
                <label class="card-info">Park your stables in USD+, and watch your balance grow in your wallet overnight. No staking required</label>
            </v-row>

            <v-row class="card-row info-row mt-15" justify="start" align="center">
                <label class="card-info mt-1">APY</label>
                <v-spacer></v-spacer>
                <label class="card-info-value">{{ (avgApy && avgApy.value) ? ($utils.formatMoneyComma(avgApy.value, 1)) + '%' : '—' }}</label>
                <Tooltip text="USD+ APY based on 7-day average, includes fees taken (fee-adjusted)"/>
            </v-row>

            <v-row class="card-row info-row mt-6" justify="start" align="center">
                <label class="card-info mt-1">Risk factor</label>
                <v-spacer></v-spacer>
                <label class="card-info-value card-info-risk">LOW</label>
                <Tooltip text="Risk Factor is determined by a Pool's downside volatility. Pools that have a low Risk Factor translates to smaller downside volatility."/>
            </v-row>

            <v-row class="card-row info-row mt-6" justify="start" align="center">
                <label class="card-info mt-1">TVL</label>
                <v-spacer></v-spacer>
                <label class="card-info-value">
                    {{ totalTvl ? ('$' + $utils.formatMoneyComma(totalTvl, 2)) : '—' }}
                </label>
                <Tooltip text="Past 2 hours"/>
            </v-row>

            <v-row class="card-row mt-6" justify="start" align="center">
                <label class="card-info mt-1">&nbsp;</label>
            </v-row>

            <v-row class="card-row card-banner-status-container mt-12" justify="start" align="center">
                <v-col class="card-banner-body">
                    <v-row align="center">
                        <label class="mb-4 card-info minor-card-label overview-link" @click.stop="openDashboardAction">
                            OVERVIEW
                            <v-img class="icon-img ml-2" :src="require('@/assets/icon/openLight.svg')"/>
                        </label>

                        <v-spacer></v-spacer>

                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <div class="mb-5 mr-3"
                                     v-click-outside="clickMenuOutside"
                                     @click="openedSliceList = !openedSliceList"
                                     v-bind="attrs"
                                     v-on="on">
                                    <v-row justify="center" align="start" class="slice-select-container">
                                        <v-col cols="12" class="select-col">
                                            <label class="selected-slice-label">
                                                {{ sliceLabel }}
                                                <v-icon color="#1C95E7" class="mb-1">
                                                    {{ openedSliceList ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                                </v-icon>
                                            </label>
                                        </v-col>
                                    </v-row>
                                </div>
                            </template>

                            <v-list class="slice-select-list">
                                <v-list-item style="cursor: pointer" @click="sliceDashboardByPeriod('week')">
                                    <v-list-item-title class="slice-select-list-item">
                                        Week
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item style="cursor: pointer" @click="sliceDashboardByPeriod('month')">
                                    <v-list-item-title class="slice-select-list-item">
                                        Month
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item style="cursor: pointer" @click="sliceDashboardByPeriod('all')">
                                    <v-list-item-title class="slice-select-list-item">
                                        All
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-row>

                    <v-row align="center" class="info-row">
                        <label class="my-2 card-info minor-card-label">Current balance</label>
                        <v-spacer></v-spacer>
                        <label class="card-info-value minor-card-label">{{ this.balance.usdPlus ? ($utils.formatMoneyComma(this.balance.usdPlus, 2) + ' USD+') : '—' }}</label>
                    </v-row>

                    <v-row align="center" class="mt-4 info-row">
                        <label class="my-2 card-info minor-card-label">Profit</label>
                        <label class="my-2 card-info minor-card-label title-slice ml-1">&nbsp;|&nbsp; {{ sliceLabel }}</label>
                        <v-spacer></v-spacer>
                        <label class="card-info-value minor-card-label" :class="profitUsdPlus > 0 ? 'label-success' : ''">
                            {{ profitUsdPlus ? ((profitUsdPlus > 0 ? '+' : '') + '$' + $utils.formatMoneyComma(profitUsdPlus, 4)) : '—' }}
                        </label>
                    </v-row>

                    <v-row align="center" class="mt-4 info-row">
                        <label class="my-2 card-info minor-card-label">Your APY</label>
                        <label class="my-2 card-info minor-card-label title-slice ml-1">&nbsp;|&nbsp; {{ sliceLabel }}</label>
                        <v-spacer></v-spacer>
                        <label class="card-info-value minor-card-label">
                            {{ apy ? ($utils.formatMoneyComma(apy, 1)) + '%' : '—' }}
                        </label>
                    </v-row>
                </v-col>
            </v-row>
        </v-col>

        <v-col cols="12" align-self="end">
            <v-row class="card-row mt-2" :class="showWrap ? '' : 'mb-7'" justify="center" align="center">
                <v-btn class="open-strategy-btn btn-filled" @click.stop="mintAction">Mint / Redeem USD+</v-btn>
            </v-row>
            <v-row v-if="showWrap" class="card-row mt-6 mb-7" justify="center" align="center">
                <v-btn class="open-strategy-btn btn-outlined" @click.stop="wrapAction" outlined>Wrap / Unwrap USD+</v-btn>
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

    props: {
    },

    computed: {
        ...mapGetters('dashboardData', ['profitUsdPlus', 'apy', 'slice']),
        ...mapGetters("statsData", ['currentTotalData']),
        ...mapGetters("accountData", ['balance']),
        ...mapGetters('wrapUI', ['showWrap']),
        ...mapGetters('network', ['appApiUrl', 'networkId']),

        icon: function (){
            switch (this.networkId){
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
            switch (this.slice){
                case 7:
                    return 'WEEK'
                case 30:
                    return 'MONTH'
                default:
                    return 'ALL';
            }
        },
    },

    data: () => ({
        avgApy: null,
        totalTvl: null,

        openedSliceList: false,
    }),

    watch: {
        currentTotalData: function (newVal, oldVal) {
            this.totalTvl = this.getTotalTvl();
        },

        appApiUrl: function (newVal, oldVal) {
            this.getAvgWeekApy();
        },
    },

    created() {
        this.getAvgWeekApy();
    },

    mounted() {
        this.totalTvl = this.getTotalTvl();
    },

    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
        ...mapActions('wrapModal', ['showWrapModal', 'showWrapView']),
        ...mapActions('dashboardData', ['sliceDashboard']),
        ...mapMutations('dashboardData', ['setSlice']),

        openDashboardAction() {
            this.$router.push('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        openStrategyCard() {
            this.mintAction();
        },

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        wrapAction() {
            this.showWrapView();
            this.showWrapModal();
        },

        async getAvgWeekApy() {
            let fetchOptions = {
                headers: {
                    "Access-Control-Allow-Origin": this.appApiUrl
                }
            };

            await fetch(this.appApiUrl + '/widget/avg-apy-info/week', fetchOptions)
                .then(value => value.json())
                .then(value => {
                    this.avgApy = value;
                    this.avgApy.date = moment(this.avgApy.date).format("DD MMM. ‘YY");
                }).catch(reason => {
                    console.log('Error get data: ' + reason);
                })
        },

        getTotalTvl() {
            let sum = 0;
            this.currentTotalData.forEach(dataItem => {
                sum += dataItem.value
            });

            return sum;
        },

        clickMenuOutside() {
            this.openedSliceList = false;
        },

        sliceDashboardByPeriod(slice) {
            switch (slice) {
                case "week":
                    this.setSlice(7);
                    break;
                case "month":
                    this.setSlice(30)
                    break;
                case "all":
                    this.setSlice(null)
                    break;
                default:
                    this.setSlice(null)
            }

            this.sliceDashboard();
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .tag-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        letter-spacing: 0.04em;
    }

    .currency-icon {
        width: 40px;
        height: 40px;
    }

    .card-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 28px;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .open-strategy-btn {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .selected-slice-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .slice-select-list-item {
        font-size: 14px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .tag-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.04em;
    }

    .currency-icon {
        width: 40px;
        height: 40px;
    }

    .card-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 40px;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .open-strategy-btn {
        height: 40px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .selected-slice-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .slice-select-list-item {
        font-size: 16px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .tag-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.04em;
    }

    .currency-icon {
        width: 40px;
        height: 40px;
    }

    .card-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 40px;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .open-strategy-btn {
        height: 40px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .selected-slice-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .slice-select-list-item {
        font-size: 17px;
    }
}

.card-container {
    background: #FFFFFF !important;
    border-radius: 4px !important;
    max-width: 460px !important;
}

.card-banner-status-container {
    background: #F5F5F5;
    border-radius: 4px;
}

.tag-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #22ABAC;
}

.tag-icon {
    color: #22ABAC;
}

.card-title {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
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
    color: #22ABAC !important;
}

.info-row {
    border-top: 1px solid #CED2D8;
}

.card-banner-body {
    margin: 5% 3%;
}

.open-strategy-btn {
    width: 100% !important;
    border-radius: 2px;
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

.btn-outlined {
    color: #1C95E7 !important;
}

.label-error {
    color: #CF3F92 !important;
}

.label-overcap {
    color: #F3BA2F !important;
}

.label-success {
    color: #22ABAC !important;
}

* {
  cursor: pointer;
}

.card-container:hover {
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05), 0 4px 4px 0 rgba(0, 0, 0, 0.05);
}

.title-slice {
    color: #ADB3BD !important;
}

.overview-link {
    font-weight: 400 !important;
    display: inline-flex !important;
}

.overview-link:hover {
    text-decoration: underline !important;
}

.icon-img {
    width: 24px !important;
    height: 24px !important;
}

.slice-select-container {
    background-color: rgba(28, 149, 231, 0.1) !important;
    border-radius: 4px;
    cursor: pointer;
    height: 28px !important;
}

.select-col {
    margin-top: -10px;
}

.selected-slice-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #1C95E7;
}

.slice-select-list {
    background-color: var(--secondary) !important;
    border-radius: 10px;
}

.slice-select-list-item {
    font-family: 'Roboto', sans-serif !important;
    color: #333333;
}
</style>

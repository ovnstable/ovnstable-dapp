<template>
    <div :class="$wu.isMobile() ? 'ml-0' : ''">
        <div class="page-container ma-0">
            <v-row v-if="isEthPlusLoading">
                <v-row align="center" justify="center" class="py-15">
                    <v-progress-circular
                        width="2"
                        size="24"
                        color="#8FA2B7"
                        indeterminate
                    ></v-progress-circular>
                </v-row>
            </v-row>

            <v-row v-if="!isEthPlusLoading" class="ma-0 info-card-container" :class="$wu.isFull() ? 'mt-6' : 'mt-3'">
                <v-col class="info-card-body-bottom">
                    <v-row align="center" justify="start" class="ma-0">
                        <v-col :cols="$wu.isFull() ? 3 : 12">
                            <v-row class="container-body-title-row" justify="start" align="center"
                                   :class="$wu.isFull() ? '' : 'mb-0'">
                                <div class="coin-img mr-2" :class="$wu.isFull() ? '' : 'mb-1'"
                                     v-if="!$wu.isFull() && (!walletConnected || !isLoading)">
                                    <v-img :src="require('@/assets/currencies/ethPlus.svg')"/>
                                </div>
                                <v-progress-circular
                                    v-if="!$wu.isFull() && isLoading && walletConnected"
                                    width="2"
                                    size="24"
                                    color="#8FA2B7"
                                    indeterminate
                                    class="mr-2"
                                ></v-progress-circular>
                                <label class="container-body-title"
                                       :class="$wu.isFull() ? '' : 'mb-1'">ETH+</label>
                                <label class="container-body-title container-body-title-slice"
                                       :class="$wu.isFull() ? '' : 'mb-1'" v-if="$wu.isFull()">&nbsp;&nbsp;|&nbsp;</label>
                                <v-spacer v-if="!$wu.isFull()"></v-spacer>
                                <label class="container-body-title container-body-title-slice"
                                       :class="$wu.isFull() ? '' : 'mb-1'">{{ sliceLabel }}</label>
                            </v-row>
                        </v-col>

                        <v-col :cols="$wu.isFull() ? 8 : 12">
                            <v-row justify="end" align="center">
                                <v-col>
                                    <v-row justify="center" align="center">
                                        <label class="container-info-sub-title">
                                            Balance
                                        </label>
                                    </v-row>
                                    <v-row justify="center" align="center">
                                        <label class="container-info-text" :class="dataHidden ? 'hidden-label' : ''">
                                            {{ dataHidden ? '' : '' + $utils.formatMoney(this.balance.ethPlus, 6) + ' WETH' }}
                                        </label>
                                    </v-row>
                                </v-col>

                                <v-col>
                                    <v-row justify="center" align="center">
                                        <label class="container-info-sub-title">
                                            Profit
                                        </label>
                                    </v-row>
                                    <v-row justify="center" align="center">
                                        <label class="container-info-text" :class="dataHidden ? 'hidden-label' : ''">
                                            {{ dataHidden ? '' : '' + formatDailyProfitSubZeroValue() + ' WETH'}}
                                        </label>
                                    </v-row>
                                </v-col>

                                <v-col>
                                    <v-row justify="center" align="center">
                                        <label class="container-info-sub-title">
                                            Return
                                        </label>
                                    </v-row>
                                    <v-row justify="center" align="center">
                                        <label class="container-info-text" :class="dataHidden ? 'hidden-label' : ''">
                                            {{ dataHidden ? '' : comp === 0 ? '—' : ($utils.formatMoney(comp, 2) + '%') }}
                                        </label>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col v-if="$wu.isFull()">
                            <v-row justify="end" align="center">
                                <div class="coin-img" v-if="!walletConnected || !isLoading">
                                    <v-img :src="require('@/assets/currencies/ethPlus.svg')"/>
                                </div>
                                <v-progress-circular
                                    v-if="walletConnected && isLoading"
                                    width="2"
                                    size="40"
                                    color="#8FA2B7"
                                    indeterminate
                                ></v-progress-circular>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <v-row v-if="!isEthPlusLoading && !anyActivities" align="center" justify="start" class="ma-0" :class="$wu.isFull() ? 'mt-8' : 'mt-5'">
                <v-btn class="dashboard-action-btn btn-filled" @click="mintAction" v-if="walletConnected">
                    Mint ETH+ to start
                </v-btn>
                <v-btn class="dashboard-action-btn btn-outlined" outlined @click="connectWallet" v-else>
                    Connect wallet
                </v-btn>
            </v-row>

            <v-row v-if="!isEthPlusLoading && anyActivities" align="center" justify="start" class="ma-0 info-card-container"
                   :class="$wu.isFull() ? 'mt-6' : 'mt-3'">
                <v-col class="info-card-body-bottom">
                    <template v-if="portfolioValue">
                        <LineChart :data="portfolioValue"
                                   asset-type="eth+"/>
                    </template>
                </v-col>
            </v-row>

            <v-row v-if="!isEthPlusLoading && anyActivities" align="center" justify="start" class="ma-0 info-card-container"
                   :class="$wu.isFull() ? 'mt-6' : 'mt-3'">
                <v-col class="info-card-body-bottom">
                    <v-row align="center" justify="start" class="ma-0">
                        <label class="container-body-title" :class="$wu.isFull() ? '' : 'mb-1'">
                            ETH+ Transactions
                        </label>
                    </v-row>

                    <v-row align="center" justify="start" class="ma-0 mt-2">
                        <Table
                            v-if="$wu.isFull()"
                            :data="activities"
                            asset-type="eth+"/>

                        <Table
                            v-else
                            minimized
                            :data="activities"
                            asset-type="eth+"/>

                        <v-row justify="center" align="center" class="ma-0 scroll-container">
                            <label class="table-scroll-label">scroll to see more</label>
                        </v-row>
                    </v-row>
                </v-col>
            </v-row>
        </div>
        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import Table from "@/components/dashboard/Table";
import {mapActions, mapGetters, mapMutations} from "vuex";
import LineChart from "@/components/widget/LineChart";
import {axios} from "@/plugins/http-axios";
import moment from "moment/moment";
import { dashboardApiService } from '/src/services/dashboard-api-service';


export default {
    name: "EthTab",

    components: {
        LineChart,
        Table,
    },

    data: () => ({
        tab: 3,

        openedSliceList: false,

        isEthPlusLoading: true,
        profitEthPlus: null,
        apy: null,
        comp: null,
        activities: null,
        portfolioValue: {
            labels: [],
            datasets: [
                {
                    fill: false,
                    borderColor: '#69a5fd',
                    data: [],
                }
            ]
        }
    }),

    computed: {
        ...mapGetters('network', ['apiUrl', 'networkId']),
        ...mapGetters('accountData', ['balance', 'account']),
        ...mapGetters('dashboardData', ['slice']),
        ...mapGetters('walletAction', ['walletConnected']),
        ...mapGetters('magicEye', ['dataHidden']),
        ...mapGetters('web3', ['web3']),

        anyActivities() {
            return this.activities && this.activities.length > 0;
        },

        isLoading() {
            return !this.account;
        },

        sliceLabel() {
            switch (this.slice) {
                case 7:
                    return 'WEEK'
                case 30:
                    return 'MONTH'
                default:
                    return 'ALL';
            }
        },

        isMobile() {
            return window.innerWidth <= 1400;
        }
    },
    watch: {
        account: function () {
            this.loadData();
        },
    },
    mounted() {
        this.loadData();
    },
    methods: {
        ...mapActions('walletAction', ['connectWallet']),
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
        ...mapActions('track', ['trackClick']),
        ...mapActions('magicEye', ['switchEye']),

        ...mapMutations('dashboardData', ['setSlice']),

        loadData() {
            this.isEthPlusLoading = true;
            this.resetDashboard();
            this.refreshDashboard();
        },


        formatDailyProfitSubZeroValue() {
            return this.profitEthPlus < 0
                ? `-${this.$utils.formatMoney(Math.abs(this.profitEthPlus), 4)}`
                : `${this.$utils.formatMoney(this.profitEthPlus, 4)}`;
        },

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        clickMenuOutside() {
            this.openedSliceList = false;
        },

        sliceDashboardByPeriod(slice) {
            switch (slice) {
                case "week":
                    this.setSlice(7);
                    // this.trackClick({action: 'week-tab-action-click', event_category: 'Dashboard range', event_label: 'Change range Week', value: 1 });
                    break;
                case "month":
                    this.setSlice(30)
                    // this.trackClick({action: 'month-tab-action-click', event_category: 'Dashboard range', event_label: 'Change range Month', value: 1 });
                    break;
                case "all":
                    this.setSlice(null)
                    // this.trackClick({action: 'all-tab-action-click', event_category: 'Dashboard range', event_label: 'Change range All', value: 1 });
                    break;
                default:
                    this.setSlice(null)
            }

            this.sliceDashboard();
        },

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },
        resetDashboard() {
            this.profitEthPlus = null;
            this.portfolioValue = null;
            this.apy = null;
            this.activities = null;
            this.slice = null;
        },
        async refreshDashboard() {
            console.log("Dashboard: refreshDashboard");
            if (!this.account) {
                this.isEthPlusLoading = false;
                return;
            }

            console.log("Dashboard: refreshDashboard after");

            let account = this.account.toLowerCase();
            let apiUrl = `${this.apiUrl}/arbitrum/eth+/`;
            let productId = 'ETH+';

            try {
                const data = await dashboardApiService.getClientBalanceChanges(apiUrl, account, productId);
                console.log('Client Balance Changes:', data);

                let clientData = data.map(item => ({
                    transactionHash: item.transaction_hash,
                    date: item.date,
                    type: item.type,
                    openingBalance: item.opening_balance,
                    balanceChange: item.change_balance,
                    closingBalance: item.closing_balance,
                    dailyProfit: item.type === 'PAYOUT' ? item.change_balance : null,
                    fee: item.fee,
                    apy: item.apy,
                    duration: item.elapsed_time,
                }));

                this.activities = clientData;
                console.log("ACTIVITIES:", this.activities);

                let widgetDataDict = {};
                let widgetData = {
                    labels: [],
                    datasets: [
                        {
                            fill: false,
                            borderColor: '#69a5fd',
                            data: [],
                        }
                    ]
                };

                [...clientData].reverse().forEach(item => {
                    widgetDataDict[moment(item.date).format('DD.MM.YYYY')] = item.closingBalance;
                });

                for (let key in widgetDataDict) {
                    widgetData.labels.push(key);
                    widgetData.datasets[0].data.push(widgetDataDict[key]);
                }

                console.log("WIDGET DATA:", widgetData)

                this.portfolioValue = widgetData;
                console.log("PORTFOLIO VALUE:", widgetData.labels, widgetData.datasets[0].data)

                this.isEthPlusLoading = false;
                this.sliceDashboard();
            } catch (error) {
                console.error('Error:', error);
            }
        },
        sliceDashboard() {
            console.log("sliceDashboard this.slice: ", this.slice);
            console.log("sliceDashboard this.activities: ", this.activities);

            let clientData = this.activities.filter(value => value.type === 'PAYOUT');
            clientData = this.slice ? clientData.slice(0, this.slice) : clientData;

            let apyDataList = [...clientData];

            let days = apyDataList.length;

            apyDataList.forEach(value => {
                value.changePercent = value.balanceChange / value.openingBalance;
            })

            let productResult = 1.0;
            let durationSum = 0.0;

            for (let i = 0; i < days; i++) {
                productResult = productResult * (1.0 + apyDataList[i].changePercent);
                durationSum = durationSum + apyDataList[i].duration;
            }

            let apy = Math.pow(productResult, 365.0 / (durationSum / 24.0)) - 1.0;

            if (apy) {
                this.apy = apy * 100.0;
            } else {
                this.apy = 0;
            }

            let profitList = clientData.map(item => item.dailyProfit ? item.dailyProfit : 0).filter(item => item !== 0);
            if (profitList && (profitList.length > 0)) {
                const sum = profitList.reduce((a, b) => a + b, 0);

                this.profitEthPlus = sum;
            } else {
                this.profitEthPlus = 0;
            }
        }
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 32px;
        line-height: 40px;
    }

    .slice-select-main-container {
        width: 100% !important;
    }

    .slice-select-container {
        height: 40px !important;
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

    .coin-img {
        width: 24px !important;
        height: 24px !important;
    }

    .container-body-title {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
    }

    .container-body-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .container-body-title-row {
        border-bottom: 1px solid var(--main-border) !important;
    }

    .container-info-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }

    .container-info-text {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
    }

    .container-body-title-slice {
        font-size: 14px !important;
        line-height: 18px !important;
    }

    .dashboard-action-btn {
        width: 100% !important;
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.04em !important;
    }

    .useful-link {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .useful-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 32px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .slice-select-main-container {
        width: 100% !important;
    }

    .slice-select-container {
        height: 40px !important;
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

    .coin-img {
        width: 24px !important;
        height: 24px !important;
    }

    .container-body-title {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
    }

    .container-body-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .container-body-title-row {
        border-bottom: 1px solid var(--main-border) !important;
    }

    .container-info-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }

    .container-info-text {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
    }

    .container-body-title-slice {
        font-size: 14px !important;
        line-height: 18px !important;
    }

    .dashboard-action-btn {
        width: 300px !important;
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.04em !important;
    }

    .useful-link {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .useful-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .hidden-label {
        width: 130px;
        height: 28px;
        background: var(--hide-account);
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 32px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .slice-select-container {
        height: 28px !important;
    }

    .select-col {
        margin-top: -10px;
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

    .coin-img {
        width: 40px !important;
        height: 40px !important;
    }

    .container-body-title {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 32px;
    }

    .container-body-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .container-info-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .container-info-text {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .container-body-title-slice {
        font-size: 16px !important;
        line-height: 20px !important;
    }

    .dashboard-action-btn {
        width: 300px !important;
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .useful-link {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .useful-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
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
    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 28px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 48px;
        line-height: 60px;
    }

    .slice-select-container {
        height: 28px !important;
    }

    .select-col {
        margin-top: -10px;
    }

    .selected-slice-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 12px;
        letter-spacing: 0.03em;
    }

    .slice-select-list-item {
        font-size: 15px;
    }

    .coin-img {
        width: 38px !important;
        height: 38px !important;
    }

    .container-body-title {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 32px;
    }

    .container-body-text {
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 24px;
    }

    .container-info-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .container-info-text {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 28px;
    }

    .container-body-title-slice {
        font-size: 16px !important;
        line-height: 20px !important;
    }

    .dashboard-action-btn {
        width: 250px !important;
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .useful-link {
        font-style: normal;
        font-weight: 300;
        font-size: 15px;
        line-height: 24px;
    }

    .useful-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .hidden-label {
        width: 130px;
        height: 28px;
        background: var(--hide-account);
    }
}

.page-container {
    margin-bottom: 5% !important;
}

.tab-btn {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
    margin-bottom: -2px;
    cursor: pointer;
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.tab-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer;
}

.tab-button-in-active {
    color: var(--secondary-gray-text) !important;
    cursor: default;
}

.tab-btn-disabled {
    cursor: default;
    color: var(--disabled-value) !important;
}

.slice-select-container {
    background-color: rgba(28, 149, 231, 0.1) !important;
    border-radius: 4px;
    cursor: pointer;
}

.selected-slice-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--links-blue);
}

.slice-select-list {
    background-color: var(--secondary) !important;
    border-radius: 10px;
}

.slice-select-list-item {
    font-family: 'Roboto', sans-serif !important;
    color: var(--secondary-gray-text);
}

.info-card-container {
    background: var(--secondary);
    border-radius: 4px;
}

.info-card-body-bottom {
    margin: 2% 2% !important;
}

.container-body-title {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--main-gray-text);
}

.container-body-text {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.text-wide {
    text-align: justify;
    width: 100%;
}

.container-info-sub-title {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
}

.container-info-text {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--main-gray-text);
}

.container-body-title-slice {
    color: var(--third-gray-text) !important;
}

.dashboard-action-btn {
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
    color: var(--links-blue) !important;
}

.scroll-container {
    height: 24px !important;
    background: var(--scroll-color) !important;
}

.table-scroll-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
}

.useful-title {
    font-family: 'Roboto';
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.useful-link {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--links-blue);
    cursor: pointer;
}

.useful-link:hover {
    text-decoration: underline !important;
}

.sticky {
    margin-right: 4% !important;
    position: fixed !important;
}
</style>
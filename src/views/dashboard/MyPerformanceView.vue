<template>
    <div>
        <div class="mt-10" :class="$wu.isMobile() ? 'ml-5' : ''">
            <label class="title-label">My dashboard</label>

            <v-row align="start" justify="start" class="ma-0">
                <v-col :cols="$wu.isFull() ? 9 : 12" class="ma-n3">
                    <v-row align="center" justify="start" class="ma-0 toggle-row mt-10">

                        <label class="tab-btn tab-btn-disabled mr-4" v-bind:class="activeTabOverall" disabled>Overall</label>
                        <label class="tab-btn mx-4" @click="setTab(2)" v-bind:class="activeTabUsdPlus">USD+</label>
                        <label class="tab-btn mx-4" @click="setTab(3)" v-bind:class="activeTabETS" disabled>ETS</label>

                        <v-spacer></v-spacer>

                        <v-menu offset-y v-if="$wu.isFull()">
                            <template v-slot:activator="{ on, attrs }">
                                <div class="slice-select-main-container mb-1 mr-3"
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
                </v-col>

                <v-col cols="3" v-if="$wu.isFull()">
                </v-col>
            </v-row>

            <v-row v-if="!$wu.isFull()" align="start" justify="start" class="ma-0 mt-3">
                <v-col cols="12" class="ma-n3">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <div class="slice-select-main-container"
                                 v-click-outside="clickMenuOutside"
                                 @click="openedSliceList = !openedSliceList"
                                 v-bind="attrs"
                                 v-on="on">
                                <v-row class="ma-0 slice-select-container">
                                    <v-spacer></v-spacer>
                                    <label class="selected-slice-label mt-2">
                                        {{ sliceLabel }}
                                        <v-icon color="#1C95E7" class="mb-1">
                                            {{ openedSliceList ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                        </v-icon>
                                    </label>
                                    <v-spacer></v-spacer>
                                </v-row>
                            </div>
                        </template>

                        <v-list class="slice-select-list">
                            <v-list-item style="cursor: pointer">
                                <v-list-item-title class="slice-select-list-item"
                                                   @click="sliceDashboardByPeriod('week')">
                                    Week
                                </v-list-item-title>
                            </v-list-item>
                            <v-list-item style="cursor: pointer">
                                <v-list-item-title class="slice-select-list-item"
                                                   @click="sliceDashboardByPeriod('month')">
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
                </v-col>
            </v-row>
        </div>

        <div :class="$wu.isMobile() ? 'ml-5' : ''">
            <v-row align="start" justify="start" class="page-container ma-0">

                <v-col v-if="tab === 3" :cols="$wu.isFull() ? 9 : 12" class="ma-n3">
                  <EtsTab></EtsTab>
                </v-col>

                <v-col v-if="tab === 2" :cols="$wu.isFull() ? 9 : 12" class="ma-n3">

                    <v-row v-if="isUsdPlusLoading">
                      <v-row align="center" justify="center" class="py-15">
                        <v-progress-circular
                            width="2"
                            size="24"
                            color="#8FA2B7"
                            indeterminate
                        ></v-progress-circular>
                      </v-row>
                    </v-row>
                    <v-row v-if="!isUsdPlusLoading" class="ma-0 info-card-container" :class="$wu.isFull() ? 'mt-6' : 'mt-3'">
                        <v-col class="info-card-body-bottom">
                            <v-row align="center" justify="start" class="ma-0">
                                <v-col :cols="$wu.isFull() ? 3 : 12">
                                    <v-row class="container-body-title-row" justify="start" align="center"
                                           :class="$wu.isFull() ? '' : 'mb-0'">
                                        <div class="coin-img mr-2" :class="$wu.isFull() ? '' : 'mb-1'"
                                             v-if="!$wu.isFull() && (!walletConnected || !isLoading)">
                                            <v-img :src="require('@/assets/currencies/usdPlus.svg')"/>
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
                                               :class="$wu.isFull() ? '' : 'mb-1'">USD+</label>
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
                                                    {{ dataHidden ? '' : '$' + $utils.formatMoney(balance.usdPlus, 2) }}
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
                                                    {{ dataHidden ? '' : '$' + $utils.formatMoney(profitUsdPlus, isMobile ? 2 : 6) }}
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
                                            <v-img :src="require('@/assets/currencies/usdPlus.svg')"/>
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

                    <v-row v-if="!isUsdPlusLoading && !anyActivities" align="center" justify="start" class="ma-0" :class="$wu.isFull() ? 'mt-8' : 'mt-5'">
                        <v-btn class="dashboard-action-btn btn-filled" @click="mintAction" v-if="walletConnected">
                            Mint USD+ to start
                        </v-btn>
                        <v-btn class="dashboard-action-btn btn-outlined" outlined @click="connectWallet" v-else>
                            Connect wallet
                        </v-btn>
                    </v-row>

                    <v-row v-if="!isUsdPlusLoading && anyActivities" align="center" justify="start" class="ma-0 info-card-container"
                           :class="$wu.isFull() ? 'mt-6' : 'mt-3'">
                        <v-col class="info-card-body-bottom">
                            <template v-if="portfolioValue">
                                <LineChart :data="portfolioValue"/>
                            </template>
                        </v-col>
                    </v-row>

                    <v-row v-if="!isUsdPlusLoading && anyActivities" align="center" justify="start" class="ma-0 info-card-container"
                           :class="$wu.isFull() ? 'mt-6' : 'mt-3'">
                        <v-col class="info-card-body-bottom">
                            <v-row align="center" justify="start" class="ma-0">
                                <label class="container-body-title" :class="$wu.isFull() ? '' : 'mb-1'">USD+
                                    Transactions</label>
                            </v-row>

                            <v-row align="center" justify="start" class="ma-0 mt-2">
                                <Table
                                    v-if="$wu.isFull()"
                                    :data="activities"/>

                                <Table
                                    v-else
                                    minimized
                                    :data="activities"/>

                                <v-row justify="center" align="center" class="ma-0 scroll-container">
                                    <label class="table-scroll-label">scroll to see more</label>
                                </v-row>
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row v-if="!isUsdPlusLoading && anyActivities" align="center" justify="start" class="ma-0 info-card-container"
                           :class="$wu.isFull() ? 'mt-6' : 'mt-3'">
                        <v-col class="info-card-body-bottom">
                            <v-row align="start" justify="start" class="ma-0">
                                <v-col :cols="$wu.isFull() ? 3 : 12">
                                    <v-row class="container-body-title-row" justify="start"
                                           :align="$wu.isFull() ? 'start' : 'center'"
                                           :class="$wu.isFull() ? '' : 'mb-0'">
                                        <div class="coin-img mr-2" :class="$wu.isFull() ? '' : 'mb-1'"
                                             v-if="!$wu.isFull()">
                                            <v-img :src="require('@/assets/currencies/wUsdPlus.svg')"/>
                                        </div>
                                        <label class="container-body-title" :class="$wu.isFull() ? '' : 'mb-1'">Wrapped
                                            USD+</label>
                                    </v-row>
                                </v-col>

                                <v-col :cols="$wu.isFull() ? 8 : 12">
                                    <v-row justify="start" align="start">
                                        <label class="container-body-text text-wide">
                                            wUSD+ is an index-adjusted wrapper for USD+. Some people may find this
                                            useful for cross-blockchain purposes. Unlike your USD+ balance, your wUSD+
                                            balance will not increase over time. When wUSD+ is unwrapped, you receive
                                            USD+ based on the latest (ever-increasing) index, so the total yield is the
                                            same.
                                        </label>
                                    </v-row>
                                </v-col>

                                <v-col v-if="$wu.isFull()">
                                    <v-row justify="end" align="start">
                                        <div class="coin-img">
                                            <v-img :src="require('@/assets/currencies/wUsdPlus.svg')"/>
                                        </div>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col :cols="$wu.isFull() ? 3 : 12">
                    <div :class="$wu.isFull() ? 'sticky' : ''">
                        <v-row align="center" justify="start" class="ma-0 mt-3 info-card-container"
                               :class="$wu.isFull() ? '' : 'mr-3 ml-n3'">
                            <v-col class="info-card-body-bottom">
                                <v-row align="start" justify="start" class="ma-0">
                                    <label class="useful-title">Useful articles</label>
                                </v-row>

                <v-row align="start" justify="start" class="ma-0 mt-7">
                  <label class="useful-link"
                         @click="openLink('https://overnight.fi/blog/2022/05/20/how-to-partake-in-liquidity-provisions-for-usd-on-polygon/')">
                    How to Partake in Liquidity Provisions for USD+
                  </label>
                </v-row>

                <v-row align="start" justify="start" class="ma-0 mt-5">
                  <label class="useful-link"
                         @click="openLink('https://overnight.fi/blog/2022/05/08/how-to-buy-usd-if-you-already-own-cryptocurrency/')">
                    How to buy USD+ if you already own cryptocurrency
                  </label>
                </v-row>

                <v-row align="start" justify="start" class="ma-0 mt-5">
                  <label class="useful-link"
                         @click="openLink('https://overnight.fi/blog/2022/05/07/how-to-buy-usd-with-fiat/')">
                    How to buy USD+ via Fiat
                  </label>
                </v-row>

                <v-row align="start" justify="start" class="ma-0 mt-5">
                  <label class="useful-link"
                         @click="openLink('https://overnight.fi/blog/2022/10/28/what-to-do-if-your-transaction-is-still-stuck/')">
                      What to do if your transaction is still stuck
                  </label>
                </v-row>
              </v-col>
            </v-row>

            <v-row align="center" justify="start" class="ma-0 mt-3 info-card-container"
                   :class="$wu.isFull() ? '' : 'mr-3 ml-n3'">
              <v-col class="info-card-body-bottom">
                <v-row align="start" justify="start" class="ma-0">
                  <label class="useful-title">Video tutorials</label>
                </v-row>

                <v-row align="start" justify="start" class="ma-0 mt-7">
                  <label class="useful-link"
                         @click="openLink('https://www.youtube.com/watch?v=AqNqkQ9m_rI')">
                    What is USD+
                  </label>
                </v-row>

                  <v-row align="start" justify="start" class="ma-0 mt-3">
                      <label class="useful-link"
                             @click="openLink('https://www.youtube.com/watch?v=wIVAiUMLmvA')">
                          Exchange Trading Strategies explained
                      </label>
                  </v-row>

              </v-col>
            </v-row>
          </div>
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
import EtsTab from "@/views/dashboard/tab/ets/EtsTab.vue";
import {axios} from "@/plugins/http-axios";
import moment from "moment/moment";

export default {
  name: "MyPerformanceView",

  components: {
    EtsTab,
    LineChart,
    Table,
  },

    data: () => ({
      tab: 2,

      openedSliceList: false,

      isUsdPlusLoading: true,
      profitUsdPlus: null,
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
        ...mapGetters('network', ['appApiUrl']),
        ...mapGetters('accountData', ['balance', 'account']),
        ...mapGetters('dashboardData', ['slice']),
        ...mapGetters('walletAction', ['walletConnected']),
        ...mapGetters('magicEye', ['dataHidden']),

    activeTabOverall: function () {
      return {
        'tab-button': this.tab === 1,
        'tab-button-in-active': this.tab !== 1,
      }
    },

    activeTabUsdPlus: function () {
      this.trackClick({action: 'open-usdplustab-action-click', event_category: 'Dashboard USD+', event_label: 'Open USD+ Tab', value: 1 });

      return {
        'tab-button': this.tab === 2,
        'tab-button-in-active': this.tab !== 2,
      }
    },

    activeTabETS: function () {
      this.trackClick({action: 'open-etstab-action-click', event_category: 'Dashboard ETS', event_label: 'Open ETS Tab', value: 1 });
      return {
        'tab-button': this.tab === 3,
        'tab-button-in-active': this.tab !== 3,
      }
    },

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
      appApiUrl: function () {
        this.loadData();
      }
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

      setTab(tab) {
          if (tab === 2) {
            this.tab = tab;
            this.loadData();
            return
          }

          this.tab = tab;
      },

      loadData() {
        this.isUsdPlusLoading = true;
        this.resetDashboard();
        this.refreshDashboard();
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
          this.trackClick({action: 'week-tab-action-click', event_category: 'Dashboard range', event_label: 'Change range Week', value: 1 });
          break;
        case "month":
          this.setSlice(30)
          this.trackClick({action: 'month-tab-action-click', event_category: 'Dashboard range', event_label: 'Change range Month', value: 1 });
          break;
        case "all":
          this.setSlice(null)
          this.trackClick({action: 'all-tab-action-click', event_category: 'Dashboard range', event_label: 'Change range All', value: 1 });
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
          this.profitUsdPlus = null;
          this.portfolioValue = null;
          this.apy = null;
          this.activities = null;
          this.slice = null;
      },
      async refreshDashboard() {

        console.log("Dashboard: refreshDashboard");
        if (!this.account) {
          this.isUsdPlusLoading = false;
          return;
        }

        console.log("Dashboard: refreshDashboard after");

        let account  = this.account.toLowerCase();

        let appApiUrl = this.appApiUrl;
        let response = (await axios.get(appApiUrl + `/dapp/clientBalanceChanges?address=${account}`)).data;

        let clientData = response.map(item => {
          return {
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
          }
        });

        this.activities = clientData;


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

        this.portfolioValue = widgetData;

        this.isUsdPlusLoading = false;
        this.sliceDashboard();
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

          this.profitUsdPlus = sum;
        } else {
          this.profitUsdPlus = 0;
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

<template>
  <div>

    <div v-if="strategiesLoading">
      <v-row align="center" justify="center" class="pt-15">
        <v-progress-circular
            width="2"
            size="24"
            color="#8FA2B7"
            indeterminate
            class="mr-2"
        ></v-progress-circular>
      </v-row>
    </div>
    <div v-else>
      <div>
        <EtsStrategyList :strategies="strategies" :statistics="strategyStatistics"></EtsStrategyList>
      </div>

      <div v-if="statisticsLoading">
        <v-row align="center" justify="center" class="pt-15">
          <v-progress-circular
              width="2"
              size="24"
              color="#8FA2B7"
              indeterminate
              class="mr-2"
          ></v-progress-circular>
        </v-row>
      </div>
      <div v-else>
        <div v-for="(statistic, index) in strategyStatistics" :key="statistic.product">
         <div class="statistic-container">
           <v-row @click="toggleStrategyStatistic(statistic)" style="cursor: pointer">
             <v-col cols="1" class="coin-img" :class="$wu.isFull() ? '' : 'mb-1'">
               <!--              <v-img :src="'/assets/currencies/market/ets_' + statistic.name + '.svg'"/>-->
             </v-col>

             <v-col cols="9" class="statistic-title">
               {{statistic.name}}
             </v-col>

             <v-col cols="1">
               <label>
                 <v-icon color="#ADB3BD" class="mb-1">
                   {{ statistic.isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                 </v-icon>
               </label>
             </v-col>
           </v-row>
         </div>

          <div v-if="statistic.isOpen">
            <div>
              <EtsStrategyStatistic
                  :charts="statistic.charts"
                  :index="index"
                  :name="statistic.name"
                  :transactions="statistic.transactions"></EtsStrategyStatistic>
            </div>
          </div>

          <v-divider class="ets-list-divider"></v-divider>
        </div>
      </div>

      <v-row v-else align="center" justify="start" class="ma-0" :class="$wu.isFull() ? 'mt-8' : 'mt-5'">
        <v-btn class="dashboard-action-btn btn-filled" @click="mintAction" v-if="walletConnected">
          Mint USD+ to start
        </v-btn>
        <v-btn class="dashboard-action-btn btn-outlined" outlined @click="connectWallet" v-else>
          Connect wallet
        </v-btn>
      </v-row>


    </div>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import { dashboardApiService } from "@/services/dashboard-api-service";
import moment from "moment/moment";
import EtsStrategyStatistic from "@/views/dashboard/tab/ets/EtsStrategyStatistic.vue";
import EtsStrategyList from "@/views/dashboard/tab/ets/EtsStrategyList.vue";

export default {
  name: "EtsTab",
  components: {
    EtsStrategyStatistic,
    EtsStrategyList
  },
  data() {
    return {
      chartTab: 'BALANCE',
      strategiesLoading: true,
      statisticsLoading: true,
      strategies: null,
      strategyStatistics: null,
    }
  },
  mounted() {
    this.loadData();
  },
  computed: {
    ...mapGetters('walletAction', ['walletConnected']),
    ...mapGetters('accountData', ['balance', 'account', 'uns']),
    ...mapGetters("network", ["appApiUrl"]),


  },
  watch: {
    account: function () {
      this.loadData();
    }
  },
  methods: {
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
    ...mapActions('walletAction', ['connectWallet']),

    mintAction() {
      this.showMintView();
      this.showSwapModal();
    },
    loadData() {
      this.strategiesLoading = true;

      if (!this.account) {
        this.strategiesLoading = false;
        return;
      }

      dashboardApiService.getClientStrategies(this.appApiUrl, this.account.toLowerCase())
      .then(data => {
        this.strategies = data;
        this.strategiesLoading = false;
        this.loadStrategiesStatistics(this.strategies);
      })
      .catch(e => {
        this.strategiesLoading = false;
        console.log("EtsTab loaded data Error: ", e)
      })

    },
    async loadStrategiesStatistics(strategies) {
      this.statisticsLoading = true;

      if (!strategies || strategies.length === 0) {
        this.statisticsLoading = false;
        return;
      }

      this.strategyStatistics = [];
      for (let i = 0; i < strategies.length; i++) {
        let strategy = strategies[i];
        let statistic = await this.getStatistic(strategy.product);
        this.summaryData(statistic);

        // open first
        if (i === 0) {
          this.toggleStrategyStatistic(statistic);
        }

        this.strategyStatistics.push(statistic);
        console.log("strategyStatistics ", this.strategyStatistics)
      }

      this.statisticsLoading = false;
    },
    async getStatistic(product) {
      let productData = await this.loadProductStatistic(product);
      console.log("strategyStatistics productData", productData);

      let balancesWidgetData = this.getWidgetData(productData, 'closingBalance', '#8247E5');
      let profitWidgetData = this.getWidgetData(productData, 'dailyProfit', '#8247E5');
      let apyWidgetData = this.getWidgetData(productData, 'apy', '#8247E5');
      return {
        isOpen: false,
        name: product,
        charts: {
          balance: balancesWidgetData,
          profit: profitWidgetData,
          apy: apyWidgetData,
        },
        apy: 0,
        totalValue: 0,
        profit: 0,
        transactions: productData
      }
    },
    loadProductStatistic(product) {
      console.log("EtsTab loaded data:loadStatistic ", product)
      return dashboardApiService.getClientBalanceChanges(this.appApiUrl, this.account.toLowerCase(), product)
            .then(data => {
              console.log("EtsTab loaded data statistic:3 ", data)
              return  data.map(item => {
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
      })
      .catch(e => {
        console.log("EtsTab loaded data statistic Error: ", e)
      })
    },
    getWidgetData(productData, propertyName, chartColor) {
      let widgetDataDict = {};
      let widgetData = {
        labels: [],
        datasets: [
          {
            fill: false,
            borderColor: chartColor ? chartColor : '#69a5fd',
            data: [],
          }
        ]
      };

      [...productData].reverse().forEach(item => {
        widgetDataDict[moment(item.date).format('DD.MM.YYYY')] = item[propertyName];
      });

      for (let key in widgetDataDict) {
        widgetData.labels.push(key);
        widgetData.datasets[0].data.push(widgetDataDict[key]);
      }

      return widgetData;
    },
    summaryData(strategyStatistic, slice) {

      let clientData = strategyStatistic.transactions.filter(value => value.type === 'PAYOUT');
      clientData = slice ? clientData.slice(0, slice) : clientData;
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
        strategyStatistic.apy = apy * 100;
      }

      let profitList = clientData.map(item => item.dailyProfit ? item.dailyProfit : 0).filter(item => item !== 0);
      if (profitList && (profitList.length > 0)) {
        const sum = profitList.reduce((a, b) => a + b, 0);
        strategyStatistic.profit = sum;
      }

      let lastData = clientData[0]
      if (lastData) {
        strategyStatistic.totalValue = lastData.closingBalance;
      }
    },
    toggleStrategyStatistic(statistic) {
      statistic.isOpen = !statistic.isOpen;
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

  .rate-tab-btn {
    height: 32px !important;
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 14px !important;
    line-height: 20px !important;
    letter-spacing: 0.03em !important;
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

  .rate-tab-btn {
    height: 40px !important;
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
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

  .rate-tab-btn {
    height: 40px !important;
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
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

  .rate-tab-btn {
    height: 40px !important;
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
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


.rate-tab-btn {
  width: 100% !important;

  font-family: 'Roboto', sans-serif !important;
  text-align: center !important;
  text-transform: uppercase !important;
  font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.rate-tab-button {
  background: rgba(28, 149, 231, 0.1);
  border-radius: 4px;
  border: none !important;
  color: var(--links-blue) !important;
}

.rate-tab-button-in-active {
  border-radius: 4px;
  color: #707A8B !important;
  border: 1px solid var(--main-border) !important;
}

.statistic-title {
  font-family: 'Roboto', sans-serif;
  font-feature-settings: 'liga' off;
  color: var(--secondary-gray-text) !important;
}

.statistic-container {
  padding-top: 28px;
  padding-bottom: 16px;
}

.ets-list-divider {
  border-color: var(--fourth-gray-text) !important;
}
</style>

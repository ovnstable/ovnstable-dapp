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
      <div >
        <EtsStrategyList :strategies="strategies" :statistics="strategyStatistics"></EtsStrategyList>
      </div>
      <v-row v-if="!strategies || strategies.length === 0" align="center" justify="start" class="ma-0" :class="$wu.isFull() ? 'mt-8' : 'mt-5'">
        <v-btn class="dashboard-action-btn btn-filled" @click="etsClick()">
          Mint ETS
        </v-btn>
      </v-row>

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
             <StatisticListCard :statistic="statistic"></StatisticListCard>
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

    </div>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import { dashboardApiService } from "@/services/dashboard-api-service";
import moment from "moment/moment";
import EtsStrategyStatistic from "@/views/dashboard/tab/ets/EtsStrategyStatistic.vue";
import EtsStrategyList from "@/views/dashboard/tab/ets/EtsStrategyList.vue";
import StatisticListCard from "@/views/dashboard/tab/ets/StatisticListCard.vue";

export default {
  name: "EtsTab",
  components: {
    StatisticListCard,
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
      productTransactionsMap: new Map(),
      etsAliasesMap: null,
    }
  },
  mounted() {
    this.etsAliasesMap = this.getEtsAliasesMap();
    this.loadData();
  },
  computed: {
    ...mapGetters('walletAction', ['walletConnected']),
    ...mapGetters('accountData', ['balance', 'account', 'uns']),
    ...mapGetters("network", ["appApiUrl", "networkId"]),
    ...mapGetters('marketData', ['etsStrategyData']),
    ...mapGetters('etsAction', ['etsList']),

  },
  watch: {
    account: function () {
      this.clearPrevData();
      this.loadData();
    },
    networkId: function () {
      this.clearPrevData();
      this.loadData();
    },
  },
  methods: {
      ...mapActions('menuUI', ['selectTab']),
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
    ...mapActions('walletAction', ['connectWallet']),

      openLink(url, isNotBlank) {
          window.open(url, isNotBlank ? '_self' : '_blank').focus();
      },

      goToActionByPath(path, queryParams) {
          this.$router.push({
              path: path,
              query: queryParams ? queryParams : {}
          });
      },

      etsClick() {
          this.selectTab('market');
          this.goToActionByPath('/market', {tabName: 'ets'});
      },

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

      console.log("productTransactionsMap strategies ", strategies);
      this.productTransactionsMap = await this.loadProductTransactionToMap(strategies);
      console.log("productTransactionsMap loaded ", this.productTransactionsMap);
      let strategyStatisticsMap = this.mergeTransactionsWithDifferentAliases(this.productTransactionsMap);
      console.log("Merged ets transactions: ", strategyStatisticsMap);


      this.strategyStatistics = [];
      for (let [key, value] of strategyStatisticsMap.entries()) {
        let ets = this.getEts(key);
        if (!ets) {
          console.log("Ets not found by name when handle strategyStatisticsMap", key);
          continue;
        }

        console.log("this.etsClientData key;", key);
        console.log("this.etsClientData value;", value);
        let statistic = this.getStatistic(ets, value);
        this.summaryData(statistic);
        console.log("this.etsClientData statistic;", statistic);

        this.strategyStatistics.push(statistic);

        // open first
        if (this.strategyStatistics.length === 1) {
          this.toggleStrategyStatistic(this.strategyStatistics[0]);
        }
      }

      console.log("strategyStatistics ", this.strategyStatistics)
      this.statisticsLoading = false;
    },
    mergeTransactionsWithDifferentAliases(productTransactionsMap) {
      let strategyStatisticsMap = new Map();

      for (let [key, value] of productTransactionsMap.entries()) { // key => alias, value => [txs]
        let etsName = this.getEtsByAlias(key);
        if (!etsName) {
          console.error("Ets not found when merge transactions. Alias:", key);
          continue;
        }

        let transactions = strategyStatisticsMap.get(etsName);
        if (!transactions) {
          console.log('first transactions init: ', etsName, value)
          strategyStatisticsMap.set(etsName, value);
          continue;
        }

        let mergedTransactions = [...transactions, ...value];
        mergedTransactions = mergedTransactions.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        });

        console.log('mergeTransactionsWithDifferentAliases: ', etsName, mergedTransactions, strategyStatisticsMap)
        strategyStatisticsMap.set(etsName, mergedTransactions);
      }

      return strategyStatisticsMap;
    },
    async loadProductTransactionToMap(strategies) {
      let productTransactionsMap = new Map();

      for (let i = 0; i < strategies.length; i++) {
        let strategy = strategies[i];
        if (!this.getEtsByAlias(strategy.product)) {
          console.log("Ets not found by alias when load product transactions", strategy.product);
          continue;
        }

        let transactions = await this.getProductTransactions(strategy.product); // strategy.product -> alias like "BetaOp DAI/WETH 5%,  10% --> 5%" not strategy name;
        console.log("loadProductTransactionToMap step#1: ", strategy.product, transactions, productTransactionsMap);
        productTransactionsMap.set(strategy.product, transactions); // map with key alias - [txs]
      }

      console.log("loadProductTransactionToMap step#2:", productTransactionsMap, strategies);
      return productTransactionsMap;
    },
    async getProductTransactions(product) {
      let productData = await this.loadProductStatistic(product);
      console.log("strategyStatistics productData", productData);
      return productData;
    },

    getStatistic(ets, productData) {
      let balancesWidgetData = this.getWidgetData(productData, 'closingBalance', '#8247E5');
      let profitWidgetData = this.getWidgetData(productData, 'dailyProfit', '#8247E5');
      // let apyWidgetData = this.getWidgetData(productData, 'apy', '#8247E5');
      let compWidgetData = this.getWidgetData(productData, 'comp', '#8247E5', 'PAYOUT');
      return {
        isOpen: false,
        name: ets.nameUp,
        etsName: ets.name,
        ets: ets,
        charts: {
          balance: balancesWidgetData,
          profit: profitWidgetData,
          // apy: apyWidgetData,
          comp: compWidgetData,
        },
        apy: 0,
        comp: 0,
        totalValue: 0,
        profit: 0,
        transactions: productData,
        compoundData: {},
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
                  comp: item.comp,
                  duration: item.elapsed_time,
                }
              });
      })
      .catch(e => {
        console.log("EtsTab loaded data statistic Error: ", e)
      })
    },
    getWidgetData(productData, propertyName, chartColor, onlyType) {
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

      console.log('productData ', productData, propertyName);
      this.calculateCompound(productData);
      if (onlyType) {
        [...productData].reverse().forEach(item => {
          if (item.type === onlyType) {
            widgetDataDict[moment(item.date).format('DD.MM.YYYY')] = item[propertyName];
          }
        });
      } else {
        [...productData].reverse().forEach(item => {
          widgetDataDict[moment(item.date).format('DD.MM.YYYY')] = item[propertyName];
        });

      }

      for (let key in widgetDataDict) {
        widgetData.labels.push(key);
        widgetData.datasets[0].data.push(widgetDataDict[key]);
      }

      return widgetData;
    },
    calculateCompound(productData, slice) {
      let clientData = productData.filter(value => value.type === 'PAYOUT');
      clientData = slice ? clientData.slice(0, slice) : clientData;

      let startValue = 1;
      let accumulator = startValue;
      let accumulatorDay = startValue;
      let accumulatorWeek = startValue;
      let accumulatorMonth = startValue;

      let compoundData = {};

      // let clientDataPreferment = [...clientData];
      let clientDataLengthCounter = clientData.length;
      for (let i = 0; i < clientData.length; i++){
        const payout = clientData[i];
        try {

          // all
          accumulator = accumulator * (1 + payout.dailyProfit);
          payout.comp =  (accumulator * 100 / startValue - 100);
          payout.comp =  parseFloat(payout.comp ? payout.comp : 0.00).toFixed(3);
          console.log("Comp accumulator", payout.comp);

          // date
          if (i === 0) {
            compoundData.firstDate = moment(payout.date).format('MMM D, YYYY');
          }


          // week
          if (clientDataLengthCounter <= 7) {
            accumulatorWeek = accumulatorWeek * (1 + payout.dailyProfit);
          }

          // month
          if (clientDataLengthCounter <= 30) {
            accumulatorMonth = accumulatorMonth * (1 + payout.dailyProfit);
          }

          // day
          if (clientDataLengthCounter === 1) {
            // day
            accumulatorDay = accumulatorDay * (1 + payout.dailyProfit);
            let dayComp = (accumulatorDay * 100 / startValue - 100);

            compoundData.day = parseFloat(dayComp ? dayComp : 0.0).toFixed(3)


            // week
            let weekComp = (accumulatorWeek * 100 / startValue - 100);
            compoundData.week = parseFloat(weekComp ? weekComp : 0.0).toFixed(3)

            // month
            let monthComp = (accumulatorMonth * 100 / startValue - 100);
            compoundData.month = parseFloat(monthComp ? monthComp : 0.0).toFixed(3)

            compoundData.all = payout.comp // last payout comp

            this.compoundData = compoundData;
          }

          clientDataLengthCounter--;
        } catch (e) {
          console.error("strategyData build Widget Data Dict insurance error:", e)
        }

        console.log('clientData: ', clientData);
      }
    },
    summaryData(strategyStatistic, slice) {
      let clientData = strategyStatistic.transactions.filter(value => value.type === 'PAYOUT');
      clientData = slice ? clientData.slice(0, slice) : clientData;

      let profitList = clientData.map(item => item.dailyProfit ? item.dailyProfit : 0).filter(item => item !== 0);
      if (profitList && (profitList.length > 0)) {
        const sum = profitList.reduce((a, b) => a + b, 0);
        strategyStatistic.profit = sum;
      }

      let lastData = clientData[0]
      if (lastData) {
        strategyStatistic.totalValue = lastData.closingBalance;
        strategyStatistic.comp = lastData.comp;
      }
    },
    clearPrevData() {
      this.chartTab = 'BALANCE';
      this.strategiesLoading = true;
      this.statisticsLoading = true;
      this.strategies = null;
      this.strategyStatistics = null;
      this.productTransactionsMap = new Map();
    },
    toggleStrategyStatistic(statistic) {
      statistic.isOpen = !statistic.isOpen;
    },
    getEts(etsName) {
      for (let i = 0; i < this.etsList.length; i++) {
        if (this.etsList[i].name === etsName) {
          return this.etsList[i];
        }
      }

      return null;
    },
    getEtsByAlias(alias) {
      for (let [key, value] of this.etsAliasesMap.entries()) {
        for (let i = 0; i < value.length; i++) {
          if (value[i] === alias) {
            return key;
          }
        }
      }

      return null;
    },
    getAliasesByEts(etsName) {
      return this.etsAliasesMap.get(etsName);
    },
    getEtsAliasesMap() {
      let etsAliasesMap = new Map();

      etsAliasesMap.set('ar_delta_weth_dai', [
        'Delta WETH/DAI',
      ]);

      etsAliasesMap.set('night_ov_ar', [
        'ARRAKIS WETH/USDC',
      ]);

      etsAliasesMap.set('qs_alpha_wbnb_busd', [
        'Alpha WBNB/BUSD',
      ]);

      etsAliasesMap.set('qs_alpha_wmatic_usdc', [
        "ALFA",
        "ALFA USDC/WMATIC, 5%, 15%",
        "Alfa WMATIC/USDC 5%/5%, 10%",
        "Alfa WMATIC/USDC 5%/5%, 15%"
      ]);

      etsAliasesMap.set('qs_beta_wmatic_usdc', [
        "BETA",
        "BETA, USDC/WMATIC, 100%, 1.5%",
        "Beta WMATIC/USDC 50%/100%, 1%",
        "Beta WMATIC/USDC 50%/100%, 2%",
      ]);

      etsAliasesMap.set('qs_delta_weth_usdc', [
        "DELTA",
        "DELTA, USDC/WETH, 100%, 1.5%",
        "Delta USDC/WETH 50%/100%, 2%",
        "Delta USDC/WETH 90%/800%, 1%",
      ]);

      etsAliasesMap.set('qs_epsilon_weth_dai', [
        "EPSILON",
        "EPSILON+",
        "EPSILON+, DAI/WETH, 5%, 10%",
        "EPSILON, DAI/WETH, 5%, 10%"
      ]);

      etsAliasesMap.set('qs_gamma_weth_usdc', [
        "GAMMA",
        "GAMMA, USDC/WETH, 5%, 10%",
        "Gamma USDC/WETH 5%/5%, 10%"
      ]);

      etsAliasesMap.set('qs_zeta_wbtc_usdc', [
        'ZETA',
        'ZETA+',
        'ZETA+, USDC/WBTC, 5%, 10%',
        'ZETA, USDC/WBTC, 5%, 10%',
      ]);

      etsAliasesMap.set('ruby', [
        "RUBY",
      ]);

      etsAliasesMap.set('uni_alpha_weth_usdc', [
        "WETH/USDC",
      ]);

      etsAliasesMap.set('uni_beta_weth_dai', [
        "BETA, OP",
        "BETA+ OP, DAI/WETH, 5%, 10%",
        "BETA, OP, DAI/WETH, 5%, 10%",
        "BetaOp DAI/WETH 5%,  10% --> 5%",
        "BetaPlusOp DAI/WETH 5%,  10% --> 5%"
      ]);

      etsAliasesMap.set('uni_eta_wmatic_usdc', [
        "ETA",
        "ETA, USDC/WMATIC, 5%, 15%",
        "ETA, USDC/WMATIC, 5%, 10%",
      ]);

      etsAliasesMap.set('uni_gamma_weth_dai', [
        "Gamma WETH/DAI"
      ]);

      etsAliasesMap.set('wbnb_busd', [
        "BUSD/WBNB"
      ]);

      etsAliasesMap.set('wmatic_usd_plus', [
        "WMATIC/USD+",
        "USD+/WMATIC"
      ]);


      etsAliasesMap.set('gamma_sl_weth_usdc', [
        "GAMMA USDC/WETH, 10% --> 5%",
      ]);

      etsAliasesMap.set('alpha_zyb_weth_usdc', [
        "ALPHA USDC/WETH, 10% --> 5%",
      ]);

      etsAliasesMap.set('beta_zyb_wbtc_usdc', [
        "BETA USDC/WBTC, 10% --> 5%",
      ]);

      return etsAliasesMap;
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

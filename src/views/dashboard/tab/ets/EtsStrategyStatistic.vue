<template>
  <div>
    <v-row align="center" justify="start" class="ma-0 info-card-container"
           :class="$wu.isFull() ? 'mb-6' : 'mb-3'">
      <v-col class="info-card-body-bottom">
        <template v-if="charts && charts.balance">

          <v-row class="ma-0 info-card-container" justify="start" align="center">
            <v-col>
              <v-row align="center" justify="start" class="ma-0">
                <v-col class="ml-n3 mt-n3">
                  <v-btn outlined class="rate-tab-btn" @click="setTab('BALANCE')" v-bind:class="activeChartBalance">
                    balance
                  </v-btn>
                </v-col>
                <v-col class="mr-n3 mt-n3">
                  <v-btn outlined class="rate-tab-btn" @click="setTab('PROFIT')" v-bind:class="activeChartProfit">
                    Profit & Loss
                  </v-btn>
                </v-col>
                <v-col class="mr-n3 mt-n3">
                  <v-btn outlined class="rate-tab-btn" @click="setTab('PERFORMANCE')" v-bind:class="activeChartApy">
                    Cumulative Return
                  </v-btn>
                </v-col>
              </v-row>

              <LineChart v-if="chartTab === 'BALANCE'"
                         :data="charts.balance"
                         :name="name"
                         :type="'Balance'"
                         :id="index"/>

              <BarChart v-if="chartTab === 'PROFIT'"
                        :data="charts.profit"
                        :name="name"
                        :type="'Profit & loss'"
                        :id="index"/>


              <LineChart v-if="chartTab === 'PERFORMANCE'"
                         :data="charts.comp"
                         :name="name"
                         :type="'Cumulative return'"
                         :id="index"/>
            </v-col>
          </v-row>

        </template>
      </v-col>
    </v-row>

    <v-row align="center" justify="start" class="ma-0 info-card-container"
           :class="$wu.isFull() ? 'my-6' : 'my-3'">
      <v-col class="info-card-body-bottom">
        <v-row align="center" justify="start" class="ma-0">
          <label class="container-body-title" :class="$wu.isFull() ? '' : 'mb-1'">
            {{name}} transactions
          </label>
        </v-row>

        <v-row align="center" justify="start" class="ma-0 mt-2">
          <Table
              v-if="$wu.isFull()"
              :data="transactions"/>

          <Table
              v-else
              minimized
              :data="transactions"/>

          <v-row justify="center" align="center" class="ma-0 scroll-container">
            <label class="table-scroll-label">scroll to see more</label>
          </v-row>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LineChart from "@/components/widget/LineChart.vue";
import BarChart from "@/components/widget/BarChart.vue";
import Table from "@/components/dashboard/Table";

export default {
  name: "EtsStrategyStatistic",
  components: {
    LineChart,
    BarChart,
    Table
  },
  props: ['name', 'charts', 'transactions', 'index'],
  data() {
    return {
      chartTab: 'BALANCE'
    }
  },
  computed: {
    activeChartBalance: function () {
      return this.chartTab === 'BALANCE' ? 'rate-tab-button' : 'rate-tab-button-in-active'
    },
    activeChartProfit: function () {
      return this.chartTab === 'PROFIT' ? 'rate-tab-button' : 'rate-tab-button-in-active'
    },
    activeChartApy: function () {
      return this.chartTab === 'PERFORMANCE' ? 'rate-tab-button' : 'rate-tab-button-in-active'
    },
  },
  methods: {
    setTab(tabType) {
      this.chartTab = tabType;
    },
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
</style>

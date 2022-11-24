<template>
    <v-row class="card-container" v-on:click.prevent @click="openStrategyCard">
        <v-col cols="12">
            <v-row class="d-flex flex-row align-center header-row" justify="center">
                <span class="currency ml-5">
                    <v-img :src="require('@/assets/currencies/usdPlus.svg')"/>
                </span>
                <v-row class="d-flex flex-column align-start mr-3 ml-8">
                    <v-row class="d-flex">
                      <label class="card-title">USD+ ON OPTIMISM</label>
                    </v-row>

                    <v-row class="d-flex mt-5">
                        <label class="percentage">20%</label>
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
                  <label class="full-status-error-label">
                    ETS capacity is full. Check status later
                  </label>
<!--                  <label class="full-status-error-label" v-else>&nbsp;</label>-->
                </v-row>
                <template >
                    <v-row class="ma-0 mt-2" align="center">
                        <label class="progress-label-header">Current tvl</label>
                        <v-spacer></v-spacer>
                        <label class="progress-label-header">Max tvl</label>
                    </v-row>
                    <v-row class="ma-0" align="center">
                        <v-progress-circular
                            class="mt-2"
                            width="1.5"
                            size="16"
                            color="#9DA4B0"
                            indeterminate
                        ></v-progress-circular>

                        <v-spacer></v-spacer>

                        <label class="progress-label-value mt-2">
                            $296.000
                        </label>
                    </v-row>
                    <v-row class="ma-0 mt-2" align="center">
                        <v-progress-linear
                            rounded
                            height="7"
                            class="progress-info"
                            background-opacity="0"
                            :value="100"
                            color="#9DA4B0"
                        ></v-progress-linear>
                    </v-row>
                </template>
            </v-container>
        </v-col>

        <v-col cols="12" align-self="end">
            <v-container>
                <v-row class="ma-0 mt-n6">
                    <label class="card-info">Park your stables in USD+, and watch your balance grow in your wallet overnight. No
                        staking required</label>
                </v-row>

                <v-row class="d-flex mt-10 box box-one justify-lg-center">
                    <label class="box-name">Chain</label>
                    <div class="icon">
                        <v-img :src="require('@/assets/network/optimism.svg')"
                               alt="chain icon" />
                    </div>
                    <label class="chain-name">Optimism</label>
                </v-row>

                <v-row class="d-flex justify-space-between ma-0 mt-6">
                    <label class="your-deposit">Current balance</label>
                    <label
                        class="your-deposit">{{ this.balance.usdPlus ? ($utils.formatMoneyComma(this.balance.usdPlus, 2) + " USD+") : "—"
                        }}</label>
                </v-row>

                <v-row class="d-flex justify-space-between ma-0 mt-2">
                    <template>
                        <v-col class="ml-1">
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
        </v-col>

        <v-col>
            <v-row class="footer-row d-flex align-center justify-center">
                  <label class="footer-link">View performance</label>
                  <img class="open-icon ml-1" src="@/assets/icon/open-in-new.svg">
              </v-row>
        </v-col>

        <resize-observer @notify="$forceUpdate()" />
    </v-row>
</template>

<script>
import Tooltip from "@/components/common/element/Tooltip";
import { mapActions, mapGetters, mapMutations } from "vuex";
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
    ...mapGetters("statsData", ["currentTotalData"]),
    ...mapGetters("accountData", ["balance"]),
    ...mapGetters("wrapUI", ["showWrap"]),
    ...mapGetters("network", ["appApiUrl", "networkId"]),

    icon: function() {
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
    totalTvl: null,

    openedSliceList: false
  }),

  watch: {
    currentTotalData: function(newVal, oldVal) {
      this.totalTvl = this.getTotalTvl();
    },

    appApiUrl: function(newVal, oldVal) {
      this.getAvgWeekApy();
    }
  },

  created() {
    this.getAvgWeekApy();
  },

  mounted() {
    this.totalTvl = this.getTotalTvl();
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

    openStrategyCard() {
      this.mintAction();
    }
  }
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .card-title {
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.04em;
    }

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

    .your-deposit, .your-deposit-disabled {
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      line-height: 22px;
    }

    .full-status-error-label {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
    }

    .progress-label-header {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.03em;
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
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .card-title {
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 0.04em;
    }

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

    .your-deposit, .your-deposit-disabled {
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      line-height: 22px;
    }

    .full-status-error-label {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
    }

    .progress-label-header {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.03em;
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
}

/* full */
@media only screen and (min-width: 1400px) {
    .card-title {
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 18px;
      letter-spacing: 0.04em;
    }

    card-info {
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

    .your-deposit, .your-deposit-disabled {
      font-style: normal;
      font-weight: 800;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.05em;
    }

    .full-status-error-label {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
    }

    .progress-label-header {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.03em;
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
}

.card-container {
  background: var(--secondary) !important;
  border-radius: 15px !important;
  height: 100% !important;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

.card-title {
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase;
  font-feature-settings: 'pnum' on, 'lnum' on;
  color: #FFFFFF;
}

.card-info {
  font-family: 'Roboto', sans-serif;
  font-feature-settings: 'pnum' on, 'lnum' on;
  color: var(--main-gray-text);
}

* {
  cursor: pointer;
}

.card-container:hover {
  filter: none !important;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05), 0 4px 4px 0 rgba(0, 0, 0, 0.05);
}

.header-row {
  background: radial-gradient(circle at 100% 0%, #001845 0%, #001845 27%, #0C255B 52%, #062E80 100%);
  border-radius: 15px 15px 0 0;
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

.tooltip {
  width: 13px;
  height: 13px;
  margin-top: 2px;
}

.card-info {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
}

.box {
  background-color: #F5F5F5;
  padding: 8px;
  min-width: 100%;
  border-radius: 4px;
  gap: 10px;
  text-align: center;
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

.box-one {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
}

.icon {
  height: 36px !important;
  width: auto !important;
}

.open-icon {
  color: #707A8B;
  height: 18px;
  width: 18px;
}

.chain-name {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  color: #29323E;
}

.your-deposit, .your-deposit-disabled {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-feature-settings: 'liga' off;
}

.your-deposit {
  color: var(--main-gray-text);
}

.your-deposit-disabled {
  color: var(--third-gray-text);
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
  background-color: #F5F5F5;
  padding: 5px;
  border-radius: 0 0 15px 15px;
}

.footer-link {
  font-family: 'Roboto', sans-serif;
  font-feature-settings: 'liga' off;
  color: #707A8B;
}

.progress-info {
  background: var(--progress-info);
}

</style>

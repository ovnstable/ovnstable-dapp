<template>
  <v-row class="card-container" @click.self="openInsurance">
    <v-col cols="12" align-self="start">
      <v-row
        class="d-flex flex-row align-center header-row"
        justify="center"
        :style="{ '--card-background': getBgColor() }"
      >
        <span class="currency ml-5">
          <v-img
            :src="
              require('@/assets/currencies/insurance/insurance_' +
                getParams(chainId).networkName +
                '.svg')
            "
          />
        </span>
        <v-row class="d-flex flex-column align-start mr-3 ml-8">
          <v-row class="d-flex" align="center">
            <label class="card-title"> Insurance </label>
          </v-row>
          <v-row class="d-flex" align="center">
            <label class="card-title"> ON {{ chainName }} </label>
          </v-row>
          <v-row class="d-flex mt-4">
            <label class="percentage">
              {{
                apyData ? $utils.formatMoneyComma(last30DayApy, 0) + "%" : "—"
              }}
            </label>
            <label class="apy ml-3"> 30-DAY APY </label>
          </v-row>
        </v-row>
      </v-row>

      <v-container class="mt-6">
        <!--                <v-row class="ma-0 mb-8 box">
                    <v-col cols="12">

                      <v-row class="ma-0 d-flex justify-space-between info-container">
                              <label class="card-info-value mt-2 value-info">
                                {{ apyData ? $utils.formatMoneyComma(last30DayApy, 0) + '%' : '—' }}
                              </label>
                              <div class="tooltip-info">
                                <Tooltip :size="$wu.isFull() ? 18 : ($wu.isTablet() ? 16 : 14)"
                                         :maxWidth="300"
                                         text="Retained portion of the our rebase tokens yield on one chain"/>
                              </div>
                        </v-row>
                    </v-col>
                      add class to the next v-row insurance-card-info-row
                </v-row>-->

        <v-row class="ma-0 d-flex justify-space-between">
          <label class="card-info-label mt-2 mb-2">Insurance vault</label>
          <label class="card-info-value mt-2">
            {{
              apyData && apyData.supply
                ? $utils.formatMoneyComma(apyData.supply, 0)
                : "—"
            }}
            OVN
          </label>
        </v-row>

        <v-row
          class="ma-0 insurance-card-info-row d-flex justify-space-between"
        >
          <label class="card-info-label mt-2"> Value of vault </label>
          <label class="card-info-value mt-2">
            ${{
              apyData && apyData.supply
                ? $utils.formatMoneyComma(apyData.supply * this.ovnPrice, 0)
                : "—"
            }}
          </label>
        </v-row>

        <v-row
          class="ma-0 mt-3 insurance-card-info-row d-flex justify-space-between info-container"
        >
          <label class="card-info-label mt-2">Insurance coverage</label>
          <label class="card-info-value mt-2 mr-4">
            {{
              apyData && apyData.coverage
                ? $utils.formatMoneyComma(apyData.coverage, 2) + "%"
                : "—"
            }}
          </label>
          <div class="tooltip-info">
            <Tooltip
              :size="$wu.isFull() ? 18 : $wu.isTablet() ? 16 : 14"
              :maxWidth="300"
              text="% of insured funds on chain with Insurance"
            />
          </div>
        </v-row>

        <v-row
          class="ma-0 mt-3 insurance-card-info-row d-flex justify-space-between"
        >
          <label class="card-info-label mt-2">Risk factor</label>
          <label class="card-info-value mt-2">HIGH</label>
        </v-row>
      </v-container>
    </v-col>

    <v-col align-self="end">
      <v-container :class="$wu.isFull() ? 'mb-6' : 'mb-6'">
        <v-row class="d-flex ma-0" align="center">
          <label class="your-deposit"> Your deposit </label>
          <v-spacer></v-spacer>
          <label class="your-deposit" :class="dataHidden ? 'hidden-label' : ''">
            {{
              dataHidden
                ? ""
                : this.insuranceBalance[chainName] &&
                  this.insuranceBalance[chainName] > 0
                ? "$" +
                  $utils.formatMoneyComma(
                    this.insuranceBalance[chainName] * this.ovnPrice,
                    2
                  )
                : "—"
            }}
          </label>
          <div class="ml-1 mt-1">
            <img
              :src="
                light
                  ? insuranceRedemptionData.request === 'CAN_WITHDRAW'
                    ? require('@/assets/icon/lock_open_variant.svg')
                    : require('@/assets/icon/lock_black.svg')
                  : insuranceRedemptionData.request === 'CAN_WITHDRAW'
                  ? require('@/assets/icon/lock_open_variant_white.svg')
                  : require('@/assets/icon/lock_white.svg')
              "
              alt="Lock Icon"
              class="lock-icon"
            />
          </div>
        </v-row>

        <v-row class="d-flex justify-space-between ma-0 mt-2">
          <template v-if="networkId === chainId">
            <v-col class="mr-1">
              <v-row>
                <v-btn class="button btn-filled" @click.stop="mintAction">
                  MINT
                </v-btn>
              </v-row>
            </v-col>
            <v-col class="ml-1">
              <v-row>
                <v-btn
                  class="button btn-outlined"
                  @click.stop="redeemAction"
                  outlined
                >
                  REDEEM
                </v-btn>
              </v-row>
            </v-col>
          </template>

          <template v-else>
            <v-col>
              <v-row>
                <v-btn
                  class="button btn-outlined"
                  @click.prevent="setWalletNetwork(chainId.toString())"
                  outlined
                >
                  SWITCH TO {{ chainName }} TO MINT
                </v-btn>
              </v-row>
            </v-col>
          </template>
        </v-row>

        <v-row class="ma-0 pt-4" justify="center" align="center">
          <v-btn
            x-large
            width="90%"
            class="button btn-outlined"
            height="40px"
            outlined
            @click.stop="goToBridge()"
          >
            BRIDGE OVN
          </v-btn>
        </v-row>
      </v-container>

      <!--            <v-row class="footer-row d-flex align-center justify-center" @click.stop="openInsurance">
                <label class="footer-link">View OVN Insurance performance</label>
                <img class="open-icon ml-1" src="@/assets/icon/open-in-new.svg">
            </v-row>-->
    </v-col>

    <resize-observer @notify="$forceUpdate()" />
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { insuranceApiService } from "@/services/insurance-api-service";
import Tooltip from "@/components/common/element/Tooltip.vue";
import { ovnApiService } from "@/services/ovn-api-service";
import { difference } from "@/utils/dates.js";

export default {
  name: "InsuranceCard",

  components: {
    Tooltip
  },

  props: {
    chainName: {
      type: String,
      default: ""
    },
    chainId: {
      type: Number,
      default: 10
    }
  },

  data() {
    return {
      apyData: null,
      isLoaded: false,
      ovnPrice: 0,
      payoutsData: [],
      avgApy: null
    };
  },

  computed: {
    ...mapGetters("accountData", ["insuranceBalance"]),
    ...mapGetters("insuranceData", ["insuranceRedemptionData"]),
    ...mapGetters("network", [
      "appApiUrl",
      "networkId",
      "networkName",
      "getParams"
    ]),
    ...mapGetters("magicEye", ["dataHidden"]),
    ...mapGetters("theme", ["light"]),

    payouts: function() {
      let data = this.payoutsData;
      return data
        ? [...data].sort((o1, o2) => difference(o1.date, o2.date))
        : null;
    },

    last30DayApy: function() {
      return this.apyData.apyMonth;
    }
  },

  watch: {
    chainName() {
      this.loadApyDataInfo();
      this.loadPayouts();
      this.loadOvnPrice();
    }
  },

  mounted() {
    this.loadApyDataInfo();
    this.loadPayouts();
    this.loadOvnPrice();
  },

  methods: {
    ...mapActions("insuranceInvestModal", [
      "showInvestModal",
      "showMintView",
      "showRedeemView"
    ]),
    ...mapActions("network", ["setWalletNetwork"]),

    loadOvnPrice() {
      let url = "https://api.overnight.fi/root/dapp";
      ovnApiService
        .getOvnPrice(url)
        .then((value) => {
          console.log("ovn price: ", value);
          this.ovnPrice = value;
        })
        .catch((reason) => {
          console.log("Error get ovn price: " + reason);
        });
    },

    goToBridge() {
      this.$router.push("/bridge");
    },

    loadApyDataInfo() {
      this.isLoaded = false;

      let url = `https://api.overnight.fi/${this.chainName}/usd+`;
      insuranceApiService
        .getApyInfo(url)
        .then((data) => {
          this.apyData = data;
          this.isLoaded = true;
        })
        .catch((e) => {
          console.error("Error load avg apy info for insurance card", e);
          this.isLoaded = true;
        });
    },
    loadPayouts() {
      let url = `https://api.overnight.fi/${this.chainName}/usd+`;
      insuranceApiService
        .getPayouts(url)
        .then((data) => {
          this.payoutsData = data.sort((o1, o2) =>
            difference(o1.date, o2.date)
          );
        })
        .catch((e) => {
          console.error("Error load payouts info for insurance card", e);
        });
    },

    mintAction() {
      this.showMintView();
      this.showInvestModal();
    },

    redeemAction() {
      this.showRedeemView();
      this.showInvestModal();
    },

    openInsurance() {
      this.goToAction(`/insurance/network/${this.chainName}`);
    },

    goToAction(id) {
      this.$router.push(id);
    },

    getBgColor() {
      // return 'radial-gradient(117.22% 424.06% at 96.59% -5.17%, #F4F4F4 0%, #787E82 23.74%, #232324 52%, ' + this.getParams(this.networkId).networkColor + ' 100%)';
      return this.chainId === 10
        ? "radial-gradient(117.22% 424.06% at 96.59% -5.17%, #F4F4F4 0%, #787E82 23.74%, #232324 52%, " +
            "#FF0420" +
            " 100%)"
        : "radial-gradient(117.22% 424.06% at 96.59% -5.17%, #F4F4F4 0%, #787E82 23.74%, #232324 52%, " +
            "#28a0ef" +
            " 100%)";
    }
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
    font-size: 25px;
    line-height: 40px;
  }

  .apy {
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
  }

  .tooltip {
    margin-top: -4px;
  }

  .apy-box-total-label {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
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
    max-width: 440px;
    max-height: 600px;
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
    font-size: 35px;
    line-height: 56px;
  }

  .apy {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
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

  .hidden-label {
    width: 130px;
    height: 28px;
    background: var(--hide-account);
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

  .hidden-label {
    width: 130px;
    height: 28px;
    background: var(--hide-account);
  }
}

@media only screen and (min-width: 1300px) {
  .card-title {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 18px;
    letter-spacing: 0.03em;
  }

  .percentage {
    font-style: normal;
    font-weight: 600;
    font-size: 23px;
    line-height: 42px;
  }

  .apy {
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
  }

  .button {
    height: 36px !important;

    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 15px !important;
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
    font-size: 15px;
    line-height: 24px;
    letter-spacing: 0.05em;
  }

  .footer-link {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }

  .header-row {
    max-width: 460px;
    height: 130px !important;
  }

  .card-container {
    max-width: 460px;
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
  text-transform: uppercase;
  font-feature-settings: "pnum" on, "lnum" on;
  color: #ffffff;
}

.percentage {
  font-feature-settings: "pnum" on, "lnum" on;
  color: #ffffff;
}

.apy {
  font-feature-settings: "pnum" on, "lnum" on;
  color: #ffffff;
}

.box {
  background-color: var(--scroll-color);
  border-radius: 4px;
  text-align: center;
  width: 100%;
}

.your-deposit {
  font-style: normal;
  font-feature-settings: "liga" off;
}

.your-deposit {
  color: var(--main-gray-text);
}

.button {
  border-radius: 2px;
  box-shadow: none !important;
  width: 100% !important;

  text-align: center !important;
  text-transform: uppercase !important;
  font-feature-settings: "pnum" on, "lnum" on !important;
}

.btn-filled {
  background: var(--blue-gradient);
  color: #ffffff !important;
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
  font-feature-settings: "liga" off;
  color: #707a8b;
}

.open-icon {
  color: #707a8b;
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
  text-transform: uppercase;
  font-feature-settings: "pnum" on, "lnum" on;
  color: var(--main-gray-text);
}

.apy-box-subtitle-label {
  text-transform: uppercase;
  font-feature-settings: "pnum" on, "lnum" on;
  color: var(--main-gray-text);
}

.insurance-card-info-row {
  border-top: 1px solid var(--main-border) !important;
}

.card-info-label,
.card-info-value {
  color: var(--main-gray-text);
}

.card-about-label {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.tooltip-info {
  position: absolute;
  right: -4px;
  top: 10px;
}

.value-info {
  padding-right: 15px;
}

.info-container {
  position: relative;
}

.lock-icon {
  width: 24px;
  height: 24px;
}

.image-lock {
  margin-top: 5px;
}
</style>

<template>
  <div class="page-container">
    <div v-if="!isCollateralLoading">
      <v-row
        v-if="networkId === 56 || networkId === 59144 || networkId === 42161"
      >
        <template v-if="$wu.isMobile()">
          <v-col cols="12" align="center" class="mt-5">
            <v-btn class="header-btn btn-filled mr-5" @click="swapButtonIn">
              Swap In
            </v-btn>
            <v-btn class="header-btn btn-outlined" @click="swapButtonOut">
              Swap Out
            </v-btn>
          </v-col>
        </template>
        <v-col cols="6">
          <v-row class="ma-0 mt-10 toggle-row">
            <label
              class="tab-btn mr-4"
              @click="setTab('bsc')"
              v-bind:class="activeTabBsc"
              >Bsc</label
            >
            <label
              class="tab-btn mx-4"
              @click="setTab('linea')"
              v-bind:class="activeTabLinea"
              >Linea</label
            >
            <label
              class="tab-btn mx-4"
              @click="setTab('arbitrum')"
              v-bind:class="activeTabArbitrum"
              >Arbitrum</label
            >
          </v-row>
        </v-col>
        <template v-if="!$wu.isMobile()">
          <v-col align="end" cols="6" class="mt-6">
            <v-btn class="header-btn btn-filled mr-5" @click="swapButtonIn">
              Swap In
            </v-btn>
            <v-btn class="header-btn btn-outlined mr-3" @click="swapButtonOut">
              Swap Out
            </v-btn>
          </v-col>
        </template>
      </v-row>
    </div>

    <v-row v-if="isCollateralLoading">
      <v-row align="center" justify="center" class="py-15">
        <v-progress-circular
          width="2"
          size="24"
          color="#8FA2B7"
          indeterminate
        ></v-progress-circular>
      </v-row>
    </v-row>
    <v-row
      v-else
      class="ma-0 info-card-container mt-3"
      justify="start"
      align="start"
    >
      <v-col class="info-card-body-bottom">
        <v-row align="start" justify="start" class="ma-0">
          <label class="section-title-label"> USDT+ collateral assets </label>
        </v-row>

        <v-row align="start" justify="center">
          <v-col :cols="!$wu.isFull() ? 12 : 8">
            <TableStablecoins
              v-if="!$wu.isMobile()"
              :data="collateralData"
              :network-name="tab"
            />

            <TableStablecoins
              v-else
              minimized
              :data="collateralData"
              :network-name="tab"
            />
          </v-col>

          <v-col :cols="!$wu.isFull() ? 12 : 4">
            <PieStablecoins
              :data="collateralData"
              :size="!$wu.isFull() ? 200 : 300"
              :network-name="tab"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row v-if="isCurrentTotalDataLoading">
      <v-row align="center" justify="center" class="py-15">
        <v-progress-circular
          width="2"
          size="24"
          color="#8FA2B7"
          indeterminate
        ></v-progress-circular>
      </v-row>
    </v-row>
    <v-row
      v-else
      class="ma-0 info-card-container mt-3"
      justify="start"
      align="start"
    >
      <v-col class="info-card-body-bottom">
        <v-row align="center" justify="start" class="ma-0">
          <label class="section-title-label"> USDT+ portfolio </label>
        </v-row>
        <v-row class="ma-0 mt-5 align-center">
          <div>
            <v-img :src="require('@/assets/icon/alert-circle-outline.svg')" />
          </div>
          <label class="risk-text ml-1">
            By using our products, you assume the risk of the protocols
            integrated into our collateral. See more about risks in
            <a
              class="link-to-docs"
              href="https://docs.overnight.fi/advanced/terms-of-service"
              >our docs.</a
            >
          </label>
        </v-row>

        <v-row align="center" justify="center">
          <v-col :cols="!$wu.isFull() ? 12 : 8">
            <TableStrategies
              v-if="!$wu.isMobile()"
              :data="currentTotalData"
              asset-type="USDT"
              total-title="Total USDT+ in circulation"
              :total-supply="totalValue"
              :network-name="tab"
            />

            <TableStrategies
              v-else
              minimized
              :data="currentTotalData"
              asset-type="USDT"
              total-title="Total USDT+ in circulation"
              :total-supply="totalValue"
              :network-name="tab"
            />
          </v-col>

          <v-col :cols="!$wu.isFull() ? 12 : 4">
            <DoughnutStrategies
              :data="currentTotalData"
              :total-value="totalValue"
              :size="!$wu.isFull() ? 200 : 300"
              :network-name="tab"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <div
      v-if="!isCurrentTotalDataLoading"
      class="ma-0 info-card-container d-flex mt-3"
    >
      <div
        class=""
        :class="$wu.isMobile() ? 'ml-5 mr-5 mt-5' : 'ml-10 mr-5 my-5'"
      >
        <v-img
          class="currency"
          :src="require('@/assets/currencies/USDT+.svg')"
        />
      </div>
      <div
        class="info-card-container-box"
        :class="$wu.isMobile() ? 'mt-5 mb-5 mr-5' : 'mt-0'"
      >
        <label class="section-title-label label-about">About USDT+</label>
        <label class="section-text"
          >USDT+ is the equivalent of USD+, pegged to USDT 1:1. USDT+ consist of
          aUSDT (Aave) and USD+. It has been designed for boosted pools
          (Balancer and Beethoven) on Bsc. It cannot be minted
          separately.</label
        >
      </div>
    </div>

    <v-row v-if="!isCurrentTotalDataLoading" class="ma-0 mt-3">
      <v-col class="currency-box" :cols="$wu.isFull() ? 6 : 12">
        <v-row
          align="center"
          :class="$wu.isMobile() ? 'ma-2' : 'ma-5'"
          @click="openLink(explorerLink)"
        >
          <div>
            <v-img
              class="currency-usdt"
              :src="require('@/assets/currencies/USDT+.svg')"
            />
          </div>
          <label class="currency-text ml-2">USDT+ token address</label>

          <v-spacer></v-spacer>

          <label class="address-text ml-auto">{{
            shortAddress(contractAddress)
          }}</label>
          <div class="ml-auto d-flex">
            <v-img
              class="open-new mt-0 ml-1"
              :src="require('@/assets/icon/open-in-new.svg')"
            />
          </div>
        </v-row>
      </v-col>
    </v-row>

    <resize-observer @notify="$forceUpdate()" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TableStablecoins from "@/components/stats/pie/TableStablecoins.vue";
import PieStablecoins from "@/components/stats/pie/PieStablecoins.vue";
import TableStrategies from "@/components/stats/doughnut/TableStrategies.vue";
import DoughnutStrategies from "@/components/stats/doughnut/DoughnutStrategies.vue";
import { collateralApiService } from "@/services/collateral-api-service";
import { strategiesApiService } from "@/services/strategies-api-service";
import {
  USDT_PLUS_CONTRACT_ADDRESS_BSC,
  USDT_PLUS_CONTRACT_ADDRESS_LINEA,
  USDT_PLUS_CONTRACT_ADDRESS_ARBITRUM
} from "@/utils/const.js";

export default {
  name: "CollateralView",

  components: {
    DoughnutStrategies,
    TableStrategies,
    PieStablecoins,
    TableStablecoins
  },

  data: () => ({
    tab: "arbitrum",
    isCurrentTotalDataLoading: true,
    isCollateralLoading: true,

    collateralData: null,
    currentTotalData: null,
    totalValue: 0
  }),

  computed: {
    ...mapGetters("network", [
      "networkId",
      "networkName",
      "apiUrl",
      "getParams"
    ]),
    ...mapGetters("etsAction", ["etsList"]),

    tabNetworkName: function() {
      let params;
      params = this.getParams(this.tab);

      return params.networkName;
    },

    activeTabBsc: function() {
      return {
        "tab-button": this.tab === "bsc",
        "tab-button-in-active": this.tab !== "bsc"
      };
    },

    activeTabLinea: function() {
      return {
        "tab-button": this.tab === "linea",
        "tab-button-in-active": this.tab !== "linea"
      };
    },

    activeTabArbitrum: function() {
      return {
        "tab-button": this.tab === "arbitrum",
        "tab-button-in-active": this.tab !== "arbitrum"
      };
    },

    explorerLink: function() {
      if (this.tabNetworkName === "bsc") {
        return `https://bscscan.com/token/${USDT_PLUS_CONTRACT_ADDRESS_BSC}`;
      }

      if (this.tabNetworkName === "linea") {
        return `https://lineascan.build/token/${USDT_PLUS_CONTRACT_ADDRESS_LINEA}`;
      }

      if (this.tabNetworkName === "arbitrum") {
        return `https://arbiscan.io/token/${USDT_PLUS_CONTRACT_ADDRESS_ARBITRUM}`;
      }

      console.error("Not found networkId type when return usdt explorer link");
      return null;
    },

    contractAddress: function() {
      if (this.tabNetworkName === "bsc") {
        return USDT_PLUS_CONTRACT_ADDRESS_BSC;
      }

      if (this.tabNetworkName === "linea") {
        return USDT_PLUS_CONTRACT_ADDRESS_LINEA;
      }

      if (this.tabNetworkName === "arbitrum") {
        return USDT_PLUS_CONTRACT_ADDRESS_ARBITRUM;
      }

      console.error(
        "Not found networkId type when return usdt contract address"
      );
      return null;
    }
  },

  watch: {
    networkName: function(newVal, oldVal) {
      this.setTab(newVal);
      this.loadData(newVal);
    }
  },

  created() {},

  mounted() {
    if (!this.$route.query.tabName) {
      this.setTab(this.networkName);
    }
    if (this.$route.query.tabName) {
      this.setTab(this.$route.query.tabName);
    }
  },

  methods: {
    swapButtonIn() {
      this.initTabName("/swap", { action: "swap-in", symbol: "USDT+" });
    },

    swapButtonOut() {
      this.initTabName("/swap", { action: "swap-out", symbol: "USDT+" });
    },

    setTab(tabName) {
      this.tab = tabName;
      this.initTabName("/collateral/usdt", { tabName: tabName });
      this.loadCurrentTotalData();
      this.loadCollateralData();
    },

    initTabName(path, queryParams) {
      const currentRoute = this.$route.fullPath;

      const newRoute = {
        path: path,
        query: queryParams ? queryParams : {}
      };

      const newRouteFullPath = this.$router.resolve(newRoute).href;
      if (currentRoute !== newRouteFullPath) {
        this.$router.push(newRoute);
      }
    },

    openLink(url) {
      window.open(url, "_blank").focus();
    },

    shortAddress(address) {
      if (address) {
        return (
          address.substring(0, 5) +
          "..." +
          address.substring(address.length - 4)
        );
      } else {
        return null;
      }
    },

    loadCurrentTotalData() {
      this.isCurrentTotalDataLoading = true;

      strategiesApiService
        .getStrategies(this.apiUrl + `/${this.tabNetworkName}/usdt+`)
        .then((data) => {
          let strategies = data;
          strategies.sort((a, b) => b.netAssetValue - a.netAssetValue);

          let colors = [
            "#FCCA46",
            "#FE7F2D",
            "#3D8DFF",
            "#22ABAC",
            "#B22174",
            "#2775CA",
            "#26A17B",
            "#23DD00",
            "#6E56C4",
            "#002868",
            "#C8DE42",
            "#3FEFDA",
            "#DE42CE"
          ];

          this.currentTotalData = [];
          this.totalValue = 0;

          for (let i = 0; i < strategies.length; i++) {
            let element = strategies[i];
            let currentTotalDataElement = {
              type: element.type,
              label: "",
              fullName: element.fullName,
              value: element.netAssetValue,
              liquidationValue: element.liquidationValue,
              color: colors[i],
              link: null
            };

            console.log(element, "ELEMENT----");

            if (["SMM", "CORE", "SPER"].includes(element.type)) {
              currentTotalDataElement.label = element.name;
              currentTotalDataElement.link =
                element.address || element.explorerAddress
                  ? process.env.VUE_APP_DEBANK_EXPLORER +
                    "profile/" +
                    (element.explorerAddress
                      ? element.explorerAddress
                      : element.address)
                  : "";
            }

            if (element.type === "ETS") {
              let etsNameUp = this.getEtsNameUp(element);
              currentTotalDataElement.label = `ETS ${etsNameUp}`;
              let etsName = this.getEtsName(element);
              currentTotalDataElement.link = "/ets/" + etsName;
            }

            this.currentTotalData.push(currentTotalDataElement);
            this.totalValue += element.netAssetValue
              ? element.netAssetValue
              : 0;
          }

          this.isCurrentTotalDataLoading = false;
        })
        .catch((e) => {
          console.error("Error while adding stablecoins to list: " + e);
          this.isCurrentTotalDataLoading = false;
        });
    },
    getEtsName(element) {
      for (let i = 0; i < this.etsList.length; i++) {
        let ets = this.etsList[i];
        let etsName;

        if (ets.id === element.id) {
          etsName = ets.name;
          return etsName;
        }
      }
    },
    getEtsNameUp(element) {
      for (let i = 0; i < this.etsList.length; i++) {
        let ets = this.etsList[i];
        let etsNameUp;

        if (ets.id === element.id) {
          etsNameUp = ets.nameUp;
          return etsNameUp;
        }
      }
    },
    loadCollateralData() {
      this.isCollateralLoading = true;

      collateralApiService
        .getCollateralData(this.apiUrl + `/${this.tabNetworkName}/usdt+`)
        .then((data) => {
          let stablecoinList = data;
          stablecoinList.sort((a, b) => b.netAssetValue - a.netAssetValue);
          stablecoinList = stablecoinList.filter((el) => el.netAssetValue > 0);

          let colors = [
            "#2775CA",
            "#26A17B",
            "#FCCA46",
            "#6E56C4",
            "#002868",
            "#26A17B",
            "#23DD00",
            "#3D8DFF",
            "#FE7F2D",
            "#B22174"
          ];

          this.collateralData = [];
          for (let i = 0; i < stablecoinList.length; i++) {
            let element = stablecoinList[i];

            try {
              this.collateralData.push({
                label: element.id.tokenName,
                value: element.netAssetValue,
                link: element.tokenAddress ? element.tokenAddress : "",
                color: colors[i],
                logo: require("@/assets/currencies/stablecoins/" +
                  element.id.tokenName +
                  ".png")
              });
            } catch (e) {
              console.error("Error while adding stablecoin to list: " + e);
            }
          }

          this.isCollateralLoading = false;
        })
        .catch((e) => {
          console.debug("loadCollateralData: ", e);
          this.isCollateralLoading = false;
        });
    }
  }
};
</script>

<style scoped>
/* mobile */
@media only screen and (max-width: 960px) {
  .section-title-label {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
  }

  .currency {
    width: 80px;
    height: 80px;
  }

  .section-text {
    font-size: 14px;
    line-height: 22px;
  }

  .currency-usdt {
    width: 30px;
    height: 30px;
  }

  .currency-text {
    font-size: 14px;
    line-height: 22px;
  }

  .address-text {
    font-size: 14px;
    line-height: 22px;
  }

  .open-new {
    width: 20px;
    height: 20px;
  }

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .btn-filled,
  .btn-outlined {
    width: 40% !important;
  }

  .tab-btn {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
  }

  .toggle-row {
    width: 100% !important;
  }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
  .section-title-label {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.04em;
  }

  .currency {
    width: 100px;
    height: 100px;
  }

  .section-text {
    font-size: 16px;
    line-height: 24px;
  }

  .currency-usdt {
    width: 38px;
    height: 38px;
  }

  .currency-text {
    font-size: 18px;
    line-height: 28px;
  }

  .address-text {
    font-size: 18px;
    line-height: 28px;
  }

  .open-new {
    width: 24px;
    height: 24px;
  }

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .tab-btn {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
  }
}

/* full */
@media only screen and (min-width: 1400px) {
  .section-title-label {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.04em;
  }

  .currency {
    width: 100px;
    height: 100px;
  }

  .section-text {
    font-size: 18px;
    line-height: 28px;
  }

  .currency-usdt {
    width: 38px;
    height: 38px;
  }

  .currency-text {
    font-size: 18px;
    line-height: 28px;
  }

  .address-text {
    font-size: 18px;
    line-height: 28px;
  }

  .open-new {
    width: 24px;
    height: 24px;
  }

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .tab-btn {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
  }
}

@media only screen and (min-width: 1300px) {
  .section-title-label {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.04em;
  }

  .label-about {
    margin-top: 15px !important;
  }

  .currency {
    width: 100px;
    height: 100px;
  }

  .section-text {
    font-size: 17px;
    line-height: 28px;
  }

  .currency-usdt {
    width: 32px;
    height: 32px;
  }

  .currency-text {
    font-size: 16px;
    line-height: 25px;
  }

  .address-text {
    font-size: 16px;
    line-height: 28px;
  }

  .open-new {
    width: 22px;
    height: 22px;
  }

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 15px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .tab-btn {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
  }
}

.page-container {
  margin-bottom: 5% !important;
}

.info-card-container {
  background: var(--secondary);
  border-radius: 12px;
}

.info-card-container-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.info-card-body-bottom {
  margin: 2% 2% !important;
}

.section-title-label {
  font-feature-settings: "pnum" on, "lnum" on;
  text-transform: none;
  color: var(--secondary-gray-text);
}

.section-text {
  font-weight: 300;
  color: var(--main-gray-text);
}

.currency-box {
  background: var(--secondary);
  border-radius: 12px;
}

.currency-box,
.currency-box >>> * {
  cursor: pointer;
}

.address-text {
  font-style: normal;
  font-weight: 300;
  color: var(--secondary-gray-text);
}

.currency-text {
  font-style: normal;
  font-weight: 400;
  color: var(--secondary-gray-text);
}

.header-btn {
  border-radius: 4px !important;
  box-shadow: none !important;

  text-align: center !important;
  text-transform: uppercase !important;
  font-feature-settings: "pnum" on, "lnum" on !important;
}

.btn-filled {
  background: var(--blue-gradient);
  color: #ffffff !important;
  width: 140px;
  height: 40px;
}

.btn-outlined {
  background-color: var(--main-background) !important;
  color: var(--links-blue);
  border: 1px solid #1c95e7;
  width: 140px;
  height: 40px;
}

.tab-btn {
  font-feature-settings: "liga" off;
  color: var(--secondary-gray-text);
  margin-bottom: -2px;
  cursor: pointer;
}

.tab-btn-disabled {
  cursor: default;
}

.tab-button {
  border-bottom: 2px solid var(--links-blue) !important;
  color: var(--links-blue) !important;
  cursor: pointer !important;
}

.tab-button-in-active {
  color: var(--secondary-gray-text) !important;
  cursor: pointer !important;
}

.toggle-row {
  border-bottom: 2px solid var(--main-border);
  width: 203% !important;
}

.risk-text {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #707a8b;
}

.link-to-docs {
  text-decoration: none;
}
</style>

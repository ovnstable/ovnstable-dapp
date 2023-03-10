<template>
    <div class="page-container">

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

      <v-row v-else class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-5'" justify="start" align="center">
          <v-col class="info-card-body-bottom">
              <v-row align="center" justify="start" class="ma-0">
                  <label class="section-title-label">
                    USD+ collateral assets
                  </label>
              </v-row>

              <v-row align="center" justify="center">
                  <v-col :cols="!$wu.isFull() ? 12 : 8">
                      <TableStablecoins
                          v-if="!$wu.isMobile()"
                          :data="collateralData"/>

                      <TableStablecoins
                          v-else
                          minimized
                          :data="collateralData"/>
                  </v-col>

                  <v-col :cols="!$wu.isFull() ? 12 : 4">
                      <PieStablecoins :data="collateralData" :size="!$wu.isFull() ? 200 : 300"/>
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

      <v-row v-else class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-3'" justify="start" align="center">
          <v-col class="info-card-body-bottom">
              <v-row align="center" justify="start" class="ma-0">
                  <label class="section-title-label">
                    USD+ portfolio
                  </label>
              </v-row>

              <v-row align="center" justify="center">
                  <v-col :cols="!$wu.isFull() ? 12 : 8">
                      <TableStrategies
                          v-if="!$wu.isMobile()"
                          :data="currentTotalData"
                          :total-supply="totalValue"
                          :total-title="'Total USD+ in circulation'"/>

                      <TableStrategies
                          v-else
                          minimized
                          :data="currentTotalData"
                          :total-supply="totalValue"
                          :total-title="'Total USD+ in circulation'"/>
                  </v-col>

                  <v-col :cols="!$wu.isFull() ? 12 : 4">
                      <DoughnutStrategies :data="currentTotalData" :total-value="totalValue" :size="!$wu.isFull() ? 200 : 300"/>
                  </v-col>
              </v-row>
          </v-col>
      </v-row>

        <v-row v-if="!isCurrentTotalDataLoading" class=" ma-0 mt-3">
            <v-col class="currency-box" :cols="$wu.isFull() ? 6 : 12" :class="$wu.isFull() ? 'mr-1' : ''">
                <v-row align="center" :class="$wu.isMobile() ? 'ma-2' : 'ma-5'" @click="openLink('https://optimistic.etherscan.io/address/' + contracts.usdPlus.options.address)">
                    <div>
                        <v-img class="currency" :src="require('@/assets/currencies/USD+.png')" />
                    </div>
                    <label class="currency-text ml-2">USD+ token address</label>

                    <v-spacer></v-spacer>

                    <label class="address-text ml-auto">{{ shortAddress(contracts.usdPlus.options.address) }}</label>
                    <div class="ml-auto d-flex">
                        <v-img class="open-new mt-0 ml-1" :src="require('@/assets/icon/open-in-new.svg')"/>
                    </div>
                </v-row>
            </v-col>

            <v-col class="currency-box" :cols="$wu.isFull() ? '' : 12" :class="$wu.isFull() ? 'ml-1' : 'mt-3'">
                <v-row align="center" :class="$wu.isMobile() ? 'ma-2' : 'ma-5'" @click="openLink('https://hacken.io/audits/#overnight')">
                    <div>
                        <v-img class="currency" :src="require('@/assets/currencies/Hacken.svg')" />
                    </div>
                    <label class="currency-text ml-2">Audit</label>

                    <v-spacer></v-spacer>

                    <div class="ml-auto d-flex">
                        <v-img class="open-new mt-0 ml-1" :src="require('@/assets/icon/open-in-new.svg')"/>
                    </div>
                </v-row>
            </v-col>
        </v-row>

        <v-row v-if="!isCurrentTotalDataLoading" align="start" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-5 mb-10' : 'mt-8'">
            <v-btn class="header-btn btn-filled" @click="mintAction">
                Enter amount to mint
            </v-btn>
        </v-row>
        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import TableStablecoins from "@/components/stats/pie/TableStablecoins";
import PieStablecoins from "@/components/stats/pie/PieStablecoins";
import TableStrategies from "@/components/stats/doughnut/TableStrategies";
import DoughnutStrategies from "@/components/stats/doughnut/DoughnutStrategies";
import {strategiesApiService} from "@/services/strategies-api-service";
import {collateralApiService} from "@/services/collateral-api-service";

export default {
    name: "CollateralViewTab",

    components: {
        DoughnutStrategies,
        TableStrategies,
        PieStablecoins,
        TableStablecoins
    },

    data: () => ({
      isCurrentTotalDataLoading: true,
      isCollateralLoading: true,

      collateralData: null,
      currentTotalData: null,
      totalValue: 0
    }),

    computed: {
        ...mapGetters("network", ['appApiUrl']),
        ...mapGetters("web3", ['contracts']),
    },

    watch: {
      appApiUrl: function () {
        this.loadData();
      }
    },
    mounted() {
      this.loadData();
    },
    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),

      loadData() {
        this.loadCurrentTotalData()
        this.loadCollateralData()
      },

      loadCurrentTotalData() {
        this.isCurrentTotalDataLoading = true;

        strategiesApiService.getStrategies(this.appApiUrl)
            .then(data => {
              let strategies = data;
              strategies.sort((a,b) => b.netAssetValue - a.netAssetValue);

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
                "#002868"
              ];

              this.currentTotalData = [];
              this.totalValue = 0;

              for (let i = 0; i < strategies.length; i++) {
                let element = strategies[i];

                this.currentTotalData.push(
                    {
                      label: element.name,
                      fullName: element.fullName,
                      value: element.netAssetValue,
                      liquidationValue: element.liquidationValue,
                      color: colors[i],
                      link: (element.address || element.explorerAddress) ? (process.env.VUE_APP_DEBANK_EXPLORER + 'profile/' + (element.explorerAddress ? element.explorerAddress : element.address)) : ''
                    }
                );

                this.totalValue += element.netAssetValue ? element.netAssetValue : 0;
              }

              this.isCurrentTotalDataLoading = false;
            })
            .catch(e => {
              console.error("Error while adding stablecoins to list: " + e);
              this.isCurrentTotalDataLoading = false;
            })

      },
      loadCollateralData() {
        this.isCollateralLoading = true;

        collateralApiService.getCollateralData(this.appApiUrl)
            .then(data => {
              let stablecoinList = data;
              stablecoinList.sort((a,b) => b.netAssetValue - a.netAssetValue);
              stablecoinList = stablecoinList.filter(el => el.netAssetValue > 0);

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
                  this.collateralData.push(
                      {
                        label: element.id.tokenName,
                        value: element.netAssetValue,
                        link: element.tokenAddress ? element.tokenAddress : '',
                        color: colors[i],
                        logo: require('@/assets/currencies/stablecoins/' + element.id.tokenName + '.png')
                      }
                  );
                  console.log("Token name : ", element.id.tokenName);
                } catch (e) {
                  console.error("Error while adding stablecoin to list: " + e);
                }
              }

              this.isCollateralLoading = false;
            })
            .catch(e => {
              console.log("Error Strategy Weights: ", e);
              this.isCollateralLoading = false;
            })
      },

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        shortAddress(address) {
            if (address) {
                return address.substring(0, 5) + '...' + address.substring(address.length - 4);
            } else {
                return null;
            }
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled {
        width: 100%;
        height: 36px !important;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .currency {
        width: 30px ;
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
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled {
        width: 20%;
        height: 40px !important;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .currency {
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
}

/* full */
@media only screen and (min-width: 1400px) {
    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled {
        width: 20%;
        height: 40px !important;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .currency {
        width: 38px !important;
        height: 38px !important;
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
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled {
        width: 20%;
        height: 40px !important;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .currency {
        width: 32px !important;
        height: 32px !important;
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
}

.page-container {
    margin-bottom: 5% !important;
}

.tab-chain-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer !important;
}

.tab-chain-button-in-active {
    color: var(--secondary-gray-text) !important;
    cursor: pointer !important;
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
}

.info-link {
    font-weight: 400;
    color: var(--links-blue) !important;
    cursor: pointer;
}

.header-btn {
    border-radius: 4px !important;
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

.info-card-container {
    background: var(--secondary);
    border-radius: 12px;
}

.currency-box {
    background: var(--secondary);
    border-radius: 12px;
}

.info-card-body-bottom {
    margin: 2% 2% !important;
}

.section-title-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    text-transform: none;
    color: var(--secondary-gray-text);
}

.currency-text {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 400;
    color: var(--secondary-gray-text);
}

.open-link {
    width: 18px;
    height: 18px;
}

.address-text {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 300;
    color: var(--secondary-gray-text);
}

.currency-box, .currency-box >>> * {
    cursor: pointer;
}

</style>

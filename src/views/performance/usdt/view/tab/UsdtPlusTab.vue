<template>
    <div class="page-container">

        <div v-if="!isCollateralLoading">
            <v-row v-if="networkId === 56">
                <template v-if="$wu.isMobile()">
                    <v-col cols="12" align="center" class="mt-5">
                        <v-btn class="header-btn btn-filled mr-5" @click="mintAction">
                            Mint USDT+
                        </v-btn>
                        <v-btn class="header-btn btn-outlined" @click="redeemAction">
                            Redeem USDT+
                        </v-btn>
                    </v-col>
                </template>
                <v-col cols="6">
                    <v-row class="ma-0 mt-10 toggle-row">
                        <label class="tab-btn mr-4" @click="setTab('bsc')" v-bind:class="activeTabBsc">Bsc</label>
                    </v-row>
                </v-col>
                <template v-if="!$wu.isMobile()">
                    <v-col align="end" cols="6" class="mt-6">
                        <v-btn class="header-btn btn-filled mr-5" @click="mintAction">
                            Mint USDT+
                        </v-btn>
                        <v-btn class="header-btn btn-outlined mr-3" @click="redeemAction">
                            Redeem USDT+
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
        <v-row v-else class="ma-0 info-card-container mt-3" justify="start" align="start">
            <v-col class="info-card-body-bottom">
                <v-row align="start" justify="start" class="ma-0">
                    <label class="section-title-label">
                      USDT+ collateral assets
                    </label>
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
        <v-row v-else class="ma-0 info-card-container mt-3" justify="start" align="start">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <label class="section-title-label">
                      USDT+ portfolio
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

        <div v-if="!isCurrentTotalDataLoading" class="ma-0 info-card-container d-flex mt-3">
            <div class="" :class="$wu.isMobile() ? 'ml-5 mr-5 mt-5' : 'ml-10 mr-5 my-5'" >
                <v-img class="currency" :src="require('@/assets/currencies/USDT+.svg')" />
            </div>
            <div class="info-card-container-box" :class="$wu.isMobile() ? 'mt-5 mb-5 mr-5' : 'mt-0'" >
                <label class="section-title-label label-about">About USDT+</label>
                <label class="section-text">USDT+ is the equivalent of USD+, pegged to USDT 1:1. USDT+ consist of aUSDT (Aave) and USD+. It has been designed for boosted pools (Balancer and Beethoven) on Bsc. It cannot be minted separately.</label>
            </div>
        </div>

        <v-row v-if="!isCurrentTotalDataLoading" class=" ma-0 mt-3">
            <v-col class="currency-box" :cols="$wu.isFull() ? 6 : 12">
                <v-row align="center" :class="$wu.isMobile() ? 'ma-2' : 'ma-5'"
                       @click="openLink(explorerLink)">
                    <div>
                        <v-img class="currency-usdt" :src="require('@/assets/currencies/USDT+.svg')" />
                    </div>
                    <label class="currency-text ml-2">USDT+ token address</label>

                    <v-spacer></v-spacer>

                    <label class="address-text ml-auto">{{ shortAddress(contractAddress) }}</label>
                    <div class="ml-auto d-flex">
                        <v-img class="open-new mt-0 ml-1" :src="require('@/assets/icon/open-in-new.svg')"/>
                    </div>
                </v-row>
            </v-col>
        </v-row>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import TableStablecoins from "@/components/stats/pie/TableStablecoins.vue";
import PieStablecoins from "@/components/stats/pie/PieStablecoins.vue";
import TableStrategies from "@/components/stats/doughnut/TableStrategies.vue";
import DoughnutStrategies from "@/components/stats/doughnut/DoughnutStrategies.vue";

import {collateralApiService} from "@/services/collateral-api-service";
import {strategiesApiService} from "@/services/strategies-api-service";
import * as numberUtils from "@/utils/number-utils";

export default {
    name: "CollateralView",

    components: {
        DoughnutStrategies,
        TableStrategies,
        PieStablecoins,
        TableStablecoins
    },

    data: () => ({
      tab: 'bsc',
      isCurrentTotalDataLoading: true,
      isCollateralLoading: true,

      collateralData: null,
      currentTotalData: null,
      totalValue: 0
    }),

    computed: {
        ...mapGetters("network", ['networkId', 'networkName', 'apiUrl', 'getParams']),

        tabNetworkName: function() {
            let params;
            params = this.getParams(this.tab)

            return params.networkName;
        },

        activeTabBsc: function() {
            return {
                'tab-button': this.tab === 'bsc',
                'tab-button-in-active': this.tab !== 'bsc',
            }
        },

        explorerLink: function () {
          if (this.tabNetworkName === 'bsc') {
            return 'https://bscscan.com/token/0x5335E87930b410b8C5BB4D43c3360ACa15ec0C8C'
          }

          console.error("Not found networkId type when return usdt explorer link")
          return null;
        },

        contractAddress: function () {
          if (this.tabNetworkName === 'bsc') {
            return '0x5335E87930b410b8C5BB4D43c3360ACa15ec0C8C'
          }

          console.error("Not found networkId type when return usdt contract address")
          return null;
        },
    },

    watch: {
    },

    created() {
    },

    mounted() {
      console.log('Tab Name: ', this.$route.query.tabName);
      this.setTab('bsc');
    },

    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
        ...mapActions('swapUsdtModal', ['showUsdtSwapModal', 'showUsdtMintView', 'showUsdtRedeemView']),

        setTab(tabName) {
            this.tab = tabName;
            this.initTabName('/collateral/usdt', {tabName: this.tab});

            this.loadCurrentTotalData()
            this.loadCollateralData()
            console.log("NetworkParams : ", this.getParams(this.tab));
        },

        initTabName(path, queryParams) {
            this.$router.push({
                path: path,
                query: queryParams ? queryParams : {}
            });
        },

        mintAction() {
            this.showUsdtMintView();
            this.showUsdtSwapModal();
        },

        redeemAction() {
            this.showUsdtRedeemView();
            this.showUsdtSwapModal();
        },

      openLink(url) {
          window.open(url, '_blank').focus();
      },

      shortAddress(address) {
          if (address) {
              return address.substring(0, 5) + '...' + address.substring(address.length - 4);
          } else {
              return null;
          }
      },

      loadCurrentTotalData() {
        this.isCurrentTotalDataLoading = true;

        strategiesApiService.getStrategies(this.apiUrl + `/${this.tabNetworkName}/usdt+`)
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

        collateralApiService.getCollateralData(this.apiUrl + `/${this.tabNetworkName}/usdt+`)
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
    }
}
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

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled, .btn-outlined {
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

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
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
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    text-transform: none;
    color: var(--secondary-gray-text);
}

.section-text {
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    color: var(--main-gray-text);
}

.currency-box {
    background: var(--secondary);
    border-radius: 12px;
}

.currency-box, .currency-box >>> * {
    cursor: pointer;
}

.address-text {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 300;
    color: var(--secondary-gray-text);
}

.currency-text {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 400;
    color: var(--secondary-gray-text);
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
    width: 140px;
    height: 40px;
}

.btn-outlined {
    background-color: var(--main-background) !important;
    color: var(--links-blue);
    border: 1px solid #1C95E7;
    width: 140px;
    height: 40px;
}

.tab-btn {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
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
</style>

<template>
    <div>
        <div class="mt-10">
            <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'ml-3' : ''">
                <label class="parent-page-label" @click="goToAction('/market')">ETS</label>
                <label class="current-page-label">
                    <v-icon size="18" class="mx-2">mdi-chevron-right</v-icon>
                    ETS {{ etsData.nameUp }}
                </label>
            </v-row>
        </div>

    <div v-if="!isAllDataLoaded">
      <v-row>
        <v-row align="center" justify="center" class="py-15">
          <v-progress-circular
              width="2"
              size="24"
              color="#8FA2B7"
              indeterminate
          ></v-progress-circular>
        </v-row>
      </v-row>
    </div>

    <div v-else class="mt-1">
      <v-row align="start" justify="start" class="main-container ma-0">
        <v-col :cols="$wu.isFull() ? 9 : 12" :class="$wu.isFull() ? 'ml-n3' : ''">
          <StrategyBanner :ets-data="etsData" :ets-strategy-data="etsStrategyData"/>

          <v-row align="center" justify="start" class="ma-0 mt-5" v-if="!$wu.isFull()">
            <v-btn class="header-btn btn-filled-red" @click="showRiskModal">
              Investment risks
            </v-btn>
          </v-row>

          <v-row class="ma-0 mt-5" justify="start" align="center" v-if="!$wu.isFull()">
            <v-col class="info-card-container-white" cols="12">
              <div class="my-4">
                <template v-if="networkSupport">
                  <v-row align="center" class="ma-0">
                    <v-col cols="12">
                      <v-row align="center">
                        <label class="investor-card-sub-title">Your balance in ETS, {{ etsData.actionTokenName }}</label>
                      </v-row>
                      <v-row align="center" class="mt-5">
                        <label class="investor-card-sub-title-value" :class="dataHidden ? 'hidden-label' : ''">
                          {{ dataHidden ? '' : etsBalance[etsData.name] ? ($utils.formatMoneyComma(etsBalance[etsData.name], 2)) : '—' }}
                        </label>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row align="center" class="ma-0">
                    <v-col cols="12">
                      <v-row align="center" :class="$wu.isMobile() ? 'mt-2' : 'mt-4'">
                        <label class="investor-card-sub-title">Profit/loss</label>
                      </v-row>
                      <v-row class="info-row mt-6" justify="start" align="center">
                        <label class="fee-structure-label mt-1">Last day</label>
                        <v-spacer></v-spacer>
                        <label class="investor-card-sub-title-value" :class="dataHidden ? 'hidden-label mt-1' : (etsClientData[this.etsData.name] > 0 ? 'success-color' : '')">
                          {{ dataHidden ? '' : (etsClientData[this.etsData.name] ? ((etsClientData[this.etsData.name] > 0 ? '+' : '') + '$' + $utils.formatMoneyComma(etsClientData[this.etsData.name], 4)) : '—') }}
                        </label>
                      </v-row>
                    </v-col>
                  </v-row>
                </template>

                <template v-if="networkSupport">
                  <v-row align="center" justify="center" class="ma-0 mx-3" :class="$wu.isMobile() ? 'mt-10' : 'mt-12'" v-if="!isOvercapAvailable && this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply">
                    <label class="full-status-error-label">TVL > ${{ $utils.formatMoneyComma(etsData.maxSupply, 0) }}. Please check status later.</label>
                  </v-row>

                  <v-row v-if="isShowGalxeInfo" align="center" justify="center" class="mt-6 px-5">
                    <v-row class="galxe-container">
                      <v-col>
                        To mint this ETS, you need to have NFT in your wallet.
                      </v-col>
                      <v-btn class="header-btn btn-investor-invest btn-investor-outline" outlined @click="openGalaxeCompany">
                        GET NFT ON GALXE
                      </v-btn>
                    </v-row>
                  </v-row>

                  <v-row align="center" justify="center" class="ma-0" :class="(!isOvercapAvailable && this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply) ? 'mt-2' : 'mt-12'">
                    <v-btn class="header-btn btn-investor-invest" :class="(this.etsData.disabled || (!isOvercapAvailable && this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply)) ? 'disabled-btn' : ''" :disabled="this.etsData.disabled || (!isOvercapAvailable && this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply)"  @click="mintAction">
                      MINT ETS
                    </v-btn>
                  </v-row>

                  <v-row align="center" justify="center" class="ma-0 mt-4">
                    <v-btn class="header-btn btn-investor-invest btn-investor-outline" outlined @click="redeemAction">
                      REDEEM ETS
                    </v-btn>
                  </v-row>
                </template>

                <template v-else>
                  <v-row align="center" justify="center" class="ma-0">
                    <v-btn class="header-btn btn-investor-invest" @click="setWalletNetwork(etsData.chain.toString())">
                      SWITCH TO {{ etsData.chainName.toUpperCase() }} TO MINT
                    </v-btn>
                  </v-row>
                </template>
              </div>
            </v-col>

            <v-col class="info-card-container-white mt-4" cols="12" v-if="networkSupport">
              <div class="my-4">
                <v-row align="center" class="ma-0">
                  <label class="investor-card-title">One-time fees</label>
                  <div style="margin-top: -2px">
                    <Tooltip v-if="minRedeemFee || minRedeemFee" :size="16" text="ETS rebalances at each mint/redeem. Every rebalance makes the impermanent loss, permanent, i.e. creating a fixed cost. The minimum fee is introduced to minimize the # of mint/redeems, thus minimizing the cost and maximizing the return for the users."/>
                    <Tooltip v-else :size="16" text="Overnight retains part of the yield. APY figure is net of those retentions. You see what you get."/>
                  </div>
                </v-row>
                <v-row class="info-row ma-0 mt-8" justify="start" align="center">
                  <label class="fee-structure-label mt-1">Mint fee</label>
                  <v-spacer></v-spacer>
                  <label class="fee-structure-value mt-1">
                    {{ entryFee ? $utils.formatMoneyComma(entryFee, 2) + '%' : '' }}
                    {{ (minMintFee && minMintFee !== 0) ? ((entryFee ? ' (min $' : 'min $') + $utils.formatMoneyComma(minMintFee, 0) + (entryFee ? ')' : '')) : ('') }}
                  </label>
                </v-row>
                <v-row class="info-row ma-0 mt-4" justify="start" align="center">
                  <label class="fee-structure-label mt-1">Redeem fee</label>
                  <v-spacer></v-spacer>
                  <label class="fee-structure-value mt-1">
                    {{ exitFee ? $utils.formatMoneyComma(exitFee, 2) + '%' : '' }}
                    {{ (minRedeemFee && minRedeemFee !== 0) ? ((exitFee ? ' (min $' : 'min $') + $utils.formatMoneyComma(minRedeemFee, 0) + (exitFee ? ')' : '')) : ('') }}
                  </label>
                </v-row>
              </div>
            </v-col>
          </v-row>

          <v-row align="center" justify="start" class="ma-0 toggle-row mt-10">
            <label class="tab-btn mr-4" @click="tab=1" v-bind:class="activeTabPerformance">Performance</label>
            <label class="tab-btn ml-4" @click="tab=2" v-bind:class="activeTabAbout">About ETS</label>
          </v-row>

          <PerformanceTab v-if="tab === 1"
                          :ets-data="etsData"
                          :ets-strategy-data="etsStrategyData"
                          :ets-apy-data="etsApyData"
                          :ets-tvl-data="etsTvlData"
                          :usd-plus-apy-data="usdPlusApyData"/>
          <AboutTab v-if="tab === 2" :ets-data="etsData"/>
        </v-col>

        <v-col cols="3" v-if="$wu.isFull()">
          <v-row align="center" justify="start" class="ma-0 sticky" style="width: 20%;">
            <v-btn class="header-btn btn-filled-red" @click="showRiskModal">
              Investment risks
            </v-btn>
          </v-row>

          <v-row class=" ma-0 sticky mt-15" justify="start" align="center" style="width: 20%;">
            <v-col class="info-card-container-white" cols="12">
              <div class="my-6 mx-6">
                <template v-if="networkSupport">
                  <v-row align="center" >
                    <label class="investor-card-sub-title">Your balance in ETS, {{etsData.actionTokenName }}</label>
                  </v-row>
                  <v-row align="center" class="mt-5">
                    <label class="investor-card-sub-title-value" :class="dataHidden ? 'hidden-label' : ''">
                      {{ dataHidden ? '' : etsBalance[etsData.name] ? ($utils.formatMoneyComma(etsBalance[etsData.name], 2)) : '—' }}
                    </label>
                  </v-row>
                  <v-row align="center" class="mt-10">
                    <label class="investor-card-sub-title">Profit/loss</label>
                  </v-row>
                  <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="fee-structure-label mt-1">Last day</label>
                    <v-spacer></v-spacer>
                    <label class="investor-card-sub-title-value" :class="dataHidden ? 'hidden-label mt-1' : (etsClientData[this.etsData.name] > 0 ? 'success-color' : '')">
                      {{ dataHidden ? '' : (etsClientData[this.etsData.name] ? ((etsClientData[this.etsData.name] > 0 ? '+' : '') + '$' + $utils.formatMoneyComma(etsClientData[this.etsData.name], 4)) : '—') }}
                    </label>
                  </v-row>
                </template>

                <template v-if="networkSupport">
                  <v-row align="center" justify="center" class="mt-15" v-if="!isOvercapAvailable && this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply">
                    <label class="full-status-error-label">TVL > ${{ $utils.formatMoneyComma(etsData.maxSupply, 0) }}. Please check status later.</label>
                  </v-row>

                  <v-row v-if="isShowGalxeInfo" align="center" justify="center" class="mt-6">
                   <v-row class="galxe-container">
                     <v-col>
                       To mint this ETS, you need to have NFT in your wallet.
                     </v-col>
                     <v-btn class="header-btn btn-investor-invest btn-investor-outline" outlined @click="openGalaxeCompany">
                       GET NFT ON GALXE
                     </v-btn>
                   </v-row>
                  </v-row>

                  <v-row align="center" justify="center" :class="(!isOvercapAvailable && this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply)? 'mt-5' : 'mt-12'">
                    <v-btn class="header-btn btn-investor-invest" :class="(this.etsData.disabled || (!isOvercapAvailable && this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply)) ? 'disabled-btn' : ''" :disabled="this.etsData.disabled || (!isOvercapAvailable && this.etsData.maxSupply && totalSupply[etsData.name] >= etsData.maxSupply)" @click="mintAction">
                      MINT ETS
                    </v-btn>
                  </v-row>

                  <v-row align="center" justify="center" class="mt-6">
                    <v-btn class="header-btn btn-investor-invest btn-investor-outline" outlined @click="redeemAction">
                      REDEEM ETS
                    </v-btn>
                  </v-row>
                </template>

                <template v-else>
                  <v-row align="center" justify="center" class="mt-0">
                    <v-btn class="header-btn btn-investor-invest" @click="setWalletNetwork(etsData.chain.toString())">
                      SWITCH TO {{ etsData.chainName.toUpperCase() }} TO MINT
                    </v-btn>
                  </v-row>
                </template>
              </div>
            </v-col>

            <v-col class="info-card-container-white mt-4" cols="12" v-if="networkSupport">
              <div class="my-6 mx-6">
                <v-row align="center">
                  <label class="investor-card-title">One-time fees</label>
                  <Tooltip v-if="minRedeemFee || minRedeemFee" :size="16" text="ETS rebalances at each mint/redeem. Every rebalance makes the impermanent loss, permanent, i.e. creating a fixed cost. The minimum fee is introduced to minimize the # of mint/redeems, thus minimizing the cost and maximizing the return for the users."/>
                  <Tooltip v-else :size="16" text="Overnight retains part of the yield. APY figure is net of those retentions. You see what you get."/>
                </v-row>

                <v-row class="mt-8" justify="start" align="center">
                  <v-col>
                    <v-row class="info-row" justify="start" align="center">
                      <label class="fee-structure-label">Mint fee</label>
                      <v-spacer></v-spacer>
                      <label class="fee-structure-value">
                        {{ entryFee ? $utils.formatMoneyComma(entryFee, 2) + '%' : '' }}
                        {{ (minMintFee && minMintFee !== 0) ? ((entryFee ? ' (min $' : 'min $') + $utils.formatMoneyComma(minMintFee, 0) + (entryFee ? ')' : '')) : ('') }}
                      </label>
                    </v-row>
                  </v-col>
                </v-row>

                <v-row class="mt-8" justify="start" align="center">
                  <v-col>
                    <v-row class="info-row" justify="start" align="center">
                      <label class="fee-structure-label">Redeem fee</label>
                      <v-spacer></v-spacer>
                      <label class="fee-structure-value">
                        {{ exitFee ? $utils.formatMoneyComma(exitFee, 2) + '%' : '' }}
                        {{ (minRedeemFee && minRedeemFee !== 0) ? ((exitFee ? ' (min $' : 'min $') + $utils.formatMoneyComma(minRedeemFee, 0) + (exitFee ? ')' : '')) : ('') }}
                      </label>
                    </v-row>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <RiskDisclosureModal :ets-data="etsData"/>

    <resize-observer @notify="$forceUpdate()"/>
  </div>
</template>

<script>

import StrategyBanner from "@/components/market/strategy/section/ets/StrategyBanner";
import RiskDisclosureModal from "@/components/market/modal/ets/RiskDisclosureModal";
import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";
import AboutTab from "@/views/strategy/ets/tab/AboutTab";
import PerformanceTab from "@/views/strategy/ets/tab/PerformanceTab";
import moment from "moment/moment";
import {axios} from "@/plugins/http-axios";
import network from "@/store/modules/common/web3/network";
import loadJSON from "@/utils/http-utils";

export default {
  name: "EtsPageView",

  components: {
    PerformanceTab,
    AboutTab,
    Tooltip,
    RiskDisclosureModal,
    StrategyBanner
  },

  data: () => ({
    tab: 1,
    isClientDataLoading: true,
    isEtsStrategyDataLoading: true,
    isUsdPlusApyDataLoading: true,

    etsData: {},
    etsApyData: {},
    etsTvlData: {},
    usdPlusApyData: {},
    etsStrategyData: {},
    etsClientData: {},

    minMintFee: null,
    minRedeemFee: null,

    galxeNetworkList: [],
    isClientExistNftForGalxe: false,
  }),


  computed: {
    ...mapGetters('network', ['networkId', 'networkName', 'polygonConfig', 'opConfig', 'bscConfig', 'arConfig', 'zkConfig']),
    ...mapGetters('accountData', ['etsBalance', 'account']),
    ...mapGetters('supplyData', ['totalSupply']),
    ...mapGetters('etsAction', ['etsList']),
    ...mapGetters('overcapData', ['isOvercapAvailable']),
    ...mapGetters('magicEye', ['dataHidden']),
    ...mapGetters('web3', ['web3', 'contracts']),

    isShowGalxeInfo() {
      return this.galxeNetworkList.indexOf(this.networkId) >= 0 && (!this.account || !this.isClientExistNftForGalxe);
    },

    isAllDataLoaded: function () {
      return !this.isClientDataLoading && !this.isEtsStrategyDataLoading && !this.isUsdPlusApyDataLoading;
    },

    activeTabPerformance: function () {
      return {
        'tab-button': this.tab === 1,
        'tab-button-in-active': this.tab !== 1,
      }
    },

    activeTabAbout: function () {
      return {
        'tab-button': this.tab === 2,
        'tab-button-in-active': this.tab !== 2,
      }
    },

    entryFee: function () {
      if (this.strategyData && this.strategyData.fees) {
        let result = this.strategyData.fees.find(x => x.id === 'buy');
        return result ? result.value : null;
      } else {
        return null;
      }
    },

    exitFee: function () {
      if (this.strategyData && this.strategyData.fees) {
        let result = this.strategyData.fees.find(x => x.id === 'redeem');
        return result ? result.value : null;
      } else {
        return null;
      }
    },

    performanceFee: function () {
      if (this.strategyData && this.strategyData.fees) {
        let result = this.strategyData.fees.find(x => x.id === 'profit');
        return result ? result.value : null;
      } else {
        return null;
      }
    },

    managementFee: function () {
      if (this.strategyData && this.strategyData.fees) {
        let result = this.strategyData.fees.find(x => x.id === 'tvl');
        return result ? result.value : null;
      } else {
        return null;
      }
    },

    networkSupport: function () {
      return this.networkId === this.etsData.chain;
    },

    strategyData: function () {
      if (this.etsStrategyData && this.etsData.name) {
        return this.etsStrategyData[this.etsData.name];
      } else {
        return null;
      }
    },
  },

  watch: {
    etsList: function (newVal, oldVal) {
      this.loadData();
    },

    account: function (newVal, oldVal) {
      if (newVal) {
        this.checkGalxeNft();
      }
    },

    networkId: function () {
      this.checkGalxeNft();
    }
  },
  mounted() {
    if (this.etsList) {
      this.loadData();
    }

    if (this.account) {
      this.checkGalxeNft();
    }
  },

  methods: {
    ...mapActions('network', ['setWalletNetwork']),
    ...mapActions('riskModal', ['showRiskModal']),
    ...mapActions('investModal', ['showInvestModal', 'showMintView', 'showRedeemView']),
    ...mapActions('magicEye', ['switchEye']),
    ...mapActions('marketData', ['refreshMarket']),

    loadData() {
      this.refreshMarket();

      this.updateEtsData();
      this.loadStrategyData();
      this.loadUsdPlusPayoutsData();
      this.loadClientData();
      this.getEntryMinFee();
      this.getExitMinFee();
    },

    goToAction(id) {
      this.$router.push(id);
    },

    openGalaxeCompany() {
      window.open("https://galxe.com/overnight/campaign/GCnGLU4ywn", '_target')
    },

    async checkGalxeNft() {
      if (this.galxeNetworkList.indexOf(this.networkId) < 0) {
        console.log('checkGalxeNft not needed', this.networkId);
        return;
      }

      this.isClientExistNftForGalxe = false;

      try {
        let account = this.account;

        let abiFile = await loadJSON(`/contracts/${this.networkName}/Nft.json`);
        let nftContract = new this.web3.eth.Contract(abiFile.abi, abiFile.address);

        let isNftExist = await nftContract.methods.balanceOf(account).call() * 1;
        console.log("Is nft exist response: ", isNftExist);
        this.isClientExistNftForGalxe = !!isNftExist; // to boolean and a = b
      } catch (e) {
        console.log("Is nft exist response error: ", this.networkId, this.networkName, e);
        this.isClientExistNftForGalxe = false;
      }
    },

    mintAction() {
      this.showMintView();
      this.showInvestModal(this.etsData);
    },

    redeemAction() {
      this.showRedeemView();
      this.showInvestModal(this.etsData);
    },

    updateEtsData() {
      if (this.etsList) {

        // console.log("Ets loading eps page: ", )
        let resultList = this.etsList.filter(ets => ets.name === this.$route.params.name);
        this.etsData = (resultList && resultList.length > 0) ? resultList[0] : {};
      }
    },

    async getEntryMinFee() {
      let result = 0;

      try {
        result = await this.contracts[this.etsData.exchangeContract].methods.buyMinFee().call();
        result = this.web3.utils.fromWei(result, this.etsData.etsTokenDecimals === 18 ? 'ether' : 'mwei');

        this.minMintFee = result;
      } catch (e) {
        this.minMintFee = 0;
      }
    },

    async getExitMinFee() {
      let result = 0;

      try {
        result = await this.contracts[this.etsData.exchangeContract].methods.redeemMinFee().call();
        result = this.web3.utils.fromWei(result, this.etsData.etsTokenDecimals === 18 ? 'ether' : 'mwei');

        this.minRedeemFee = result;
      } catch (e) {
        this.minRedeemFee = 0;
      }
    },

    async loadStrategyData() {
      this.isEtsStrategyDataLoading = true;
      let ets = this.etsData;
      console.log("loadStrategyData this.etsData", this.etsData);
      console.log("loadStrategyData this.etsData1", ets);
      console.log("loadStrategyData this.etsData2", ets.name);
      console.log("loadStrategyData this.etsData3", ets.address);
      let refreshParams = {contractAddress: ets.address, strategyName: ets.name, chain: ets.chain};
      let appApiUrl;

      switch (refreshParams.chain) {
        case 137:
          appApiUrl = this.polygonConfig.appApiUrl;
          break;
        case 10:
          appApiUrl = this.opConfig.appApiUrl;
          break;
        case 56:
          appApiUrl = this.opConfig.appApiUrl;
          break;
        case 42161:
          appApiUrl = this.arConfig.appApiUrl;
          break;
        case 324:
          appApiUrl = this.zkConfig.appApiUrl;
          break;
        default:
          appApiUrl = this.polygonConfig.appApiUrl;
          break;
      }

      let fetchOptions = {
        headers: {
          "Access-Control-'Allow'-Origin": appApiUrl
        }
      };

      let avgApy;
      let avgApyStrategyMonth;
      let strategyData;

      await fetch(appApiUrl + '/widget/avg-apy-info/month', fetchOptions)
          .then(value => value.json())
          .then(value => {
            avgApy = value;
            avgApy.date = moment(avgApy.date).format("DD MMM. ‘YY");
          }).catch(reason => {
            console.log('Error get data: ' + reason);
          })

      await fetch(appApiUrl + '/hedge-strategies/' + refreshParams.contractAddress + '/avg-apy-info/month', fetchOptions)
          .then(value => value.json())
          .then(value => {
            avgApyStrategyMonth = value;
            avgApyStrategyMonth.date = moment(avgApyStrategyMonth.date).format("DD MMM. ‘YY");
          }).catch(reason => {
            console.log('Error get data: ' + reason);
          })

      await fetch(appApiUrl + '/hedge-strategies/' + refreshParams.contractAddress, fetchOptions)
          .then(value => value.json())
          .then(value => {
            console.log('hedge-strategies loaded', value)
            strategyData = value;
            strategyData.lastApy = strategyData.apy;
            strategyData.apy = (avgApyStrategyMonth && avgApyStrategyMonth.value) ? (avgApyStrategyMonth.value) : strategyData.apy;
            strategyData.diffApy = (avgApy && avgApy.value && strategyData.apy) ? (strategyData.apy - avgApy.value) : null;

            /* TODO: get onChain */
            strategyData.targetHealthFactor = 1.2;

            strategyData.payoutItems.sort(
                function(o1,o2){
                  return moment(o1.payableDate).isBefore(moment(o2.payableDate)) ? -1 : moment(o1.payableDate).isAfter(moment(o2.payableDate)) ? 1 : 0;
                }
            );

            strategyData.timeData.sort(
                function(o1,o2){
                  return moment(o1.date).isBefore(moment(o2.date)) ? -1 : moment(o1.date).isAfter(moment(o2.date)) ? 1 : 0;
                }
            );

            let clientData = strategyData.timeData;

            let widgetDataDict = {};
            let widgetData = {
              labels: [],
              datasets: [
                {
                  fill: false,
                  borderColor: '#1C95E7',
                  data: [],
                }
              ]
            };

            [...clientData].forEach(item => {
              widgetDataDict[moment(item.date).format('DD.MM.YYYY')] = parseFloat(item.apy ? item.apy : 0.0).toFixed(2);
            });

            for(let key in widgetDataDict) {
              widgetData.labels.push(key);
              widgetData.datasets[0].data.push(widgetDataDict[key]);
            }

            this.etsApyData[refreshParams.strategyName] = widgetData;

            let widgetTvlDataDict = {};
            let widgetTvlData = {
              labels: [],
              datasets: [
                {
                  fill: false,
                  borderColor: '#1C95E7',
                  data: [],
                }
              ]
            };

            [...clientData].forEach(item => {
              widgetTvlDataDict[moment(item.date).format('DD.MM.YYYY')] = parseFloat(item.tvl ? item.tvl : 0.0).toFixed(2);
            });

            for(let key in widgetTvlDataDict) {
              widgetTvlData.labels.push(key);
              widgetTvlData.datasets[0].data.push(widgetTvlDataDict[key]);
            }

            this.etsTvlData[refreshParams.strategyName] = widgetData;
          }).catch(reason => {
            console.log('Error get data when load strategy ets data: ' + reason);
          })

      this.etsStrategyData[refreshParams.strategyName] = strategyData
      this.isEtsStrategyDataLoading = false;
    },
    async loadUsdPlusPayoutsData() {
      console.log('MarketData: refreshUsdPlusPayoutsData');
      this.isUsdPlusApyDataLoading = true;

      await Promise.all(
          ['polygon', 'bsc', 'optimism', 'arbitrum', 'zksync'].map(async network => {

            let appApiUrl;

            switch (network) {
              case "polygon":
                appApiUrl = this.polygonConfig.appApiUrl;
                break;
              case "bsc":
                appApiUrl = this.bscConfig.appApiUrl;
                break;
              case "optimism":
                appApiUrl = this.opConfig.appApiUrl;
                break;
              case "arbitrum":
                appApiUrl = this.arConfig.appApiUrl;
                break;
              case "zksync":
                appApiUrl = this.zkConfig.appApiUrl;
                break;
            }

            let fetchOptions = {
              headers: {
                "Access-Control-Allow-Origin": appApiUrl
              }
            };

            let resultDataList;

            axios.get(appApiUrl + `/dapp/payouts`, fetchOptions)
                .then(value => {
                  let clientData = value.data;
                  let widgetDataDict = {};

                  [...clientData].reverse().forEach(item => {
                    widgetDataDict[moment(item.payableDate).format('DD.MM.YYYY')] = parseFloat(item.annualizedYield ? item.annualizedYield : 0.0).toFixed(2);
                  });

                  resultDataList = widgetDataDict;

                  this.usdPlusApyData[network] = resultDataList;
                })
          })
      );

      this.isUsdPlusApyDataLoading = false;
    },
    async loadClientData() {
      console.log('MarketData: loadClientData');
      this.isClientDataLoading = true;

      let ets = this.etsData;
      if (!this.account) {
        this.isClientDataLoading = false;
        return;
      }

      let refreshParams = {contractAddress: ets.address, strategyName: ets.name, chain: ets.chain};
      let appApiUrl;


      switch (refreshParams.chain) {
        case 137:
          appApiUrl = this.polygonConfig.appApiUrl;
          break;
        case 10:
          appApiUrl = this.opConfig.appApiUrl;
          break;
        case 56:
          appApiUrl = this.opConfig.appApiUrl;
          break;
        case 42161:
          appApiUrl = this.arConfig.appApiUrl;
          break;
        case 324:
          appApiUrl = this.zkConfig.appApiUrl;
          break;
        default:
          appApiUrl = this.polygonConfig.appApiUrl;
          break;
      }

      let account = this.account.toLowerCase();
      let profitDay = null;

      let fetchOptions = {
        headers: {
          "Access-Control-Allow-Origin": appApiUrl
        }
      };

      await fetch(appApiUrl + '/hedge-strategies/' + refreshParams.contractAddress + '/account/' + account, fetchOptions)
          .then(value => value.json())
          .then(value => {
            profitDay = value.profit;
          }).catch(reason => {
            console.log('Error get data: ' + reason);
          })

      this.etsClientData[refreshParams.strategyName] = profitDay;
      this.isClientDataLoading = false;
    }
  }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
  .info-card-icon {
    width: 20px;
    height: 20px;
  }

  .investor-card-sub-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.03em;
  }

  .investor-card-sub-title-value {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
  }

  .investor-card-title {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.03em;
  }

  .fee-structure-label {
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
  }

  .fee-structure-value {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
  }

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .btn-investor-invest {
    width: 100% !important;
    height: 40px !important;
  }

  .tab-btn {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
  }

  .about-link-label {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
  }

  .full-status-error-label {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
  }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
  .info-card-icon {
    width: 24px;
    height: 24px;
  }

  .investor-card-sub-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.02em;
  }

  .investor-card-sub-title-value {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
  }

  .investor-card-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
  }

  .fee-structure-label {
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
  }

  .fee-structure-value {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.04em;
  }

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .parent-page-label {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
  }

  .current-page-label {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
  }

  .btn-investor-invest {
    width: 100% !important;
    height: 44px !important;
  }

  .tab-btn {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 32px;
  }

  .parent-page-label {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
  }

  .current-page-label {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
  }

  .about-link-label {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 18px !important;
    line-height: 24px !important;
  }

  .full-status-error-label {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
  }

  .hidden-label {
    width: 130px;
    height: 28px;
    background: var(--hide-account);
  }
}

/* full */
@media only screen and (min-width: 1400px) {
  .info-card-icon {
    width: 24px;
    height: 24px;
  }

  .investor-card-sub-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.02em;
  }

  .investor-card-sub-title-value {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
  }

  .investor-card-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
  }

  .fee-structure-label {
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
  }

  .fee-structure-value {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.04em;
  }

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .btn-investor-invest {
    width: 100% !important;
    height: 44px !important;
  }

  .tab-btn {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 32px;
  }

  .parent-page-label {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
  }

  .current-page-label {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
  }

  .about-link-label {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 18px !important;
    line-height: 24px !important;
  }

  .full-status-error-label {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
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
  .info-card-icon {
    width: 24px;
    height: 24px;
  }

  .investor-card-sub-title {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.02em;
  }

  .investor-card-sub-title-value {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
  }

  .investor-card-title {
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    letter-spacing: 0.02em;
  }

  .fee-structure-label {
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    line-height: 24px;
  }

  .fee-structure-value {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.04em;
  }

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 13px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .btn-investor-invest {
    width: 100% !important;
    height: 36px !important;
  }

  .tab-btn {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
  }

  .parent-page-label {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
  }

  .current-page-label {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
  }

  .about-link-label {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 18px !important;
    line-height: 24px !important;
  }

  .full-status-error-label {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
  }

  .hidden-label {
    width: 130px;
    height: 28px;
    background: var(--hide-account);
  }
}

.main-container {
  margin-bottom: 5% !important;
}

.parent-page-label {
  cursor: pointer;

  font-family: 'Roboto', sans-serif;
  font-feature-settings: 'liga' off;
  color: var(--links-blue);
}

.current-page-label {
  font-family: 'Roboto', sans-serif;
  font-feature-settings: 'liga' off;
  color: var(--secondary-gray-text);
}

.toggle-row {
  border-bottom: 2px solid var(--main-border);
}

.tab-btn {
  font-family: 'Roboto', sans-serif;
  font-feature-settings: 'liga' off;
  color: var(--secondary-gray-text);
  margin-bottom: -2px;
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

.info-card-container-white {
  background: var(--secondary);
  border-radius: 8px;
}

.info-row {
  border-top: 1px solid var(--secondary-border);
}

.header-btn {
  border-radius: 4px;
  box-shadow: none !important;

  font-family: 'Roboto', sans-serif !important;
  text-align: center !important;
  text-transform: uppercase !important;
  font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-investor-invest {
  background: var(--blue-gradient);
  color: #FFFFFF !important;
}

.btn-investor-outline {
  background: none !important;
  color: var(--links-blue) !important;
}

.btn-filled-red {
  width: 100%;
  height: 44px !important;
  background: rgba(207, 63, 146, 0.1) !important;
  color: #CF3F92 !important;
  border-radius: 4px;
}

.success-color {
  color: #22ABAC !important;
}

.sticky {
  margin-right: 4% !important;
  position: fixed !important;
}

.investor-card-title {
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase;
  font-feature-settings: 'pnum' on, 'lnum' on;
  color: var(--fourth-gray-text);
}

.investor-card-sub-title {
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase;
  font-feature-settings: 'pnum' on, 'lnum' on;
  color: var(--third-gray-text);
}

.investor-card-sub-title-value {
  font-family: 'Roboto', sans-serif;
  font-feature-settings: 'liga' off;
  color: var(--secondary-gray-text);
}

.value-disabled {
  font-weight: 300 !important;
  text-transform: uppercase !important;
  color: var(--disabled-value) !important;
}

.fee-structure-label {
  font-family: 'Roboto', sans-serif;
  font-feature-settings: 'pnum' on, 'lnum' on;
  color: var(--secondary-gray-text);
}

.fee-structure-value {
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase;
  font-feature-settings: 'pnum' on, 'lnum' on;
  color: var(--fee-structure-value);
}

.about-link-label {
  font-family: 'Roboto', sans-serif !important;
  font-feature-settings: 'liga' off !important;
  color: var(--links-blue) !important;
  cursor: pointer !important;
}

.about-link-label:hover {
  text-decoration: underline !important;
}

.disabled-btn {
  background: var(--main-banner-background) !important;
  color: #9DA4B0 !important;
}

.full-status-error-label {
  font-family: 'Roboto', sans-serif;
  font-feature-settings: 'pnum' on, 'lnum' on;
  color: #CF3F92;
}

.galxe-container {
  background: rgba(28, 149, 231, 0.1);
  border-radius: 8px;

  margin-top: 12px;
  padding: 10px;

  color: var(--secondary-gray-text);
}
</style>


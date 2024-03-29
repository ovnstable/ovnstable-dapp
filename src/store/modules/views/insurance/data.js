import { difference } from "@/utils/dates.js";
import dayjs from "dayjs";
import { axios } from "@/plugins/http-axios";
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

const state = {
  insuranceStrategyData: {},
  insuranceClientData: {},
  insuranceApyData: {},
  insuranceTvlData: {},
  insuranceRedemptionData: {},

  usdPlusApyData: {}
};

const getters = {
  insuranceStrategyData(state) {
    return state.insuranceStrategyData;
  },

  insuranceClientData(state) {
    return state.insuranceClientData;
  },

  insuranceApyData(state) {
    return state.insuranceApyData;
  },

  insuranceTvlData(state) {
    return state.insuranceTvlData;
  },

  insuranceRedemptionData(state) {
    return state.insuranceRedemptionData;
  },

  usdPlusApyData(state) {
    return state.usdPlusApyData;
  }
};

const actions = {
  async refreshInsurance({ commit, dispatch, getters, rootState }) {
    let insuranceChainList = [
      // {
      //     chainName: 'polygon',
      //     chainId: 137
      // }
      {
        chainName: "optimism",
        chainId: 10
      },
      {
        chainName: "arbitrum",
        chainId: 42161
      }
    ];

    for (let insuranceChain of insuranceChainList) {
      dispatch("refreshStrategyData", { chain: insuranceChain });
    }

    for (let insuranceChain of insuranceChainList) {
      dispatch("refreshClientData", { chain: insuranceChain });
    }
    //
    // dispatch('refreshUsdPlusPayoutsData', "polygon");
    // dispatch('refreshUsdPlusPayoutsData', "bsc");
    // dispatch('refreshUsdPlusPayoutsData', "optimism");
    // dispatch('refreshUsdPlusPayoutsData', "arbitrum");
    // dispatch('refreshUsdPlusPayoutsData', "zksync");

    dispatch("accountData/refreshBalance", null, { root: true });
    // dispatch('supplyData/refreshInsuranceSupply', null, {root:true});
  },

  async refreshStrategyData(
    { commit, dispatch, getters, rootState },
    refreshParams
  ) {
    let appApiUrl;

    switch (refreshParams.chain.chainId) {
      case 137:
        appApiUrl = rootState.network.polygonApi;
        break;
      case 10:
        appApiUrl = rootState.network.opApi;
        break;
      case 56:
        appApiUrl = rootState.network.bscApi;
        break;
      case 42161:
        appApiUrl = rootState.network.arApi;
        break;
      case 8453:
        appApiUrl = rootState.network.baseApi;
        break;
      case 59144:
        appApiUrl = rootState.network.lineaApi;
        break;
      case 324:
        appApiUrl = rootState.network.zkApi;
        break;
      default:
        appApiUrl = rootState.network.polygonApi;
        break;
    }

    let fetchOptions = {
      headers: {
        "Access-Control-Allow-Origin": appApiUrl
      }
    };

    const strategyData = {
      tvlData: 0
    };

    dispatch("addInsuranceStrategyData", {
      name: refreshParams.chain.chainName,
      data: strategyData
    });
  },

  async refreshClientData(
    { commit, dispatch, getters, rootState },
    refreshParams
  ) {
    let appApiUrl;

    switch (refreshParams.chain.chainId) {
      case 137:
        appApiUrl = rootState.network.polygonApi;
        break;
      case 10:
        appApiUrl = rootState.network.opApi;
        break;
      case 56:
        appApiUrl = rootState.network.bscApi;
        break;
      case 42161:
        appApiUrl = rootState.network.arApi;
        break;
      case 8453:
        appApiUrl = rootState.network.baseApi;
        break;
      case 59144:
        appApiUrl = rootState.network.lineaApi;
        break;
      case 324:
        appApiUrl = rootState.network.zkApi;
        break;
      default:
        appApiUrl = rootState.network.polygonApi;
        break;
    }

    if (!rootState.accountData.account) {
      return;
    }

    let profitDay = null;

    dispatch("addInsuranceClientData", {
      name: refreshParams.chain.chainName,
      data: profitDay
    });
    dispatch("refreshIsNeedRedemption");
  },

  async refreshUsdPlusPayoutsData(
    { commit, dispatch, getters, rootState },
    network
  ) {
    console.log("InsuranceData: refreshUsdPlusPayoutsData", network);

    let appApiUrl;

    switch (network) {
      case "polygon":
        appApiUrl = rootState.network.polygonApi;
        break;
      case "bsc":
        appApiUrl = rootState.network.bscApi;
        break;
      case "optimism":
        appApiUrl = rootState.network.opApi;
        break;
      case "arbitrum":
        appApiUrl = rootState.network.arApi;
        break;
      case "zksync":
        appApiUrl = rootState.network.zkApi;
        break;
    }

    let fetchOptions = {
      headers: {
        "Access-Control-Allow-Origin": appApiUrl
      }
    };

    let resultDataList;

    axios.get(appApiUrl + `/dapp/payouts`, fetchOptions).then((value) => {
      let clientData = value.data;
      let widgetDataDict = {};

      [...clientData].reverse().forEach((item) => {
        widgetDataDict[
          dayjs(item.payableDate).format("DD.MM.YYYY")
        ] = parseFloat(
          item.annualizedYield ? item.annualizedYield : 0.0
        ).toFixed(2);
      });

      resultDataList = widgetDataDict;

      dispatch("addUsdPlusApyData", { name: network, data: resultDataList });
    });
  },

  async refreshIsNeedRedemption({ commit, dispatch, getters, rootState }) {
    let web3 = rootState.web3;
    let account = rootState.accountData.account;

    console.log("refreshIsNeedRedemption");

    if (account) {
      let insurance = {
        // chainName: 'polygon'
        chainName: ["optimism", "arbitrum"]
      };

      if (!insurance.chainName.includes(rootState.network.networkName)) {
        return;
      }

      let contract =
        web3.contracts.insurance[rootState.network.networkName + "_exchanger"];
      if (!contract) {
        console.log("Insurance/redemptionCheck: contract not found");
        return;
      }

      let date = await contract.methods.withdrawRequests(account).call();
      try {
        date = parseFloat(date);
      } catch (e) {
        date = null;
      }

      if (date !== null) {
        let redemptionData = {
          request: null,
          date: null,
          hours: 0
        };

        if (date === 0) {
          redemptionData.request = "NEED_REQUEST";
          redemptionData.date = null;
          redemptionData.hours = 0;
        } else if (date > 0) {
          date = new Date(date * 1000);
          let currentDate = new Date();

          if (currentDate.getTime() > date.getTime()) {
            let withdrawPeriod = await web3.contracts.insurance[
              rootState.network.networkName + "_exchanger"
            ].methods
              .withdrawPeriod()
              .call();
            let withdrawDate = new Date(date.getTime() + withdrawPeriod * 1000);

            if (withdrawDate.getTime() > currentDate.getTime()) {
              let hours = dayjs
                .duration(dayjs(withdrawDate).diff(dayjs(currentDate)))
                .asHours();
              redemptionData.request = "CAN_WITHDRAW";
              redemptionData.date = date;
              redemptionData.hours = hours;
            } else {
              redemptionData.request = "NEED_REQUEST";
              redemptionData.date = null;
              redemptionData.hours = 0;
            }
          } else {
            let hours = dayjs
              .duration(dayjs(date).diff(dayjs(currentDate)))
              .asHours();
            redemptionData.request = "NEED_WAIT";
            redemptionData.date = date;
            redemptionData.hours = hours;
          }
        }

        console.log("REDEMPTION REQUEST: " + JSON.stringify(redemptionData));

        commit("setInsuranceRedemptionData", redemptionData);
      }
    }
  },

  async addInsuranceStrategyData(
    { commit, dispatch, getters, rootState },
    insuranceDataParams
  ) {
    let insuranceData = getters.insuranceStrategyData;
    let data = insuranceDataParams.data;

    if (!data.tvl || data.tvl < 0.0001) {
      if (data.payouts && data.payouts.length > 0) {
        data.tvl = data.payouts[data.payouts.length - 1].tvl;
      }
    }

    insuranceData[insuranceDataParams.name] = data;

    commit("setInsuranceStrategyData", null);
    commit("setInsuranceStrategyData", insuranceData);
  },

  async addInsuranceClientData(
    { commit, dispatch, getters, rootState },
    insuranceClientDataParams
  ) {
    let insuranceClientData = getters.insuranceClientData;
    insuranceClientData[insuranceClientDataParams.name] =
      insuranceClientDataParams.data;

    commit("setInsuranceClientData", insuranceClientData);
  },

  async addInsuranceApyData(
    { commit, dispatch, getters, rootState },
    insuranceApyDataParams
  ) {
    let insuranceApyData = getters.insuranceApyData;
    insuranceApyData[insuranceApyDataParams.name] = insuranceApyDataParams.data;

    commit("setInsuranceApyData", insuranceApyData);
  },

  async addInsuranceTvlData(
    { commit, dispatch, getters, rootState },
    insuranceTvlDataParams
  ) {
    let insuranceTvlData = getters.insuranceTvlData;
    insuranceTvlData[insuranceTvlDataParams.name] = insuranceTvlDataParams.data;

    commit("setInsuranceTvlData", insuranceTvlData);
  },

  async addUsdPlusApyData(
    { commit, dispatch, getters, rootState },
    usdPlusApyDataParams
  ) {
    let usdPlusApyData = getters.usdPlusApyData;
    usdPlusApyData[usdPlusApyDataParams.name] = usdPlusApyDataParams.data;

    commit("setUsdPlusApyData", usdPlusApyData);
  }
};

const mutations = {
  setInsuranceStrategyData(state, value) {
    state.insuranceStrategyData = value;
  },

  setInsuranceRedemptionData(state, value) {
    state.insuranceRedemptionData = value;
  },

  setInsuranceClientData(state, value) {
    state.insuranceClientData = value;
  },

  setInsuranceApyData(state, value) {
    state.insuranceApyData = value;
  },

  setInsuranceTvlData(state, value) {
    state.insuranceTvlData = value;
  },

  setUsdPlusApyData(state, value) {
    state.usdPlusApyData = value;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

import {axios} from "@/plugins/http-axios";
import moment from "moment";
import * as numberUtils from '@/utils/number-utils';

const state = {
    currentTotalData: null,
    stablecoinData: null,
    insuranceTotalData: null,
    insuranceAssetData: null,
    insuranceTotalSupplyData: null,

    payouts: [],

    payoutsApyData: {},

    payoutsApyDataDict: [],

    payoutsTvlData: {},
    totalUsdPlusValue: null,
    // totalUsdPlusProfit: null,
};

const getters = {

    currentTotalData(state) {
        return state.currentTotalData;
    },

    stablecoinData(state) {
        return state.stablecoinData;
    },

    insuranceTotalData(state) {
        return state.insuranceTotalData;
    },

    insuranceAssetData(state) {
        return state.insuranceAssetData;
    },

    insuranceTotalSupplyData(state) {
        return state.insuranceTotalSupplyData;
    },

    payouts(state) {
        return state.payouts;
    },

    payoutsApyData(state) {
        return state.payoutsApyData;
    },

    payoutsApyDataDict(state) {
        return state.payoutsApyDataDict;
    },

    payoutsTvlData(state) {
        return state.payoutsTvlData;
    },

    totalUsdPlusValue(state) {
        return state.totalUsdPlusValue;
    },

    // totalUsdPlusProfit(state) {
    //     return state.totalUsdPlusProfit;
    // },
};

const actions = {


    async refreshCurrentTotalData({commit, dispatch, getters, rootState}) {
        commit('statsUI/setLoadingCurrentTotalData', true, { root: true });

        let result = [];

        let appApiUrl = rootState.network.appApiUrl;
        let strategies = (await axios.get(appApiUrl + '/dapp/strategies')).data;
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

        for (let i = 0; i < strategies.length; i++) {
            let element = strategies[i];

            result.push(
                {
                    label: element.name,
                    fullName: element.fullName,
                    value: element.netAssetValue,
                    liquidationValue: element.liquidationValue,
                    color: colors[i],
                    link: (element.address || element.explorerAddress) ? (process.env.VUE_APP_DEBANK_EXPLORER + 'profile/' + (element.explorerAddress ? element.explorerAddress : element.address)) : ''
                }
            );
        }

        commit('setCurrentTotalData', result);
        commit('statsUI/setLoadingCurrentTotalData', false, { root: true });
    },

    async refreshStablecoinData({commit, dispatch, getters, rootState}) {
        let result = [];

        let appApiUrl = rootState.network.appApiUrl;
        let stablecoinList = (await axios.get(appApiUrl + '/dapp/collateral/total')).data;
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

        for (let i = 0; i < stablecoinList.length; i++) {
            let element = stablecoinList[i];

            try {
                result.push(
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

        commit('setStablecoinData', result);
    },
    async refreshInsuranceAssetData({commit, dispatch, getters, rootState}) {
        let result = [];

        try {
            let appApiUrl = rootState.network.polygonApi;
            let collateralsTotal = (await axios.get(appApiUrl + '/insurance/collateral/total')).data;
            console.log(collateralsTotal);

            collateralsTotal.sort((a,b) => b.netAssetValue * 1 - a.netAssetValue * 1);
            collateralsTotal = collateralsTotal.filter(el => el.netAssetValue > 0);

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

            let resAssets = new Map();

            for (let i = 0; i < collateralsTotal.length; i++) {
                let colleteral = collateralsTotal[i];
                let resAsset = resAssets.get(colleteral.id.tokenName);
                    if (resAsset) {
                        resAsset.value += Math.round(colleteral.netAssetValue * colleteral.percentage)  / 100;
                        resAssets.set(colleteral.id.tokenName, resAsset);
                        continue;
                    }
//
                resAssets.set(colleteral.id.tokenName,
                      {
                          label: colleteral.id.tokenName,
                          color: colors[i],
                          value: Math.round(colleteral.netAssetValue * colleteral.percentage)  / 100,
                          logo: require('@/assets/currencies/stablecoins/' + colleteral.id.tokenName + '.png')
                      })
            }

            console.log(resAssets)
            for (let value of resAssets.values()) {
                result.push(value);
            }

        } catch (e) {
            console.log("Error when load insurance assets", e)
        }

        commit('setInsuranceAssetData', result);
    },
    async refreshInsuranceTotalData({commit, dispatch, getters, rootState}) {
        let result = [];

        try {
            let appApiUrl = rootState.network.polygonApi;
            let collateralsTotal = (await axios.get(appApiUrl + '/insurance/collateral/total')).data;

            collateralsTotal.sort((a,b) => b.netAssetValue * 1 - a.netAssetValue * 1);
            collateralsTotal = collateralsTotal.filter(el => numberUtils._fromE6(el.netAssetValue) > 0);

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

            for (let i = 0; i < collateralsTotal.length; i++) {
                result.push({
                    label: collateralsTotal[i].id.strategyName,
                    link: collateralsTotal[i].strategyAddress,
                    color: colors[i],
                    value: collateralsTotal[i].netAssetValue,
                    liquidationValue: collateralsTotal[i].liquidationValue,
                    logo:  require('@/assets/currencies/stablecoins/' + collateralsTotal[i].id.tokenName + '.png')
                });
            }
        } catch(e) {
            console.log("Error Strategy Weights: ", e);
        }


        commit('setInsuranceTotalData', result);
    },
    async refreshStats({commit, dispatch, getters}){

        console.log('StatsData: refreshStats');

        dispatch('refreshPayouts');
        dispatch('refreshCurrentTotalData');
        // dispatch('refreshTotalUsdPlus');
        // dispatch('refreshTotalUsdPlusProfit');
        dispatch('refreshStablecoinData');
        dispatch('refreshInsuranceAssetData');
        dispatch('refreshInsuranceTotalData');
    },

    async refreshPayouts({commit, dispatch, getters, rootState}) {
        commit('statsUI/setLoadingPayouts', true, { root: true });

        let appApiUrl = rootState.network.appApiUrl;
        axios.get(appApiUrl + `/dapp/payouts`)
            .then(value => {
                commit('setPayouts', value.data);

                let clientData = value.data;

                let widgetDataDict = {};
                let widgetData = {
                    labels: [],
                    datasets: [
                        {
                            fill: false,
                            borderColor: '#69a5fd',
                            data: [],
                        }
                    ]
                };

                [...clientData].reverse().forEach(item => {
                    widgetDataDict[moment(item.payableDate).format('DD.MM.YYYY')] = parseFloat(item.annualizedYield ? item.annualizedYield : 0.0).toFixed(2);
                });

                commit('setPayoutsApyDataDict', widgetDataDict);

                for(let key in widgetDataDict) {
                    widgetData.labels.push(key);
                    widgetData.datasets[0].data.push(widgetDataDict[key]);
                }

                commit('setPayoutsApyData', widgetData);

                let widgetDataDictTvl = {};
                let widgetDataTvl = {
                    labels: [],
                    datasets: [
                        {
                            fill: false,
                            borderColor: '#69a5fd',
                            data: [],
                        }
                    ]
                };

                [...clientData].reverse().forEach(item => {
                    widgetDataDictTvl[moment(item.payableDate).format('DD.MM.YYYY')] = parseFloat(item.totalUsdc ? item.totalUsdc : 0.0).toFixed(2);
                });

                for(let key in widgetDataDictTvl) {
                    widgetDataTvl.labels.push(key);
                    widgetDataTvl.datasets[0].data.push(widgetDataDictTvl[key]);
                }

                commit('setPayoutsTvlData', widgetDataTvl);
                commit('statsUI/setLoadingPayouts', false, { root: true });

            })
    },

    // async refreshTotalUsdPlus({commit, dispatch, getters, rootState}) {
    //     commit('statsUI/setLoadingTotalUsdPlus', true, { root: true });
    //
    //     let appApiUrl = rootState.network.appApiUrl;
    //
    //     let usdPlusValue = (await axios.get(appApiUrl + '/dapp/getTotalUsdPlusValue')).data;
    //     commit('setTotalUsdPlusValue', usdPlusValue);
    //
    //     commit('statsUI/setLoadingTotalUsdPlus', false, { root: true });
    //
    // },

    // async refreshTotalUsdPlusProfit({commit, dispatch, getters, rootState}) {
    //     commit('statsUI/setLoadingTotalUsdPlus', true, { root: true });
    //
    //     let appApiUrl = rootState.network.appApiUrl;
    //
    //     let usdPlusProfit = (await axios.get(appApiUrl + '/dapp/getTotalUsdPlusProfit')).data;
    //     commit('setTotalUsdPlusProfit', usdPlusProfit);
    //
    //     commit('statsUI/setLoadingTotalUsdPlus', false, { root: true });
    //
    // },

};

const mutations = {

    setCurrentTotalData(state, currentTotalData) {
        state.currentTotalData = currentTotalData;
    },

    setStablecoinData(state, stablecoinData) {
        state.stablecoinData = stablecoinData;
    },

    setInsuranceTotalData(state, insuranceTotalData) {
        state.insuranceTotalData = insuranceTotalData;
    },

    setInsuranceAssetData(state, insuranceAssetData) {
        state.insuranceAssetData = insuranceAssetData;
    },

    setInsuranceTotalSupplyData(state, insuranceTotalSupplyData) {
        state.insuranceTotalSupplyData = insuranceTotalSupplyData;
    },

    setGasPrice(state, price) {
        state.gasPrice = price;
    },

    setPayouts(state, payouts) {
        state.payouts = payouts;
    },

    setPayoutsApyData(state, payoutsApyData) {
        state.payoutsApyData = payoutsApyData;
    },

    setPayoutsApyDataDict(state, payoutsApyDataDict) {
        state.payoutsApyDataDict = payoutsApyDataDict;
    },

    setPayoutsTvlData(state, payoutsTvlData) {
        state.payoutsTvlData = payoutsTvlData;
    },

    setTotalUsdPlusValue(state, totalUsdPlusValue) {
        state.totalUsdPlusValue = totalUsdPlusValue;
    },

    setTotalUsdPlusProfit(state, totalUsdPlusProfit) {
        state.totalUsdPlusProfit = totalUsdPlusProfit;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};


function getInsuranceColateralFromBackend() {
    return [

    ]
}

import {axios} from "@/plugins/http-axios";
import moment from "moment";

const state = {
    currentTotalData: null,
    stablecoinData: null,

    payouts: [],

    payoutsApyData: {},

    payoutsApyDataDict: [],

    payoutsTvlData: {},
    totalUsdPlusValue: null,
    totalUsdPlusProfit: null,
};

const getters = {

    currentTotalData(state) {
        return state.currentTotalData;
    },

    stablecoinData(state) {
        return state.stablecoinData;
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

    totalUsdPlusProfit(state) {
        return state.totalUsdPlusProfit;
    },
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
                    link: element.explorerAddress ? (process.env.VUE_APP_DEBANK_EXPLORER + 'profile/' + element.explorerAddress) : ''
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
            } catch (e) {
                console.error("Error while adding stablecoin to list: " + e);
            }
        }

        commit('setStablecoinData', result);
    },


    async refreshStats({commit, dispatch, getters}){

        console.debug('StatsData: refreshStats');

        dispatch('refreshPayouts');
        dispatch('refreshCurrentTotalData');
        dispatch('refreshTotalUsdPlus');
        dispatch('refreshTotalUsdPlusProfit');
        dispatch('refreshStablecoinData');
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

    async refreshTotalUsdPlus({commit, dispatch, getters, rootState}) {
        commit('statsUI/setLoadingTotalUsdPlus', true, { root: true });

        let appApiUrl = rootState.network.appApiUrl;

        let usdPlusValue = (await axios.get(appApiUrl + '/dapp/getTotalUsdPlusValue')).data;
        commit('setTotalUsdPlusValue', usdPlusValue);

        commit('statsUI/setLoadingTotalUsdPlus', false, { root: true });

    },

    async refreshTotalUsdPlusProfit({commit, dispatch, getters, rootState}) {
        commit('statsUI/setLoadingTotalUsdPlus', true, { root: true });

        let appApiUrl = rootState.network.appApiUrl;

        let usdPlusProfit = (await axios.get(appApiUrl + '/dapp/getTotalUsdPlusProfit')).data;
        commit('setTotalUsdPlusProfit', usdPlusProfit);

        commit('statsUI/setLoadingTotalUsdPlus', false, { root: true });

    },

};

const mutations = {

    setCurrentTotalData(state, currentTotalData) {
        state.currentTotalData = currentTotalData;
    },

    setStablecoinData(state, stablecoinData) {
        state.stablecoinData = stablecoinData;
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

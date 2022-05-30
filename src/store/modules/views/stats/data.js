import {axios} from "@/plugins/http-axios";
import moment from "moment";

const state = {
    currentTotalData: null,

    payouts: [],

    payoutsApyData: {},
    payoutsTvlData: {},
    totalUsdPlusValue: null,
};

const getters = {

    currentTotalData(state) {
        return state.currentTotalData;
    },

    payouts(state) {
        return state.payouts;
    },

    payoutsApyData(state) {
        return state.payoutsApyData;
    },

    payoutsTvlData(state) {
        return state.payoutsTvlData;
    },

    totalUsdPlusValue(state) {
        return state.totalUsdPlusValue;
    },

};

const actions = {


    async refreshCurrentTotalData({commit, dispatch, getters, rootState}) {
        commit('statsUI/setLoadingCurrentTotalData', true, { root: true });

        let result = [];

        let strategies = (await axios('/dapp/strategies')).data;
        strategies.sort((a,b) => b[4] - a[4]);

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
                    label: element[0],
                    fullName: element[1],
                    value: element[4],
                    liquidationValue: element[5],
                    color: colors[i],
                    link: element[3] ? 'https://polygonscan.com/address/' + element[3] : ''
                }
            );
        }

        commit('setCurrentTotalData', result);
        commit('statsUI/setLoadingCurrentTotalData', false, { root: true });
    },


    async refreshStats({commit, dispatch, getters}){

        console.log('StatsData: refreshStats');

        dispatch('refreshPayouts');
        dispatch('refreshCurrentTotalData');
        dispatch('refreshTotalUsdPlus');
    },

    async refreshPayouts({commit, dispatch, getters, rootState}) {
        commit('statsUI/setLoadingPayouts', true, { root: true });

        axios.get(`/dapp/payouts`)
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
                    widgetDataDict[moment(item.payableDate).format('DD.MM.YYYY')] = item.annualizedYield;
                });

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
                    widgetDataDictTvl[moment(item.payableDate).format('DD.MM.YYYY')] = item.totalUsdc;
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

        let usdPlusValue = (await axios('/dapp/getTotalUsdPlusValue')).data;
        commit('setTotalUsdPlusValue', usdPlusValue);

        commit('statsUI/setLoadingTotalUsdPlus', false, { root: true });

    },

};

const mutations = {

    setCurrentTotalData(state, currentTotalData) {
        state.currentTotalData = currentTotalData;
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

    setPayoutsTvlData(state, payoutsTvlData) {
        state.payoutsTvlData = payoutsTvlData;
    },

    setTotalUsdPlusValue(state, totalUsdPlusValue) {
        state.totalUsdPlusValue = totalUsdPlusValue;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

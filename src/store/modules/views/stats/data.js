import {axios} from "@/plugins/http-axios";
import moment from "moment";

const state = {

    totalUsdPlus: {
        totalMint: 0,
        totalBurn: 0,
        totalSupply: 0,
    },

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

    totalUsdPlus(state) {
        return state.totalUsdPlus;
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


        let assets = await rootState.web3.contracts.mark2market.methods.strategyAssets().call();
        let strategiesMapping = (await axios('/dapp/strategies')).data;

        let data = [];

        for (let i = 0; i < assets.length; i++) {
            let asset = assets[i];

            let element = {};

            let strategy = strategiesMapping.find(value => value.address === asset[0]);
            let name = "not defined";

            if (strategy) {
                name = strategy.name;
            }


            if (asset[1] == 0) {
                continue;
            }

            element.label = name;
            element.value = asset[1] / 10 ** 6;
            element.liquidationValue = asset[2] / 10 ** 6;
            element.link = asset[0] ? 'https://polygonscan.com/address/' + asset[0] : '';

            data.push(element);
        }

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

        data = data.sort((a,b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0));
        data = data.filter(item => item.value != 0);

        for (let i = 0; i < data.length; i++) {
            data[i].color = colors[i];
        }

        commit('setCurrentTotalData', data);
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
                    widgetDataDictTvl[moment(item.payableDate).format('DD.MM.YYYY')] = item.totalUsdPlus;
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


        let value = await rootState.web3.contracts.usdPlus.methods.totalSupply().call();
        let data = {
            totalSupply: value
        }
        commit('setTotalUsdPlus', data);

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

    setTotalUsdPlus(state, value) {
        state.totalUsdPlus = value;
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

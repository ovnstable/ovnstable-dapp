import {axios} from "@/plugins/http-axios";
import moment from "moment";

const state = {
    wmaticStrategyData: null,

    clientProfitDay: null,

    apyData: {},
    tvlData: {},
};

const getters = {

    wmaticStrategyData(state) {
        return state.wmaticStrategyData;
    },

    clientProfitDay(state) {
        return state.clientProfitDay;
    },

    apyData(state) {
        return state.apyData;
    },

    tvlData(state) {
        return state.tvlData;
    },
};

const actions = {

    async refreshMarket({commit, dispatch, getters, rootState}) {
        console.log('MarketData: refreshMarket');

        dispatch('refreshStrategyData');
        dispatch('refreshClientData', {root:true});
        dispatch('accountData/refreshBalance', null, {root:true});
    },

    async refreshStrategyData({commit, dispatch, getters, rootState}) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": process.env.VUE_APP_API
            }
        };

        let avgApy;
        let avgApyStrategyWeek;
        let wmaticStrategyData;

        await fetch(process.env.VUE_APP_API + '/widget/avg-apy-info/week', fetchOptions)
            .then(value => value.json())
            .then(value => {
                avgApy = value;
                avgApy.date = moment(avgApy.date).format("DD MMM. ‘YY");
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        await fetch(process.env.VUE_APP_API + '/hedge-strategies/0x4b5e0af6AE8Ef52c304CD55f546342ca0d3050bf/avg-apy-info/week', fetchOptions)
            .then(value => value.json())
            .then(value => {
                avgApyStrategyWeek = value;
                avgApyStrategyWeek.date = moment(avgApyStrategyWeek.date).format("DD MMM. ‘YY");
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        await fetch(process.env.VUE_APP_API + '/hedge-strategies/0x4b5e0af6AE8Ef52c304CD55f546342ca0d3050bf', fetchOptions)
            .then(value => value.json())
            .then(value => {
                wmaticStrategyData = value;
                wmaticStrategyData.apy = (avgApyStrategyWeek && avgApyStrategyWeek.value) ? (avgApyStrategyWeek.value) : wmaticStrategyData.apy;
                wmaticStrategyData.diffApy = (avgApy && avgApy.value) ? (wmaticStrategyData.apy - avgApy.value) : null;

                let clientData = wmaticStrategyData.timeData;

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

                commit('setApyData', widgetData);


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

                commit('setTvlData', widgetTvlData);
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        commit('setWmaticStrategyData', wmaticStrategyData);
    },

    async refreshClientData({commit, dispatch, getters, rootState}) {
        console.log('MarketData: refreshClientData');

        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": process.env.VUE_APP_API
            }
        };

        let account = rootState.accountData.account.toLowerCase();
        let profitDay;

        await fetch(process.env.VUE_APP_API + `/hedge-strategies/0x4b5e0af6AE8Ef52c304CD55f546342ca0d3050bf/account/${account}`, fetchOptions)
            .then(value => value.json())
            .then(value => {
                profitDay = value.profit;
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        commit('setClientProfitDay', profitDay);
    },
};

const mutations = {

    setWmaticStrategyData(state, wmaticStrategyData) {
        state.wmaticStrategyData = wmaticStrategyData;
    },

    setClientProfitDay(state, clientProfitDay) {
        state.clientProfitDay = clientProfitDay;
    },

    setApyData(state, apyData) {
        state.apyData = apyData;
    },

    setTvlData(state, tvlData) {
        state.tvlData = tvlData;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
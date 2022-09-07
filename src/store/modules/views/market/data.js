import moment from "moment";
import {axios} from "@/plugins/http-axios";

const state = {
    wmaticStrategyData: null,
    usdPlusWbnbStrategyData: null,
    busdWbnbStrategyData: null,

    clientProfitDayUsdPlusWmatic: null,
    clientProfitDayUsdPlusWbnb: null,
    clientProfitDayBusdWbnb: null,

    apyDataUsdPlusWmatic: {},
    tvlDataUsdPlusWmatic: {},

    apyDataUsdPlusWbnb: {},
    tvlDataUsdPlusWbnb: {},

    apyDataBusdWbnb: {},
    tvlDataBusdWbnb: {},

    apyDataUsdPlusPolygon: {},
    apyDataUsdPlusBinance: {},
};

const getters = {

    wmaticStrategyData(state) {
        return state.wmaticStrategyData;
    },

    usdPlusWbnbStrategyData(state) {
        return state.usdPlusWbnbStrategyData;
    },

    busdWbnbStrategyData(state) {
        return state.busdWbnbStrategyData;
    },

    clientProfitDayUsdPlusWmatic(state) {
        return state.clientProfitDayUsdPlusWmatic;
    },

    clientProfitDayUsdPlusWbnb(state) {
        return state.clientProfitDayUsdPlusWbnb;
    },

    clientProfitDayBusdWbnb(state) {
        return state.clientProfitDayBusdWbnb;
    },

    apyDataUsdPlusWmatic(state) {
        return state.apyDataUsdPlusWmatic;
    },

    tvlDataUsdPlusWmatic(state) {
        return state.tvlDataUsdPlusWmatic;
    },

    apyDataUsdPlusWbnb(state) {
        return state.apyDataUsdPlusWbnb;
    },

    tvlDataUsdPlusWbnb(state) {
        return state.tvlDataUsdPlusWbnb;
    },

    apyDataBusdWbnb(state) {
        return state.apyDataBusdWbnb;
    },

    tvlDataBusdWbnb(state) {
        return state.tvlDataBusdWbnb;
    },

    apyDataUsdPlusPolygon(state) {
        return state.apyDataUsdPlusPolygon;
    },

    apyDataUsdPlusBinance(state) {
        return state.apyDataUsdPlusBinance;
    },
};

const actions = {

    async refreshMarket({commit, dispatch, getters, rootState}) {
        console.log('MarketData: refreshMarket');

        dispatch('refreshStrategyData', {contractAddress: '0x4b5e0af6AE8Ef52c304CD55f546342ca0d3050bf', strategyName: 'usdPlusWmatic'});
        dispatch('refreshClientData', {contractAddress: '0x4b5e0af6AE8Ef52c304CD55f546342ca0d3050bf', strategyName: 'usdPlusWmatic'});

        dispatch('refreshStrategyData', {contractAddress: '0xbAAc6ED05b2fEb47ef04b63018A27d80cbeA10d1', strategyName: 'usdPlusWbnb'});
        dispatch('refreshClientData', {contractAddress: '0xbAAc6ED05b2fEb47ef04b63018A27d80cbeA10d1', strategyName: 'usdPlusWbnb'});

        dispatch('refreshStrategyData', {contractAddress: '0xc6eca7a3b863d720393DFc62494B6eaB22567D37', strategyName: 'busdWbnb'});
        dispatch('refreshClientData', {contractAddress: '0xc6eca7a3b863d720393DFc62494B6eaB22567D37', strategyName: 'busdWbnb'});

        dispatch('refreshUsdPlusPayoutsData', "polygon");
        dispatch('refreshUsdPlusPayoutsData', "bsc");

        dispatch('accountData/refreshBalance', null, {root:true});
        dispatch('supplyData/refreshSupply', null, {root:true});
    },

    async refreshStrategyData({commit, dispatch, getters, rootState}, refreshParams) {
        let appApiUrl;

        switch (refreshParams.strategyName) {
            case "usdPlusWmatic":
                appApiUrl = rootState.network.polygonApi;
                break;
            case "usdPlusWbnb":
            case "busdWbnb":
                appApiUrl = rootState.network.bscApi;
                break;
        }

        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": appApiUrl
            }
        };

        let avgApy;
        let avgApyStrategyWeek;
        let strategyData;

        await fetch(appApiUrl + '/widget/avg-apy-info/week', fetchOptions)
            .then(value => value.json())
            .then(value => {
                avgApy = value;
                avgApy.date = moment(avgApy.date).format("DD MMM. ‘YY");
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        await fetch(appApiUrl + '/hedge-strategies/' + refreshParams.contractAddress + '/avg-apy-info/week', fetchOptions)
            .then(value => value.json())
            .then(value => {
                avgApyStrategyWeek = value;

                avgApyStrategyWeek.date = moment(avgApyStrategyWeek.date).format("DD MMM. ‘YY");
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        await fetch(appApiUrl + '/hedge-strategies/' + refreshParams.contractAddress, fetchOptions)
            .then(value => value.json())
            .then(value => {
                strategyData = value;
                strategyData.apy = (avgApyStrategyWeek && avgApyStrategyWeek.value) ? (avgApyStrategyWeek.value) : strategyData.apy;
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

                switch (refreshParams.strategyName) {
                    case "usdPlusWmatic":
                        commit('setApyDataUsdPlusWmatic', widgetData);
                        break;
                    case "usdPlusWbnb":
                        commit('setApyDataUsdPlusWbnb', widgetData);
                        break;
                    case "busdWbnb":
                        commit('setApyDataBusdWbnb', widgetData);
                        break;
                }

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

                switch (refreshParams.strategyName) {
                    case "usdPlusWmatic":
                        commit('setTvlDataUsdPlusWmatic', widgetTvlData);
                        break;
                    case "usdPlusWbnb":
                        commit('setTvlDataUsdPlusWbnb', widgetTvlData);
                        break;
                    case "busdWbnb":
                        commit('setTvlDataBusdWbnb', widgetTvlData);
                        break;
                }
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        switch (refreshParams.strategyName) {
            case "usdPlusWmatic":
                commit('setWmaticStrategyData', strategyData);
                break;
            case "usdPlusWbnb":
                commit('setUsdPlusWbnbStrategyData', strategyData);
                break;
            case "busdWbnb":
                commit('setBusdWbnbStrategyData', strategyData);
                break;
        }
    },

    async refreshClientData({commit, dispatch, getters, rootState}, refreshParams) {
        console.log('MarketData: refreshClientData');

        let appApiUrl;

        switch (refreshParams.strategyName) {
            case "usdPlusWmatic":
                appApiUrl = rootState.network.polygonApi;
                break;
            case "usdPlusWbnb":
            case "busdWbnb":
                appApiUrl = rootState.network.bscApi;
                break;
        }

        if (!rootState.accountData.account){
            return;
        }

        let account = rootState.accountData.account.toLowerCase();
        let profitDay;

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

        switch (refreshParams.strategyName) {
            case "usdPlusWmatic":
                commit('setClientProfitDayUsdPlusWmatic', profitDay);
                break;
            case "usdPlusWbnb":
                commit('setClientProfitDayUsdPlusWbnb', profitDay);
                break;
            case "busdWbnb":
                commit('setClientProfitDayBusdWbnb', profitDay);
                break;
        }
    },

    async refreshUsdPlusPayoutsData({commit, dispatch, getters, rootState}, network) {
        console.log('MarketData: refreshUsdPlusPayoutsData');

        let appApiUrl;

        switch (network) {
            case "polygon":
                appApiUrl = rootState.network.polygonApi;
                break;
            case "bsc":
                appApiUrl = rootState.network.bscApi;
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

                switch (network) {
                    case "polygon":
                        commit('setApyDataUsdPlusPolygon', resultDataList);
                        break;
                    case "bsc":
                        commit('setApyDataUsdPlusBinance', resultDataList);
                        break;
                }
            })
    },
};

const mutations = {

    setWmaticStrategyData(state, wmaticStrategyData) {
        state.wmaticStrategyData = wmaticStrategyData;
    },

    setUsdPlusWbnbStrategyData(state, usdPlusWbnbStrategyData) {
        state.usdPlusWbnbStrategyData = usdPlusWbnbStrategyData;
    },

    setBusdWbnbStrategyData(state, busdWbnbStrategyData) {
        state.busdWbnbStrategyData = busdWbnbStrategyData;
    },

    setClientProfitDayUsdPlusWmatic(state, value) {
        state.clientProfitDayUsdPlusWmatic = value;
    },

    setClientProfitDayUsdPlusWbnb(state, value) {
        state.clientProfitDayUsdPlusWbnb = value;
    },

    setClientProfitDayBusdWbnb(state, value) {
        state.clientProfitDayBusdWbnb = value;
    },

    setApyDataUsdPlusWmatic(state, value) {
        state.apyDataUsdPlusWmatic = value;
    },

    setTvlDataUsdPlusWmatic(state, value) {
        state.tvlDataUsdPlusWmatic = value;
    },

    setApyDataUsdPlusWbnb(state, value) {
        state.apyDataUsdPlusWbnb = value;
    },

    setTvlDataUsdPlusWbnb(state, value) {
        state.tvlDataUsdPlusWbnb = value;
    },

    setApyDataBusdWbnb(state, value) {
        state.apyDataBusdWbnb = value;
    },

    setTvlDataBusdWbnb(state, value) {
        state.tvlDataBusdWbnb = value;
    },

    setApyDataUsdPlusPolygon(state, value) {
        state.apyDataUsdPlusPolygon = value;
    },

    setApyDataUsdPlusBinance(state, value) {
        state.apyDataUsdPlusBinance = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

import moment from "moment";
import {axios} from "@/plugins/http-axios";

const state = {
    etsStrategyData: {},
    etsClientData: {},
    etsApyData: {},
    etsTvlData: {},

    usdPlusApyData: {},
};

const getters = {

    etsStrategyData(state) {
        return state.etsStrategyData;
    },

    etsClientData(state) {
        return state.etsClientData;
    },

    etsApyData(state) {
        return state.etsApyData;
    },

    etsTvlData(state) {
        return state.etsTvlData;
    },

    usdPlusApyData(state) {
        return state.usdPlusApyData;
    },
};

const actions = {

    async refreshMarket({commit, dispatch, getters, rootState}) {
        console.debug('MarketData: refreshMarket');

        for (let ets of rootState.etsAction.etsList) {
            dispatch('refreshStrategyData', {contractAddress: ets.address, strategyName: ets.name, chain: ets.chain});
        }

        for (let ets of rootState.etsAction.etsList) {
            dispatch('refreshClientData', {contractAddress: ets.address, strategyName: ets.name, chain: ets.chain});
        }

        dispatch('refreshUsdPlusPayoutsData', "polygon");
        dispatch('refreshUsdPlusPayoutsData', "bsc");
        dispatch('refreshUsdPlusPayoutsData', "optimism");
        dispatch('refreshUsdPlusPayoutsData', "avax");

        dispatch('accountData/refreshBalance', null, {root:true});
        dispatch('supplyData/refreshSupply', null, {root:true});
    },

    async refreshStrategyData({commit, dispatch, getters, rootState}, refreshParams) {
        let appApiUrl;

        switch (refreshParams.chain) {
            case 137:
                appApiUrl = rootState.network.polygonApi;
                break;
            case 43114:
                appApiUrl = rootState.network.avaxApi;
                break;
            case 10:
                appApiUrl = rootState.network.opApi;
                break;
            case 56:
                appApiUrl = rootState.network.bscApi;
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
                strategyData = value;
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

                dispatch('addEtsApyData', { name: refreshParams.strategyName, data: widgetData});

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

                dispatch('addEtsTvlData', { name: refreshParams.strategyName, data: widgetTvlData});
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        dispatch('addEtsStrategyData', { name: refreshParams.strategyName, data: strategyData});
    },

    async refreshClientData({commit, dispatch, getters, rootState}, refreshParams) {
        console.debug('MarketData: refreshClientData');

        let appApiUrl;

        switch (refreshParams.chain) {
            case 137:
                appApiUrl = rootState.network.polygonApi;
                break;
            case 43114:
                appApiUrl = rootState.network.avaxApi;
                break;
            case 10:
                appApiUrl = rootState.network.opApi;
                break;
            case 56:
                appApiUrl = rootState.network.bscApi;
                break;
            default:
                appApiUrl = rootState.network.polygonApi;
                break;
        }

        if (!rootState.accountData.account){
            return;
        }

        let account = rootState.accountData.account.toLowerCase();
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

        dispatch('addEtsClientData', { name: refreshParams.strategyName, data: profitDay});
    },

    async refreshUsdPlusPayoutsData({commit, dispatch, getters, rootState}, network) {
        console.debug('MarketData: refreshUsdPlusPayoutsData');

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
            case "avax":
                appApiUrl = rootState.network.avaxApi;
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

                dispatch('addUsdPlusApyData', { name: network, data: resultDataList});
            })
    },

    async addEtsStrategyData({commit, dispatch, getters, rootState}, etsDataParams) {
        let etsData = getters.etsStrategyData;
        let data = etsDataParams.data;

        if (!data.tvl || data.tvl < 0.0001) {
            if (data.timeData && data.timeData.length > 0) {
                data.tvl = data.timeData[data.timeData.length - 1].tvl;
            }
        }

        etsData[etsDataParams.name] = data;

        commit('setEtsStrategyData', null);
        commit('setEtsStrategyData', etsData);
    },

    async addEtsClientData({commit, dispatch, getters, rootState}, etsClientDataParams) {
        let etsClientData = getters.etsClientData;
        etsClientData[etsClientDataParams.name] = etsClientDataParams.data;

        commit('setEtsClientData', etsClientData);
    },

    async addEtsApyData({commit, dispatch, getters, rootState}, etsApyDataParams) {
        let etsApyData = getters.etsApyData;
        etsApyData[etsApyDataParams.name] = etsApyDataParams.data;

        commit('setEtsApyData', etsApyData);
    },

    async addEtsTvlData({commit, dispatch, getters, rootState}, etsTvlDataParams) {
        let etsTvlData = getters.etsTvlData;
        etsTvlData[etsTvlDataParams.name] = etsTvlDataParams.data;

        commit('setEtsTvlData', etsTvlData);
    },

    async addUsdPlusApyData({commit, dispatch, getters, rootState}, usdPlusApyDataParams) {
        let usdPlusApyData = getters.usdPlusApyData;
        usdPlusApyData[usdPlusApyDataParams.name] = usdPlusApyDataParams.data;

        commit('setUsdPlusApyData', usdPlusApyData);
    },
};

const mutations = {

    setEtsStrategyData(state, value) {
        state.etsStrategyData = value;
    },

    setEtsClientData(state, value) {
        state.etsClientData = value;
    },

    setEtsApyData(state, value) {
        state.etsApyData = value;
    },

    setEtsTvlData(state, value) {
        state.etsTvlData = value;
    },

    setUsdPlusApyData(state, value) {
        state.usdPlusApyData = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

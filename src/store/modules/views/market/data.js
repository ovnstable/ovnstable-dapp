import moment from "moment";
import {axios} from "@/plugins/http-axios";

const state = {
    etsStrategyData: {},
    etsClientData: {},

    apyDataUsdPlusWmatic: {},
    tvlDataUsdPlusWmatic: {},

    apyDataWmaticUsdc: {},
    tvlDataWmaticUsdc: {},

    apyDataEtsMoonstone: {},
    tvlDataEtsMoonstone: {},

    apyDataUsdPlusWbnb: {},
    tvlDataUsdPlusWbnb: {},

    apyDataBusdWbnb: {},
    tvlDataBusdWbnb: {},

    apyDataEtsRuby: {},
    tvlDataEtsRuby: {},

    apyDataUsdPlusPolygon: {},
    apyDataUsdPlusBinance: {},
    apyDataUsdPlusOp: {},
};

const getters = {

    etsStrategyData(state) {
        return state.etsStrategyData;
    },

    etsClientData(state) {
        return state.etsClientData;
    },

    apyDataUsdPlusWmatic(state) {
        return state.apyDataUsdPlusWmatic;
    },

    tvlDataUsdPlusWmatic(state) {
        return state.tvlDataUsdPlusWmatic;
    },

    apyDataWmaticUsdc(state) {
        return state.apyDataWmaticUsdc;
    },

    tvlDataWmaticUsdc(state) {
        return state.tvlDataWmaticUsdc;
    },

    apyDataEtsMoonstone(state) {
        return state.apyDataEtsMoonstone;
    },

    tvlDataEtsMoonstone(state) {
        return state.tvlDataEtsMoonstone;
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

    apyDataEtsRuby(state) {
        return state.apyDataEtsRuby;
    },

    tvlDataEtsRuby(state) {
        return state.tvlDataEtsRuby;
    },

    apyDataUsdPlusPolygon(state) {
        return state.apyDataUsdPlusPolygon;
    },

    apyDataUsdPlusBinance(state) {
        return state.apyDataUsdPlusBinance;
    },

    apyDataUsdPlusOp(state) {
        return state.apyDataUsdPlusOp;
    },
};

const actions = {

    async refreshMarket({commit, dispatch, getters, rootState}) {
        console.debug('MarketData: refreshMarket');

        rootState.etsAction.etsList.forEach(ets => {
            dispatch('refreshStrategyData', {contractAddress: ets.address, strategyName: ets.name, chain: ets.chain});
            dispatch('refreshClientData', {contractAddress: ets.address, strategyName: ets.name, chain: ets.chain});
        });

        // dispatch('refreshClientData', {contractAddress: '0x719ee857Ae6cf85Cbe7284Bc45ad1f99dd5ff0dB', strategyName: 'etsMoonstone'});
        // dispatch('refreshClientData', {contractAddress: '0xA88F8c02eBdE678de623C6BCFC886De82e18ad00', strategyName: 'etsRuby'});
        // dispatch('refreshClientData', {contractAddress: '0x4b5e0af6AE8Ef52c304CD55f546342ca0d3050bf', strategyName: 'usdPlusWmatic'});
        // dispatch('refreshClientData', {contractAddress: '0xd52caB8AfC8ECd08b7CFa6D07e224a56F943e4c4', strategyName: 'wmaticUsdc'});
        // dispatch('refreshClientData', {contractAddress: '0xbAAc6ED05b2fEb47ef04b63018A27d80cbeA10d1', strategyName: 'usdPlusWbnb'});
        // dispatch('refreshClientData', {contractAddress: '0xc6eca7a3b863d720393DFc62494B6eaB22567D37', strategyName: 'busdWbnb'});

        dispatch('refreshUsdPlusPayoutsData', "polygon");
        dispatch('refreshUsdPlusPayoutsData', "bsc");
        dispatch('refreshUsdPlusPayoutsData', "op");

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
                    case "wmaticUsdc":
                        commit('setApyDataWmaticUsdc', widgetData);
                        break;
                    case "etsMoonstone":
                        commit('setApyDataEtsMoonstone', widgetData);
                        break;
                    case "usdPlusWbnb":
                        commit('setApyDataUsdPlusWbnb', widgetData);
                        break;
                    case "busdWbnb":
                        commit('setApyDataBusdWbnb', widgetData);
                        break;
                    case "etsRuby":
                        commit('setApyDataEtsRuby', widgetData);
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
                    case "wmaticUsdc":
                        commit('setTvlDataWmaticUsdc', widgetTvlData);
                        break;
                    case "etsMoonstone":
                        commit('setTvlDataEtsMoonstone', widgetTvlData);
                        break;
                    case "usdPlusWbnb":
                        commit('setTvlDataUsdPlusWbnb', widgetTvlData);
                        break;
                    case "busdWbnb":
                        commit('setTvlDataBusdWbnb', widgetTvlData);
                        break;
                    case "etsRuby":
                        commit('setTvlDataEtsRuby', widgetData);
                        break;
                }
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
            case "op":
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

                switch (network) {
                    case "polygon":
                        commit('setApyDataUsdPlusPolygon', resultDataList);
                        break;
                    case "bsc":
                        commit('setApyDataUsdPlusBinance', resultDataList);
                        break;
                    case "op":
                        commit('setApyDataUsdPlusOp', resultDataList);
                        break;
                }
            })
    },

    async addEtsStrategyData({commit, dispatch, getters, rootState}, etsDataParams) {
        console.debug('MarketData: addEtsStrategyData');

        let etsData = getters.etsStrategyData;
        etsData[etsDataParams.name] = etsDataParams.data;

        commit('setEtsStrategyData', etsData);
    },

    async addEtsClientData({commit, dispatch, getters, rootState}, etsClientDataParams) {
        console.debug('MarketData: addEtsClientData');

        let etsClientData = getters.etsClientData;
        etsClientData[etsClientDataParams.name] = etsClientDataParams.data;

        commit('setEtsClientData', etsClientData);
    },
};

const mutations = {

    setEtsStrategyData(state, value) {
        state.etsStrategyData = value;
    },

    setEtsClientData(state, value) {
        state.etsClientData = value;
    },

    setApyDataUsdPlusWmatic(state, value) {
        state.apyDataUsdPlusWmatic = value;
    },

    setTvlDataUsdPlusWmatic(state, value) {
        state.tvlDataUsdPlusWmatic = value;
    },

    setApyDataWmaticUsdc(state, value) {
        state.apyDataWmaticUsdc = value;
    },

    setTvlDataWmaticUsdc(state, value) {
        state.tvlDataWmaticUsdc = value;
    },

    setApyDataEtsMoonstone(state, value) {
        state.apyDataEtsMoonstone = value;
    },

    setTvlDataEtsMoonstone(state, value) {
        state.tvlDataEtsMoonstone = value;
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

    setApyDataEtsRuby(state, value) {
        state.apyDataEtsRuby = value;
    },

    setTvlDataEtsRuby(state, value) {
        state.tvlDataEtsRuby = value;
    },

    setApyDataUsdPlusPolygon(state, value) {
        state.apyDataUsdPlusPolygon = value;
    },

    setApyDataUsdPlusBinance(state, value) {
        state.apyDataUsdPlusBinance = value;
    },

    setApyDataUsdPlusOp(state, value) {
        state.apyDataUsdPlusOp = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

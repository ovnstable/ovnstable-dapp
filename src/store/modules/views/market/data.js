import moment from "moment";
import {axios} from "@/plugins/http-axios";

const state = {
    etsStrategyData: {},
    etsClientData: {},
    etsApyData: {},
    etsTvlData: {},
    compoundData: {},

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

    compoundData(state) {
        return state.compoundData;
    },

    usdPlusApyData(state) {
        return state.usdPlusApyData;
    },
};

const actions = {

    async refreshMarket({commit, dispatch, getters, rootState}) {
        console.log('MarketData: refreshMarket');

        dispatch('refreshStrategyData');
        dispatch('refreshClientData');
        dispatch('refreshUsdPlusPayoutsData');
        dispatch('accountData/refreshBalance', null, {root:true});
        dispatch('supplyData/refreshSupply', null, {root:true});
    },

    async refreshStrategyData({commit, dispatch, getters, rootState}) {
        await Promise.all(
            rootState.etsAction.etsList.map(async ets => {

                let refreshParams = {contractAddress: ets.address, strategyName: ets.name, chain: ets.chain};
                let appApiUrl;

                switch (refreshParams.chain) {
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
                        let clientPayoutData = strategyData.payoutItems;

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

                        let startValue = 1;
                        let accumulator = startValue;
                        let accumulatorDay = startValue;
                        let accumulatorWeek = startValue;
                        let accumulatorMonth = startValue;

                        let compoundData = {};

                        let clientDataPreferment = [...clientPayoutData];
                        let clientDataLengthCounter = clientDataPreferment.length;
                        for (let i = 0; i < clientDataPreferment.length; i++){
                            const payout = clientDataPreferment[i];
                            try {

                                // all
                                accumulator = accumulator * (1 + payout.dailyProfit);
                                payout.comp =  (accumulator * 100 / startValue - 100);
                                payout.comp =  parseFloat(payout.comp ? payout.comp : 0.00).toFixed(3);
                                widgetDataDict[moment(payout.payableDate).format('DD.MM.YYYY')] = payout.comp;

                                // date
                                if (i === 0) {
                                    compoundData.firstDate = moment(payout.payableDate).format('MMM D, YYYY');
                                }


                                // week
                                if (clientDataLengthCounter <= 7) {
                                    accumulatorWeek = accumulatorWeek * (1 + payout.dailyProfit);
                                }

                                // month
                                if (clientDataLengthCounter <= 30) {
                                    accumulatorMonth = accumulatorMonth * (1 + payout.dailyProfit);
                                }

                                // day
                                if (clientDataLengthCounter === 1) {
                                    // day
                                    accumulatorDay = accumulatorDay * (1 + payout.dailyProfit);
                                    let dayComp = (accumulatorDay * 100 / startValue - 100);

                                    compoundData.day = parseFloat(dayComp ? dayComp : 0.0).toFixed(3)


                                    // week
                                    let weekComp = (accumulatorWeek * 100 / startValue - 100);
                                    compoundData.week = parseFloat(weekComp ? weekComp : 0.0).toFixed(3)

                                    // month
                                    let monthComp = (accumulatorMonth * 100 / startValue - 100);
                                    compoundData.month = parseFloat(monthComp ? monthComp : 0.0).toFixed(3)

                                    compoundData.all = payout.comp // last payout comp

                                    dispatch('addCompoundData', { name: refreshParams.strategyName, data: compoundData});
                                }

                                clientDataLengthCounter--;
                            } catch (e) {
                                console.error("strategyData build Widget Data Dict insurance error:", e)
                            }
                        }

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
            })
        );
    },

    async refreshClientData({commit, dispatch, getters, rootState}) {
        console.log('MarketData: refreshClientData');

        await Promise.all(
            rootState.etsAction.etsList.map(async ets => {

                if (!rootState.accountData.account){
                    return;
                }

                let refreshParams = {contractAddress: ets.address, strategyName: ets.name, chain: ets.chain};
                let appApiUrl;

                switch (refreshParams.chain) {
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
                    case 324:
                        appApiUrl = rootState.network.zkApi;
                        break;
                    default:
                        appApiUrl = rootState.network.polygonApi;
                        break;
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
            })
        );
    },

    async refreshUsdPlusPayoutsData({commit, dispatch, getters, rootState}) {
        console.log('MarketData: refreshUsdPlusPayoutsData');

        await Promise.all(
            ['polygon', 'bsc', 'optimism', 'arbitrum', 'zksync'].map(async network => {

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
            })
        );
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

    async addCompoundData({commit, dispatch, getters, rootState}, compoundParams) {
        let compoundData = getters.compoundData;
        compoundData[compoundParams.name] = compoundParams.data;

        commit('setCompoundData', compoundData);
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

    setCompoundData(state, value) {
        state.compoundData = value;
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

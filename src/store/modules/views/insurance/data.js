import moment from "moment";
import {axios} from "@/plugins/http-axios";

const state = {
    insuranceStrategyData: {},
    insuranceClientData: {},
    insuranceApyData: {},
    insuranceTvlData: {},

    usdPlusApyData: {},
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

    usdPlusApyData(state) {
        return state.usdPlusApyData;
    },
};

const actions = {

    async refreshInsurance({commit, dispatch, getters, rootState}) {
        console.debug('InsuranceData: refreshInsurance');

        let insuranceChainList = [
            {
                chainName: 'polygon',
                chainId: 137
            }
        ];

        for (let insuranceChain of insuranceChainList) {
            dispatch('refreshStrategyData', {chain: insuranceChain});
        }

        for (let insuranceChain of insuranceChainList) {
            dispatch('refreshClientData', {chain: insuranceChain});
        }

        dispatch('refreshUsdPlusPayoutsData', "polygon");
        dispatch('refreshUsdPlusPayoutsData', "bsc");
        dispatch('refreshUsdPlusPayoutsData', "optimism");
        dispatch('refreshUsdPlusPayoutsData', "avax");

        dispatch('accountData/refreshBalance', null, {root:true});
        dispatch('supplyData/refreshInsuranceSupply', null, {root:true});
    },

    async refreshStrategyData({commit, dispatch, getters, rootState}, refreshParams) {
        let appApiUrl;

        switch (refreshParams.chain.chainId) {
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

        /* TODO: insurance add avg-apy-info */

        await fetch(appApiUrl + '/widget/avg-apy-info/month', fetchOptions)
            .then(value => value.json())
            .then(value => {
                avgApy = value;
                avgApy.date = moment(avgApy.date).format("DD MMM. ‘YY");
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        /*await fetch(appApiUrl + '/hedge-strategies/' + refreshParams.contractAddress + '/avg-apy-info/month', fetchOptions)
            .then(value => value.json())
            .then(value => {
                avgApyStrategyMonth = value;
                avgApyStrategyMonth.date = moment(avgApyStrategyMonth.date).format("DD MMM. ‘YY");
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })*/

        await fetch(appApiUrl + '/insurance/', fetchOptions)
            .then(value => value.json())
            .then(value => {
                strategyData = value;

                /* TODO: insurance add avg-apy-info */
                // strategyData.apy = strategyData.lastApy;

                strategyData.chainId = refreshParams.chain.chainId;

                strategyData.payouts.sort(
                    function(o1,o2){
                        return moment(o1.date).isBefore(moment(o2.date)) ? -1 : moment(o1.date).isAfter(moment(o2.date)) ? 1 : 0;
                    }
                );

                let clientData = strategyData.payouts;

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

                dispatch('addInsuranceApyData', { name: refreshParams.chain.chainName, data: widgetData});

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

                dispatch('addInsuranceTvlData', { name: refreshParams.chain.chainName, data: widgetTvlData});
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        dispatch('addInsuranceStrategyData', { name: refreshParams.chain.chainName, data: strategyData});
    },

    async refreshClientData({commit, dispatch, getters, rootState}, refreshParams) {
        let appApiUrl;

        switch (refreshParams.chain.chainId) {
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

        await fetch(appApiUrl + '/insurance/account/' + account, fetchOptions)
            .then(value => value.json())
            .then(value => {
                profitDay = value.profit;
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        dispatch('addInsuranceClientData', { name: refreshParams.chain.chainName, data: profitDay});
    },

    async refreshUsdPlusPayoutsData({commit, dispatch, getters, rootState}, network) {
        console.debug('InsuranceData: refreshUsdPlusPayoutsData');

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

    async addInsuranceStrategyData({commit, dispatch, getters, rootState}, insuranceDataParams) {
        let insuranceData = getters.insuranceStrategyData;
        let data = insuranceDataParams.data;

        if (!data.tvl || data.tvl < 0.0001) {
            if (data.payouts && data.payouts.length > 0) {
                data.tvl = data.payouts[data.payouts.length - 1].tvl;
            }
        }

        insuranceData[insuranceDataParams.name] = data;

        commit('setInsuranceStrategyData', null);
        commit('setInsuranceStrategyData', insuranceData);
    },

    async addInsuranceClientData({commit, dispatch, getters, rootState}, insuranceClientDataParams) {
        let insuranceClientData = getters.insuranceClientData;
        insuranceClientData[insuranceClientDataParams.name] = insuranceClientDataParams.data;

        commit('setInsuranceClientData', insuranceClientData);
    },

    async addInsuranceApyData({commit, dispatch, getters, rootState}, insuranceApyDataParams) {
        let insuranceApyData = getters.insuranceApyData;
        insuranceApyData[insuranceApyDataParams.name] = insuranceApyDataParams.data;

        commit('setInsuranceApyData', insuranceApyData);
    },

    async addInsuranceTvlData({commit, dispatch, getters, rootState}, insuranceTvlDataParams) {
        let insuranceTvlData = getters.insuranceTvlData;
        insuranceTvlData[insuranceTvlDataParams.name] = insuranceTvlDataParams.data;

        commit('setInsuranceTvlData', insuranceTvlData);
    },

    async addUsdPlusApyData({commit, dispatch, getters, rootState}, usdPlusApyDataParams) {
        let usdPlusApyData = getters.usdPlusApyData;
        usdPlusApyData[usdPlusApyDataParams.name] = usdPlusApyDataParams.data;

        commit('setUsdPlusApyData', usdPlusApyData);
    },
};

const mutations = {

    setInsuranceStrategyData(state, value) {
        state.InsuranceStrategyData = value;
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
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

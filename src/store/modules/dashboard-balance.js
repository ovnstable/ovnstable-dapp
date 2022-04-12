import {axios} from "@/plugins/http-axios";
import moment from "moment";

const state = {
    avgBalance: null,
    profitUsdPlus: null,
    apy: null,

    activities: [],

    portfolioValue: {
        labels: [],
        datasets: [
            {
                fill: false,
                borderColor: '#69a5fd',
                data: [],
            }
        ]
    },
};

const getters = {

    avgBalance(state) {
        return state.avgBalance;
    },

    profitUsdPlus(state) {
        return state.profitUsdPlus;
    },

    apy(state) {
        return state.apy;
    },

    activities(state) {
        return state.activities;
    },

    portfolioValue(state) {
        return state.portfolioValue;
    },
};

const actions = {

    async refreshClientDashboardData({commit, dispatch, getters, rootState}) {

        let account = rootState.web3.account.toLowerCase();

        let response = (await axios.get(`/dapp/clientBalanceChanges?address=${account}`)).data;

        let clientData = response.map(item => {
            return {
                transactionHash: item[1],
                date: item[2],
                type: item[3],
                openingBalance: item[4],
                balanceChange: item[5],
                closingBalance: item[6],
                dailyProfit: item[3] === 'PAYOUT' ? item[5] : null,
                fee: item[7],
                apy: item[8],
            }
        });

        commit('setActivities', clientData);


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
            widgetDataDict[moment(item.date).format('DD.MM.YYYY')] = item.closingBalance;
        });

        for(let key in widgetDataDict) {
            widgetData.labels.push(key);
            widgetData.datasets[0].data.push(widgetDataDict[key]);
        }

        commit('setPortfolioValue', widgetData);


        let avgApyList = clientData.map(item => item.apy ? item.apy : 0).filter(item => item !== 0);
        if (avgApyList && (avgApyList.length > 0)) {
            const sum = avgApyList.reduce((a, b) => a + b, 0);
            const avg = (sum / avgApyList.length) || 0;

            commit('setApy', avg);
        } else {
            commit('setApy', 0);
        }

        let avgBalanceList = widgetData.datasets[0].data.map(item => item ? item : 0).filter(item => item !== 0);
        if (avgBalanceList && (avgBalanceList.length > 0)) {
            const sum = avgBalanceList.reduce((a, b) => a + b, 0);
            const avg = (sum / avgBalanceList.length) || 0;

            commit('setAvgBalance', avg);
        } else {
            commit('setAvgBalance', 0);
        }

        let profitList = clientData.map(item => item.dailyProfit ? item.dailyProfit : 0).filter(item => item !== 0);
        if (profitList && (profitList.length > 0)) {
            const sum = profitList.reduce((a, b) => a + b, 0);

            commit('setProfitUsdPlus', sum);
        } else {
            commit('setProfitUsdPlus', 0);
        }
    },

    async sliceClientDashboardData({commit, dispatch, getters, rootState}, slice) {

        let clientData = getters.activities;
        clientData = slice ? clientData.slice(slice) : clientData;

        let avgApyList = clientData.map(item => item.apy ? item.apy : 0).filter(item => item !== 0);
        if (avgApyList && (avgApyList.length > 0)) {
            const sum = avgApyList.reduce((a, b) => a + b, 0);
            const avg = (sum / avgApyList.length) || 0;

            commit('setApy', avg);
        } else {
            commit('setApy', 0);
        }

        let profitList = clientData.map(item => item.dailyProfit ? item.dailyProfit : 0).filter(item => item !== 0);
        if (profitList && (profitList.length > 0)) {
            const sum = profitList.reduce((a, b) => a + b, 0);

            commit('setProfitUsdPlus', sum);
        } else {
            commit('setProfitUsdPlus', 0);
        }
    },
};

const mutations = {

    setAvgBalance(state, avgBalance) {
        state.avgBalance = avgBalance;
    },

    setProfitUsdPlus(state, profitUsdPlus) {
        state.profitUsdPlus = profitUsdPlus;
    },

    setApy(state, apy) {
        state.apy = apy;
    },

    setActivities(state, activities) {
        state.activities = activities;
    },

    setPortfolioValue(state, portfolioValue) {
        state.portfolioValue = portfolioValue;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

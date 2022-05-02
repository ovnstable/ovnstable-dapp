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

    slice: null,
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

    slice(state) {
        return state.slice;
    },
};

const actions = {

    async refreshClientDashboardData({commit, dispatch, getters, rootState}) {

        console.log("Updating client dashboard data");

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
                duration: item[9],
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

        let apyDataList = [...clientData].filter(value => value.type === 'PAYOUT');
        let days = apyDataList.length;

        apyDataList.forEach(value => {
            value.changePercent = value.balanceChange / value.openingBalance;
        })

        let productResult = 1.0;
        let durationSum = 0.0;

        for (let i = 0; i < days; i++) {
            productResult = productResult * (1.0 + apyDataList[i].changePercent);
            durationSum = durationSum + apyDataList[i].duration;
        }

        let apy = Math.pow(productResult, 365.0 / (durationSum / 24.0)) - 1.0;

        if (apy) {
            commit('setApy', apy * 100.0);
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

    async sliceClientDashboardData({commit, dispatch, getters, rootState}) {

        let clientData = getters.activities;
        clientData = getters.slice ? clientData.slice(getters.slice) : clientData;

        let apyDataList = [...clientData].filter(value => value.type === 'PAYOUT');
        let days = apyDataList.length;

        apyDataList.forEach(value => {
            value.changePercent = value.balanceChange / value.openingBalance;
        })

        let productResult = 1.0;
        let durationSum = 0.0;

        for (let i = 0; i < days; i++) {
            productResult = productResult * (1.0 + apyDataList[i].changePercent);
            durationSum = durationSum + apyDataList[i].duration;
        }

        let apy = Math.pow(productResult, 365.0 / (durationSum / 24.0)) - 1.0;

        if (apy) {
            commit('setApy', apy * 100.0);
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

    setSlice(state, slice) {
        state.slice = slice;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

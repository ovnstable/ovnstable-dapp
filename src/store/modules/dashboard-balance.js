const state = {

    /* TODO: replace mock data with real data */

    avgBalance: 32.00,
    profitUsdPlus: 2.54,
    apy: 12.38,

    activities: [
        {
            date: '12.02.2022',
            openingBalance: '100',
            deposit: '1',
            fees: '0.04',
            dailyProfit: '0.000504',
            closingBalance: '101.000504',
            apy: '8.19',
        },
        {
            date: '11.02.2022',
            openingBalance: '101',
            deposit: '-1',
            fees: '0',
            dailyProfit: '0',
            closingBalance: '100',
            apy: '7.6',
        },
    ],

    portfolioValue: [
        {
            date: '01.03',
            value: '5',
        },
        {
            date: '02.03',
            value: '5',
        },
        {
            date: '03.03',
            value: '7',
        },
        {
            date: '04.03',
            value: '30',
        },
        {
            date: '05.03',
            value: '40',
        },
        {
            date: '06.03',
            value: '50',
        },
        {
            date: '21:00',
            value: '45',
        },
        {
            date: '07.03',
            value: '51',
        },
        {
            date: '08.03',
            value: '80',
        },
        {
            date: '09.03',
            value: '70',
        },
        {
            date: '10.03',
            value: '50',
        },
    ],
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

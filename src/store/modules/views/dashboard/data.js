

const state = {
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
};

const mutations = {

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

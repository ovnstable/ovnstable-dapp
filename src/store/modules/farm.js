const state = {

    pools: [
        {
            title: 'USD+/wMatic',
            apy: 29.96,
            tvl: '10.000.000',
            promoUntilDate: '2022-06-05T23:59:59.000Z',
        },
        {
            title: 'USDC/USD+',
            apy: 29.96,
            tvl: '10.000.000',
            promoUntilDate: '2022-06-05T23:59:59.000Z',
        }
    ],

    showDeposit: false,
    showWithdraw: false,

    selectedPool: null,
};

const getters = {

    pools(state) {
        return state.pools;
    },

    selectedPool(state) {
        return state.selectedPool;
    },

    showDeposit(state) {
        return state.showDeposit;
    },

    showWithdraw(state) {
        return state.showWithdraw;
    },
};

const actions = {

    async showDepositModal({commit, dispatch, getters, rootState}) {
        commit('setShowDeposit', true);
    },

    async hideDepositModal({commit, dispatch, getters, rootState}) {
        commit('setShowDeposit', false);
    },

    async showWithdrawModal({commit, dispatch, getters, rootState}) {
        commit('setShowWithdraw', true);
    },

    async hideWithdrawModal({commit, dispatch, getters, rootState}) {
        commit('setShowWithdraw', false);
    },
};

const mutations = {

    setPools(state, pools) {
        state.pools = pools;
    },

    setShowDeposit(state, showDeposit) {
        state.showDeposit = showDeposit;
    },

    setShowWithdraw(state, showWithdraw) {
        state.showWithdraw = showWithdraw;
    },

    setSelectedPool(state, selectedPool) {
        state.selectedPool = selectedPool;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

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
    showClaim: false,

    selectedPool: null,

    /* TODO: edit mock data */
    farmTvl: 400000,
    totalRewards: 200000,
    totalRewardsLeft: 200000,
    startDate: '05.11.2022',
    estimatedDate: '06.11.2022',
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

    showClaim(state) {
        return state.showClaim;
    },

    farmTvl(state) {
        return state.farmTvl;
    },

    totalRewards(state) {
        return state.totalRewards;
    },

    totalRewardsLeft(state) {
        return state.totalRewardsLeft;
    },

    startDate(state) {
        return state.startDate;
    },

    estimatedDate(state) {
        return state.estimatedDate;
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

    async showClaimModal({commit, dispatch, getters, rootState}) {
        commit('setShowClaim', true);
    },

    async hideClaimModal({commit, dispatch, getters, rootState}) {
        commit('setShowClaim', false);
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

    setShowClaim(state, showClaim) {
        state.showClaim = showClaim;
    },

    setSelectedPool(state, selectedPool) {
        state.selectedPool = selectedPool;
    },

    setFarmTvl(state, farmTvl) {
        state.farmTvl = farmTvl;
    },

    setTotalRewards(state, totalRewards) {
        state.totalRewards = totalRewards;
    },

    setTotalRewardsLeft(state, totalRewardsLeft) {
        state.totalRewardsLeft = totalRewardsLeft;
    },

    setStartDate(state, startdDate) {
        state.startdDate = startdDate;
    },

    setEstimatedDate(state, estimatedDate) {
        state.estimatedDate = estimatedDate;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

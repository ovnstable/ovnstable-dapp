const state = {

    pools: null,

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


    async refreshFarm({commit, dispatch, getters, rootState}) {

        console.log('FarmData: refreshFarm');

        dispatch('loadPools');
    },

    async loadPools({commit, dispatch, getters, rootState}) {
        console.log('Farm: loadPools');

        let pools = [];

        let account = rootState.accountData.account;
        let poolQsUsdPlusWeth = rootState.web3.contracts.poolQsUsdPlusWeth;

        let pool = {};

        if (account) {
            pool.availableToClaim = await poolQsUsdPlusWeth.methods.earned(account).call();
            pool.lpTokensStaked = await poolQsUsdPlusWeth.methods.balanceOf(account).call();
            pool.paid = await poolQsUsdPlusWeth.methods.paid(account).call();
        } else {
            pool.availableToClaim = 0;
            pool.lpTokensTotal = 0;
            pool.paid = 0;
        }

        pool.lpTokensTotal = await poolQsUsdPlusWeth.methods.totalSupply().call();
        pool.title = "USD+/WETH";
        pool.tvl = 0;
        pool.apy = 0;
        pool.fee = 0;
        pool.yourPoolShare = 0;
        pool.link = "https://info.quickswap.exchange/#/pair/0x901Debb34469e89FeCA591f5E5336984151fEc39";
        pool.balance = 0;
        pool.rewards = 0;
        pool.promoUntilDate = await poolQsUsdPlusWeth.methods.periodFinish().call();

        pool.contract = poolQsUsdPlusWeth;
        pool.token = rootState.web3.contracts.poolQsUsdPlusWethToken;

        pools.push(pool);
        commit('setPools', pools);
    }
};

const mutations = {

    setPools(state, pools) {
        state.pools = pools;
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

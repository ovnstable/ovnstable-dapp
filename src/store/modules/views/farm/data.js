const state = {

    pools: null,

    selectedPool: null,

    /* TODO: calculate tvl sum of all pools in $ */
    farmTvl: 400000,

    /* TODO: $100k for each pool */
    totalRewards: 200000,

    /* TODO: decrease for each participant */
    totalRewardsLeft: 200000,

    startDate: '05.16.2022',
    estimatedDate: '06.16.2022',
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
        let pool = rootState.web3.contracts.poolQsUsdPlusWeth;
        let token = rootState.web3.contracts.poolQsUsdPlusWethToken;
        let pair = rootState.web3.contracts.poolQsUsdPlusWethPair;

        let item = {};

        let userData = {};
        let poolData = {};

        let utils = rootState.web3.web3.utils;


        poolData.lpTokensTotal = utils.fromWei(await pool.methods.totalSupply().call());

        if (account) {
            userData.availableToClaim = utils.fromWei(await pool.methods.earned(account).call());
            userData.lpTokensStaked = utils.fromWei(await pool.methods.balanceOf(account).call());
            userData.paid =  utils.fromWei(await pool.methods.paid(account).call());
            userData.yourPoolShare = 0;
            userData.lpTokensBalance =  utils.fromWei(await token.methods.balanceOf(account).call())

        } else {
            userData.availableToClaim = 0;
            userData.lpTokensStaked = 0;
            userData.paid = 0;
            userData.yourPoolShare = 0;
        }

        poolData.title = "USD+/WETH";
        poolData.token0Icon = require('@/assets/currencies/usdPlus.svg');
        poolData.token1Icon = require('@/assets/currencies/eth.svg');
        poolData.tvl = 0;
        poolData.apy = 0;
        poolData.fee = 0;
        poolData.yourPoolShare = 0;
        poolData.link = "https://info.quickswap.exchange/#/pair/0x901Debb34469e89FeCA591f5E5336984151fEc39";
        poolData.balance = 0;
        poolData.rewards = 0;
        poolData.promoUntilDate = await pool.methods.periodFinish().call();

        item.contract = pool;
        item.token = token;

        item.userData = userData;
        item.poolData = poolData;

        // console.log('userData: ' + JSON.stringify(item.userData));
        // console.log('poolData: ' + JSON.stringify(item.poolData));

        pools.push(item);
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

import {axios} from "@/plugins/http-axios";

const state = {

    pools: null,
    poolList: null,

    selectedPool: null,

    /* TODO: calculate tvl sum of all pools in $ */
    farmTvl: null,

    /* TODO: $100k for each pool */
    totalRewards: null,

    /* TODO: decrease for each participant */
    totalRewardsLeft: null,

    startDate: '05.16.2022',
    estimatedDate: '06.16.2022',
};

const getters = {

    pools(state) {
        return state.pools;
    },

    poolList(state) {
        return state.poolList;
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

        /* TODO: add loading poolList */

        dispatch('loadPoolList');
        dispatch('loadPools');
    },


    async loadPoolList({commit, dispatch, getters, rootState}) {
        console.log('Farm: loadPoolList');

        let poolList = [];

        let networkId = rootState.network.networkId;
        let appApiUrl = rootState.network.appApiUrl;

        if (networkId === 137) {

            let pools = (await axios.get(appApiUrl + '/pools?tvl=2000')).data;
            pools.sort((a,b) => b.tvl - a.tvl);

            pools.forEach(item => {

                let token0Icon;
                let token1Icon;

                let tokenNames = item.id.name.split('/');

                try {
                    token0Icon = require('@/assets/currencies/farm/' + tokenNames[0] + '.svg');
                } catch (e) {
                    console.error("Error while getting coin icon")
                    token0Icon = require('@/assets/currencies/undefined.svg');
                }

                try {
                    token1Icon = require('@/assets/currencies/farm/' + tokenNames[1] + '.svg');
                } catch (e) {
                    console.error("Error while getting coin icon")
                    token1Icon = require('@/assets/currencies/undefined.svg');
                }

                poolList.push(
                    {
                        chainIcon: require('@/assets/network/polygon.svg'),
                        platform: item.platform,
                        name: item.id.name,
                        link: item.id.address,
                        tvl: item.tvl,
                        token0Icon: token0Icon,
                        token1Icon: token1Icon,
                    }
                )
            });
        }

        commit('setPoolList', poolList);
    },


    async loadPools({commit, dispatch, getters, rootState}) {
        console.log('Farm: loadPools');

        let pools = [];

        pools.push(await loadUsdPlusWethPool(rootState));
        pools.push(await loadUsdPlusWmaticPool(rootState));

        let totalRewardsLeft = 0;
        let totalRewards=0;
        let farmTvl = 0;
        pools.forEach(value => {

            totalRewards += 50000;
            farmTvl +=value.poolData.tvl;
            totalRewardsLeft += Number.parseFloat(value.poolData.rewardsLeft);
        })

        commit('setFarmTvl', farmTvl);
        commit('setTotalRewardsLeft', totalRewardsLeft.toString());
        commit('setTotalRewards', totalRewards);

        commit('setPools', pools);
    }
};

const mutations = {

    setPools(state, pools) {
        state.pools = pools;
    },

    setPoolList(state, poolList) {
        state.poolList = poolList;
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


async function loadUsdPlusWethPool(rootState){

    let account = rootState.accountData.account;
    let pool = rootState.web3.contracts.poolQsUsdPlusWeth;
    let token = rootState.web3.contracts.poolQsUsdPlusWethToken;
    let pair = rootState.web3.contracts.poolQsUsdPlusWethPair;
    let preOvn = rootState.web3.contracts.preOvn;

    let item = {};

    let userData = {};
    let poolData = {};

    let utils = rootState.web3.web3.utils;

    let appApiUrl = rootState.network.appApiUrl;
    let info =  (await axios.get(appApiUrl + '/reward-programs/' + pair.options.address)).data;

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
        userData.lpTokensBalance = 0;
    }



    let apy = info.apy
        .map(value=> value.value)
        .reduce((val1, val2)=> { return val1 + val2 },0);

    poolData.title = "USD+/WETH";
    poolData.token0Icon = require('@/assets/currencies/usdPlus.svg');
    poolData.token1Icon = require('@/assets/currencies/eth.svg');
    poolData.tvl = info.tvl;
    poolData.apyTotal = apy;
    poolData.apyList = info.apy;
    poolData.fee = 0;
    poolData.yourPoolShare = 0;
    poolData.link = "https://info.quickswap.exchange/#/pair/0x901Debb34469e89FeCA591f5E5336984151fEc39";
    poolData.balance = 0;
    poolData.rewards = 0;
    poolData.rewardsLeft = utils.fromWei(await preOvn.methods.balanceOf(pool.options.address).call());
    poolData.promoUntilDate = await pool.methods.periodFinish().call();

    item.contract = pool;
    item.token = token;

    item.userData = userData;
    item.poolData = poolData;

    // console.log('userData: ' + JSON.stringify(item.userData));
    // console.log('poolData: ' + JSON.stringify(item.poolData));

    return item;
}

async function loadUsdPlusWmaticPool(rootState){

    let account = rootState.accountData.account;
    let pool = rootState.web3.contracts.poolQsUsdPlusWmatic;
    let token = rootState.web3.contracts.poolQsUsdPlusWmaticToken;
    let pair = rootState.web3.contracts.poolQsUsdPlusWmaticPair;
    let preOvn = rootState.web3.contracts.preOvn;

    let item = {};

    let userData = {};
    let poolData = {};

    let utils = rootState.web3.web3.utils;

    let appApiUrl = rootState.network.appApiUrl;
    let info =  (await axios.get(appApiUrl + '/reward-programs/' + pair.options.address)).data;

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

    let apy = info.apy
        .map(value=> value.value)
        .reduce((val1, val2)=> { return val1 + val2 },0);


    poolData.title = "USD+/WMATIC";
    poolData.token0Icon = require('@/assets/currencies/usdPlus.svg');
    poolData.token1Icon = require('@/assets/currencies/pol.svg');
    poolData.tvl = info.tvl;
    poolData.apyTotal = apy;
    poolData.apyList = info.apy;
    poolData.fee = 0;
    poolData.yourPoolShare = 0;
    poolData.link = "https://info.quickswap.exchange/#/pair/" + pair.options.address;
    poolData.balance = 0;
    poolData.rewards = 0;
    poolData.rewardsLeft = utils.fromWei(await preOvn.methods.balanceOf(pool.options.address).call());
    poolData.promoUntilDate = await pool.methods.periodFinish().call();

    item.contract = pool;
    item.token = token;

    item.userData = userData;
    item.poolData = poolData;

    // console.log('userData: ' + JSON.stringify(item.userData));
    // console.log('poolData: ' + JSON.stringify(item.poolData));

    return item;
}

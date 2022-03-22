const state = {

    pools: [
        {
            title: 'USD+/USDC/USDT/DAI',
            apy: 29.96,
            tvl: '10.000.000',
        },
        {
            title: 'Pool 2',
        },
        {
            title: 'Pool 3',
        },
    ],
};

const getters = {

    pools(state) {
        return state.pools;
    },
};

const actions = {

};

const mutations = {

    setPools(state, pools) {
        state.pools = pools;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

const state = {

    totalSupply: {
        usdPlusWmatic: 0,
        usdPlusWbnb: 0,
        busdWbnb: 0,
    },

    maxUsdPlusWmaticSupply: 275000.00,
    maxUsdPlusWbnbSupply: 500000.00,
    maxBusdWbnbSupply: 500000.00,
};

const getters = {

    totalSupply(state) {
        return state.totalSupply;
    },

    maxUsdPlusWmaticSupply(state) {
        return state.maxUsdPlusWmaticSupply;
    },

    maxUsdPlusWbnbSupply(state) {
        return state.maxUsdPlusWbnbSupply;
    },

    maxBusdWbnbSupply(state) {
        return state.maxBusdWbnbSupply;
    },
};

const actions = {

    async resetSupply({commit, dispatch, getters}) {

        console.debug('Supply: resetSupply');

        commit('setTotalSupply', {
            usdPlusWmatic: 0,
            usdPlusWbnb: 0,
            busdWbnb: 0,
        });

    },

    async refreshSupply({commit, dispatch, getters, rootState}) {

        console.debug('Supply: refreshSupply');

        let web3 = rootState.web3;
        let usdPlusWmatic;
        let usdPlusWbnb;
        let busdWbnb;

        try {
            usdPlusWmatic = await web3.contracts.usdPlusWmatic.methods.totalSupply().call();
        } catch (e) {
            usdPlusWmatic = null;
        }

        try {
            usdPlusWbnb = await web3.contracts.usdPlusWbnb.methods.totalSupply().call();
        } catch (e) {
            usdPlusWbnb = null;
        }

        try {
            busdWbnb = await web3.contracts.busdWbnb.methods.totalSupply().call();
        } catch (e) {
            busdWbnb = null;
        }


        try {
            if (usdPlusWmatic) {
                usdPlusWmatic = web3.web3.utils.fromWei(usdPlusWmatic, 'mwei');
            } else {
                usdPlusWmatic = rootState.marketData.wmaticStrategyData.tvl;
            }
        } catch (e) {
        }

        try {
            if (usdPlusWbnb) {
                usdPlusWbnb = web3.web3.utils.fromWei(usdPlusWbnb, 'mwei');
            } else {
                usdPlusWbnb = rootState.marketData.usdPlusWbnbStrategyData.tvl;
            }
        } catch (e) {
        }

        try {
            if (busdWbnb) {
                busdWbnb = web3.web3.utils.fromWei(busdWbnb, 'mwei');
            } else {
                busdWbnb = rootState.marketData.busdWbnbStrategyData.tvl;
            }
        } catch (e) {
        }

        commit('setTotalSupply', {
            usdPlusWmatic: usdPlusWmatic,
            usdPlusWbnb: usdPlusWbnb,
            busdWbnb: busdWbnb,
        })
    },
};

const mutations = {

    setTotalSupply(state, totalSupply) {
        state.totalSupply = totalSupply;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

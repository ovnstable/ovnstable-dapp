const state = {
    etsNames: ['wbnb_busd', 'wmatic_usd_plus', 'ruby', 'night_ov_ar', 'qs_alpha_wmatic_usdc', 'qs_beta_wmatic_usdc', 'qs_gamma_weth_usdc', 'qs_delta_weth_usdc'],
    etsList: null,
};

const getters = {

    etsNames(state) {
        return state.etsNames;
    },

    etsList(state) {
        return state.etsList;
    },
};

const actions = {
    async initEtsList({commit, dispatch, getters, rootState}) {

        let list = [];

        for (let i = 0; i < getters.etsNames.length; i++) {
            let ets = require('@/json/ets/' + getters.etsNames[i] + '.json');

            // May add some fields

            list.push(ets);
        }

        await commit('setEtsList', list);
    },
};

const mutations = {

    setEtsList(state, value) {
        state.etsList = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

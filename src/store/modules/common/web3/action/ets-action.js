const state = {
    etsNames: ['wbnb_usd_plus', 'wbnb_busd', 'wmatic_usd_plus', 'garnet', 'wmatic_usdc', 'ruby'],
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

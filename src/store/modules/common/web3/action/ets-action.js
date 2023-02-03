import loadJSON from '@/utils/http-utils.js'

const state = {
    etsNetworkUrl: [
        'https://api.overnight.fi/optimism/usd+/design_ets/list',
        'https://api.overnight.fi/polygon/usd+/design_ets/list',
        'https://api.overnight.fi/bsc/usd+/design_ets/list'
    ],
    etsList: null,
};

const getters = {

    etsNames(state) {
        return state.etsNames;
    },

    etsNetworkUrl(state) {
        return state.etsNetworkUrl;
    },

    etsList(state) {
        return state.etsList;
    },
};

const actions = {
    async initEtsList({commit, dispatch, getters, rootState}) {

        let list = [];

        for (let i = 0; i < getters.etsNetworkUrl.length; i++) {
            let etses = await loadJSON(getters.etsNetworkUrl[i]);
            // May add some fields
            list.push(...etses);
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

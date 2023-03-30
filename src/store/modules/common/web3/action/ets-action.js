import loadJSON from '@/utils/http-utils.js'

const state = {
    etsNetworkNames: [
        'optimism',
        'arbitrum',
        // 'zksync',
        'polygon',
        'bsc'
    ],
    etsList: null,
};

const getters = {

    etsNetworkNames(state) {
        return state.etsNetworkNames;
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

        for (let i = 0; i < getters.etsNetworkNames.length; i++) {
            let etses = await loadJSON(`https://api.overnight.fi/${getters.etsNetworkNames[i]}/usd+/design_ets/list`);
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

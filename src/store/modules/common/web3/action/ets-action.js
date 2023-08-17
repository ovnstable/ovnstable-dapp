import loadJSON from '@/utils/http-utils.js'

const ROOT_API = 'https://api.overnight.fi/root'

const state = {
    etsNetworkNames: [
        'optimism',
        'arbitrum',
        // 'zksync',
        'polygon',
        'bsc',
        // 'base',
        // 'linea'
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

        let etsesFullData = await loadJSON(`${ROOT_API}/product/ets/all`);
        // let etsesFullData = await loadJSON(`http://localhost:9999/api/product/ets/all`);
        for (let i = 0; i < etsesFullData.length; i++) {
            let ets = etsesFullData[i].data
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

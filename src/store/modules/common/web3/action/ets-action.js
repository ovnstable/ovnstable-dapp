const state = {
    etsNames: ['wbnb_usd_plus', 'wbnb_busd', 'wmatic_usd_plus', 'garnet', 'wmatic_usdc', 'moonstone', 'ruby'],
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

        getters.etsNames.forEach(value => {
            list.push(require('@/json/ets/' + value + '.json'));
        })

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

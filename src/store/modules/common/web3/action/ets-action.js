const state = {
    etsNames: ['moonstone', 'ruby'],
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
        dispatch('marketData/refreshMarket', null, {root: true});
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

const state = {
    showFarm: true,
};

const getters = {

    showFarm(state) {
        return state.showFarm;
    },
};

const actions = {
    async hidePage({commit, dispatch, getters, rootState}) {
        commit('setShowFarm', false);
    },

    async showPage({commit, dispatch, getters, rootState}) {
        commit('setShowFarm', true);
    },
};

const mutations = {

    setShowFarm(state, showFarm) {
        state.showFarm = showFarm;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

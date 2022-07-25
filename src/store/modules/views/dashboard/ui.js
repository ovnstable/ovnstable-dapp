const state = {

    showDashboard: true,
};

const getters = {

    showDashboard(state) {
        return state.showDashboard;
    },
};

const actions = {

    async hidePage({commit, dispatch, getters, rootState}) {
        commit('setShowDashboard', false);
    },
};

const mutations = {

    setShowDashboard(state, showDashboard) {
        state.showDashboard = showDashboard;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

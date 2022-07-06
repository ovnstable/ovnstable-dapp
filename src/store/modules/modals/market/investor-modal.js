const state = {
    show: false,
};

const getters = {

    show(state) {
        return state.show;
    },
};

const actions = {

    showInvestorModal({commit, dispatch, getters}, errorType) {
        commit('setShow', true);
    },

    closeInvestorModal({commit, dispatch, getters}) {
        commit('setShow', false);
    },

};

const mutations = {

    setShow(state, show) {
        state.show = show;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

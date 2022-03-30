const state = {

    show: true,
};

const getters = {

    show(state) {
        return state.show;
    },
};

const actions = {

    async showAirdropDialog({commit, dispatch, getters, rootState}) {
        commit('setShow', true);
    },

    async hideAirdropDialog({commit, dispatch, getters, rootState}) {
        commit('setShow', false);
    },

};

const mutations = {

    setShow(state, value) {
        state.show = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

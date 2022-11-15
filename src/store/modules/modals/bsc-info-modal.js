const state = {
    show: true,
};

const getters = {

    show(state) {
        return state.show;
    },
};

const actions = {

    showBscInfoModal({commit, dispatch, getters}, errorType) {
        commit('setShow', true);
    },

    closeBscInfoModal({commit, dispatch, getters}) {
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

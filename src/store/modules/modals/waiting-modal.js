const state = {
    show: false,
    modalText: null,
};

const getters = {

    show(state) {
        return state.show;
    },

    modalText(state) {
        return state.modalText;
    },
};

const actions = {

    showWaitingModal({commit, dispatch, getters}, text) {
        commit('setShow', true);
        commit('setModalText', text);
    },

    closeWaitingModal({commit, dispatch, getters}) {
        commit('setShow', false);
        commit('setModalText', null);
    },

};

const mutations = {

    setShow(state, show) {
        state.show = show;
    },

    setModalText(state, modalText) {
        state.modalText = modalText;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

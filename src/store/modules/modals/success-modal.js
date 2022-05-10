const state = {
    show: false,
    successTxHash: null,
};

const getters = {

    show(state) {
        return state.show;
    },

    successTxHash(state) {
        return state.successTxHash;
    },
};

const actions = {

    showSuccessModal({commit, dispatch, getters}, successTxHash) {
        commit('setShow', true);
        commit('setSuccessTxHash', successTxHash);
    },

    closeSuccessModal({commit, dispatch, getters}) {
        commit('setShow', false);
        commit('setSuccessTxHash', null);
    },

};

const mutations = {

    setShow(state, show) {
        state.show = show;
    },

    setSuccessTxHash(state, successTxHash) {
        state.successTxHash = successTxHash;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

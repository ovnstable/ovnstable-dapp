const state = {
    show: false,
    successTxHash: null,

    promo: false,
};

const getters = {

    show(state) {
        return state.show;
    },

    promo(state) {
        return state.promo;
    },

    successTxHash(state) {
        return state.successTxHash;
    },
};

const actions = {

    showSuccessModalWithPromo({commit, dispatch, getters}, successTxHash) {
        commit('setShow', true);
        commit('setPromo', true);
        commit('setSuccessTxHash', successTxHash);
    },

    showSuccessModal({commit, dispatch, getters}, successTxHash) {
        commit('setShow', true);
        commit('setPromo', false);
        commit('setSuccessTxHash', successTxHash);
    },

    closeSuccessModal({commit, dispatch, getters}) {
        commit('setShow', false);
        commit('setPromo', false);
        commit('setSuccessTxHash', null);
    },

};

const mutations = {

    setShow(state, show) {
        state.show = show;
    },

    setPromo(state, promo) {
        state.promo = promo;
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

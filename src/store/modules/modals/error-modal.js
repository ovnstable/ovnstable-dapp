const state = {
    /* TODO: add code running, protocolDisabled, high gas price, user discard transaction errors */

    show: false,

    /* buyUSD+, buyAsset, estimateGas, approve */
    errorType: null,
};

const getters = {

    show(state) {
        return state.show;
    },

    errorType(state) {
        return state.errorType;
    },
};

const actions = {

    showErrorModal({commit, dispatch, getters}, errorType) {
        commit('setShow', true);
        commit('setErrorType', errorType);
    },

    closeErrorModal({commit, dispatch, getters}) {
        commit('setShow', false);
        commit('setErrorType', null);
    },

};

const mutations = {

    setShow(state, show) {
        state.show = show;
    },

    setErrorType(state, errorType) {
        state.errorType = errorType;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

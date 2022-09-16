const state = {
    /* TODO: add code running, protocolDisabled, high gas price, user discard transaction errors */

    show: false,

    /* buyUSD+, buyAsset, estimateGas, approve */
    errorType: null,

    errorMsg: null,
};

const getters = {

    show(state) {
        return state.show;
    },

    errorType(state) {
        return state.errorType;
    },

    errorMsg(state) {
        return state.errorMsg;
    },
};

const actions = {

    showErrorModal({commit, dispatch, getters}, errorType) {
        commit('setErrorType', errorType);
        commit('setErrorMsg', null);
        commit('setShow', true);
    },

    showErrorModalWithMsg({commit, dispatch, getters}, errorProperties) {
        commit('setErrorType', errorProperties.errorType);
        commit('setErrorMsg', errorProperties.errorMsg);
        commit('setShow', true);
    },

    closeErrorModal({commit, dispatch, getters}) {
        commit('setErrorType', null);
        commit('setErrorMsg', null);
        commit('setShow', false);
    },

};

const mutations = {

    setShow(state, show) {
        state.show = show;
    },

    setErrorType(state, errorType) {
        state.errorType = errorType;
    },

    setErrorMsg(state, value) {
        state.errorMsg = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

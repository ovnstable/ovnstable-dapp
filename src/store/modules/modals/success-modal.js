const state = {
    show: false,
    successTxHash: null,

    //mintUsdPlus, redeemUsdPlus, mintDaiPlus, redeemDaiPlus, wrapUsdPlus, unwrapUsdPlus, mintEts, redeemEts
    successAction: 'mint',
    etsData: null,
    zksyncFeeHistory: null,
};

const getters = {

    show(state) {
        return state.show;
    },

    successTxHash(state) {
        return state.successTxHash;
    },

    successAction(state) {
        return state.successAction;
    },

    etsData(state) {
        return state.etsData;
    },

    zksyncFeeHistory(state) {
        return state.zksyncFeeHistory;
    },
};

const actions = {
    showSuccessModal({commit, dispatch, getters}, successParams) {
        commit('setShow', true);
        commit('setSuccessTxHash', successParams.successTxHash);
        commit('setSuccessAction', successParams.successAction);
        commit('setEtsData', successParams.etsData);
        commit('setZksyncFeeHistory', successParams.zksyncFeeHistory);
    },

    closeSuccessModal({commit, dispatch, getters}) {
        commit('setShow', false);
        commit('setSuccessTxHash', null);
        commit('setZksyncFeeHistory', null);
    },

};

const mutations = {

    setShow(state, show) {
        state.show = show;
    },

    setSuccessTxHash(state, value) {
        state.successTxHash = value;
    },

    setSuccessAction(state, value) {
        state.successAction = value;
    },

    setEtsData(state, value) {
        state.etsData = value;
    },

    setZksyncFeeHistory(state, value) {
        state.zksyncFeeHistory = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

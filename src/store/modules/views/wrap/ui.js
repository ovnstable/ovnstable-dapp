const state = {

    isWrapView: true,

    usdcApproved: false,
    usdPlusApproved: false,
    wUsdPlusApproved: false,
};

const getters = {

    isWrapView(state) {
        return state.isWrapView;
    },

    usdcApproved(state) {
        return state.usdcApproved;
    },

    usdPlusApproved(state) {
        return state.usdPlusApproved;
    },

    wUsdPlusApproved(state) {
        return state.wUsdPlusApproved;
    },
};

const actions = {

    async showUnWrapView({commit, dispatch, getters, rootState}) {
        commit('setIsWrapView', false)
    },

    async showWrapView({commit, dispatch, getters, rootState}) {
        commit('setIsWrapView', true)
    },


    approveUsdc({commit, dispatch, getters}) {
        commit('setUsdcApproved', true);
    },

    approveUsdPlus({commit, dispatch, getters}) {
        commit('setUsdPlusApproved', true);
    },

    approvewUsdPlus({commit, dispatch, getters}) {
        commit('setwUsdPlusApproved', true);
    },
};

const mutations = {

    setIsWrapView(state, value) {
        state.isWrapView = value;
    },

    setUsdcApproved(state, usdcApproved) {
        state.usdcApproved = usdcApproved;
    },

    setUsdPlusApproved(state, usdPlusApproved) {
        state.usdPlusApproved = usdPlusApproved;
    },

    setwUsdPlusApproved(state, wUsdPlusApproved) {
        state.wUsdPlusApproved = wUsdPlusApproved;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

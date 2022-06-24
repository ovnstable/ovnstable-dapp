const state = {

    isWrapView: true,

    usdcApproved: false,
    usdPlusApproved: false,
    WUsdPlusApproved: false,
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

    WUsdPlusApproved(state) {
        return state.WUsdPlusApproved;
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

    approveWUsdPlus({commit, dispatch, getters}) {
        commit('setWUsdPlusApproved', true);
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

    setWUsdPlusApproved(state, WUsdPlusApproved) {
        state.WUsdPlusApproved = WUsdPlusApproved;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

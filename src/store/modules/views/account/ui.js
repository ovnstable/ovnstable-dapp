
const state = {

    showAccountProfile: false,

    loadingBalance: true,

    badge: false,
};

const getters = {


    showAccountProfile(state) {
        return state.showAccountProfile;
    },

    loadingBalance(state) {
        return state.loadingBalance;
    },

    badge(state) {
        return state.badge;
    },

};

const actions = {


    async showAccountProfile({commit, dispatch, getters, rootState}){
        commit('setShowAccountProfile', true)
    },

    async hideAccountProfile({commit, dispatch, getters, rootState}){
        commit('setShowAccountProfile', false)
    },

    async showBadge({commit, dispatch, getters, rootState}){
        commit('setBadge', true)
    },

    async hideBadge({commit, dispatch, getters, rootState}){
        commit('setBadge', false)
    },


};

const mutations = {

    setShowAccountProfile(state, value) {
        state.showAccountProfile = value;
    },

    setLoadingBalance(state, value) {
        state.loadingBalance = value;
    },

    setBadge(state, value) {
        state.loadingBalance = badge;
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};


const state = {

    showAccountProfile: false,

    loadingBalance: true,
};

const getters = {


    showAccountProfile(state) {
        return state.showAccountProfile;
    },

    loadingBalance(state) {
        return state.loadingBalance;
    },

};

const actions = {


    async showAccountProfile({commit, dispatch, getters, rootState}){
        commit('setShowAccountProfile', true)
    },

    async hideAccountProfile({commit, dispatch, getters, rootState}){
        commit('setShowAccountProfile', false)
    },


};

const mutations = {

    setShowAccountProfile(state, value) {
        state.showAccountProfile = value;
    },

    setLoadingBalance(state, value) {
        state.loadingBalance = value;
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

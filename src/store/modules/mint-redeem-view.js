
const state = {

   isMintView: true,
};

const getters = {

    isMintView(state) {
        return state.isMintView;
    },
};

const actions = {

    async showRedeemView({commit, dispatch, getters, rootState}){
        commit('setIsMintView', false)
    },

    async showMintView({commit, dispatch, getters, rootState}){
        commit('setIsMintView', true)
    },
};

const mutations = {

    setIsMintView(state, value) {
        state.isMintView = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

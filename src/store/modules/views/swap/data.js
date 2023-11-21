const state = {

};

const getters = {

};

const actions = {

    async refreshSwap({commit, dispatch, getters, rootState}) {
        dispatch('accountData/refreshBalance', null, {root:true});
    },
};

const mutations = {

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

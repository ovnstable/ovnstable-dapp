const state = {

    index: null,
};

const getters = {

    index(state) {
        return state.index;
    },
};

const actions = {

    async refreshWrap({commit, dispatch, getters, rootState}) {
        console.log('WrapData: refreshWrap');


        if (rootState.web3.contracts === null)
            return;

        let index = await rootState.web3.contracts.wUsdPlus.methods.rate().call();
        commit('setIndex', index.substring(0,3) / 100);

        dispatch('accountData/refreshBalance', null, {root:true});
    },


};

const mutations = {

    setIndex(state, index) {
        state.index = index;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

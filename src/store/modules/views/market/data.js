const state = {

};

const getters = {


};

const actions = {


    async refreshMarket({commit, dispatch, getters, rootState}) {
        console.log('MarketData: refreshMarket');

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

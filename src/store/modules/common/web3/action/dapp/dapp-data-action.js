const state = {};

const getters = {};

const actions = {

    async resetUserData({commit, dispatch, getters, rootState}) {
        dispatch('accountData/resetBalance', null, {root:true});
        dispatch('accountData/resetUns', null, {root:true})
    },

    async updateUserData({commit, dispatch, getters, rootState}) {
        dispatch('accountData/refreshBalance', null, {root:true});
        dispatch('supplyData/refreshSupply', null, {root:true});
        dispatch('supplyData/refreshInsuranceSupply', null, {root:true});
        dispatch('swapData/refreshSwap', null, {root:true});
        dispatch('statsData/refreshStats', null, {root:true});
        dispatch('marketData/refreshClientData', null, {root:true});
        dispatch('insuranceData/refreshInsurance', null, {root:true});

        let network = rootState.network.networkName;

        if (network === 'polygon' || network === 'op' || network === 'ar') {
            dispatch('wrapData/refreshWrap', null, {root:true});
        }
    },

};

const mutations = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

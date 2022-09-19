const state = {};

const getters = {};

const actions = {

    async resetUserData({commit, dispatch, getters, rootState}) {
        dispatch('accountData/resetBalance', null, {root:true});
        dispatch('accountData/resetUns', null, {root:true})
        dispatch('dashboardData/resetDashboard', null, {root:true});
    },

    async updateUserData({commit, dispatch, getters, rootState}) {
        dispatch('accountData/refreshBalance', null, {root:true});
        dispatch('supplyData/refreshSupply', null, {root:true});
        dispatch('swapData/refreshSwap', null, {root:true});
        dispatch('statsData/refreshStats', null, {root:true});
        dispatch('dashboardData/refreshDashboard', null, {root:true});
        dispatch('farmData/refreshFarm', null, {root:true});

        let network = rootState.network.networkName;

        if (network === 'polygon') {
            dispatch('marketData/refreshClientData', {contractAddress: '0x4b5e0af6AE8Ef52c304CD55f546342ca0d3050bf', strategyName: 'usdPlusWmatic'}, {root:true});
            dispatch('marketData/refreshClientData', {contractAddress: '0xd52caB8AfC8ECd08b7CFa6D07e224a56F943e4c4', strategyName: 'wmaticUsdc'}, {root:true});
            dispatch('marketData/refreshClientData', {contractAddress: '0x719ee857Ae6cf85Cbe7284Bc45ad1f99dd5ff0dB', strategyName: 'etsMoonstone'}, {root:true});
        }

        if (network === 'bsc') {
            dispatch('marketData/refreshClientData', {contractAddress: '0xbAAc6ED05b2fEb47ef04b63018A27d80cbeA10d1', strategyName: 'usdPlusWbnb'}, {root:true});
            dispatch('marketData/refreshClientData', {contractAddress: '0xc6eca7a3b863d720393DFc62494B6eaB22567D37', strategyName: 'busdWbnb'}, {root:true});
        }

        if (network === 'polygon' || network === 'op') {
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

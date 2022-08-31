const state = {
    networkName: process.env.VUE_APP_POLYGON,
    networkId: parseInt(process.env.VUE_APP_NETWORK_ID),
    rpcUrl: process.env.VUE_APP_RPC_URL,
    explorerUrl: process.env.VUE_APP_NETWORK_EXPLORER,
};

const getters = {

    networkName(state) {
        return state.networkName;
    },

    networkId(state) {
        return state.networkId;
    },

    rpcUrl(state) {
        return state.rpcUrl;
    },

    explorerUrl(state) {
        return state.explorerUrl;
    },
};

const actions = {

};

const mutations = {

    setNetworkName(state, value) {
        state.networkName = value;
    },

    setNetworkId(state, value) {
        state.networkId = value;
    },

    setRpcUrl(state, value) {
        state.rpcUrl = value;
    },

    setExplorerUrl(state, value) {
        state.explorerUrl = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

const state = {
    appApiUrl: process.env.VUE_APP_API,
    networkName: process.env.VUE_APP_POLYGON,
    networkId: parseInt(process.env.VUE_APP_NETWORK_ID),
    rpcUrl: process.env.VUE_APP_RPC_URL,
    explorerUrl: process.env.VUE_APP_NETWORK_EXPLORER,
    assetName: process.env.VUE_APP_ASSET_NAME,
    assetDecimals: parseInt(process.env.VUE_APP_ASSET_DECIMALS),
    nativeAssetName: process.env.VUE_APP_NATIVE_ASSET,
};

const getters = {

    appApiUrl(state) {
        return state.appApiUrl;
    },

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

    assetName(state) {
        return state.assetName;
    },

    nativeAssetName(state) {
        return state.nativeAssetName;
    },

    assetDecimals(state) {
        return state.assetDecimals;
    },
};

const actions = {

    showWaitingModal({commit, dispatch, getters, rootState}) {
        commit('setShow', true);
    },

};

const mutations = {

    setAppApiUrl(state, value) {
        state.appApiUrl = value;
    },

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

    setAssetName(state, value) {
        state.assetName = value;
    },

    setNativeAssetName(state, value) {
        state.nativeAssetName = value;
    },

    setAssetDecimals(state, value) {
        state.assetDecimals = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

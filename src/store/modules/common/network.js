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

    changeNetwork({commit, dispatch, getters, rootState}, networkName) {
        switch (networkName){
            case "polygon":
            case "polygon_dev":
            case "137":
            case "31337":
                commit('setAppApiUrl', 'https://app.overnight.fi/api');
                commit('setNetworkName', 'polygon');
                commit('setNetworkId', 137);
                commit('setRpcUrl', 'https://polygon-rpc.com/');
                commit('setExplorerUrl', 'https://polygonscan.com/');
                commit('setAssetName', 'USDC');
                commit('setAssetDecimals', 6);
                commit('setNativeAssetName', 'MATIC');
                break;
            case "bsc":
            case "56":
                commit('setAppApiUrl', 'https://bsc.overnight.fi/api');
                commit('setNetworkName', 'bsc');
                commit('setNetworkId', 56);
                commit('setRpcUrl', 'https://bsc-dataseed.binance.org');
                commit('setExplorerUrl', 'https://bscscan.com/');
                commit('setAssetName', 'BUSD');
                commit('setAssetDecimals', 18);
                commit('setNativeAssetName', 'BNB');
                break;
            case "avax":
            case "avalanche":
            case "43114":
                commit('setAppApiUrl', 'https://avax.overnight.fi/api');
                commit('setNetworkName', 'avalanche');
                commit('setNetworkId', 43114);
                commit('setRpcUrl', 'https://api.avax.network/ext/bc/C/rpc');
                commit('setExplorerUrl', 'https://snowtrace.io/');
                commit('setAssetName', 'USDC');
                commit('setAssetDecimals', 6);
                commit('setNativeAssetName', 'AVAX');
                break;
            case "op":
            case "optimism":
            case "10":
                commit('setAppApiUrl', 'https://op.overnight.fi/api');
                commit('setNetworkName', 'optimism');
                commit('setNetworkId', 10);
                commit('setRpcUrl', 'https://mainnet.optimism.io');
                commit('setExplorerUrl', 'https://optimistic.etherscan.io/');
                commit('setAssetName', 'USDC');
                commit('setAssetDecimals', 6);
                commit('setNativeAssetName', 'ETH');
                break;
        }

        dispatch('web3/initWeb3', null, {root: true});
        dispatch('web3/setNetwork', getters.networkId, {root: true});
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

const POLYGON_PARAMS = {
    appApiUrl: 'https://app.overnight.fi/api',
    networkName: 'polygon',
    networkId: 137,
    rpcUrl: 'https://polygon-rpc.com/',
    explorerUrl: 'https://polygonscan.com/',
    assetName: 'USDC',
    assetDecimals: 6,
    nativeAssetName: 'MATIC',
}

const BSC_PARAMS = {
    appApiUrl: 'https://bsc.overnight.fi/api',
    networkName: 'bsc',
    networkId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com/',
    assetName: 'BUSD',
    assetDecimals: 18,
    nativeAssetName: 'BNB',
}

const AVALANCHE_PARAMS = {
    appApiUrl: 'https://avax.overnight.fi/api',
    networkName: 'avalanche',
    networkId: 43114,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io/',
    assetName: 'USDC',
    assetDecimals: 6,
    nativeAssetName: 'AVAX',
}

const OPTIMISM_PARAMS = {
    appApiUrl: 'https://op.overnight.fi/api',
    networkName: 'optimism',
    networkId: 10,
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io/',
    assetName: 'USDC',
    assetDecimals: 6,
    nativeAssetName: 'ETH',
}

const state = {
    appApiUrl: _getParams(null).appApiUrl,
    networkName: _getParams(null).networkName,
    networkId: _getParams(null).networkId,
    rpcUrl: _getParams(null).rpcUrl,
    explorerUrl: _getParams(null).explorerUrl,
    assetName: _getParams(null).assetName,
    assetDecimals: _getParams(null).assetDecimals,
    nativeAssetName: _getParams(null).nativeAssetName,

    polygonApi: POLYGON_PARAMS.appApiUrl,
    bscApi: BSC_PARAMS.appApiUrl,
    avaxApi: AVALANCHE_PARAMS.appApiUrl,
    opApi: OPTIMISM_PARAMS.appApiUrl,
};


function _getParams(networkName) {

    if (!networkName) {
        networkName = localStorage.getItem('selectedNetwork');

        if (!networkName) {
            networkName = 'polygon';
        }
    }

    switch (networkName){
        case "polygon":
        case "polygon_dev":
        case "137":
        case "31337":
            return POLYGON_PARAMS;
        case "bsc":
        case "56":
            return BSC_PARAMS;
        case "avax":
        case "avalanche":
        case "43114":
            return AVALANCHE_PARAMS;
        case "op":
        case "optimism":
        case "10":
            return OPTIMISM_PARAMS;
        default:
            return POLYGON_PARAMS;
    }
}

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

    polygonApi(state) {
        return state.polygonApi;
    },

    bscApi(state) {
        return state.bscApi;
    },

    avaxApi(state) {
        return state.avaxApi;
    },

    opApi(state) {
        return state.opApi;
    },
};

const actions = {

    changeNetwork({commit, dispatch, getters, rootState}, networkName) {

        commit('setAppApiUrl', _getParams(networkName).appApiUrl);
        commit('setNetworkName', _getParams(networkName).networkName);
        commit('setNetworkId', _getParams(networkName).networkId);
        commit('setRpcUrl', _getParams(networkName).rpcUrl);
        commit('setExplorerUrl', _getParams(networkName).explorerUrl);
        commit('setAssetName', _getParams(networkName).assetName);
        commit('setAssetDecimals', _getParams(networkName).assetDecimals);
        commit('setNativeAssetName', _getParams(networkName).nativeAssetName);

        dispatch('web3/initWeb3', null, {root: true});
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

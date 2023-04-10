const POLYGON_PARAMS = {
    appApiUrl: 'https://app.overnight.fi/api',
    networkName: 'polygon',
    networkId: 137,
    rpcUrl: 'https://polygon-rpc.com/',
    explorerUrl: 'https://polygonscan.com/',
    assetName: 'USDC',
    assetDecimals: 6,
    nativeAssetName: 'MATIC',
    bridgeLink: 'https://router.via.exchange/polygon/USD+/bsc/USD+',
}

const BSC_PARAMS = {
    appApiUrl: 'https://bsc.overnight.fi/api',
    networkName: 'bsc',
    networkId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com/',
    assetName: 'USDC',
    assetDecimals: 18,
    nativeAssetName: 'BNB',
    bridgeLink: 'https://router.via.exchange/bsc/USD+/optimism/USD+',
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
    bridgeLink: 'https://router.via.exchange/optimism/USD+/bsc/USD+',
}

const ARBITRUM_PARAMS = {
    appApiUrl: 'https://arbitrum.overnight.fi/api',
    networkName: 'arbitrum',
    networkId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io/',
    assetName: 'USDC',
    assetDecimals: 6,
    nativeAssetName: 'ETH',
    bridgeLink: 'https://router.via.exchange/arbitrum/USD+/bsc/USD+',
}

const ZKSYNC_PARAMS = {
    appApiUrl: 'https://zksync.overnight.fi/api',
    networkName: 'zksync',
    networkId: 324,
    rpcUrl: 'https://mainnet.era.zksync.io',//'https://zksync2-testnet.zksync.dev', //https://mainnet.era.zksync.io',
    explorerUrl: 'https://explorer.zksync.io/',
    assetName: 'USDC',
    assetDecimals: 6,
    nativeAssetName: 'ETH',
    bridgeLink: 'https://router.via.exchange/zksync/USD+/bsc/USD+',
}

let dbNetworkName = localStorage.getItem('selectedNetwork');
const state = {
    appApiUrl: _getParams(dbNetworkName).appApiUrl,
    apiUrl: "https://api.overnight.fi",
    networkName: _getParams(dbNetworkName).networkName,
    networkId: _getParams(dbNetworkName).networkId,
    rpcUrl: _getParams(dbNetworkName).rpcUrl,
    explorerUrl: _getParams(dbNetworkName).explorerUrl,
    assetName: _getParams(dbNetworkName).assetName,
    assetDecimals: _getParams(dbNetworkName).assetDecimals,
    nativeAssetName: _getParams(dbNetworkName).nativeAssetName,
    bridgeLink: _getParams(dbNetworkName).bridgeLink,

    polygonApi: POLYGON_PARAMS.appApiUrl,
    bscApi: BSC_PARAMS.appApiUrl,
    opApi: OPTIMISM_PARAMS.appApiUrl,
    arApi: ARBITRUM_PARAMS.appApiUrl,
    zkApi: ZKSYNC_PARAMS.appApiUrl,

    polygonConfig: POLYGON_PARAMS,
    bscConfig: BSC_PARAMS,
    opConfig: OPTIMISM_PARAMS,
    arConfig: ARBITRUM_PARAMS,
    zkConfig: ZKSYNC_PARAMS,

    switchToOtherNetwork: false,
};

function _getParams(networkName) {

    switch (networkName) {
        case "polygon":
        case "polygon_dev":
        case "137":
        case "31337":
            return POLYGON_PARAMS;
        case "bsc":
        case "56":
            return BSC_PARAMS;
        case "op":
        case "optimism":
        case "10":
            return OPTIMISM_PARAMS;
        case "ar":
        case "arbitrum":
        case "42161":
            return ARBITRUM_PARAMS;
        case "zk":
        case "zksync":
        case "324":
            return ZKSYNC_PARAMS;
        default:
            return OPTIMISM_PARAMS; //BASE_PARAMS;
    }
}

const getters = {

    appApiUrl(state) {
        return state.appApiUrl;
    },

    apiUrl(state) {
        return state.apiUrl;
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

    bridgeLink(state) {
        return state.bridgeLink;
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

    opApi(state) {
        return state.opApi;
    },

    arApi(state) {
        return state.arApi;
    },

    switchToOtherNetwork(state) {
        return state.switchToOtherNetwork;
    },

    polygonConfig(state) {
        return state.polygonConfig;
    },

    bscConfig(state) {
        return state.bscConfig;
    },

    opConfig(state) {
        return state.opConfig;
    },

    arConfig(state) {
        return state.arConfig;
    },

    zkConfig(state) {
        return state.zkConfig;
    },

    getParams: (state) => (networkName) => {
        return _getParams(networkName);
    }
};

const actions = {

    changeDappNetwork({commit, dispatch, getters, rootState}, networkName) {

        commit('setAppApiUrl', _getParams(networkName).appApiUrl);
        commit('setNetworkName', _getParams(networkName).networkName);
        commit('setNetworkId', _getParams(networkName).networkId);
        commit('setRpcUrl', _getParams(networkName).rpcUrl);
        commit('setExplorerUrl', _getParams(networkName).explorerUrl);
        commit('setAssetName', _getParams(networkName).assetName);
        commit('setAssetDecimals', _getParams(networkName).assetDecimals);
        commit('setNativeAssetName', _getParams(networkName).nativeAssetName);
        commit('setBridgeLink', _getParams(networkName).bridgeLink);

        dispatch('walletAction/updateOnboardNetwork', null, {root: true});
        dispatch('web3/initWeb3', null, {root: true});
    },

    saveNetworkToLocalStore({commit, dispatch, getters, rootState}, network) {

        switch (network) {
            case "polygon":
            case "polygon_dev":
            case "137":
            case "31337":
                localStorage.setItem('selectedNetwork', 'polygon');
                break;
            case "bsc":
            case "56":
                localStorage.setItem('selectedNetwork', 'bsc');
                break;
            case "op":
            case "optimism":
            case "10":
                localStorage.setItem('selectedNetwork', 'op');
                break;
            case "ar":
            case "arbitrum":
            case "42161":
                localStorage.setItem('selectedNetwork', 'ar');
                break;
            case "zk":
            case "zksync":
            case "324":
                localStorage.setItem('selectedNetwork', 'zk');
                break;
            default:
                localStorage.setItem('selectedNetwork', 'op');
                break;
        }
    },

    async setWalletNetwork({commit, dispatch, getters, rootState}, network) {
        if (rootState.web3.provider && !rootState.web3.isProviderDefault) {

            dispatch('saveNetworkToLocalStore', network);

            try {
                await rootState.web3.provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId: rootState.web3.web3.utils.toHex(parseInt(network))}],
                });

                commit('walletAction/setWalletConnected', true, {root: true});
            } catch (switchError) {
                try {
                    let params;

                    switch (network) {
                        case "polygon":
                        case "polygon_dev":
                        case "137":
                        case "31337":
                            params = {
                                chainId: rootState.web3.web3.utils.toHex(137),
                                rpcUrls: ['https://polygon-rpc.com/'],
                                blockExplorerUrls: ['https://polygonscan.com/'],
                                chainName: 'Polygon Mainnet',
                                nativeCurrency: {
                                    symbol: 'MATIC',
                                    name: 'MATIC',
                                    decimals: 18,
                                }
                            };
                            break;
                        case "bsc":
                        case "56":
                            params = {
                                chainId: rootState.web3.web3.utils.toHex(56),
                                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                                blockExplorerUrls: ['https://bscscan.com/'],
                                chainName: 'Smart Chain',
                                nativeCurrency: {
                                    symbol: 'BNB',
                                    name: 'BNB',
                                    decimals: 18,
                                }
                            };
                            break;
                        case "op":
                        case "optimism":
                        case "10":
                            params = {
                                chainId: rootState.web3.web3.utils.toHex(10),
                                rpcUrls: ['https://mainnet.optimism.io'],
                                blockExplorerUrls: ['https://optimistic.etherscan.io/'],
                                chainName: 'Optimism',
                                nativeCurrency: {
                                    symbol: 'ETH',
                                    name: 'ETH',
                                    decimals: 18,
                                }
                            };
                            break;
                        case "ar":
                        case "arbitrum":
                        case "42161":
                            params = {
                                chainId: rootState.web3.web3.utils.toHex(42161),
                                rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                                blockExplorerUrls: ['https://arbiscan.io/'],
                                chainName: 'Arbitrum',
                                nativeCurrency: {
                                    symbol: 'ETH',
                                    name: 'ETH',
                                    decimals: 18,
                                }
                            };
                            break;
                        case "zk":
                        case "zksync":
                        case "324":
                            params = {
                                chainId: rootState.web3.web3.utils.toHex(324),
                                // rpcUrls: ['https://zksync2-testnet.zksync.dev'],
                                rpcUrls: ['https://mainnet.era.zksync.io'],
                                blockExplorerUrls: ['https://explorer.zksync.io'],
                                chainName: 'ZkSync',
                                nativeCurrency: {
                                    symbol: 'ETH',
                                    name: 'ETH',
                                    decimals: 18,
                                }
                            };
                            break;
                        default:
                            break;
                    }

                    await rootState.web3.provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [params],
                    });

                    commit('walletAction/setWalletConnected', true, {root: true});
                } catch (addError) {
                    console.error(addError);
                }
            }
        } else {
            await dispatch('changeDappNetwork', network);
            await dispatch('walletAction/checkAccount', null, {root: true});
        }
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

    setBridgeLink(state, value) {
        state.bridgeLink = value;
    },

    setAssetDecimals(state, value) {
        state.assetDecimals = value;
    },

    setSwitchToOtherNetwork(state, value) {
        state.switchToOtherNetwork = value;
    },

    setNetworkChanged(state, value) {
        state.networkChanged = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

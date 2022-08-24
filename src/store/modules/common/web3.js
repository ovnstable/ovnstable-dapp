import Web3 from "web3";
import Onboard from 'bnc-onboard'
import UAuth from '@uauth/js'
import UAuthBncOnboard from '@uauth/bnc-onboard'


const ERC20 = require('@/contracts/ERC20.json');

import contract from "@truffle/contract";

const OvnImage = require('@/assets/ovn.json');
const UsdPlusImage = require('@/assets/usdPlus.json');
const WrappedUsdPlusImage = require('@/assets/wUsdPlus.json');
const UsdPlusWmaticImage = require('@/assets/usdPlusWmatic.json');

const polygon = process.env.VUE_APP_POLYGON;
const networkId = Number.parseInt(process.env.VUE_APP_NETWORK_ID);

console.log('Polygon: ' + polygon);

const Exchange = require(`@/contracts/${polygon}/Exchange.json`)
const OvnToken = require(`@/contracts/${polygon}/OvnToken.json`)
const OvnGovernor = require(`@/contracts/${polygon}/OvnGovernor.json`)
const PortfolioManager = require(`@/contracts/${polygon}/PortfolioManager.json`)
const Mark2Market = require(`@/contracts/${polygon}/Mark2Market.json`)
const TimelockController = require(`@/contracts/${polygon}/OvnTimelockController.json`)
const UsdPlusToken = require(`@/contracts/${polygon}/UsdPlusToken.json`)
const StakingRewards = require(`@/contracts/abi/StakingRewards.json`)
const UniswapV2Pair = require(`@/contracts/abi/IUniswapV2Pair.json`)
const ExchangerUsdPlusWmatic = require(`@/contracts/${polygon}/HedgeExchangerUsdPlusWmatic.json`)
const UsdPlusWmaticToken = require(`@/contracts/${polygon}/RebaseTokenUsdPlusWmatic.json`)

let Market;
let WrappedUsdPlusToken;

if (polygon !== "avalanche" && polygon !== "bsc") {
    Market = require(`@/contracts/${polygon}/Market.json`)
    WrappedUsdPlusToken = require(`@/contracts/${polygon}/WrappedUsdPlusToken.json`)
}


const ALLOW_NETWORKS = [networkId, 31337];

// Unstoppable domains config for BNC Onboard
const uauthOnboard = new UAuthBncOnboard({
    uauth: new UAuth({
        clientID: process.env.VUE_APP_UD_CLIENT_ID,
        redirectUri: process.env.VUE_APP_UD_REDIRECT_URI,
        scope: 'openid wallet'
    })
})

export const wallets = [
    {
        walletName: "metamask",
        preferred: true
    },
    {
        walletName: "binance",
        rpcUrl: process.env.VUE_APP_RPC_URL,
        preferred: (process.env.VUE_APP_POLYGON === "bsc")
    },
    {
        walletName: "walletConnect",
        rpc: {
            [networkId]: process.env.VUE_APP_RPC_URL,
        },
        preferred: true
    },
    {
        walletName: "walletLink",
        rpcUrl: process.env.VUE_APP_RPC_URL,
        appName: process.env.VUE_APP_TITLE,
        preferred: true
    },
    uauthOnboard.module({
        preferred: false,
        walletconnect: {
            infuraId: process.env.VUE_APP_INFURA_ID
        }
    }),
    {
        walletName: 'ledger',
        rpcUrl: process.env.VUE_APP_RPC_URL,
    },
    {
        walletName: "ronin"
    }
];


const state = {
    contracts: null,
    web3: null,
    networkId: null,
    switchToPolygon: false,
    loadingWeb3: true,
    provider: null,
    onboard: null,
    walletConnected: false,
    walletName: null,
    assetInfo: {},
};

const getters = {

    provider(state) {
        return state.provider;
    },

    web3(state) {
        return state.web3;
    },

    onboard(state) {
        return state.onboard;
    },

    walletConnected(state) {
        return state.walletConnected;
    },

    contracts(state) {
        return state.contracts;
    },

    networkId(state) {
        return state.networkId;
    },

    switchToPolygon(state) {
        return state.switchToPolygon;
    },

    loadingWeb3(state) {
        return state.loadingWeb3;
    },

    walletName(state) {
        return state.walletName;
    },

    assetInfo(state) {
        return state.assetInfo;
    },
};

const actions = {

    async initOnboard({commit, dispatch, getters}) {

        let onboard = Onboard({
            dappId: 'c81e3c96-54f6-4d82-b911-87dea6376ba4',
            networkId: parseInt(process.env.VUE_APP_NETWORK_ID),
            darkMode: false,
            walletSelect: {
                wallets: wallets,
            },

            subscriptions: {
                wallet: async wallet => {
                    console.log('OnBoard: wallet');

                    commit('setProvider', wallet.provider);

                    await dispatch('initWeb3').then(value => {

                        commit('setWalletConnected', true);
                        commit('setWalletName', wallet.name);
                        localStorage.setItem('walletName', wallet.name);
                        console.log(wallet.name + ' is now connected!');
                        if (wallet.name === 'Unstoppable') {
                            commit('accountData/setUns', wallet.instance.cacheOptions.getDefaultUsername(), {root:true})
                        }
                        commit('accountData/setAccount', wallet.address, {root:true});

                        dispatch('checkAccount');
                    });
                },

                address: async address => {
                    console.log('OnBoard: address');
                }
            }
        });

        commit('setOnboard', onboard);
    },

    async connectWallet({commit, dispatch, getters}) {

        if (!getters.onboard) {
            await dispatch('initOnboard');
        }

        let walletName = localStorage.getItem('walletName');

        await getters.onboard.walletSelect(walletName ? walletName : '');
        await getters.onboard.walletCheck();
    },

    async disconnectWallet({commit, dispatch, getters}) {

        if (getters.onboard) {
            await getters.onboard.walletReset();
            localStorage.removeItem('walletName');

            await dispatch('initWeb3').then(value => {
                commit('setWalletConnected', false);
                console.log('Wallet was disconnected');

                dispatch('checkAccount');
            });
        }
    },

    async switchAccount({commit, dispatch, getters}) {
        if (getters.onboard) {
            await getters.onboard.walletSelect();
            await getters.onboard.walletCheck();
        }
    },

    async initWeb3({commit, dispatch, getters, rootState}) {

        commit('setLoadingWeb3', true);
        commit('setWalletConnected', false);

        if (polygon === "avalanche" || polygon === "bsc") {
            dispatch('farmUI/hidePage', null, {root: true});
            dispatch('wrapUI/hidePage', null, {root: true});
        }

        if (polygon === "optimism") {
            dispatch('farmUI/hidePage', null, {root: true});
        }

        if (localStorage.getItem('walletName')) {
            await dispatch('connectWallet');
        }

        let web3;

        if (!getters.provider) {
            let provider = await new Web3.providers.HttpProvider(process.env.VUE_APP_RPC_URL);
            web3 = await new Web3(provider);

            console.log('InitWeb3: Provider default');
        } else {
            web3 = await new Web3(getters.provider);
            console.log('InitWeb3: Provider Custom');
        }

        let networkId = await web3.eth.net.getId();
        console.log('Network ID ' + networkId)
        commit('setNetworkId', networkId)

        if (getters.provider) {
            getters.provider.on('accountsChanged', function (accounts) {
                console.log('Provider: accountsChanged');
                dispatch('checkAccount', accounts[0])
            });

            getters.provider.on('networkChanged', function (networkId) {

                console.log('Provider: networkChanged');
                networkId = parseInt(networkId)
                commit('setNetworkId', networkId)
                if (ALLOW_NETWORKS.includes(networkId)) {
                    dispatch('updateUserData');
                    commit('setSwitchToPolygon', false);
                } else {
                    dispatch('resetUserData');
                    commit('setSwitchToPolygon', true);
                }
            });

        }

        commit('setWeb3', web3);

        dispatch('initContracts');
        dispatch('gasPrice/refreshGasPrice', null, {root: true})

        if (!ALLOW_NETWORKS.includes(networkId)) {
            commit('setSwitchToPolygon', true)
        }

        /* Account connected */

        commit('setLoadingWeb3', false);
    },

    async checkAccount({commit, dispatch, getters, rootState}, account){

        if (getters.walletConnected) {

            console.log("CheckAccount: wallet is connected");

            if (!account){
                let accounts = await getters.web3.eth.getAccounts();
                account = accounts[0];
            }

            commit('accountData/setAccount', account, {root:true});

            if (account){
                dispatch('updateUserData');
            } else {
                dispatch('resetUserData');
            }
        } else {
            console.log("CheckAccount: wallet is disconnected");

            dispatch('resetUserData');
            commit('accountData/setAccount', null, {root:true});
        }
    },

    async resetUserData({commit, dispatch, getters, rootState}) {

        console.log('Call: resetUserData');

        dispatch('accountData/resetBalance', null, {root:true});
        dispatch('accountData/resetUns', null, {root:true})
        dispatch('dashboardData/resetDashboard', null, {root:true});
    },

    async updateUserData({commit, dispatch, getters, rootState}) {

        console.log('Call: updateUserData');

        dispatch('accountData/refreshBalance', null, {root:true});
        dispatch('supplyData/refreshSupply', null, {root:true});
        dispatch('swapData/refreshSwap', null, {root:true});
        dispatch('wrapData/refreshWrap', null, {root:true});
        dispatch('statsData/refreshStats', null, {root:true});
        dispatch('dashboardData/refreshDashboard', null, {root:true});
        dispatch('farmData/refreshFarm', null, {root:true});
        dispatch('marketData/refreshClientData', null, {root:true});
    },


    async initContracts({commit, dispatch, getters}) {

        let web3 = getters.web3;

        let contracts = {};


        switch (polygon){
            case "avalanche":
                contracts.asset = _load(ERC20, web3, '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E');
                break;
            case "polygon":
            case "polygon_dev":
                contracts.asset = _load(ERC20, web3, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174');
                break;
            case "optimism":
                contracts.asset = _load(ERC20, web3, '0x7F5c764cBc14f9669B88837ca1490cCa17c31607');
                break;
            case "bsc":
                contracts.asset = _load(ERC20, web3, '0xe9e7cea3dedca5984780bafc599bd69add087d56');
                break;
        }

        /*let assetInfo = {};
        assetInfo.symbol = await contracts.asset.methods.symbol().call();
        assetInfo.decimals = await contracts.asset.methods.decimals().call();
        commit('setAssetInfo', assetInfo);*/

        contracts.exchange = _load(Exchange, web3);
        contracts.govToken = _load(OvnToken, web3);
        contracts.governor = _load(OvnGovernor, web3);
        contracts.mark2market = _load(Mark2Market, web3);
        contracts.pm = _load(PortfolioManager, web3);
        contracts.timelockController = _load(TimelockController, web3);
        contracts.usdPlus = _load(UsdPlusToken, web3);
        contracts.preOvn = _load(ERC20, web3, "0x18D4565Cbd03340996BED17e66D154b632f5d4B6");

        if (polygon !== "avalanche" && polygon !== "bsc") {
            contracts.market = _load(Market, web3);
            contracts.wUsdPlus = _load(WrappedUsdPlusToken, web3);
        }

        contracts.exchangerUsdPlusWmatic = _load(ExchangerUsdPlusWmatic, web3);
        contracts.usdPlusWmatic = _load(UsdPlusWmaticToken, web3);

        contracts.poolQsUsdPlusWeth = _load(StakingRewards, web3, "0x398B66c4c69Bf19EA6A3c97e8d8b9c93f295D209");
        contracts.poolQsUsdPlusWethToken = _load(ERC20, web3, '0x901Debb34469e89FeCA591f5E5336984151fEc39');
        contracts.poolQsUsdPlusWethPair = _load(UniswapV2Pair, web3, '0x901Debb34469e89FeCA591f5E5336984151fEc39');

        contracts.poolQsUsdPlusWmatic = _load(StakingRewards, web3, "0x6b9cC8Fce435A13bfF67a4c5a70EeED2f3f643e5");
        contracts.poolQsUsdPlusWmaticToken = _load(ERC20, web3, '0x91f670270b86c80ec92bb6b5914e6532ca967bfb');
        contracts.poolQsUsdPlusWmaticPair = _load(UniswapV2Pair, web3, '0x91f670270b86c80ec92bb6b5914e6532ca967bfb');

        commit('setContracts', contracts)
    },


    async setNetwork({commit, dispatch, getters, rootState}, networkId) {

        try {
            await getters.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: getters.web3.utils.toHex(networkId)}],
            });
        } catch (switchError) {
            try {
                let params;

                switch (polygon){
                    case "avalanche":
                        params = {
                            chainId: getters.web3.utils.toHex(43114),
                            rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
                            blockExplorerUrls: ['https://snowtrace.io/'],
                            chainName: 'Avalanche',
                            nativeCurrency: {
                                symbol: 'AVAX',
                                name: 'AVAX',
                                decimals: 18,
                            }
                        };
                        break;
                    case "polygon":
                    case "polygon_dev":
                        params = {
                            chainId: getters.web3.utils.toHex(137),
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
                    case "optimism":
                        params = {
                            chainId: getters.web3.utils.toHex(10),
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
                    case "bsc":
                        params = {
                            chainId: getters.web3.utils.toHex(56),
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
                }

                await getters.provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [params],
                });
            } catch (addError) {
                console.error(addError);
                dispatch('switchAccount');
            }
        }
    },

    async addUsdPlusToken({commit, dispatch, getters, rootState}) {

        await getters.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.usdPlus.options.address,
                        symbol: process.env.VUE_APP_USD_TOKEN_NAME,
                        decimals: 6,
                        image: UsdPlusImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('USD+ successfully added to wallet!')
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addwUsdPlusToken({commit, dispatch, getters, rootState}) {

        await getters.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.wUsdPlus.options.address,
                        symbol: process.env.VUE_APP_WRAPPED_USD_TOKEN_NAME,
                        decimals: 6,
                        image: WrappedUsdPlusImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('wUSD+ successfully added to wallet!')
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addUsdPlusWmaticToken({commit, dispatch, getters, rootState}) {

        await getters.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.usdPlusWmatic.options.address,
                        symbol: process.env.VUE_APP_USD_PLUS_WMATIC_TOKEN_NAME,
                        decimals: 6,
                        image: UsdPlusWmaticImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('USD+/WMATIC successfully added to wallet!')
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addOvnToken({commit, dispatch, getters, rootState}) {

        await getters.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.govToken.options.address,
                        symbol: process.env.VUE_APP_OVN_TOKEN_NAME,
                        decimals: 18,
                        image: OvnImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('OVN successfully added to wallet!')
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },
};

const mutations = {

    setProvider(state, provider) {
        state.provider = provider;
    },

    setOnboard(state, onboard) {
        state.onboard = onboard;
    },

    setWalletConnected(state, walletConnected) {
        state.walletConnected = walletConnected;
    },

    setWeb3(state, web3) {
        state.web3 = web3;
    },

    setContracts(state, contracts) {
        state.contracts = contracts;
    },

    setNetworkId(state, value) {
        state.networkId = value;
    },

    setSwitchToPolygon(state, value) {
        state.switchToPolygon = value;
    },

    setLoadingWeb3(state, value) {
        state.loadingWeb3 = value;
    },

    setWalletName(state, value) {
        state.walletName = value;
    },

    setAssetInfo(state, value) {
        state.assetInfo = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};


function _load(file, web3, address) {

    let contractConfig = contract(file);

    const {abi} = contractConfig

    if (!address) {
        address = file.address;
    }

    return new web3.eth.Contract(abi, address);
}


import Web3 from "web3";
import Onboard from 'bnc-onboard'
import UAuth from '@uauth/js'
import UAuthBncOnboard from '@uauth/bnc-onboard'
import contract from "@truffle/contract";


const ERC20 = require('@/contracts/ERC20.json');

const OvnImage = require('@/assets/ovn.json');
const UsdPlusImage = require('@/assets/usdPlus.json');
const WrappedUsdPlusImage = require('@/assets/wUsdPlus.json');
const UsdPlusWmaticImage = require('@/assets/usdPlusWmatic.json');
const UsdPlusWbnbImage = require('@/assets/usdPlusWbnb.json');
const BusdWbnbImage = require('@/assets/busdWbnb.json');

const StakingRewards = require(`@/contracts/abi/StakingRewards.json`);
const UniswapV2Pair = require(`@/contracts/abi/IUniswapV2Pair.json`);

const SUPPORTED_NETWORKS = [137, 31337, 56, 43114, 10];


const state = {
    contracts: null,
    web3: null,
    switchToOtherNetwork: false,
    loadingWeb3: true,
    provider: null,
    onboard: null,
    walletConnected: false,
    walletName: null,
    assetInfo: {},

    networkChanged: false,
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

    switchToOtherNetwork(state) {
        return state.switchToOtherNetwork;
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

    networkChanged(state) {
        return state.networkChanged;
    },
};

const actions = {

    async initOnboard({commit, dispatch, getters, rootState}) {

        let rpcUrl = rootState.network.rpcUrl;
        let appApiUrl = rootState.network.appApiUrl;

        // Unstoppable domains config for BNC Onboard
        const uauthOnboard = new UAuthBncOnboard({
            uauth: new UAuth({
                clientID: process.env.VUE_APP_UD_CLIENT_ID,
                redirectUri: appApiUrl,
                scope: 'openid wallet'
            })
        })

        let wallets = [
            {
                walletName: "metamask",
                preferred: true
            },
            {
                walletName: "binance",
                rpcUrl: rpcUrl,
                preferred: true
            },
            /*{
                walletName: "walletConnect",
                rpc: {
                    [137]: "https://polygon-rpc.com/"
                },
                networkId: 137,
                preferred: true
            },*/
            {
                walletName: "walletLink",
                rpcUrl: rpcUrl,
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
                walletName: "coinbase",
                preferred: true
            },
            {
                walletName: 'ledger',
                rpcUrl: rpcUrl,
                preferred: false
            },
            {
                walletName: 'trezor',
                appUrl: appApiUrl.replaceAll('/api', ''),
                email: 'ovnstable@gmail.com',
                rpcUrl: rpcUrl,
                preferred: false
            },
            {
                walletName: "1inch",
                preferred: false
            },
            {
                walletName: "xdefi",
                preferred: false
            },
            {
                walletName: "ronin",
                preferred: false
            },
        ]

        let onboard = Onboard({
            dappId: 'c81e3c96-54f6-4d82-b911-87dea6376ba4',
            networkId: rootState.network.networkId,
            darkMode: false,
            walletSelect: {
                wallets: wallets,
            },

            subscriptions: {
                wallet: async wallet => {
                    console.log('OnBoard: wallet');

                    /*console.log("new Provider: " + JSON.stringify(wallet.name))

                    if (wallet.name === 'WalletConnect') {
                        await dispatch('network/changeNetwork', '137', {root: true})
                    }*/

                    commit('setProvider', wallet.provider);

                    if (getters.provider) {

                        getters.provider.on('accountsChanged', function (accounts) {
                            console.log('Provider: accountsChanged');
                            dispatch('checkAccount', accounts[0])
                        });

                        getters.provider.on('networkChanged', function (newNetworkId) {
                            newNetworkId = parseInt(newNetworkId)

                            console.log('Provider: networkChanged to ' + newNetworkId);

                            if (SUPPORTED_NETWORKS.includes(newNetworkId)) {

                                console.log("Current, new: " + rootState.network.networkId + " " + newNetworkId)

                                if (rootState.network.networkId !== newNetworkId) {
                                    dispatch('network/changeNetwork', newNetworkId.toString(), {root: true})
                                } else {
                                    commit('setSwitchToOtherNetwork', false);
                                }

                                dispatch('updateUserData');
                            } else {
                                dispatch('resetUserData');
                                commit('setSwitchToOtherNetwork', true);
                            }
                        });
                    }

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
        } else {
            commit('setNetworkChanged', 'true');
        }

        let walletName = localStorage.getItem('walletName');

        await getters.onboard.walletSelect(walletName ? walletName : '');
        // await getters.onboard.walletSelect((walletName !== undefined && walletName && walletName !== 'undefined') ? walletName : '');

        if (!getters.networkChanged) {
            await getters.onboard.walletCheck();
        }
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

        let network = rootState.network.networkName;
        let rpcUrl = rootState.network.rpcUrl;

        console.log('Network: ' + network);

        if (network === "avalanche" || network === "bsc") {
            dispatch('farmUI/hidePage', null, {root: true});
            dispatch('wrapUI/hidePage', null, {root: true});
        } else {
            dispatch('farmUI/showPage', null, {root: true});
            dispatch('wrapUI/showPage', null, {root: true});
        }

        if (network === "optimism") {
            dispatch('farmUI/hidePage', null, {root: true});
        } else {
            dispatch('farmUI/showPage', null, {root: true});
        }

        if (network !== "polygon") {
            dispatch('marketUI/hideUsdPlusWmatic', null, {root: true});
        } else {
            dispatch('marketUI/showUsdPlusWmatic', null, {root: true});
        }

        if (network !== "bsc") {
            dispatch('marketUI/hideUsdPlusWbnb', null, {root: true});
            dispatch('marketUI/hideBusdWbnb', null, {root: true});
        } else {
            dispatch('marketUI/showUsdPlusWbnb', null, {root: true});
            dispatch('marketUI/showBusdWbnb', null, {root: true});
        }

        if (localStorage.getItem('walletName')) {
            await dispatch('connectWallet');
        }

        /*let walletName = localStorage.getItem('walletName');

        if (walletName !== undefined && walletName && walletName !== 'undefined' && walletName !== 'WalletConnect') {
            await dispatch('connectWallet');
        }*/

        let web3;

        if (!getters.provider) {
            let provider = await new Web3.providers.HttpProvider(rpcUrl);
            web3 = await new Web3(provider);

            console.log('InitWeb3: Provider default');
        } else {
            web3 = await new Web3(getters.provider);
            console.log('InitWeb3: Provider Custom');
        }

        console.log('Network ID: ' + rootState.network.networkId)

        commit('setWeb3', web3);

        dispatch('initContracts');
        dispatch('gasPrice/refreshGasPrice', null, {root: true})

        let currentWalletNetworkId = await web3.eth.net.getId();

        if (parseInt(currentWalletNetworkId) === rootState.network.networkId) {
            commit('setSwitchToOtherNetwork', false);
        } else {
            commit('setSwitchToOtherNetwork', true);
        }

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

        let network = rootState.network.networkName;

        if (network === 'polygon') {
            dispatch('marketData/refreshClientData', {contractAddress: '0x4b5e0af6AE8Ef52c304CD55f546342ca0d3050bf', strategyName: 'usdPlusWmatic'}, {root:true});
        }

        if (network === 'bsc') {
            dispatch('marketData/refreshClientData', {contractAddress: '0xbAAc6ED05b2fEb47ef04b63018A27d80cbeA10d1', strategyName: 'usdPlusWbnb'}, {root:true});
            dispatch('marketData/refreshClientData', {contractAddress: '0xc6eca7a3b863d720393DFc62494B6eaB22567D37', strategyName: 'busdWbnb'}, {root:true});
        }
    },


    async initContracts({commit, dispatch, getters, rootState}) {

        let network = rootState.network.networkName;

        const Exchange = require(`@/contracts/${network}/Exchange.json`)
        const OvnToken = require(`@/contracts/${network}/OvnToken.json`)
        const OvnGovernor = require(`@/contracts/${network}/OvnGovernor.json`)
        const PortfolioManager = require(`@/contracts/${network}/PortfolioManager.json`)
        const Mark2Market = require(`@/contracts/${network}/Mark2Market.json`)
        const TimelockController = require(`@/contracts/${network}/OvnTimelockController.json`)
        const UsdPlusToken = require(`@/contracts/${network}/UsdPlusToken.json`)

        let Market;
        let WrappedUsdPlusToken;

        if (network !== "avalanche" && network !== "bsc") {
            Market = require(`@/contracts/${network}/Market.json`)
            WrappedUsdPlusToken = require(`@/contracts/${network}/WrappedUsdPlusToken.json`)
        }

        let ExchangerUsdPlusWmatic = require(`@/contracts/polygon/HedgeExchangerUsdPlusWmatic.json`);
        let UsdPlusWmaticToken = require(`@/contracts/polygon/RebaseTokenUsdPlusWmatic.json`);

        let ExchangerUsdPlusWbnb = require(`@/contracts/bsc/HedgeExchangerUsdPlusWbnb.json`);
        let UsdPlusWbnbToken = require(`@/contracts/bsc/RebaseTokenUsdPlusWbnb.json`);

        let ExchangerBusdWbnb = require(`@/contracts/bsc/HedgeExchangerBusdWbnb.json`)
        let BusdWbnbToken = require(`@/contracts/bsc/RebaseTokenBusdWbnb.json`)


        let web3 = getters.web3;

        let contracts = {};


        switch (network){
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

        contracts.exchange = _load(Exchange, web3);
        contracts.govToken = _load(OvnToken, web3);
        contracts.governor = _load(OvnGovernor, web3);
        contracts.mark2market = _load(Mark2Market, web3);
        contracts.pm = _load(PortfolioManager, web3);
        contracts.timelockController = _load(TimelockController, web3);
        contracts.usdPlus = _load(UsdPlusToken, web3);
        contracts.preOvn = _load(ERC20, web3, "0x18D4565Cbd03340996BED17e66D154b632f5d4B6");

        if (network !== "avalanche" && network !== "bsc") {
            contracts.market = _load(Market, web3);
            contracts.wUsdPlus = _load(WrappedUsdPlusToken, web3);
        }

        contracts.exchangerUsdPlusWmatic = _load(ExchangerUsdPlusWmatic, web3);
        contracts.usdPlusWmatic = _load(UsdPlusWmaticToken, web3);

        contracts.exchangerUsdPlusWbnb = _load(ExchangerUsdPlusWbnb, web3);
        contracts.usdPlusWbnb = _load(UsdPlusWbnbToken, web3);

        contracts.exchangerBusdWbnb = _load(ExchangerBusdWbnb, web3);
        contracts.busdWbnb = _load(BusdWbnbToken, web3);

        contracts.poolQsUsdPlusWeth = _load(StakingRewards, web3, "0x398B66c4c69Bf19EA6A3c97e8d8b9c93f295D209");
        contracts.poolQsUsdPlusWethToken = _load(ERC20, web3, '0x901Debb34469e89FeCA591f5E5336984151fEc39');
        contracts.poolQsUsdPlusWethPair = _load(UniswapV2Pair, web3, '0x901Debb34469e89FeCA591f5E5336984151fEc39');

        contracts.poolQsUsdPlusWmatic = _load(StakingRewards, web3, "0x6b9cC8Fce435A13bfF67a4c5a70EeED2f3f643e5");
        contracts.poolQsUsdPlusWmaticToken = _load(ERC20, web3, '0x91f670270b86c80ec92bb6b5914e6532ca967bfb');
        contracts.poolQsUsdPlusWmaticPair = _load(UniswapV2Pair, web3, '0x91f670270b86c80ec92bb6b5914e6532ca967bfb');

        commit('setContracts', contracts)
    },


    async setNetwork({commit, dispatch, getters, rootState}, network) {

        switch (network){
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
            case "avax":
            case "avalanche":
            case "43114":
                localStorage.setItem('selectedNetwork', 'avax');
                break;
            case "op":
            case "optimism":
            case "10":
                localStorage.setItem('selectedNetwork', 'op');
                break;
            default:
                localStorage.setItem('selectedNetwork', 'polygon');
                break;
        }

        try {
            await getters.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: getters.web3.utils.toHex(parseInt(network))}],
            });

            commit('setNetworkChanged', 'true');
            commit('setWalletConnected', 'true');
        } catch (switchError) {
            try {
                let params;

                switch (network){
                    case "polygon":
                    case "polygon_dev":
                    case "137":
                    case "31337":
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
                    case "bsc":
                    case "56":
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
                    case "avax":
                    case "avalanche":
                    case "43114":
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
                    case "op":
                    case "optimism":
                    case "10":
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
                    default:
                        break;
                }

                await getters.provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [params],
                });

                commit('setNetworkChanged', 'true');
                commit('setWalletConnected', 'true');
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

    async addUsdPlusWbnbToken({commit, dispatch, getters, rootState}) {

        await getters.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.usdPlusWbnb.options.address,
                        symbol: process.env.VUE_APP_USD_PLUS_WBNB_TOKEN_NAME,
                        decimals: 6,
                        image: UsdPlusWbnbImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('USD+/WBNB successfully added to wallet!')
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addBusdWbnbToken({commit, dispatch, getters, rootState}) {

        await getters.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.busdWbnb.options.address,
                        symbol: process.env.VUE_APP_BUSD_WBNB_TOKEN_NAME,
                        decimals: 6,
                        image: BusdWbnbImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('BUSD/WBNB successfully added to wallet!')
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

    setSwitchToOtherNetwork(state, value) {
        state.switchToOtherNetwork = value;
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


function _load(file, web3, address) {

    let contractConfig = contract(file);

    const {abi} = contractConfig

    if (!address) {
        address = file.address;
    }

    return new web3.eth.Contract(abi, address);
}


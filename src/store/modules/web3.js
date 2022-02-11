import Web3 from "web3";
import Onboard from 'bnc-onboard'
import abiDecoder from "../../plugins/abiDecoder";
import ERC20 from "../../contracts/ERC20.json";

import contract from "@truffle/contract";
import OvnImage from '../../assets/ovn.json';
import UsdPlusImage from '../../assets/usdPlus.json';


const polygon = process.env.VUE_APP_POLYGON;

console.log('Polygon: ' + polygon);

const Exchange = require(`../../contracts/${polygon}/Exchange.json`)
const OvnToken = require(`../../contracts/${polygon}/OvnToken.json`)
const OvnGovernor = require(`../../contracts/${polygon}/OvnGovernor.json`)
const PortfolioManager = require(`../../contracts/${polygon}/PortfolioManager.json`)
const Mark2Market = require(`../../contracts/${polygon}/Mark2Market.json`)
const TimelockController = require(`../../contracts/${polygon}/TimelockController.json`)
const UsdPlusToken = require(`../../contracts/${polygon}/UsdPlusToken.json`)

export const wallets = [
    {
        walletName: "metamask",
        preferred: true
    },
    {
        walletName: "walletConnect",
        rpc: {
            137: 'https://polygon-rpc.com/',
        },
        preferred: true
    },
    {
        walletName: "walletLink",
        rpcUrl: process.env.VUE_APP_RPC_URL,
        appName: process.env.VUE_APP_TITLE,
        preferred: true
    },
    {
        walletName: "binance",
        rpcUrl: process.env.VUE_APP_RPC_URL,
    },
    {
        walletName: 'ledger',
        rpcUrl: process.env.VUE_APP_RPC_URL,
    },
    {
        walletName: "ronin"
    },
];


const state = {
    contracts: null,
    account: null,
    web3: null,
    contractNames: {},
    networkId: null,
    switchToPolygon: false,
    loadingWeb3: true,
    provider: null,
    onboard: null,
    walletConnected: false,
    walletName: null,
    ens: null,
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

    account(state) {
        return state.account;
    },

    contracts(state) {
        return state.contracts;
    },

    contractNames(state) {
        return state.contractNames;
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

    ens(state) {
        return state.ens;
    },
};

const actions = {

    async initOnboard({commit, dispatch, getters}) {

        let onboard = Onboard({
            dappId: 'c81e3c96-54f6-4d82-b911-87dea6376ba4',
            networkId: parseInt(process.env.VUE_APP_NETWORK_ID),
            darkMode: true,
            walletSelect: {
                wallets: wallets,
            },

            subscriptions: {
                ens: async ens => {
                    commit('setEns', ens);
                },

                wallet: async wallet => {
                    commit('setProvider', wallet.provider);

                    await dispatch('initWeb3').then(value => {
                        commit('setWalletConnected', true);
                        commit('setWalletName', wallet.name);
                        localStorage.setItem('walletName', wallet.name);
                        console.log(wallet.name + ' is now connected!');
                    });
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

        if (localStorage.getItem('walletName')) {
            await dispatch('connectWallet');
        }

        let web3;

        if (!getters.provider) {
            let provider = await new Web3.providers.HttpProvider("https://polygon-mainnet.infura.io/v3/66f5eb50848f458cb0f0506cc1036fea");
            web3 = await new Web3(provider);
        } else {
            web3 = await new Web3(getters.provider);
        }

        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec

        let networkId = await web3.eth.net.getId();
        console.log('Network ID ' + networkId)
        commit('setNetworkId', networkId)

        if (getters.provider) {
            getters.provider.on('accountsChanged', function (accounts) {
                let account = accounts[0];
                dispatch('accountChange', account)
            });

            getters.provider.on('networkChanged', function (networkId) {
                networkId = parseInt(networkId)
                commit('setNetworkId', networkId)
                if (networkId === 137 || networkId === 31337) {
                    dispatch('initPolygonData');
                } else {
                    dispatch('profile/resetUserData', null, {root: true})
                    commit('setSwitchToPolygon', true)
                }
            });
        }

        abiDecoder.setUtils(web3.utils);
        abiDecoder.setAbiDecoder(web3.eth.abi);

        console.log('Web3 init completed!')
        commit('setWeb3', web3);

        dispatch('initContracts');
        dispatch('profile/refreshNotUserData', null, {root: true})
        dispatch('gasPrice/refreshGasPrice', null, {root: true})

        if (networkId === 137 || networkId === 31337) {
            dispatch('initPolygonData');
        } else {
            commit('setSwitchToPolygon', true)
        }

        /* Account connected */

        commit('setLoadingWeb3', false);
    },

    async accountChange({commit, dispatch, getters, rootState}, account) {

        commit('setAccount', account);
        if (account) {
            dispatch('profile/refreshUserData', null, {root: true})
            dispatch('transaction/loadTransaction', null, {root: true})
        } else {
            dispatch('profile/resetUserData', null, {root: true})
        }
    },

    async initContracts({commit, dispatch, getters}) {

        let web3 = getters.web3;

        let contracts = {};

        contracts.usdc = _load(ERC20, web3, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174');
        contracts.dai = _load(ERC20, web3, '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063');

        contracts.exchange = _load(Exchange, web3);
        contracts.govToken = _load(OvnToken, web3);
        contracts.governor = _load(OvnGovernor, web3);
        contracts.mark2market = _load(Mark2Market, web3);
        contracts.portfolioManager = _load(PortfolioManager, web3);
        contracts.timelockController = _load(TimelockController, web3);
        contracts.usdPlus = _load(UsdPlusToken, web3);

        commit('setContracts', contracts)
    },


    async initPolygonData({commit, dispatch, getters, rootState}) {
        commit('setSwitchToPolygon', false)
        await getters.web3.eth.getAccounts((error, accounts) => {
            let account = accounts[0];
            dispatch('accountChange', account)
        })
    },

    async setNetwork({commit, dispatch, getters, rootState}, networkId) {

        try {
            await getters.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: getters.web3.utils.toHex(networkId)}],
            });
        } catch (switchError) {
            try {
                let params = {
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

                await getters.provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [params],
                });
            } catch (addError) {
                console.error(addError);
                dispatch('switchAccount');
            }
        }

        let newNetworkId = await getters.web3.eth.net.getId();

        if (newNetworkId === 137) {
            commit('setNetworkId', newNetworkId)
            dispatch('initPolygonData')
        } else {
            commit('setSwitchToPolygon', true)
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

    setAccount(state, account) {
        state.account = account;
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

    setEns(state, value) {
        state.ens = value;
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
    abiDecoder.addABI(file.abi);


    const {abi} = contractConfig

    if (!address) {
        address = file.address;
    }

    state.contractNames[address] = contractConfig.contractName;

    return new web3.eth.Contract(abi, address);
}


import UAuthBncOnboard from "@uauth/bnc-onboard";
import UAuth from "@uauth/js";
import Onboard from "bnc-onboard";


const SUPPORTED_NETWORKS = [137, 31337, 56, 43114, 10];

const state = {
    onboard: null,
    walletConnected: false,
};

const getters = {

    onboard(state) {
        return state.onboard;
    },

    walletConnected(state) {
        return state.walletConnected;
    },
};

const actions = {

    async initOnboard({commit, dispatch, getters, rootState}) {

        let wallets = await dispatch('getMainWalletsConfig');

        let onboard = Onboard({
            dappId: 'c81e3c96-54f6-4d82-b911-87dea6376ba4',
            networkId: rootState.network.networkId,
            darkMode: false,
            walletSelect: {
                wallets: wallets,
            },

            subscriptions: {
                wallet: async wallet => {
                    console.debug('OnBoard: wallet');

                    commit('web3/setProvider', wallet.provider, {root: true});

                    if (rootState.web3.provider) {

                        rootState.web3.provider.on('accountsChanged', function (accounts) {
                            dispatch('checkAccount', accounts[0])
                        });

                        rootState.web3.provider.on('networkChanged', async function (newNetworkId) {

                            if (newNetworkId !== undefined && newNetworkId && newNetworkId !== '') {
                                newNetworkId = parseInt(newNetworkId)
                            } else {
                                let netId = await rootState.web3.web3.eth.net.getId();
                                newNetworkId = parseInt(netId);
                            }

                            if (SUPPORTED_NETWORKS.includes(newNetworkId)) {
                                if (rootState.network.networkId !== newNetworkId) {
                                    dispatch('network/changeDappNetwork', newNetworkId.toString(), {root: true})
                                } else {
                                    commit('network/setSwitchToOtherNetwork', false, {root: true});
                                }

                                dispatch('dappDataAction/updateUserData', null, {root: true});
                            } else {
                                dispatch('dappDataAction/resetUserData', null, {root: true});
                                commit('network/setSwitchToOtherNetwork', true, {root: true});
                            }
                        });
                    }

                    await dispatch('web3/initWeb3', null, {root: true}).then(value => {
                        commit('setWalletConnected', true);

                        localStorage.setItem('walletName', wallet.name);
                        console.log(wallet.name + ' is now connected!');

                        if (wallet.name === 'Unstoppable') {
                            commit('accountData/setUns', wallet.instance.cacheOptions.getDefaultUsername(), {root:true})
                        }

                        commit('accountData/setAccount', wallet.address, {root:true});
                        dispatch('checkAccount')
                    });
                },
            }
        });

        commit('setOnboard', onboard);
    },

    async updateOnboardNetwork({commit, dispatch, getters, rootState}) {

        if (getters.onboard) {
            let wallets = await dispatch('getMainWalletsConfig');

            getters.onboard.networkId = rootState.network.networkId;
            getters.onboard.walletSelect.wallets = wallets;
        }
    },

    async connectWallet({commit, dispatch, getters, rootState}) {

        if (!getters.onboard) {
            await dispatch('initOnboard');
        }

        let walletName = localStorage.getItem('walletName');
        await getters.onboard.walletSelect(walletName ? walletName : '');

        await getters.onboard.walletCheck();
    },

    async disconnectWallet({commit, dispatch, getters, rootState}) {

        if (getters.onboard) {

            await getters.onboard.walletReset();
            localStorage.setItem('walletName', null);

            await dispatch('web3/initWeb3', null, {root: true}).then(value => {
                commit('setWalletConnected', false);
                console.log('Wallet was disconnected');

                dispatch('checkAccount');
            });
        }
    },

    async getMainWalletsConfig({commit, dispatch, getters, rootState}) {
        let rpcUrl = rootState.network.rpcUrl;
        let appApiUrl = rootState.network.appApiUrl;

        const uauthOnboard = await dispatch('getUnstoppableConfig');

        return [
            {
                walletName: "metamask",
                preferred: true
            },
            {
                walletName: "binance",
                rpcUrl: rpcUrl,
                preferred: true
            },
            {
                walletName: "walletConnect",
                rpc: {
                    ['137']: "https://polygon-rpc.com/",
                    ['56']: "https://bsc-dataseed.binance.org",
                    ['43114']: "https://api.avax.network/ext/bc/C/rpc",
                    ['10']: "https://mainnet.optimism.io"
                },
                preferred: true
            },
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
        ];
    },

    async getUnstoppableConfig({commit, dispatch, getters, rootState}) {
        let appApiUrl = rootState.network.appApiUrl;

        // Unstoppable domains config for BNC Onboard
        return new UAuthBncOnboard({
            uauth: new UAuth({
                clientID: process.env.VUE_APP_UD_CLIENT_ID,
                redirectUri: appApiUrl,
                scope: 'openid wallet'
            })
        });
    },

    async checkAccount({commit, dispatch, getters, rootState}, account) {

        if (getters.walletConnected) {
            if (!account) {
                let accounts = await rootState.web3.web3.eth.getAccounts();
                account = accounts[0];
            }

            commit('accountData/setAccount', account, {root: true});

            if (account) {
                dispatch('dappDataAction/updateUserData', null, {root: true});
            } else {
                dispatch('dappDataAction/resetUserData', null, {root: true});
            }
        } else {
            dispatch('dappDataAction/resetUserData', null, {root: true});
            commit('accountData/setAccount', null, {root: true});
            dispatch('statsData/refreshStats', null, {root:true});
        }
    },
};

const mutations = {

    setOnboard(state, value) {
        state.onboard = value;
    },

    setWalletConnected(state, walletConnected) {
        state.walletConnected = walletConnected;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

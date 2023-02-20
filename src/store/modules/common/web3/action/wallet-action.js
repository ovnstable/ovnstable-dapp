import UAuthBncOnboard from "@uauth/bnc-onboard";
import UAuth from "@uauth/js";
import Onboard from "bnc-onboard";


const SUPPORTED_NETWORKS = [137, 31337, 56, 10];

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

                agreement: {
                    version: "1.0.0",
                    termsUrl: "https://docs.overnight.fi/advanced/terms-of-service",
                    privacyUrl: "https://docs.overnight.fi/advanced/privacy-policy",
                },
            },

            subscriptions: {
                wallet: async wallet => {
                    console.log('OnBoard: wallet');

                    await commit('web3/setProvider', wallet.provider, {root: true});
                    await commit('web3/setIsProviderDefault', false, {root: true});

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
                                dispatch('network/saveNetworkToLocalStore', newNetworkId.toString(), {root: true});

                                if (rootState.network.networkId !== newNetworkId) {
                                    dispatch('network/changeDappNetwork', newNetworkId.toString(), {root: true});
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

                    if (wallet.name === 'WalletConnect') {
                        try {
                            let isWalletOk = await getters.onboard.walletCheck();

                            if (!isWalletOk) {
                                try {
                                    await dispatch('web3/initCustomProvider', wallet.provider, {root: true});

                                    let netId = await rootState.web3.web3.eth.net.getId();
                                    if (netId) {
                                        await getters.onboard.config({networkId: netId});
                                    }

                                    isWalletOk = await getters.onboard.walletCheck();
                                } catch (e) {
                                    await commit('web3/setProvider', null, {root: true});
                                }
                            }

                            if (!isWalletOk) {
                                await commit('web3/setProvider', null, {root: true});
                            }
                        } catch (e) {
                            await commit('web3/setProvider', null, {root: true});
                        }
                    }

                    await dispatch('web3/initWeb3', null, {root: true}).then(async value => {

                        if (!rootState.web3.isProviderDefault) {

                            let accounts = await rootState.web3.web3.eth.getAccounts();
                            if (!accounts || accounts.length === 0) {
                                dispatch('checkWallet');
                            }

                            commit('setWalletConnected', true);

                            if (wallet.name !== undefined && wallet.name && wallet.name !== 'undefined') {
                                localStorage.setItem('walletName', wallet.name);
                            }

                            if (wallet.name === 'Unstoppable') {
                                commit('accountData/setUns', wallet.instance.cacheOptions.getDefaultUsername(), {root: true})
                            }

                            commit('accountData/setAccount', wallet.address, {root: true});
                        }

                        dispatch('checkAccount');
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
        console.log('WalletName:', walletName);
        await getters.onboard.walletSelect(walletName ? walletName : '');

        try {
            let netId = await rootState.web3.web3.eth.net.getId();

            if (netId) {
                await getters.onboard.config({ networkId: netId });
            }
        } catch (e) {
        }
    },

    async dappInitWalletConnect({commit, dispatch, getters, rootState}) {

        if (!getters.onboard) {
            await dispatch('initOnboard');
        }

        let walletName = localStorage.getItem('walletName');

        if (walletName !== undefined && walletName && walletName !== 'undefined') {
            await getters.onboard.walletSelect(walletName);
        }
    },

    async disconnectWallet({commit, dispatch, getters, rootState}) {

        await commit('web3/setProvider', null, {root: true});

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

        // Unstoppable domains config for BNC Onboard
        const uauthOnboard = new UAuthBncOnboard({
                uauth: new UAuth({
                    clientID: process.env.VUE_APP_UD_CLIENT_ID,
                    redirectUri: process.env.VUE_APP_UD_REDIRECT_URI,
                    scope: 'openid wallet'
                })
            });

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
            {
                walletName: "gnosis",
                preferred: false
            },
        ];
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
            dispatch('insuranceData/refreshInsurance', null, {root:true});
        }
    },

    async checkWallet({commit, dispatch, getters, rootState}) {
        if (getters.onboard) {
            await getters.onboard.walletCheck();
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

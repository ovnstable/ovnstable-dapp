import injectedModule, {ProviderLabel} from '@web3-onboard/injected-wallets'

import Onboard from "@web3-onboard/core";
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import ledgerModule from '@web3-onboard/ledger'
import trezorModule from '@web3-onboard/trezor'
import gnosisModule from '@web3-onboard/gnosis'
// import argentModule from "@web3-onboard/argent";


const SUPPORTED_NETWORKS = [137, 31337, 56, 10, 42161, 324];

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
        let logo = '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
            '<path fill-rule="evenodd" clip-rule="evenodd" d="M37.8983 10.1017H12.8136V4H37.8983C41.2682 4 44 6.73182 44 10.1017H37.8983ZM37.8983 12.8136L37.8983 37.8983V44C41.2682 44 44 41.2682 44 37.8983V12.8136H37.8983ZM10.1017 37.8983L35.1864 37.8983V44H10.1017C6.73182 44 4 41.2682 4 37.8983H10.1017ZM10.1017 4V10.1017V35.1864H4V10.1017C4 6.73182 6.73182 4 10.1017 4Z" fill="url(#paint0_linear_1709_151660)"/>\n' +
            '<path fill-rule="evenodd" clip-rule="evenodd" d="M23.0046 16.2031C22.618 16.2031 22.3046 16.5165 22.3046 16.9031V21.6269H17.5809C17.1943 21.6269 16.8809 21.9403 16.8809 22.3269L16.8809 24.9947C16.8809 25.3812 17.1943 25.6947 17.5809 25.6947H22.3046V30.4184C22.3046 30.805 22.618 31.1184 23.0046 31.1184H25.6724C26.059 31.1184 26.3724 30.805 26.3724 30.4184V25.6947H31.0961C31.4827 25.6947 31.7961 25.3812 31.7961 24.9947V22.3269C31.7961 21.9403 31.4827 21.6269 31.0961 21.6269H26.3724V16.9031C26.3724 16.5165 26.059 16.2031 25.6724 16.2031H23.0046Z" fill="url(#paint1_linear_1709_151660)"/>\n' +
            '<defs>\n' +
            '<linearGradient id="paint0_linear_1709_151660" x1="4" y1="4" x2="44.8582" y2="4.89675" gradientUnits="userSpaceOnUse">\n' +
            '<stop stop-color="#28A0F0"/>\n' +
            '<stop offset="1" stop-color="#0678C4" stop-opacity="0.9917"/>\n' +
            '</linearGradient>\n' +
            '<linearGradient id="paint1_linear_1709_151660" x1="16.8809" y1="16.2031" x2="32.1161" y2="16.5375" gradientUnits="userSpaceOnUse">\n' +
            '<stop stop-color="#28A0F0"/>\n' +
            '<stop offset="1" stop-color="#0678C4" stop-opacity="0.9917"/>\n' +
            '</linearGradient>\n' +
            '</defs>\n' +
            '</svg>'

        console.log("Init new Onboard")

        let wallets = await dispatch('getMainWalletsConfig');
        let chains = await dispatch('getMainWalletsChains');

        let onboard =  Onboard({
            // ... other Onboard options
            wallets: wallets,
            appMetadata: {
                name: 'Overnight Finance`',
                icon: logo, // svg string icon
                logo: logo, // svg string logo
                description: 'Overnight Finance',
                agreement: {
                    version: "1.0.0",
                    termsUrl: "https://docs.overnight.fi/advanced/terms-of-service",
                    privacyUrl: "https://docs.overnight.fi/advanced/privacy-policy",
                },
            },
            disableFontDownload: true,
            connect: {
                showSidebar: false,
                // autoConnectLastWallet: true,
            },
            accountCenter: {
                desktop: {
                    enabled: false,
                },
                mobile: {
                    enabled: false,
                }
            },
            notify: {
                desktop: {
                    enabled: false,
                },
                mobile: {
                    enabled: false,
                }
            },
            chains: chains,
        });

        console.log("walletConnect onboard before connect wallet: ")
        const connectedWallets = await onboard.connectWallet()
        console.log("walletConnect onboard after connect wallet ", connectedWallets)

        let wallet = connectedWallets[0];
        console.log('initOnboard: wallet: ', wallet);

        await commit('web3/setProvider', wallet.provider, {root: true});
        await commit('web3/setIsProviderDefault', false, {root: true});

        if (rootState.web3.provider) {

            console.log("====== Init inboard Provider callbacks ======")
            rootState.web3.provider.on('accountsChanged', async function (accounts) {
                console.log("====== initOnboard Provider callback accountsChanged ======", accounts[0], parseInt(await rootState.web3.web3.eth.net.getId()))
                try {
                    dispatch('checkAccount', accounts[0]);
                    dispatch('setNetwork', parseInt(await rootState.web3.web3.eth.net.getId()));
                } catch (e) {
                    console.error("Error when on accountsChanged")
                }

            });

            rootState.web3.provider.on('networkChanged', async function (newNetworkId) {
                console.log("====== initOnboard Provider callback networkChanged ======")
                try {
                    dispatch('setNetwork', newNetworkId);
                } catch (e) {
                    console.error("Error when on networkChanged")
                }
            });
        }

        console.log("Wallet, wallet label: ", wallet.label, wallet.label === 'WalletConnect');

        await dispatch('web3/initWeb3', null, {root: true}).then(async value => {
            console.log("====== initOnboard Provider callback initWeb3 initWeb3 ======", wallet)
            console.log("====== initOnboard Provider callback initWeb3 initWeb3 provider ======", rootState.web3, rootState.web3.isProviderDefault)

            if (!rootState.web3.isProviderDefault) {

                let accounts = await rootState.web3.web3.eth.getAccounts();
                if (!accounts || accounts.length === 0) {
                    dispatch('checkWallet');
                }

                commit('setWalletConnected', true);

                if (wallet.label !== undefined && wallet.label && wallet.label !== 'undefined') {
                    localStorage.setItem('walletName', wallet.label);
                }

                if (wallet.label === 'Unstoppable') {
                    commit('accountData/setUns', wallet.instance.cacheOptions.getDefaultUsername(), {root: true})
                }

                console.log("====== initOnboard Provider callback initWeb3 setAccount ======", wallet.address)
                commit('accountData/setAccount', wallet.address, {root: true});
            }

            dispatch('checkAccount');
        });

        commit('setOnboard', onboard);
    },

    async updateOnboardNetwork({commit, dispatch, getters, rootState}) {

        if (getters.onboard) {
            let wallets = await dispatch('getMainWalletsConfig');

            getters.onboard.networkId = rootState.network.networkId;
            console.log("updateOnboardNetwork")
            // await getters.onboard.connectWallet()
        }
    },

    async connectWallet({commit, dispatch, getters, rootState}) {
        console.log("connectWallet")

        if (!getters.onboard) {
            await dispatch('initOnboard');
        }

        let walletName = localStorage.getItem('walletName');
        console.log('Old WalletName:', walletName);
        // await getters.onboard.walletSelect(walletName ? walletName : '');
        let connectedWallets = await getters.onboard.connectWallet()
        let wallet = connectedWallets[0];
        if (wallet.label !== undefined && wallet.label && wallet.label !== 'undefined') {
            localStorage.setItem('walletName', wallet.label);
            console.log('New WalletName:', wallet.label);
        }

        try {
            let netId = await rootState.web3.web3.eth.net.getId();

            if (netId) {
                await getters.onboard.setChain({ chainId: netId });
            }
        } catch (e) {
            console.log('Wallet not connected: ', e)
        }
    },

    async dappInitWalletConnect({commit, dispatch, getters, rootState}) {

        if (!getters.onboard) {
            await dispatch('initOnboard');
        }

        let walletName = localStorage.getItem('walletName');

        if (walletName !== undefined && walletName && walletName !== 'undefined') {
            console.log("dappInitWalletConnect", getters.onboard)
            // await getters.onboard.connectWallet()
        }
    },

    async disconnectWallet({commit, dispatch, getters, rootState}) {

        await commit('web3/setProvider', null, {root: true});

        if (getters.onboard) {

            const [primaryWallet] = getters.onboard.state.get().wallets
            await getters.onboard.disconnectWallet({ label: primaryWallet.label });

            localStorage.removeItem('walletName');

            await dispatch('web3/initWeb3', null, {root: true}).then(value => {
                commit('setWalletConnected', false);
                console.log('Wallet was disconnected');

                dispatch('checkAccount');
            });
        }
    },

    async getMainWalletsChains({commit, dispatch, getters, rootState}) {
        return [
            {
                id: 10,  // = 10
                // id: "0xA",  // = 10
                token: "ETH",
                label: "Optimism",
                rpcUrl: "https://mainnet.optimism.io",
            },
            {
                id: 42161,  // = 42161
                // id: "0xA4B1",  // = 42161
                token: "ETH",
                label: "Arbitrum",
                rpcUrl: "https://arb1.arbitrum.io/rpc",
            },
            {
                id: 324,  // = 324
                // id: "0x144",  // = 324
                token: "ETH",
                label: "ZkSync",
                rpcUrl: "https://mainnet.era.zksync.io",
            },
            // {
            //     id: 280,  // = 280
            //     // id: '0x118',  // = 280
            //     token: 'ETH',
            //     label: 'zkSync Goerli',
            //     rpcUrl: 'https://zksync2-testnet.zksync.dev'
            // },
            {
                id: 56,  // = 56
                // id: "0x38",  // = 56
                token: "BNB",
                label: "BSC",
                rpcUrl: "https://bsc-dataseed.binance.org",
            },
            {
                id: 137,  // = 137
                // id: "0x89",  // = 137
                token: "MATIC",
                label: "Polygon",
                rpcUrl: "https://polygon-rpc.com/",
            },
            // ... other chains
        ]
    },

    async getMainWalletsConfig({commit, dispatch, getters, rootState}) {
        let rpcUrl = rootState.network.rpcUrl;
        let appApiUrl = rootState.network.appApiUrl;

        const injected = injectedModule({
            // display all wallets even if they are unavailable
            displayUnavailable: false,
            // but only show Binance and Bitski wallet if they are available
            filter: {
                [ProviderLabel.Binance]: 'unavailable',
                [ProviderLabel.Bitski]: 'unavailable'
            },
            sort: (wallets) => {
                const metaMask = wallets.find(({ label }) => label === ProviderLabel.MetaMask)
                const coinbase = wallets.find(({ label }) => label === ProviderLabel.Coinbase)

                return (
                    [
                        metaMask,
                        coinbase,
                        ...wallets.filter(
                            ({ label }) => label !== ProviderLabel.MetaMask && label !== ProviderLabel.Coinbase
                        )
                    ]
                        // remove undefined values
                        .filter((wallet) => wallet)
                )
            },
            walletUnavailableMessage: (wallet) => `Oops ${wallet.label} is unavailable!`

        })

        const wcInitOptions = {
            qrcodeModalOptions: {
                mobileLinks: ['metamask', 'argent', 'trust']
            },
            connectFirstChainId: true
        }

/*
        const wcInitOptions = {
            version: 2,
            /!**
             * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
             *!/
            projectId: "699fb1306e95ed8b837fd8962c633422",
        }
*/

        const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: true });
        const walletConnect = await walletConnectModule(wcInitOptions);
        const ledger = ledgerModule();
        const gnosis = gnosisModule();
        const trezor = trezorModule({
            appUrl: appApiUrl.replaceAll('/api', ''),
            email: 'ovnstable@gmail.com',
        })

        // const argent = argentModule();

        console.log("walletConnect onboard get all active wallets: ", walletConnect);

        return [
            injected,
            walletConnect,
            coinbaseWalletSdk,
            // argent,
            ledger,
            trezor,
            gnosis,
            // ... other wallets
        ];
    },

    async setNetwork({commit, dispatch, getters, rootState}, newNetworkId){
        {
            console.log("======  Provider setNetwork  ======")

            if (newNetworkId !== undefined && newNetworkId && newNetworkId !== '') {
                newNetworkId = parseInt(newNetworkId)
            } else {
                let netId = await rootState.web3.web3.eth.net.getId();
                newNetworkId = parseInt(netId);
            }

            if (SUPPORTED_NETWORKS.includes(newNetworkId)) {
                console.log("======  Provider callback networkChanged SUPPORTED_NETWORKS ======")

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
        }
    },

    async checkAccount({commit, dispatch, getters, rootState}, account) {
        console.log("checkAccount: ", account, getters.walletConnected)

        if (getters.walletConnected) {
            if (!account) {
                console.log("Account not exist: ", rootState.web3)
                console.log("Account not exist: ", rootState.web3.web3)
                try {
                    let accounts = await rootState.web3.web3.eth.getAccounts();
                    account = accounts[0];
                } catch (e) {
                    console.error('CheckAccount Error: ', e)
                    if (e && e.message && e.message.indexOf('disconnected') !== -1) {
                        commit('setWalletConnected', false);
                    }

                    return;
                }
            }

            console.log("Account: ", account)
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
            // await getters.onboard.walletCheck();
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

import injectedModule, {ProviderLabel} from '@web3-onboard/injected-wallets'

import Onboard from "@web3-onboard/core";
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import trezorModule from '@web3-onboard/trezor'
import gnosisModule from '@web3-onboard/gnosis'
import WalletConnectProvider from "@walletconnect/web3-provider";

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
        let logo = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">/n' +
            '<path fill-rule="evenodd" clip-rule="evenodd" d="M24.339 7.66102H9.28814V4H24.339C26.3608 4 27.9998 5.63889 28 7.66064H24.339L24.339 7.66102ZM24.339 8.88136V24.339L24.339 24.3394L24.339 28C26.3609 28 28 26.3609 28 24.339L28 9.28776H24.339L24.339 8.88136ZM23.1186 24.339V24.3394H22.7119V28H7.66102C5.63909 28 4 26.3609 4 24.339H7.66102H23.1186ZM7.66102 4V7.66102V22.7119H4V7.66102C4 5.63909 5.63909 4 7.66102 4Z" fill="url(#paint0_linear_8985_99599)"/>/n' +
            '<path fill-rule="evenodd" clip-rule="evenodd" d="M15.6827 11.3223C15.2961 11.3223 14.9827 11.6357 14.9827 12.0223V14.5764L12.4285 14.5764C12.0419 14.5764 11.7285 14.8898 11.7285 15.2764V16.3171C11.7285 16.7037 12.0419 17.0171 12.4285 17.0171H14.9827V19.5714C14.9827 19.958 15.2961 20.2714 15.6827 20.2714H16.7234C17.11 20.2714 17.4234 19.958 17.4234 19.5714V17.0171H19.9777C20.3643 17.0171 20.6777 16.7037 20.6777 16.3171V15.2764C20.6777 14.8898 20.3643 14.5764 19.9777 14.5764L17.4234 14.5764V12.0223C17.4234 11.6357 17.11 11.3223 16.7234 11.3223H15.6827Z" fill="url(#paint1_linear_8985_99599)"/>/n' +
            '<defs>/n' +
                '<linearGradient id="paint0_linear_8985_99599" x1="4" y1="4" x2="28.5149" y2="4.53805" gradientUnits="userSpaceOnUse">/n' +
                    '<stop stop-color="#28A0F0"/>/n' +
                    '<stop offset="1" stop-color="#0678C4" stop-opacity="0.9917"/>/n' +
                '</linearGradient>/n' +
                '<linearGradient id="paint1_linear_8985_99599" x1="11.7285" y1="11.3223" x2="20.8697" y2="11.5229" gradientUnits="userSpaceOnUse">/n' +
                    '<stop stop-color="#28A0F0"/>/n' +
                    '<stop offset="1" stop-color="#0678C4" stop-opacity="0.9917"/>/n' +
                '</linearGradient>/n' +
            '</defs>/n' +
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
            i18n: {
                en: {
                    connect: {
                        selectingWallet: {
                            header: "Available wallets",
                            installWallet: "You do not have any wallets installed that {app}",

                            agreement: {
                                agree: "I have read and accept",
                                terms: "Overnight's Terms of Service",
                                and: "and",
                                privacy: "Privacy Policy"
                            },
                        },
                    },
                }
            },
            disableFontDownload: true,
            connect: {
                showSidebar: true,
                disableClose: false,
                // autoConnectLastWallet: true,
                // autoConnectAllPreviousWallet: true,
                // iDontHaveAWalletLink: '',
                // wheresMyWalletLink: '',
                // disableUDResolution: false,
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

        let walletName = localStorage.getItem('walletName');
        console.log("walletConnect onboard before connect wallet: ", walletName)
        let connectedWallets;
        if (walletName !== undefined && walletName && walletName !== 'undefined' && walletName !== 'null') {
            console.log("onboard with preview wallet: ", walletName)
            connectedWallets = await onboard.connectWallet({ autoSelect: { label: walletName, disableModals: true }});
        } else {
            console.log("onboard with new select wallet: ")
            connectedWallets = await onboard.connectWallet();
        }

        console.log("walletConnect onboard after connect wallet ", connectedWallets)

        let wallet = connectedWallets[0];
        console.log('initOnboard: wallet: ', wallet);

        if (!wallet) {
            localStorage.removeItem('walletName');
            console.error("Wallet not connected when init onboard.")
            return;
        }

        await commit('web3/setProvider', wallet.provider, {root: true});
        await commit('web3/setIsProviderDefault', false, {root: true});

        if (rootState.web3.provider) {

            console.log("====== Init inboard Provider callbacks ======")
            rootState.web3.provider.on('accountsChanged', async function (accounts) {
                dispatch('accountChanged', accounts);
            });

            rootState.web3.provider.on('networkChanged', async function (newNetworkId) {
                dispatch('networkChanged', newNetworkId);
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

        try {
            let netId = await rootState.web3.web3.eth.net.getId();

            if (netId) {
                if (getters.onboard) {
                    await getters.onboard.setChain({ chainId: netId });
                }
            }
        } catch (e) {
            console.log('Wallet not connected: ', e)
            await dispatch('initOnboard');
        }
    },

    async dappInitWalletConnect({commit, dispatch, getters, rootState}) {

        if (!getters.onboard) {
            await dispatch('initOnboard');
        }

        let walletName = localStorage.getItem('walletName');
        if (walletName !== undefined && walletName && walletName !== 'undefined') {
            console.log("dappInitWalletConnect", getters.onboard, walletName);
            await getters.onboard.connectWallet({ autoSelect: { label: walletName, disableModals: true }});
        }
    },

    async disconnectWallet({commit, dispatch, getters, rootState}) {

        await commit('web3/setProvider', null, {root: true});

        if (getters.onboard) {
            try {

                const [primaryWallet] = getters.onboard.state.get().wallets
                console.log('Disconnect wallet onboard: ', getters.onboard);
                await getters.onboard.disconnectWallet({ label: primaryWallet.label });
                localStorage.removeItem('walletName');

                await dispatch('web3/initWeb3', null, {root: true}).then(value => {
                    commit('setWalletConnected', false);
                    console.log('Wallet was disconnected');

                    dispatch('checkAccount');
                });
            } catch (e) {
                console.log("Disconnect wallet error", e);
            }
        }
    },

    async getMainWalletsChains({commit, dispatch, getters, rootState}) {
        return [

            {
                id: 42161,  // = 42161
                // id: "0xA4B1",  // = 42161
                token: "ETH",
                label: "Arbitrum",
                rpcUrl: "https://arb1.arbitrum.io/rpc",
            },
            {
                id: 10,  // = 10
                // id: "0xA",  // = 10
                token: "ETH",
                label: "Optimism",
                rpcUrl: "https://mainnet.optimism.io",
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

    async getCustomWallets({commit, dispatch, getters, rootState}) {
        let customWallets = []; // include custom (not natively supported) injected wallet modules here

        //  Create WalletConnect Provider for argent
        const wcprovider = new WalletConnectProvider({
            // infuraId: "ee707251f43f41ae98103e051eed7580",
            // rpc: 'https://mainnet.era.zksync.io'
            rpc: {
                ['324']: "https://mainnet.era.zksync.io",
                ['42161']: "https://arb1.arbitrum.io/rpc",
                ['10']: "https://mainnet.optimism.io",
                ['56']: "https://bsc-dataseed.binance.org",
                ['137']: "https://polygon-rpc.com/"
            },
            chainId: 324
        });


        const customArgent = {
            // The label that will be displayed in the wallet selection modal
            label: 'Argent',
            // The property on the window where the injected provider is defined
            // Example: window.ethereum
            injectedNamespace: 'ethereum',
            // A function that returns a bool indicating whether or not the provider is
            // of a certain identity. In this case, a unique property on the provider
            // is used to identify the provider.
            // In most cases this is in the format: is<provider-name>.
            // You may also include custom logic here if checking for the property
            // isn't sufficient.
            checkProviderIdentity: ({ provider }) => true, //!!provider && !!provider[ProviderIdentityFlag.MetaMask],

            // A method that returns a string of the wallet icon which will be displayed
            getIcon: async () => "https://images.prismic.io/argentwebsite/313db37e-055d-42ee-9476-a92bda64e61d_logo.svg?auto=format%2Ccompress&amp;fit=max&amp;q=50",
            // Returns a valid EIP1193 provider. In some cases the provider will need to be patched to satisfy the EIP1193 Provider interface
            getInterface: async ({ chains }) => {
                // wcprovider.enable();
                const [chain] = chains;
                console.log("Argent provider chains: ", chains, chain)
                // const { getEthereumProvider } = await import('@argent/login');
                const { createEIP1193Provider } = await import('@web3-onboard/common');
                // const ethereumProvider = await getEthereumProvider({
                //     chainId: parseInt(chain.id),
                //     rpcUrl: chain.rpcUrl,
                //     wcprovider,
                // });

                wcprovider.onConnect(async data => {
                    console.log("WalletConnect for Argent CONNECTED!", data);
                    localStorage.setItem('walletName', 'WalletConnect');
                    window.location.reload();
                })

                console.log("====== Init Onboard ARGENT Provider callbacks ======")
                wcprovider.on('accountsChanged', async function (accounts) {
                    dispatch('accountChanged', accounts);

                    // console.log("====== initOnboard ARGENT Provider callback accountsChanged ======", accounts[0], parseInt(await rootState.web3.web3.eth.net.getId()))
                    //
                    // try {
                    //     dispatch('setNetwork', parseInt(await rootState.web3.web3.eth.net.getId()));
                    //     commit('accountData/setAccount', accounts[0], {root: true});
                    //     console.log("Argent: account set to:", accounts[0]);
                    // } catch (e) {
                    //     console.error("Error when on accountsChanged")
                    // }

                });

                wcprovider.on('networkChanged', async function (newNetworkId) {
                    dispatch('networkChanged', newNetworkId);
                });

                await wcprovider.enable();

                const provider = createEIP1193Provider(wcprovider, {
                    eth_chainId: async ({ baseRequest }) => {
                        const chainId = await baseRequest({ method: 'eth_chainId' });
                        console.log("Chain it from provider: ", chainId)
                        return `0x${parseInt(324).toString(16)}`;
                    }
                });
                console.log("Argent provider: ", provider)
                console.log("Argent  wcprovider provider: ", wcprovider)
                return { provider };
            },
            // A list of platforms that this wallet supports
            platforms: ['desktop']
        }

        let networkId = rootState.network.networkId;
        if (networkId === 324) {
            // argent only on ZkSync Network
            customWallets.push(customArgent);
        }

        return customWallets;
    },

    async getMainWalletsConfig({commit, dispatch, getters, rootState}) {
        let rpcUrl = rootState.network.rpcUrl;
        let appApiUrl = rootState.network.appApiUrl;

        let customWallets = await dispatch('getCustomWallets');

        const injected = injectedModule({
            custom: customWallets,
            // display all wallets even if they are unavailable
            displayUnavailable: true,
            // but only show Binance and Bitski wallet if they are available
            filter: {
                [ProviderLabel.Binance]: 'unavailable',
                [ProviderLabel.Bitski]: 'unavailable',
                [ProviderLabel.Zerion]: 'unavailable',
                [ProviderLabel.AlphaWallet]: 'unavailable',
                [ProviderLabel.ApexWallet]: 'unavailable',
                [ProviderLabel.AToken]: 'unavailable',
                [ProviderLabel.BifrostWallet]: 'unavailable',
                [ProviderLabel.Brave]: 'unavailable',
                [ProviderLabel.BitKeep]: 'unavailable',
                [ProviderLabel.Core]: 'unavailable',
                [ProviderLabel.Dcent]: 'unavailable',
                [ProviderLabel.Zeal]: 'unavailable',
                [ProviderLabel.XDEFI]: 'unavailable',
                [ProviderLabel.WalletIo]: 'unavailable',
                [ProviderLabel.TP]: 'unavailable',
                [ProviderLabel.TokenPocket]: 'unavailable',
                [ProviderLabel.Tokenary]: 'unavailable',
                [ProviderLabel.Tally]: 'unavailable',
                [ProviderLabel.Status]: 'unavailable',
                [ProviderLabel.Sequence]: 'unavailable',
                [ProviderLabel.Rainbow]: 'unavailable',
                [ProviderLabel.Phantom]: 'unavailable',
                [ProviderLabel.OwnBit]: 'unavailable',
                [ProviderLabel.Opera]: 'unavailable',
                [ProviderLabel.OneInch]: 'unavailable',
                [ProviderLabel.OKXWallet]: 'unavailable',
                [ProviderLabel.MyKey]: 'unavailable',
                [ProviderLabel.MeetOne]: 'unavailable',
                [ProviderLabel.MathWallet]: 'unavailable',
                [ProviderLabel.Liquality]: 'unavailable',
                [ProviderLabel.InfinityWallet]: 'unavailable',
                [ProviderLabel.ImToken]: 'unavailable',
                [ProviderLabel.HyperPay]: 'unavailable',
                [ProviderLabel.HuobiWallet]: 'unavailable',
                [ProviderLabel.GameStop]: 'unavailable',
                [ProviderLabel.Frontier]: 'unavailable',
                [ProviderLabel.Frame]: 'unavailable',
                [ProviderLabel.Exodus]: 'unavailable',
                [ProviderLabel.Enkrypt]: 'unavailable',
                [ProviderLabel.DeFiWallet]: 'unavailable',
                [ProviderLabel.Rabby]: 'unavailable',
                [ProviderLabel.BlockWallet]: 'unavailable',
                [ProviderLabel.SafePal]: 'unavailable',
                [ProviderLabel.Trust]: 'unavailable',
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
                mobileLinks: ['metamask', 'trust', 'rainbow', 'zerion', "argent", "imtoken", "pillar"] // 'argent',
            },
            connectFirstChainId: true,
            requiredChains: SUPPORTED_NETWORKS
        }

/*        const wcInit2Options = {
            version: 2,
            // /!**
            //  * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
            //  *!/
            projectId: "699fb1306e95ed8b837fd8962c633422",
        }*/

        const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: true });
        const walletConnect = await walletConnectModule(wcInitOptions);
        /*const gnosis = gnosisModule({
            whitelistedDomains: ['app.safe.global']
        });
        const trezor = trezorModule({
            appUrl: appApiUrl.replaceAll('/api', ''),
            email: 'ovnstable@gmail.com',
        })*/

        // const argent = argentModule(walletConnect);

        return [
            injected,
            walletConnect,
            coinbaseWalletSdk,
            // argent,
            // trezor,
            // gnosis,
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

    async networkChanged({commit, dispatch, getters, rootState}, newNetworkId) {
        console.log("====== initOnboard Provider callback networkChanged ======")
        try {
            dispatch('setNetwork', newNetworkId);
        } catch (e) {
            console.error("Error when on networkChanged")
        }
    },

    async accountChanged({commit, dispatch, getters, rootState}, accounts) {
        console.log("====== initOnboard Provider callback accountsChanged ======", accounts[0], parseInt(await rootState.web3.web3.eth.net.getId()))
        try {
            dispatch('checkAccount', accounts[0]);
            dispatch('setNetwork', parseInt(await rootState.web3.web3.eth.net.getId()));
        } catch (e) {
            console.error("Error when on accountsChanged")
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

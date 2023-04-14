import Web3 from "web3";


const SUPPORTED_NETWORKS = [137, 31337, 56, 10, 42161, 324];

const state = {
    contracts: null,
    web3: null,
    provider: null,

    loadingWeb3: true,
    isProviderDefault: true,
};

const getters = {

    provider(state) {
        return state.provider;
    },

    web3(state) {
        return state.web3;
    },

    contracts(state) {
        return state.contracts;
    },

    loadingWeb3(state) {
        return state.loadingWeb3;
    },

    isProviderDefault(state) {
        return state.isProviderDefault;
    },
};

const actions = {

    async initDefaultProvider({commit, dispatch, getters, rootState}) {

        let rpcUrl = rootState.network.rpcUrl;
        let web3;

        let provider = await new Web3.providers.HttpProvider(rpcUrl);
        web3 = await new Web3(provider);
        console.log('InitWeb3: Provider default');

        commit('setIsProviderDefault', true);
        commit('setProvider', provider);
        commit('setWeb3', web3);
    },

    async initCustomProvider({commit, dispatch, getters, rootState}, provider) {

        let web3 = await new Web3(provider);
        console.log('InitWeb3: Provider custom');

        console.log("initWeb3 Provider: ", rootState.network.networkName, getters.provider);
        dispatch('network/saveNetworkToLocalStore', rootState.network.networkName, {root: true});

        commit('setIsProviderDefault', false);
        commit('setProvider', provider);
        commit('setWeb3', web3);
    },

    async initWeb3({commit, dispatch, getters, rootState}) {
        commit('setLoadingWeb3', true);

        if (getters.provider === undefined || getters.provider === null || getters.isProviderDefault) {
            await dispatch('initDefaultProvider');
        } else {
            try {
                await dispatch('initCustomProvider', getters.provider);
            } catch (e) {
                await dispatch('initDefaultProvider');
            }
        }

        await dispatch('contractAction/initContracts', null, {root: true});

        dispatch('dappUIAction/updateDappPages', null, {root: true});
        dispatch('gasPrice/refreshGasPrice', null, {root: true})
        dispatch('insuranceData/refreshInsurance', null, {root: true})

        if (!getters.isProviderDefault) {
            let currentWalletNetworkId = await getters.web3.eth.net.getId();
            currentWalletNetworkId = parseInt(currentWalletNetworkId);

            if (SUPPORTED_NETWORKS.includes(currentWalletNetworkId)) {
                commit('network/setSwitchToOtherNetwork', false, {root: true});

                if (currentWalletNetworkId !== rootState.network.networkId) {
                    dispatch('network/changeDappNetwork', currentWalletNetworkId.toString(), {root: true});
                }
            } else {
                commit('network/setSwitchToOtherNetwork', true, {root: true});
            }
        }

        commit('setLoadingWeb3', false);
    },
};

const mutations = {

    setProvider(state, provider) {
        state.provider = provider;
    },

    setWeb3(state, web3) {
        state.web3 = web3;
    },

    setContracts(state, contracts) {
        state.contracts = contracts;
    },

    setLoadingWeb3(state, value) {
        state.loadingWeb3 = value;
    },

    setIsProviderDefault(state, value) {
        state.isProviderDefault = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

import Web3 from "web3";


const state = {
    contracts: null,
    web3: null,
    provider: null,

    loadingWeb3: true,
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
};

const actions = {

    async initWeb3({commit, dispatch, getters, rootState}) {

        commit('setLoadingWeb3', true);

        let rpcUrl = rootState.network.rpcUrl;
        let web3;

        if (!getters.provider) {
            let provider = await new Web3.providers.HttpProvider(rpcUrl);
            web3 = await new Web3(provider);
            console.debug('InitWeb3: Provider default');
        } else {
            web3 = await new Web3(getters.provider);
            console.debug('InitWeb3: Provider Custom');
        }

        commit('setWeb3', web3);

        await dispatch('contractAction/initContracts', null, {root: true});

        dispatch('dappUIAction/updateDappPages', null, {root: true});
        dispatch('gasPrice/refreshGasPrice', null, {root: true})

        let currentWalletNetworkId = await web3.eth.net.getId();

        if (parseInt(currentWalletNetworkId) === rootState.network.networkId) {
            commit('network/setSwitchToOtherNetwork', false, {root: true});
        } else {
            commit('network/setSwitchToOtherNetwork', false, {root: true});
            dispatch('network/changeDappNetwork', currentWalletNetworkId.toString(), {root: true});
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
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
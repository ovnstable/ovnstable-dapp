import {ethers} from "ethers";

const state = {
    provider: null,
};

const getters = {

    provider(state) {
        return state.provider;
    },
};

const actions = {

    async initProvider({commit, dispatch, getters, rootState}) {
        let rpcUrl = rootState.network.rpcUrl;
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

        commit('setProvider', provider)
    },

    async mineBlocks({commit, dispatch, getters, rootState}, count){
       await getters.provider.send('evm_mine' );
    }
};

const mutations = {

    setProvider(state, value) {
        state.provider = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};




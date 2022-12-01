const state = {

    totalSupply: {},
};

const getters = {

    totalSupply(state) {
        return state.totalSupply;
    },
};

const actions = {

    async refreshSupply({commit, dispatch, getters, rootState}) {

        console.debug('Supply: refreshSupply');

        let networkId = rootState.network.networkId;

        let resultSupply = {};
        let web3 = rootState.web3;

        let etsList = rootState.etsAction.etsList;

        for (let i = 0; i < etsList.length; i++) {
            let ets = etsList[i];
            let etsSupply = null;

            if (ets.chain === networkId) {
                try {
                    etsSupply = await web3.contracts[ets.tokenContract].methods.totalSupply().call();
                    etsSupply = web3.web3.utils.fromWei(etsSupply, ets.etsTokenDecimals === 18 ? 'ether' : 'mwei');
                } catch (e) {
                    try {
                        etsSupply = rootState.marketData.etsStrategyData[ets.name].tvl;
                    } catch (ex) {
                    }
                }
            } else {
                try {
                    etsSupply = rootState.marketData.etsStrategyData[ets.name].tvl;
                } catch (ex) {
                }
            }

            resultSupply[ets.name] = etsSupply;
        }

        commit('setTotalSupply', resultSupply);
    },
};

const mutations = {

    setTotalSupply(state, value) {
        state.totalSupply = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

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

        let resultSupply = {};
        let web3 = rootState.web3;

        let etsList = rootState.etsAction.etsList;

        for (let i = 0; i < etsList.length; i++) {
            let ets = etsList[i];
            let etsSupply;

            try {
                etsSupply = await web3.contracts[ets.tokenContract].methods.totalSupply().call();
                etsSupply = web3.web3.utils.fromWei(etsSupply, 'mwei');
            } catch (e) {
                console.log(e)
                etsSupply = rootState.marketData.etsStrategyData[ets.name].tvl;
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

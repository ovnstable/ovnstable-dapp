import BN from "bn.js";

const state = {

    totalSupply: {
        usdPlusWmatic: 0,
    },

    maxUsdPlusWmaticSupply: 250000.00,
};

const getters = {

    totalSupply(state) {
        return state.totalSupply;
    },

    maxUsdPlusWmaticSupply(state) {
        return state.maxUsdPlusWmaticSupply;
    },
};

const actions = {

    async resetSupply({commit, dispatch, getters}) {

        console.log('Supply: resetSupply');

        commit('setTotalSupply', {
            usdPlusWmatic: 0,
        });

    },

    async refreshSupply({commit, dispatch, getters, rootState}) {

        console.log('Supply: refreshSupply');

        let web3 = rootState.web3;
        let usdPlusWmatic;

        try {
            usdPlusWmatic = await web3.contracts.usdPlusWmatic.methods.totalSupply().call();
        } catch (e) {
            console.log('ERROR: ' + e)
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                usdPlusWmatic = await web3.contracts.usdPlusWmatic.methods.totalSupply().call();
            } catch (e) {
                console.log('ERROR: ' + e)
                await new Promise(resolve => setTimeout(resolve, 2000));
                usdPlusWmatic = await web3.contracts.usdPlusWmatic.methods.totalSupply().call();
            }
        }

        usdPlusWmatic = web3.web3.utils.fromWei(usdPlusWmatic, 'mwei') ;

        commit('setTotalSupply', {
            usdPlusWmatic: usdPlusWmatic,
        })

        console.log("Supply: " + usdPlusWmatic)
    },
};

const mutations = {

    setTotalSupply(state, totalSupply) {
        state.totalSupply = totalSupply;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

import BN from "bn.js";

const state = {

    totalSupply: {
        usdPlusWmatic: 0,
        usdPlusWbnb: 0,
    },

    maxUsdPlusWmaticSupply: 125000.00,
    maxUsdPlusWbnbSupply: 485000.00,
};

const getters = {

    totalSupply(state) {
        return state.totalSupply;
    },

    maxUsdPlusWmaticSupply(state) {
        return state.maxUsdPlusWmaticSupply;
    },

    maxUsdPlusWbnbSupply(state) {
        return state.maxUsdPlusWbnbSupply;
    },
};

const actions = {

    async resetSupply({commit, dispatch, getters}) {

        console.log('Supply: resetSupply');

        commit('setTotalSupply', {
            usdPlusWmatic: 0,
            usdPlusWbnb: 0,
        });

    },

    async refreshSupply({commit, dispatch, getters, rootState}) {

        console.log('Supply: refreshSupply');

        let web3 = rootState.web3;
        let usdPlusWmatic;
        let usdPlusWbnb;

        try {
            usdPlusWmatic = await web3.contracts.usdPlusWmatic.methods.totalSupply().call();
        } catch (e) {
            console.log('ERROR: ' + e)
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                usdPlusWmatic = await web3.contracts.usdPlusWmatic.methods.totalSupply().call();
            } catch (e) {
                console.log('ERROR: ' + e)
            }
        }

        try {
            usdPlusWmatic = web3.web3.utils.fromWei(usdPlusWmatic, 'mwei') ;
        } catch (e) {
            console.log('ERROR: ' + e)
        }


        try {
            usdPlusWbnb = await web3.contracts.usdPlusWbnb.methods.totalSupply().call();
        } catch (e) {
            console.log('ERROR: ' + e)
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                usdPlusWbnb = await web3.contracts.usdPlusWbnb.methods.totalSupply().call();
            } catch (e) {
                console.log('ERROR: ' + e)
            }
        }

        try {
            usdPlusWbnb = web3.web3.utils.fromWei(usdPlusWbnb, 'mwei') ;
        } catch (e) {
            console.log('ERROR: ' + e)
        }

        commit('setTotalSupply', {
            usdPlusWmatic: usdPlusWmatic,
            usdPlusWbnb: usdPlusWbnb,
        })
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

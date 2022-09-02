import BN from "bn.js";

const state = {

    totalSupply: {
        usdPlusWmatic: 0,
        usdPlusWbnb: 0,
        busdWbnb: 0,
    },

    maxUsdPlusWmaticSupply: 275000.00,
    maxUsdPlusWbnbSupply: 500000.00,
    maxBusdWbnbSupply: 10000.00,
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

    maxBusdWbnbSupply(state) {
        return state.maxBusdWbnbSupply;
    },
};

const actions = {

    async resetSupply({commit, dispatch, getters}) {

        console.log('Supply: resetSupply');

        commit('setTotalSupply', {
            usdPlusWmatic: 0,
            usdPlusWbnb: 0,
            busdWbnb: 0,
        });

    },

    async refreshSupply({commit, dispatch, getters, rootState}) {

        console.log('Supply: refreshSupply');

        let web3 = rootState.web3;
        let usdPlusWmatic;
        let usdPlusWbnb;
        let busdWbnb;

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
            busdWbnb = await web3.contracts.busdWbnb.methods.totalSupply().call();
        } catch (e) {
            console.log('ERROR: ' + e)
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                busdWbnb = await web3.contracts.busdWbnb.methods.totalSupply().call();
            } catch (e) {
                console.log('ERROR: ' + e)
            }
        }

        try {
            usdPlusWbnb = web3.web3.utils.fromWei(usdPlusWbnb, 'mwei') ;
            busdWbnb = web3.web3.utils.fromWei(busdWbnb, 'mwei') ;
        } catch (e) {
            console.log('ERROR: ' + e)
        }

        commit('setTotalSupply', {
            usdPlusWmatic: usdPlusWmatic,
            usdPlusWbnb: usdPlusWbnb,
            busdWbnb: busdWbnb,
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

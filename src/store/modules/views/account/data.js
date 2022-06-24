import BN from "bn.js";

const state = {

    balance: {
        usdPlus: 0,
        usdc: 0,
        WUsdPlus: 0,
    },

    account: null,

};

const getters = {

    balance(state) {
        return state.balance;
    },

    account(state) {
        return state.account;
    },

};

const actions = {

    async resetBalance({commit, dispatch, getters}) {

        console.log('AccountData: resetBalance');

        commit('setBalance', {
            usdPlus: 0,
            usdc: 0,
            WUsdPlus: 0
        });

    },


    async refreshBalance({commit, dispatch, getters, rootState}) {

        console.log('AccountData: refreshBalance');


        if (getters.account === null || getters.account === undefined){
            return;
        }

        commit('accountUI/setLoadingBalance', true, { root: true })
        let web3 = rootState.web3;

        let usdPlus;
        let usdc;
        /* TODO: remove value, it's for test */
        let WUsdPlus = new BN(10000000);

        /* TODO: add getting WUsdPlus balance */
        try {
            usdc = await web3.contracts.usdc.methods.balanceOf(getters.account).call();
        } catch (e) {
            console.log('ERROR: ' + e)
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                usdc = await web3.contracts.usdc.methods.balanceOf(getters.account).call();
            } catch (e) {
                console.log('ERROR: ' + e)
                await new Promise(resolve => setTimeout(resolve, 2000));
                usdc = await web3.contracts.usdc.methods.balanceOf(getters.account).call();
            }
        }

        try {
            usdPlus = await web3.contracts.usdPlus.methods.balanceOf(getters.account).call();
        } catch (e) {
            console.log('ERROR: ' + e)
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                usdPlus = await web3.contracts.usdPlus.methods.balanceOf(getters.account).call();
            } catch (e) {
                console.log('ERROR: ' + e)
                await new Promise(resolve => setTimeout(resolve, 2000));
                usdPlus = await web3.contracts.usdPlus.methods.balanceOf(getters.account).call();
            }
        }

        usdPlus = web3.web3.utils.fromWei(usdPlus, 'mwei') ;
        usdc = web3.web3.utils.fromWei(usdc, 'mwei') ;
        WUsdPlus = web3.web3.utils.fromWei(WUsdPlus, 'mwei') ;
        commit('setBalance', {
            usdPlus: usdPlus,
            usdc: usdc,
            WUsdPlus: WUsdPlus
        })

        commit('accountUI/setLoadingBalance', false, { root: true })
    },
};

const mutations = {

    setBalance(state, balance) {
        state.balance = balance;
    },

    setAccount(state, account) {
        state.account = account;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

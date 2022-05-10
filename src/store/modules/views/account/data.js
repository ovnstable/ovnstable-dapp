const state = {

    balance: {
        usdPlus: 0,
        usdc: 0,
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
            usdc: 0
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

        usdPlus = usdPlus / 10 ** 6;
        usdc = usdc / 10 ** 6;
        commit('setBalance', {
            usdPlus: usdPlus,
            usdc: usdc
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

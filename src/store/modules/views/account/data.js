import BN from "bn.js";

const state = {

    balance: {
        usdPlus: 0,
        usdc: 0,
        wUsdPlus: 0,
    },

    account: null,

    uns: null,

};

const getters = {

    balance(state) {
        return state.balance;
    },

    account(state) {
        return state.account;
    },

    uns(state) {
        return state.uns;
    }

};

const actions = {

    async resetBalance({commit, dispatch, getters}) {

        console.log('AccountData: resetBalance');

        commit('setBalance', {
            usdPlus: 0,
            usdc: 0,
            wUsdPlus: 0
        });

    },

    async resetUns({commit, dispatch, getters}) {

        console.log('AccountData: resetUns');

        commit('setUns', null);
        
    },


    async refreshBalance({commit, dispatch, getters, rootState}) {

        console.log('AccountData: refreshBalance');


        if (getters.account === null || getters.account === undefined){
            return;
        }

        commit('accountUI/setLoadingBalance', true, { root: true })
        let web3 = rootState.web3;

        const networkId = Number.parseInt(process.env.VUE_APP_NETWORK_ID);

        let usdPlus;
        let usdc;
        let wUsdPlus;

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

        if (networkId === 137) {
            try {
                wUsdPlus = await web3.contracts.wUsdPlus.methods.balanceOf(getters.account).call();
            } catch (e) {
                console.log('ERROR: ' + e)
                await new Promise(resolve => setTimeout(resolve, 2000));
                try {
                    wUsdPlus = await web3.contracts.wUsdPlus.methods.balanceOf(getters.account).call();
                } catch (e) {
                    console.log('ERROR: ' + e)
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    wUsdPlus = await web3.contracts.wUsdPlus.methods.balanceOf(getters.account).call();
                }
            }
        }

        usdPlus = web3.web3.utils.fromWei(usdPlus, 'mwei') ;
        usdc = web3.web3.utils.fromWei(usdc, 'mwei') ;

        if (networkId === 137) {
            wUsdPlus = web3.web3.utils.fromWei(wUsdPlus, 'mwei') ;
        }

        commit('setBalance', {
            usdPlus: usdPlus,
            usdc: usdc,
            wUsdPlus: wUsdPlus
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

    setUns(state, uns) {
        state.uns = uns;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

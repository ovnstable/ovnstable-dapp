const state = {

    balance: {
        usdPlus: 0,
        asset: 0,
        wUsdPlus: 0
    },

    etsBalance: {},

    account: null,

    uns: null,
};

const getters = {

    balance(state) {
        return state.balance;
    },

    etsBalance(state) {
        return state.etsBalance;
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

        console.debug('AccountData: resetBalance');

        commit('setBalance', {
            usdPlus: 0,
            asset: 0,
            wUsdPlus: 0
        });
    },

    async resetUns({commit, dispatch, getters}) {

        console.debug('AccountData: resetUns');

        commit('setUns', null);
    },


    async refreshBalance({commit, dispatch, getters, rootState}) {

        console.debug('AccountData: refreshBalance');

        if (getters.account === null || getters.account === undefined){
            return;
        }

        commit('accountUI/setLoadingBalance', true, { root: true })
        let web3 = rootState.web3;

        let networkId = rootState.network.networkId;
        let assetDecimals = rootState.network.assetDecimals;

        let usdPlus;
        let asset;
        let wUsdPlus;

        try {
            asset = await web3.contracts.asset.methods.balanceOf(getters.account).call();
            asset = asset ? web3.web3.utils.fromWei(asset, assetDecimals === 18 ? 'ether' : 'mwei') : null;
        } catch (e) {
        }

        try {
            usdPlus = await web3.contracts.usdPlus.methods.balanceOf(getters.account).call();
            usdPlus = usdPlus ? web3.web3.utils.fromWei(usdPlus, 'mwei') : usdPlus;
        } catch (e) {
        }

        if (networkId === 137 || networkId === 10) {
            try {
                wUsdPlus = await web3.contracts.wUsdPlus.methods.balanceOf(getters.account).call();
                wUsdPlus = wUsdPlus ? web3.web3.utils.fromWei(wUsdPlus, 'mwei') : null;
            } catch (e) {
            }
        }

        commit('setBalance', {
            usdPlus: usdPlus,
            asset: asset,
            wUsdPlus: wUsdPlus,
        })


        let resultEtsBalance = {};
        let etsList = rootState.etsAction.etsList;

        if (etsList) {
            for (let i = 0; i < etsList.length; i++) {
                let ets = etsList[i];
                let etsBalance;

                try {
                    etsBalance = await web3.contracts[ets.tokenContract].methods.balanceOf(getters.account).call();
                    etsBalance = web3.web3.utils.fromWei(etsBalance, 'mwei');
                } catch (e) {
                }

                resultEtsBalance[ets.name] = etsBalance;
            }
        }

        commit('setEtsBalance', resultEtsBalance);

        commit('accountUI/setLoadingBalance', false, { root: true })
    },
};

const mutations = {

    setBalance(state, value) {
        state.balance = value;
    },

    setEtsBalance(state, value) {
        state.etsBalance = value;
    },

    setAccount(state, value) {
        state.account = value;
    },

    setUns(state, value) {
        state.uns = value;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

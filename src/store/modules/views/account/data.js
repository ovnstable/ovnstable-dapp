const state = {

    balance: {
        usdPlus: 0,
        asset: 0,
        wUsdPlus: 0,
        usdPlusWmatic: 0,
        usdPlusWbnb: 0,
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
            asset: 0,
            wUsdPlus: 0,
            usdPlusWmatic: 0,
            usdPlusWbnb: 0,
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

        let networkId = rootState.network.networkId;
        let assetDecimals = rootState.network.assetDecimals;

        let usdPlus;
        let asset;
        let wUsdPlus;
        let usdPlusWmatic;
        let usdPlusWbnb;

        try {
            asset = await web3.contracts.asset.methods.balanceOf(getters.account).call();
        } catch (e) {
            console.log('ERROR: ' + e)
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                asset = await web3.contracts.asset.methods.balanceOf(getters.account).call();
            } catch (e) {
                console.log('ERROR: ' + e)
                await new Promise(resolve => setTimeout(resolve, 2000));
                asset = await web3.contracts.asset.methods.balanceOf(getters.account).call();
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

        if (networkId === 137 || networkId === 10) {
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

        if (web3.contracts.usdPlusWmatic && networkId === 137) {
            try {
                usdPlusWmatic = await web3.contracts.usdPlusWmatic.methods.balanceOf(getters.account).call();
            } catch (e) {
                console.log('ERROR: ' + e)
                await new Promise(resolve => setTimeout(resolve, 2000));
                try {
                    usdPlusWmatic = await web3.contracts.usdPlusWmatic.methods.balanceOf(getters.account).call();
                } catch (e) {
                    console.log('ERROR: ' + e)
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    usdPlusWmatic = await web3.contracts.usdPlusWmatic.methods.balanceOf(getters.account).call();
                }
            }
        }

        if (web3.contracts.usdPlusWbnb && networkId === 56) {
            try {
                usdPlusWbnb = await web3.contracts.usdPlusWbnb.methods.balanceOf(getters.account).call();
            } catch (e) {
                console.log('ERROR: ' + e)
                await new Promise(resolve => setTimeout(resolve, 2000));
                try {
                    usdPlusWbnb = await web3.contracts.usdPlusWbnb.methods.balanceOf(getters.account).call();
                } catch (e) {
                    console.log('ERROR: ' + e)
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    usdPlusWbnb = await web3.contracts.usdPlusWbnb.methods.balanceOf(getters.account).call();
                }
            }
        }

        usdPlus = web3.web3.utils.fromWei(usdPlus, 'mwei') ;

        if (usdPlusWmatic && networkId === 137) {
            usdPlusWmatic = web3.web3.utils.fromWei(usdPlusWmatic, 'mwei') ;
        }

        if (usdPlusWbnb && networkId === 56) {
            usdPlusWbnb = web3.web3.utils.fromWei(usdPlusWbnb, 'mwei') ;
        }

        if (assetDecimals === 18) {
            asset = web3.web3.utils.fromWei(asset, 'ether') ;
        } else {
            asset = web3.web3.utils.fromWei(asset, 'mwei') ;
        }

        if (wUsdPlus && (networkId === 137 || networkId === 10)) {
            wUsdPlus = web3.web3.utils.fromWei(wUsdPlus, 'mwei') ;
        }

        commit('setBalance', {
            usdPlus: usdPlus,
            asset: asset,
            wUsdPlus: wUsdPlus,
            usdPlusWmatic: usdPlusWmatic,
            usdPlusWbnb: usdPlusWbnb
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

const state = {

    balance: {},
    actionAssetBalance: {},
    etsBalance: {},
    insuranceBalance: {},

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

    insuranceBalance(state) {
        return state.insuranceBalance;
    },

    actionAssetBalance(state) {
        return state.actionAssetBalance;
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

        commit('setBalance', {});
        commit('setEtsBalance', {});
        commit('setInsuranceBalance', {});
        commit('setActionAssetBalance', {});
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
            asset = getters.balance.asset;
        }

        try {
            usdPlus = await web3.contracts.usdPlus.methods.balanceOf(getters.account).call();
            usdPlus = usdPlus ? web3.web3.utils.fromWei(usdPlus, 'mwei') : usdPlus;
        } catch (e) {
            usdPlus = getters.usdPlus.asset;
        }

        if (networkId === 137 || networkId === 10) {
            try {
                wUsdPlus = await web3.contracts.wUsdPlus.methods.balanceOf(getters.account).call();
                wUsdPlus = wUsdPlus ? web3.web3.utils.fromWei(wUsdPlus, 'mwei') : null;
            } catch (e) {
                wUsdPlus = getters.wUsdPlus.asset;
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

                if (ets.chain === networkId) {
                    try {
                        etsBalance = await web3.contracts[ets.tokenContract].methods.balanceOf(getters.account).call();
                        etsBalance = web3.web3.utils.fromWei(etsBalance, ets.etsTokenDecimals === 18 ? 'ether' : 'mwei');
                    } catch (e) {
                        try {
                            etsBalance = getters.etsBalance[ets.name];
                        } catch (ex) {
                        }
                    }

                    resultEtsBalance[ets.name] = etsBalance;
                }
            }
        }

        commit('setEtsBalance', resultEtsBalance);


        let resultInsuranceBalance = {};
        let insuranceList = [
            {
                chainName: 'polygon',
                chainId: 137,
            }
        ];

        if (insuranceList) {
            for (let i = 0; i < insuranceList.length; i++) {
                let insurance = insuranceList[i];
                let insuranceBalance;

                if (insurance.chainId === networkId) {
                    try {
                        insuranceBalance = await web3.contracts.insurance[insurance.chainName + '_token'].methods.balanceOf(getters.account).call();
                        insuranceBalance = web3.web3.utils.fromWei(insuranceBalance, 'mwei');
                    } catch (e) {
                        try {
                            insuranceBalance = getters.insuranceBalance[insurance.chainName];
                        } catch (ex) {
                        }
                    }

                    resultInsuranceBalance[insurance.chainName] = insuranceBalance;
                }
            }
        }

        commit('setInsuranceBalance', resultInsuranceBalance);


        let resultActionAssetBalance = {};

        if (etsList) {
            for (let i = 0; i < etsList.length; i++) {
                let ets = etsList[i];
                let actionAssetBalance;

                if (!resultActionAssetBalance[ets.actionAsset]) {
                    try {
                        actionAssetBalance = await web3.contracts[ets.actionAsset].methods.balanceOf(getters.account).call();

                        switch (ets.actionTokenDecimals) {
                            case 6:
                                actionAssetBalance = web3.web3.utils.fromWei(actionAssetBalance, 'mwei');
                                break;
                            case 8:
                                actionAssetBalance = parseFloat(web3.web3.utils.fromWei(actionAssetBalance, 'mwei')) / 100.0;
                                break;
                            case 18:
                                actionAssetBalance = web3.web3.utils.fromWei(actionAssetBalance, 'ether');
                                break;
                            default:
                                break;
                        }
                    } catch (e) {
                    }

                    resultActionAssetBalance[ets.actionAsset] = actionAssetBalance;
                }
            }
        }

        commit('setActionAssetBalance', resultActionAssetBalance);

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

    setInsuranceBalance(state, value) {
        state.insuranceBalance = value;
    },

    setAccount(state, value) {
        state.account = value;
    },

    setUns(state, value) {
        state.uns = value;
    },

    setActionAssetBalance(state, value) {
        state.actionAssetBalance = value;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

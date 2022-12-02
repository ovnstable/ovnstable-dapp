const state = {

    totalSupply: {},
    totalInsuranceSupply: {},
};

const getters = {

    totalSupply(state) {
        return state.totalSupply;
    },

    totalInsuranceSupply(state) {
        return state.totalInsuranceSupply;
    },
};

const actions = {

    async refreshSupply({commit, dispatch, getters, rootState}) {

        console.debug('Supply: refreshSupply');

        let networkId = rootState.network.networkId;

        let resultSupply = {};
        let web3 = rootState.web3;

        let etsList = rootState.etsAction.etsList;

        for (let i = 0; i < etsList.length; i++) {
            let ets = etsList[i];
            let etsSupply = null;

            if (ets.chain === networkId) {
                try {
                    etsSupply = await web3.contracts[ets.tokenContract].methods.totalSupply().call();
                    etsSupply = web3.web3.utils.fromWei(etsSupply, ets.etsTokenDecimals === 18 ? 'ether' : 'mwei');
                } catch (e) {
                    try {
                        etsSupply = rootState.marketData.etsStrategyData[ets.name].tvl;
                    } catch (ex) {
                    }
                }
            } else {
                try {
                    etsSupply = rootState.marketData.etsStrategyData[ets.name].tvl;
                } catch (ex) {
                }
            }

            resultSupply[ets.name] = etsSupply;
        }

        commit('setTotalSupply', resultSupply);
    },

    async refreshInsuranceSupply({commit, dispatch, getters, rootState}) {

        console.debug('Supply: refreshInsuranceSupply');

        let networkId = rootState.network.networkId;

        let resultSupply = {};
        let web3 = rootState.web3;

        let insuranceList = [
            {
                chainName: 'polygon',
                chainId: 137,
            },
        ];

        for (let i = 0; i < insuranceList.length; i++) {
            let insurance = insuranceList[i];
            let supply;

            if (insurance.chainId === networkId) {
                try {
                    supply = await web3.contracts.insurance[insurance.chainName + '_m2m'].methods.totalNetAssets().call()
                    supply = web3.web3.utils.fromWei(supply,   'mwei');
                } catch (e) {
                    supply = rootState.insuranceData.insuranceStrategyData[insurance.chainName].lastTvl;
                }
            } else {
                supply = rootState.insuranceData.insuranceStrategyData[insurance.chainName].lastTvl;
            }

            resultSupply[insurance.chainName] = supply;
        }

        commit('setTotalInsuranceSupply', resultSupply);
    },
};

const mutations = {

    setTotalSupply(state, value) {
        state.totalSupply = value;
    },

    setTotalInsuranceSupply(state, value) {
        state.totalInsuranceSupply = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

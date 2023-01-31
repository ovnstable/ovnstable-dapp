import moment from "moment";

const state = {
    poolList: null,
};

const getters = {

    poolList(state) {
        return state.poolList;
    },
};

const actions = {
    async getPoolList({commit, dispatch, getters, rootState}) {

        let list = [];
        let networkConfigList = [rootState.network.opConfig, rootState.network.polygonConfig, rootState.network.bscConfig];

        for (let networkConfig of networkConfigList) {

            let fetchOptions = {
                headers: {
                    "Access-Control-Allow-Origin": networkConfig.appApiUrl
                }
            };

            await fetch(networkConfig.appApiUrl + '/pools/all', fetchOptions)
                .then(value => value.json())
                .then(value => {
                    if (value) {
                        value.forEach(pool => {

                            let token0Icon;
                            let token1Icon;

                            let tokenNames = pool.id.name.split('/');

                            try {
                                token0Icon = require('@/assets/currencies/farm/' + tokenNames[0] + '.svg');
                            } catch (e) {
                                try {
                                    token0Icon = require('@/assets/currencies/farm/' + tokenNames[0] + '.png');
                                } catch (ex) {
                                    token0Icon = require('@/assets/currencies/undefined.svg');
                                }
                            }

                            try {
                                token1Icon = require('@/assets/currencies/farm/' + tokenNames[1] + '.svg');
                            } catch (e) {
                                try {
                                    token1Icon = require('@/assets/currencies/farm/' + tokenNames[1] + '.png');
                                } catch (ex) {
                                    token1Icon = require('@/assets/currencies/undefined.svg');
                                }
                            }

                            if (pool && pool.tvl && pool.tvl >= 10000.00) {
                                list.push({
                                    name: pool.id.name,
                                    token0Icon: token0Icon,
                                    token1Icon: token1Icon,
                                    chain: networkConfig.networkId,
                                    chainName: networkConfig.networkName,
                                    address: pool.id.address,
                                    dex: pool.platform,
                                    tvl: pool.tvl,
                                    explorerUrl: networkConfig.explorerUrl,
                                });
                            }
                        })
                    }
                }).catch(reason => {
                    console.log('Error get data: ' + reason);
                })
        }

        console.log("setPoolList", list);

        await commit('setPoolList', list);
    },
};

const mutations = {

    setPoolList(state, value) {
        state.poolList = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

import {axios} from "@/plugins/http-axios";

const state = {
    poolList: null,
};

const getters = {

    poolList(state) {
        return state.poolList;
    },
};

const actions = {

    async refreshFarm({commit, dispatch, getters, rootState}) {
        console.debug('FarmData: refreshFarm');
        dispatch('loadPoolList');
    },

    async loadPoolList({commit, dispatch, getters, rootState}) {
        console.debug('Farm: loadPoolList');

        let poolList = [];

        let networkId = rootState.network.networkId;
        let appApiUrl = rootState.network.appApiUrl;

        if (networkId === 137) {

            let pools = (await axios.get(appApiUrl + '/pools?tvl=2000')).data;
            pools.sort((a,b) => b.tvl - a.tvl);

            pools.forEach(item => {

                let token0Icon;
                let token1Icon;

                let tokenNames = item.id.name.split('/');

                try {
                    token0Icon = require('@/assets/currencies/farm/' + tokenNames[0] + '.svg');
                } catch (e) {
                    console.error("Error while getting coin icon")
                    token0Icon = require('@/assets/currencies/undefined.svg');
                }

                try {
                    token1Icon = require('@/assets/currencies/farm/' + tokenNames[1] + '.svg');
                } catch (e) {
                    console.error("Error while getting coin icon")
                    token1Icon = require('@/assets/currencies/undefined.svg');
                }

                poolList.push(
                    {
                        chainIcon: require('@/assets/network/polygon.svg'),
                        platform: item.platform,
                        name: item.id.name,
                        link: item.id.address,
                        tvl: item.tvl,
                        token0Icon: token0Icon,
                        token1Icon: token1Icon,
                    }
                )
            });
        }

        commit('setPoolList', poolList);
    },
};

const mutations = {

    setPoolList(state, poolList) {
        state.poolList = poolList;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

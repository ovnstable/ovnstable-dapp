import {axios} from "@/plugins/http-axios";
import moment from "moment";

const state = {

    wmaticStrategyData: null,
};

const getters = {

    wmaticStrategyData(state) {
        return state.wmaticStrategyData;
    },
};

const actions = {

    async refreshMarket({commit, dispatch, getters, rootState}) {
        console.log('MarketData: refreshMarket');

        dispatch('refreshStrategyData');
        dispatch('accountData/refreshBalance', null, {root:true});
    },

    async refreshStrategyData({commit, dispatch, getters, rootState}) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": process.env.VUE_APP_API
            }
        };

        let avgApy;

        await fetch(process.env.VUE_APP_API + '/widget/avg-apy-info/week', fetchOptions)
            .then(value => value.json())
            .then(value => {
                avgApy = value;
                avgApy.date = moment(this.avgApy.date).format("DD MMM. ‘YY");
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        let mockWmaticStrategyData = {
            "name": "USD+/WMATIC",
            "exchangerAddress": "0x4b5e0af6AE8Ef52c304CD55f546342ca0d3050bf",
            "rebaseAddress": "0xfec31BC5e213615b013Eb58f1B8185868Ee4BD12",
            "strategyAddress": "0xEb7f1622980bfF682635E35076bd3115814254A7",
            "apy": -22.83,
            "diffApy": (avgApy && avgApy.value) ? (-22.8362398972 - avgApy.value) : null,
            "tvl": 4.99,
            "holders": 1,
            "fees": [
                {
                    "id": "buy",
                    "value": 0.04
                },
                {
                    "id": "redeem",
                    "value": 0.04
                },
                {
                    "id": "tvl",
                    "value": 1
                },
                {
                    "id": "profit",
                    "value": 10
                }
            ],
            "targetHealthFactor": 1.5,
            "healthFactorCheckInterval": 24
        };

        commit('setWmaticStrategyData', mockWmaticStrategyData);
    },
};

const mutations = {

    setWmaticStrategyData(state, wmaticStrategyData) {
        state.wmaticStrategyData = wmaticStrategyData;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

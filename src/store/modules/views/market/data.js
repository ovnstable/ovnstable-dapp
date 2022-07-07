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
        let wmaticStrategyData;

        await fetch(process.env.VUE_APP_API + '/widget/avg-apy-info/week', fetchOptions)
            .then(value => value.json())
            .then(value => {
                avgApy = value;
                avgApy.date = moment(this.avgApy.date).format("DD MMM. ‘YY");
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        await fetch(process.env.VUE_APP_API + '/hedge-strategies/0x4b5e0af6AE8Ef52c304CD55f546342ca0d3050bf', fetchOptions)
            .then(value => value.json())
            .then(value => {
                wmaticStrategyData = value;
                wmaticStrategyData.diffApy = (avgApy && avgApy.value) ? (wmaticStrategyData.apy - avgApy.value) : null;
            }).catch(reason => {
                console.log('Error get data: ' + reason);
            })

        commit('setWmaticStrategyData', wmaticStrategyData);
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

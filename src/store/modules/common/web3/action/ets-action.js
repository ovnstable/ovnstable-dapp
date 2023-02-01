import loadJSON from '@/utils/http-utils.js'

const state = {
    etsNames: [
        'wbnb_busd',
        'wmatic_usd_plus',
        'ruby',
        'night_ov_ar',
        'qs_alpha_wbnb_busd',
        'qs_alpha_wmatic_usdc',
        'qs_beta_wmatic_usdc',
        'qs_gamma_weth_usdc',
        'qs_delta_weth_usdc',
        'qs_zeta_wbtc_usdc',
        'qs_epsilon_weth_dai',
        'uni_eta_wmatic_usdc',
        'uni_alpha_weth_usdc',
        'uni_beta_weth_dai',
        'uni_gamma_weth_dai',
        'ar_delta_weth_dai',
        'uni_theta_weth_usdc',
    ],
    etsList: null,
};

const getters = {

    etsNames(state) {
        return state.etsNames;
    },

    etsList(state) {
        return state.etsList;
    },
};

const actions = {
    async initEtsList({commit, dispatch, getters, rootState}) {

        let list = [];

        for (let i = 0; i < getters.etsNames.length; i++) {
            let ets = await loadJSON('/json/ets/' + getters.etsNames[i] + '.json');

            // May add some fields

            list.push(ets);
        }

        await commit('setEtsList', list);
    },
};

const mutations = {

    setEtsList(state, value) {
        state.etsList = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

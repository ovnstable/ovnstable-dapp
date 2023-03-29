const state = {};

const getters = {};

const actions = {

    async updateDappPages({commit, dispatch, getters, rootState}) {

        let network = rootState.network.networkName;

        switch (network) {
            case "polygon":
            case "polygon_dev":
            case "137":
            case "31337":
                dispatch('wrapUI/showPage', null, {root: true});
                break;
            case "bsc":
            case "56":
                dispatch('wrapUI/hidePage', null, {root: true});
                break;
            case "op":
            case "optimism":
            case "10":
                dispatch('wrapUI/showPage', null, {root: true});
                break;
            case "ar":
            case "arbitrum":
            case "42161":
                dispatch('wrapUI/showPage', null, {root: true});
                break;
            case "zk":
            case "zksync":
            case "324":
                dispatch('wrapUI/showPage', null, {root: true});
                break;
            default:
                break;
        }
    },
};

const mutations = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

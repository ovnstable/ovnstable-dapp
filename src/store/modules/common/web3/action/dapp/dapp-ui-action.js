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
                dispatch('farmUI/hidePage', null, {root: true});
                dispatch('wrapUI/showPage', null, {root: true});
                break;
            case "bsc":
            case "56":
                dispatch('farmUI/hidePage', null, {root: true});
                dispatch('wrapUI/hidePage', null, {root: true});
                break;
            case "avax":
            case "avalanche":
            case "43114":
                dispatch('farmUI/hidePage', null, {root: true});
                dispatch('wrapUI/hidePage', null, {root: true});
                break;
            case "op":
            case "optimism":
            case "10":
                dispatch('farmUI/hidePage', null, {root: true});
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

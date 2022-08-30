const state = {
    overcapWallets: [
        "0x92b8f9fe69D7A0fF316De2FbEADd1a5c29f774eC",
        "0xeFf441b2b30027cd15D350726B37F1B38EC1b955",
        "0x48D3d39e0F5160CE0FB801f5DF6B1B8f6ae456b4",
        "0xF4B67f83a65500D2692e2637acFe382cE09fC90b",

        "0x60937f599bD7bc95B7A0C4E3B4398A09a8706E7f",
        "0x5D43042986FD8c06bF7526724f7c0052DF7fB011",
        "0x098462d91f5118Df60c4Ac70D86750e5DF67aBc3",
    ],

    walletOvercapLimit : 5000.0,

    showOvercapBanner: true,
};

const getters = {
    overcapWallets(state) {
        return state.overcapWallets;
    },

    showOvercapBanner(state) {
        return state.showOvercapBanner;
    },

    walletOvercapLimit(state) {
        return state.walletOvercapLimit;
    },

    totalOvercap(state) {
        return state.overcapWallets.length * state.walletOvercapLimit;
    },

    isOvercapAvailable(state, getters, rootState, rootGetters) {
        let result = false;

        try {
            result = state.overcapWallets.includes(rootGetters["accountData/account"]);
        } catch (e) {
            result = false;
        }

        return result;
    },
};

const actions = {
    async useOvercap({commit, dispatch, getters, rootState}, request) {

        if (request.overcapLeft != null && parseFloat(request.overcapLeft) >= parseFloat(request.overcapVolume)) {
            let overcapRemainingValue = parseFloat(request.overcapLeft) - parseFloat(request.overcapVolume);
            localStorage.setItem('overcapRemaining', overcapRemainingValue.toString());
        }
    },

    async returnOvercap({commit, dispatch, getters, rootState}, request) {
        if (request.overcapLeft != null) {
            let overcapRemainingValue = parseFloat(request.overcapLeft) + parseFloat(request.overcapVolume);
            localStorage.setItem('overcapRemaining', Math.min(overcapRemainingValue, getters.walletOvercapLimit).toString());
        }
    },

    async closeOvercapBanner({commit, dispatch, getters, rootState}) {
        commit('setShowOvercapBanner', false);
        localStorage.setItem('showOvercapModal', "false");
    },
};

const mutations = {
    setShowOvercapBanner(state, value) {
        state.showOvercapBanner = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

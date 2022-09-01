const state = {
    overcapWallets: {
        "0x92b8f9fe69D7A0fF316De2FbEADd1a5c29f774eC": 5000,
        "0xeFf441b2b30027cd15D350726B37F1B38EC1b955": 5000,
        "0x48D3d39e0F5160CE0FB801f5DF6B1B8f6ae456b4": 5000,
        "0xF4B67f83a65500D2692e2637acFe382cE09fC90b": 5000,

        "0x60937f599bD7bc95B7A0C4E3B4398A09a8706E7f": 5000,
        "0x5D43042986FD8c06bF7526724f7c0052DF7fB011": 5000,
        "0x098462d91f5118Df60c4Ac70D86750e5DF67aBc3": 5000,
        "0x8d7A429b0b6284806bCd50809c52bA60e849A0F4": 5000,

        "0xc8d8C6e2EeEFe61d526Ae81a68cd4a33C4671391": 5000,
        "0x5C3d14e1DA2D26A86f46CBb8c05F51F9ff199390": 5000,
        "0xE6c9D9A6e53453574CB6467117bA482B8304bF36": 5000,
        "0x5959b0D9d9f7995747582E66E9A42D69ae356FBC": 5000,
        "0xaD189a7c61640993972E114863c58995de4e5665": 5000,
        "0x855a251883ceEec37175331D17F54729fE23044E": 5000,

        "0xc341e0fd548298de89b38fe31f2ac63457105451": 5000,
        "0x2F6F40da6DBA834D6Ab6f62a93bC606733737Fd5": 5000,

        "0x5f9EE29D0BB5ef7605766cf28C8D93fc970CAc71": 5000,
        "0xF9B4De4bB735ACE677813ac8E24B6530B2D595E9": 5000,
        "0xC7146Ecc657C77319F6b7a4F89E64Cf8B36d42cB": 5000,

        "0x4B90131bA27F529A4e2831734d43720F197Af523": 10000,
        "0xcFa7aCF8b959b0e370a68492876A09c34eD58428": 10000,
    },

    showOvercapBanner: true,
};

const getters = {
    overcapWallets(state) {
        return state.overcapWallets;
    },

    showOvercapBanner(state) {
        return state.showOvercapBanner;
    },

    walletOvercapLimit(state, getters, rootState, rootGetters) {
        try {
            return state.overcapWallets[rootGetters["accountData/account"]];
        } catch (e) {
            return 0;
        }
    },

    totalOvercap(state) {
        let result = 0;

        Object.keys(state.overcapWallets).forEach(key => {
            result += state.overcapWallets[key];
        })

        return result;
    },

    isOvercapAvailable(state, getters, rootState, rootGetters) {
        let result = false;

        try {
            result = Object.keys(state.overcapWallets).includes(rootGetters["accountData/account"]);
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

const state = {
    overcapWallets: {
        "0x7617452156F474836604C1a79c79c0627be5fE74": 10000,
        "0x44Fa1B7B7aCc00f6C81539A8Fe255794edf7C03c": 10000,
        "0x2130FD01026867A6c8DdE24ad5E64F2e2DFce196": 10000,
        "0x4B90131bA27F529A4e2831734d43720F197Af523": 10000,
        "0xcFa7aCF8b959b0e370a68492876A09c34eD58428": 10000,
        "0x66f778268e13FaD773924d94b6dFF44fF50163aB": 10000,
        "0x93893f7e609888801ea67A586fC40fdB06F8b700": 10000,
        "0xa3Cc3893B0D952c312AfBD42d48d5b3B1Ac177fF": 10000,
        "0x3D9fcb03c6C09bBae2689DC50D14Dac54F3F299D": 10000,
        "0x8d7A429b0b6284806bCd50809c52bA60e849A0F4": 10000,
        "0x7c5eaca13133c55643922b9746d5c6e6c9e5f862": 10000,
        "0x8bd4EF8a3bc10e36353D26Da1DAa233EFeE1653F": 10000,
        "0x8fda1ead2709923c058217b441ef5a5bf09f4022": 10000,

        "0x92b8f9fe69D7A0fF316De2FbEADd1a5c29f774eC": 10000,
        "0xC8BD407d9A361Cb2eAf439565F61C92B968ac956": 10000,
        "0xF4B67f83a65500D2692e2637acFe382cE09fC90b": 10000,
        "0x12a79E67ed7f4fd0a0318d331941800898DAB30d": 10000,
        "0x826b8d2d523E7af40888754E3De64348C00B99f4": 1000000,
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
            localStorage.setItem('overcapRemainingValue', overcapRemainingValue.toString());
        }
    },

    async returnOvercap({commit, dispatch, getters, rootState}, request) {
        if (request.overcapLeft != null) {
            let overcapRemainingValue = parseFloat(request.overcapLeft) + parseFloat(request.overcapVolume);
            localStorage.setItem('overcapRemainingValue', Math.min(overcapRemainingValue, getters.walletOvercapLimit).toString());
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

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
        "0x8bd4EF8a3bc10e36353D26Da1DAa233EFeE1653F": 50000,
        "0x8fda1ead2709923c058217b441ef5a5bf09f4022": 10000,
        "0x0ca6cadb6a8ca4199788b9a060c3285fe7b897fd": 10000,
        "0xd0c8cdbBec12068f4E0041b016aCa2d295fBd323": 10000,
        "0xe3278dd9CDc262c60FbFba91D496dbAc90A929bf": 10000,
        "0x17c8afd739a175eacf8af5531671b222102b8083": 10000,
        "0x2385233abb910357e2b97A16D40e0443e53d0769": 10000,
        "0x1f742217Aef76D09c3C5BB3C967fBF94D22f1828": 10000,
        "0x32738758ceb220B3e1507e4f5D358ECE067aB55A": 10000,
        "0x182FBAE99347223D3F22B27c0612466e381DfA77 ": 10000,
        "0x9DF00F107C531981c44Db2e73a216b47daB81046 ": 10000,
        "0x47D574e85DF71a059Ec442cAd8DeE2224F58b0D8 ": 10000,
        "0x11a4D72c834d5dCC7Ff0302BAe0083C698f984Ff ": 10000,
        "0x3FfA11Acc1B21D44ddc39416f072c57e0b6aC957 ": 10000,
        "0x9A43E2d3f7D28f0BB8A6B5952dC563AB51B8cb55 ": 10000,
        "0x8900d56EA5a1Db23AB9Fd5A509e6Ecbd3B963003 ": 10000,
        "0x13108aB5c6eB7efDcD7Ba6F8cc55d265eAE6176F ": 10000,
        "0x64535D0cBeeab04A7c2c5b09dFB0F22e57171279 ": 10000,
        "0x38001Af2d30c367c951154B6A36c1c54cbC4473B ": 10000,
        "0x089A29DA4Ab1029FC9cAf82f20b8AddBC823461e ": 10000,
        "0xd6F073F2Cd09f4951449101989E2c34bD8053366 ": 10000,
        "0xc9473D87cDD9A043F811EB034Ce935D1aa0601EE ": 10000,
        "0x7f7f1c49CE26004E926035ABc498C514251D0615 ": 10000,
        "0xDB6AbcfE6913c1b296dF2970d3b57A9B431D1680 ": 10000,
        "0xFA0F59Eed2d679eA733867Fa3f09E152928f9F82 ": 10000,
        "0x292Fa3225F8F6884E8c3c555143679787FBf9Ee8 ": 10000,
        "0x62e1af3e818afc059d111c4f53cf0a2d9fd29110 ": 10000,
        "0x3cd1A78e055eA4FA7F019a66a6E0C1616612A27e ": 50000,
        "0xb3A080a696a0804175C52bD8fea7Af1CCB39C5e3 ": 10000,

        "0x3885e9f0E45FA5EC03Ab41787b79cc174C60eab7": 10000,
        "0x5CB01385d3097b6a189d1ac8BA3364D900666445": 10000,
        "0x92b8f9fe69D7A0fF316De2FbEADd1a5c29f774eC": 10000,
        "0xC8BD407d9A361Cb2eAf439565F61C92B968ac956": 10000,
        "0xdf5D41F42f5E4571b35A6A3cdaB994e9B433Fe66": 10000,
        "0xF4B67f83a65500D2692e2637acFe382cE09fC90b": 10000,
        "0x12a79E67ed7f4fd0a0318d331941800898DAB30d": 1000000,
        "0x826b8d2d523E7af40888754E3De64348C00B99f4": 1000000,
        "0xf3c9Bb7aaaB08C20FbFbba8EeB216AC0b87FB37E": 250000,
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

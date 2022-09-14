const state = {

    light: true,
};

const getters = {

    light(state) {
        return state.light;
    },
};

const actions = {

    async switchTheme({commit, dispatch, getters}) {
        await commit('setLight', !getters.light);
        await dispatch('applyColorVariables');
    },

    async applyColorVariables({commit, dispatch, getters}) {
        document.querySelector(":root").style.setProperty('--main-background', getters.light ? '#F5F5F5' : '#13151C');
        document.querySelector(":root").style.setProperty('--card-coin-background', getters.light ? '#F5F5F5' : '#29323E');
        document.querySelector(":root").style.setProperty('--secondary', getters.light ? '#FFFFFF' : '#1D2029');
        document.querySelector(":root").style.setProperty('--main-gray-text', getters.light ? '#29323E' : '#FFFFFF');
        document.querySelector(":root").style.setProperty('--secondary-gray-text', getters.light ? '#333333' : '#FFFFFF');
        document.querySelector(":root").style.setProperty('--third-gray-text', getters.light ? '#ADB3BD' : '#707A8B');
        document.querySelector(":root").style.setProperty('--main-border', getters.light ? '#DEE1E5' : '#29323E');
        document.querySelector(":root").style.setProperty('--secondary-border', getters.light ? '#CED2D8' : '#29323E');
        document.querySelector(":root").style.setProperty('--main-banner-background', getters.light ? '#E5E7EA' : '#4C586D');
        document.querySelector(":root").style.setProperty('--card-banner-status-container', getters.light ? '#F5F5F5' : '#29323E');
        document.querySelector(":root").style.setProperty('--links-blue', getters.light ? '#1C95E7' : '#1C95E7');

        // и так далее все
    },

};

const mutations = {

    setLight(state, value) {
        state.light = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

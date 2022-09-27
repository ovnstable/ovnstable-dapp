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
        let isLight;

        if (getters.light === null || getters.light === undefined) {
            isLight = true;
        } else {
            isLight = !getters.light;
        }

        localStorage.setItem('light_theme_on', isLight);

        await commit('setLight', isLight);
        await dispatch('applyColorVariables');
    },

    async initTheme({commit, dispatch, getters}) {
        let isLight = localStorage.getItem('light_theme_on');

        if (isLight === null || isLight === undefined) {
            isLight = true;
        } else {
            isLight = (isLight === 'true');
        }

        await commit('setLight', isLight);
        await dispatch('applyColorVariables');
    },

    async applyColorVariables({commit, dispatch, getters}) {

        // Main backgrounds
        document.querySelector(":root").style.setProperty('--main-background', getters.light ? '#F5F5F5' : '#13151C');
        document.querySelector(":root").style.setProperty('--card-coin-background', getters.light ? '#F5F5F5' : '#29323E');
        document.querySelector(":root").style.setProperty('--secondary', getters.light ? '#FFFFFF' : '#1D2029');
        document.querySelector(":root").style.setProperty('--main-banner-background', getters.light ? '#E5E7EA' : '#1D2029');
        document.querySelector(":root").style.setProperty('--card-banner-status-container', getters.light ? '#F5F5F5' : '#29323E');

        // Action buttons
        document.querySelector(":root").style.setProperty('--action-btn-bg', getters.light ? '#E5E7EA' : '#29323E');
        document.querySelector(":root").style.setProperty('--action-btn-color', getters.light ? '#29323E' : '#4C586D');

        // Texts
        document.querySelector(":root").style.setProperty('--main-gray-text', getters.light ? '#29323E' : '#FFFFFF');
        document.querySelector(":root").style.setProperty('--secondary-gray-text', getters.light ? '#333333' : '#FFFFFF');
        document.querySelector(":root").style.setProperty('--third-gray-text', getters.light ? '#ADB3BD' : '#707A8B');
        document.querySelector(":root").style.setProperty('--fourth-gray-text', getters.light ? '#ADB3BD' : '#4C586D');
        document.querySelector(":root").style.setProperty('--action-label-text', getters.light ? '#8D95A3' : '#707A8B');

        // Borders
        document.querySelector(":root").style.setProperty('--main-border', getters.light ? '#DEE1E5' : '#29323E');
        document.querySelector(":root").style.setProperty('--secondary-border', getters.light ? '#CED2D8' : '#29323E');

        // Links
        document.querySelector(":root").style.setProperty('--links-blue', getters.light ? '#1C95E7' : '#1C95E7');

        // Progress blocks
        document.querySelector(":root").style.setProperty('--progress-info', getters.light ? '#D7DADF' : '#13151C');
        document.querySelector(":root").style.setProperty('--progress-card-info', getters.light ? '#D7DADF' : '#29323E');
        document.querySelector(":root").style.setProperty('--progress-text', getters.light ? '#BABFC8' : '#4C586D');
        document.querySelector(":root").style.setProperty('--disabled-value', getters.light ? '#C5C9D1' : '#4C586D');
        document.querySelector(":root").style.setProperty('--fee-structure-value', getters.light ? '#3E5463' : '#FFFFFF');


        // Red container, HOVER and ACTIVE states
        document.querySelector(":root").style.setProperty('--red-container', getters.light ? 'linear-gradient(rgba(207, 63, 146, 0.4), rgba(207, 63, 146, 0.08), rgba(207, 63, 146, 0.4))' : 'rgba(207, 63, 146, 0.08)');
        document.querySelector(":root").style.setProperty('--hover', getters.light ? 'rgba(28, 149, 231, 0.1)' : 'rgba(28, 149, 231, 0.1)');
        document.querySelector(":root").style.setProperty('--active', getters.light ? 'rgba(28, 149, 231, 0.24)' : 'rgba(28, 149, 231, 0.24)');
        document.querySelector(":root").style.setProperty('--zoom-btn-color', getters.light ? '#707A8B' : '#FFFFFF');
        document.querySelector(":root").style.setProperty('--current-table-hover', getters.light ? 'rgba(28, 149, 231, 0.1)' : 'rgba(28, 149, 231, 0.1)');

        // Scrolls
        document.querySelector(":root").style.setProperty('--scroll-color', getters.light ? '#F5F5F5' : '#29323E');
        document.querySelector(":root").style.setProperty('--scrollbar-slider-color', getters.light ? '#ADB3BD' : '#4C586D');
        document.querySelector(":root").style.setProperty('--scrollbar-track-color', getters.light ? '#FFFFFF' : '#1D2029');


        // Charts backgrounds
        document.querySelector(":root").style.setProperty('--doughnut-bg', getters.light ? '#FFFFFF' : '#1D2029');
        document.querySelector(":root").style.setProperty('--doughnut-fg', getters.light ? '#F5F5F5' : '#4C586D');
        document.querySelector(":root").style.setProperty('--doughnut-text', getters.light ? '#333333' : '#FFFFFF');
        document.querySelector(":root").style.setProperty('--chart-color', getters.light ? '#E6F1FF' : '#1C95E7');
        document.querySelector(":root").style.setProperty('--selected-btn-color', getters.light ? '#E8F4FD' : '#29323E');

        // Tooltips
        document.querySelector(":root").style.setProperty('--tooltip-bg', getters.light ? '#FFFFFF' : '#29323E');
        document.querySelector(":root").style.setProperty('--tooltip-text', getters.light ? '#333333' : '#FFFFFF');

        // Social Links and Swap button
        document.querySelector(":root").style.setProperty('--social-link', getters.light ? '#ADB3BD' : '#707A8B');
        document.querySelector(":root").style.setProperty('--swap-btn-bg', getters.light ? '#FFFFFF' : '#29323E');
        document.querySelector(":root").style.setProperty('--swap-btn-color', getters.light ? '#333333' : '#FFFFFF');

        // Inputs
        document.querySelector(":root").style.setProperty('--input-placeholder', getters.light ? '#C5C9D1' : '#4C586D');

        //Theme switcher
        document.querySelector(":root").style.setProperty('--theme-icon-color', getters.light ? '#ADB3BD' : '#4C586D');
        document.querySelector(":root").style.setProperty('--theme-icon-color-selected', getters.light ? '#4C586D' : '#ADB3BD');
        document.querySelector(":root").style.setProperty('--theme-switch-background', getters.light ? '#F5F5F5' : '#29323E');
        document.querySelector(":root").style.setProperty('--theme-toggle-border', getters.light ? '#E5E7EA' : '#29323E');
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

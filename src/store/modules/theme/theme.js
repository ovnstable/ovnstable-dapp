import {THEME_MODE_PARAMS} from "@/store/modules/theme/theme_params";

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
        if (getters.onboard) {
            getters.onboard.state.actions.updateTheme(isLight ? 'light' : 'dark')
        }
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

        if (getters.onboard) {
            getters.onboard.state.actions.updateTheme(isLight ? 'light' : 'dark')
        }
    },

    async applyColorVariables({commit, dispatch, getters}) {

        let theme;

        switch (getters.light){
            case true:
                theme = 'light';
                break;
            case false:
                theme = 'dark';
                break;
            default:
                theme = 'light';
                break;
        }

        THEME_MODE_PARAMS.forEach(s => {
            if (s.enabled) {
                document.querySelector(":root").style.setProperty(s.name, s.theme[theme]);
            }
        });
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

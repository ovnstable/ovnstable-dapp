const state = {
    isDeprecatedShow: false
};

const getters = {
    isDeprecatedShow(state) {
        return state.isDeprecatedShow;
    }
};

const actions = {
    updateDeprecatedShow({commit, dispatch, getters}, value) {
        console.log("updateDeprecatedShow value", value)
        commit('setDeprecatedShow', value);
        localStorage.setItem('show_deprecated', value);
    },

    loadDeprecatedShow({commit, dispatch, getters}) {
        let isShow = localStorage.getItem('show_deprecated');
        console.log("loadDeprecatedShow isShow", isShow);

        if (isShow === null || isShow === undefined || isShow === 'null' || isShow === 'undefined' || isShow === 'false') {
            isShow = false;
        } else {
            isShow = (isShow === 'true');
        }

        commit('setDeprecatedShow', isShow);
    }
};

const mutations = {
    setDeprecatedShow(state, value) {
        state.isDeprecatedShow = value;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

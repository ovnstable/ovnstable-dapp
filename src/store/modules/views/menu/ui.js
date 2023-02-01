const state = {
    selectedTab: '',
};

const getters = {

    selectedTab(state) {
        return state.selectedTab;
    },
};

const actions = {

    async selectTab({commit, dispatch, getters, rootState}, tab) {
        console.log('setSelectTab: ' + tab)
        commit('setSelectedTab', tab);
    },
};

const mutations = {

    setSelectedTab(state, selectedTab) {
        state.selectedTab = selectedTab;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

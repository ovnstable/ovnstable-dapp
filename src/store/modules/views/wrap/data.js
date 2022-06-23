const state = {

    // TODO: change to null, it's for test
    index: 6.54,
};

const getters = {

    index(state) {
        return state.index;
    },
};

const actions = {

    async refreshWrap({commit, dispatch, getters, rootState}) {
        console.log('WrapData: refreshWrap');

        dispatch('accountData/refreshBalance', null, {root:true});
    },
};

const mutations = {

    setIndex(state, index) {
        state.index = index;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

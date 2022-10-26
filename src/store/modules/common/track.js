import Vue from "vue";

const state = {
};

const getters = {
};

const actions = {

    async trackClick({commit, dispatch, getters, rootState}, trackParams) {
        Vue.prototype.$gtm.trackEvent({
            event: null,
            category: trackParams.category,
            action: 'click',
            label: trackParams.label,
            value: trackParams.value,
            noninteraction: false, // Optional
        });
    },
};

const mutations = {
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

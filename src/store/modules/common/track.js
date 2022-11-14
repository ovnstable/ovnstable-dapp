import Vue from "vue";

const state = {
};

const getters = {
};

const actions = {

    async trackClick({commit, dispatch, getters, rootState}, trackParams) {
        Vue.prototype.$gtag.trackEvent({
            action: trackParams.click,
            event_category: trackParams.event_category,
            event_label: trackParams.event_label,
            value: trackParams.value,
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

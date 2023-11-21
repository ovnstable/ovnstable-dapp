import Vue from "vue";

const state = {
};

const getters = {
};

const actions = {

    async trackClick({commit, dispatch, getters, rootState}, trackParams) {
        Vue.prototype.$gtm.trackEvent({
            event: trackParams.action,
            action: trackParams.action,
            category: trackParams.event_category,
            label: trackParams.event_label,
            value: trackParams.value,
        });

        // try catch for metrika
        setTimeout(() => {
            try {
                Vue.prototype.$metrika.reachGoal(trackParams.action);
            } catch (e) {
                console.log('Metrika not init yet', e);
            }
        }, 50)
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

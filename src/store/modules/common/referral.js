const KEY = 'REFERRAL_CODE';

const state = {};

const getters = {};

const actions = {

    async getReferralCode({commit, dispatch, getters, rootState}) {

        const match = document.cookie.match(new RegExp('(^| )' + KEY + '=([^;]+)'));
        if (match) {
            let referralCode = match[2];
            console.log(`Referral code found in cookie = [${referralCode}]`)
            return referralCode;
        } else {
            console.log('Referral code not found in cookies');
            return '';
        }
    },


    async initReferralCode({commit, dispatch, getters, rootState}) {

        const exist = document.cookie.indexOf(`${KEY}=`) !== -1;
        if (exist) {
            console.log('REFERRAL_CODE already marked');
        } else {

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const referralValue = urlParams.get('referral');

            if (referralValue) {
                let days = 86400 * 30 // 86400 = 1 day

                console.log(`Referral [${referralValue}] found in URL`);

                const expire = (new Date(Date.now() + days * 1000)).toUTCString();
                document.cookie = `${KEY}=${referralValue}; expires=${expire};path=/;`;

                console.log(`Setup [REFERRAL_CODE=${referralValue}] to cookies`);
            } else {
                console.log('Referral not found in URL');
            }
        }
    }
};

const mutations = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

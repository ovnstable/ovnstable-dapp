<template>
    <div>
        <v-row justify="start"
               align="center"
               v-if="promoLogins"
               class="account-info-row"
               :class="(i === 0) ? 'mt-4' : 'mt-5'"
               v-for="(promoLogin, i) in getPromoLoginList()">
            <v-tooltip
                    v-model="promoCopyShow[i]"
                    color="#202832"
                    bottom
            >
                <template v-slot:activator="{on}">
                    <v-btn class="promo-btn" :class="$wu.isMobile() ? 'ml-1' : ''" outlined
                           @click="copyPromoCredentialsToClipboard(promoLogin, i)">
                        <v-col cols="10">
                            <v-row class="ma-0" align="center">
                                <label class="promo-label-user"><b>Login:</b> {{ promoLogin.login }}</label>
                            </v-row>
                            <v-row class="ma-0" align="center" v-if="!$wu.isMobile()">
                                <label class="promo-label-user"><b>Password:</b> {{ promoLogin.password }}</label>
                            </v-row>
                        </v-col>
                        <v-col cols="2">
                            <v-row class="ma-0" align="center" justify="end">
                                <div class="icon-img">
                                    <v-img :src="require('@/assets/icon/copyGold.svg')"/>
                                </div>
                            </v-row>
                        </v-col>
                    </v-btn>
                </template>
                <p class="my-0">Copied!</p>
            </v-tooltip>
        </v-row>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import moment from "moment";

export default {
    name: "PromoCredentialsSection",

    components: {
    },

    props: {
    },

    computed: {
    },

    data: () => ({
        promoCopyShow: [false, false, false],

        get promoLogins() {
            return localStorage.getItem('promoLogins');
        },

        set promoLogins(value) {
            localStorage.setItem('promoLogins', value);
        },
    }),

    watch: {
    },

    created() {
    },

    methods: {
        async copyPromoCredentialsToClipboard(promoLogin, i) {
            let list = [...this.promoCopyShow];
            list[i] = true;
            this.promoCopyShow = null;
            this.promoCopyShow = [...list];

            await navigator.clipboard.writeText(
                "Your invite credentials to access the beta https://market.overnight.fi/\n\n" +
                "Login: " + promoLogin.login + "\n" +
                "Password: " + promoLogin.password + "\n\n" +
                "Be one of the first to check out the new exchange-traded strategy"
            );

            await new Promise(resolve => setTimeout(resolve, 1000));

            list = [...this.promoCopyShow];
            list[i] = false;
            this.promoCopyShow = null;
            this.promoCopyShow = [...list];
        },

        getPromoLoginList() {
            return JSON.parse(localStorage.getItem('promoLogins'));
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .promo-label-user {
        font-style: normal !important;
        font-weight: 300 !important;
        font-size: 12px !important;
        line-height: 14px !important;
        letter-spacing: 0.02em !important;
    }

    .account-info-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .promo-label-user {
        font-style: normal !important;
        font-weight: 300 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .promo-label-user {
        font-style: normal !important;
        font-weight: 300 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }
}

.account-info-row {
    height: 56px;
}

.promo-btn {
    width: 100% !important;
    height: 56px !important;
    border-radius: 4px !important;
    box-shadow: none !important;
    text-transform: none !important;
    color: #D1B464;
}

.promo-label-user {
    font-family: 'Roboto', sans-serif !important;
    font-style: normal !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: #333333 !important;
}

.icon-img {
    width: 20px;
    height: 20px;
    cursor: pointer;
}
</style>

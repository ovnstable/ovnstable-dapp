<template>
    <v-row class="card-container">
        <v-col cols="12" align-self="start">
            <v-container>
                <v-row class="ma-0 mt-3">
                    <label class="card-info-title">Supply Capital, Earn Premiums. Yield by writing insurance for USD+</label>
                </v-row>

                <v-row class="ma-0 mt-8">
                    <label class="card-info">
                        Overnight Insurance is a structured DeFi product enabling users to gain high yields at the expense of insuring of USD+. Underwrite in USD+ Insurance underwrite every strategy in the USD+ collateral. Each strategy has its own Risk Factor which governs APY shares for premiums. To supply high APY for Insurance providers  USD+ Insurance token is reserved in other assets.
                    </label>
                </v-row>

                <v-row class="ma-0" :class="$wu.isFull() ? 'mt-12' : ($wu.isTablet() ? 'mt-8' : 'mt-5')" align="start" justify="center">
                    <img class="insurance-about-img img-wide" :src="require('@/assets/insurance/insurance_about_horizontal.svg')"/>
                    <img class="insurance-about-img img-narrow" :src="require('@/assets/insurance/insurance_about_vertical.svg')"/>
                </v-row>
            </v-container>
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>

export default {
    name: "InsuranceInfoCard",

    components: {
    },

    props: {},

    computed: {
    },

    data: () => ({
    }),

    watch: {
    },

    created() {
    },

    methods: {
    }
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 22px;
    }

    .card-info-title {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
    }

    .card-container {
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 22px;
    }

    .card-info-title {
        font-style: normal;
        font-weight: 400;
        font-size: 22px;
        line-height: 32px;
    }

    .card-container {
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-title {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 36px;
    }

    .card-container {
        max-width: 920px;
    }
}

@media only screen and (max-width: 1260px) {
    .img-wide {
        display: none;
    }
}

@media only screen and (min-width: 1260px) {
    .img-narrow {
        display: none;
    }
}

.card-container {
    background: var(--secondary) !important;
    border-radius: 15px !important;
    height: 100% !important;
}

.card-info {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.card-info-title {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--main-gray-text);
}

.insurance-about-img {
    max-width: 100% !important;
}
</style>

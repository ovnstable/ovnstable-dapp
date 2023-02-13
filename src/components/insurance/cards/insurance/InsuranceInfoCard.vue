<template>
    <v-row class="card-container">
        <v-col cols="12" align-self="start">
            <v-container>
                <v-row class="ma-0 mt-3">
                    <label class="card-info-title">Supply Capital, Earn Premiums. Yield by writing insurance for USD+</label>
                </v-row>

                <v-row class="ma-0 mt-8">
                    <label class="card-info">
                        Overnight insurance is a structured DeFi product enabling users to obtain high yields by providing insurance for USD+.
                        Insurance providers earn premiums and yield from the investment of insurance reserves (mostly, into narrow range ETSes) in case of positive rebase by USD+.
                        Premiums are retained from the daily yield of USD+.
                        However, in case of negative rebase, the insurance fund capital serves to compensate the negative rebase and [1] BPS of yield in addition.
                        Please be aware of risks related to insurance - there is a min 3 day lockup period for the funds provided, no compensation will be provided in case of losses from insurance.
                        This insurance product covers only USD+, and to no other Overnight product. Now USD+ Insurance is in Beta version.
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
        max-height: 100%;
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

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-title {
        font-style: normal;
        font-weight: 400;
        font-size: 22px;
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

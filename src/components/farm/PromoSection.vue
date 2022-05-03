<template>
    <v-card height="74px" class="main-card-row">
        <v-card-text>
            <v-row align="center" style="height: 64px">
                <v-col cols="6">
                    <v-row justify="start" class="ml-2">
                        <label class="promo-main">0% Fee</label>
                        <label class="promo-sub">&nbsp;promo left</label>
                    </v-row>
                </v-col>
                <v-col cols="6">
                    <v-row justify="end" class="mr-2" style="display: flex">
                        <div class="days-rectangle mr-1">
                            <v-row>
                                <v-spacer></v-spacer>
                                <label class="days-number-label">{{ String(daysLeft).charAt(0) }}</label>
                                <v-spacer></v-spacer>
                            </v-row>
                        </div>
                        <div class="days-rectangle mr-2">
                            <v-row>
                                <v-spacer></v-spacer>
                                <label class="days-number-label">{{ String(daysLeft).charAt(1) }}</label>
                                <v-spacer></v-spacer>
                            </v-row>
                        </div>
                        <label class="promo-sub days-sub-label">days</label>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "PromoSection",

    components: {
    },

    props: {
    },

    computed: {
        ...mapGetters('farm', ['selectedPool']),

        daysLeft: function () {
            let dateFirst = this.$moment(this.selectedPool.promoUntilDate);
            let dateSecond = this.$moment();

            return dateFirst.diff(dateSecond, 'days');
        },
    },

    data: () => ({
    }),

    created() {
    },

    methods: {

    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {
}

@media only screen and (min-width: 1400px) {
}

.main-card-row {
    width: 100% !important;
    background: #13151C;
    border-radius: 12px;
}

.promo-main, .promo-sub {
    font-family: 'Lato', sans-serif !important;
    font-style: normal;
    font-weight: 600;
    font-size: 18px !important;
    line-height: 28px !important;
}

.days-number-label {
    font-family: 'Lato', sans-serif !important;
    font-style: normal;
    font-weight: 700;
    font-size: 34px !important;
    line-height: 42px !important;
    color: #FE7F2D !important;
}

.promo-main {
    color: #FE7F2D !important;
}

.promo-sub {
    color: white !important;
}

.days-number-label {
    margin-top: 14px;
}

.days-sub-label {
    margin-top: 10px;
}

.days-rectangle {
    background: #1D2029 !important;
    border-radius: 8px !important;
    width: 42px !important;
    height: 48px !important;
}

</style>

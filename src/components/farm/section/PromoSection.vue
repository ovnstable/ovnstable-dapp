<template>
    <v-row align="center" justify="center">
        <div class="avatar-img">
            <v-img :src="require('@/assets/icon/fire.svg')"/>
        </div>
        <label class="special-offer-label ml-3">Special  offer  0%  Fee</label>
    </v-row>
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

.special-offer-label {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    background: linear-gradient(91.26deg, #FE7F2D 0%, #FCCA46 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
}

</style>

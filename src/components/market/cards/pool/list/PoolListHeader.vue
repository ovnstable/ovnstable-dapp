<template>
    <v-row class="ma-0" justify="start">
        <v-col v-if="!$wu.isMobile()">
            <v-row justify="start" align="center">
                <label class="list-header-label">Chain / Platform</label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isFull() ? 3 : ($wu.isMobile() ? 6 : 3)">
            <v-row :justify="$wu.isMobile() ? 'start' : 'start'" align="center">
                <label class="list-header-label">Pool name</label>
            </v-row>
        </v-col>
        <v-col cols="3">
            <v-row :justify="$wu.isMobile() ? 'center' : 'end'" align="center">
                <label class="list-header-label">TVL</label>
            </v-row>
        </v-col>
        <v-col cols="3">
            <v-row :justify="$wu.isMobile() ? 'center' : 'end'" align="center">
                <label class="list-header-label">APR</label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()">
            <v-row justify="end" align="center">
                <label class="list-header-label">Link to deposit</label>
            </v-row>
        </v-col>
        <v-col v-if="$wu.isMobile()">
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "PoolListHeader",

    components: {
    },

    props: {
    },

    computed: {
    },

    data: () => ({}),

    watch: {},

    created() {
    },

    methods: {
    }
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {

    .list-header-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .list-header-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .list-header-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }
}

.list-header-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
}
</style>

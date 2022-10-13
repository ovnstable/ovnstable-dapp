<template>
    <v-row class="ma-0" justify="start">
        <v-col v-if="!$wu.isMobile()">
            <v-row justify="start" align="center">
                <label class="list-header-label">Chain / Platform</label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isFull() ? 2 : ($wu.isMobile() ? 8 : 3)">
            <v-row :justify="$wu.isMobile() ? 'start' : 'center'" align="center">
                <label class="list-header-label">ETS name</label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isFull() ? 1 : ($wu.isMobile() ? 4 : 1)">
            <v-row :justify="$wu.isMobile() ? 'end' : 'center'" align="center">
                <label class="list-header-label">APY</label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()" cols="3">
            <v-row justify="center" align="center">
                <label class="list-header-label">TVL</label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()">
            <v-row justify="center" align="center">
                <label class="list-header-label">Token pair</label>
            </v-row>
        </v-col>
        <v-col v-if="$wu.isFull()" cols="1">
            <v-row justify="center" align="center">
                <label class="list-header-label">My investment</label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()">
            <v-row justify="end" align="center">
                <label class="list-header-label">About ETS</label>
            </v-row>
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "EtsListHeader",

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
<template>
    <v-row class="mt-0" justify="end">
        <v-col v-if="!$wu.isMobile()">
            <v-row class="ma-0 mt-1" justify="start" align="end">
                <label class="list-header-label">Chain / Platform</label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isFull() ? 3 : ($wu.isMobile() ? 7 : 3)">
            <v-row class="ma-0 mt-1" :justify="$wu.isMobile() ? 'start' : 'center'" align="end">
                <label class="list-header-label">ETS name</label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isFull() ? 1 : ($wu.isMobile() ? 3 : 1)">
            <v-row class="ma-0 mt-1" justify="end" align="end">
                <label class="list-header-label">Last day APY</label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isFull() ? 1 : ($wu.isMobile() ? 3 : 1)">
            <v-row class="ma-0 mt-1" justify="end" align="end">
                <label class="list-header-label">30-day APY</label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()" cols="3">
            <v-row class="ma-0 mt-1" justify="center" align="end">
                <label class="list-header-label">TVL</label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()">
            <v-row class="ma-0 mr-3 mt-1" justify="center" align="end">
                <label class="list-header-label">Token pair</label>
            </v-row>
        </v-col>
        <v-col v-if="$wu.isFull()" cols="1">
            <v-row class="ma-0 mt-1" justify="start" align="end">
                <label class="list-header-label">My investment</label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()">
            <v-row class="ma-0 mt-1" justify="center" align="end">
                <label class="list-header-label">About ETS</label>
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

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {

    .list-header-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }
}

.list-header-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
}
</style>

<template>
    <v-row class="ma-0 account-info-row mt-2 mb-n5" align="center">
        <v-col :cols="$wu.isMobile() ? 2 : 4">
            <v-row justify="start" align="center">
                <label class="list-header-label" :class="$wu.isMobile() ? 'ml-3' : 'ml-5'">Product</label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isMobile() ? 5 : 2">
            <v-row justify="end" align="center">
                <label class="list-header-label">Amount</label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()" cols="3">
            <v-row justify="end" align="center">
                <label class="list-header-label">Date</label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isMobile() ? 3 : 2">
            <v-row justify="center" align="center">
                <label class="list-header-label">Status</label>
            </v-row>
        </v-col>
        <v-col cols="1">
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>

export default {
    name: "TxListHeader",

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

    .account-info-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
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

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
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

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }
}

.list-header-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
}
</style>
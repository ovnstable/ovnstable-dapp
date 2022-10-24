<template>
    <v-row class="account-info-row" align="center">
        {{ txData.hash }} {{ txData.text }} {{ txData.pending }}
    </v-row>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "TxCard",

    components: {},

    data: () => ({
    }),

    props: {
        txData: {
            type: Object,
            default: null,
        },
    },

    computed: {
        ...mapGetters('transaction', ['transactions']),
    },

    watch: {
    },

    methods: {
        ...mapActions('transaction', ['loadTransaction']),
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {

    .account-info-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }
}
</style>

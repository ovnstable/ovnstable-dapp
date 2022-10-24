<template>
    <div class="mt-3">
        <template v-for="tx in transactions">
            <TxCard :tx-data="tx" v-bind:key="`${tx.hash}_${tx.pending}`" />
        </template>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import TxCard from "@/components/common/modal/account/tabs/tx/component/TxCard";

export default {
    name: "TxTab",

    components: {TxCard},

    data: () => ({
    }),

    props: {
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
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
}

/* full */
@media only screen and (min-width: 1400px) {
}
</style>

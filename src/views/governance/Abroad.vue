<template>
    <v-container>
        <v-row justify="center">
            <h1>Abroad</h1>
        </v-row>

        <v-col>
            <AbroadControl/>
        </v-col>
    </v-container>
</template>

<script>
import AbroadControl from "@/components/governance/control/AbroadControl";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "Abroad",
    components: {AbroadControl},

    computed: {
        ...mapGetters('web3', ['contracts']),
    },

    watch: {
        contracts: async function (newVal, oldVal) {
            await this.getAbroad();
        },
    },

    methods: {
        ...mapActions('governance', ['getAbroad']),
    },
}
</script>

<style scoped>

</style>

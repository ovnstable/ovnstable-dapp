<template>
    <v-container>
        <v-row justify="center">
            <h1>Finance</h1>
        </v-row>
        <ChangeWeightPanel/>

        <v-col lg="5">
            <AbroadControl/>
        </v-col>
    </v-container>
</template>

<script>
import ChangeWeightPanel from "../../components/governance/ChangeWeightPanel";
import AbroadControl from "@/components/governance/control/AbroadControl";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "Finance",
    components: {AbroadControl, ChangeWeightPanel},

    computed: {
        ...mapGetters('web3', ['contracts']),
    },

    watch: {
        contracts: async function (newVal, oldVal) {
            await this.getFinance();
        },
    },

    methods: {
        ...mapActions('governance', ['getFinance']),
    },
}
</script>

<style scoped>

</style>

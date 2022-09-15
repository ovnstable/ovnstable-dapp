<template>
    <v-container class="governance-page-container">
        <v-row justify="center">
            <h1>Finance</h1>
        </v-row>

        <v-row>
            <v-col cols="10">
                <ChangeWeightPanel/>
            </v-col>
            <v-col cols="2">
                <WeightActionsPanel/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ChangeWeightPanel from "../../components/governance/finance/ChangeWeightPanel";
import {mapActions, mapGetters} from "vuex";
import WeightActionsPanel from "@/components/governance/finance/WeightActionsPanel";

export default {
    name: "Finance",
    components: {WeightActionsPanel, ChangeWeightPanel},

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

.governance-page-container {
    min-width: 96% !important;
}
</style>

<template>
    <v-container>
        <v-row justify="center">
            <h1>Proposals Overview</h1>
        </v-row>
        <v-row class="mb-5" justify="center">
            <h2>Total count: {{proposals.length}}</h2>
        </v-row>

        <template v-if="proposalsLoading">
            Loading...
        </template>
        <template v-else>
            <ProposalList/>
        </template>

    </v-container>
</template>

<script>
import ProposalList from "../../components/governance/ProposalList";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "Proposals",

    components: {ProposalList},

    data:()=>({
    }),

    computed:{
        ...mapGetters('web3', ['contracts']),
        ...mapGetters('governance', ['proposalsLoading', 'proposals'])
    },

    watch: {
        contracts: async function (newVal, oldVal) {
            await this.getProposals();
        },
    },

    methods: {
        ...mapActions('governance', ['getProposals']),
    },
}
</script>

<style scoped>

</style>

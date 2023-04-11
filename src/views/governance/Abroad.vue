<template>
    <v-container>
        <v-row justify="center">
            <h1>Abroad</h1>
        </v-row>

        <v-row class="pb-3">
            <template>
                <v-tabs>
                    <v-tab v-if="contracts && contracts.usdPlus" @click="setTab('USD+')">Usd+</v-tab>
                    <v-tab v-if="contracts && contracts.daiPlus" @click="setTab('DAI+')">Dai+</v-tab>
                    <v-tab v-if="contracts && contracts.usdtPlus" @click="setTab('USDT+')">Usdt+</v-tab>
                </v-tabs>
            </template>
        </v-row>

        <v-col>
            <AbroadControl
            :contractType="tab"/>
        </v-col>
    </v-container>
</template>

<script>
import AbroadControl from "@/components/governance/control/AbroadControl";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "Abroad",
    components: {AbroadControl},
    data() {
      return {
          tab: 'USD+'
      }
    },

    computed: {
        ...mapGetters('web3', ['contracts']),
    },

    watch: {
        contracts: async function (newVal, oldVal) {
            await this.getAbroad(this.tab);
        },
    },

    methods: {
        ...mapActions('governance', ['getAbroad']),

        setTab(tab) {
            this.tab = tab
            this.getAbroad(this.tab);
        }
    },
}
</script>

<style scoped>

</style>

<template>
<v-container>
    <v-card>

      <template v-if="strategyWeights == null">
        Loading...
      </template>
      <template v-else>

        <v-card-title>Change Weight</v-card-title>
        <v-card-actions>
            <v-container>
                <v-data-table
                :items="strategyWeights"
                :headers="headers"
                >
                  <template v-slot:item.minWeight="{ item }">
                    <v-text-field dense outlined v-model="item.minWeight">
                    </v-text-field>
                  </template>

                  <template v-slot:item.targetWeight="{ item }">
                    <v-text-field dense outlined v-model="item.targetWeight">
                    </v-text-field>
                  </template>

                  <template v-slot:item.maxWeight="{ item }">
                    <v-text-field dense outlined v-model="item.maxWeight">
                    </v-text-field>
                  </template>

                  <template v-slot:item.enabled="{ item }">
                    <v-switch
                      v-model="item.enabled"
                    ></v-switch>
                  </template>

                  <template v-slot:item.enabledReward="{ item }">
                    <v-switch
                      v-model="item.enabledReward"
                    ></v-switch>
                  </template>
                </v-data-table>

                <v-row>
                    <v-col>
                        <v-btn @click="changeWeightsAction">
                            Change
                        </v-btn>
                    </v-col>

                  <v-col>
                    <v-btn @click="rebalanceAction">
                      Rebalance
                    </v-btn>
                  </v-col>
                </v-row>
            </v-container>
        </v-card-actions>
      </template>
    </v-card>
</v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "ChangeWeightPanel",

    data: () => ({
        headers: [
            {text: 'Address', value: 'address'},
            {text: 'Name', value: 'name' },
            {text: 'Min Weight', value: 'minWeight' },
            {text: 'Target Weight', value: 'targetWeight' },
            {text: 'Max Weight', value: 'maxWeight' },
            {text: 'Enabled', value: 'enabled' },
            {text: 'Enabled Reward', value: 'enabledReward' },
        ]
    }),

    computed: {
        ...mapGetters('governance', ['strategyWeights']),
    },

    methods: {
        ...mapActions('governance', ['setStrategyWeights', 'rebalancePortfolio']),

        changeWeightsAction(){
          this.setStrategyWeights(this.strategyWeights);
        },

      rebalanceAction(){
          this.rebalancePortfolio();
      }
    }
}
</script>

<style scoped>

</style>

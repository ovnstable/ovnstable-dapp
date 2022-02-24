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
                    <template v-slot:item.weight="{ item }">
                            <v-text-field dense outlined v-model="item.weight">
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
            {text: 'Weight', value: 'weight' },
            {text: 'Enabled', value: 'enabled' },
            {text: 'Enabled Reward', value: 'enabledReward' },
        ]
    }),

    computed: {
        ...mapGetters('governance', ['strategyWeights'])
    },
    methods: {

        ...mapActions('governance', ['getStrategyWeights', 'setStrategyWeights']),


        changeWeightsAction(){
          this.setStrategyWeights(this.strategyWeights);
        }
    }
}
</script>

<style scoped>

</style>

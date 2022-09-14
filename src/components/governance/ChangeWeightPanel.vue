<template>
    <v-container>
        <template v-if="m2mItems == null">
            Loading...
        </template>

        <template v-else>
            <v-row>
                <v-data-table
                    :items="m2mItems"
                    :headers="headersM2M"
                >
                    <template v-slot:item.address="{ item }">
                        <label @click="openOnScan(item.address)">
                            {{ item.address }}
                        </label>
                    </template>

                    <template v-slot:item.minWeight="{ item }">
                        <v-text-field dense outlined v-model="item.minWeight">
                        </v-text-field>
                    </template>

                    <template v-slot:item.maxWeight="{ item }">
                        <v-text-field dense outlined v-model="item.maxWeight">
                        </v-text-field>
                    </template>

                    <template v-slot:item.targetWeight="{ item }">
                        <v-text-field dense outlined v-model="item.targetWeight">
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
            </v-row>
        </template>
    </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "ChangeWeightPanel",

    data: () => ({
        headersM2M: [
            {text: 'Name', value: 'name'},
            {text: 'Address', value: 'address'},
            {text: 'Net Asset Value', value: 'netAssetValue'},
            {text: 'Liquidation Value', value: 'liquidationValue'},
            {text: 'Current Weight', value: 'currentWeight'},
            {text: 'Min Weight', value: 'minWeight'},
            {text: 'Max Weight', value: 'maxWeight'},
            {text: 'Target Weight', value: 'targetWeight'},
            {text: 'Enabled', value: 'enabled'},
            {text: 'Enabled Reward', value: 'enabledReward'},
        ],
    }),

    computed: {
        ...mapGetters('governance', ['strategyWeights', 'm2mItems']),
        ...mapGetters('network', ['explorerUrl']),
    },

    methods: {
        ...mapActions('governance', ['setStrategyWeights', 'rebalancePortfolio']),

        changeWeightsAction() {
            this.setStrategyWeights(this.strategyWeights);
        },

        rebalanceAction() {
            this.rebalancePortfolio();
        },

        openOnScan(address) {
            let url = this.explorerUrl + "address/" + address;
            window.open(url, '_blank').focus();
        },
    }
}
</script>

<style scoped>

</style>

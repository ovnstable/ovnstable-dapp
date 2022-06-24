<template>
    <v-container class="pools-list-container mt-10">
        <v-row justify="center" class="mb-4">
            <h1>Reward pools</h1>
        </v-row>

        <v-row>
            <v-col cols="3">
                <label class="list-header">Pool name</label>
            </v-col>
            <v-col cols="3">
                <label class="list-header">Reward Rate</label>
            </v-col>
            <v-col cols="3">
                <label class="list-header">Period finish</label>
            </v-col>
            <v-col cols="3">
            </v-col>
        </v-row>

        <v-row v-for="(pool, i) in rewardPools" :key="pool.name">
            <v-col cols="3"><b>{{ pool.name }}</b></v-col>

            <v-col cols="3">
                <v-text-field placeholder="0.00"
                              flat
                              solo
                              class="field-sum"
                              hide-details
                              dark
                              background-color="transparent"
                              v-model="pool.rewardRate">
                </v-text-field>
            </v-col>

            <v-col cols="3">
                <InputDatePicker v-model="pool.periodFinish"/>
            </v-col>

            <v-col cols="1">
                <v-btn @click="updateRewardPool(pool)">
                    Update reward program
                </v-btn>
            </v-col>

            <v-col cols="2">
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import InputDatePicker from "@/components/common/element/InputDatePicker";

export default {
    name: "RewardProgram",

    components: {InputDatePicker},

    data:()=>({
        menu: false,
    }),

    created() {
    },

    computed:{
        ...mapGetters('governance', ['rewardPools'])
    },

    methods:{
        ...mapActions('governance', ['updateRewardPool']),
    }
}
</script>

<style scoped>

.pools-list-container {
    background: white !important;
    border-radius: 4px !important;
}

.v-text-field >>> input::placeholder {
    color: #353E4C !important;
}

.v-text-field >>> input, .v-text-field >>> label, .v-text-field >>> button {
    font-family: 'Lato', sans-serif;
    font-style: normal !important;
    font-weight: 700 !important;
    font-size: 20px !important;

    color: #353E4C !important;
}

.field-sum {
    border: 1px solid #4C586D;
}

.list-header {
    font-family: 'Lato', sans-serif !important;
    font-style: normal;
    font-weight: 400;
    font-size: 14px !important;
    line-height: 24px !important;

    color: #4C586D !important;
}
</style>

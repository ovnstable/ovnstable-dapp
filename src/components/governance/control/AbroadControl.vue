<template>
    <v-card>
        <v-card-title>
            <v-container>
                <v-row>
                    <v-col>
                        <h1>Abroad</h1>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <h5>Current abroad min: {{ abroad.min }}</h5>
                    </v-col>

                    <v-col>
                        <h5>Current abroad max: {{ abroad.max }}</h5>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-title>

        <v-card-text>
            <v-row>
                <v-col>
                    <v-text-field v-model="newAbroad.min" label="Abroad min" outlined dense>
                    </v-text-field>
                </v-col>

                <v-col>
                    <v-text-field v-model="newAbroad.max" label="Abroad max" outlined dense>
                    </v-text-field>
                </v-col>
            </v-row>

        </v-card-text>
        <v-card-actions>
            <v-row>
                <v-col>
                    <v-btn @click="action">
                        Update {{contractType}}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "AbroadControl",
    props: [
        'contractType'
    ],

    data: () => ({

        newAbroad: {
            contractType: null,
            min: 0,
            max: 0,
        },
    }),

    computed: {
        ...mapGetters('governance', ['abroad'])
    },

    methods: {

        ...mapActions('governance', ['updateAbroad']),

        action() {
            this.newAbroad.contractType = this.contractType;
            this.updateAbroad(this.newAbroad);
        },
    }
}
</script>

<style scoped>

</style>

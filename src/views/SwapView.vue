<template>
    <div>
        <div>
            <div class="mt-10">
                <label class="title-label">Swap</label>
            </div>

            <div v-if="!isAllDataLoaded" class="mt-7 cards-list-container">
                <v-row>
                    <v-row align="center" justify="center" class="py-15">
                        <v-progress-circular
                                width="2"
                                size="24"
                                color="#8FA2B7"
                                indeterminate
                        ></v-progress-circular>
                    </v-row>
                </v-row>
            </div>
            <div v-else class="mt-7 cards-list-container">
                <v-row class="ma-0 mt-1" align="center">
                    <v-text-field placeholder="0.00"
                                  @keypress="isNumber($event)"
                                  flat
                                  solo
                                  class="field-sum"
                                  hide-details
                                  background-color="transparent"
                                  v-model="sum"
                                  @input="inputValue(sum)">
                    </v-text-field>
                </v-row>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {odosSwap} from "@/components/mixins/odos-swap";

export default defineComponent({
    name: "SwapView",
    mixins: [odosSwap],
    data() {
        return {
            sum: null,
        }
    },
    mounted() {

    },
    methods: {
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            let charCode = (evt.which) ? evt.which : evt.keyCode;

            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                if (charCode === 46 && (!this.sum || this.sum.includes('.'))) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            }
        },
        inputValue(value) {
            console.log("Input: ", value);
        }
    }
})
</script>

<style scoped>

</style>

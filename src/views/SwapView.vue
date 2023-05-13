<template>
    <div>
        <div class="page-container">
            <div class="mt-10">
                <label class="title-label">SWAP</label>
            </div>

            <v-row align="start" justify="start" class="ma-0 mt-5 mb-5 toggle-row">
                <label class="tab-btn mr-4 tab-button">Swap</label>
                <label @click="mintAction()"
                        class="tab-btn tab-btn-disabled mx-4"
                       style="cursor: pointer"
                       disabled>Mint/Redeem v. 1.0</label>
                <v-spacer></v-spacer>
            </v-row>

            <div class="pt-20">
                <div class="row">
                    <div class="col-lg-5 col-md-6 col-sm-12">
                        <SwapForm/>
                    </div>
                    <div class="col-lg-7 col-md-7 col-sm-12">
                        <SwapInformation/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import SwapForm from "@/components/odos/SwapForm.vue";
import SwapInformation from "@/components/odos/SwapInformation.vue";
import {mapActions} from "vuex";

export default defineComponent({
    name: "SwapView",
    components: {SwapInformation, SwapForm},
    data() {
        return {
        }
    },
    mounted() {

    },
    computed: {
    },
    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },
    }
})
</script>

<style scoped>
.title-label {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    font-size: 54px;
    line-height: 60px;

    color: var(--main-gray-text);

    padding-bottom: 28px;
}


.tab-button-in-active {
    color: var(--secondary-gray-text) !important;
    cursor: default;
}

.tab-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer;
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
    width: 200% !important;
    color: var(--main-gray-text);
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}
</style>

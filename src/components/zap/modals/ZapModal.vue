<template>
    <div>
        <div v-if="isShow">
            <v-dialog
                v-model="isShow"
                width="570"
                persistent>
                <v-card class="container_body container-body airdrop-body pt-4 px-4"
                        style="border-radius: 28px!important;">
                    <v-toolbar class="container_header container-header" flat>
                        <label class="title-container">
                            Zap in
                        </label>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="setShowFunc(false)">
                            <v-icon class="close-icon">mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-card-text>
                        <ZapForm
                            :zap-pool="zapPool"
                        ></ZapForm>
                    </v-card-text>
                </v-card>
            </v-dialog>

            <resize-observer @notify="$forceUpdate()"/>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import ZapForm from "@/components/zap/ZapForm.vue";

export default defineComponent({
    name: "ZapModal",
    components: {
        ZapForm,
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        setShowFunc: {
            type: Function,
            required: true
        },
        zapPool: {
            type: Object,
            required: false,
            default: null
        },

    },
    data() {
        return {

        }
    },
    mounted() {

    },
    computed: {

    },
    watch: {

    },
    methods: {


    }
})
</script>

<style scoped>

div {
    font-family: 'Roboto',serif;
}

.title-container {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 40px;
    color: #29323E;
}

</style>

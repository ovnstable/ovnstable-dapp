<template>
    <div>
        <div v-if="isShow">
            <v-dialog
                v-model="isShow"
                width="700"
                persistent
                @click:outside="setShowFunc(false)">
                <v-card
                    class="container_body container-body airdrop-body pt-4 px-4"
                    style="border-radius: 28px!important;"
                >
                    <v-toolbar class="container_header container-header" flat>
                        <label class="title-modal">
                            Zap in
                        </label>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="setShowFunc(false)">
                            <img :src="light ? require('@/assets/icon/swap/search-close.svg') : require('@/assets/icon/light-close.svg')" alt="close icon">
                        </v-btn>
                    </v-toolbar>

                    <v-card-text>
                        <ZapForm
                            :zap-pool="zapPool"
                            :pool-tokens-for-zap-map="poolTokensForZapMap"
                            :type-of-pool="typeOfPool"
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
import { mapGetters } from 'vuex';
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
        poolTokensForZapMap: {
            type: Object,
            required: true,
        },
        typeOfPool: { // OVN or ALL
            type: String,
            required: true,
        }

    },
    data() {
        return {

        }
    },
    mounted() {

    },
    computed: {
        ...mapGetters("theme", ["light"]),
    },
    watch: {

    },
    methods: {


    }
})
</script>

<style scoped>


.container_body {
    border-radius: 24px !important;
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
}

.airdrop-body {
    z-index: 48 !important;
}

</style>

<template>
    <div v-if="show">
        <v-dialog
                v-model="show"
                width="600"
                persistent
                @click:outside="close">
            <v-card class="container_body airdrop-body">
                <v-toolbar class="container_header" flat>
                    <label class="title-modal mt-4">
                        {{ isWrapView ? 'Wrap' : 'Unwrap' }}
                    </label>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="close" class="mt-4">
                        <img :src="light ? require('@/assets/icon/swap/search-close.svg') : require('@/assets/icon/light-close.svg')" alt="close icon">
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pt-2 content-container">
                    <CoinButtons
                            :modal-type="'WUSD+'"
                            :close-func="close"
                            :modal-action-type="isWrapView ? 'MINT' : 'REDEEM'"
                            class="pl-lg-10 pr-lg-10 pl-md-5 pr-md-5 pb-7">
                    </CoinButtons>

                    <v-row class="invest-body-row mx-n2" align="center">
                        <Wrap v-if="isWrapView"/>
                        <Unwrap v-else/>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Wrap from "@/components/swap/wusd/action/Wrap";
import Unwrap from "@/components/swap/wusd/action/Unwrap";
import CoinButtons from "@/components/common/element/CoinButtons.vue";

export default {
    name: "WrapModal",

    components: {
        CoinButtons,
        Wrap,
        Unwrap,
    },

    computed: {
        ...mapGetters('wrapModal', ['show']),
        ...mapGetters('wrapModal', ['isWrapView']),
        ...mapGetters("theme", ["light"]),
    },

    methods: {
        ...mapActions('wrapModal', ['showWrapModal', 'closeWrapModal']),

        close() {
            this.closeWrapModal();
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .airdrop-body {
        width: 100% !important;
    }

    .modal-link-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .airdrop-body {
        width: 100% !important;
    }

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .invest-body-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .modal-link-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .airdrop-body {
        width: 100% !important;
    }

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .invest-body-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .modal-link-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .invest-body-row {
        margin-bottom: 5% !important;
    }
}

.airdrop-body {
    z-index: 48 !important;
}

.container_body {
    background-color: var(--secondary) !important;
    box-shadow: 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12), 0px 7px 8px -4px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}

.container_header {
    background-color: var(--secondary) !important;
}

.modal-link-label {
    font-feature-settings: 'liga' off;
    color: var(--links-blue);
    cursor: pointer;
}
</style>

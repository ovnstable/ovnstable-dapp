<template>
    <v-dialog
            v-model="show"
            width="630"
            persistent
            scrollable
            @click:outside="close">
        <v-card class="container_body">
            <v-toolbar class="container_header" flat>
                <div class="title-modal-icon">
                    <v-img :src="require('@/assets/icon/bellRed.svg')"/>
                </div>
                <label class="title-modal ml-2">
                    Risk disclosure
                </label>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <img :src="light ? require('@/assets/icon/swap/search-close.svg') : require('@/assets/icon/light-close.svg')" alt="close icon">
                </v-btn>
            </v-toolbar>

            <v-card-text class="pt-8 content-container">
                <v-row class="modal-info-row" align="center">
                    <label class="modal-info-text">
                        Overnight Finance is an Asset Management Protocol that offers low to medium risk passive yield product. Overnight Finance offers protection on our yield bearing tokens (USD+, DAI+, USDT+) that represents user’s deposits. User can file an event if USD+ (DAI+, USDT+) will face the negative rebase. In this case, tokens from the Insurance vault will be allocated to cover this loss.
                    </label>
                </v-row>

                <v-row class="modal-info-row mt-12" align="center">
                    <v-btn class="understand-btn" @click="close" outlined>
                        I understand
                    </v-btn>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "InsuranceRiskModal",

    props: {
    },

    computed: {
        ...mapGetters('insuranceRiskModal', ['show']),
        ...mapGetters("theme", ["light"])
    },

    data: () => ({
    }),

    methods: {
        ...mapActions('insuranceRiskModal', ['showRiskModal', 'closeRiskModal']),
        ...mapGetters("theme", ["light"]),

        close() {
            this.closeRiskModal();

            this.$emit('input', false);
            this.$emit('m-close');
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {

    .container_header {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .modal-info-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .title-modal-icon {
        width: 24px;
        height: 24px;
    }

    .modal-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .understand-btn {
        width: 100%;
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.04em !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .modal-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .title-modal-icon {
        width: 32px;
        height: 32px;
    }

    .modal-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .understand-btn {
        width: 100%;
        height: 40px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 20px !important;
        line-height: 24px !important;
        letter-spacing: 0.04em !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .modal-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .title-modal-icon {
        width: 32px;
        height: 32px;
    }

    .modal-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .understand-btn {
        width: 50%;
        height: 40px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 20px !important;
        line-height: 24px !important;
        letter-spacing: 0.04em !important;
    }
}

@media only screen and (min-width: 1300px) {
    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .modal-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .title-modal-icon {
        width: 28px;
        height: 28px;
    }

    .title-modal {
        font-size: 28px;
        line-height: 32px;
    }

    .modal-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 32px;
    }

    .understand-btn {
        width: 50%;
        height: 40px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 18px !important;
        line-height: 24px !important;
        letter-spacing: 0.04em !important;
    }
}

.container_body {
    border-radius: 8px !important;
    box-shadow: 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12), 0px 7px 8px -4px rgba(0, 0, 0, 0.2);
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
    margin-top: 5% !important;
}

.content-container {
    margin-bottom: 5% !important;
}

.modal-info-text {
    color: var(--secondary-gray-text) !important;
}

.understand-btn {
    border-radius: 2px !important;

    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: #CF3F92 !important;
}
</style>

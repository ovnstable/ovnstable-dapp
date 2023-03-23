<template>
    <v-dialog
            v-model="show"
            width="450"
            persistent>
        <v-card class="container_body">
            <v-toolbar class="container_header" flat>
                <v-btn icon class="ml-auto mr-5 mt-10" @click="close">
                    <v-icon class="close-icon">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-row v-if="errorTypeLocal === 'gas'">
              <GasError :error-msg="errorMsgText"></GasError>
            </v-row>
            <v-row v-else-if="errorTypeLocal === 'rpc'">
              <RpcError :error-msg="errorMsgerrorMsgText"></RpcError>
            </v-row>
            <v-row v-else>
              <UndefinedError :error-msg="errorMsg"></UndefinedError>
            </v-row>

        </v-card>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import UndefinedError from "@/components/common/modal/action/errors/UndefinedError.vue";
import RpcError from "@/components/common/modal/action/errors/RpcError.vue";
import GasError from "@/components/common/modal/action/errors/GasError.vue";

export default {
    name: "ErrorModal",
    components: {
      GasError,
      RpcError,
      UndefinedError
    },
    props: {
    },

    computed: {
        ...mapGetters('errorModal', ['show', 'errorType', 'errorMsg']),
    },

    data: () => ({
        showCopyTooltip: false,
        showCopyTooltipContainer: false,
        errorMsgText: '',
        errorTypeLocal: '',
    }),

    created() {
      this.handleError()
    },

    methods: {
        ...mapActions('errorModal', ['showErrorModal', 'closeErrorModal']),

        handleError() {
          if (this.errorMsg.code === 4001) {
            // user cancel transaction
            console.log("User cancel transaction");
            this.closeErrorModal();
            return
          }

          if (this.errorMsg.code === 4001) {
            this.errorMsgText = this.errorMsg.message;
            this.errorTypeLocal  = 'rpc'
            return
          }

          if (this.errorMsg.message.includes('Gas')) {
            this.errorMsgText = this.errorMsg.message;
            this.errorTypeLocal  = 'gas'
          }
        },

        async copyErrorToClipboard(copyTooltip) {
            if (copyTooltip === 'container') {
                this.showCopyTooltipContainer = true;
            }
            if (copyTooltip === 'link') {
                this.showCopyTooltip = true;
            }

            await navigator.clipboard.writeText(JSON.stringify(this.errorMsg));

            await new Promise(resolve => setTimeout(resolve, 1000));

            if (copyTooltip === 'container') {
                this.showCopyTooltipContainer = false;
            }
            if (copyTooltip === 'link') {
                this.showCopyTooltip = false;
            }
        },

        close() {
            this.closeErrorModal();

            this.$emit('input', false);
            this.$emit('m-close');
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {

    .error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 22px;
        line-height: 30px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 34px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 26px;
        line-height: 36px;
    }
}

.container_body {
    border-radius: 24px !important;
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
}

.error-label {
    color: var(--secondary-gray-text);
    font-family: 'Roboto', sans-serif;
}

.discord-label {
    color: var(--secondary-gray-text);
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
}

.discord-link {
    cursor: pointer;
    color: var(--links-blue);
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
}

.discord-link:hover {
    text-decoration: underline;
}

.error-msg-title {
    color: #333333;
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
}

.error-msg-value {
    text-align: center;
    color: #707A8B;
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
}

.error-container, .error-container-row, .error-container-row > label {
    cursor: pointer !important;
}

.error-container:hover label {
    color: #333333 !important;
}
</style>

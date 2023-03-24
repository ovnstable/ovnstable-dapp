<template>
    <v-dialog
            v-model="show"
            width="630"
            persistent>
        <v-card class="container_body py-10 px-10">
            <v-toolbar class="container_header" flat>
                <v-btn icon class="ml-auto" @click="close">
                    <v-icon class="close-icon">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <div v-if="errorViewType === 'gas'">
              <GasError :error-msg="errorText"
                        :error-code="errorCode">
              </GasError>
            </div>
            <div v-else-if="errorViewType === 'rpc'">
              <RpcError :error-msg="errorText"
                        :error-code="errorCode">
              </RpcError>
            </div>
            <div v-else>
              <UndefinedError :error-msg="errorMsg">
              </UndefinedError>
            </div>

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

    data: () => ({
        showCopyTooltip: false,
        showCopyTooltipContainer: false,

        errorText: null,
        errorCode: null,
        errorViewType: null,
    }),

    computed: {
        ...mapGetters('errorModal', ['show', 'errorType', 'errorMsg']),
    },

    created() {
    },

    watch: {
        show: function (val, oldVal) {
            if (val) {
                this.initError();
            }
        },
        errorType: function (val, oldVal) {
            this.initError();
        },
        errorMsg: function (val, oldVal) {
            this.initError();
        },
    },

    methods: {
        ...mapActions('errorModal', ['showErrorModal', 'closeErrorModal']),

        initError() {
            if (!this.errorMsg) {
                return;
            }

            this.errorCode = this.errorMsg.code;
            this.errorText = this.errorMsg.message;

            console.log('this.errorCode', this.errorCode);
            console.log('this.errorText', this.errorText);

            if (this.errorMsg.code === 4001) {
                // user cancel transaction
                console.log("User cancel transaction");
                this.closeErrorModal();
                return
            }

            if (this.isRpcError(this.errorMsg)) {
                this.errorViewType  = 'rpc'
                return
            }

            if (this.errorMsg.message.includes('Out of Gas')) {
                this.errorViewType  = 'gas'
            }

            console.log('Error type not found.')
        },

        isRpcError(errorMsg) {
            if (errorMsg.code === -32016 || errorMsg.code === -32603 ) {
                return true;
            }

            if (!errorMsg.message) {
                return false;
            }

            if (errorMsg.message.includes("-32016") || errorMsg.message.includes("-32603")) {
                return true;
            }

            return false;
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


.container_body {
    border-radius: 24px !important;
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
}

.error-container:hover label {
    color: #333333 !important;
}
</style>

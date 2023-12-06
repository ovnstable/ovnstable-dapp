<template>
    <v-dialog
            v-model="show"
            width="630"
            persistent>
        <v-card class="container_body py-10 px-10">
            <v-toolbar class="container_header" flat>
                <v-btn
                    @click="close"
                    icon
                    class="ml-auto"
                >
                <img :src="require('@/assets/icon/swap/search-close.svg')" alt="close icon">
                </v-btn>
            </v-toolbar>

            <div v-if="errorViewType === 'gas'">
              <GasError
                        :error-msg="errorText"
                        :error-code="errorCode"
                        :copy-error="copyErrorToClipboard">
              </GasError>
            </div>
            <div v-else-if="errorViewType === 'rpc'">
              <RpcError
                        :error-msg="errorText"
                        :error-code="errorCode"
                        :copy-error="copyErrorToClipboard">
              </RpcError>
            </div>
            <div v-else-if="errorViewType === 'slippage'">
              <SlippageError
                        :error-msg="errorText"
                        :error-code="errorCode"
                        :copy-error="copyErrorToClipboard">
              </SlippageError>
            </div>
            <div v-else-if="errorViewType && errorViewType.includes('odos')">
                <OdosError
                    :error-msg="errorText"
                    :error-code="errorCode"
                    :copy-error="copyErrorToClipboard">
                </OdosError>
            </div>
            <div v-else-if="errorViewType === 'highload-network'">
                <HighLoadInfo
                    :error-msg="errorText"
                    :error-code="errorCode"
                    :copy-error="copyErrorToClipboard">
                </HighLoadInfo>
            </div>
            <div v-else-if="errorViewType === 'gas-price-increase'">
                <GasPriceIncreaseInfo
                    :error-msg="errorText"
                    :error-code="errorCode"
                    :copy-error="copyErrorToClipboard">
                </GasPriceIncreaseInfo>
            </div>
            <div v-else-if="errorViewType === 'over-rate-limit'">
                <OverRateLimitInfo
                    :error-msg="errorText"
                    :error-code="errorCode"
                    :copy-error="copyErrorToClipboard">
                </OverRateLimitInfo>
            </div>
            <div v-else-if="errorViewType === 'insufficient-funds'">
                <InsufficientFundsInfo
                    :error-msg="errorText"
                    :error-code="errorCode"
                    :copy-error="copyErrorToClipboard">
                </InsufficientFundsInfo>
            </div>
            <div v-else>
              <UndefinedError
                        :error-msg="errorMsg"
                        :copy-error="copyErrorToClipboard">
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
import SlippageError from "@/components/common/modal/action/errors/SlippageError.vue";
import OdosError from "@/components/common/modal/action/errors/OdosError.vue";
import HighLoadInfo from "@/components/common/modal/action/errors/HighLoadInfo.vue";
import GasPriceIncreaseInfo from "@/components/common/modal/action/errors/GasPriceIncreaseInfo.vue";
import OverRateLimitInfo from "@/components/common/modal/action/errors/OverRateLimitInfo.vue";
import InsufficientFundsInfo from "@/components/common/modal/action/errors/InsufficientFundsInfo.vue";

export default {
    name: "ErrorModal",
    components: {
        InsufficientFundsInfo,
        OverRateLimitInfo,
        GasPriceIncreaseInfo,
        HighLoadInfo,
        OdosError,
        SlippageError,
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
        ...mapActions('errorModal', ['showErrorModal', 'closeErrorModal', 'showErrorModalWithMsg']),

        initError() {
            if (!this.errorMsg) {
                return;
            }

            this.errorCode = this.errorMsg.code;
            this.errorText = this.errorMsg ? (this.errorMsg.message ? this.errorMsg.message : this.errorMsg) : null;

            console.log('this.errorCode', this.errorCode);
            console.log('this.errorText', this.errorText);
            console.log('this.errorText', this.errorType);

            if (this.errorType === 'slippage') {
                this.errorViewType = 'slippage'
                return;
            }

            if (this.errorType === 'highload-network') {
                this.errorViewType = 'highload-network'
                return;
            }

            if (this.errorType === 'gas-price-increase') {
                this.errorViewType = 'gas-price-increase'
                return;
            }

            if (this.errorType === 'over-rate-limit') {
                this.errorViewType = 'over-rate-limit'
                return;
            }

            if (this.errorType === 'insufficient-funds') {
                this.errorViewType = 'insufficient-funds'
                return;
            }

            if (this.errorType.includes('odos')) {
                this.errorViewType = 'odos'
                return;
            }

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

            if (!this.errorMsg.message) {
                console.log('Error type not found.')
                return;
            }

            if (this.errorMsg.message.includes('Out of Gas')) {
                this.errorViewType  = 'gas'
                return;
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

import {mapActions} from "vuex";
import {mapGetters} from "vuex";

export const errorHandler = {
    computed: {
        ...mapGetters('web3', ['web3', 'getWeiMarker']),
        ...mapGetters('gasPrice', ['show', 'gasPrice', 'gasPriceGwei', 'gasPriceStation']),
        ...mapGetters('network', ['getParams', 'networkName', 'networkId']),
        ...mapGetters('accountData', ['account']),

    },
    methods: {

        ...mapActions("errorModal", ['showErrorModal', 'showErrorModalWithMsg']),
        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),

        handleOdosRequestError(e) {
            console.log("Handle Swap odos send request error", e);
            if (!e) {
                this.handleControlledError("Swap odos send request [error is empty]", 'swap', "Error is empty", true);
                return
            }

            if (this.isInsufficientFunds(e)) {
                this.handleControlledError("Swap odos send request [insufficient funds]", 'insufficient-funds', e);
                return;
            }

            this.handleControlledError("Swap odos send request [error undefined]", 'odos', e, true);
        },

        handleTransactionError(e) {
            console.log("Handle Swap odos send transaction error", e);
            if (!e) {
                this.handleControlledError("Swap odos send transaction [error is empty]", 'swap', "Error is empty", true);
                return
            }

            if (this.isUserRejectTx(e)) {
                this.handleControlledError("Swap odos send transaction [user rejected]", 'user-rejected', e);
                return;
            }

            if (this.isGasPriceIncrease(e)) {
                this.handleControlledError("Swap odos send transaction [gas price increase]", 'gas-price-increase', e);
                return;
            }

            if (this.isOverRateLimit(e)) {
                this.handleControlledError("Swap odos send transaction [over rate limit]", 'over-rate-limit', e);
                return;
            }

            if (this.isNetworkHighLoad(e)) {
                this.handleControlledError("Swap odos send transaction [highload network]", 'highload-network', e);
                return;
            }

            this.handleControlledError("Swap odos send transaction [error undefined]", 'swap', e, true);
        },
        isNetworkHighLoad(e) {
            return e.message && e.message.toLowerCase().includes('transaction was within 50 blocks');
        },
        isGasPriceIncrease(e) {
            return e.message && e.message.toLowerCase().includes('transaction underpriced');
        },
        isOverRateLimit(e) {
            return e.message && (e.message.toLowerCase().includes('rate limit'))
        },
        isInsufficientFunds(e) {
            return e.message && (e.message.toLowerCase().includes('insufficient funds'))
        },
        isUserRejectTx(e) {
            return e.code === 4001 && e.message &&
                (
                    e.message.toLowerCase().includes('user rejected') ||
                    e.message.toLowerCase().includes('user denied') ||
                    e.message.toLowerCase().includes('user declined transaction'),
                    e.message.toLowerCase().includes('cancelled')
                );
        },

        handleControlledError(logMessage, errorType, errorMessage, isImportantToLog = false) {
            if (isImportantToLog) {
                console.error(this.getOdosLogMsg({message: logMessage, swapSession: this.swapSessionId, data: errorMessage}));
            } else {
                console.debug(this.getOdosLogMsg({message: logMessage, swapSession: this.swapSessionId, data: errorMessage}));
            }

            this.stopSwapConfirmTimer();
            this.closeWaitingModal();
            this.showErrorModalWithMsg({errorType: errorType, errorMsg: errorMessage});
        },

    }
}

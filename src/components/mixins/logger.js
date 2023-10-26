import {mapGetters} from "vuex";

export const logger = {
    computed: {
        ...mapGetters('network', ['getParams', 'networkId', 'networkName']),
        ...mapGetters('accountData', ['account']),

    },
    methods: {

        getOdosLogMsg(data) {
            let message = data.message;

            try {
                let logMessage = `[ODOS-SWAP] ${message} `;

                let swapSession = data.swapSession;
                logMessage += swapSession ? (" | SwapSession: " + swapSession) : "";

                let msgData = data.data;
                logMessage += msgData ? (": | Data: " + JSON.stringify(msgData)) : "";

                let actualGas = data.actualGas;
                logMessage += actualGas ? (" | Actual gas price: " + actualGas) : "";
                logMessage += " | User Wallet: " + this.account;
                logMessage += " | Chain: " + this.networkName;

                // get first 2000 characters
                logMessage = logMessage.substring(0, 2000);

                return logMessage;
            } catch (e) {
                console.log("[ODOS-SWAP] Error when create log message: ", e);
                return message;
            }
        },

    }
}

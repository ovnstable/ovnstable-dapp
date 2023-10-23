import {mapGetters} from "vuex";

export const logger = {
    computed: {
        ...mapGetters('network', ['getParams', 'networkId', 'networkName']),
        ...mapGetters('accountData', ['account']),

    },
    methods: {

        getOdosLogMsg(message, data = null, actualGas = null) {
           try {
               let logMessage = `[ODOS-SWAP] ${message} `;
               logMessage += data ? (": | Data: " + JSON.stringify(data)) : "";
               logMessage += actualGas ? (" | Actual gas price: " + actualGas) : "";
               logMessage += " | User Wallet: " + this.account;
               logMessage += " | Chain: " + this.networkName;

               return logMessage;
           } catch (e) {
               console.log("[ODOS-SWAP] Error when create log message: ", e);
               return message;
           }
        }
    }
}

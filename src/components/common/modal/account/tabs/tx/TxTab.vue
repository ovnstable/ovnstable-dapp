<template>
    <div>
        <v-row class="account-info-row mt-3" align="center">
            <label class="tx-history-label">Transaction history</label>
            <v-spacer></v-spacer>
            <label class="clear-btn-label" @click="clearTransaction">
                Clear history
            </label>
        </v-row>

        <TxListHeader />

        <div v-for="tx in transactionsList" :key="`${tx.hash}_${tx.pending}`">
            <TxCard class="ma-0 mt-2" :tx-data="tx" />
        </div>

        <resize-observer @notify="$forceUpdate()" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TxCard from "@/components/common/modal/account/tabs/tx/component/TxCard";
import TxListHeader from "@/components/common/modal/account/tabs/tx/component/TxListHeader";

export default {
    name: "TxTab",

    components: { TxListHeader, TxCard },

    computed: {
        ...mapGetters('transaction', ['transactions']),

        transactionsList() {
            console.log(this.transactions, 'transactions')
            return this.transactions.slice().reverse()
        },
    },

    methods: {
        ...mapActions('transaction', ['loadTransaction', 'clearTransaction']),
    },
}
</script>

<style scoped>
/* mobile */
@media only screen and (max-width: 960px) {

    .account-info-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .tx-history-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .clear-btn-label {
        font-style: normal !important;
        font-size: 12px !important;
        line-height: 16px !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .tx-history-label {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .clear-btn-label {
        font-style: normal !important;
        font-size: 12px !important;
        line-height: 16px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .tx-history-label {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .clear-btn-label {
        font-style: normal !important;
        font-size: 12px !important;
        line-height: 16px !important;
    }
}

.account-info-row {
    height: 56px;
}

.tx-history-label {
    color: var(--secondary-gray-text);
}

.clear-btn-label {
    font-style: normal;

    cursor: pointer;
    color: var(--fourth-gray-text);
}

.clear-btn-label:hover {
    color: var(--secondary-gray-text) !important;
}
</style>

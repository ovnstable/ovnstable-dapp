<template>
    <div>
        <v-row class="account-info-row mt-3" align="center">
            <label class="tx-history-label">Transaction history</label>
            <v-spacer></v-spacer>
            <label class="clear-btn-label" @click="clearTransaction">
                Clear history
            </label>
        </v-row>

        <TxListHeader/>

        <template v-for="tx in transactions.slice().reverse()">
            <TxCard class="ma-0 mt-2" :tx-data="tx" v-bind:key="`${tx.hash}_${tx.pending}`" />
        </template>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import TxCard from "@/components/common/modal/account/tabs/tx/component/TxCard";
import TxListHeader from "@/components/common/modal/account/tabs/tx/component/TxListHeader";
import moment from "moment";

export default {
    name: "TxTab",

    components: {TxListHeader, TxCard},

    data: () => ({
    }),

    props: {
    },

    computed: {
        ...mapGetters('transaction', ['transactions']),

        transactionsList: function () {
            return [...this.transactions].sort(
                function(o1,o2){
                    return moment(o1.date).isBefore(moment(o2.date)) ? 1 : moment(o1.date).isAfter(moment(o2.date)) ? -1 : 0;
                }
            );
        },
    },

    watch: {
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
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text);
}

.clear-btn-label {
    font-family: 'Roboto', sans-serif !important;
    font-style: normal;

    cursor: pointer;
    color: var(--fourth-gray-text);
}

.clear-btn-label:hover {
    color: var(--secondary-gray-text) !important;
}
</style>

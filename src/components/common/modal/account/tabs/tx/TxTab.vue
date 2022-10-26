<template>
    <div>
        <v-row class="account-info-row mt-3" align="center">
            <label class="tx-history-label">Transaction history</label>
        </v-row>

        <TxListHeader/>

        <template v-for="tx in transactionsList">
<!--        <template v-for="tx in transactionsMock">-->
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
        transactionsMock: [
            {
                hash: '0x127581hk51k236g12l3hj1g235g1k23g162',
                date: '2022-04-12T02:05:58',
                text: 'Redeem ETS WMATIC/USD+',
                product: 'ets_wmatic_usd_plus',
                productName: 'ETS WMATIC/USD+',
                action: 'redeem',
                amount: 1225465.98,
                pending: false,
                isError: false,
                chain: 137,
            },
            {
                hash: '0x127581hk51k236g12l3hj1g235g1k23g162',
                date: '2022-04-25T11:05:58',
                text: 'Mint ETS GARNET',
                product: 'ets_garnet',
                productName: 'ETS GARNET',
                action: 'mint',
                amount: 165.71,
                pending: false,
                isError: true,
                chain: 10,
            },
            {
                hash: '0x127581hk51k236g12l3hj1g235g1k23g162',
                date: '2022-10-26T04:01:58',
                text: 'Mint USD+',
                product: 'usdPlus',
                productName: 'USD+',
                action: 'mint',
                amount: 1009.80,
                pending: true,
                isError: false,
                chain: 56,
            },
        ]
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
        ...mapActions('transaction', ['loadTransaction']),
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
}

.account-info-row {
    height: 56px;
}

.tx-history-label {
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text);
}
</style>

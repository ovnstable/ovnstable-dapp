<template>
    <v-row class="ma-0 account-info-row list-card-container" align="center" @click="switchCard">
        <v-col :cols="$wu.isMobile() ? 1 : 4">
            <v-row justify="start" align="center">
                <div class="icon" :class="$wu.isMobile() ? 'ml-3' : 'ml-5'">
                    <v-img :src="require('@/assets/currencies/market/' + txData.product + '.svg')"/>
                </div>
                <label class="card-label ml-2" v-if="!$wu.isMobile()">{{ txData.productName }}</label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isMobile() ? 6 : 2">
            <v-row justify="end" align="center">
                <label class="card-label label-amount">
                    {{ (txData.action === 'mint' || txData.action === 'wrap') ? '+' : ((txData.action === 'redeem' || txData.action === 'unwrap') ? '-' : '') }}
                    {{$utils.formatMoneyComma(txData.amount, 2)}}
                </label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()" cols="3">
            <v-row justify="end" align="center">
                <label class="card-label">
                    {{ formatDate(txData.date) }}
                </label>
                <label class="card-label ml-2">
                    {{ formatTime(txData.date) }}
                </label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isMobile() ? 3 : 2">
            <v-row justify="center" align="center">

                <template v-if="$wu.isMobile()">
                    <v-progress-circular
                        v-if="txData.pending"
                        width="2"
                        :size="20"
                        color="#FCCA46"
                        indeterminate
                    ></v-progress-circular>

                    <v-icon class="status-icon" v-else :class="txData.isError ? 'status-failed' : 'status-success'">
                        {{ txData.isError ? 'mdi-close' : 'mdi-check' }}
                    </v-icon>
                </template>

                <label v-else class="card-label" :class="txData.pending ? 'status-pending' : (txData.isError ? 'status-failed' : 'status-success')">
                    {{ txData.pending ? 'Pending' : (txData.isError ? 'Failed' : 'Success') }}
                </label>
            </v-row>
        </v-col>
        <v-col cols="1">
            <v-row justify="end" align="center">
                <v-icon color="var(--secondary-gray-text)" :class="$wu.isMobile() ? '' : 'mr-5'">
                    {{ cardOpened ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
            </v-row>
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "TxCard",

    components: {},

    data: () => ({
        cardOpened: false,
    }),

    props: {
        txData: {
            type: Object,
            default: null,
        },
    },

    computed: {
        ...mapGetters('transaction', ['transactions']),
    },

    watch: {
    },

    methods: {
        ...mapActions('transaction', ['loadTransaction']),

        formatDate(date) {
            return this.$moment.utc(date).format('DD.MM.YYYY');
        },

        formatTime(date) {
            return this.$moment.utc(date).format('HH:mm');
        },

        switchCard() {
            this.cardOpened = !this.cardOpened;
        },
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

    .card-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .card-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .card-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }
}

.list-card-container {
    background: var(--card-coin-background);
    border-radius: 8px;
    height: 56px !important;
}

.list-card-container:hover {
    filter: none !important;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05), 0 4px 4px 0 rgba(0, 0, 0, 0.05);
}

.card-label {
    font-family: 'Roboto', sans-serif !important;
    font-style: normal !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: var(--secondary-gray-text);
}

.status-pending {
    color: #FCCA46 !important;
}

.status-failed {
    color: #CF3F92 !important;
}

.status-success {
    color: #22ABAC !important;
}

.label-amount {
    font-weight: 300 !important;
}

.icon {
    height: 24px !important;
    width: 24px !important;
}

.status-icon {
    height: 20px !important;
}
</style>

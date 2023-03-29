<template>
    <v-row class="ma-0 account-info-row list-card-container" align="center" @click="switchCard">
        <v-col class="my-3" :cols="$wu.isMobile() ? 2 : 4">
            <v-row justify="start" align="center">
                <div class="icon" :class="$wu.isMobile() ? 'ml-3' : 'ml-5'">
                    <v-img :src="require('@/assets/currencies/market/' + txData.product + '.svg')"/>
                </div>
                <div class="network-icon">
                    <v-img class="network-chain-icon" :src="icon"/>
                </div>
                <label class="card-label product-label ml-2" v-if="!$wu.isMobile()">{{ txData.productName }}</label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isMobile() ? 5 : 2">
            <v-row justify="end" align="center">
                <label class="card-label label-amount">
                    {{ (txData.action === 'mint' || txData.action === 'wrap') ? '+' : ((txData.action === 'redeem' || txData.action === 'unwrap' || txData.action === 'withdraw') ? '-' : '') }}
                    ${{$utils.formatMoneyComma(txData.amount, 2)}}
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

                    <v-icon class="status-icon" v-else :class="txData.isError ? 'status-failed' : (txData.isCancelled ? 'status-cancelled' : 'status-success')">
                        {{ (txData.isError || txData.isCancelled) ? 'mdi-close' : 'mdi-check' }}
                    </v-icon>
                </template>

                <label v-else
                       class="card-label"
                       :class="txData.pending ? 'status-pending' : (txData.isError ? 'status-failed' : (txData.isCancelled ? 'status-cancelled' : 'status-success'))">
                    {{ txData.pending ? 'Pending' : (txData.isError ? 'Failed' : (txData.isCancelled ? 'Failed' : 'Success')) }}
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

        <v-col v-if="cardOpened" cols="12">
            <v-divider class="card-divider mt-n2"></v-divider>

            <template v-if="txData.pending">
                <v-row justify="start" align="center" class="mt-4">
                    <label class="success-link" :class="$wu.isMobile() ? 'ml-3' : 'ml-5'" @click.stop="openPendingFaq()">
                        Why does pending take so long?
                    </label>
                    <div class="action-icons ml-1">
                        <v-img :src="require('@/assets/icon/open_in_new_blue.svg')"/>
                    </div>
                </v-row>
                <v-row justify="start" align="center" class="mt-5 mb-1">
                    <label class="success-link" :class="$wu.isMobile() ? 'ml-3' : 'ml-5'" @click.stop="deleteTx()">
                        Delete transaction from history
                        <v-icon class="copy-icon" small>mdi-close</v-icon>
                    </label>
                </v-row>
            </template>

            <template v-if="!txData.pending && !txData.isError && !txData.isCancelled">
                <v-row justify="start" align="center" class="mt-4 mb-1">
                    <label class="success-link" :class="$wu.isMobile() ? 'ml-3' : 'ml-5'" @click.stop="openOnExplorer()">
                        View transaction
                    </label>
                    <div class="action-icons ml-1">
                        <v-img :src="require('@/assets/icon/open_in_new_blue.svg')"/>
                    </div>

                    <template v-if="this.networkId === this.txData.chain">
                        <label class="success-link ml-5" @click.stop="addToken()">
                            Add token
                        </label>
                        <div class="action-icons ml-1">
                            <v-img :src="require('@/assets/icon/wallet_plus.svg')"/>
                        </div>
                    </template>
                </v-row>
            </template>

            <template v-if="!txData.pending && (txData.isError || txData.isCancelled)">
                <v-row justify="start" align="center" class="mt-4" :class="$wu.isMobile() ? (txData.isCancelled ? 'mb-1' : '') : 'mb-1'">
                    <v-tooltip
                        v-if="txData.isError"
                        v-model="showCopyTooltip"
                        color="#202832"
                        bottom
                    >
                        <template v-slot:activator="{on}">
                            <label class="success-link" :class="$wu.isMobile() ? 'ml-3' : 'ml-5'" @click.stop="copyTxIdToClipboard()">
                                Copy tx ID
                                <v-icon class="copy-icon" small>mdi-content-copy</v-icon>
                            </label>
                        </template>
                        <p class="my-0">Copied!</p>
                    </v-tooltip>

                    <template v-else>
                        <label class="success-link" :class="$wu.isMobile() ? 'ml-3' : 'ml-5'" @click.stop="openOnExplorer()">
                            View transaction
                        </label>
                        <div class="action-icons ml-1">
                            <v-img :src="require('@/assets/icon/open_in_new_blue.svg')"/>
                        </div>
                    </template>

                    <template v-if="txData.isCancelled">
                        <label class="success-link ml-5" @click.stop="openFaq()">
                            Open FAQ
                        </label>
                        <div class="action-icons ml-1">
                            <v-img :src="require('@/assets/icon/open_in_new_blue.svg')"/>
                        </div>
                    </template>

                    <template v-if="txData.isError">
                        <template v-if="!$wu.isMobile()">
                            <v-spacer></v-spacer>

                            <label class="success-link" @click.stop="openDiscord()">
                                Contact our support
                            </label>
                            <div class="action-icons ml-1" :class="$wu.isMobile() ? 'mr-3' : 'mr-5'">
                                <v-img :src="require('@/assets/icon/open_in_new_blue.svg')"/>
                            </div>
                        </template>
                    </template>
                </v-row>

                <template v-if="txData.isError">
                    <v-row v-if="$wu.isMobile()" justify="start" align="center" class="mt-5 mb-1">
                        <label class="success-link" :class="$wu.isMobile() ? 'ml-3' : 'ml-5'" @click.stop="openDiscord()">
                            Contact our support
                        </label>
                        <div class="action-icons ml-1">
                            <v-img :src="require('@/assets/icon/open_in_new_blue.svg')"/>
                        </div>
                    </v-row>
                </template>
            </template>
        </v-col>

        <v-col v-if="cardOpened && $wu.isMobile()" cols="12">
            <v-row justify="start" align="center" class="mb-1">
                <label class="date-label" :class="$wu.isMobile() ? 'ml-3' : 'ml-5'">
                    {{ formatDate(txData.date) }}
                </label>
                <label class="date-label ml-2">
                    {{ formatTime(txData.date) }}
                </label>
            </v-row>
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import polygonIcon from "@/assets/network/polygon.svg";
import bscIcon from "@/assets/network/bsc.svg";
import optimismIcon from "@/assets/network/op.svg";
import arbitrumIcon from "@/assets/network/ar.svg";
import zksyncIcon from "@/assets/network/zk.svg";

export default {
    name: "TxCard",

    components: {},

    data: () => ({
        cardOpened: false,
        showCopyTooltip: false,
    }),

    props: {
        txData: {
            type: Object,
            default: null,
        },
    },

    computed: {
        ...mapGetters('transaction', ['transactions']),
        ...mapGetters('network', ['opConfig', 'polygonConfig', 'bscConfig', 'arConfig', 'zkConfig']),
        ...mapGetters('etsAction', ['etsList']),
        ...mapGetters('network', ['networkId']),

        icon: function () {
            switch (this.txData.chain){
                case 137:
                    return polygonIcon;
                case 56:
                    return bscIcon;
                case 10:
                    return optimismIcon;
                case 42161:
                    return arbitrumIcon;
                case 324:
                    return zksyncIcon;
            }
        },
    },

    watch: {
    },

    methods: {
        ...mapActions('transaction', ['loadTransaction', 'deleteTxFromHistory']),
        ...mapActions('tokenAction', ['addUsdPlusToken', 'addDaiPlusToken', 'addwUsdPlusToken', 'addEtsToken', 'addInsuranceToken']),

        formatDate(date) {
            return this.$moment.utc(date).format('DD.MM.YYYY');
        },

        formatTime(date) {
            return this.$moment.utc(date).format('HH:mm');
        },

        switchCard() {
            this.cardOpened = !this.cardOpened;
        },

        openOnExplorer() {
            let explorerUrl;

            switch (this.txData.chain) {
                case 137:
                    explorerUrl = this.polygonConfig.explorerUrl;
                    break;
                case 10:
                    explorerUrl = this.opConfig.explorerUrl;
                    break;
                case 56:
                    explorerUrl = this.bscConfig.explorerUrl;
                    break;
                case 42161:
                    explorerUrl = this.arConfig.explorerUrl;
                    break;
                case 342:
                    explorerUrl = this.zkConfig.explorerUrl;
                    break;
                default:
                    explorerUrl = this.polygonConfig.explorerUrl;
                    break;
            }

            window.open(explorerUrl + `tx/${this.txData.hash}`, '_blank').focus();
        },

        openPendingFaq() {
            window.open("https://overnight.fi/blog/2022/10/28/what-to-do-if-your-transaction-is-still-stuck/", '_blank').focus();
        },

        openFaq() {
            window.open("https://overnight.fi/blog/2022/10/28/what-to-do-if-your-transaction-is-still-stuck/", '_blank').focus();
        },

        addToken() {
            switch (this.txData.product) {
                case 'usdPlus':
                    this.addUsdPlusToken();
                    break;
                case 'daiPlus':
                    this.addDaiPlusToken();
                    break;
                case 'wUsdPlus':
                    this.addwUsdPlusToken();
                    break;
                case 'insurance':
                    this.addInsuranceToken();
                    break;
                default:
                    try {
                        let etsData = this.etsList.filter(ets => ('ets_' + ets.name) === this.txData.product);
                        this.addEtsToken(etsData[0])
                    } catch (e) {
                        console.log("Can not add token " + this.txData.productName + " to a wallet");
                    }
                    break;
            }
        },

        async copyTxIdToClipboard() {
            this.showCopyTooltip = true;

            await navigator.clipboard.writeText(this.txData.hash);

            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showCopyTooltip = false;
        },

        openDiscord() {
            window.open(`https://discord.gg/overnight-fi`, '_blank').focus();
        },

        deleteTx() {
            this.deleteTxFromHistory(this.txData.hash);
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

    .product-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        line-height: 18px !important;
    }

    .success-link {
        font-style: normal !important;
        font-size: 12px !important;
        line-height: 16px !important;
    }

    .date-label {
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

    .card-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .product-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        line-height: 18px !important;
    }

    .success-link {
        font-style: normal !important;
        font-size: 14px !important;
        line-height: 18px !important;
    }

    .date-label {
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

    .card-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .product-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        line-height: 18px !important;
    }

    .success-link {
        font-style: normal !important;
        font-size: 14px !important;
        line-height: 18px !important;
    }

    .date-label {
        font-style: normal !important;
        font-size: 12px !important;
        line-height: 16px !important;
    }
}

.list-card-container {
    background: var(--card-coin-background);
    border-radius: 8px;
    height: 100% !important;
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

.status-cancelled {
    color: var(--fourth-gray-text) !important;
}

.label-amount {
    font-weight: 300 !important;
}

.icon {
    height: 24px !important;
    width: 24px !important;
}

.network-icon {
    height: 16px !important;
    width: 16px !important;
    margin-top: -20px !important;
    margin-left: -8px !important;
    z-index: 1000 !important;
    background-color: var(--card-coin-background);
    border-radius: 9999px !important;
}

.network-chain-icon {
    margin: 2px;
}

.status-icon {
    height: 20px !important;
}

.card-divider {
    border-color: var(--fourth-gray-text) !important;
}

.success-link {
    font-family: 'Roboto', sans-serif !important;
    font-style: normal;

    cursor: pointer;
    color: var(--links-blue);
}

.date-label {
    font-family: 'Roboto', sans-serif !important;
    font-style: normal;

    cursor: pointer;
    color: var(--fourth-gray-text);
}

.copy-icon {
    color: var(--links-blue);
}

.success-link:hover {
    text-decoration: underline;
}

.action-icons {
    width: 16px;
    height: 16px;
}
</style>

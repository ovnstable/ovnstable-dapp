<template>
    <v-dialog
        style="z-index: 1000"
        v-model="show"
        :width="650"
        persistent>
        <v-card class="container_body align-center">
            <v-toolbar class="container_header" flat>
                <v-btn icon class="ml-auto mr-5 mt-10" @click="close">
                    <v-icon class="close-icon">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="px-5 pt-5">
                <v-row justify="center" align="center" class="mb-5">
                    <div class="loading-img">
                        <v-img :src="tokenActionIcon"/>
                    </div>
                </v-row>
                <v-row justify="center" class="mb-8" :class="$wu.isMobile() ? '' : 'mx-8'">
                    <label class="success-label">Transaction successfully submitted</label>
                </v-row>
                <v-row justify="center" class="mb-5">
                    <v-btn dark
                           height="40"
                           width="300"
                           class="dismiss-btn mb-3"
                           @click="goToTransactionHistory">
                        Go to my transaction history
                    </v-btn>
                </v-row>
                <v-row class="mt-8 mb-5">
                    <v-col :cols="$wu.isMobile() ? 12 : 6">
                        <v-row :justify="$wu.isMobile() ? 'center' : 'start'" align="center" :class="$wu.isMobile() ? '' : 'ml-8'">
                            <label class="success-link" @click="addTokenAction">Add {{ actionSuccessToken }} to your
                                wallet
                            </label>
                            <div class="action-icons ml-1">
                                <v-img :src="require('@/assets/icon/wallet_plus.svg')"/>
                            </div>
                        </v-row>
                    </v-col>
                    <v-col :cols="$wu.isMobile() ? 12 : 6">
                        <v-row :justify="$wu.isMobile() ? 'center' : 'end'" align="center" :class="$wu.isMobile() ? '' : 'mr-8'">
                            <label class="success-link" @click="openOnExplorer(successTxHash)">View transaction</label>
                            <div class="action-icons ml-1">
                                <v-img :src="require('@/assets/icon/open_in_new_blue.svg')"/>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <resize-observer @notify="$forceUpdate()"/>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "SuccessModal",

    components: {},

    props: {},

    computed: {
        ...mapGetters('network', ['explorerUrl']),
        ...mapGetters('successModal', ['show', 'successTxHash', 'successAction', 'etsData']),

        actionSuccessToken: function () {
            switch (this.successAction) {
                case 'mintUsdPlus':
                    return 'USD+'
                case 'redeemUsdPlus':
                    return 'USD+'
                case 'wrapUsdPlus':
                    return 'wUSD+'
                case 'unwrapUsdPlus':
                    return 'wUSD+'
                case 'mintEts':
                    return 'ETS ' + (this.etsData ? this.etsData.nameUp : '');
                case 'redeemEts':
                    return 'ETS ' + (this.etsData ? this.etsData.nameUp : '');
                default:
                    return ''
            }
        },

        tokenActionIcon: function () {
            switch (this.successAction) {
                case 'mintUsdPlus':
                    return require('@/assets/icon/minted.svg');
                case 'redeemUsdPlus':
                    return require('@/assets/icon/redeemed.svg');
                case 'wrapUsdPlus':
                    return require('@/assets/icon/wrap.svg');
                case 'unwrapUsdPlus':
                    return require('@/assets/icon/unwrap.svg');
                case 'mintEts':
                    return require('@/assets/currencies/market/ets_' + this.etsData.name + '.svg');
                case 'redeemEts':
                    return require('@/assets/currencies/market/ets_' + this.etsData.name + '.svg');
                default:
                    return ''
            }
        },
    },

    data: () => ({}),

    methods: {
        ...mapActions('successModal', ['showSuccessModal', 'closeSuccessModal']),
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
        ...mapActions('tokenAction', ['addUsdPlusToken', 'addwUsdPlusToken', 'addEtsToken']),
        ...mapActions('swapModal', ['closeSwapModal']),
        ...mapActions('wrapModal', ['closeWrapModal']),
        ...mapActions('investModal', ['closeInvestModal']),
        ...mapActions('accountUI', ['showTxHistory']),


        addTokenAction() {
            switch (this.successAction) {
                case 'mintUsdPlus':
                case 'redeemUsdPlus':
                    this.addUsdPlusToken();
                    break;
                case 'wrapUsdPlus':
                case 'unwrapUsdPlus':
                    this.addwUsdPlusToken();
                    break;
                case 'mintEts':
                case 'redeemEts':
                    this.addEtsToken(this.etsData);
                    break;
                default:
                    break;
            }
        },

        openOnExplorer(hash) {
            if (hash) {
                window.open(this.explorerUrl + `tx/${hash}`, '_blank').focus();
            }
        },

        close() {
            this.closeSuccessModal();

            this.$emit('input', false);
            this.$emit('m-close');
        },

        dismiss() {
            this.close();
        },

        goToTransactionHistory() {
            this.closeSwapModal();
            this.closeWrapModal();
            this.closeInvestModal();

            this.showTxHistory();

            this.close();
        }
    },
}
</script>

<style scoped>


/* mobile */
@media only screen and (max-width: 960px) {

    .success-label {
        font-style: normal;
        font-weight: 400;
        font-size: 22px;
        line-height: 30px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .success-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 34px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .success-label {
        font-style: normal;
        font-weight: 400;
        font-size: 26px;
        line-height: 36px;
    }
}

.container_body {
    border-radius: 24px !important;
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
}

.loading-img {
    width: 120px;
    height: 120px;
}

.success-label {
    color: var(--secondary-gray-text);
    font-family: 'Roboto', sans-serif;
    text-align: center !important;
}

.success-link {
    cursor: pointer;
    color: var(--links-blue);
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
}

.success-link:hover {
    text-decoration: underline;
}

.dismiss-btn {
    background: var(--blue-gradient) !important;
    height: 40px;
    border-radius: 2px;

    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.promo-container {
    background: rgba(252, 202, 70, 0.05);
    border-radius: 4px;
}

.promo-label-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.promo-label-text {
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text);
}

.action-icons {
    width: 20px;
    height: 20px;
    margin-top: 2px;
}
</style>

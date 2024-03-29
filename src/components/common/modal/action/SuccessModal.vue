<template>
    <v-dialog
        style="z-index: 55"
        v-model="show"
        :width="650"
        persistent>
        <v-card class="container_body align-center pt-4 px-8 pb-10">
            <v-toolbar class="container_header" flat>
                <v-btn icon class="ml-auto mr-5 mt-10" @click="close">
                    <img :src="light ? require('@/assets/icon/swap/search-close.svg') : require('@/assets/icon/light-close.svg')" alt="close icon">
                </v-btn>
            </v-toolbar>
            <v-card-text class="px-5 pt-5">
                <v-row justify="center" align="center" class="mb-5">
                    <div class="loading-img">
                        <v-img :src="tokenActionIcon"/>
                    </div>
                </v-row>
                <v-row justify="center" class="mb-8" :class="$wu.isMobile() ? '' : 'mx-8'">
                    <label v-if="successAction === 'swapOdosUsdPlus'"
                           class="success-label">
                        You successfully swapped USD+
                    </label>
                    <label v-else
                           class="success-label">
                        Transaction successfully submitted
                    </label>
                </v-row>

                <div v-if="zksyncFeeHistory">
                    <RefundInfo :zksync-fee-history="zksyncFeeHistory"></RefundInfo>
                </div>

                <v-row v-if="!zksyncFeeHistory" justify="center" class="mb-5">
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
            <div v-if="!isPoolsLoading">
                <BestAprPromotion  :pool="topPool"/>
            </div>
        </v-card>

        <resize-observer @notify="$forceUpdate()"/>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import RefundInfo from "@/components/common/modal/RefundInfo.vue";
import BestAprPromotion from "@/components/common/modal/action/component/BestAprPromotion";
import { pool } from "@/components/mixins/pool";

export default {
    name: "SuccessModal",
    mixins: [pool],

    components: {
        BestAprPromotion,
        RefundInfo
    },

    props: {
    },

    computed: {
        ...mapGetters('network', ['explorerUrl']),
        ...mapGetters("theme", ["light"]),
        ...mapGetters('successModal', ['show', 'successTxHash', 'successAction', 'etsData', 'zksyncFeeHistory']),

        actionSuccessToken: function () {
            switch (this.successAction) {
                case 'mintUsdPlus':
                    return 'USD+'
                case 'redeemUsdPlus':
                    return 'USD+'
                case 'mintDaiPlus':
                    return 'DAI+'
                case 'redeemDaiPlus':
                    return 'DAI+'
                case 'mintUsdtPlus':
                    return 'USDT+'
                case 'redeemUsdtPlus':
                    return 'USDT+'
                case 'wrapUsdPlus':
                    return 'wUSD+'
                case 'unwrapUsdPlus':
                    return 'wUSD+'
                case 'wrapEthPlus':
                    return 'wETH+'   
                case 'unwrapEthPlus':
                    return 'wETH+'       
                case 'mintEts':
                    return 'ETS ' + (this.etsData ? this.etsData.nameToken : '');
                case 'redeemEts':
                    return 'ETS ' + (this.etsData ? this.etsData.nameToken : '');
                case 'swapOdosUsdPlus':
                    return 'USD+'
                case 'mintUsdcPlus':
                    return 'USDC+'   
                case 'redeemUsdcPlus':
                    return 'USDC+'       
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
                case 'mintDaiPlus':
                    return require('@/assets/icon/mintedDai.png');
                case 'redeemDaiPlus':
                    return require('@/assets/icon/redeemedDai.png');
                case 'mintUsdtPlus':
                    return require('@/assets/icon/mintedUsdt.png');
                case 'redeemUsdtPlus':
                    return require('@/assets/icon/redeemedUsdt.png');
                case 'mintEthPlus':
                    return require('@/assets/icon/mintedEth.png');
                case 'redeemEthPlus':
                    return require('@/assets/icon/redeemedEth.png');
                case 'wrapUsdPlus':
                    return require('@/assets/icon/wrap.svg');
                case 'unwrapUsdPlus':
                    return require('@/assets/icon/unwrap.svg');
                case 'wrapEthPlus':
                    return require('@/assets/icon/wETHwrap.svg');
                case 'unwrapEthPlus':
                    return require('@/assets/icon/wETHunwrap.svg');    
                case 'mintEts':
                    if (this.etsData) {
                      return require('@/assets/currencies/market/ets_' + this.etsData.name + '.svg');
                    } else {
                      return require('@/assets/icon/minted.svg');
                    }
                case 'redeemEts':
                    if (this.etsData) {
                      return require('@/assets/currencies/market/ets_' + this.etsData.name + '.svg');
                    } else {
                      return require('@/assets/icon/redeemed.svg');
                    }
                case 'mintInsurance':
                    return require('@/assets/currencies/insurance/round_insurance_optimism.svg');
                case 'withdrawInsurance':
                    return require('@/assets/currencies/insurance/round_insurance_optimism.svg');
                case 'swapOdosUsdPlus':
                    return require('@/assets/icon/minted.svg');
                case 'mintUsdcPlus':
                    return require('@/assets/icon/usdcMinted.svg');
                case 'redeemUsdcPlus':
                    return require('@/assets/icon/usdcRedeemed.svg');    
                default:
                    return ''
            }
        },
    },

    data: () => ({
    }),

    mounted() {
        this.loadPools();
    },

    methods: {
        ...mapActions('successModal', ['showSuccessModal', 'closeSuccessModal']),
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
        ...mapActions('tokenAction', ['addUsdPlusToken', 'addDaiPlusToken', 'addUsdtPlusToken', 'addwUsdPlusToken', 'addEthPlusToken','addwEthPlusToken', 'addEtsToken', 'addInsuranceToken','addUsdcPlusToken']),
        ...mapActions('swapModal', ['closeSwapModal']),
        ...mapActions('wrapModal', ['closeWrapModal']),
        ...mapActions('investModal', ['closeInvestModal']),
        ...mapActions('track', ['trackClick']),
        ...mapActions('accountUI', ['showTxHistory']),


        addTokenAction() {
            console.log(this.successAction)
            switch (this.successAction) {
                case 'mintUsdPlus':
                case 'redeemUsdPlus':
                    this.addUsdPlusToken();
                    // this.trackClick({action: 'add-usdplus-token-click', event_category: 'Add Token And Mint', event_label: 'Minted and add usdplus token', value: 1 });
                    break;

                case 'mintDaiPlus':
                case 'redeemDaiPlus':
                    this.addDaiPlusToken();
                    // this.trackClick({action: 'add-daiplus-token-click', event_category: 'Add Token And Mint', event_label: 'Minted and add daiplus token', value: 1 });
                    break;

                case 'swapOdosUsdPlus':
                    this.addUsdPlusToken();
                    // this.trackClick({action: 'add-daiplus-token-click', event_category: 'Add Token And Swap', event_label: 'Minted and add daiplus token', value: 1 });
                    break;

                case 'mintUsdtPlus':
                case 'redeemUsdtPlus':
                    this.addUsdtPlusToken();
                    // this.trackClick({action: 'add-usdtplus-token-click', event_category: 'Add Token And Mint', event_label: 'Minted and add usdtplus token', value: 1 });
                    break;

                case 'mintEthPlus':
                case 'redeemEthPlus':
                    this.addEthPlusToken();
                    // this.trackClick({action: 'add-usdtplus-token-click', event_category: 'Add Token And Mint', event_label: 'Minted and add usdtplus token', value: 1 });
                    break;
                case 'wrapUsdPlus':
                case 'unwrapUsdPlus':
                    this.addwUsdPlusToken();
                    // this.trackClick({action: 'add-wusdplus-token-click', event_category: 'Add Token And Mint', event_label: 'Minted and add wusdplus token', value: 1 });
                    break;
                case 'wrapEthPlus':
                case 'unwrapEthPlus':    
                    this.addwEthPlusToken();
                    break; 
                case 'mintEts':
                case 'redeemEts':
                    this.addEtsToken(this.etsData);
                    // this.trackClick({action: 'add-ets-token-click', event_category: 'Add Token And Mint', event_label: 'Minted and add ets token', value: 1 });
                    break;
                case 'mintInsurance':
                case 'withdrawInsurance':
                    this.addInsuranceToken();
                    break;  
                case 'mintUsdcPlus':
                case 'redeemUsdcPlus':
                    this.addUsdcPlusToken();
                    break;    
                default:
                    break;
            }
        },

        openOnExplorer(hash) {
            if (hash) {
                window.open(this.explorerUrl + `tx/${hash}`, '_blank').focus();
                // this.trackClick({action: 'open-tx-click', event_category: 'Mint Scan TX', event_label: 'Open scan tx', value: 1 });
            }
        },

        close() {
            this.closeSuccessModal();
            // this.trackClick({action: 'close-success-modal-click', event_category: 'Mint And Redeem Close', event_label: 'Close success modal', value: 1 });


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
        },
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
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.promo-label-text {
    color: var(--secondary-gray-text);
}

.action-icons {
    width: 20px;
    height: 20px;
    margin-top: 2px;
}

.divider {
    border-top: 1px solid #ADB3BD;
}
</style>

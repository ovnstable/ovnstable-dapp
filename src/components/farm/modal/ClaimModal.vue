<template>
    <v-dialog
            :value="showClaim"
            :width="width"
            @input="close"
            :persistent="persistent"
            scrollable>
        <v-card class="container_body">
            <v-toolbar class="container_header" flat>
                <v-row>
                    <v-spacer></v-spacer>
                    <label class="title-modal ml-4">
                        Claim
                    </label>
                    <v-spacer></v-spacer>
                    <v-btn icon class="ml-auto" @click="close" dark>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-row>
            </v-toolbar>

            <v-card-text class="px-5 pt-2">
                <v-row>
                    <v-col class="ml-4 mr-4">
                        <v-row align="center" class="mt-1 mb-2">
                            <div style="display: flex">
                                <div class="currency-icon">
                                    <v-img :src="selectedPool.poolData.token0Icon"/>
                                </div>
                                <div class="currency-icon ml-1">
                                    <v-img :src="selectedPool.poolData.token1Icon"/>
                                </div>
                            </div>

                            <label class="pool-title-label ml-2" v-if="selectedPool && selectedPool.poolData">
                                {{ selectedPool.poolData.title }}
                            </label>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="ml-4 mr-4">
                        <v-row align="center" class="mb-2">
                            <v-btn dark
                                   height="56"
                                   @click="claimRewardAction"
                                   class="buy enabled-buy">
                                Claim Rewards
                            </v-btn>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <WaitingModal/>
        <SuccessModal/>
        <ErrorModal/>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ItemSelector from "../../common/element/ItemSelector";
import ErrorModal from "@/components/common/modal/action/ErrorModal";
import WaitingModal from "@/components/common/modal/action/WaitingModal";
import SuccessModal from "@/components/common/modal/action/SuccessModal";

export default {
    name: "ClaimModal",

    components: {
        ItemSelector,
        ErrorModal,
        WaitingModal,
        SuccessModal,
    },

    props: {
        persistent: {
            type: Boolean,
            default: false,
        },

        width: {
            type: String,
            default: '500',
        }
    },

    computed: {
        ...mapGetters('farmData', ['selectedPool']),
        ...mapGetters('farmUI', ['showClaim']),
        ...mapGetters('accountData', ['account'])
    },

    data: () => ({}),

    created() {
    },

    methods: {
        ...mapActions('farmUI', ['hideClaimModal']),
        ...mapActions("gasPrice", ['refreshGasPrice']),
        ...mapActions('transaction', ['putTransaction']),

        ...mapActions("errorModal", ['showErrorModal']),
        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions("successModal", ['showSuccessModal']),

        async claimRewardAction() {

            console.log('Call claim rewards');
            this.showWaitingModal('Claiming rewards');

            try {
                let from = this.account;
                let self = this;

                let pool = this.selectedPool.contract;

                await this.refreshGasPrice();
                let params = {gasPrice: this.gasPriceGwei, from: from};

                let buyResult = await pool.methods.getReward().send(params).on('transactionHash', function (hash) {
                    let tx = {
                        text: `Claim reward`,
                        hash: hash,
                        pending: true,
                    };
                    self.putTransaction(tx);
                });

                this.closeWaitingModal();
                await this.close();
                this.showSuccessModal(buyResult.transactionHash);
            } catch (e) {
                console.log(e)
                this.showErrorModal('claimRewards');
            }
        },

        close() {
            this.hideClaimModal();

            this.$emit('input', false);
            this.$emit('m-close');
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {
}

@media only screen and (min-width: 1400px) {
}


.container_body {
    border-radius: 24px !important;
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
}

.enabled-buy {
    background: var(--orange-gradient) !important;
}

.disabled-buy {
    background: #181A21 !important;
    box-shadow: none !important;
    border: 1px solid #1D2029 !important;
}

.buy {
    width: 100%;
    border-radius: 40px;
    color: white !important;
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px !important;
    line-height: 24px !important;
    text-transform: none !important;
}

.currency-icon {
    width: 40px;
    height: 40px;
}

.pool-title-label {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}
</style>

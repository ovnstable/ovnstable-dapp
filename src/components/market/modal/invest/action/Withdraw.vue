<template>
    <v-col>
        <v-row class="mx-n3 main-card">
            <v-row class="ma-0 mt-3" align="center">
                <v-text-field placeholder="0.00"
                              @keypress="isNumber($event)"
                              flat
                              solo
                              class="ml-2 field-sum"
                              hide-details
                              background-color="transparent"
                              v-model="sum">
                </v-text-field>
                <v-spacer></v-spacer>
                <div class="mr-5">
                    <label class="max modal-link-label" @click="max">Max</label>
                </div>
                <div class="coin-card mr-5">
                    <v-row class="ma-2" align="center">
                        <div class="coin-img mr-2">
                            <v-img :src="currency.image"/>
                        </div>
                        <label class="coin-title">{{ currency.title }}</label>
                    </v-row>
                </div>
            </v-row>

            <v-row align="center" class="ma-0 mt-1 mb-3">
                <label class="balance-label ml-5">Balance: {{ maxResult }}</label>
            </v-row>
        </v-row>

        <!-- TODO: add sum slider -->

        <v-row class="mt-8">
            <v-spacer></v-spacer>
            <div class="swap-view-btn" @click="showMintView">
                <v-img :src="require('@/assets/icon/arrowsSwap.svg')"/>
            </div>
            <v-spacer></v-spacer>
        </v-row>

        <v-row class="mt-8 mx-n3 main-card">
            <v-row class="ma-0 mt-3" align="center">
                <v-text-field placeholder="0.00"
                              flat
                              readonly
                              solo
                              class="ml-2 field-sum"
                              hide-details
                              background-color="transparent"
                              v-model="sumResult">
                </v-text-field>
                <v-spacer></v-spacer>
                <div class="coin-card mr-5">
                    <v-row class="ma-2" align="center">
                        <div class="coin-img mr-2">
                            <v-img :src="buyCurrency.image"/>
                        </div>
                        <label class="coin-title">{{ buyCurrency.title }}</label>
                    </v-row>
                </div>
            </v-row>

            <v-row align="center" class="ma-0 mt-1 mb-3">
                <label class="balance-label ml-5">Balance: {{ $utils.formatMoney(balance.usdPlus, 3) }}</label>
            </v-row>
        </v-row>

        <!-- TODO: add wrap checkbox -->

        <v-row class="mt-5">
            <v-spacer></v-spacer>
            <label class="exchange-label">1 USD+ = 1 USD+/WMatic</label>
        </v-row>

        <!-- TODO: add gas fee section -->


        <v-row class="mt-10">
            <v-col cols="3">
                <v-row>
                    <label class="action-info-label">Exit fee:</label>
                </v-row>
            </v-col>
            <v-col>
                <v-row>
                    <label class="action-info-sub-label">{{ exitFee ? $utils.formatMoneyComma(exitFee, 2) + '%' : '—' }}</label>
                    <v-spacer></v-spacer>
                    <label class="action-info-label">You withdraw:</label>
                    <label class="action-info-sub-label ml-2">{{ '$' + (estimateResult ? $utils.formatMoneyComma(estimateResult, 2) : '0') }}</label>
                </v-row>
            </v-col>
        </v-row>


        <v-row class="mt-15" :class="$wu.isFull() ? '' : 'mb-4'" align="center" justify="center">
            <div class="action-btn-container" v-if="!this.account">
                <v-btn class='buy enabled-buy'
                       @click="connectWallet">
                    {{ buttonLabel }}
                </v-btn>
            </div>

            <div class="action-btn-container" v-else>
                <v-btn v-if="usdPlusWmaticApproved"
                       height="56"
                       class="buy"
                       :class="isBuy ? 'enabled-buy' : 'disabled-buy'"
                       :disabled="!isBuy"
                       @click="confirmSwapAction">
                    {{ buttonLabel }}
                </v-btn>
                <v-btn v-else
                       height="56"
                       class="buy"
                       :class="isBuy ? 'enabled-buy' : 'disabled-buy'"
                       :disabled="!isBuy"
                       @click="approveAction">
                    {{ buttonLabel }}
                </v-btn>
            </div>
        </v-row>

        <WaitingModal/>
        <SuccessModal/>
        <ErrorModal/>
    </v-col>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ItemSelector from "@/components/common/element/ItemSelector";
import ErrorModal from "@/components/common/modal/action/ErrorModal";
import WaitingModal from "@/components/common/modal/action/WaitingModal";
import SuccessModal from "@/components/common/modal/action/SuccessModal";
import BN from "bn.js";

export default {
    name: "Withdraw",

    components: {
        ItemSelector,
        ErrorModal,
        WaitingModal,
        SuccessModal,
    },

    data: () => ({
        currency: {
            id: 'usdPlusWmatic',
            title: 'USD+/WMATIC',
            image: require('@/assets/currencies/market/WmaticUsdPlus.svg')
        },

        buyCurrency: {
            id: 'usdPlus',
            title: 'USD+',
            image: require('@/assets/currencies/usdPlus.svg')
        },

        sum: null,

        estimatedGas: null,
        gas: null,
        gasAmountInMatic: null,
        gasAmountInUsd: null,
    }),

    computed: {
        ...mapGetters('accountData', ['balance', 'account']),
        ...mapGetters('accountUI', ['loadingBalance']),

        ...mapGetters('investModal', ['usdPlusWmaticApproved']),

        ...mapGetters('marketData', ['wmaticStrategyData']),

        ...mapGetters("web3", ["web3", 'contracts']),
        ...mapGetters("gasPrice", ["gasPriceGwei", "gasPrice", "gasPriceStation"]),

        maxResult: function () {
            return this.$utils.formatMoney(this.balance.usdPlusWmatic, 3);
        },

        sumResult: function () {

            if (!this.sum || this.sum === 0)
                return '0.00';
            else {
                return this.$utils.formatMoney(this.sum.replace(/,/g, '.'), 2);
            }
        },

        exitFee: function () {
            if (this.wmaticStrategyData && this.wmaticStrategyData.fees) {
                let result = this.wmaticStrategyData.fees.find(x => x.id === 'redeem');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        estimateResult: function () {
            return this.sum * (1 - (this.exitFee ? (this.exitFee / 100.0) : 0.0004));
        },

        buttonLabel: function () {

            if (!this.account) {
                return 'Connect to a wallet';
            } else if (this.isBuy) {
                if (this.usdPlusWmaticApproved) {
                    return 'Confirm transaction'
                } else {
                    return 'Approve USD+/WMatic';
                }
            } else if (this.sum > parseFloat(this.balance.usdPlusWmatic)) {
                return 'Invest'
            } else {
                return 'Invest';
            }
        },

        isBuy: function () {
            return this.account && this.sum > 0 && this.numberRule;
        },

        numberRule: function () {

            let v = this.sum;

            if (!v)
                return false;

            if (!v.trim()) return false;

            v = parseFloat(v.trim().replace(/\s/g, ''));

            if (!isNaN(parseFloat(v)) && v >= 0 && v <= parseFloat(this.balance.usdPlusWmatic)) return true;

            return false;
        },
    },

    created() {
        this.estimatedGas = null;

        this.gas = null;
        this.gasAmountInMatic = null;
        this.gasAmountInUsd = null;
    },

    methods: {

        ...mapActions("marketData", ['refreshMarket']),
        ...mapActions("investModal", ['showMintView', 'approveUsdPlusWmatic']),

        ...mapActions("gasPrice", ['refreshGasPrice']),
        ...mapActions("web3", ['connectWallet']),

        ...mapActions("errorModal", ['showErrorModal']),
        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions("successModal", ['showSuccessModal']),


        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            let charCode = (evt.which) ? evt.which : evt.keyCode;

            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                if (charCode === 46 && (!this.sum || this.sum.includes('.'))) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            }
        },

        setSum(value) {
            this.sum = value;
        },

        max() {
            let balanceElement = this.balance[this.currency.id];
            this.sum = balanceElement + "";
        },

        async redeemAction() {

            this.showWaitingModal('Withdrawing ' + this.sumResult + ' USD+/WMatic for ' + this.sumResult + ' USD+');

            try {
                let sum = this.web3.utils.toWei(this.sum, 'mwei');

                let contracts = this.contracts;
                let from = this.account;
                let self = this;

                try {
                    await this.refreshGasPrice();

                    let buyParams = {from: from, gasPrice: this.gasPriceGwei, gas: this.gas};
                    let buyResult = await contracts.exchangerUsdPlusWmatic.methods.redeem(sum).send(buyParams);

                    this.closeWaitingModal();
                    this.showSuccessModal(buyResult.transactionHash);
                } catch (e) {
                    console.log(e)
                    this.closeWaitingModal();
                    this.showErrorModal('withdrawUSD+Wmatic');
                    return;
                }

                self.refreshMarket();
                self.setSum(null);
            } catch (e) {
                console.log(e)
                this.showErrorModal('withdrawUSD+Wmatic');
            }
        },

        async confirmSwapAction() {
            try {
                let sum = this.web3.utils.toWei(this.sum, 'mwei');

                this.showWaitingModal();

                let estimatedGasValue = await this.estimateGas(sum);
                if (estimatedGasValue === -1) {
                    this.closeWaitingModal();
                    this.showErrorModal('estimateGas');
                } else {
                    this.estimatedGas = estimatedGasValue;

                    /* adding 10% to estimated gas */
                    this.gas = new BN(Number.parseFloat(this.estimatedGas) * 1.1);
                    this.gasAmountInMatic = this.web3.utils.fromWei(this.gas.muln(Number.parseFloat(this.gasPrice)), "gwei");
                    this.gasAmountInUsd = this.web3.utils.fromWei(this.gas.muln(Number.parseFloat(this.gasPrice) * Number.parseFloat(this.gasPriceStation.usdPrice)), "gwei");

                    await this.redeemAction();

                    this.closeWaitingModal();
                }
            } catch (e) {
                console.log(e)
                this.showErrorModal('estimateGas');
            }
        },

        async approveAction() {
            try {
                this.showWaitingModal('Approving in process');

                let approveSum = "10000000";

                let sum = this.web3.utils.toWei(approveSum, 'mwei');

                let allowApprove = await this.checkAllowance(sum);
                if (!allowApprove) {
                    this.closeWaitingModal();
                    this.showErrorModal('approve');
                    return;
                } else {
                    this.approveUsdPlusWmatic();
                    this.closeWaitingModal();
                }
            } catch (e) {
                console.log(e)
                this.showErrorModal('approve');
            }
        },

        async checkAllowance(sum) {

            let contracts = this.contracts;
            let from = this.account;

            let allowanceValue = await contracts.usdPlusWmatic.methods.allowance(from, contracts.exchangerUsdPlusWmatic.options.address).call();

            if (allowanceValue < sum) {
                try {
                    await this.refreshGasPrice();
                    let approveParams = {gasPrice: this.gasPriceGwei, from: from};

                    let tx = await contracts.usdPlusWmatic.methods.approve(contracts.exchangerUsdPlusWmatic.options.address, sum).send(approveParams);

                    let minted = true;
                    while (minted) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        let receipt = await this.web3.eth.getTransactionReceipt(tx.transactionHash);

                        if (receipt) {
                            if (receipt.status)
                                return true;
                            else {
                                return false;
                            }
                        }
                    }

                    return true;
                } catch (e) {
                    console.log(e)
                    return false;
                }
            }

            return true;
        },

        async estimateGas(sum) {

            let contracts = this.contracts;
            let from = this.account;

            let result;

            try {
                let estimateOptions = {from: from, "gasPrice": this.gasPriceGwei};

                await contracts.exchangerUsdPlusWmatic.methods.redeem(sum).estimateGas(estimateOptions)
                    .then(function (gasAmount) {
                        result = gasAmount;
                    })
                    .catch(function (error) {
                        console.log(error);
                        return -1;
                    });
            } catch (e) {
                console.log(e);
                return -1;
            }

            return result;
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .max {
        display: none !important;
    }

    .buy {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .balance-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
    }

    .v-text-field >>> input {
        min-height: 36px !important;
        max-height: 36px !important;
        height: 36px !important;
    }

    .v-text-field >>> input, .v-text-field >>> label, .v-text-field >>> button {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 36px;
    }

    .coin-img {
        width: 20px;
        height: 20px;
    }

    .coin-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
    }

    .exchange-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
    }

    .action-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 20px;
    }

    .action-info-sub-label {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
    }

    .modal-link-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
    }

    .swap-view-btn {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }

    .field-sum {
        width: 30%;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .buy {
        height: 48px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 20px !important;
        line-height: 24px !important;
        letter-spacing: 0.04em !important;
    }

    .balance-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
    }

    .v-text-field >>> input {
        min-height: 42px !important;
        max-height: 42px !important;
        height: 42px !important;
    }

    .v-text-field >>> input, .v-text-field >>> label, .v-text-field >>> button {
        font-style: normal;
        font-weight: 400;
        font-size: 40px;
        line-height: 42px;
    }

    .coin-img {
        width: 28px;
        height: 28px;
    }

    .coin-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .exchange-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .action-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .action-info-sub-label {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
    }

    .modal-link-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .swap-view-btn {
        width: 32px;
        height: 32px;
        cursor: pointer;
    }

    .field-sum {
        width: 45%;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .buy {
        height: 48px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 20px !important;
        line-height: 24px !important;
        letter-spacing: 0.04em !important;
    }

    .balance-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
    }

    .v-text-field >>> input {
        min-height: 42px !important;
        max-height: 42px !important;
        height: 42px !important;
    }

    .v-text-field >>> input, .v-text-field >>> label, .v-text-field >>> button {
        font-style: normal;
        font-weight: 400;
        font-size: 40px;
        line-height: 42px;
    }

    .coin-img {
        width: 28px;
        height: 28px;
    }

    .coin-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .exchange-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .action-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .action-info-sub-label {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
    }

    .modal-link-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .swap-view-btn {
        width: 32px;
        height: 32px;
        cursor: pointer;
    }

    .field-sum {
        width: 45%;
    }
}

.main-card {
    background: none !important;
    border: 1px solid #DEE1E5;
    border-radius: 8px;
}

.v-text-field >>> input::placeholder {
    color: #C5C9D1 !important;
}

.v-text-field >>> input, .v-text-field >>> label, .v-text-field >>> button {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;

    color: #1C95E7 !important;
}

.balance-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.max {
    color: var(--link);
    cursor: pointer;
}

.enabled-buy {
    background: var(--blue-gradient) !important;
    color: #FFFFFF !important;
}

.disabled-buy {
    background: #E5E7EA !important;
    color: #9DA4B0 !important;
}

.buy {
    width: 100% !important;
    border-radius: 2px !important;
    font-family: 'Roboto', sans-serif !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    box-shadow: none !important;
}

.exchange-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #8D95A3;
}

.coin-card {
    background: #F5F5F5;
    border-radius: 4px;
}

.coin-title {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #333333;
}

.modal-link-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #1C95E7;
    cursor: pointer;
}

.action-info-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.action-info-sub-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.action-btn-container {
    width: 100% !important;
}
</style>

<template>
    <v-col class="ma-0 pa-0">
        <v-row dense>
            <v-card flat class="main-card">
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-row>
                                <label class="title-row-label ml-5 mt-3">From</label>
                            </v-row>
                            <v-row align="center">
                                <v-text-field placeholder="0.00"
                                              @keypress="isNumber($event)"
                                              flat
                                              solo
                                              class="ml-2 field-sum"
                                              hide-details
                                              dark
                                              background-color="transparent"
                                              v-model="sum">
                                </v-text-field>
                                <v-spacer></v-spacer>
                                <div class="mr-8">
                                    <label class="max mr-5" @click="max">Max</label>
                                    <ItemSelector :readonly="true" :selected-item="buyCurrency" :items="buyCurrencies"/>
                                </div>
                            </v-row>
                            <v-row>
                                <label class="balance-label ml-5 mb-3">Balance: {{ maxResult }}</label>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-row>

        <v-row class="mb-2">
            <v-col>
                <v-row justify="center" align="center">
                    <button @click="showMintView">
                        <v-icon class="swap-btn">mdi-swap-vertical</v-icon>
                    </button>
                </v-row>
            </v-col>
        </v-row>

        <v-row dense>
            <v-card flat class="main-card">
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-row>
                                <label class="title-row-label ml-5 mt-3">To</label>
                            </v-row>
                            <v-row align="center">
                                <v-text-field placeholder="0.00"
                                              flat
                                              readonly
                                              solo
                                              class="ml-2 field-sum"
                                              hide-details
                                              dark
                                              background-color="transparent"
                                              v-model="sumResult">
                                </v-text-field>
                                <v-spacer></v-spacer>
                                <div>
                                    <ItemSelector :selected-item="currency" :items="currencies"/>
                                </div>
                            </v-row>
                            <v-row>
                                <label class="balance-label ml-5 mb-3">Balance: {{
                                        $utils.formatMoney(balance.usdc, 2)
                                    }}</label>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-row>

        <v-row class="main-btn-row" justify="center">
            <div style="width: 96%;" v-if="!this.account">
                <v-btn dark
                       height="56"
                       class='buy enabled-buy'
                       @click="connectWallet">
                    {{ buttonLabel }}
                </v-btn>
            </div>

            <div style="width: 96%;" v-else>
                <v-btn dark
                       v-if="usdPlusApproved"
                       height="56"
                       class="buy"
                       :class="isBuy ? 'enabled-buy' : 'disabled-buy'"
                       :disabled="!isBuy"
                       @click="confirmSwapAction">
                    {{ buttonLabel }}
                </v-btn>
                <v-btn dark
                       v-else
                       height="56"
                       class="buy"
                       :class="isBuy ? 'enabled-buy' : 'disabled-buy'"
                       :disabled="!isBuy"
                       @click="approveAction">
                    {{ buttonLabel }}
                </v-btn>
            </div>
        </v-row>

        <v-dialog
                v-model="showConfirmSwapDialog"
                width="550"
                persistent>
            <v-card class="container_body">
                <v-toolbar class="container_header" flat>
                    <v-toolbar-title class="title">
                        Confirm Swap
                    </v-toolbar-title>
                    <v-btn icon class="ml-auto" @click="showConfirmSwapDialog = false" dark>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="px-5 pt-5">
                    <v-row dense class="pl-2 pr-2">
                        <label class="from-to-label">
                            From
                        </label>
                        <v-spacer></v-spacer>
                        <label class="from-to-label mr-3">
                            {{ sumResult }} USD+
                        </label>
                        <div class="currency-icon">
                            <v-img :src="require('@/assets/currencies/usdPlus.svg')"/>
                        </div>
                    </v-row>

                    <v-row dense class="pl-2 pr-2 pt-5 pb-5">
                        <label class="from-to-label">
                            To
                        </label>
                        <v-spacer></v-spacer>
                        <label class="from-to-label mr-3">
                            {{ sumResult }} USDC
                        </label>
                        <div class="currency-icon">
                            <v-img :src="require('@/assets/currencies/usdc.png')"/>
                        </div>
                    </v-row>

                    <v-row dense class="pl-2 pr-2 pt-6 pb-6">
                        <label class="from-to-sub-label">
                            Output is estimated. You will receive at least&nbsp;&nbsp;
                            <b class="from-to-sub-sum">{{ $utils.formatMoney(estimateResult, 4) }} USDC</b>&nbsp;&nbsp;
                            or the transaction will revert.
                        </label>
                    </v-row>

                    <v-row dense class="pt-5 exchange-row">
                        <label class="add-info-label">
                            Exchange rate
                        </label>
                        <v-spacer></v-spacer>
                        <label class="add-info-label">
                            1 USD+ = 1 USDC
                        </label>
                        <!-- TODO: add swap btn when exchanging rate added -->
                    </v-row>

                    <!-- TODO: add estimated gas row when estimatedGas calculation is ready -->

                    <v-row dense class="pt-5 pb-5 exchange-row">
                        <label class="add-info-label mr-2">
                            Overnight Fee
                        </label>
                        <v-tooltip
                                color="#202832"
                                right
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <div class="currency-icon"
                                     v-bind="attrs"
                                     v-on="on">
                                    <v-img :src="require('@/assets/icon/question-help.svg')"/>
                                </div>
                            </template>
                            <p class="my-0">A portion of each trade (0.04%)</p>
                            <p class="my-0">goes to Overnight as a protocol incentive</p>
                        </v-tooltip>

                        <v-spacer></v-spacer>
                        <!-- TODO: change when price impact calculation added -->
                        <label class="add-info-label">
                            ${{ $utils.formatMoney(estimateFee, 4) }}
                        </label>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-btn dark
                                   height="56"
                                   class="buy enabled-buy"
                                   @click="redeem">
                                Confirm
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <WaitingModal/>
        <SuccessModal/>
        <ErrorModal/>
    </v-col>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ItemSelector from "../common/ItemSelector";
import ErrorModal from "@/components/common/ErrorModal";
import WaitingModal from "@/components/common/WaitingModal";
import SuccessModal from "@/components/common/SuccessModal";


export default {
    name: "Redeem",

    components: {
        ItemSelector,
        ErrorModal,
        WaitingModal,
        SuccessModal,
    },

    data: () => ({
        menu: false,
        tab: null,
        currency: {id: 'usdc'},

        currencies: [],

        sum: null,

        gas: null,

        buyCurrency: null,
        buyCurrencies: [{
            id: 'usdPlus',
            title: 'USD+',
            image: require('../../assets/usdPlus.png')
        }],

        showConfirmSwapDialog: false,

        estimatedGas: null,
    }),

    computed: {

        ...mapGetters("profile", ['balance', 'gasPrice', 'loadingBalance']),
        ...mapGetters("web3", ["web3", 'account', 'contracts']),
        ...mapGetters("logTransactions", ["transactions"]),
        ...mapGetters("gasPrice", ["gasPriceGwei"]),
        ...mapGetters("approve", ["usdPlusApproved"]),


        sumResult: function () {
            if (!this.sum || this.sum === 0) {
                return '0.00';
            } else {
                return this.$utils.formatMoney(this.sum.replace(/,/g, '.'), 2);
            }
        },

        estimateResult: function () {
            return this.sum * 0.9996;
        },

        estimateFee: function () {
            return this.sum * 0.0004;
        },

        numberRule: function () {

            let v = this.sum;

            if (!v)
                return false;

            if (!v.trim()) return false;

            v = parseFloat(v);

            if (!isNaN(parseFloat(v)) && v >= 0 && v <= parseFloat(this.balance.usdPlus)) return true;


            return false;
        },

        maxResult() {
            return this.$utils.formatMoney(this.balance.usdPlus, 2);
        },

        buttonLabel: function () {

            if (!this.account) {
                return 'You need to connect to a wallet';
            } else if (this.isBuy) {
                if (this.usdPlusApproved) {
                    return 'Confirm Swap'
                } else {
                    return 'Approve USD+';
                }
            } else if (this.sum > parseFloat(this.balance.usdPlus)) {
                return 'Invalid amount'
            } else {
                return 'Enter an amount';
            }
        },

        isBuy: function () {
            return this.account && this.sum > 0 && this.numberRule;
        },
    },

    created() {
        this.currencies.push({
            id: 'usdc',
            title: 'USDC',
            image: require('../../assets/currencies/usdc.png')
        });
        this.currencies.push({
            id: 'usdt',
            title: 'USDT (Soon)',
            disabled: true,
            image: require('../../assets/currencies/usdt.svg')
        });
        this.currencies.push({
            id: 'dai',
            title: 'DAI (Soon)',
            disabled: true,
            image: require('../../assets/currencies/dai.svg')
        });

        this.currency = this.currencies[0];

        this.buyCurrency = this.buyCurrencies[0];

        this.estimatedGas = null;

        this.showConfirmSwapDialog = false;
    },

    methods: {

        ...mapActions("profile", ['refreshAfterMintRedeem']),
        ...mapActions("gasPrice", ['refreshGasPrice']),
        ...mapActions("mintRedeemView", ['showMintView']),
        ...mapActions("web3", ['connectWallet']),
        ...mapActions("errorModal", ['showErrorModal']),
        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions("successModal", ['showSuccessModal']),
        ...mapActions("approve", ['approveUsdPlus']),


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
            let balanceElement = this.balance.usdPlus;
            this.sum = balanceElement + "";
        },

        async redeem() {

            this.showConfirmSwapDialog = false;
            this.showWaitingModal('Swapping ' + this.sumResult + ' USD+ for ' + this.sumResult + ' USDC');

            try {
                let sum = this.sum * 10 ** 6;
                sum = Math.floor(sum);
                let self = this;

                let contracts = this.contracts;
                let from = this.account;

                try {
                    await this.refreshGasPrice();
                    let buyParams = {gasPrice: this.gasPriceGwei, from: from};
                    let redeemResult = await contracts.exchange.methods.redeem(contracts.usdc.options.address, sum).send(buyParams);

                    this.closeWaitingModal();
                    this.showSuccessModal(redeemResult.transactionHash);
                } catch (e) {
                    console.log(e)
                    this.closeWaitingModal();
                    this.showErrorModal('buyUSDC');
                    return;
                }

                self.refreshAfterMintRedeem();
                self.setSum(null)
            } catch (e) {
                console.log(e)
                this.showErrorModal('buyUSDC');
            }
        },

        async confirmSwapAction() {
            try {
                let sum = this.sum * 10 ** 6;
                sum = Math.floor(sum);

                this.showWaitingModal();

                let estimatedGasValue = await this.estimateGas(sum);
                if (estimatedGasValue === -1) {
                    this.closeWaitingModal();
                    this.showErrorModal('estimateGas');
                    return;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    this.estimatedGas = estimatedGasValue;
                    this.closeWaitingModal();
                    this.showConfirmSwapDialog = true;
                }
            } catch (e) {
                console.log(e)
                this.showErrorModal('estimateGas');
            }
        },

        async approveAction() {
            try {
                this.showWaitingModal('Approving in process');

                let approveSum = 10000000;

                let sum = approveSum * 10 ** 6;
                sum = Math.floor(sum);

                let allowApprove = await this.checkAllowance(sum);
                if (!allowApprove) {
                    this.closeWaitingModal();
                    this.showErrorModal('approve');
                    return;
                } else {
                    this.approveUsdPlus();
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

            let allowanceValue = await contracts.usdPlus.methods.allowance(from, contracts.exchange.options.address).call();

            if (allowanceValue < sum) {
                try {
                    await this.refreshGasPrice();
                    let approveParams = {gasPrice: this.gasPriceGwei, from: from};
                    let tx = await contracts.usdPlus.methods.approve(contracts.exchange.options.address, sum).send(approveParams);

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

            try {
                let estimateOptions = {from: from, value: sum};

                await contracts.exchange.methods.redeem(contracts.usdc.options.address, sum).estimateGas(estimateOptions)
                    .then(function (gasAmount) {
                        return gasAmount;
                    })
                    .catch(function (error) {
                        console.log(error)
                        return -1;
                    });
            } catch (e) {
                console.log(e)
                return -1;
            }
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {
    .max {
        display: none !important;
    }

    .exchange-row {
        padding-left: 8px;
        padding-right: 8px;
    }

    .buy {
        height: 46px !important;
    }

    .main-btn-row {
        margin-top: 28px;
    }
}

@media only screen and (min-width: 1400px) {
    .exchange-row {
        padding-left: 28px;
        padding-right: 28px;
    }

    .buy {
        height: 56px;
    }

    .main-btn-row {
        margin-top: 40px;
    }
}

.main-card {
    background: none !important;
    width: 100%;
    border: 1px solid #181E25;
    border-radius: 16px;
}

.title-row-label {
    color: white;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
}

.v-text-field >>> input {
    font-size: 34px !important;
    font-style: normal !important;
    font-weight: 300 !important;
    min-height: 48px !important;
    max-height: 48px !important;
    height: 48px !important;
}

.v-text-field >>> label {
    font-size: 34px !important;
}

.v-text-field >>> button {
    font-size: 34px !important;
}

.field-sum {
    width: 45%;
}

.balance-label {
    color: white;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
}

.max {
    color: var(--link);
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    cursor: pointer;
}

.swap-btn {
    color: var(--link);
}

.enabled-buy {
    background: var(--orange-gradient) !important;
}

.disabled-buy {
    background: #202932 !important;
}

.buy {
    width: 100%;
    border-radius: 40px;
    color: white !important;
}

.title {
    color: white;
    font-weight: 300;
    font-size: 20px;
}

.container_body {
    border-radius: 24px;
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
}

.from-to-label {
    color: white;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
}

.from-to-sub-label {
    color: #6A84A0;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
}

.from-to-sub-sum {
    color: white;
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
}

.currency-icon {
    width: 24px;
    height: 24px;
}

.add-info-label {
    color: white;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
}
</style>

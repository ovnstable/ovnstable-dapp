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
                                <!-- TODO: filtrate non-digits characters -->
                                <v-text-field placeholder="0.00"
                                              flat
                                              solo
                                              class="ml-2 field-sum"
                                              hide-details
                                              dark
                                              background-color="transparent"
                                              :rules="[numberRule]"
                                              v-model="sum">
                                </v-text-field>
                                <v-spacer></v-spacer>
                                <div class="mr-5">
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
                                <label class="title-row-label ml-5 mt-3">From</label>
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
                                              :rules="[numberRule]"
                                              v-model="sumResult">
                                </v-text-field>
                                <v-spacer></v-spacer>
                                <div class="mr-5">
                                    <ItemSelector :selected-item="currency" :items="currencies"/>
                                </div>
                            </v-row>
                            <v-row>
                                <label class="balance-label ml-5 mb-3">Balance: {{ $utils.formatMoney(balance.usdc, 2) }}</label>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-row>

        <v-row class="mt-10">
            <v-btn dark height="56" class="buy" :class="isBuy ? 'enabled-buy' : 'disabled-buy'" @click="redeem"
                   :disabled="!isBuy">
                {{ buttonLabel }}
            </v-btn>
        </v-row>
    </v-col>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ItemSelector from "../common/ItemSelector";
import ToastTransaction from "../common/ToastTransaction";


export default {
    name: "Redeem",

    components: {ItemSelector},

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
    }),

    computed: {

        ...mapGetters("profile", ['balance', 'gasPrice', 'loadingBalance']),
        ...mapGetters("web3", ["web3", 'account', 'contracts']),
        ...mapGetters("logTransactions", ["transactions"]),
        ...mapGetters("gasPrice", ["gasPriceGwei"]),


        sumResult: function () {
            if (!this.sum || this.sum === 0) {
                return '0.00';
            } else {
                return this.$utils.formatMoney(this.sum.replace(/,/g, '.'), 2);
            }
        },

        numberRule: function () {

            let v = this.sum;

            if (!v) {
                return false;
            }

            if (!v.trim()) {
                return false;
            }

            v = parseFloat(v.trim().replace(/\s/g, ''));

            if (!isNaN(parseFloat(v)) && v >= 0 && v <= parseFloat(this.balance.usdPlus)) {
                return true;
            }

            return false
        },

        maxResult() {
            return this.$utils.formatMoney(this.balance.usdPlus, 2);
        },

        buttonLabel: function () {

            if (!this.account) {
                return 'You need to connect to a wallet';
            } else if (this.isBuy) {
                return 'Confirm Swap'
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
        this.currencies.push({id: 'usdc', title: 'USDC', image: require('../../assets/currencies/usdc.png')});
        this.currencies.push({id: 'usdt', title: 'USDT (Soon)', disabled: true, image: require('../../assets/currencies/usdt.svg')});
        this.currencies.push({id: 'dai', title: 'DAI (Soon)', disabled: true, image: require('../../assets/currencies/dai.svg')});

        this.currency = this.currencies[0];

        this.buyCurrency = this.buyCurrencies[0];
    },

    methods: {

        ...mapActions("profile", ['refreshAfterMintRedeem']),
        ...mapActions("gasPrice", ['refreshGasPrice']),
        ...mapActions("showTransactions", ['show', 'hide', 'addText', 'failed']),
        ...mapActions("mintRedeemView", ['showMintView']),

        setSum(value) {
            this.sum = value;
        },

        max() {
            let balanceElement = this.balance.usdPlus;
            this.sum = balanceElement + "";
        },

        async redeem() {
            try {

                let sum = this.sum * 10 ** 6;
                sum = Math.floor(sum);
                let self = this;

                let contracts = this.contracts;
                let from = this.account;


                this.show('Processing...')
                this.addText(`Locking ${this.sum} USD+ ......  done`)


                let allowApprove = await this.checkAllowance(sum);
                if (!allowApprove) {
                    this.failed();
                    return;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

                self.addText(`Burning ${self.sum} USD+ ......  done`);
                self.addText(`Transferring ${self.sum} USDC to ${from.substring(1, 10)}  ......  done`);

                try {
                    await this.refreshGasPrice();
                    let buyParams = {gasPrice: this.gasPriceGwei, from: from};
                    console.log(`Try redeem ${contracts.usdc.options.address} ${sum}`);
                    let redeemResult = await contracts.exchange.methods.redeem(contracts.usdc.options.address, sum).send(buyParams);
                    this.showSuccessRedeemToast(self.sum, redeemResult.transactionHash)
                } catch (e) {
                    console.log(e)
                    this.failed();
                    return;
                }


                self.addText(`Completed, await blockchain, click to proceed`);
                setTimeout(() => self.hide(), 1000);

                self.refreshAfterMintRedeem();
                self.setSum(null)

            } catch (e) {
                console.log(e)
                this.failed();
            }
        },

        async checkAllowance(sum) {

            let contracts = this.contracts;
            let from = this.account;

            let allowanceValue = await contracts.usdPlus.methods.allowance(from, contracts.exchange.options.address).call();
            console.log('Allowance value ' + allowanceValue)

            if (allowanceValue < sum) {
                try {
                    await this.refreshGasPrice();
                    let approveParams = {gasPrice: this.gasPriceGwei, from: from};
                    let tx = await contracts.usdPlus.methods.approve(contracts.exchange.options.address, sum).send(approveParams);

                    let minted = true;
                    while (minted) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        let receipt = await this.web3.eth.getTransactionReceipt(tx.transactionHash);
                        console.log('Check receipt: ' + receipt)
                        if (receipt) {
                            if (receipt.status)
                                return true;
                            else {
                                this.failed();
                                return false;
                            }
                        }
                    }

                } catch (e) {
                    console.log(e)
                    this.failed();
                    return false;
                }
            }

            return true;
        },

        showSuccessRedeemToast(sum, tx) {
            const content = {
                component: ToastTransaction,
                props: {
                    text: `Redeem ${sum} USDC`,
                    tx: tx,
                },
            }
            this.$toast(content, {position: "top-right", type: 'success', timeout: 10000});
        },

        selectItem(item) {
            this.currency = item;
        }
    }
}
</script>

<style scoped>

.main-card {
    background: none;
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

.sum-row-label {
    font-style: normal;
    font-weight: 300;
    font-size: 34px;
    line-height: 42px;
    background: var(--orange-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.field-sum {
    width: 40%;
    font-style: normal;
    font-weight: 300;
    font-size: 34px;
    line-height: 42px;
}

.v-text-field > input {
    background: var(--orange-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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
    height: 56px;
    border-radius: 40px;
    color: white !important;
}
</style>

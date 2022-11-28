<template>
    <v-col>
        <v-row class="mx-n3 main-card">
            <v-col :cols="$wu.isMobile() ? 9 : 6">
                <v-row align="center" class="ma-0">
                    <label class="balance-label ml-3">Balance: {{ maxResult }}</label>
                    <div class="balance-network-icon ml-2">
                        <v-img :src="icon"/>
                    </div>
                </v-row>

                <v-row class="ma-0 mt-1" align="center">
                    <v-text-field placeholder="0.00"
                                  @keypress="isNumber($event)"
                                  flat
                                  solo
                                  class="field-sum"
                                  hide-details
                                  background-color="transparent"
                                  v-model="sum">
                    </v-text-field>
                </v-row>
            </v-col>

            <v-col>
                <v-row align="center" class="ma-0 fill-height">
                    <v-spacer></v-spacer>
                    <div class="coin-card mr-3">
                        <v-row class="ma-2" align="center">
                            <div class="coin-img" :class="$wu.isMobile() ? '' : 'mr-2'">
                                <v-img :src="currency.image"/>
                            </div>
                            <label class="coin-title" v-if="!$wu.isMobile()">{{ currency.title }}</label>
                        </v-row>
                    </div>
                </v-row>
            </v-col>
        </v-row>

        <v-row class="mt-5">
            <v-slider
                class="percent-slider"
                color="#1C95E7"
                track-color="var(--main-border)"
                track-fill-color="#1C95E7"
                tick-size="10"
                min="0"
                max="100"
                v-model="sliderPercent"
                step="5"
                ticks
                :tick-labels="percentLabels"
                v-on:end="changeSliderPercent"
            ></v-slider>
        </v-row>

        <v-row class="mt-5">
            <v-spacer></v-spacer>
            <div class="swap-view-btn" @click="showMintView">
                <v-img :src="require('@/assets/icon/arrowsSwap.svg')"/>
            </div>
            <v-spacer></v-spacer>
        </v-row>

        <v-row class="mt-8 mx-n3 main-card">
            <v-col :cols="$wu.isMobile() ? 9 : 6">
                <v-row align="center" class="ma-0">
                    <label class="balance-label ml-3">Balance:
                        {{ $utils.formatMoney(actionAssetBalance[etsData.actionAsset], 3) }}</label>
                    <div class="balance-network-icon ml-2">
                        <v-img :src="icon"/>
                    </div>
                </v-row>

                <v-row class="ma-0 mt-1" align="center">
                    <v-text-field placeholder="0.00"
                                  flat
                                  readonly
                                  solo
                                  class="field-sum"
                                  hide-details
                                  background-color="transparent"
                                  v-model="sumResult">
                    </v-text-field>
                </v-row>
            </v-col>

            <v-col>
                <v-row align="center" class="ma-0 fill-height">
                    <v-spacer></v-spacer>
                    <div class="coin-card mr-3">
                        <v-row class="ma-2" align="center">
                            <div class="coin-img" :class="$wu.isMobile() ? '' : 'mr-2'">
                                <v-img :src="buyCurrency.image"/>
                            </div>
                            <label class="coin-title" v-if="!$wu.isMobile()">{{ buyCurrency.title }}</label>
                        </v-row>
                    </div>
                </v-row>
            </v-col>
        </v-row>

        <!-- TODO: add wrap checkbox -->

        <v-row class="mt-5">
            <v-spacer></v-spacer>
            <label class="exchange-label">1 ETS {{ etsData.nameToken }} = 1 {{ etsData.actionTokenName }}</label>
        </v-row>

        <v-row class="mt-10">
            <v-col cols="3">
                <v-row align="center">
                    <label class="action-info-label">Gas settings:</label>
                </v-row>
            </v-col>
            <v-col>
                <v-row align="center">
                    <GasSettingsMenu />
                </v-row>
            </v-col>
            <v-col cols="1">
                <v-row align="center" justify="end">
                    <Tooltip text="Accelerating a transaction by using a higher gas price increases its chances of getting processed by the network faster, but it is not always guaranteed."/>
                </v-row>
            </v-col>
        </v-row>

        <v-row class="mt-5">
            <v-col cols="3">
                <v-row>
                    <label class="action-info-label">Redeem fee:</label>
                </v-row>
            </v-col>
            <v-col>
                <v-row>
                    <label class="action-info-sub-label">{{
                            exitFee ? $utils.formatMoneyComma(exitFee, 2) + '%' : '—'
                        }}</label>
                    <v-spacer></v-spacer>
                    <label class="action-info-label">You redeem:</label>
                    <label class="action-info-sub-label ml-2">{{
                            '$' + (estimateResult ? $utils.formatMoneyComma(estimateResult, 2) : '0')
                        }}</label>
                </v-row>
            </v-col>
        </v-row>


        <v-row class="mt-15" align="center" justify="center">
            <div class="action-btn-container" v-if="!this.account">
                <v-btn class='buy enabled-buy'
                       @click="connectWallet">
                    {{ buttonLabel }}
                </v-btn>
            </div>

            <div class="action-btn-container" v-else>
                <v-btn v-if="etsTokenApproved"
                       height="56"
                       class="buy"
                       :class="isBuy ? 'enabled-buy' : 'disabled-buy'"
                       :disabled="!isBuy"
                       @click="confirmSwapAction">
                    <v-progress-circular
                        v-if="transactionPending"
                        class="mr-2"
                        width="2"
                        :size="18"
                        indeterminate
                    ></v-progress-circular>
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

        <v-row class="mt-5" :class="$wu.isFull() ? '' : 'mb-4'">
            <v-slider
                readonly
                class="step-slider"
                color="#1C95E7"
                track-color="var(--main-border)"
                track-fill-color="#1C95E7"
                tick-size="10"
                min="0"
                max="2"
                v-model="step"
                step="1"
                ticks
                :tick-labels="stepLabels"
            ></v-slider>
        </v-row>

        <WaitingModal/>
        <SuccessModal/>
        <ErrorModal/>

        <resize-observer @notify="$forceUpdate()"/>
    </v-col>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ErrorModal from "@/components/common/modal/action/ErrorModal";
import WaitingModal from "@/components/common/modal/action/WaitingModal";
import SuccessModal from "@/components/common/modal/action/SuccessModal";
import BN from "bn.js";
import polygonIcon from "@/assets/network/polygon.svg";
import avaxIcon from "@/assets/network/avalanche.svg";
import optimismIcon from "@/assets/network/op.svg";
import bscIcon from "@/assets/network/bsc.svg";
import {axios} from "@/plugins/http-axios";
import Tooltip from "@/components/common/element/Tooltip";
import GasSettingsMenu from "@/components/common/modal/gas/components/GasSettingsMenu";

export default {
    name: "Withdraw",

    components: {
        GasSettingsMenu,
        Tooltip,
        ErrorModal,
        WaitingModal,
        SuccessModal,
    },

    data: () => ({
        sum: null,

        estimatedGas: null,
        gas: null,
        gasAmountInMatic: null,
        gasAmountInUsd: null,

        sliderPercent: 0,
        step: 0,
    }),

    computed: {
        ...mapGetters('accountData', ['balance', 'etsBalance', 'actionAssetBalance', 'account']),
        ...mapGetters('transaction', ['transactions']),
        ...mapGetters('investModal', ['etsData', 'etsTokenApproved']),
        ...mapGetters('marketData', ['etsStrategyData']),
        ...mapGetters("network", ['networkId', 'polygonApi']),
        ...mapGetters("web3", ["web3", 'contracts']),
        ...mapGetters("gasPrice", ["gasPriceGwei", "gasPrice", "gasPriceStation"]),
        ...mapGetters('overcapData', ['isOvercapAvailable', 'walletOvercapLimit']),

        icon: function () {
            switch (this.networkId) {
                case 137:
                    return polygonIcon;
                case 43114:
                    return avaxIcon;
                case 10:
                    return optimismIcon;
                case 56:
                    return bscIcon;
            }
        },

        maxResult: function () {
            return this.$utils.formatMoney(this.etsBalance[this.etsData.name], 3);
        },

        buyCurrency: function () {
            return {
                id: this.etsData.actionAsset,
                title: this.etsData.actionTokenName,
                image: require('@/assets/currencies/' + this.etsData.actionTokenName + '.png')
            }
        },

        currency: function () {
            return {
                id: this.etsData.name,
                title: 'ETS ' + this.etsData.nameToken,
                image: require('@/assets/currencies/market/ets_' + this.etsData.name + '.svg')
            }
        },

        stepLabels: function () {
            return ['', 'Approve ETS', 'Confirmation'];
        },

        sumResult: function () {
            this.sliderPercent = parseFloat(this.sum) / parseFloat(this.etsBalance[this.etsData.name]) * 100;

            if (!this.sum || this.sum === 0)
                return '0.00';
            else {
                return this.$utils.formatMoney(this.sum.replace(/,/g, '.'), 2);
            }
        },

        exitFee: function () {
            if (this.etsStrategyData[this.etsData.name] && this.etsStrategyData[this.etsData.name].fees) {
                let result = this.etsStrategyData[this.etsData.name].fees.find(x => x.id === 'redeem');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        estimateResult: function () {
            return this.sum * (1 - (this.exitFee ? (this.exitFee / 100.0) : 0));
        },

        buttonLabel: function () {
            this.step = 0;

            if (!this.account) {
                return 'Connect to a wallet';
            } else if (this.transactionPending) {
                return 'Transaction is pending';
            } else if (this.isBuy) {
                if (this.etsTokenApproved) {
                    this.step = 2;
                    return 'Confirm transaction'
                } else {
                    this.step = 1;
                    return 'Approve ETS';
                }
            } else if (this.sum > parseFloat(this.etsBalance[this.etsData.name])) {
                return 'Withdraw'
            } else {
                return 'Withdraw';
            }
        },

        isBuy: function () {
            return this.account && this.sum > 0 && this.numberRule && !this.transactionPending;
        },

        transactionPending: function () {
            return this.transactions.filter(value => (value.pending && (value.chain === this.networkId) && (value.product === ('ets_' + this.etsData.name)) && (value.action === 'redeem'))).length > 0;
        },

        numberRule: function () {

            let v = this.sum;

            if (!v)
                return false;

            if (!v.trim()) return false;

            v = parseFloat(v.trim().replace(/\s/g, ''));

            if (!isNaN(parseFloat(v)) && v >= 0 && v <= parseFloat(this.etsBalance[this.etsData.name])) return true;

            return false;
        },

        percentLabels: function () {
            let labelList = [];

            for (let i = 0; i <= 100; i += 5) {
                if (i % 25 === 0) {
                    labelList.push(i + '%');
                } else {
                    labelList.push('');
                }
            }

            return labelList;
        }
    },

    created() {
        this.estimatedGas = null;

        this.gas = null;
        this.gasAmountInMatic = null;
        this.gasAmountInUsd = null;
    },

    methods: {

        ...mapActions("marketData", ['refreshMarket']),
        ...mapActions("investModal", ['showMintView', 'approveEtsToken']),

        ...mapActions("gasPrice", ['refreshGasPrice']),
        ...mapActions("walletAction", ['connectWallet']),

        ...mapActions("errorModal", ['showErrorModal']),
        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions("successModal", ['showSuccessModal']),

        ...mapActions("overcapData", ['returnOvercap']),

        ...mapActions("transaction", ['putTransaction', 'loadTransaction']),

        changeSliderPercent() {
            this.sum = (this.etsBalance[this.etsData.name] * (this.sliderPercent / 100.0)).toFixed(this.sliderPercent === 0 ? 0 : 6) + '';
        },

        isNumber: function (evt) {
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
            let balanceElement = this.etsBalance[this.etsData.name];
            this.sum = balanceElement + "";
        },

        async redeemAction() {
            try {
                let sumInUsd = this.sum;
                let sum;

                switch (this.etsData.etsTokenDecimals) {
                    case 6:
                        sum = this.web3.utils.toWei(this.sum, 'mwei');
                        break;
                    case 8:
                        sum = this.web3.utils.toWei(this.sum, 'mwei') * 100;
                        break;
                    case 18:
                        sum = this.web3.utils.toWei(this.sum, 'ether');
                        break;
                    default:
                        break;
                }

                let contracts = this.contracts;
                let from = this.account;
                let self = this;

                try {
                    await this.refreshGasPrice();

                    let buyParams;

                    if (this.gas == null) {
                        buyParams = {from: from, gasPrice: this.gasPriceGwei};
                    } else {
                        buyParams = {from: from, gasPrice: this.gasPriceGwei, gas: this.gas};
                    }

                    let etsActionData = this.etsData;

                    let buyResult = await contracts[this.etsData.exchangeContract].methods.redeem(sum).send(buyParams).on('transactionHash', function (hash) {
                        let tx = {
                            hash: hash,
                            text: 'Redeem ETS ' + etsActionData.nameUp,
                            product: 'ets_' + etsActionData.name,
                            productName: 'ETS ' + etsActionData.nameUp,
                            action: 'redeem',
                            amount: sumInUsd,
                        };

                        self.putTransaction(tx);
                        self.showSuccessModal({
                            successTxHash: hash,
                            successAction: 'redeemEts',
                            etsData: etsActionData
                        });
                        self.loadTransaction();
                    });

                    if (this.isOvercapAvailable) {
                        await this.returnOvercap({
                            overcapLeft: this.overcapRemaining(),
                            overcapVolume: this.sum
                        });
                    }
                } catch (e) {
                    console.log(e);
                    return;
                }

                self.refreshMarket();
                self.setSum(null);
            } catch (e) {
                console.log(e);
            }
        },

        async confirmSwapAction() {
            try {
                let sum;

                switch (this.etsData.etsTokenDecimals) {
                    case 6:
                        sum = this.web3.utils.toWei(this.sum, 'mwei');
                        break;
                    case 8:
                        sum = this.web3.utils.toWei(this.sum, 'mwei') * 100;
                        break;
                    case 18:
                        sum = this.web3.utils.toWei(this.sum, 'ether');
                        break;
                    default:
                        break;
                }

                let estimatedGasValue = await this.estimateGas(sum);
                if (estimatedGasValue === -1 || estimatedGasValue === undefined) {
                    this.gas = null;
                    this.gasAmountInMatic = null;
                    this.gasAmountInUsd = null;

                    await this.redeemAction();

                    this.closeWaitingModal();
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

                let sum;

                switch (this.etsData.etsTokenDecimals) {
                    case 6:
                        sum = this.web3.utils.toWei(approveSum, 'mwei');
                        break;
                    case 8:
                        sum = this.web3.utils.toWei(approveSum, 'mwei') * 100;
                        break;
                    case 18:
                        sum = this.web3.utils.toWei(approveSum, 'ether');
                        break;
                    default:
                        break;
                }

                let allowApprove = await this.checkAllowance(sum);
                if (!allowApprove) {
                    this.closeWaitingModal();
                    this.showErrorModal('approve');
                    return;
                } else {
                    this.approveEtsToken();
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

            let allowanceValue = await contracts[this.etsData.tokenContract].methods.allowance(from, contracts[this.etsData.exchangeContract].options.address).call();

            if (allowanceValue < sum) {
                try {
                    await this.refreshGasPrice();
                    let approveParams = {gasPrice: this.gasPriceGwei, from: from};

                    let tx = await contracts[this.etsData.tokenContract].methods.approve(contracts[this.etsData.exchangeContract].options.address, sum).send(approveParams);

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
                let blockNum = await this.web3.eth.getBlockNumber();
                let errorApi = this.polygonApi;

                await contracts[this.etsData.exchangeContract].methods.redeem(sum).estimateGas(estimateOptions)
                    .then(function (gasAmount) {
                        result = gasAmount;
                    })
                    .catch(function (error) {
                        if (error && error.message) {
                            let msg = error.message.replace(/(?:\r\n|\r|\n)/g, '');

                            let errorMsg = {
                                product: 'ETS',
                                data: {
                                    from: from,
                                    to: contracts[this.etsData.exchangeContract].options.address,
                                    gas: null,
                                    gasPrice: parseInt(estimateOptions.gasPrice, 16),
                                    method: contracts[this.etsData.exchangeContract].methods.redeem(sum).encodeABI(),
                                    message: msg,
                                    block: blockNum
                                }
                            };

                            axios.post(errorApi + '/error/log', errorMsg);

                            console.log(errorMsg);
                        } else {
                            console.log(error);
                        }

                        return -1;
                    });
            } catch (e) {
                console.log(e);
                return -1;
            }

            return result;
        },

        overcapRemaining() {

            let overcapValue = localStorage.getItem('overcapRemainingValue');

            if (overcapValue == null || overcapValue === '-1') {
                if (this.isOvercapAvailable && this.walletOvercapLimit) {
                    localStorage.setItem('overcapRemainingValue', this.walletOvercapLimit.toString());
                } else {
                    localStorage.setItem('overcapRemainingValue', '-1');
                }

                overcapValue = localStorage.getItem('overcapRemainingValue');
            }

            try {
                return parseFloat(overcapValue);
            } catch (e) {
                return null;
            }
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
    border: 1px solid var(--main-border);
    border-radius: 8px;
}

.v-text-field >>> input::placeholder {
    color: var(--input-placeholder) !important;
}

.v-text-field >>> input, .v-text-field >>> label, .v-text-field >>> button {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;

    color: var(--links-blue) !important;
}

.balance-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.max {
    color: var(--links-blue);
    cursor: pointer;
}

.enabled-buy {
    background: var(--blue-gradient) !important;
    color: #FFFFFF !important;
}

.disabled-buy {
    background: var(--main-banner-background) !important;
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
    background: var(--card-coin-background);
    border-radius: 4px;
}

.coin-title {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
}

.modal-link-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--links-blue);
    cursor: pointer;
}

.action-info-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.action-info-sub-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.action-btn-container {
    width: 100% !important;
    background: var(--action-btn-bg);
}

.balance-network-icon {
    width: 16px !important;
    height: 16px !important;
}
</style>

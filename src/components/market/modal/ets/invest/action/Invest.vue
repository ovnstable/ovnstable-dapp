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
            <div class="swap-view-btn" @click="showRedeemView">
                <v-img :src="require('@/assets/icon/arrowsSwap.svg')"/>
            </div>
            <v-spacer></v-spacer>
        </v-row>

        <v-row class="mt-8 mx-n3 main-card">
            <v-col :cols="$wu.isMobile() ? 9 : 6">
                <v-row align="center" class="ma-0">
                    <label class="balance-label ml-3">Balance: {{
                            $utils.formatMoney(etsBalance[etsData.name], 3)
                        }}</label>
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
            <label class="exchange-label">1 {{ etsData.actionTokenName }} = 1 ETS {{ etsData.nameToken }}</label>
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
                    <Tooltip :size="16" text="Accelerating a transaction by using a higher gas price increases its chances of getting processed by the network faster, but it is not always guaranteed."/>
                </v-row>
            </v-col>
        </v-row>

        <v-row class="mt-5">
            <v-col cols="3">
                <v-row>
                    <label class="action-info-label">Mint fee:</label>
                </v-row>
            </v-col>
            <v-col>
                <v-row>
                    <label class="action-info-sub-label">
                        {{ resultMintFee ? '$' + $utils.formatMoneyComma(resultMintFee, 2) : '—'  }}
                    </label>
                    <v-spacer></v-spacer>
                    <label class="action-info-label">You mint:</label>
                    <label class="action-info-sub-label ml-2">
                        {{ '$' + ((sum - resultMintFee) ? $utils.formatMoneyComma(((sum - resultMintFee > 0 ) ? (sum - resultMintFee) : 0), 2) : '0') }}
                    </label>
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
                <v-btn v-if="actionAssetApproved"
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
    name: "Invest",

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

        minMintFee: null,
        contractCapacity: null,
    }),

    computed: {
        ...mapGetters('accountData', ['balance', 'etsBalance', 'actionAssetBalance', 'account']),
        ...mapGetters('transaction', ['transactions']),
        ...mapGetters('investModal', ['etsData', 'actionAssetApproved']),
        ...mapGetters('marketData', ['etsStrategyData']),
        ...mapGetters('supplyData', ['totalSupply']),
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

        stepLabels: function () {
            return ['', 'Approve ' + this.etsData.actionTokenName, 'Confirmation'];
        },

        currency: function () {
            return {
                id: this.etsData.actionAsset,
                title: this.etsData.actionTokenName,
                image: '@/assets/currencies/' + this.etsData.actionTokenName + '.png'
            }
        },

        buyCurrency: function () {
            return {
                id: this.etsData.name,
                title: 'ETS ' + this.etsData.nameToken,
                image: '@/assets/currencies/market/ets_' + this.etsData.name + '.svg'
            }
        },

        maxResult: function () {
            return this.$utils.formatMoney(this.actionAssetBalance[this.etsData.actionAsset + '_' + this.etsData.actionTokenDecimals], 3);
        },

        sumResult: function () {
            this.sliderPercent = parseFloat(this.sum) / parseFloat(this.actionAssetBalance[this.etsData.actionAsset + '_' + this.etsData.actionTokenDecimals]) * 100;

            if (!this.sum || this.sum === 0)
                return '0.00';
            else {
                return this.$utils.formatMoney(this.sum.replace(/,/g, '.'), 2);
            }
        },

        entryFee: function () {
            if (this.etsStrategyData[this.etsData.name] && this.etsStrategyData[this.etsData.name].fees) {
                let result = this.etsStrategyData[this.etsData.name].fees.find(x => x.id === 'buy');
                return result ? result.value : null;
            } else {
                return null;
            }
        },

        resultMintFee: function () {
            let entryFeeValue = this.sum * (this.entryFee ? (this.entryFee / 100.0) : 0);
            return this.minMintFee ? (entryFeeValue > this.minMintFee ? entryFeeValue : this.minMintFee) : entryFeeValue;
        },

        buttonLabel: function () {
            this.step = 0;

            if (!this.account) {
                return 'Connect to a wallet';
            } else if (!this.isOvercapAvailable && this.etsData.prototype) {
                return "ETS is in prototype"
            } else if (this.etsData.disabled) {
                return "Unavailable"
            } else if (this.transactionPending) {
                return 'Transaction is pending';
            } else if (parseFloat(this.sum) < this.resultMintFee) {
                return 'Sum is less than mint fee';
            } else if (this.contractCapacity > 0 && (parseFloat(this.totalSupply[this.etsData.name]) + parseFloat(this.sum) > this.contractCapacity)) {
                return 'Over ETS capacity';
            } else if (this.isBuy) {
                if (this.actionAssetApproved) {
                    this.step = 2;
                    return 'Confirm transaction'
                } else {
                    this.step = 1;
                    return 'Approve ' + this.etsData.actionTokenName;
                }
            } else {
                if (this.isOvercapAvailable) {

                    if (this.account && this.sum > 0 && this.numberRule) {
                        let noOvercapSum = parseFloat(this.etsData.maxSupply) - parseFloat(this.totalSupply[this.etsData.name]);
                        let useOvercapSum;

                        if (noOvercapSum <= 0) {
                            useOvercapSum = this.sum;
                        } else {
                            useOvercapSum = Math.max(this.sum - noOvercapSum, 0);
                        }

                        if (useOvercapSum <= this.overcapRemaining()) {
                            return 'Invest';
                        }
                    } else {
                        return 'Invest';
                    }
                }

                if ((this.etsData.maxSupply && this.totalSupply[this.etsData.name] >= this.etsData.maxSupply) || (this.etsData.maxSupply && (parseFloat(this.totalSupply[this.etsData.name]) + parseFloat(this.sum)) >= parseFloat(this.etsData.maxSupply))) {
                    return 'Over ETS capacity'
                } else if (this.sum > parseFloat(this.actionAssetBalance[this.etsData.actionAsset + '_' + this.etsData.actionTokenDecimals])) {
                    return 'Invest'
                } else {
                    return 'Invest';
                }
            }
        },

        isBuy: function () {
            if (this.isOvercapAvailable && this.etsData.overcapEnabled) {
                if (this.contractCapacity > 0 && (parseFloat(this.totalSupply[this.etsData.name]) + parseFloat(this.sum) > this.contractCapacity)) {
                    return false;
                }

                if (!this.etsData.disabled && this.account && this.sum > 0 && (parseFloat(this.sum) >= this.resultMintFee) && this.numberRule && !this.transactionPending) {
                    let noOvercapSum = parseFloat(this.etsData.maxSupply) - parseFloat(this.totalSupply[this.etsData.name]);
                    let useOvercapSum;

                    if (noOvercapSum <= 0) {
                        useOvercapSum = this.sum;
                    } else {
                        useOvercapSum = Math.max(this.sum - noOvercapSum, 0);
                    }

                    return useOvercapSum <= this.overcapRemaining();
                } else {
                    return false;
                }
            } else {
                return !this.etsData.disabled
                    && this.account
                    && !this.etsData.prototype
                    && this.sum > 0
                    && (parseFloat(this.sum) >= this.resultMintFee)
                    && !(this.contractCapacity > 0 && (parseFloat(this.totalSupply[this.etsData.name]) + parseFloat(this.sum) > this.contractCapacity))
                    && this.numberRule
                    && !this.transactionPending
                    && (!this.etsData.maxSupply || (this.totalSupply[this.etsData.name] < this.etsData.maxSupply))
                    && (!this.etsData.maxSupply || ((parseFloat(this.sum) + parseFloat(this.totalSupply[this.etsData.name])) < parseFloat(this.etsData.maxSupply)));
            }
        },

        transactionPending: function () {
            return this.transactions.filter(value => (value.pending && (value.chain === this.networkId) && (value.product === ('ets_' + this.etsData.name)) && (value.action === 'mint'))).length > 0;
        },

        numberRule: function () {

            let v = this.sum;

            if (!v)
                return false;

            if (!v.trim()) return false;

            v = parseFloat(v.trim().replace(/\s/g, ''));

            if (!isNaN(parseFloat(v)) && v >= 0 && v <= parseFloat(this.actionAssetBalance[this.etsData.actionAsset + '_' + this.etsData.actionTokenDecimals])) return true;

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

        this.getEntryMinFee();
        this.getContractCapacityValue();
    },

    methods: {

        ...mapActions("marketData", ['refreshMarket']),
        ...mapActions("investModal", ['showRedeemView', 'approveActionAsset']),

        ...mapActions("gasPrice", ['refreshGasPrice']),
        ...mapActions("walletAction", ['connectWallet']),
        ...mapActions("referral", ['getReferralCode']),

        ...mapActions("errorModal", ['showErrorModal']),
        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions("successModal", ['showSuccessModal']),

        ...mapActions("overcapData", ['useOvercap']),

        ...mapActions("transaction", ['putTransaction', 'loadTransaction']),

        changeSliderPercent() {
            this.sum = (this.actionAssetBalance[this.etsData.actionAsset + '_' + this.etsData.actionTokenDecimals] * (this.sliderPercent / 100.0)).toFixed(this.sliderPercent === 0 ? 0 : 6) + '';
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
            let balanceElement = this.balance[this.currency.id];
            this.sum = balanceElement + "";
        },

        async buyAction() {
            try {
                let sumInUsd = this.sum;
                let sum;

                switch (this.etsData.actionTokenDecimals) {
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

                    let referral = await this.getReferralCode();
                    let etsActionData = this.etsData;

                    let buyResult = await contracts[this.etsData.exchangeContract].methods.buy(sum, referral).send(buyParams).on('transactionHash', function (hash) {
                        let tx = {
                            hash: hash,
                            text: 'Mint ETS ' + etsActionData.nameUp,
                            product: 'ets_' + etsActionData.name,
                            productName: 'ETS ' + etsActionData.nameToken,
                            action: 'mint',
                            amount: sumInUsd,
                        };

                        self.putTransaction(tx);
                        self.showSuccessModal({
                            successTxHash: hash,
                            successAction: 'mintEts',
                            etsData: etsActionData
                        });
                        self.loadTransaction();
                    });

                    if (this.isOvercapAvailable) {
                        let noOvercapSum = parseFloat(this.etsData.maxSupply) - parseFloat(this.totalSupply[this.etsData.name]);
                        let useOvercapSum;

                        if (noOvercapSum <= 0) {
                            useOvercapSum = this.sum;
                        } else {
                            useOvercapSum = Math.max(this.sum - noOvercapSum, 0);
                        }

                        await this.useOvercap({
                            overcapLeft: this.overcapRemaining(),
                            overcapVolume: useOvercapSum
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

                switch (this.etsData.actionTokenDecimals) {
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

                    await this.buyAction();

                    this.closeWaitingModal();
                } else {
                    this.estimatedGas = estimatedGasValue;

                    /* adding 10% to estimated gas */
                    this.gas = new BN(Number.parseFloat(this.estimatedGas) * 1.1);
                    this.gasAmountInMatic = this.web3.utils.fromWei(this.gas.muln(Number.parseFloat(this.gasPrice)), "gwei");
                    this.gasAmountInUsd = this.web3.utils.fromWei(this.gas.muln(Number.parseFloat(this.gasPrice) * Number.parseFloat(this.gasPriceStation.usdPrice)), "gwei");

                    await this.buyAction();

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

                switch (this.etsData.actionTokenDecimals) {
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
                    this.approveActionAsset();
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

            let allowanceValue = await contracts[this.etsData.actionAsset].methods.allowance(from, contracts[this.etsData.exchangeContract].options.address).call();

            if (allowanceValue < sum) {
                try {
                    await this.refreshGasPrice();
                    let approveParams = {gasPrice: this.gasPriceGwei, from: from};

                    let tx = await contracts[this.etsData.actionAsset].methods.approve(contracts[this.etsData.exchangeContract].options.address, sum).send(approveParams);

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

                let referral = await this.getReferralCode();
                debugger
                await contracts[this.etsData.exchangeContract].methods.buy(sum, referral).estimateGas(estimateOptions)
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
                                    method: contracts[this.etsData.exchangeContract].methods.buy(sum, referral).encodeABI(),
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

        async getEntryMinFee() {
            let result = 0;

            try {
                result = await this.contracts[this.etsData.exchangeContract].methods.buyMinFee().call();
                result = this.web3.utils.fromWei(result, this.etsData.etsTokenDecimals === 18 ? 'ether' : 'mwei');

                this.minMintFee = result;
            } catch (e) {
                this.minMintFee = 0;
            }
        },

        async getContractCapacityValue() {
            let result = 0;

            try {
                result = await this.contracts[this.etsData.exchangeContract].methods.capacity().call();
                result = this.web3.utils.fromWei(result, this.etsData.etsTokenDecimals === 18 ? 'ether' : 'mwei');

                this.contractCapacity = result;
            } catch (e) {
                this.contractCapacity = 0;
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

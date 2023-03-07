<template>
    <v-col>
        <v-row class="mx-n3 main-card">
            <v-col>
                <v-row align="center" class="ma-0">
                    <label class="balance-label ml-3">BalanceRedeem: {{ maxResult }}</label>
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
                                  v-model="sum"
                                  @input="checkApproveCounter">
                    </v-text-field>
                </v-row>
            </v-col>

            <v-col>
                <v-row align="center" class="ma-0 fill-height">
                    <v-spacer></v-spacer>
                    <div class="coin-card mr-3">
                        <v-row class="ma-2" align="center">
                            <div class="coin-img mr-2">
                                <v-img :src="currency.image"/>
                            </div>
                            <label class="coin-title">{{ currency.title }}</label>
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
            <v-col>
                <v-row align="center" class="ma-0">
                    <label class="balance-label ml-3">Balance: {{ $utils.formatMoney(balance.asset, 3) }}</label>
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
                            <div class="coin-img mr-2">
                                <v-img :src="buyCurrency.image"/>
                            </div>
                            <label class="coin-title">{{ buyCurrency.title }}</label>
                        </v-row>
                    </div>
                </v-row>
            </v-col>
        </v-row>

        <!-- TODO: add wrap checkbox -->

        <v-row class="mt-5">
            <v-spacer></v-spacer>
            <label class="exchange-label">1 USD+ = 1 {{ assetName }}</label>
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
                    <label class="action-info-label">Overnight fee:</label>
                </v-row>
            </v-col>
            <v-col>
                <v-row>
                    <label class="action-info-sub-label">{{ overnightFee ? $utils.formatMoneyComma(overnightFee, 2) + '%' : '—' }}</label>
                    <v-spacer></v-spacer>
                    <label class="action-info-label">You redeem:</label>
                    <label class="action-info-sub-label ml-2">{{ '$' + (estimateResult ? $utils.formatMoneyComma(estimateResult, 2) : '0') }}</label>
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
                <v-btn v-if="usdPlusApproved"
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
import optimismIcon from "@/assets/network/op.svg";
import arbitrumIcon from "@/assets/network/ar.svg";
import bscIcon from "@/assets/network/bsc.svg";
import {axios} from "@/plugins/http-axios";
import Tooltip from "@/components/common/element/Tooltip";
import GasSettingsMenu from "@/components/common/modal/gas/components/GasSettingsMenu";

export default {
    name: "Redeem",

    components: {
        GasSettingsMenu,
        Tooltip,
        ErrorModal,
        WaitingModal,
        SuccessModal,
    },

    data: () => ({
        currency: null,
        currencies: [
            {
                id: 'usdPlus',
                title: 'USD+',
                image: require('@/assets/currencies/usdPlus.svg')
            }
        ],

        buyCurrency: {id: 'asset'},
        buyCurrencies: [],

        sum: null,

        estimatedGas: null,
        gas: null,
        gasAmountInMatic: null,
        gasAmountInUsd: null,

        sliderPercent: 0,
        stepLabels: ['', 'Approve', 'Confirmation'],
        step: 0,

        sumApproveCheckerId: null,
        sumApproveCheckerSec: 0
    }),

    computed: {
        ...mapGetters('accountData', ['balance', 'originalBalance', 'account']),
        ...mapGetters('transaction', ['transactions']),

        ...mapGetters('swapDaiModal', ['daiPlusApproved']),

        ...mapGetters("network", ['networkId', 'assetName', 'polygonApi']),
        ...mapGetters("web3", ["web3", 'contracts']),
        ...mapGetters("gasPrice", ["gasPriceGwei", "gasPrice", "gasPriceStation"]),

        icon: function () {
            switch (this.networkId){
                case 137:
                    return polygonIcon;
                case 10:
                    return optimismIcon;
                case 56:
                    return bscIcon;
                case 42161:
                    return arbitrumIcon;
            }
        },

        maxResult: function () {
            return this.$utils.formatMoney(this.balance.usdPlus, 3);
        },

        sumResult: function () {
            this.sliderPercent = parseFloat(this.sum) / parseFloat(this.balance.usdPlus) * 100;

            if (!this.sum || this.sum === 0)
                return '0.00';
            else {
                return this.$utils.formatMoney(this.sum.replace(/,/g, '.'), 2);
            }
        },

        overnightFee: function () {
            return 0.04;
        },

        estimateResult: function () {
            return this.sum * (1 - (this.overnightFee ? (this.overnightFee / 100.0) : 0.0004));
        },

        buttonLabel: function () {
            this.step = 0;

            if (!this.account) {
                return 'Connect wallet';
            } else if (this.transactionPending) {
                return 'Transaction is pending';
            } else if (this.isBuy) {
                if (this.daiPlusApproved) {
                    this.step = 2;
                    return 'Confirm transaction'
                } else {
                    this.step = 1;
                    return 'Approve USD+';
                }
            } else if (this.sum > parseFloat(this.balance.usdPlus)) {
                return 'Redeem'
            } else {
                return 'Redeem';
            }
        },

        isBuy: function () {
            return this.account && this.sum > 0 && this.numberRule && !this.transactionPending;
        },

        transactionPending: function () {
            return this.transactions.filter(value => (value.pending && (value.chain === this.networkId) && (value.product === 'usdPlus') && (value.action === 'redeem'))).length > 0;
        },

        numberRule: function () {

            let v = this.sum;

            if (!v)
                return false;

            if (!v.trim()) return false;

            v = parseFloat(v.trim().replace(/\s/g, ''));

            if (!isNaN(parseFloat(v)) && v >= 0 && v <= parseFloat(this.balance.usdPlus)) return true;

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
        this.buyCurrencies.push({
            id: 'asset',
            title: this.assetName,
            image: require('@/assets/currencies/stablecoins/' + this.assetName + '.png')
        });

        this.buyCurrency = this.buyCurrencies[0];
        this.currency = this.currencies[0];

        this.estimatedGas = null;

        this.gas = null;
        this.gasAmountInMatic = null;
        this.gasAmountInUsd = null;
    },

    methods: {

        ...mapActions("swapData", ['refreshSwap']),
        ...mapActions("swapModal", ['showMintView', 'approveUsdPlus', 'disapproveUsdPlus']),

        ...mapActions("gasPrice", ['refreshGasPrice']),
        ...mapActions("walletAction", ['connectWallet']),

        ...mapActions("errorModal", ['showErrorModal']),
        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions("successModal", ['showSuccessModal']),
        ...mapActions('track', ['trackClick']),

        ...mapActions("transaction", ['putTransaction', 'loadTransaction']),

        async changeSliderPercent() {
            this.sum = (this.balance.usdPlus * (this.sliderPercent / 100.0)).toFixed(this.sliderPercent === 0 ? 0 : 6) + '';
            this.sum = isNaN(this.sum) ? 0 : this.sum
            await this.checkApprove();
        },

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
        async checkApproveCounter() {
          if (!this.sumApproveCheckerId) {
            // first call
            this.sumApproveCheckerId = -1;
            await this.checkApprove();
            return;
          }

          this.sumApproveCheckerSec = 0;
          let intervalId = setInterval(async () => {
            this.sumApproveCheckerSec++;

            if (this.sumApproveCheckerSec >= 2) {
              if (this.sumApproveCheckerId === intervalId) {
                this.sumApproveCheckerSec = 0;
                try {
                  await this.checkApprove();
                } catch (e) {
                  // ignore
                } finally {
                  clearInterval(intervalId)
                }
              } else {
                clearInterval(intervalId)
              }

            }
          }, 1000);

          this.sumApproveCheckerId = intervalId;
        },
        async checkApprove() {
          console.log("Check Approve action", this.sum);

          try {
            if (!this.sum || isNaN(this.sum) || !this.account) {
              return;
            }

            let sum = this.web3.utils.toWei(this.sum, 'mwei');

            let allowApprove = await this.checkAllowance(sum);
            console.log("allowApprove : ", allowApprove, sum)
            if (!allowApprove) {
              this.disapproveUsdPlus();
              return false;
            } else {
              this.approveUsdPlus();
              return true;
            }
          } catch (e) {
            console.error(`Market Withdraw approve action error: ${e}. Sum: ${this.sum}. Account: ${this.account}. `);
            this.showErrorModal('approve');
            this.disapproveUsdPlus();
            return false;
          }
        },
        getMax() {
          let balanceElement = this.originalBalance[this.currency.id];
          return balanceElement ? balanceElement + '' : null;
        },

        async redeemAction() {
            try {

              let sumInUsd = this.sum;
              let sum;

              if (this.sliderPercent === 100) {
                let originalMax = this.getMax();
                sum = originalMax;
                if (!originalMax) {
                  console.error("Original max value not exist, when confirm swap action in market invest.")
                  return;
                }
              } else {
                sum = this.web3.utils.toWei(this.sum, 'mwei');
              }

              if (!(await this.checkApprove())) {
                console.debug(`Redeem swap. Buy action Approve not pass. Sum: ${sum} usdSum: ${this.sum}. Account: ${this.account}.`);
                return;
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

                  console.debug(`Swap blockchain. Redeem action Sum: ${sum} usdSum: ${this.sum}. Account: ${this.account}. SlidersPercent: ${this.sliderPercent}`);
                  let buyResult = await contracts.exchange.methods.redeem(contracts.asset.options.address, sum).send(buyParams).on('transactionHash', function (hash) {
                      let tx = {
                          hash: hash,
                          text: 'Redeem USD+',
                          product: 'usdPlus',
                          productName: 'USD+',
                          action: 'redeem',
                          amount: sumInUsd,
                      };

                      self.putTransaction(tx);
                      self.showSuccessModal({successTxHash: hash, successAction: 'redeemUsdPlus'});
                      self.loadTransaction();
                  });
              } catch (e) {
                console.error(`Swap Redeem blockchain redeem action error: ${e}. Sum: ${this.sum}. Account: ${this.account}. `);
                return;
              }

              self.refreshSwap();
              self.setSum(null);
            } catch (e) {
              console.error(`Swap Redeem redeem action error: ${e}. Sum: ${this.sum}. Account: ${this.account}. `);
            }
        },

        async confirmSwapAction() {
            try {
                let sum;

                if (this.sliderPercent === 100) {
                  let originalMax = this.getMax();
                  sum = originalMax;
                  if (!originalMax) {
                    console.error("Original max value not exist, when confirm swap action in market invest.")
                    return;
                  }
                } else {
                  sum = this.web3.utils.toWei(this.sum, 'mwei');
                }

                let estimatedGasValue = await this.estimateGas(sum);
                if (estimatedGasValue === -1 || estimatedGasValue === undefined) {
                    this.gas = null;
                    this.gasAmountInMatic = null;
                    this.gasAmountInUsd = null;

                    this.trackClick({action: 'confirm-redeem-click', event_category: 'Redeem confirm', event_label: 'Confirm Redeem Action', value: 1 });
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
                console.error(`Swap Redeem swap action error: ${e}. Sum: ${this.sum}. Account: ${this.account}. `);
                this.showErrorModal('estimateGas');
            }
        },

        async approveAction() {
            try {
                this.showWaitingModal('Approving in process');
                this.trackClick({action: 'approve-redeem-click', event_category: 'Redeem approve', event_label: 'Approve Redeem Action', value: 1 });


                let approveSum = "10000000";
                let sum = this.web3.utils.toWei(approveSum, 'mwei');
                console.debug(`Swap Mint blockchain. Approve action. Sum: ${sum} usdSum: ${this.sum}. Account: ${this.account}.`);

              let allowApprove = await this.checkAllowance(sum);
              allowApprove = !allowApprove ? (await this.approveBlockchainAction(sum)) : true;
              if (!allowApprove) {
                    this.closeWaitingModal();
                    this.showErrorModal('approve');
                    this.disapproveUsdPlus();
                } else {
                    this.approveUsdPlus();
                    this.closeWaitingModal();
                }
            } catch (e) {
                console.error(`Swap Redeem approve action error: ${e}. Sum: ${this.sum}. Account: ${this.account}. `);
                this.showErrorModal('approve');
                this.trackClick({action: 'redeem-error-click', event_category: 'Redeem error', event_label: 'Error Redeem Showed', value: 1 });
            }
        },
        async approveBlockchainAction(sum) {
          try {
            await this.refreshGasPrice();
            let contracts = this.contracts;
            let from = this.account;

            let approveParams = {gasPrice: this.gasPriceGwei, from: from};

            let tx = await contracts.usdPlus.methods.approve(contracts.exchange.options.address, sum).send(approveParams);
            console.debug(`Swap Mint blockchain. Allowance Sum: ${sum} usdSum: ${this.sum}. Account: ${this.account}.`);

            let minted = true;
            while (minted) {
              await new Promise(resolve => setTimeout(resolve, 2000));
              let receipt = await this.web3.eth.getTransactionReceipt(tx.transactionHash);
              this.trackClick({action: 'redeem-tx-show-click', event_category: 'Redeem tx scan', event_label: 'Redeem Go to Scan', value: 1 });

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
            console.error(`Swap Redeem allow action error: ${e}. Sum: ${this.sum}. Account: ${this.account}. `);
            return false;
          }
        },
        async checkAllowance(sum) {
          let contracts = this.contracts;
          let from = this.account;

          let allowanceValue = await contracts.usdPlus.methods.allowance(from, contracts.exchange.options.address).call()
          console.debug(`Swap Mint blockchain. Allowance value: ${allowanceValue}. Account: ${this.account}.`);
          console.log('allowanceValue: ', allowanceValue, sum, allowanceValue * 1 >= sum * 1)
          return allowanceValue * 1 >= sum * 1;
        },

        async estimateGas(sum) {

            let contracts = this.contracts;
            let from = this.account;

            let result;

            try {
                let estimateOptions = {from: from, "gasPrice": this.gasPriceGwei};
                let blockNum = await this.web3.eth.getBlockNumber();
                let errorApi = this.polygonApi;

                console.debug(`Swap Mint blockchain. Estimate gas action Sum: ${sum} usdSum: ${this.sum}. Account: ${this.account}.`);
                await contracts.exchange.methods.redeem(contracts.asset.options.address, sum).estimateGas(estimateOptions)
                    .then(function (gasAmount) {
                        result = gasAmount;
                    })
                    .catch(function (error) {
                        if (error && error.message) {
                            let msg = error.message.replace(/(?:\r\n|\r|\n)/g, '');

                            let errorMsg = {
                                product: 'USD+',
                                data: {
                                    from: from,
                                    to: contracts.exchange.options.address,
                                    gas: null,
                                    gasPrice: parseInt(estimateOptions.gasPrice, 16),
                                    method: contracts.exchange.methods.redeem(contracts.asset.options.address, sum).encodeABI(),
                                    message: msg,
                                    block: blockNum
                                }
                            };

                            axios.post(errorApi + '/error/log', errorMsg);

                            console.log(errorMsg);
                        } else {
                          console.error(`Swap Redeem blockchain estimate action error: ${error}. Sum: ${this.sum}. Account: ${this.account}. `);
                        }

                        return -1;
                    });
            } catch (e) {
                console.error(`Swap Redeem estimate action error: ${e}. Sum: ${this.sum}. Account: ${this.account}. `);
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

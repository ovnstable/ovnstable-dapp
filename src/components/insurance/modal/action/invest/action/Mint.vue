<template>
  <v-col>
    <v-row class="mx-n3 main-card">
      <v-col cols="7">
        <v-row align="center" class="ma-0">
          <label class="balance-label ml-3">Balance: {{ maxResult }}</label>
          <div class="balance-network-icon ml-2">
            <v-img :src="icon" />
          </div>
        </v-row>

        <!-- OVN INS -->

        <v-row class="ma-0 mt-1" align="center">
          <v-text-field
            placeholder="0"
            @keypress="isNumber($event)"
            flat
            solo
            class="field-sum"
            hide-details
            background-color="transparent"
            v-model="sum"
            @input="checkApproveCounter"
          >
          </v-text-field>
        </v-row>
      </v-col>

      <v-col>
        <v-row align="center" class="ma-0 fill-height">
          <v-spacer></v-spacer>
          <div class="coin-card mr-3">
            <v-row class="ma-2" align="center">
              <div class="coin-img mr-2">
                <v-img :src="currency.image" />
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
      <div class="swap-view-btn" @click="showRedeemView">
        <v-img :src="require('@/assets/icon/arrowsSwap.svg')" />
      </div>
      <v-spacer></v-spacer>
    </v-row>

    <v-row class="mt-8 mx-n3 main-card">
      <v-col cols="7">
        <v-row align="center" class="ma-0">
          <label class="balance-label ml-3"
            >Balance:
            {{
              $utils.formatMoney(insuranceBalance[this.networkName], 3)
            }}</label
          >
          <div class="balance-network-icon ml-2">
            <v-img :src="icon" />
          </div>
        </v-row>

        <v-row class="ma-0 mt-1" align="center">
          <v-text-field
            placeholder="0"
            flat
            readonly
            solo
            class="field-sum"
            hide-details
            background-color="transparent"
            v-model="sumResult"
          >
          </v-text-field>
        </v-row>
      </v-col>

      <v-col>
        <v-row align="center" class="ma-0 fill-height">
          <v-spacer></v-spacer>
          <div class="coin-card mr-3">
            <v-row class="ma-2" align="center">
              <div class="coin-img mr-2">
                <v-img
                  :src="
                    require(`@/assets/currencies/insurance/round_insurance_${this.networkName}.svg`)
                  "
                />
              </div>
              <label class="coin-title">{{ buyCurrency.title }}</label>
            </v-row>
          </div>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="mt-5">
      <v-spacer></v-spacer>
      <label class="exchange-label">1 {{ assetName }} = 1 INS</label>
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
          <Tooltip
            :size="16"
            text="Accelerating a transaction by using a higher gas price increases its chances of getting processed by the network faster, but it is not always guaranteed."
          />
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
          <label class="action-info-sub-label">{{
            overnightFee ? $utils.formatMoneyComma(overnightFee, 2) + "%" : "—"
          }}</label>
          <v-spacer></v-spacer>
          <label class="action-info-label">You mint:</label>
          <label class="action-info-sub-label ml-2">{{
            "$" +
              (estimateResult
                ? $utils.formatMoneyComma(estimateResult * ovnPrice, 2)
                : "0")
          }}</label>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="mt-15" align="center" justify="center">
      <v-row v-if="isShowDecreaseAllowance" class="mb-2">
        <v-col>
          <label
            @click="clearApprove('insurance-invest')"
            style="cursor: pointer;"
          >
            Decrease Allowance
          </label>
        </v-col>
      </v-row>

      <div class="action-btn-container" v-if="!this.account">
        <v-btn class="buy enabled-buy" @click="connectWallet">
          {{ buttonLabel }}
        </v-btn>
      </div>
      <div
        class="action-btn-container"
        v-else-if="![10, 42161].includes(this.networkId)"
      >
        <v-btn
          class="header-btn btn-investor-invest"
          @click="setWalletNetwork(10)"
        >
          {{ buttonLabel }}
        </v-btn>
      </div>

      <div class="action-btn-container" v-else>
        <v-btn
          v-if="actionAssetApproved"
          height="56"
          class="buy"
          :class="isBuy ? 'enabled-buy' : 'disabled-buy'"
          :disabled="!isBuy"
          @click="confirmSwapAction"
        >
          <v-progress-circular
            v-if="transactionPending"
            class="mr-2"
            width="2"
            :size="18"
            indeterminate
          ></v-progress-circular>
          {{ buttonLabel }}
        </v-btn>
        <v-btn
          v-else
          height="56"
          class="buy"
          :class="isBuy ? 'enabled-buy' : 'disabled-buy'"
          :disabled="!isBuy"
          @click="approveAction"
        >
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

    <WaitingModal />
    <SuccessModal />
    <ErrorModal />

    <resize-observer @notify="$forceUpdate()" />
  </v-col>
</template>
<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<script>
import { mapActions, mapGetters } from "vuex";
import ErrorModal from "@/components/common/modal/action/ErrorModal";
import WaitingModal from "@/components/common/modal/action/WaitingModal";
import SuccessModal from "@/components/common/modal/action/SuccessModal";
import BigNumber from "bignumber.js";
import polygonIcon from "@/assets/network/polygon.svg";
import optimismIcon from "@/assets/network/op.svg";
import arbitrumIcon from "@/assets/network/ar.svg";
import baseIcon from "@/assets/network/base.svg";
import lineaIcon from "@/assets/network/linea.svg";
import zksyncIcon from "@/assets/network/zk.svg";
import bscIcon from "@/assets/network/bsc.svg";
import { axios } from "@/plugins/http-axios";
import GasSettingsMenu from "@/components/common/modal/gas/components/GasSettingsMenu";
import Tooltip from "@/components/common/element/Tooltip";
import { ovnApiService } from "@/services/ovn-api-service";

export default {
  name: "Mint",

  components: {
    Tooltip,
    GasSettingsMenu,
    ErrorModal,
    WaitingModal,
    SuccessModal
  },

  data: () => ({
    currency: { id: "asset" },
    currencies: [],

    ovnPrice: 0,

    buyCurrency: null,
    buyCurrencies: [
      {
        id: "insurance",
        title: "OVN INS",
        image: require("@/assets/currencies/insurance/round_insurance_optimism.svg")
      }
    ],

    ovnDecimals: 18,
    assetName: "OVN",

    sum: null,

    estimatedGas: null,
    gas: null,
    gasAmountInMatic: null,
    gasAmountInUsd: null,

    sliderPercent: 0,
    stepLabels: ["", "Approve", "Confirmation"],
    step: 0,

    sumApproveCheckerId: null,
    sumApproveCheckerSec: 0,
    isShowDecreaseAllowanceButton: true
  }),

  computed: {
    ...mapGetters("accountData", [
      "balance",
      "originalBalance",
      "account",
      "insuranceBalance"
    ]),
    ...mapGetters("transaction", ["transactions"]),

    ...mapGetters("insuranceInvestModal", ["actionAssetApproved"]),
    ...mapGetters("insuranceData", ["insuranceStrategyData"]),

    ...mapGetters("network", ["networkId", "networkName", "opApi"]),
    ...mapGetters("web3", ["web3", "contracts"]),
    ...mapGetters("gasPrice", ["gasPriceGwei", "gasPrice", "gasPriceStation"]),

    isShowDecreaseAllowance() {
      return (
        this.isShowDecreaseAllowanceButton &&
        this.account === "0x4473D652fb0b40b36d549545e5fF6A363c9cd686"
      ); // test front dev address
    },

    icon: function() {
      switch (this.networkId) {
        case 137:
          return polygonIcon;
        case 10:
          return optimismIcon;
        case 56:
          return bscIcon;
        case 42161:
          return arbitrumIcon;
        case 8453:
          return baseIcon;
        case 59144:
          return lineaIcon;
        case 324:
          return zksyncIcon;
        default:
          return "";
      }
    },

    maxResult: function() {
      return this.$utils.formatMoney(this.balance.ovn, 3);
    },

    sumResult: function() {
      this.sliderPercent =
        (parseFloat(this.sum) / parseFloat(this.balance.ovn)) * 100;

      if (!this.sum || this.sum === 0) return "0.00";
      else {
        return this.$utils.formatMoney(this.sum.replace(/,/g, "."), 2);
      }
    },

    overnightFee: function() {
      return this.insuranceStrategyData.mintFee;
    },

    estimateResult: function() {
      return (
        this.sum * (1 - (this.overnightFee ? this.overnightFee / 100.0 : 0))
      );
    },

    buttonLabel: function() {
      this.step = 0;

      if (!this.account) {
        return "Connect wallet";
      } else if (![10, 42161].includes(this.networkId)) {
        return "Switch to optimism to mint";
      } else if (this.transactionPending) {
        return "Transaction is pending";
      } else if (this.isBuy) {
        if (this.actionAssetApproved) {
          this.step = 2;
          return "Confirm transaction";
        } else {
          this.step = 1;
          return "Approve " + this.assetName;
        }
      } else if (this.sum > parseFloat(this.balance.ovn)) {
        return "Mint";
      } else {
        return "Mint";
      }
    },

    isBuy: function() {
      return (
        this.account &&
        this.sum > 0 &&
        this.numberRule &&
        !this.transactionPending
      );
    },

    transactionPending: function() {
      return (
        this.transactions.filter(
          (value) =>
            value.pending &&
            value.chain === this.networkId &&
            value.product === "insurance" &&
            value.action === "mint"
        ).length > 0
      );
    },

    numberRule: function() {
      let v = this.sum;

      if (!v) return false;

      if (!v.trim()) return false;

      v = parseFloat(v.trim().replace(/\s/g, ""));

      if (
        !isNaN(parseFloat(v)) &&
        v >= 0 &&
        v <= parseFloat(this.balance.ovn).toFixed(6)
      )
        return true;

      return false;
    },

    percentLabels: function() {
      let labelList = [];

      for (let i = 0; i <= 100; i += 5) {
        if (i % 25 === 0) {
          labelList.push(i + "%");
        } else {
          labelList.push("");
        }
      }

      return labelList;
    }
  },

  created() {
    this.currencies.push({
      id: "ovn",
      title: "OVN",
      image: require("@/assets/currencies/stablecoins/OVN.png")
    });

    this.currency = this.currencies[0];
    this.buyCurrency = this.buyCurrencies[0];

    this.estimatedGas = null;

    this.gas = null;
    this.gasAmountInMatic = null;
    this.gasAmountInUsd = null;

    this.loadOvnPrice();
  },

  methods: {
    ...mapActions("network", ["setWalletNetwork"]),
    ...mapActions("insuranceData", ["refreshInsurance"]),
    ...mapActions("insuranceInvestModal", [
      "showRedeemView",
      "approveActionAsset",
      "disapproveActionAsset"
    ]),

    ...mapActions("gasPrice", ["refreshGasPrice"]),
    ...mapActions("walletAction", ["connectWallet"]),

    ...mapActions("errorModal", ["showErrorModal", "showErrorModalWithMsg"]),
    ...mapActions("waitingModal", ["showWaitingModal", "closeWaitingModal"]),
    ...mapActions("successModal", ["showSuccessModal"]),

    ...mapActions("transaction", ["putTransaction", "loadTransaction"]),

    loadOvnPrice() {
      let url = "https://api.overnight.fi/root/dapp";
      ovnApiService
        .getOvnPrice(url)
        .then((value) => {
          this.ovnPrice = value;
        })
        .catch((reason) => {
          console.log("Error get ovn price: " + reason);
        });
    },

    async changeSliderPercent() {
      this.sum =
        (this.balance.ovn * (this.sliderPercent / 100.0)).toFixed(
          this.sliderPercent === 0 ? 0 : 6
        ) + "";
      this.sum = isNaN(this.sum) ? 0 : this.sum;
      await this.checkApprove();
    },

    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      let charCode = evt.which ? evt.which : evt.keyCode;

      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        if (charCode === 46 && (!this.sum || this.sum.includes("."))) {
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
              clearInterval(intervalId);
            }
          } else {
            clearInterval(intervalId);
          }
        }
      }, 1000);

      this.sumApproveCheckerId = intervalId;
    },
    async checkApprove() {
      let sum;
      try {
        if (!this.sum || isNaN(this.sum) || !this.account) {
          return;
        }

        sum = this.web3.utils.toWei(
          this.sum,
          this.ovnDecimals === 18 ? "ether" : "mwei"
        );
        let allowApprove = await this.checkAllowance(sum);
        if (!allowApprove) {
          this.disapproveActionAsset();
          return false;
        } else {
          this.approveActionAsset();
          return true;
        }
      } catch (e) {
        console.error(
          `Market Withdraw approve action error: ${e}. usdSum: ${this.sum} sum:${sum} Account: ${this.account}. `
        );
        this.showErrorModalWithMsg({ errorType: "approve", errorMsg: e });
        this.disapproveActionAsset();
        return false;
      }
    },
    getMax() {
      let balanceElement = this.originalBalance[this.currency.id];
      return balanceElement ? balanceElement + "" : null;
    },

    async clearApprove(action) {
      try {
        let contracts = this.contracts;
        let from = this.account;

        let allowanceValue = await this.getAllowanceValue();
        if (allowanceValue === 0) {
          return;
        }

        let buyParams;

        await this.refreshGasPrice();
        if (this.gas == null) {
          buyParams = { from: from, gasPrice: this.gasPriceGwei };
        } else {
          buyParams = {
            from: from,
            gasPrice: this.gasPriceGwei,
            gas: this.gas
          };
        }

        await contracts.ovn.methods
          .decreaseAllowance(
            contracts.insurance[`${this.networkName}_exchanger`].options
              .address,
            allowanceValue
          )
          .send(buyParams)
          .on("transactionHash", (hash) => {
            this.isShowDecreaseAllowanceButton = false;
          });
      } catch (e) {
        this.showErrorModalWithMsg({ errorType: "clear_approve", errorMsg: e });
      }
    },

    async buyAction() {
      try {
        let sumInUsd = this.sum;
        let sum;

        if (this.sliderPercent === 100) {
          let originalMax = this.getMax();
          sum = originalMax;
          if (!originalMax) {
            let errorMessage = "Original max value not exist, when buy action.";
            console.error(errorMessage);
            this.showErrorModalWithMsg({
              errorType: "approve",
              errorMsg: { code: 1, message: errorMessage }
            });
            return;
          }
        } else {
          sum = this.web3.utils.toWei(
            this.sum,
            this.ovnDecimals === 18 ? "ether" : "mwei"
          );
        }

        console.log(sum, this.fromValue, "---sum");
        if (!(await this.checkApprove())) {
          console.debug(
            `Invest insurance. Buy action Approve not pass. Sum: ${sum} usdSum: ${this.sum}. Account: ${this.account}.`
          );
          return;
        }

        let contracts = this.contracts;
        let from = this.account;
        let self = this;

        try {
          await this.refreshGasPrice();

          let buyParams;

          if (this.gas == null) {
            buyParams = { from: from, gasPrice: this.gasPriceGwei };
          } else {
            buyParams = {
              from: from,
              gasPrice: this.gasPriceGwei,
              gas: this.gas
            };
          }

          let mintParams = {
            amount: sum
          };

          console.debug(
            `Insurance blockchain. Mit action Sum: ${sum} usdSum: ${this.sum}. Account: ${this.account}. SlidersPercent: ${this.sliderPercent}`
          );
          console.log(
            contracts.insurance[`${this.networkName}_exchanger`],
            "contract"
          );
          console.log(mintParams, "---mintParams");
          console.log(buyParams, "---buyParams");
          let buyResult = await contracts.insurance[
            `${this.networkName}_exchanger`
          ].methods
            .mint(mintParams)
            .send(buyParams)
            .on("transactionHash", function(hash) {
              let tx = {
                hash: hash,
                text: "Mint OVN INS",
                product: "insurance",
                productName: "OVN INS",
                action: "mint",
                amount: sumInUsd
              };

              self.putTransaction(tx);
              self.showSuccessModal({
                successTxHash: hash,
                successAction: "mintInsurance"
              });
              self.loadTransaction();
            });
        } catch (e) {
          console.error(
            `Mint Insurance error: ${e}. Sum: ${this.sum}. Account: ${this.account}. `
          );
          this.showErrorModalWithMsg({ errorType: "buy", errorMsg: e });
          return;
        }

        self.refreshInsurance();
        self.setSum(null);
      } catch (e) {
        console.error(
          `Mint Insurance by action error: ${e}. Sum: ${this.sum}. Account: ${this.account}. `
        );
        this.showErrorModalWithMsg({ errorType: "mint", errorMsg: e });
      }
    },

    async confirmSwapAction() {
      console.log("confirmSwapAction");
      try {
        let sum;

        if (this.sliderPercent === 100) {
          let originalMax = this.getMax();
          sum = originalMax;
          if (!originalMax) {
            let errorMessage =
              "Original max value not exist, when insurance mint.";
            console.error(errorMessage);
            this.showErrorModalWithMsg({
              errorType: "approve",
              errorMsg: { code: 1, message: errorMessage }
            });
            return;
          }
        } else {
          sum = this.web3.utils.toWei(
            this.sum,
            this.ovnDecimals === 18 ? "ether" : "mwei"
          );
        }

        let estimatedGasValue = await this.estimateGas(sum);
        if (estimatedGasValue === -1 || estimatedGasValue === undefined) {
          this.gas = null;
          this.gasAmountInMatic = null;
          this.gasAmountInUsd = null;

          await this.buyAction();
        } else {
          this.estimatedGas = estimatedGasValue;

          console.log(this.estimatedGas, "---this.estimatedGas");
          this.gas = new BigNumber(this.estimatedGas)
            .multipliedBy(1.1)
            .integerValue(BigNumber.ROUND_DOWN);
          let gasInWei = this.gas
            .multipliedBy(this.gasPrice)
            .integerValue(BigNumber.ROUND_DOWN);
          this.gasAmountInMatic = this.web3.utils.fromWei(
            gasInWei.toFixed(),
            "gwei"
          );
          let gasInWeiForUsd = this.gas
            .multipliedBy(this.gasPrice)
            .multipliedBy(this.gasPriceStation.usdPrice)
            .integerValue(BigNumber.ROUND_DOWN);
          this.gasAmountInUsd = this.web3.utils.fromWei(
            gasInWeiForUsd.toFixed(),
            "gwei"
          );

          await this.buyAction();
        }
      } catch (e) {
        console.error(
          `Mint Insurance Confirm swap error: ${e}. Sum: ${this.sum}. Account: ${this.account}. `
        );
        this.showErrorModalWithMsg({ errorType: "swap", errorMsg: e });
      }
    },

    async approveAction() {
      try {
        this.showWaitingModal("Approving in process");

        let approveSum = "10000000";
        let sum;

        if (this.ovnDecimals === 18) {
          sum = this.web3.utils.toWei(approveSum, "ether");
        } else {
          sum = this.web3.utils.toWei(approveSum, "mwei");
        }

        let allowApprove = await this.checkAllowance(sum);
        allowApprove = !allowApprove
          ? await this.approveBlockchainAction(sum)
          : true;
        if (!allowApprove) {
          this.closeWaitingModal();
          this.disapproveActionAsset();
        } else {
          this.approveActionAsset();
          this.closeWaitingModal();
        }
      } catch (e) {
        console.error(
          `Mint Insurance approve action error: ${e}. Sum: ${this.sum}. Account: ${this.account}. `
        );
        this.showErrorModalWithMsg({ errorType: "approve", errorMsg: e });
      }
    },
    async approveBlockchainAction(sum) {
      try {
        await this.refreshGasPrice();
        let contracts = this.contracts;
        let from = this.account;

        let approveParams = { gasPrice: this.gasPriceGwei, from: from };

        let tx = await contracts.ovn.methods
          .approve(
            contracts.insurance[`${this.networkName}_exchanger`].options
              .address,
            sum
          )
          .send(approveParams);

        let minted = true;
        while (minted) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          let receipt = await this.web3.eth.getTransactionReceipt(
            tx.transactionHash
          );

          if (receipt) {
            if (receipt.status) return true;
            else {
              return false;
            }
          }
        }

        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async checkAllowance(sum) {
      let allowanceValue = await this.getAllowanceValue();
      return allowanceValue >= sum * 1;
    },
    async getAllowanceValue() {
      let contracts = this.contracts;
      let from = this.account;

      let allowanceValue = await contracts.ovn.methods
        .allowance(
          from,
          contracts.insurance[`${this.networkName}_exchanger`].options.address
        )
        .call();
      return allowanceValue;
    },
    async estimateGas(sum) {
      let contracts = this.contracts;
      let from = this.account;
      const self = this;

      let result;

      try {
        let estimateOptions = { from: from, gasPrice: this.gasPriceGwei };
        let blockNum = await this.web3.eth.getBlockNumber();
        let errorApi = this.optimismApi;

        if (this.networkId === 10) return -1;

        let mintParams = {
          amount: sum
        };

        console.log(
          contracts.insurance[`${this.networkName}_exchanger`],
          "--сcontract"
        );
        console.log(mintParams, "--mintParams");
        await contracts.insurance[`${this.networkName}_exchanger`].methods
          .mint(mintParams)
          .estimateGas(estimateOptions)
          .then(function(gasAmount) {
            result = gasAmount;
            console.log(result, "--result");
          })
          .catch(function(error) {
            if (error && error.message) {
              let msg = error.message.replace(/(?:\r\n|\r|\n)/g, "");

              let errorMsg = {
                product: "OVN INS",
                data: {
                  from: from,
                  to:
                    contracts.insurance[`${self.networkName}_exchanger`].options
                      .address,
                  gas: null,
                  gasPrice: parseInt(estimateOptions.gasPrice, 16),
                  method: contracts.insurance[
                    `${self.networkName}_exchanger`
                  ].methods
                    .mint(mintParams)
                    .encodeABI(),
                  message: msg,
                  block: blockNum
                }
              };

              axios.post(errorApi + "/error/log", errorMsg);

              console.log(errorMsg);
            } else {
              console.error(
                `Mint Insurance blockcnain estimateGas error: ${error}. Sum: ${this.sum}. Account: ${this.account}. `
              );
            }

            return -1;
          });
      } catch (e) {
        console.error(
          `Mint Insurance estimateGas error: ${e}. Sum: ${this.sum}. Account: ${this.account}. `
        );
        this.showErrorModalWithMsg({ errorType: "estimateGas", errorMsg: e });
        return -1;
      }

      return result;
    }
  }
};
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

  .v-text-field >>> input,
  .v-text-field >>> label,
  .v-text-field >>> button {
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

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .btn-investor-invest {
    width: 100% !important;
    height: 40px !important;
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

  .v-text-field >>> input,
  .v-text-field >>> label,
  .v-text-field >>> button {
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

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .btn-investor-invest {
    width: 100% !important;
    height: 44px !important;
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

  .v-text-field >>> input,
  .v-text-field >>> label,
  .v-text-field >>> button {
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

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .btn-investor-invest {
    width: 100% !important;
    height: 44px !important;
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

.v-text-field >>> input,
.v-text-field >>> label,
.v-text-field >>> button {
  font-feature-settings: "pnum" on, "lnum" on;

  color: var(--links-blue) !important;
}

.balance-label {
  font-feature-settings: "pnum" on, "lnum" on;
  color: var(--secondary-gray-text);
}

.max {
  color: var(--links-blue);
  cursor: pointer;
}

.enabled-buy {
  background: var(--blue-gradient) !important;
  color: #ffffff !important;
}

.disabled-buy {
  background: var(--main-banner-background) !important;
  color: #9da4b0 !important;
}

.buy {
  width: 100% !important;
  border-radius: 2px !important;
  text-transform: uppercase !important;
  font-feature-settings: "pnum" on, "lnum" on !important;
  box-shadow: none !important;
}

.exchange-label {
  font-feature-settings: "pnum" on, "lnum" on;
  color: #8d95a3;
}

.coin-card {
  background: var(--card-coin-background);
  border-radius: 4px;
}

.coin-title {
  font-feature-settings: "liga" off;
  color: var(--secondary-gray-text);
}

.modal-link-label {
  font-feature-settings: "liga" off;
  color: var(--links-blue);
  cursor: pointer;
}

.action-info-label {
  font-feature-settings: "pnum" on, "lnum" on;
  color: var(--secondary-gray-text);
}

.action-info-sub-label {
  font-feature-settings: "pnum" on, "lnum" on;
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

.header-btn {
  border-radius: 4px;
  box-shadow: none !important;

  text-align: center !important;
  text-transform: uppercase !important;
  font-feature-settings: "pnum" on, "lnum" on !important;
}

.btn-investor-invest {
  background: var(--blue-gradient);
  color: #ffffff !important;
}
</style>

<template>
  <div class="app-header mr-n3">
    <div class="app-header__container">
      <!-- <div class="christmas-btn mr-auto">
        <router-link to="/christmas_pools">
          <div
            class="btn-wrap"
            @mouseenter="$event.target.classList.add(buttonClass)"
          >
            <v-btn class="header-btn-connect btn-filled">
              Christmas Pools
            </v-btn>
            <img
              @animationend="removeWrapClass"
              class="red-hat"
              src="https://res.cloudinary.com/freecodez/image/upload/v1701705719/images/guidvrtf8kre7pc3jdk5.webp"
              alt="hat"
            />
          </div>
        </router-link>
      </div> -->

      <div class="theme-toggle-group ml-auto">
        <v-btn
          outlined
          :class="light ? 'theme-toggle-btn-selected' : 'theme-toggle-btn'"
          icon
          @click="toggleTheme"
        >
          <img
            :src="
              light
                ? require('@/assets/icon/sun.svg')
                : require('@/assets/icon/moon_w.svg')
            "
          />
        </v-btn>
      </div>

      <template v-if="!loadingWeb3">
        <template v-if="walletConnected">
          <v-btn
            v-if="switchToOtherNetwork"
            :class="$wu.isMobile() ? 'mr-2' : ''"
            class="header-btn btn-filled mt-1"
            v-on:click="switchToNetwork"
          >
            Switch to {{ networkName }}
          </v-btn>

          <template v-else>
            <WalletBar
              v-if="
                ($wu.isMobile() && walletConnected && !switchToOtherNetwork) ||
                  !$wu.isMobile()
              "
            />
          </template>
        </template>

        <template v-else>
          <v-btn
            :class="$wu.isMobile() ? 'mr-1' : 'mr-2'"
            class="header-btn-connect btn-filled"
            @click="connectWallet"
          >
            Connect wallet
          </v-btn>
        </template>
      </template>
      <template v-else>
        <v-progress-linear
          dark
          class="progress mt-1 mr-2"
          background-opacity="0"
          color="#F5F5F5"
          indeterminate
        ></v-progress-linear>
      </template>

      <div class="header__network-wrap">
        <NetworkSelect />
      </div>

      <div v-if="!$wu.isFull()">
        <MenuSelect />
      </div>
    </div>

    <InvestModal />
    <InsuranceInvestModal />
    <SwapModal />

    <!-- TODO, remove that in swapmodal -->
    <SwapDaiModal />
    <SwapUsdtModal />
    <SwapUsdcModal />
    <SwapEthModal />
    <!-- TODO, remove that -->

    <!-- TODO, remove that in swapmodal -->
    <EthWrapModal />
    <UsdWrapModal />
    <!-- TODO, remove that -->

    <RedemptionRequestModal />
    <RedemptionRequestSuccessModal />

    <resize-observer @notify="$forceUpdate()" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import WalletBar from "@/components/common/header/WalletBar";
import NetworkSelect from "@/components/common/header/NetworkSelect";
import MenuSelect from "@/components/common/header/MenuSelect";
import SwapModal from "@/components/swap/SwapModal";
import SwapDaiModal from "@/components/swap/dai/SwapDaiModal";
import SwapUsdtModal from "@/components/swap/usdt/SwapUsdtModal";
import SwapUsdcModal from "@/components/swap/usdc/SwapUsdcModal";
import SwapEthModal from "@/components/swap/eth/SwapEthModal";
import UsdWrapModal from "@/components/swap/wusd/WrapModal";
import EthWrapModal from "@/components/swap/weth/WrapModal";
import InvestModal from "@/components/market/modal/ets/invest/InvestModal";
import RedemptionRequestModal from "@/components/insurance/modal/action/redemption-request/RedemptionRequestModal";
import RedemptionRequestSuccessModal from "@/components/insurance/modal/action/redemption-request/RedemptionRequestSuccessModal";
import InsuranceInvestModal from "@/components/insurance/modal/action/invest/InsuranceInvestModal";

export default {
  name: "Header",

  components: {
    InsuranceInvestModal,
    RedemptionRequestSuccessModal,
    RedemptionRequestModal,
    InvestModal,
    SwapModal,
    SwapDaiModal,
    SwapUsdtModal,
    SwapEthModal,
    SwapUsdcModal,
    UsdWrapModal,
    EthWrapModal,
    MenuSelect,
    NetworkSelect,
    WalletBar
  },

  data: () => ({}),

  computed: {
    ...mapGetters("network", [
      "networkName",
      "networkId",
      "switchToOtherNetwork"
    ]),
    ...mapGetters("web3", ["loadingWeb3"]),
    ...mapGetters("walletAction", ["walletConnected"]),
    ...mapGetters("accountData", ["account"]),
    ...mapGetters("theme", ["light"]),

    buttonClass() {
      return "button-hover-christmas";
    }
  },

  watch: {
    networkId: function(newValue, oldValue) {
      if (newValue) {
        this.loadTransaction();
      }
    }
  },

  methods: {
    ...mapActions("walletAction", ["connectWallet"]),
    ...mapActions("network", ["setWalletNetwork"]),
    ...mapActions("transaction", ["loadTransaction"]),
    ...mapActions("track", ["trackClick"]),
    ...mapActions("theme", ["switchTheme"]),

    removeWrapClass() {
      const el = document.querySelector(".btn-wrap");
      el.classList.remove(this.buttonClass);
    },

    switchToNetwork() {
      this.setWalletNetwork(this.networkId.toString());
      // this.trackClick({action: 'switch_network', event_category: 'Chain Switch', event_label: 'Switch network', value: 1 });
    },

    openLink(url) {
      window.open(url, "_blank").focus();
    },

    openLinkToLanding(url) {
      window.open(url, "_self").focus();
    },

    goToPresale() {
      try {
        this.trackClick({
          action: "presale_header_button",
          event_category: "Button click",
          event_label: "Click presale header button"
        });
      } catch (e) {
        console.error("Track error:", e);
      }

      this.$router.push("/presale");
    },

    toggleTheme() {
      this.switchTheme();
    }
  }
};
</script>

<style scoped>
.christmas-btn {
  position: relative;
}
.red-hat {
  position: absolute;
  top: -15px;
  left: -17px;
  height: 44px;
  filter: drop-shadow(0 2px 1px rgb(0 0 0 / 0.25));
}
.app-header__adv {
  display: none;
  justify-content: space-between;
  margin-right: auto;
  background: linear-gradient(90deg, #279fef 0%, #097bc6 100%);
  padding: 6px 15px;
  border-radius: 4px;
  color: #fff;
}

.app-header__adv-title {
  max-width: 240px;
  min-width: 150px;
  font-size: 18px;
}

.app-header__adv-data {
  display: flex;
  align-items: center;
  border-radius: 10px;
  border: 2px solid #0657a2;
  padding: 6px 16px;
  background: linear-gradient(
    180deg,
    rgba(0, 127, 210, 0.5) 0%,
    rgba(0, 59, 129, 0.5) 100%
  );
}

.app-header__adv-data img {
  width: 40px;
  height: 40px;
}

.app-header__adv-data__row {
  display: flex;
  align-items: center;
}

.app-header__adv-data__row:last-child {
  display: none;
}

.app-header__adv-data span {
  font-size: 16px;
  font-weight: 600;
}

.app-header__adv-btn {
  height: auto;
}

.app-header__adv-btn button {
  min-width: 100px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  height: 100% !important;
}

.app-header__adv-btn_arrows {
  display: none;
}
.header-btn-connect.v-btn,
.header-btn-presale.v-btn {
  height: 42px;
}

.theme-toggle-group {
  margin-left: auto;
  margin-right: 20px;
}
.app-header__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.app-header {
  position: relative;
}

.header__network-wrap {
  margin-left: 24px;
  margin-right: 8px;
}

/* mobile */
@media only screen and (max-width: 960px) {
  .progress {
    width: 150px;
  }

  .app-header__container {
    margin: 0 5%;
  }

  .header-btn,
  .header-btn-connect {
    width: 148px;
    height: 28px;

    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.02em;
  }

  .header-btn-presale {
    min-width: 55p;
    width: 55px;
    height: 25px;

    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 25px;
    letter-spacing: 0.02em;
  }
  .logo-img {
    width: 28px;
    height: 28px;

    margin-top: 10px;
  }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
  .progress {
    width: 300px;
  }

  .app-header__container {
    margin: 0 3%;
  }

  .header-btn,
  .header-btn-connect {
    width: 200px;
    height: 36px;

    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
  }

  .header-btn-presale {
    width: 170px;
    height: 39px;

    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
    letter-spacing: 0.02em;
  }

  .logo-img {
    width: 48px;
    height: 48px;

    margin-top: 8px;
  }
}

/* full */
@media only screen and (min-width: 1400px) {
  .header__network-wrap {
    margin-right: 0;
    margin-left: 24px;
  }

  .app-header {
    left: 242px;
    width: calc(100% - 242px);
  }
  .progress {
    width: 300px;
  }

  .app-header__container {
    margin: 0 3%;
  }

  .header-btn,
  .header-btn-connect {
    width: 210px;
    height: 36px;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    letter-spacing: 0.02em;
  }

  .header-btn-presale {
    width: 178px;
    height: 42px;

    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
    letter-spacing: 0.02em;
  }
}

@media only screen and (min-width: 1500px) {
  .app-header__adv {
    display: flex;
  }
}
@media only screen and (min-width: 1750px) {
  .app-header__adv {
    min-width: 55%;
    padding: 6px 20px;
  }
  .app-header__adv-data__row:last-child {
    display: flex;
  }

  .app-header__adv-btn,
  .app-header__adv-title {
    font-size: 18px;
  }

  .app-header__adv-btn_arrows {
    display: flex;
  }
}
.progress {
  background: var(--blue-gradient);
}

.header-btn,
.header-btn-connect {
  border-radius: 2px;
  box-shadow: none;
  text-align: center;
  text-transform: uppercase;
}

.btn-filled {
  background: var(--blue-gradient);
  color: var(--secondary);
}

.logo-img {
  cursor: pointer;
}

.theme-toggle-group {
  background-color: var(--theme-switch-background-light);
  border-radius: 5px;
  border: 1px solid transparent;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-btn,
.theme-toggle-btn-selected {
  border: none;
}

.theme-toggle-btn {
  height: 42px;
  background-color: transparent;
}

.theme-toggle-btn-selected {
  background-color: var(--theme-switch-background-light);
}

.v-btn__content .theme-icon {
  color: var(--theme-icon-color);
}

.theme-icon-selected {
  color: var(--theme-icon-color-selected);
}
.header-btn-connect {
  color: #fff;
}

.button-hover-christmas .red-hat {
  animation: shake 1s ease-in-out;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>

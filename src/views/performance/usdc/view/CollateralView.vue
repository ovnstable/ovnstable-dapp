<template>
  <div class="page-container">
    <div class="mt-10">
      <label class="title-label">USDC+ Collateral</label>
    </div>

    <UsdcPlusTab v-if="networkId === 8453" />
    <div v-else class="ma-0 info-card-container d-flex mt-3">
      <div
        class=""
        :class="$wu.isMobile() ? 'ml-5 mr-5 mt-5' : 'ml-10 mr-5 my-5'"
      >
        <v-img
          class="currency"
          :src="require('@/assets/currencies/usdc+.svg')"
        />
      </div>
      <div
        class="info-card-container-box"
        :class="$wu.isMobile() ? 'mt-5 mb-5 ml-5 mr-5' : 'mt-0'"
      >
        <label class="section-text">
          USDC+ is the equivalent of USD+, pegged to USDC 1:1. USDC+ consist of
          aUSDC (Aave) and USD+. It has been designed for boosted pools
          (Balancer and Beethoven) on Optimism. It cannot be minted separately.
        </label>
        <div class="section-text font-weight-bold">
          Switch to Base chain to see USDC+ collateral.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import UsdcPlusTab from "@/views/performance/usdc/view/tab/UsdcPlusTab.vue";

export default {
  name: "CollateralUsdcView",

  components: {
    UsdcPlusTab
  },

  computed: {
    ...mapGetters("network", ["networkId"])
  },

  methods: {
    ...mapActions("swapUsdcModal", [
      "showUsdcSwapModal",
      "showUsdcMintView",
      "showUsdcRedeemView"
    ]),
    ...mapActions("network", ["setWalletNetwork"]),

    openLink(url) {
      window.open(url, "_blank").focus();
    },

    mintAction() {
      this.showUsdcMintView();
      this.showUsdcSwapModal();
    },

    redeemAction() {
      this.showUsdcRedeemView();
      this.showUsdcSwapModal();
    }
  }
};
</script>

<style scoped>
/* mobile */
@media only screen and (max-width: 960px) {
  .section-title-label {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
  }

  .title-label {
    font-style: normal;
    font-weight: 300;
    font-size: 32px;
    line-height: 40px;
  }

  .wide-btn {
    font-size: 14px;
    line-height: 18px;
  }

  .section-text {
    font-size: 14px;
    line-height: 22px;
  }

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .btn-filled,
  .btn-outlined {
    width: 40% !important;
  }

  .buttons-div {
    display: flex;
    gap: 10px;
  }

  .footer-btn {
    width: 100% !important;
  }

  .currency {
    width: 100px !important;
    height: 100px !important;
  }

  .info-card-container {
    display: flex;
    flex-direction: column;
  }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
  .title-label {
    font-style: normal;
    font-weight: 300;
    font-size: 54px;
    line-height: 60px;
  }

  .section-title-label {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.04em;
  }

  .wide-btn {
    font-size: 16px;
    line-height: 20px;
  }

  .section-text {
    font-size: 16px;
    line-height: 24px;
  }

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .footer-btn {
    width: 26% !important;
  }
}

/* full */
@media only screen and (min-width: 1400px) {
  .section-title-label {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.04em;
  }

  .title-label {
    font-style: normal;
    font-weight: 300;
    font-size: 54px;
    line-height: 60px;
  }

  .wide-btn {
    font-size: 16px;
    line-height: 20px;
  }

  .section-text {
    font-size: 18px;
    line-height: 28px;
  }

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .footer-btn {
    width: 26% !important;
  }
}

@media only screen and (min-width: 1300px) {
  .label-about {
    margin-top: 15px !important;
  }

  .section-title-label {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.04em;
  }

  .title-label {
    font-style: normal;
    font-weight: 300;
    font-size: 48px;
    line-height: 60px;
  }

  .wide-btn {
    font-size: 14px;
    line-height: 20px;
  }

  .section-text {
    font-size: 17px;
    line-height: 28px;
  }

  .header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 15px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
  }

  .footer-btn {
    width: 26% !important;
  }
}

.page-container {
  margin-bottom: 5% !important;
}

.title-label {
  text-transform: uppercase;
  font-feature-settings: "pnum" on, "lnum" on;
  color: var(--main-gray-text);
}

.wide-btn {
  min-width: 100% !important;
  height: 40px;
  border: 1px solid var(--input-placeholder);

  background-color: var(--action-btn-bg) !important;
  color: var(--zoom-btn-color);

  font-weight: 400;

  letter-spacing: 0.2;
  text-transform: uppercase;
  font-feature-settings: "pnum" on, "lnum" on;
  box-shadow: none;
}

.wide-btn:hover {
  background: var(--hover);
  color: rgba(28, 149, 231, 1) !important;
}

.tab-button-inactive {
  background: transparent !important;
}

.tab-button-upper {
  border-bottom: 2px solid var(--links-blue) !important;
  color: var(--links-blue) !important;
  cursor: pointer;
}

.info-card-container {
  background: var(--secondary);
  border-radius: 12px;
}

.info-card-container-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.section-title-label {
  font-feature-settings: "pnum" on, "lnum" on;
  text-transform: none;
  color: var(--secondary-gray-text);
}

.section-text {
  font-weight: 300;
  color: var(--main-gray-text);
}

.header-btn {
  border-radius: 4px !important;
  box-shadow: none !important;

  text-align: center !important;
  text-transform: uppercase !important;
  font-feature-settings: "pnum" on, "lnum" on !important;
}

.btn-filled {
  background: var(--blue-gradient);
  color: #ffffff !important;
  width: 140px;
  height: 40px;
}

.btn-outlined {
  background-color: var(--main-background) !important;
  color: var(--links-blue);
  border: 1px solid #1c95e7;
  width: 140px;
  height: 40px;
}

.buttons-div {
  display: flex;
}

.footer-btn {
  width: 20%;
}
</style>

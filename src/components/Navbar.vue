<template>
  <v-navigation-drawer app permanent width="242" color="var(--secondary)">
    <div class="mt-2">
      <v-list-item>
        <v-list-item-title>
          <router-link to="/swap">
            <img :src="randomNavbarLogo" class="logo-img" />
          </router-link>
        </v-list-item-title>
      </v-list-item>
    </div>

    <div class="ml-1 mr-1 mt-2">
      <div
        @click="swapOdosClick()"
        :class="selectedTab === 'swap-odos' ? 'selected-page-item' : ''"
        class="single-item pa-1 list-item-hover mb-1"
        id="click_menu_swap"
      >
        <div class="navbar-page-link pl-1">
          <img :src="require('@/assets/icon/menu/swap_menu.svg')" />
        </div>
        <div class="pl-2">
          <label
            :class="selectedTab === 'swap-odos' ? 'selected-page' : ''"
            class="navbar-page-label"
          >
            SWAP
          </label>
        </div>
      </div>

      <div
        @click="bridgeClick()"
        :class="selectedTab === 'bridge' ? 'selected-page-item' : ''"
        class="single-item pa-1 list-item-hover mb-1"
        id="click_bridge"
      >
        <div>
          <div class="navbar-page-link pl-1">
            <img
              :src="require('@/assets/icon/menu/shuffle-variant.svg')"
              class="bridge_icon"
            />
          </div>
        </div>
        <div>
          <label
            :class="selectedTab === 'bridge' ? 'selected-page' : ''"
            class="navbar-page-label pl-2"
          >
            BRIDGE
          </label>
        </div>
      </div>
    </div>

    <div class="ml-1 mr-1">
      <div class="navbar-list-divider mt-1"></div>
      <label class="navbar-list-header pl-2"> Money Markets </label>

      <template>
        <div
          @click="toggleUsdPlus(!isShowUsd)"
          class="single-item pa-1 list-item-hover mb-1"
        >
          <div class="navbar-page-link pl-1">
            <img
              :src="
                light
                  ? isShowUsd
                    ? require('@/assets/icon/menu/usdPlusWhite.svg')
                    : require('@/assets/icon/menu/usdPlusWhiteOff.svg')
                  : isShowUsd
                  ? require('@/assets/icon/menu/usdPlusBlack.svg')
                  : require('@/assets/icon/menu/usdPlusWhiteOff.svg')
              "
            />
          </div>
          <div>
            <label
              :class="selectedTab.startsWith('usdplus_') ? 'selected-page' : ''"
              class="navbar-page-label pl-2"
            >
              USD+
            </label>
          </div>
          <div class="ml-16">
            <img
              class="arrow"
              :src="
                light
                  ? isShowUsd
                    ? require('@/assets/icon/down_black.svg')
                    : require('@/assets/icon/right_black.svg')
                  : isShowUsd
                  ? require('@/assets/icon/down_w.svg')
                  : require('@/assets/icon/right_w.svg')
              "
              alt="right icon"
            />
          </div>
        </div>

        <div
          @click="statsClick"
          v-show="isShowUsd"
          :class="
            selectedTab === 'usdplus_performance' ? 'selected-page-item' : ''
          "
          class="list-item-hover mb-1"
        >
          <div
            :class="
              selectedTab === 'usdplus_performance' ? 'selected-page' : ''
            "
            class="navbar-list-label pa-1 pl-11"
          >
            Performance
          </div>
        </div>

        <div
          @click="collateralClick"
          v-show="isShowUsd"
          :class="
            selectedTab === 'usdplus_collateral' ? 'selected-page-item' : ''
          "
          class="list-item-hover mb-1"
        >
          <div
            :class="selectedTab === 'usdplus_collateral' ? 'selected-page' : ''"
            class="navbar-list-label pa-1 pl-11"
          >
            Collateral
          </div>
        </div>
      </template>

      <template>
        <div
          @click="toggleDaiPlus(!isShowDai)"
          class="single-item pa-1 list-item-hover mb-1"
        >
          <div class="navbar-page-link pl-1">
            <img
              :src="
                light
                  ? isShowDai
                    ? require('@/assets/icon/menu/daiPlusWhite.svg')
                    : require('@/assets/icon/menu/daiPlusWhiteOff.svg')
                  : isShowDai
                  ? require('@/assets/icon/menu/daiPlusBlack.svg')
                  : require('@/assets/icon/menu/daiPlusWhiteOff.svg')
              "
            />
          </div>
          <div>
            <label
              :class="selectedTab.startsWith('daiplus_') ? 'selected-page' : ''"
              class="navbar-page-label pl-2"
            >
              DAI+&nbsp;
            </label>
          </div>
          <div class="ml-16">
            <img
              class="arrow"
              :src="
                light
                  ? isShowDai
                    ? require('@/assets/icon/down_black.svg')
                    : require('@/assets/icon/right_black.svg')
                  : isShowDai
                  ? require('@/assets/icon/down_w.svg')
                  : require('@/assets/icon/right_w.svg')
              "
              alt="right icon"
            />
          </div>
        </div>

        <div
          @click="daiStatsClick"
          v-show="isShowDai"
          :class="
            selectedTab === 'daiplus_performance' ? 'selected-page-item' : ''
          "
          class="list-item-hover mb-1"
        >
          <div
            :class="
              selectedTab === 'daiplus_performance' ? 'selected-page' : ''
            "
            class="navbar-list-label pa-1 pl-11"
          >
            Performance
          </div>
        </div>

        <div
          @click="daiCollateralClick"
          v-show="isShowDai"
          :class="
            selectedTab === 'daiplus_collateral' ? 'selected-page-item' : ''
          "
          class="list-item-hover mb-1"
        >
          <div
            :class="selectedTab === 'daiplus_collateral' ? 'selected-page' : ''"
            class="navbar-list-label pa-1 pl-11"
          >
            Collateral
          </div>
        </div>
      </template>

      <template>
        <div
          @click="toggleUsdtPlus(!isShowUsdt)"
          class="single-item pa-1 list-item-hover mb-1"
        >
          <div class="navbar-page-link pl-1">
            <img
              :src="
                light
                  ? isShowUsdt
                    ? require('@/assets/icon/menu/usdtPlusWhite.svg')
                    : require('@/assets/icon/menu/usdtPlusWhiteOff.svg')
                  : isShowUsdt
                  ? require('@/assets/icon/menu/usdtPlusBlack.svg')
                  : require('@/assets/icon/menu/usdtPlusWhiteOff.svg')
              "
            />
          </div>
          <div>
            <label
              :class="
                selectedTab.startsWith('usdtplus_') ? 'selected-page' : ''
              "
              class="navbar-page-label pl-2"
            >
              USDT+
            </label>
          </div>
          <div class="ml-14">
            <img
              class="arrow"
              :src="
                light
                  ? isShowUsdt
                    ? require('@/assets/icon/down_black.svg')
                    : require('@/assets/icon/right_black.svg')
                  : isShowUsdt
                  ? require('@/assets/icon/down_w.svg')
                  : require('@/assets/icon/right_w.svg')
              "
              alt="right icon"
            />
          </div>
        </div>

        <div
          @click="usdtStatsClick"
          v-if="isShowUsdt"
          :class="
            selectedTab === 'usdtplus_performance' ? 'selected-page-item' : ''
          "
          class="list-item-hover mb-1"
        >
          <div
            :class="
              selectedTab === 'usdtplus_performance' ? 'selected-page' : ''
            "
            class="navbar-list-label pa-1 pl-11"
          >
            Performance
          </div>
        </div>

        <div
          @click="usdtCollateralClick"
          v-if="isShowUsdt"
          :class="
            selectedTab === 'usdtplus_collateral' ? 'selected-page-item' : ''
          "
          class="list-item-hover mb-1"
        >
          <div
            :class="
              selectedTab === 'usdtplus_collateral' ? 'selected-page' : ''
            "
            class="navbar-list-label pa-1 pl-11"
          >
            Collateral
          </div>
        </div>
      </template>

      <template>
        <div
          @click="toggleUsdcPlus(!isShowUsdc)"
          class="single-item pa-1 list-item-hover mb-1"
        >
          <div class="navbar-page-link pl-1">
            <img
              :src="
                light
                  ? isShowUsdc
                    ? require('@/assets/icon/menu/usdtPlusWhite.svg')
                    : require('@/assets/icon/menu/usdtPlusWhiteOff.svg')
                  : isShowUsdc
                  ? require('@/assets/icon/menu/usdtPlusBlack.svg')
                  : require('@/assets/icon/menu/usdtPlusWhiteOff.svg')
              "
            />
          </div>
          <div>
            <label
              :class="
                selectedTab.startsWith('usdcplus_') ? 'selected-page' : ''
              "
              class="navbar-page-label pl-2"
            >
              USDC+
            </label>
          </div>
          <div class="ml-14">
            <img
              class="arrow"
              :src="
                light
                  ? isShowUsdc
                    ? require('@/assets/icon/down_black.svg')
                    : require('@/assets/icon/right_black.svg')
                  : isShowUsdc
                  ? require('@/assets/icon/down_w.svg')
                  : require('@/assets/icon/right_w.svg')
              "
              alt="right icon"
            />
          </div>
        </div>

        <div
          @click="usdcStatsClick"
          v-if="isShowUsdc"
          :class="
            selectedTab === 'usdcplus_performance' ? 'selected-page-item' : ''
          "
          class="list-item-hover mb-1"
        >
          <div
            :class="
              selectedTab === 'usdcplus_performance' ? 'selected-page' : ''
            "
            class="navbar-list-label pa-1 pl-11"
          >
            Performance
          </div>
        </div>

        <div
          @click="usdcCollateralClick"
          v-if="isShowUsdc"
          :class="
            selectedTab === 'usdcplus_collateral' ? 'selected-page-item' : ''
          "
          class="list-item-hover mb-1"
        >
          <div
            :class="
              selectedTab === 'usdcplus_collateral' ? 'selected-page' : ''
            "
            class="navbar-list-label pa-1 pl-11"
          >
            Collateral
          </div>
        </div>
      </template>

      <template>
        <div
          @click="toggleEthPlus(!isShowEth)"
          class="single-item pa-1 list-item-hover mb-1"
        >
          <div class="navbar-page-link pl-1">
            <img
              :src="
                light
                  ? isShowEth
                    ? require('@/assets/icon/menu/ethPlusWhite.svg')
                    : require('@/assets/icon/menu/ethPlusWhiteOff.svg')
                  : isShowEth
                  ? require('@/assets/icon/menu/ethPlusBlack.svg')
                  : require('@/assets/icon/menu/ethPlusWhiteOff.svg')
              "
            />
          </div>
          <div>
            <label
              :class="selectedTab.startsWith('ethplus_') ? 'selected-page' : ''"
              class="navbar-page-label pl-2"
            >
              ETH+
            </label>
          </div>
          <div class="ml-16">
            <img
              class="arrow"
              :src="
                light
                  ? isShowEth
                    ? require('@/assets/icon/down_black.svg')
                    : require('@/assets/icon/right_black.svg')
                  : isShowEth
                  ? require('@/assets/icon/down_w.svg')
                  : require('@/assets/icon/right_w.svg')
              "
              alt="right icon"
            />
          </div>
        </div>

        <div
          @click="ethStatsClick"
          v-if="isShowEth"
          :class="
            selectedTab === 'ethplus_performance' ? 'selected-page-item' : ''
          "
          class="list-item-hover mb-1"
        >
          <div
            :class="
              selectedTab === 'ethplus_performance' ? 'selected-page' : ''
            "
            class="navbar-list-label pa-1 pl-11"
          >
            Performance
          </div>
        </div>

        <div
          @click="ethCollateralClick"
          v-if="isShowEth"
          :class="
            selectedTab === 'ethplus_collateral' ? 'selected-page-item' : ''
          "
          class="list-item-hover mb-1"
        >
          <div
            :class="selectedTab === 'ethplus_collateral' ? 'selected-page' : ''"
            class="navbar-list-label pa-1 pl-11"
          >
            Collateral
          </div>
        </div>
      </template>

      <div class="navbar-list-divider mt-1"></div>
      <label class="navbar-list-header pl-2"> Yield Farming </label>

      <div
        @click="featuredClick"
        :class="selectedTab === 'featured' ? 'selected-page-item' : ''"
        class="single-item pa-1 list-item-hover mb-1"
      >
        <div>
          <img :src="require('@/assets/icon/menu/featuresMenu.svg')" />
        </div>
        <div
          :class="selectedTab === 'featured' ? 'selected-page' : ''"
          class="navbar-page-label pl-2"
        >
          FEATURED
        </div>
      </div>
      <div
        @click="usdPlusPoolsClick"
        :class="selectedTab === 'pools' ? 'selected-page-item' : ''"
        class="single-item pa-1 list-item-hover mb-1"
      >
        <div>
          <img
            :src="require('@/assets/icon/menu/allPoolsMenu.svg')"
            class="pools_menu_icon"
          />
        </div>
        <div
          :class="selectedTab === 'pools' ? 'selected-page' : ''"
          class="navbar-page-label pl-2"
        >
          ALL POOLS
        </div>
      </div>

      <div class="navbar-list-divider mt-1"></div>

      <label class="navbar-list-header pl-2"> OVN TOKEN </label>

      <div
        @click="provideLpClick"
        :class="selectedTab === 'provide-lp' ? 'selected-page-item' : ''"
        class="single-item pa-1 list-item-hover mb-1"
      >
        <div class="navbar-page-link pl-1">
          <img
            :src="require('@/assets/icon/menu/provide-lp.svg')"
            class="provide_lp"
          />
        </div>
        <div
          :class="selectedTab === 'provide-lp' ? 'selected-page' : ''"
          class="navbar-page-label pl-2"
        >
          PROVIDE LP
        </div>
      </div>

      <template>
        <div
          @click="toggleInsurance(!isShowInsurance)"
          class="single-item pa-1 list-item-hover mb-1"
        >
          <div class="navbar-page-link pl-1">
            <img
              :src="
                light
                  ? isShowInsurance
                    ? require('@/assets/icon/menu/insPlusWhite.svg')
                    : require('@/assets/icon/menu/insPlusWhiteOff.svg')
                  : isShowInsurance
                  ? require('@/assets/icon/menu/insPlusBlack.svg')
                  : require('@/assets/icon/menu/insPlusWhiteOff.svg')
              "
            />
          </div>
          <div
            :class="selectedTab.startsWith('insurance_') ? 'selected-page' : ''"
            class="navbar-page-label pl-2"
          >
            INSURANCE
          </div>
          <div class="ml-5">
            <img
              class="arrow"
              :src="
                light
                  ? isShowInsurance
                    ? require('@/assets/icon/down_black.svg')
                    : require('@/assets/icon/right_black.svg')
                  : isShowInsurance
                  ? require('@/assets/icon/down_w.svg')
                  : require('@/assets/icon/right_w.svg')
              "
              alt="right icon"
            />
          </div>
        </div>

        <div
          @click="insuranceAboutClick"
          v-show="isShowInsurance"
          :class="selectedTab === 'insurance_about' ? 'selected-page-item' : ''"
          class="list-item-hover mb-1"
        >
          <div
            :class="selectedTab === 'insurance_about' ? 'selected-page' : ''"
            class="navbar-list-label pa-1 pl-11"
          >
            About
          </div>
        </div>

        <div
          @click="insuranceStatsClick"
          v-show="isShowInsurance"
          :class="
            selectedTab === 'insurance_performance' ? 'selected-page-item' : ''
          "
          class="list-item-hover mb-1"
        >
          <div
            :class="
              selectedTab === 'insurance_performance' ? 'selected-page' : ''
            "
            class="navbar-list-label pa-1 pl-11"
          >
            Performance
          </div>
        </div>

        <div
          @click="insuranceCollateralClick"
          v-show="isShowInsurance"
          :class="
            selectedTab === 'insurance_collateral' ? 'selected-page-item' : ''
          "
          class="list-item-hover mb-1"
        >
          <div
            :class="
              selectedTab === 'insurance_collateral' ? 'selected-page' : ''
            "
            class="navbar-list-label pa-1 pl-11"
          >
            Premiums
          </div>
        </div>
      </template>
    </div>

    <div>
      <div class="navbar-list-divider mt-1 mb-1"></div>
      <div
        @click="dashBoardClick"
        :class="selectedTab === 'dashboard' ? 'selected-page-item' : ''"
        class="single-item pa-1 list-item-hover mb-1"
      >
        <div>
          <img
            :src="require('@/assets/icon/menu/myDashboardMenu.svg')"
            class="my_dashboard_icon"
          />
        </div>
        <div
          :class="selectedTab === 'dashboard' ? 'selected-page' : ''"
          class="navbar-page-label pl-2"
        >
          My Dashboard
        </div>
      </div>
    </div>

    <template v-slot:append>
      <div class="mt-2">
        <div
          @click="openLink('https://docs.overnight.fi/')"
          class="pa-2 pl-2 footer-item-label list-item-hover mb-1 ml-1 mr-1"
        >
          Docs
        </div>

        <div
          @click="
            openLink('https://docs.overnight.fi/advanced/terms-of-service')
          "
          class="pa-2 pl-2 footer-item-label list-item-hover mb-1 ml-1 mr-1"
        >
          Terms of Service
        </div>

        <div
          @click="
            openLink(
              'https://discord.com/channels/933003627444969552/967813123149033542/967813482684760135/'
            )
          "
          class="pa-2 pl-2 footer-item-label list-item-hover mb-1 ml-1 mr-1"
        >
          Help center in Discord
        </div>

        <div
          @click="aboutEtsClick()"
          class="pa-2 pl-2 footer-item-label list-item-hover mb-1 ml-1 mr-1"
        >
          ETS
        </div>
      </div>

      <div class="social-container mr-15">
        <div
          @click="openLink('https://twitter.com/overnight_fi')"
          class="footer-social-link ml-1"
        >
          <img :src="require('@/assets/social/twitterSocial.svg')" />
        </div>

        <div
          @click="openLink('https://discord.gg/overnight-fi')"
          class="footer-social-link ml-2"
        >
          <img :src="require('@/assets/social/discordSocial.svg')" />
        </div>

        <div
          @click="openLink('https://zealy.io/c/overnight-fi/questboard')"
          class="footer-social-link zealy ml-5"
        >
          <img :src="require('@/assets/social/zealySocial.svg')" />
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { menu } from "@/components/mixins/menu";

export default {
  name: "Navbar",
  mixins: [menu],

  components: {},

  data: () => ({
    iconColor: null,

    isShowSwipeNotification: false
  }),
  mounted() {
    this.checkIsNotified();
  },

  computed: {
    ...mapGetters("network", ["networkId", "networkName"]),
    ...mapGetters("menuUI", ["selectedTab"]),
    ...mapGetters("theme", ["light"]),

    randomNavbarLogo() {
      let randomNum = Math.round(Math.random() * 3);
      const url = require(`@/assets/header/ny_logo_${randomNum}.svg`);
      return url;
    },

    changeIconColor: function() {
      if (this.light) {
        return this.iconColor ? "#000000" : "#ADB3BD";
      }

      return this.iconColor ? "#FFFFFF" : "#ADB3BD";
    },

    usdPlusIconColor: function() {
      if (this.light) {
        return this.isShowUsd ? "#000000" : "#ADB3BD";
      }

      return this.isShowUsd ? "#FFFFFF" : "#ADB3BD";
    },

    daiPlusIconColor: function() {
      if (this.light) {
        return this.isShowDai ? "#000000" : "#ADB3BD";
      }

      return this.isShowDai ? "#FFFFFF" : "#ADB3BD";
    },

    usdtPlusIconColor: function() {
      if (this.light) {
        return this.isShowUsdt ? "#000000" : "#ADB3BD";
      }

      return this.isShowUsdt ? "#FFFFFF" : "#ADB3BD";
    },

    insuranceIconColor: function() {
      if (this.light) {
        return this.isShowInsurance ? "#000000" : "#ADB3BD";
      }

      return this.isShowInsurance ? "#FFFFFF" : "#ADB3BD";
    },

    etsIconColor: function() {
      if (this.light) {
        return this.isShowEts ? "#000000" : "#ADB3BD";
      }

      return this.isShowEts ? "#FFFFFF" : "#ADB3BD";
    }
  },

  methods: {
    ...mapActions("menuUI", ["selectTab"]),
    ...mapActions("theme", ["switchTheme"]),
    ...mapActions("track", ["trackClick"]),

    checkIsNotified(subscribe) {
      let a = true;
      if (a) {
        return;
      }

      let lastNotify = localStorage.getItem("lastNotify");

      if (!lastNotify || lastNotify === "null" || lastNotify === "undefined") {
        localStorage.setItem("lastNotify", "2");
        this.isShowSwipeNotification = true;
        return;
      }

      lastNotify = lastNotify * 1;
      if (lastNotify <= 0) {
        localStorage.setItem("lastNotify", "0");
        this.isShowSwipeNotification = false;
        return;
      }

      if (subscribe) {
        this.subNotifyCount();
        return;
      }

      this.isShowSwipeNotification = true;
    },
    subNotifyCount() {
      let lastNotify = localStorage.getItem("lastNotify");
      if (!lastNotify || lastNotify === "null" || lastNotify === "undefined") {
        localStorage.setItem("lastNotify", "2");
        this.isShowSwipeNotification = true;
        return;
      }

      lastNotify = lastNotify - 1;
      localStorage.setItem("lastNotify", lastNotify + "");
      this.isShowSwipeNotification = true;
    },

    openLink(url, isNotBlank) {
      window.open(url, isNotBlank ? "_self" : "_blank").focus();
    },

    openLinkToLanding(url) {
      window.open(url, "_self").focus();
    },

    wrapClick() {
      this.showWrapView();
      this.showWrapModal();
      // this.trackClick({action: 'wrap-click', event_category: 'Wrap', event_label: 'Open wrap modal', value: 1 });
    },

    redemptionRequestAction() {
      this.showRedemptionRequestModal();
    }
  }
};
</script>

<style scoped>
/* mobile */
@media only screen and (max-width: 960px) {
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
}

/* full */
@media only screen and (min-width: 1400px) {
}

.logo-img {
  cursor: pointer;
  height: 48px !important;
  width: 48px !important;
}

.navbar-page-link {
  height: 24px !important;
  width: 24px !important;
}

.footer-item-label {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  font-feature-settings: "liga" off;
  color: var(--third-gray-text);
  cursor: pointer;
}

.navbar-page-label {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.02em !important;
  text-transform: uppercase;
  font-feature-settings: "pnum" on, "lnum" on;
  color: var(--main-gray-text);
  cursor: pointer;
}

.list-item-hover:hover {
  background: var(--hover) !important;
}

.list-item-hover:active {
  background: var(--active) !important;
}

.navbar-list-header {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.02em !important;
  font-feature-settings: "pnum" on, "lnum" on;
  color: var(--third-gray-text);
  text-transform: uppercase;
}

.navbar-list-label {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  letter-spacing: 0.05em;
  color: var(--main-gray-text);
  cursor: pointer;
}

.navbar-list-divider {
  border-top: 1px solid var(--input-placeholder) !important;
}

.selected-page {
  color: var(--main-gray-text);
  font-weight: 700;
}

.selected-page-item {
  background-color: var(--card-banner-status-container) !important;
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.ping {
  position: relative;
  padding-left: 1em;
  color: rgba(28, 149, 231);
}

.ping::before,
.ping::after {
  content: "";
  position: absolute;
  top: 0.25em;
  left: 0;
  width: 0.75em;
  height: 0.75em;
  border-radius: 50%;
  background-color: currentColor;
}

.ping::before {
  animation: ping 1.7s ease infinite;
  opacity: 0.25;
}

.v-list-item {
  display: flex;
}

.single-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.social-container {
  display: flex;
  flex-direction: row;
}

.footer-social-link {
  cursor: pointer;
  height: 48px !important ;
}

.zealy {
  margin-top: 11px !important;
}

.arrow {
  width: 12px;
  height: 12px;
}

.bridge_icon,
.provide_lp,
.my_dashboard_icon,
.pools_menu_icon {
  width: 24px;
  height: 22px;
}

.my_dashboard_icon {
  margin-left: 4px;
}
</style>

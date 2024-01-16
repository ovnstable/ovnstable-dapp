export const menu = {
  data() {
    return {
      isShowEts: false,
      isShowUsd: false,
      isShowDai: false,
      isShowUsdt: false,
      isShowUsdc: false,
      isShowEth: false,
      isShowInsurance: false
    };
  },
  methods: {
    goToAction(id) {
      this.$router.push(id);
    },

    goToActionByPath(path, queryParams) {
      this.$router.push({
        path: path,
        query: queryParams ? queryParams : {}
      });
    },

    toggleUsdPlus(isShow) {
      if (isShow) {
        this.toggleEts(false);
        this.toggleDaiPlus(false);
        this.toggleUsdtPlus(false);
        this.toggleEthPlus(false);
        this.toggleInsurance(false);
      }

      this.isShowUsd = isShow;
    },

    toggleDaiPlus(isShow) {
      if (isShow) {
        this.toggleEts(false);
        this.toggleUsdPlus(false);
        this.toggleUsdtPlus(false);
        this.toggleEthPlus(false);
        this.toggleInsurance(false);
      }

      this.isShowDai = isShow;
    },

    toggleUsdcPlus(isShow) {
      if (isShow) {
        this.toggleEts(false);
        this.toggleUsdPlus(false);
        this.toggleDaiPlus(false);
        this.toggleEthPlus(false);
        this.toggleInsurance(false);
      }

      this.isShowUsdc = isShow;
    },

    toggleUsdtPlus(isShow) {
      if (isShow) {
        this.toggleEts(false);
        this.toggleUsdPlus(false);
        this.toggleDaiPlus(false);
        this.toggleEthPlus(false);
        this.toggleInsurance(false);
      }

      this.isShowUsdt = isShow;
    },

    toggleEthPlus(isShow) {
      if (isShow) {
        this.toggleEts(false);
        this.toggleUsdPlus(false);
        this.toggleDaiPlus(false);
        this.toggleUsdtPlus(false);
        this.toggleInsurance(false);
      }

      this.isShowEth = isShow;
    },

    toggleInsurance(isShow) {
      if (isShow) {
        this.toggleEts(false);
        this.toggleUsdPlus(false);
        this.toggleUsdtPlus(false);
        this.toggleEthPlus(false);
        this.toggleDaiPlus(false);
      }

      this.isShowInsurance = isShow;
    },

    toggleEts(isShow) {
      if (isShow) {
        this.toggleUsdPlus(false);
        this.toggleDaiPlus(false);
        this.toggleUsdtPlus(false);
        this.toggleEthPlus(false);
        this.toggleInsurance(false);
      }

      this.isShowEts = isShow;
    },

    featuredClick() {
      this.selectTab("featured");
      this.goToActionByPath("/featured");
    },

    buyOvnClick() {
      this.selectTab("buy-ovn");
      this.goToActionByPath("/buy-ovn");
    },

    provideLpClick() {
      this.selectTab("provide-lp");
      this.goToActionByPath("/provide-lp");
    },

    insuranceClick() {
      this.selectTab("insurance");
      this.goToActionByPath("/insurance");
    },

    insuranceStatsClick() {
      this.selectTab("insurance_performance");
      this.goToActionByPath("/insurance/network/optimism");
    },

    insuranceAboutClick() {
      this.selectTab("insurance_about");
      this.goToActionByPath("/insurance");
    },

    insuranceCollateralClick() {
      this.selectTab("insurance_collateral");
      // this.goToActionByPath('/insurance/collateral/optimism');
      this.goToActionByPath("/insurance/collateral/optimism");
      //
    },

    swapOdosClick() {
      this.selectTab("swap-odos");
      this.goToActionByPath("/swap", { tabName: "swap-odos" });

      try {
        this.trackClick({
          action: "click_menu_swap",
          event_category: "Click button",
          event_label: "Click swap menu button"
        });
      } catch (e) {
        console.error("Track error:", e);
      }
    },
    bridgeClick() {
      this.selectTab("bridge");
      this.goToActionByPath("/bridge", { tabName: "bridge" });

      try {
        this.trackClick({
          action: "click_menu_bridge",
          event_category: "Click button",
          event_label: "Click bridge menu button"
        });
      } catch (e) {
        console.error("Track error:", e);
      }

      this.checkIsNotified(true);
    },

    dashBoardClick() {
      this.selectTab("dashboard");
      this.goToActionByPath("/dashboard");
    },

    collateralClick() {
      this.selectTab("usdplus_collateral");
      this.goToActionByPath("/collateral");
    },

    daiCollateralClick() {
      this.selectTab("daiplus_collateral");
      this.goToActionByPath("/collateral/dai");
    },

    usdtCollateralClick() {
      this.selectTab("usdtplus_collateral");
      this.goToActionByPath("/collateral/usdt");
    },

    usdcCollateralClick() {
      this.selectTab("usdcplus_collateral");
      this.goToActionByPath("/collateral/usdc");
    },

    ethCollateralClick() {
      this.selectTab("ethplus_collateral");
      this.goToActionByPath("/collateral/eth");
    },

    usdPlusPoolsClick() {
      this.selectTab("pools");
      this.goToActionByPath("/pools");

      try {
        this.trackClick({
          action: "click_menu_pools",
          event_category: "Click button",
          event_label: "Click pools menu button"
        });
      } catch (e) {
        console.error("Track error:", e);
      }
    },

    statsClick() {
      this.selectTab("usdplus_performance");
      this.goToActionByPath("/stats");
    },

    daiStatsClick() {
      this.selectTab("daiplus_performance");
      this.goToActionByPath("/stats/dai");
    },

    usdtStatsClick() {
      console.log("usdtStatsClick");
      this.selectTab("usdtplus_performance");
      this.goToActionByPath("/stats/usdt");
    },

    usdcStatsClick() {
      console.log("usdcStatsClick");
      this.selectTab("usdcplus_performance");
      this.goToActionByPath("/stats/usdc");
    },

    ethStatsClick() {
      this.selectTab("ethplus_performance");
      this.goToActionByPath("/stats/eth");
    },

    aboutEtsClick() {
      this.selectTab("about");
      this.goToActionByPath("/ets_about");
    },

    toggleTheme(mode) {
      if (
        (mode === "light" && !this.light) ||
        (mode === "dark" && this.light)
      ) {
        this.switchTheme();
        /*this.trackClick({
                    action: 'toggle-theme',
                    event_category: 'Theme',
                    event_label: 'Switch theme',
                    value: 1
                });*/
      }
    }
  }
};

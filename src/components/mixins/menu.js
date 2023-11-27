

export const menu = {
    data() {
        return {
            isShowEts: false,
            isShowUsd: false,
            isShowDai: false,
            isShowUsdt: false,
            isShowEth: false,
            isShowInsurance: false,
        }
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
            this.selectTab('featured');
            this.goToActionByPath('/featured');
        },


        buyOvnClick() {
            this.selectTab('buy-ovn');
            this.goToActionByPath('/buy-ovn');
        },

        provideLpClick() {
            this.selectTab('provide-lp');
            this.goToActionByPath('/provide-lp');
        },

        insuranceClick() {
            this.selectTab('insurance');
            this.goToActionByPath('/insurance');
        },

        insuranceStatsClick() {
            this.selectTab('insurance_performance');
            this.goToActionByPath('/insurance/network/optimism');
            // this.trackClick({action: 'stats-click', event_category: 'View Page', event_label: 'Open dai stats page', value: 1 });
        },

        insuranceAboutClick() {
            this.selectTab('insurance_about');
            this.goToActionByPath('/insurance');
        },


        insuranceCollateralClick() {
            this.selectTab('insurance_collateral');
            // this.goToActionByPath('/insurance/collateral/optimism');
            this.goToActionByPath('/insurance/collateral/optimism');
            //
            // this.trackClick({action: 'dai-collateral-click', event_category: 'View Page', event_label: 'Open dai collateral page', value: 1 });
        },

        swapOdosClick() {
            this.selectTab('swap-odos');
            this.goToActionByPath('/swap', {tabName: 'swap-odos'});

            try {
                this.trackClick({action: 'click_menu_swap', event_category: 'Click button', event_label: 'Click swap menu button' });
            } catch (e) {
                console.error("Track error:", e);
            }
        },
        bridgeClick() {
            this.selectTab('bridge');
            this.goToActionByPath('/bridge', {tabName: 'bridge'});

            try {
                this.trackClick({action: 'click_menu_bridge', event_category: 'Click button', event_label: 'Click bridge menu button' });
            } catch (e) {
                console.error("Track error:", e);
            }

            this.checkIsNotified(true);
        },

        dashBoardClick() {
            this.selectTab('dashboard');
            this.goToActionByPath('/dashboard');
            // this.trackClick({action: 'dashboard-click', event_category: 'View Page', event_label: 'Open dashboard page', value: 1 });
        },

        collateralClick() {
            this.selectTab('usdplus_collateral');
            this.goToActionByPath('/collateral');
            // this.trackClick({action: 'collateral-click', event_category: 'View Page', event_label: 'Open collateral page', value: 1 });
        },

        daiCollateralClick() {
            this.selectTab('daiplus_collateral');
            this.goToActionByPath('/collateral/dai');
            // this.trackClick({action: 'dai-collateral-click', event_category: 'View Page', event_label: 'Open dai collateral page', value: 1 });
        },

        usdtCollateralClick() {
            this.selectTab('usdtplus_collateral');
            this.goToActionByPath('/collateral/usdt');
            // this.trackClick({action: 'usdt-collateral-click', event_category: 'View Page', event_label: 'Open usdt collateral page', value: 1 });
        },

        ethCollateralClick() {
            this.selectTab('ethplus_collateral');
            this.goToActionByPath('/collateral/eth');
            // this.trackClick({action: 'usdt-collateral-click', event_category: 'View Page', event_label: 'Open usdt collateral page', value: 1 });
        },

        usdPlusPoolsClick() {
            this.selectTab('pools');
            this.goToActionByPath('/pools');

            try {
                this.trackClick({action: 'click_menu_pools', event_category: 'Click button', event_label: 'Click pools menu button' });
            } catch (e) {
                console.error("Track error:", e);
            }
        },

        statsClick() {
            this.selectTab('usdplus_performance');
            this.goToActionByPath('/stats');
            // this.trackClick({action: 'stats-click', event_category: 'View Page', event_label: 'Open stats page', value: 1 });
        },

        daiStatsClick() {
            this.selectTab('daiplus_performance');
            this.goToActionByPath('/stats/dai');
            // this.trackClick({action: 'stats-click', event_category: 'View Page', event_label: 'Open dai stats page', value: 1 });
        },

        usdtStatsClick() {
            this.selectTab('usdtplus_performance');
            this.goToActionByPath('/stats/usdt');
            // this.trackClick({action: 'stats-click', event_category: 'View Page', event_label: 'Open usdt stats page', value: 1 });
        },

        ethStatsClick() {
            this.selectTab('ethplus_performance');
            this.goToActionByPath('/stats/eth');
            // this.trackClick({action: 'stats-click', event_category: 'View Page', event_label: 'Open usdt stats page', value: 1 });
        },

        aboutEtsClick() {
            this.selectTab('about');
            this.goToActionByPath('/ets_about');
        },


        toggleTheme(mode) {
            if ((mode === 'light' && !this.light) || (mode === 'dark' && this.light)) {
                this.switchTheme();
                /*this.trackClick({
                    action: 'toggle-theme',
                    event_category: 'Theme',
                    event_label: 'Switch theme',
                    value: 1
                });*/
            }
        },

    }
}

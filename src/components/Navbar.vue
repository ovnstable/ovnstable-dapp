<template>
    <v-navigation-drawer
            app
            permanent
            width="242"
            color="var(--secondary)"
    >
        <v-list class="mt-2">
            <v-list-item>
                <v-list-item-title>
                    <img :src="require('@/assets/logo.svg')" @click="openLinkToLanding('https://overnight.fi/')"
                         class="logo-img">
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-list nav subheader class="mx-3" dense>
            <v-list-item
                id="click_menu_swap"
                :class="selectedTab === 'swap-odos' ? 'selected-page-item' : ''"
                @click="swapOdosClick()"
                class="list-item-hover mx-n2">
                <v-list-item-icon>
                    <div class="navbar-page-link">
                        <svg width="24" height="24" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-bind:fill="changeIconColor" d="M14.4998 21.0001C12.6433 21.0001 10.8628 20.2626 9.55009 18.9498C8.23734 17.6371 7.49984 15.8566 7.49984 14.0001C7.49984 12.8334 7.7915 11.7017 8.3165 10.7334L6.61317 9.03008C5.66788 10.5154 5.16601 12.2395 5.1665 14.0001C5.1665 16.4754 6.14983 18.8494 7.90017 20.5997C9.65051 22.3501 12.0245 23.3334 14.4998 23.3334V26.8334L19.1665 22.1667L14.4998 17.5001M14.4998 4.66675V1.16675L9.83317 5.83342L14.4998 10.5001V7.00008C16.3564 7.00008 18.1368 7.73758 19.4496 9.05033C20.7623 10.3631 21.4998 12.1436 21.4998 14.0001C21.4998 15.1667 21.2082 16.2984 20.6832 17.2667L22.3865 18.9701C23.3318 17.4848 23.8337 15.7607 23.8332 14.0001C23.8332 11.5247 22.8498 9.15076 21.0995 7.40042C19.3492 5.65008 16.9752 4.66675 14.4998 4.66675V4.66675Z"/>
                        </svg>
                    </div>
                </v-list-item-icon>
                <v-list-item-title>
                    <label :class="selectedTab === 'swap-odos' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        SWAP
                    </label>
                </v-list-item-title>
            </v-list-item>

            <v-list-item
                v-if="networkName !== 'linea'"
                id="click_menu_swap"
                :class="selectedTab === 'swipe-odos' ? 'selected-page-item' : ''"
                @click="swipeOdosClick()"
                class="list-item-hover mx-n2">
                <v-list-item-icon>
                    <div class="navbar-page-link" style="padding-top: 3px;">
                        <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-bind:fill="changeIconColor" d="M0 0V14H12.04C11.7921 13.2471 11.6661 12.4594 11.6667 11.6667H4.66667C4.66667 11.0478 4.42083 10.4543 3.98325 10.0168C3.54566 9.57917 2.95217 9.33333 2.33333 9.33333V4.66667C3.62833 4.66667 4.66667 3.62833 4.66667 2.33333H16.3333C16.3333 2.95217 16.5792 3.54566 17.0168 3.98325C17.4543 4.42083 18.0478 4.66667 18.6667 4.66667V4.73667C19.4483 4.73667 20.23 4.87667 21 5.13333V0H0ZM10.5 3.5C8.51667 3.535 7 5.01667 7 7C7 8.98333 8.51667 10.43 10.5 10.5C10.9433 10.5 11.3983 10.4067 11.83 10.2317C12.145 8.94833 12.67 7.735 13.965 6.545C13.825 4.99333 12.355 3.465 10.5 3.5ZM21.735 7.315L17.22 11.865L15.645 10.2667L14 11.9233L17.2083 15.1667L23.3683 8.96L21.735 7.315Z"/>
                        </svg>
                    </div>
                </v-list-item-icon>
                <v-list-item-title>
                    <label :class="selectedTab === 'swipe-odos' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        SWIPE
                    </label>

<!--
                    <div v-if="isShowSwipeNotification" class="ping d-inline ml-4">
                        <div style=""></div>
                    </div>
-->

                </v-list-item-title>
            </v-list-item>
            <v-list-item
                id="click_bridge"
                :class="selectedTab === 'bridge' ? 'selected-page-item' : ''"
                @click="bridgeClick()"
                class="list-item-hover mx-n2">
                <v-list-item-icon>
                    <div class="navbar-page-link">
                        <v-img :src="require('@/assets/icon/shuffle-variant.svg')"/>
                    </div>
                </v-list-item-icon>
                <v-list-item-title>
                    <label :class="selectedTab === 'bridge' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        BRIDGE
                    </label>
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-list nav subheader class="mx-3" dense>

            <div class="navbar-list-divider mt-2 mb-1"></div>
            <label class="navbar-list-header">
                Money Markets
            </label>

            <v-list-group :append-icon="null"
                          @click="toggleUsdPlus(!isShowUsd)">
                <template v-slot:activator>
                    <v-list-item-icon class="mx-n2">
                        <div class="navbar-page-link">
                            <svg width="24" height="24" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path v-bind:fill="usdPlusIconColor" d="M15.4709 13.0182C13.5291 12.3745 12.5909 11.9709 12.5909 10.9455C12.5909 9.83273 13.8018 9.42909 14.5655 9.42909C15.9945 9.42909 16.5182 10.5091 16.6382 10.8909L18.3618 10.16C18.1982 9.66909 17.4673 8.06545 15.5909 7.71636V6.36364H13.4091V7.73818C10.7036 8.34909 10.6927 10.8582 10.6927 10.9673C10.6927 13.4436 13.1473 14.1418 14.3473 14.5782C16.0709 15.1891 16.8345 15.7455 16.8345 16.7927C16.8345 18.0255 15.6891 18.5491 14.6745 18.5491C12.6891 18.5491 12.1218 16.5091 12.0564 16.2691L10.2455 17C10.9327 19.3891 12.7327 20.0327 13.4091 20.2291V21.6364H15.5909V20.2836C16.0273 20.1855 18.7545 19.64 18.7545 16.7709C18.7545 15.2545 18.0891 13.9236 15.4709 13.0182ZM4.68182 23.8182H2.5V17.2727H9.04545V19.4545H6.34C8.09636 22.0836 11.0964 23.8182 14.5 23.8182C17.1039 23.8182 19.6012 22.7838 21.4425 20.9425C23.2838 19.1012 24.3182 16.6039 24.3182 14H26.5C26.5 20.6327 21.1327 26 14.5 26C10.4418 26 6.85273 23.9818 4.68182 20.9055V23.8182ZM2.5 14C2.5 7.36727 7.86727 2 14.5 2C18.5582 2 22.1473 4.01818 24.3182 7.09455V4.18182H26.5V10.7273H19.9545V8.54545H22.66C20.9036 5.91636 17.9036 4.18182 14.5 4.18182C11.8961 4.18182 9.39876 5.21623 7.5575 7.0575C5.71623 8.89876 4.68182 11.3961 4.68182 14H2.5Z" />
                            </svg>
                        </div>
                    </v-list-item-icon>
                    <v-list-item-title>
                        <label :class="selectedTab.startsWith('usdplus_') ? 'selected-page' : ''"
                               class="navbar-page-label" >
                            USD+
                        </label>
                    </v-list-item-title>
                    <div class="select-bar-main-container mr-15" >
                        <v-row>
                            <v-icon color="var(--secondary-gray-text)" >
                                {{ isShowUsd ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                            </v-icon>
                        </v-row>
                    </div>
                </template>

                <v-list-item @click="statsClick" :class="selectedTab === 'usdplus_performance' ? 'selected-page-item' : ''"
                             class="list-item-hover">
                    <v-list-item-title>
                        <label :class="selectedTab === 'usdplus_performance' ? 'selected-page' : ''"
                               class="navbar-list-label mx-5">
                            Performance
                        </label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item :class="selectedTab === 'usdplus_collateral' ? 'selected-page-item' : ''"
                             @click="collateralClick"
                             class="list-item-hover ">
                    <v-list-item-title>
                        <label :class="selectedTab === 'usdplus_collateral' ? 'selected-page' : ''"
                               class="navbar-list-label mx-5">
                            Collateral
                        </label>
                    </v-list-item-title>
                </v-list-item>
            </v-list-group>

            <v-list-group :append-icon="null"
                        @click="toggleDaiPlus(!isShowDai)">
                <template v-slot:activator>
                    <v-list-item-icon class="mx-n2">
                        <div class="navbar-page-link">
                            <svg width="24" height="24" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path v-bind:fill="daiPlusIconColor" d="M4.68182 23.8182H2.5V17.2727H9.04545V19.4545H6.34C8.09636 22.0836 11.0964 23.8182 14.5 23.8182C17.1039 23.8182 19.6012 22.7838 21.4425 20.9425C23.2838 19.1012 24.3182 16.6039 24.3182 14H26.5C26.5 20.6327 21.1327 26 14.5 26C10.4418 26 6.85273 23.9818 4.68182 20.9055V23.8182ZM2.5 14C2.5 7.36727 7.86727 2 14.5 2C18.5582 2 22.1473 4.01818 24.3182 7.09455V4.18182H26.5V10.7273H19.9545V8.54545H22.66C20.9036 5.91636 17.9036 4.18182 14.5 4.18182C11.8961 4.18182 9.39876 5.21623 7.5575 7.0575C5.71623 8.89876 4.68182 11.3961 4.68182 14H2.5Z"/>
                                <path v-bind:fill="daiPlusIconColor" d="M14.5664 20H10.5V8H14.6484C15.8398 8 16.8633 8.24023 17.7188 8.7207C18.5781 9.19727 19.2383 9.88281 19.6992 10.7773C20.1602 11.6719 20.3906 12.7422 20.3906 13.9883C20.3906 15.2383 20.1582 16.3125 19.6934 17.2109C19.2324 18.1094 18.5664 18.7988 17.6953 19.2793C16.8281 19.7598 15.7852 20 14.5664 20ZM12.6738 18.1191H14.4609C15.2969 18.1191 15.9941 17.9668 16.5527 17.6621C17.1113 17.3535 17.5313 16.8945 17.8125 16.2852C18.0938 15.6719 18.2344 14.9063 18.2344 13.9883C18.2344 13.0703 18.0938 12.3086 17.8125 11.7031C17.5313 11.0938 17.1152 10.6387 16.5645 10.3379C16.0176 10.0332 15.3379 9.88086 14.5254 9.88086H12.6738V18.1191Z"/>
                            </svg>
                        </div>
                     </v-list-item-icon>
                    <v-list-item-title>
                        <label :class="selectedTab.startsWith('daiplus_') ? 'selected-page' : ''"
                            class="navbar-page-label" >
                        DAI+
                        </label>
                    </v-list-item-title>
                    <div class="select-bar-main-container mr-15" >
                        <v-row>
                            <v-icon color="var(--secondary-gray-text)" >
                                {{ isShowDai ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                             </v-icon>
                        </v-row>
                    </div>
                </template>

                <v-list-item @click="daiStatsClick" :class="selectedTab === 'daiplus_performance' ? 'selected-page-item' : ''"
                             class="list-item-hover">
                     <v-list-item-title>
                        <label :class="selectedTab === 'daiplus_performance' ? 'selected-page' : ''"
                            class="navbar-list-label mx-5">
                         Performance
                         </label>
                     </v-list-item-title>
                </v-list-item>

                <v-list-item :class="selectedTab === 'daiplus_collateral' ? 'selected-page-item' : ''"
                             @click="daiCollateralClick"
                             class="list-item-hover ">
                    <v-list-item-title>
                        <label :class="selectedTab === 'daiplus_collateral' ? 'selected-page' : ''"
                                class="navbar-list-label mx-5">
                            Collateral
                        </label>
                    </v-list-item-title>
                 </v-list-item>
            </v-list-group>

            <v-list-group :append-icon="null"
                          @click="toggleUsdtPlus(!isShowUsdt)">
                <template v-slot:activator>
                    <v-list-item-icon class="mx-n2">
                        <div class="navbar-page-link">
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path v-bind:fill="usdtPlusIconColor" d="M2.98715 17.0129H1.42871V12.3376H6.10404V13.896H4.17157C5.42611 15.7739 7.56897 17.0129 10.0001 17.0129C11.8601 17.0129 13.6439 16.274 14.9591 14.9588C16.2743 13.6436 17.0131 11.8599 17.0131 9.9999H18.5716C18.5716 14.7376 14.7378 18.5713 10.0001 18.5713C7.10144 18.5713 4.5378 17.1298 2.98715 14.9324V17.0129ZM1.42871 9.9999C1.42871 5.26223 5.26248 1.42847 10.0001 1.42847C12.8988 1.42847 15.4625 2.87003 17.0131 5.06743V2.98691H18.5716V7.66223H13.8962V6.10379H15.8287C14.5742 4.22587 12.4313 2.98691 10.0001 2.98691C8.14018 2.98691 6.3564 3.72577 5.04121 5.04097C3.72602 6.35616 2.98715 8.13994 2.98715 9.9999H1.42871Z"/>
                                <path v-bind:fill="usdtPlusIconColor" d="M10.8243 14.9999V8.11763H13.1603V6.42847H6.42871V8.11763H8.76466V14.9999H10.8243Z"/>
                            </svg>
                        </div>
                    </v-list-item-icon>
                    <v-list-item-title>
                        <label :class="selectedTab.startsWith('usdtplus_') ? 'selected-page' : ''"
                               class="navbar-page-label" >
                            USDT+
                        </label>
                    </v-list-item-title>
                    <div class="select-bar-main-container mr-15" >
                        <v-row>
                            <v-icon color="var(--secondary-gray-text)" >
                                {{ isShowUsdt ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                            </v-icon>
                        </v-row>
                    </div>
                </template>

                <v-list-item @click="usdtStatsClick" :class="selectedTab === 'usdtplus_performance' ? 'selected-page-item' : ''"
                             class="list-item-hover">
                    <v-list-item-title>
                        <label :class="selectedTab === 'usdtplus_performance' ? 'selected-page' : ''"
                               class="navbar-list-label mx-5">
                            Performance
                        </label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item :class="selectedTab === 'usdtplus_collateral' ? 'selected-page-item' : ''"
                             @click="usdtCollateralClick"
                             class="list-item-hover ">
                    <v-list-item-title>
                        <label :class="selectedTab === 'usdtplus_collateral' ? 'selected-page' : ''"
                               class="navbar-list-label mx-5">
                            Collateral
                        </label>
                    </v-list-item-title>
                </v-list-item>
            </v-list-group>

            <div class="navbar-list-divider mt-3 mb-1"></div>
            <label class="navbar-list-header">
                OVN TOKEN
            </label>

<!--            <v-list-item :class="selectedTab === 'buy-ovn' ? 'selected-page-item' : ''"
                         @click="buyOvnClick"
                         class="list-item-hover mx-n2">
                <v-list-item-icon>
                    <img :src="require('@/assets/icon/menu/buy-ovn.svg')"
                         class="navbar-page-link">
                </v-list-item-icon>
                <v-list-item-title>
                    <label :class="selectedTab === 'buy-ovn' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        BUY OVN
                    </label>
                </v-list-item-title>
            </v-list-item>-->

            <v-list-item :class="selectedTab === 'provide-lp' ? 'selected-page-item' : ''"
                         @click="provideLpClick"
                         class="list-item-hover mx-n2">
                <v-list-item-icon>
                    <img :src="require('@/assets/icon/menu/provide-lp.svg')"
                         class="navbar-page-link">
                </v-list-item-icon>
                <v-list-item-title>
                    <label :class="selectedTab === 'provide-lp' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        PROVIDE LP
                    </label>
                </v-list-item-title>
            </v-list-item>

            <v-list-group :append-icon="null"
                          @click="toggleInsurance(!isShowInsurance)">
                <template v-slot:activator>
                    <v-list-item-icon class="mx-n2">
                        <div class="navbar-page-link">
                            <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path v-bind:fill="insuranceIconColor" d="M24.1364 12.9091C24.1364 18.9636 19.9473 24.6255 14.3182 26C8.68909 24.6255 4.5 18.9636 4.5 12.9091V6.36364L14.3182 2L24.1364 6.36364V12.9091ZM14.3182 23.8182C18.4091 22.7273 21.9545 17.8618 21.9545 13.1491V7.78182L14.3182 4.37818V23.8182Z"/>
                            </svg>
                        </div>
                    </v-list-item-icon>
                    <v-list-item-title>
                        <label :class="selectedTab.startsWith('insurance_') ? 'selected-page' : ''"
                               class="navbar-page-label" style="font-size: 14px">
                            INSURANCE
                        </label>
                    </v-list-item-title>
                    <div class="select-bar-main-container mr-15" >
                        <v-row>
                            <v-icon color="var(--secondary-gray-text)" >
                                {{ isShowInsurance ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                            </v-icon>
                        </v-row>
                    </div>
                </template>

                <v-list-item @click="insuranceAboutClick" :class="selectedTab === 'insurance_about' ? 'selected-page-item' : ''"
                             class="list-item-hover">
                    <v-list-item-title>
                        <label :class="selectedTab === 'insurance_about' ? 'selected-page' : ''"
                               class="navbar-list-label mx-5">
                            About
                        </label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item @click="insuranceStatsClick" :class="selectedTab === 'insurance_performance' ? 'selected-page-item' : ''"
                             class="list-item-hover">
                    <v-list-item-title>
                        <label :class="selectedTab === 'insurance_performance' ? 'selected-page' : ''"
                               class="navbar-list-label mx-5">
                            Performance
                        </label>
                    </v-list-item-title>
                </v-list-item>

<!--                <v-list-item :class="selectedTab === 'insurance_collateral' ? 'selected-page-item' : ''"
                             @click="insuranceCollateralClick"
                             class="list-item-hover ">
                    <v-list-item-title>
                        <label :class="selectedTab === 'insurance_collateral' ? 'selected-page' : ''"
                               class="navbar-list-label mx-5">
                            Collateral
                        </label>
                    </v-list-item-title>
                </v-list-item>-->
            </v-list-group>


            <div class="navbar-list-divider mt-3 mb-1"></div>
            <label class="navbar-list-header">
                Yield Farming
            </label>

            <v-list-item :class="selectedTab === 'featured' ? 'selected-page-item' : ''"
                         @click="featuredClick"
                         class="list-item-hover mx-n2">
                <v-list-item-icon>
                    <img :src="require('@/assets/icon/menu/featured.svg')"
                         class="navbar-page-link">
                </v-list-item-icon>
                <v-list-item-title>
                    <label :class="selectedTab === 'featured' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        FEATURED
                    </label>
                </v-list-item-title>
            </v-list-item>

            <v-list-item :class="selectedTab === 'pools' ? 'selected-page-item' : ''"
                         @click="usdPlusPoolsClick"
                         class="list-item-hover mx-n2">
                <v-list-item-icon>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#ADB3BD" d="M12.5002 3.33325C14.2683 3.33325 15.964 4.03563 17.2142 5.28587C18.4645 6.53612 19.1668 8.23181 19.1668 9.99992C19.1668 11.768 18.4645 13.4637 17.2142 14.714C15.964 15.9642 14.2683 16.6666 12.5002 16.6666C10.7321 16.6666 9.03636 15.9642 7.78612 14.714C6.53587 13.4637 5.8335 11.768 5.8335 9.99992C5.8335 8.23181 6.53587 6.53612 7.78612 5.28587C9.03636 4.03563 10.7321 3.33325 12.5002 3.33325ZM12.5002 14.9999C13.8262 14.9999 15.098 14.4731 16.0357 13.5355C16.9734 12.5978 17.5002 11.326 17.5002 9.99992C17.5002 8.67384 16.9734 7.40207 16.0357 6.46439C15.098 5.5267 13.8262 4.99992 12.5002 4.99992C11.1741 4.99992 9.90231 5.5267 8.96463 6.46439C8.02695 7.40207 7.50016 8.67384 7.50016 9.99992C7.50016 11.326 8.02695 12.5978 8.96463 13.5355C9.90231 14.4731 11.1741 14.9999 12.5002 14.9999ZM2.50016 9.99992C2.50012 11.0332 2.82075 12.041 3.4178 12.8844C4.01485 13.7277 4.8589 14.365 5.8335 14.7083V16.4499C2.9585 15.7083 0.833496 13.1083 0.833496 9.99992C0.833496 6.89159 2.9585 4.29159 5.8335 3.54992V5.29159C3.89183 5.97492 2.50016 7.82492 2.50016 9.99992Z"/>
                    </svg>
                </v-list-item-icon>
                <v-list-item-title>
                    <label :class="selectedTab === 'pools' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        ALL POOLS
                    </label>
                </v-list-item-title>
            </v-list-item>

        </v-list>

        <v-list nav subheader class="mx-3 my-n1" dense>
            <div class="navbar-list-divider"></div>
            <v-list-item  :class="selectedTab === 'dashboard' ? 'selected-page-item' : ''"
                          @click="dashBoardClick"
                          class="list-item-hover mx-n2 mt-2">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/avatar.svg')">
                </v-list-item-icon>
                <v-list-item-title>
                    <label :class="selectedTab === 'dashboard' ? 'selected-page' : ''"
                           class="navbar-page-label" >
                        My Dashboard
                    </label>
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <template v-slot:append>
            <v-list nav dense class="footer-list">
                <div class="ma-2">
                    <v-list-item-title>
                        <v-btn-toggle class="theme-toggle-group" v-model="light">
                            <v-btn outlined :class="light ? 'theme-toggle-btn-selected' : 'theme-toggle-btn'" icon @click="toggleTheme('light')" :value="true">
                                <v-icon :class="light ? 'theme-icon-selected' : 'theme-icon'">mdi-white-balance-sunny</v-icon>
                            </v-btn>
                            <v-btn outlined :class="!light ? 'theme-toggle-btn-selected' : 'theme-toggle-btn'" icon @click="toggleTheme('dark')" :value="false">
                                <v-icon :class="!light ? 'theme-icon-selected' : 'theme-icon'">mdi-moon-waxing-crescent</v-icon>
                            </v-btn>
                        </v-btn-toggle>
                    </v-list-item-title>
                </div>

                <v-list-item link class="mb-0">
                    <v-list-item-title @click="openLink('https://docs.overnight.fi/')">
                        <label class="footer-item-label">Docs</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item link class="mb-0">
                    <v-list-item-title @click="openLink('https://docs.overnight.fi/advanced/terms-of-service')">
                        <label class="footer-item-label">Terms of Service</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item link class="mb-0">
                    <v-list-item-title @click="openLink('https://discord.com/channels/933003627444969552/967813123149033542/967813482684760135/')">
                        <label class="footer-item-label">Help center in Discord</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item link>
                    <v-list-item-title @click="aboutEtsClick()">
                        <label class="footer-item-label">ETS</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item>
                    <img class="footer-social-link ml-n3" :src="require('@/assets/social/twitterSocial.svg')" @click="openLink('https://twitter.com/overnight_fi')">
                    <img class="footer-social-link" :src="require('@/assets/social/discordSocial.svg')" @click="openLink('https://discord.gg/overnight-fi')">
                    <img class="footer-social-link zealy ml-3" :src="require('@/assets/social/zealySocial.svg')" @click="openLink('https://zealy.io/c/overnight-fi/questboard')">
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>
<script>

import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
    name: 'Navbar',

    components: {
    },

    data: () => ({
        isShowUsd: false,
        isShowDai: false,
        isShowUsdt: false,
        isShowInsurance: false,
        isShowEts: false,

        iconColor: null,

        isShowSwipeNotification: false
    }),
    mounted() {
        this.checkIsNotified();
    },

    computed: {
        ...mapGetters('network', ['networkId', 'networkName']),
        ...mapGetters('menuUI', ['selectedTab']),
        ...mapGetters('theme', ['light']),

        changeIconColor: function() {
            if (this.light) {
                return this.iconColor ? '#000000' : '#ADB3BD';
            }

            return this.iconColor ? '#FFFFFF' : '#ADB3BD';
        },


        usdPlusIconColor: function() {
            if (this.light) {
                return this.isShowUsd ? '#000000' : '#ADB3BD';
            }

            return this.isShowUsd ? '#FFFFFF' : '#ADB3BD';
        },

        daiPlusIconColor: function() {
            if (this.light) {
                return this.isShowDai ? '#000000' : '#ADB3BD';
            }

            return this.isShowDai ? '#FFFFFF' : '#ADB3BD';
        },

        usdtPlusIconColor: function() {
            if (this.light) {
                return this.isShowUsdt ? '#000000' : '#ADB3BD';
            }

            return this.isShowUsdt ? '#FFFFFF' : '#ADB3BD';
        },


        insuranceIconColor: function() {
            if (this.light) {
                return this.isShowInsurance ? '#000000' : '#ADB3BD';
            }

            return this.isShowInsurance ? '#FFFFFF' : '#ADB3BD';
        },

        etsIconColor: function() {
            if (this.light) {
                return this.isShowEts ? '#000000' : '#ADB3BD';
            }

            return this.isShowEts ? '#FFFFFF' : '#ADB3BD';
        },

    },

    methods: {
        ...mapActions('menuUI', ['selectTab']),
        ...mapActions('theme', ['switchTheme']),
        ...mapActions('track', ['trackClick']),

        checkIsNotified(subscribe) {
            let a = true;
            if (a) {
                return;
            }

            let lastNotify = localStorage.getItem('lastNotify');

            if (!lastNotify || lastNotify === 'null' || lastNotify === 'undefined') {
                localStorage.setItem('lastNotify', '2');
                this.isShowSwipeNotification = true;
                return;
            }

            lastNotify = lastNotify * 1;
            if (lastNotify <= 0) {
                localStorage.setItem('lastNotify', '0');
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
            let lastNotify = localStorage.getItem('lastNotify');
            if (!lastNotify || lastNotify === 'null' || lastNotify === 'undefined') {
                localStorage.setItem('lastNotify', '2');
                this.isShowSwipeNotification = true;
                return;
            }

            lastNotify = lastNotify - 1;
            localStorage.setItem('lastNotify', (lastNotify + ""));
            this.isShowSwipeNotification = true;
        },

        openLink(url, isNotBlank) {
            window.open(url, isNotBlank ? '_self' : '_blank').focus();
        },

        openLinkToLanding(url) {
            window.open(url, '_self').focus();
        },

        goToActionByPath(path) {
              this.$router.push({
                  path: path
              });
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
            this.goToActionByPath('/insurance/collateral');
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
        swipeOdosClick() {
            this.selectTab('swipe-odos');
            this.goToActionByPath('/swipe', {tabName: 'swipe-odos'});

            try {
                this.trackClick({action: 'click_menu_swipe', event_category: 'Click button', event_label: 'Click swipe menu button' });
            } catch (e) {
                console.error("Track error:", e);
            }

            this.checkIsNotified(true);
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

        aboutEtsClick() {
            this.selectTab('about');
            this.goToActionByPath('/ets_about');
        },

        wrapClick() {
            this.showWrapView();
            this.showWrapModal();
            // this.trackClick({action: 'wrap-click', event_category: 'Wrap', event_label: 'Open wrap modal', value: 1 });
        },

        toggleTheme(mode) {
            if ((mode === 'light' && !this.light) || (mode === 'dark' && this.light)) {
                this.switchTheme();
                // this.trackClick({action: 'toggle-theme', event_category: 'Theme', event_label: 'Switch theme', value: 1 });
            }
        },

        redemptionRequestAction() {
            this.showRedemptionRequestModal();
        },

        toggleUsdPlus(isShow) {
            if (isShow) {
                this.toggleEts(false);
                this.toggleDaiPlus(false);
                this.toggleUsdtPlus(false);
                this.toggleInsurance(false);
            }

            this.isShowUsd = isShow;
        },

        toggleDaiPlus(isShow) {
            if (isShow) {
                this.toggleEts(false);
                this.toggleUsdPlus(false);
                this.toggleUsdtPlus(false);
                this.toggleInsurance(false);
            }

            this.isShowDai = isShow;
        },

        toggleUsdtPlus(isShow) {
            if (isShow) {
                this.toggleEts(false);
                this.toggleUsdPlus(false);
                this.toggleDaiPlus(false);
                this.toggleInsurance(false);
            }

            this.isShowUsdt = isShow;
        },

        toggleInsurance(isShow) {
            if (isShow) {
                this.toggleEts(false);
                this.toggleUsdPlus(false);
                this.toggleUsdtPlus(false);
                this.toggleDaiPlus(false);
            }

            this.isShowInsurance = isShow;
        },

        toggleEts(isShow) {
            if (isShow) {
                this.toggleUsdPlus(false);
                this.toggleDaiPlus(false);
                this.toggleUsdtPlus(false);
                this.toggleInsurance(false);
            }

            this.isShowEts = isShow;
        },
    }
}
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

.footer-social-link {
    cursor: pointer;
    height: 48px !important ;
}

.zealy {
    height: 24px !important;
}

.navbar-page-link {
    height: 24px !important;
    width: 24px !important;
}

.v-list-item__icon {
    margin-right: 11px !important;
}

.footer-item-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'liga' off;
    color: var(--third-gray-text);
    cursor: pointer;
}

.navbar-page-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em !important;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.list-item-hover:hover {
    background: var(--hover) !important;
}

.list-item-hover:active {
    background: var(--active) !important;
}

.navbar-list-header {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.02em !important;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
    text-transform: uppercase;
}

.navbar-list-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.05em;
    color: var(--main-gray-text);
    cursor: pointer;
}

.navbar-page-label-modal {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--links-blue);
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

.theme-toggle-group {
    background-color: transparent !important;
    border-radius: 4px !important;
    border: 1px solid var(--theme-toggle-border) !important;
}

.theme-toggle-btn, .theme-toggle-btn-selected {
    border: none !important;
}

.theme-toggle-btn {
    background-color: transparent !important;
}

.theme-toggle-btn-selected {
    background-color: var(--theme-switch-background) !important;
}

.theme-icon {
    color: var(--theme-icon-color) !important;
}

.theme-icon-selected {
    color: var(--theme-icon-color-selected) !important;
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
    content: '';
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
</style>

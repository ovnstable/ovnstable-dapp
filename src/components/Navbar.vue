<template>
    <v-navigation-drawer
        app
        permanent
        width="242"
        color="var(--secondary)"
    >
        <div class="mt-2">
            <v-list-item>
                <v-list-item-title>
                    <router-link to="/swap">
                        <img :src="require('@/assets/logo.svg')" class="logo-img" />
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
                    <svg
                        style="margin-top: 2px"
                        width="22"
                        height="22"
                        viewBox="0 0 29 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            v-bind:fill="changeIconColor"
                            d="M14.4998 21.0001C12.6433 21.0001 10.8628 20.2626 9.55009 18.9498C8.23734 17.6371 7.49984 15.8566 7.49984 14.0001C7.49984 12.8334 7.7915 11.7017 8.3165 10.7334L6.61317 9.03008C5.66788 10.5154 5.16601 12.2395 5.1665 14.0001C5.1665 16.4754 6.14983 18.8494 7.90017 20.5997C9.65051 22.3501 12.0245 23.3334 14.4998 23.3334V26.8334L19.1665 22.1667L14.4998 17.5001M14.4998 4.66675V1.16675L9.83317 5.83342L14.4998 10.5001V7.00008C16.3564 7.00008 18.1368 7.73758 19.4496 9.05033C20.7623 10.3631 21.4998 12.1436 21.4998 14.0001C21.4998 15.1667 21.2082 16.2984 20.6832 17.2667L22.3865 18.9701C23.3318 17.4848 23.8337 15.7607 23.8332 14.0001C23.8332 11.5247 22.8498 9.15076 21.0995 7.40042C19.3492 5.65008 16.9752 4.66675 14.4998 4.66675V4.66675Z"/>
                    </svg>
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
                        <svg
                            style="margin-top: 2px"
                            width="22"
                            height="22"
                            viewBox="0 0 28 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                v-bind:fill="changeIconColor"
                                d="M19.8333 3.5L25.9583 8.75L19.8333 14L25.9583 19.25L19.8333 24.5V21H16.6366L13.3466 17.71L15.8199 15.2367L18.0833 17.5H19.8333V10.5H18.0833L7.58325 21H2.33325V17.5H6.13659L16.6366 7H19.8333V3.5ZM2.33325 7H7.58325L10.8733 10.29L8.39992 12.7633L6.13659 10.5H2.33325V7Z"/>
                        </svg>
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
            <label class="navbar-list-header pl-2">
                Money Markets
            </label>

            <template>
                <div
                    @click="toggleUsdPlus(!isShowUsd)"
                    class="single-item pa-1 list-item-hover mb-1"
                >
                    <div class="navbar-page-link pl-1">
                        <svg
                            width="22"
                            height="24"
                            viewBox="0 0 29 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                v-bind:fill="usdPlusIconColor"
                                d="M15.4709 13.0182C13.5291 12.3745 12.5909 11.9709 12.5909 10.9455C12.5909 9.83273 13.8018 9.42909 14.5655 9.42909C15.9945 9.42909 16.5182 10.5091 16.6382 10.8909L18.3618 10.16C18.1982 9.66909 17.4673 8.06545 15.5909 7.71636V6.36364H13.4091V7.73818C10.7036 8.34909 10.6927 10.8582 10.6927 10.9673C10.6927 13.4436 13.1473 14.1418 14.3473 14.5782C16.0709 15.1891 16.8345 15.7455 16.8345 16.7927C16.8345 18.0255 15.6891 18.5491 14.6745 18.5491C12.6891 18.5491 12.1218 16.5091 12.0564 16.2691L10.2455 17C10.9327 19.3891 12.7327 20.0327 13.4091 20.2291V21.6364H15.5909V20.2836C16.0273 20.1855 18.7545 19.64 18.7545 16.7709C18.7545 15.2545 18.0891 13.9236 15.4709 13.0182ZM4.68182 23.8182H2.5V17.2727H9.04545V19.4545H6.34C8.09636 22.0836 11.0964 23.8182 14.5 23.8182C17.1039 23.8182 19.6012 22.7838 21.4425 20.9425C23.2838 19.1012 24.3182 16.6039 24.3182 14H26.5C26.5 20.6327 21.1327 26 14.5 26C10.4418 26 6.85273 23.9818 4.68182 20.9055V23.8182ZM2.5 14C2.5 7.36727 7.86727 2 14.5 2C18.5582 2 22.1473 4.01818 24.3182 7.09455V4.18182H26.5V10.7273H19.9545V8.54545H22.66C20.9036 5.91636 17.9036 4.18182 14.5 4.18182C11.8961 4.18182 9.39876 5.21623 7.5575 7.0575C5.71623 8.89876 4.68182 11.3961 4.68182 14H2.5Z" />
                        </svg>
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
                            class = "arrow"
                            :src="light ? (isShowUsd ? require('@/assets/icon/down_black.svg') : require('@/assets/icon/right_black.svg')) : (isShowUsd ? require('@/assets/icon/down_w.svg') : require('@/assets/icon/right_w.svg'))"
                            alt="right icon"
                        />
                    </div>
                </div>

                <div @click="statsClick"
                     v-show="isShowUsd"
                     :class="selectedTab === 'usdplus_performance' ? 'selected-page-item' : ''"
                     class="list-item-hover mb-1"
                >
                    <div
                        :class="selectedTab === 'usdplus_performance' ? 'selected-page' : ''"
                        class="navbar-list-label pa-1 pl-11"
                    >
                        Performance
                    </div>
                </div>

                <div
                    @click="collateralClick"
                    v-show="isShowUsd"
                    :class="selectedTab === 'usdplus_collateral' ? 'selected-page-item' : ''"
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
                        <svg
                            width="22"
                            height="24"
                            viewBox="0 0 29 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                v-bind:fill="daiPlusIconColor"
                                d="M4.68182 23.8182H2.5V17.2727H9.04545V19.4545H6.34C8.09636 22.0836 11.0964 23.8182 14.5 23.8182C17.1039 23.8182 19.6012 22.7838 21.4425 20.9425C23.2838 19.1012 24.3182 16.6039 24.3182 14H26.5C26.5 20.6327 21.1327 26 14.5 26C10.4418 26 6.85273 23.9818 4.68182 20.9055V23.8182ZM2.5 14C2.5 7.36727 7.86727 2 14.5 2C18.5582 2 22.1473 4.01818 24.3182 7.09455V4.18182H26.5V10.7273H19.9545V8.54545H22.66C20.9036 5.91636 17.9036 4.18182 14.5 4.18182C11.8961 4.18182 9.39876 5.21623 7.5575 7.0575C5.71623 8.89876 4.68182 11.3961 4.68182 14H2.5Z"/>
                            <path
                                v-bind:fill="daiPlusIconColor"
                                d="M14.5664 20H10.5V8H14.6484C15.8398 8 16.8633 8.24023 17.7188 8.7207C18.5781 9.19727 19.2383 9.88281 19.6992 10.7773C20.1602 11.6719 20.3906 12.7422 20.3906 13.9883C20.3906 15.2383 20.1582 16.3125 19.6934 17.2109C19.2324 18.1094 18.5664 18.7988 17.6953 19.2793C16.8281 19.7598 15.7852 20 14.5664 20ZM12.6738 18.1191H14.4609C15.2969 18.1191 15.9941 17.9668 16.5527 17.6621C17.1113 17.3535 17.5313 16.8945 17.8125 16.2852C18.0938 15.6719 18.2344 14.9063 18.2344 13.9883C18.2344 13.0703 18.0938 12.3086 17.8125 11.7031C17.5313 11.0938 17.1152 10.6387 16.5645 10.3379C16.0176 10.0332 15.3379 9.88086 14.5254 9.88086H12.6738V18.1191Z"/>
                        </svg>
                    </div>
                    <div>
                        <label :class="selectedTab.startsWith('daiplus_') ? 'selected-page' : ''"
                               class="navbar-page-label pl-2">
                            DAI+&nbsp;
                        </label>
                    </div>
                    <div class="ml-16">
                        <img
                            class = "arrow"
                            :src="light ? (isShowDai ? require('@/assets/icon/down_black.svg') : require('@/assets/icon/right_black.svg')) : (isShowDai ? require('@/assets/icon/down_w.svg') : require('@/assets/icon/right_w.svg'))"
                            alt="right icon"
                        />
                    </div>
                </div>

                <div
                    @click="daiStatsClick"
                    v-show="isShowDai"
                    :class="selectedTab === 'daiplus_performance' ? 'selected-page-item' : ''"
                    class="list-item-hover mb-1"
                >
                    <div
                        :class="selectedTab === 'daiplus_performance' ? 'selected-page' : ''"
                        class="navbar-list-label pa-1 pl-11"
                    >
                        Performance
                    </div>
                </div>

                <div
                    @click="daiCollateralClick"
                    v-show="isShowDai"
                    :class="selectedTab === 'daiplus_collateral' ? 'selected-page-item' : ''"
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
                        <svg
                            width="22"
                            height="24"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                v-bind:fill="usdtPlusIconColor"
                                d="M2.98715 17.0129H1.42871V12.3376H6.10404V13.896H4.17157C5.42611 15.7739 7.56897 17.0129 10.0001 17.0129C11.8601 17.0129 13.6439 16.274 14.9591 14.9588C16.2743 13.6436 17.0131 11.8599 17.0131 9.9999H18.5716C18.5716 14.7376 14.7378 18.5713 10.0001 18.5713C7.10144 18.5713 4.5378 17.1298 2.98715 14.9324V17.0129ZM1.42871 9.9999C1.42871 5.26223 5.26248 1.42847 10.0001 1.42847C12.8988 1.42847 15.4625 2.87003 17.0131 5.06743V2.98691H18.5716V7.66223H13.8962V6.10379H15.8287C14.5742 4.22587 12.4313 2.98691 10.0001 2.98691C8.14018 2.98691 6.3564 3.72577 5.04121 5.04097C3.72602 6.35616 2.98715 8.13994 2.98715 9.9999H1.42871Z"/>
                            <path
                                v-bind:fill="usdtPlusIconColor"
                                d="M10.8243 14.9999V8.11763H13.1603V6.42847H6.42871V8.11763H8.76466V14.9999H10.8243Z"/>
                        </svg>
                    </div>
                    <div>
                        <label
                            :class="selectedTab.startsWith('usdtplus_') ? 'selected-page' : ''"
                            class="navbar-page-label pl-2"
                        >
                            USDT+
                        </label>
                    </div>
                    <div class="ml-14">
                        <img
                            class = "arrow"
                            :src="light ? (isShowUsdt ? require('@/assets/icon/down_black.svg') : require('@/assets/icon/right_black.svg')) : (isShowUsdt ? require('@/assets/icon/down_w.svg') : require('@/assets/icon/right_w.svg'))"
                            alt="right icon"
                        />
                    </div>
                </div>

                <div
                    @click="usdtStatsClick"
                    v-if="isShowUsdt"
                    :class="selectedTab === 'usdtplus_performance' ? 'selected-page-item' : ''"
                    class="list-item-hover mb-1"
                >
                    <div
                        :class="selectedTab === 'usdtplus_performance' ? 'selected-page' : ''"
                        class="navbar-list-label pa-1 pl-11"
                    >
                        Performance
                    </div>
                </div>

                <div
                    @click="usdtCollateralClick"
                    v-if="isShowUsdt"
                    :class="selectedTab === 'usdtplus_collateral' ? 'selected-page-item' : ''"
                    class="list-item-hover mb-1"
                >
                    <div
                        :class="selectedTab === 'usdtplus_collateral' ? 'selected-page' : ''"
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
                        <svg width="22" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.18206 23.8182H2.00024V17.2727H8.5457V19.4545H5.84024C7.59661 22.0836 10.5966 23.8182 14.0002 23.8182C16.6042 23.8182 19.1015 22.7838 20.9427 20.9425C22.784 19.1012 23.8184 16.6039 23.8184 14H26.0002C26.0002 20.6327 20.633 26 14.0002 26C9.94206 26 6.35297 23.9818 4.18206 20.9055V23.8182ZM2.00024 14C2.00024 7.36727 7.36752 2 14.0002 2C18.0584 2 21.6475 4.01818 23.8184 7.09455V4.18182H26.0002V10.7273H19.4548V8.54545H22.1602C20.4039 5.91636 17.4039 4.18182 14.0002 4.18182C11.3963 4.18182 8.89901 5.21623 7.05774 7.0575C5.21648 8.89876 4.18206 11.3961 4.18206 14H2.00024Z" fill="#ADB3BD"/>
                            <path d="M9 14.3962L13.7547 7L18.7736 14.3962L13.7547 21L9 14.3962Z" fill="#D9D9D9"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.25 20.3484L18.7736 14.3963L14.25 7.72998V20.3484Z" fill="#ADB3BD"/>
                        </svg>
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
                            class = "arrow"
                            :src="light ? (isShowEth ? require('@/assets/icon/down_black.svg') : require('@/assets/icon/right_black.svg')) : (isShowEth ? require('@/assets/icon/down_w.svg') : require('@/assets/icon/right_w.svg'))"
                            alt="right icon"
                        />
                    </div>
                </div>

                <div
                    @click="ethStatsClick"
                    v-if="isShowEth"
                    :class="selectedTab === 'ethplus_performance' ? 'selected-page-item' : ''"
                    class="list-item-hover mb-1"
                >
                    <div
                        :class="selectedTab === 'ethplus_performance' ? 'selected-page' : ''"
                        class="navbar-list-label pa-1 pl-11"
                    >
                        Performance
                    </div>
                </div>

                <div
                    @click="ethCollateralClick"
                    v-if="isShowEth"
                    :class="selectedTab === 'ethplus_collateral' ? 'selected-page-item' : ''"
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
            <label class="navbar-list-header pl-2">
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

            <div
                @click="provideLpClick"
                :class="selectedTab === 'provide-lp' ? 'selected-page-item' : ''"
                class="single-item pa-1 list-item-hover mb-1"
            >
                <div class="navbar-page-link pl-1">
                    <svg

                        width="23"
                        height="22"
                        viewBox="0 0 29 29"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            v-bind:fill="changeIconColor"
                            d="M21.4998 16.3535H23.8332V19.8535H27.3332V22.1868H23.8332V25.6868H21.4998V22.1868H17.9998V19.8535H21.4998V16.3535ZM14.4998 3.52014C19.6565 3.52014 23.8332 5.60847 23.8332 8.18681C23.8332 10.7651 19.6565 12.8535 14.4998 12.8535C9.34317 12.8535 5.1665 10.7651 5.1665 8.18681C5.1665 5.60847 9.34317 3.52014 14.4998 3.52014ZM5.1665 10.5201C5.1665 13.0985 9.34317 15.1868 14.4998 15.1868C19.6565 15.1868 23.8332 13.0985 23.8332 10.5201V14.1135L22.6665 14.0201C19.6448 14.0201 17.0665 15.9335 16.0865 18.6168L14.4998 18.6868C9.34317 18.6868 5.1665 16.5985 5.1665 14.0201V10.5201ZM5.1665 16.3535C5.1665 18.9318 9.34317 21.0201 14.4998 21.0201H15.6665C15.6665 22.2451 15.9815 23.4001 16.5415 24.4035L14.4998 24.5201C9.34317 24.5201 5.1665 22.4318 5.1665 19.8535V16.3535Z"/>
                    </svg>
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
                        <svg
                            width="22"
                            height="24"
                            viewBox="0 0 29 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                v-bind:fill="insuranceIconColor"
                                d="M24.1364 12.9091C24.1364 18.9636 19.9473 24.6255 14.3182 26C8.68909 24.6255 4.5 18.9636 4.5 12.9091V6.36364L14.3182 2L24.1364 6.36364V12.9091ZM14.3182 23.8182C18.4091 22.7273 21.9545 17.8618 21.9545 13.1491V7.78182L14.3182 4.37818V23.8182Z"/>
                        </svg>
                    </div>
                    <div
                        :class="selectedTab.startsWith('insurance_') ? 'selected-page' : ''"
                        class="navbar-page-label pl-2"
                    >
                        INSURANCE
                    </div>
                    <div class="ml-5" >
                        <img
                            class = "arrow"
                            :src="light ? (isShowInsurance ? require('@/assets/icon/down_black.svg') : require('@/assets/icon/right_black.svg')) : (isShowInsurance ? require('@/assets/icon/down_w.svg') : require('@/assets/icon/right_w.svg'))"
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
                    :class="selectedTab === 'insurance_performance' ? 'selected-page-item' : ''"
                    class="list-item-hover mb-1"
                >
                    <div
                        :class="selectedTab === 'insurance_performance' ? 'selected-page' : ''"
                        class="navbar-list-label pa-1 pl-11"
                    >
                        Performance
                    </div>
                </div>

                <div
                    @click="insuranceCollateralClick"
                    v-show="isShowInsurance"
                    :class="selectedTab === 'insurance_collateral' ? 'selected-page-item' : ''"
                    class="list-item-hover mb-1"
                >
                    <div
                        :class="selectedTab === 'insurance_collateral' ? 'selected-page' : ''"
                        class="navbar-list-label pa-1 pl-11"
                    >
                        Premiums
                    </div>
                </div>


<!--                <v-list-item @click="insuranceStatsClick" :class="selectedTab === 'insurance_performance' ? 'selected-page-item' : ''"-->
<!--                             class="list-item-hover">-->
<!--                    <v-list-item-title>-->
<!--                        <label :class="selectedTab === 'insurance_performance' ? 'selected-page' : ''"-->
<!--                               class="navbar-list-label mx-5">-->
<!--                            Performance-->
<!--                        </label>-->
<!--                    </v-list-item-title>-->
<!--                </v-list-item>-->

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
            </template>


            <div class="navbar-list-divider mt-1"></div>
            <label class="navbar-list-header pl-2">
                Yield Farming
            </label>

            <div
                @click="featuredClick"
                :class="selectedTab === 'featured' ? 'selected-page-item' : ''"
                class="single-item pa-1 list-item-hover mb-1"
            >
                <div>
                    <svg
                        style="margin-top: 1px"
                        width="22"
                        height="22"
                        viewBox="0 0 26 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            v-bind:fill="changeIconColor"
                            d="M14.4997 17.9549L10.113 20.6033L11.268 15.6099L7.39467 12.2499L12.5047 11.8183L14.4997 7.10492L16.4947 11.8183L21.6047 12.2499L17.7313 15.6099L18.8863 20.6033M26.1663 10.7799L17.778 10.0683L14.4997 2.33325L11.2213 10.0683L2.83301 10.7799L9.19134 16.2983L7.28967 24.4999L14.4997 20.1483L21.7097 24.4999L19.7963 16.2983L26.1663 10.7799Z" />
                    </svg>
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
                    <svg
                        width="22"
                        height="20"
                        viewBox="0 0 18 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style="margin-top: 1px"
                    >
                        <path
                            v-bind:fill="changeIconColor"
                            d="M12.5002 3.33325C14.2683 3.33325 15.964 4.03563 17.2142 5.28587C18.4645 6.53612 19.1668 8.23181 19.1668 9.99992C19.1668 11.768 18.4645 13.4637 17.2142 14.714C15.964 15.9642 14.2683 16.6666 12.5002 16.6666C10.7321 16.6666 9.03636 15.9642 7.78612 14.714C6.53587 13.4637 5.8335 11.768 5.8335 9.99992C5.8335 8.23181 6.53587 6.53612 7.78612 5.28587C9.03636 4.03563 10.7321 3.33325 12.5002 3.33325ZM12.5002 14.9999C13.8262 14.9999 15.098 14.4731 16.0357 13.5355C16.9734 12.5978 17.5002 11.326 17.5002 9.99992C17.5002 8.67384 16.9734 7.40207 16.0357 6.46439C15.098 5.5267 13.8262 4.99992 12.5002 4.99992C11.1741 4.99992 9.90231 5.5267 8.96463 6.46439C8.02695 7.40207 7.50016 8.67384 7.50016 9.99992C7.50016 11.326 8.02695 12.5978 8.96463 13.5355C9.90231 14.4731 11.1741 14.9999 12.5002 14.9999ZM2.50016 9.99992C2.50012 11.0332 2.82075 12.041 3.4178 12.8844C4.01485 13.7277 4.8589 14.365 5.8335 14.7083V16.4499C2.9585 15.7083 0.833496 13.1083 0.833496 9.99992C0.833496 6.89159 2.9585 4.29159 5.8335 3.54992V5.29159C3.89183 5.97492 2.50016 7.82492 2.50016 9.99992Z"/>
                    </svg>
                </div>
                <div
                    :class="selectedTab === 'pools' ? 'selected-page' : ''"
                    class="navbar-page-label pl-2"
                >
                    ALL POOLS
                </div>
            </div>
        </div>

        <div>
            <div class="navbar-list-divider mt-1 mb-1"></div>
            <div
                @click="dashBoardClick"
                :class="selectedTab === 'dashboard' ? 'selected-page-item' : ''"
                class="single-item pa-1 list-item-hover mb-1"
            >
                <div>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 20 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            v-bind:fill="changeIconColor"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M14 4.66669C11.4216 4.66669 9.33329 6.75502 9.33329 9.33335C9.33329 11.9117 11.4216 14 14 14C16.5783 14 18.6666 11.9117 18.6666 9.33335C18.6666 6.75502 16.5783 4.66669 14 4.66669ZM16.3333 9.33335C16.3333 8.05002 15.2833 7.00002 14 7.00002C12.7166 7.00002 11.6666 8.05002 11.6666 9.33335C11.6666 10.6167 12.7166 11.6667 14 11.6667C15.2833 11.6667 16.3333 10.6167 16.3333 9.33335ZM21 19.8334C20.7666 19.005 17.15 17.5 14 17.5C10.85 17.5 7.23329 19.005 6.99996 19.845V21H21V19.8334ZM4.66663 19.8334C4.66663 16.73 10.885 15.1667 14 15.1667C17.115 15.1667 23.3333 16.73 23.3333 19.8334V23.3334H4.66663V19.8334Z"/>
                    </svg>
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
                    @click="openLink('https://docs.overnight.fi/advanced/terms-of-service')"
                    class="pa-2 pl-2 footer-item-label list-item-hover mb-1 ml-1 mr-1"
                >
                    Terms of Service
                </div>

                <div
                    @click="openLink('https://discord.com/channels/933003627444969552/967813123149033542/967813482684760135/')"
                    class="pa-2 pl-2 footer-item-label list-item-hover mb-1 ml-1 mr-1"
                >
                    Help center in Discord
                </div>

                <div @click="aboutEtsClick()"
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
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19.9075 33.6004C28.8196 33.6004 33.6933 26.2143 33.6933 19.8094C33.6933 19.5997 33.689 19.3909 33.6796 19.1829C34.6279 18.4965 35.4463 17.6466 36.0965 16.673C35.2283 17.0591 34.2941 17.319 33.314 17.4362C34.3144 16.8361 35.0823 15.8868 35.4447 14.7553C34.4935 15.3197 33.453 15.7176 32.368 15.9318C31.4838 14.9896 30.2251 14.4004 28.8312 14.4004C26.1555 14.4004 23.9857 16.571 23.9857 19.2467C23.9857 19.6271 24.0283 19.997 24.1114 20.3519C20.0845 20.1492 16.5137 18.2205 14.1239 15.2877C13.6935 16.0274 13.4671 16.8681 13.4678 17.7239C13.4678 19.4055 14.3232 20.89 15.624 21.7586C14.8545 21.735 14.102 21.5271 13.4296 21.1523C13.4289 21.1727 13.4289 21.1925 13.4289 21.2142C13.4289 23.5616 15.099 25.5215 17.316 25.9656C16.8996 26.079 16.47 26.1364 16.0384 26.1361C15.7268 26.1361 15.423 26.1054 15.1278 26.0487C15.7447 27.9746 17.5333 29.3761 19.654 29.4152C17.9957 30.7155 15.9067 31.49 13.6362 31.49C13.25 31.4903 12.8641 31.4679 12.4805 31.4228C14.6248 32.7978 17.171 33.6001 19.9077 33.6001"
                            fill="#C5C9D1"
                        />
                    </svg>
                </div>

                <div
                    @click="openLink('https://discord.gg/overnight-fi')"
                    class="footer-social-link ml-2"
                >
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clip-path="url(#clip0_2522_149772)">
                            <path
                                d="M32.4069 16.0275C35.2503 20.2082 36.6546 24.9239 36.1297 30.3528C36.1275 30.3758 36.1155 30.3969 36.0966 30.4107C33.9433 31.9919 31.857 32.9514 29.8 33.5878C29.784 33.5927 29.7669 33.5924 29.751 33.587C29.7352 33.5817 29.7214 33.5715 29.7116 33.5579C29.2364 32.8967 28.8046 32.1996 28.4263 31.4675C28.4046 31.4244 28.4244 31.3725 28.4691 31.3555C29.1549 31.0971 29.807 30.7874 30.4342 30.4208C30.4836 30.3918 30.4868 30.321 30.4411 30.287C30.308 30.1882 30.1761 30.0844 30.0499 29.9805C30.0263 29.9613 29.9945 29.9575 29.9678 29.9704C25.8956 31.8509 21.4348 31.8509 17.3145 29.9704C17.2878 29.9585 17.256 29.9626 17.233 29.9814C17.1071 30.0853 16.975 30.1882 16.8431 30.287C16.7975 30.321 16.8012 30.3918 16.851 30.4208C17.4782 30.7805 18.1303 31.0971 18.8151 31.3568C18.8595 31.3738 18.8806 31.4244 18.8585 31.4675C18.4884 32.2005 18.0566 32.8976 17.5726 33.5588C17.5515 33.5856 17.5169 33.5979 17.4842 33.5878C15.4369 32.9514 13.3507 31.9919 11.1974 30.4107C11.1794 30.3969 11.1665 30.3748 11.1646 30.3519C10.7259 25.656 11.62 20.9012 14.884 16.0265C14.8918 16.0136 14.9038 16.0035 14.9176 15.9976C16.5237 15.2605 18.2442 14.7182 20.0425 14.4086C20.0752 14.4035 20.108 14.4186 20.125 14.4476C20.3472 14.841 20.6011 15.3455 20.773 15.7578C22.6685 15.4682 24.5937 15.4682 26.5289 15.7578C26.7007 15.3543 26.9459 14.841 27.1671 14.4476C27.175 14.4332 27.1872 14.4217 27.202 14.4147C27.2168 14.4077 27.2335 14.4055 27.2496 14.4086C29.0488 14.7192 30.7694 15.2614 32.3741 15.9976C32.3883 16.0035 32.3999 16.0136 32.4069 16.0275ZM21.7366 24.956C21.7565 23.5678 20.7443 22.4191 19.4738 22.4191C18.2137 22.4191 17.2113 23.5577 17.2113 24.956C17.2113 26.354 18.2335 27.4926 19.4738 27.4926C20.7343 27.4926 21.7366 26.354 21.7366 24.956ZM30.1025 24.956C30.1223 23.5678 29.1102 22.4191 27.84 22.4191C26.5795 22.4191 25.5772 23.5577 25.5772 24.956C25.5772 26.354 26.5994 27.4926 27.84 27.4926C29.1102 27.4926 30.1025 26.354 30.1025 24.956Z"
                                fill="#C5C9D1"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_2522_149772">
                                <rect
                                    width="26.2582"
                                    height="19.2"
                                    fill="white"
                                    transform="translate(10.5605 14.4004)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                </div>

                <div
                    @click="openLink('https://zealy.io/c/overnight-fi/questboard')"
                    class="footer-social-link zealy ml-5"
                >
                    <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clip-path="url(#clip0_10203_69315)">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M1.92005 2.64057L1.01548 2.59267L1.01139 3.50621L1.01093 3.69664C1.01066 3.84498 1.0103 4.10107 1.00994 4.53253C1.00922 5.39538 1.0085 6.96015 1.0085 9.76807V10.1288L2.08029 11.2097C1.65591 11.479 1.22953 11.7452 0.801183 12.0082L0.387143 12.2626L0.383789 18.2846L5.3275 23.2737L5.65205 23.2951C11.7182 23.6948 17.9568 23.2514 23.802 21.2176L24.3838 21.0151V13.7787L23.1192 12.5034C23.3347 12.2888 23.5497 12.0725 23.7631 11.8548L24.0125 11.6004V11.2426C24.0125 10.9956 24.0132 9.70218 24.014 8.46995L24.0156 5.70684L18.9236 0.571411L18.4168 0.742645C13.1542 2.52066 7.50979 2.93655 1.92005 2.64057ZM18.6911 1.56832L23.152 6.0673C23.152 6.0673 23.1491 10.7479 23.1491 11.2426C22.9371 11.4589 22.7232 11.674 22.5087 11.8876C22.3032 12.0921 22.0971 12.2952 21.8912 12.4963L23.5204 14.1394V20.3944C17.8158 22.3793 11.6995 22.8209 5.70833 22.4262L1.2474 17.9243L1.25028 12.752C1.7381 12.4523 2.22346 12.1487 2.70629 11.841C2.95545 11.6822 3.20394 11.5224 3.45173 11.3614L1.8719 9.76807C1.8719 6.78767 1.87271 5.20815 1.87348 4.38204C1.87415 3.65158 1.87479 3.51013 1.87479 3.51013C2.1623 3.52535 2.45008 3.53873 2.73807 3.55015C8.11665 3.76364 13.5673 3.29944 18.6911 1.56832Z"
                                fill="white"
                            />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M1.87495 3.51019C7.53219 3.80976 13.2931 3.39216 18.6912 1.56836L23.1522 6.06733C23.1522 6.06733 23.1493 10.748 23.1493 11.2426C22.7341 11.666 22.3122 12.0852 21.8914 12.4963L23.5205 14.1394V20.3944C17.8159 22.3793 11.6997 22.821 5.70848 22.4262L1.24756 17.9243L1.25044 12.752C1.99001 12.2978 2.72392 11.8343 3.45191 11.3614L1.87207 9.7681C1.87207 4.1525 1.87495 3.51019 1.87495 3.51019Z"
                                fill="#ADB3BD"
                            />
                            <path
                                d="M21.4222 8.343V10.8508C18.6392 13.527 15.8561 15.8606 13.076 17.9418C15.9828 17.7473 18.8867 17.28 21.7963 16.4325C21.7963 17.3584 21.7963 18.2814 21.7963 19.2073C17.7844 20.3799 13.7753 20.8241 9.76623 20.8241C8.98917 20.8241 8.21212 20.8066 7.43506 20.7747V18.2669C10.2181 16.4818 13.0011 14.5109 15.7813 12.2557C13.7811 12.514 11.7808 12.6243 9.7806 12.6243C9.205 12.6243 8.63229 12.6156 8.05669 12.5981C8.05669 11.6722 8.05669 10.7492 8.05669 9.82329C8.62652 9.84072 9.19352 9.8494 9.76337 9.8494C13.6487 9.8494 17.534 9.43435 21.4193 8.34009L21.4222 8.343Z"
                                fill="white"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_10203_69315">
                                <rect
                                    width="24"
                                    height="24"
                                    fill="white"
                                    transform="translate(0.383789)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
        </template>
    </v-navigation-drawer>
</template>
<script>

import { mapActions, mapGetters } from "vuex";
import {menu} from "@/components/mixins/menu";

export default {
    name: 'Navbar',
    mixins: [menu],

    components: {
    },

    data: () => ({
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


        wrapClick() {
            this.showWrapView();
            this.showWrapModal();
            // this.trackClick({action: 'wrap-click', event_category: 'Wrap', event_label: 'Open wrap modal', value: 1 });
        },

        redemptionRequestAction() {
            this.showRedemptionRequestModal();
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

.navbar-page-link {
    height: 24px !important;
    width: 24px !important;
}

.footer-item-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    font-feature-settings: 'liga' off;
    color: var(--third-gray-text);
    cursor: pointer;
}

.navbar-page-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.02em !important;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
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
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.02em !important;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
    text-transform: uppercase;
}

.navbar-list-label {
    font-family: 'Roboto', sans-serif;
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
</style>

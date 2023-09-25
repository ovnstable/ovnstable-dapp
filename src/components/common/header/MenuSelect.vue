<template>
    <v-menu offset-y :close-on-content-click="closeOnContentClick">
        <template v-slot:activator="{ on, attrs }">
            <div class="select-bar-main-container mt-1"
                 v-bind="attrs"
                 v-on="on">
                <v-row justify="end" align="center" class="select-bar-container">
                    <v-icon class="menu-icon">mdi-view-headline</v-icon>

<!--                    <div v-if="isShowSwipeNotification" class="ping-notify">
                        <div class="ping d-inline ml-4">
                            <div style=""></div>
                        </div>
                    </div>-->
                </v-row>
            </div>
        </template>
        <v-list class="main-container" >
            <v-list-item
                id="click_menu_swap_mobile"
                @click="swapOdosClick" :class="selectedTab === 'swap-odos' ? 'selected-page-item' : ''">
                <div class="navbar-page-link mt-1">
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0002 14.9999C8.67408 14.9999 7.40231 14.4731 6.46463 13.5355C5.52695 12.5978 5.00016 11.326 5.00016 9.99992C5.00016 9.16659 5.2085 8.35825 5.5835 7.66659L4.36683 6.44992C3.69162 7.51083 3.33315 8.74237 3.3335 9.99992C3.3335 11.768 4.03588 13.4637 5.28612 14.714C6.53636 15.9642 8.23205 16.6666 10.0002 16.6666V19.1666L13.3335 15.8333L10.0002 12.4999M10.0002 3.33325V0.833252L6.66683 4.16659L10.0002 7.49992V4.99992C11.3262 4.99992 12.598 5.5267 13.5357 6.46439C14.4734 7.40207 15.0002 8.67384 15.0002 9.99992C15.0002 10.8333 14.7918 11.6416 14.4168 12.3333L15.6335 13.5499C16.3087 12.489 16.6672 11.2575 16.6668 9.99992C16.6668 8.23181 15.9645 6.53612 14.7142 5.28587C13.464 4.03563 11.7683 3.33325 10.0002 3.33325Z" fill="#ADB3BD"/>
                    </svg>
                </div>
                <v-list-item-title class="mx-3">
                    <label :class="selectedTab === 'swap-odos' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        SWAP
                    </label>
                </v-list-item-title>
            </v-list-item>

            <v-list-item
                v-if="networkName !== 'linea'"
                id="click_menu_swipe_mobile"
                @click="swipeOdosClick" :class="selectedTab === 'swipe-odos' ? 'selected-page-item' : ''">
                <div class="navbar-page-link mt-1">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#ADB3BD" d="M0 0V14H12.04C11.7921 13.2471 11.6661 12.4594 11.6667 11.6667H4.66667C4.66667 11.0478 4.42083 10.4543 3.98325 10.0168C3.54566 9.57917 2.95217 9.33333 2.33333 9.33333V4.66667C3.62833 4.66667 4.66667 3.62833 4.66667 2.33333H16.3333C16.3333 2.95217 16.5792 3.54566 17.0168 3.98325C17.4543 4.42083 18.0478 4.66667 18.6667 4.66667V4.73667C19.4483 4.73667 20.23 4.87667 21 5.13333V0H0ZM10.5 3.5C8.51667 3.535 7 5.01667 7 7C7 8.98333 8.51667 10.43 10.5 10.5C10.9433 10.5 11.3983 10.4067 11.83 10.2317C12.145 8.94833 12.67 7.735 13.965 6.545C13.825 4.99333 12.355 3.465 10.5 3.5ZM21.735 7.315L17.22 11.865L15.645 10.2667L14 11.9233L17.2083 15.1667L23.3683 8.96L21.735 7.315Z"/>
                    </svg>
                </div>
                <v-list-item-title class="mx-3">
                    <label :class="selectedTab === 'swipe-odos' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        SWIPE
                    </label>

<!--                    <div v-if="isShowSwipeNotification" class="ping d-inline ml-4">
                        <div style=""></div>
                    </div>-->

                </v-list-item-title>
            </v-list-item>

            <v-list-item
                id="click_menu_bridge_mobile"
                @click="bridgeClick()" :class="selectedTab === 'bridge' ? 'selected-page-item' : ''">
                <div class="navbar-page-link mt-1">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#ADB3BD" d="M0 0V14H12.04C11.7921 13.2471 11.6661 12.4594 11.6667 11.6667H4.66667C4.66667 11.0478 4.42083 10.4543 3.98325 10.0168C3.54566 9.57917 2.95217 9.33333 2.33333 9.33333V4.66667C3.62833 4.66667 4.66667 3.62833 4.66667 2.33333H16.3333C16.3333 2.95217 16.5792 3.54566 17.0168 3.98325C17.4543 4.42083 18.0478 4.66667 18.6667 4.66667V4.73667C19.4483 4.73667 20.23 4.87667 21 5.13333V0H0ZM10.5 3.5C8.51667 3.535 7 5.01667 7 7C7 8.98333 8.51667 10.43 10.5 10.5C10.9433 10.5 11.3983 10.4067 11.83 10.2317C12.145 8.94833 12.67 7.735 13.965 6.545C13.825 4.99333 12.355 3.465 10.5 3.5ZM21.735 7.315L17.22 11.865L15.645 10.2667L14 11.9233L17.2083 15.1667L23.3683 8.96L21.735 7.315Z"/>
                    </svg>
                </div>
                <v-list-item-title class="mx-3">
                    <label :class="selectedTab === 'bridge' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        BRIDGE
                    </label>
                </v-list-item-title>
            </v-list-item>
        </v-list>
        <v-list class="main-container">
            <div class="navbar-list-divider mt-1 mb-1"></div>
            <label class="navbar-list-header mx-3">
                Money Markets
            </label>

            <v-list-group :append-icon="null"  @click="toggleUsdPlus(!isShowUsd)">
                <template v-slot:activator>
                    <div class="navbar-page-link">
                        <svg width="24" height="24" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-bind:fill="usdPlusIconColor" d="M15.4709 13.0182C13.5291 12.3745 12.5909 11.9709 12.5909 10.9455C12.5909 9.83273 13.8018 9.42909 14.5655 9.42909C15.9945 9.42909 16.5182 10.5091 16.6382 10.8909L18.3618 10.16C18.1982 9.66909 17.4673 8.06545 15.5909 7.71636V6.36364H13.4091V7.73818C10.7036 8.34909 10.6927 10.8582 10.6927 10.9673C10.6927 13.4436 13.1473 14.1418 14.3473 14.5782C16.0709 15.1891 16.8345 15.7455 16.8345 16.7927C16.8345 18.0255 15.6891 18.5491 14.6745 18.5491C12.6891 18.5491 12.1218 16.5091 12.0564 16.2691L10.2455 17C10.9327 19.3891 12.7327 20.0327 13.4091 20.2291V21.6364H15.5909V20.2836C16.0273 20.1855 18.7545 19.64 18.7545 16.7709C18.7545 15.2545 18.0891 13.9236 15.4709 13.0182ZM4.68182 23.8182H2.5V17.2727H9.04545V19.4545H6.34C8.09636 22.0836 11.0964 23.8182 14.5 23.8182C17.1039 23.8182 19.6012 22.7838 21.4425 20.9425C23.2838 19.1012 24.3182 16.6039 24.3182 14H26.5C26.5 20.6327 21.1327 26 14.5 26C10.4418 26 6.85273 23.9818 4.68182 20.9055V23.8182ZM2.5 14C2.5 7.36727 7.86727 2 14.5 2C18.5582 2 22.1473 4.01818 24.3182 7.09455V4.18182H26.5V10.7273H19.9545V8.54545H22.66C20.9036 5.91636 17.9036 4.18182 14.5 4.18182C11.8961 4.18182 9.39876 5.21623 7.5575 7.0575C5.71623 8.89876 4.68182 11.3961 4.68182 14H2.5Z" />
                        </svg>
                    </div>
                    <v-list-item-title>
                        <label class="navbar-page-label ml-3" :class="selectedTab.startsWith('usdplus_') ? 'selected-page' : ''">USD+</label>
                    </v-list-item-title>
                    <div class="select-bar-main-container" >
                        <v-row>
                            <v-icon color="var(--secondary-gray-text)" >
                                {{ isShowUsd ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                            </v-icon>
                        </v-row>
                    </div>
                </template>
                <v-list-item @click="statsClick" :class="selectedTab === 'usdplus_performance' ? 'selected-page-item' : ''">
                    <v-list-item-title>
                        <label class="navbar-list-label mx-5" :class="selectedTab === 'usdplus_performance' ? 'selected-page' : ''">Performance</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item @click="collateralClick" :class="selectedTab === 'usdplus_collateral' ? 'selected-page-item' : ''">
                    <v-list-item-title>
                        <label class="navbar-list-label mx-5" :class="selectedTab === 'usdplus_collateral' ? 'selected-page' : ''">Collateral</label>
                    </v-list-item-title>
                </v-list-item>
            </v-list-group>

          <v-list-group :append-icon="null" @click="toggleDaiPlus(!isShowDai)">
            <template v-slot:activator>
                <div class="navbar-page-link">
                    <svg width="24" height="24" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path v-bind:fill="daiPlusIconColor" d="M4.68182 23.8182H2.5V17.2727H9.04545V19.4545H6.34C8.09636 22.0836 11.0964 23.8182 14.5 23.8182C17.1039 23.8182 19.6012 22.7838 21.4425 20.9425C23.2838 19.1012 24.3182 16.6039 24.3182 14H26.5C26.5 20.6327 21.1327 26 14.5 26C10.4418 26 6.85273 23.9818 4.68182 20.9055V23.8182ZM2.5 14C2.5 7.36727 7.86727 2 14.5 2C18.5582 2 22.1473 4.01818 24.3182 7.09455V4.18182H26.5V10.7273H19.9545V8.54545H22.66C20.9036 5.91636 17.9036 4.18182 14.5 4.18182C11.8961 4.18182 9.39876 5.21623 7.5575 7.0575C5.71623 8.89876 4.68182 11.3961 4.68182 14H2.5Z"/>
                        <path v-bind:fill="daiPlusIconColor" d="M14.5664 20H10.5V8H14.6484C15.8398 8 16.8633 8.24023 17.7188 8.7207C18.5781 9.19727 19.2383 9.88281 19.6992 10.7773C20.1602 11.6719 20.3906 12.7422 20.3906 13.9883C20.3906 15.2383 20.1582 16.3125 19.6934 17.2109C19.2324 18.1094 18.5664 18.7988 17.6953 19.2793C16.8281 19.7598 15.7852 20 14.5664 20ZM12.6738 18.1191H14.4609C15.2969 18.1191 15.9941 17.9668 16.5527 17.6621C17.1113 17.3535 17.5313 16.8945 17.8125 16.2852C18.0938 15.6719 18.2344 14.9063 18.2344 13.9883C18.2344 13.0703 18.0938 12.3086 17.8125 11.7031C17.5313 11.0938 17.1152 10.6387 16.5645 10.3379C16.0176 10.0332 15.3379 9.88086 14.5254 9.88086H12.6738V18.1191Z"/>
                    </svg>
                </div>
              <v-list-item-title>
                <label class="navbar-page-label ml-3" :class="selectedTab.startsWith('daiplus_') ? 'selected-page' : ''">DAI+</label>
              </v-list-item-title>
              <div class="select-bar-main-container" >
                <v-row>
                  <v-icon color="var(--secondary-gray-text)" >
                    {{ isShowDai ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                  </v-icon>
                </v-row>
              </div>
            </template>
            <v-list-item @click="daiStatsClick" :class="selectedTab === 'daiplus_performance' ? 'selected-page-item' : ''">
              <v-list-item-title>
                <label class="navbar-list-label mx-5" :class="selectedTab === 'daiplus_performance' ? 'selected-page' : ''">Performance</label>
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="daiCollateralClick" :class="selectedTab === 'daiplus_collateral' ? 'selected-page-item' : ''">
              <v-list-item-title>
                <label class="navbar-list-label mx-5" :class="selectedTab === 'daiplus_collateral' ? 'selected-page' : ''">Collateral</label>
              </v-list-item-title>
            </v-list-item>
          </v-list-group>

            <v-list-group :append-icon="null" @click="toggleUsdtPlus(!isShowUsdt)">
                <template v-slot:activator>
                    <div class="navbar-page-link">
                        <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-bind:fill="usdtPlusIconColor" d="M2.98715 17.0129H1.42871V12.3376H6.10404V13.896H4.17157C5.42611 15.7739 7.56897 17.0129 10.0001 17.0129C11.8601 17.0129 13.6439 16.274 14.9591 14.9588C16.2743 13.6436 17.0131 11.8599 17.0131 9.9999H18.5716C18.5716 14.7376 14.7378 18.5713 10.0001 18.5713C7.10144 18.5713 4.5378 17.1298 2.98715 14.9324V17.0129ZM1.42871 9.9999C1.42871 5.26223 5.26248 1.42847 10.0001 1.42847C12.8988 1.42847 15.4625 2.87003 17.0131 5.06743V2.98691H18.5716V7.66223H13.8962V6.10379H15.8287C14.5742 4.22587 12.4313 2.98691 10.0001 2.98691C8.14018 2.98691 6.3564 3.72577 5.04121 5.04097C3.72602 6.35616 2.98715 8.13994 2.98715 9.9999H1.42871Z"/>
                            <path v-bind:fill="usdtPlusIconColor" d="M10.8243 14.9999V8.11763H13.1603V6.42847H6.42871V8.11763H8.76466V14.9999H10.8243Z"/>
                        </svg>
                    </div>
                    <v-list-item-title>
                        <label class="navbar-page-label ml-3" :class="selectedTab.startsWith('usdtplus_') ? 'selected-page' : ''">USDT+</label>
                    </v-list-item-title>
                    <div class="select-bar-main-container" >
                        <v-row>
                            <v-icon color="var(--secondary-gray-text)" >
                                {{ isShowUsdt ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                            </v-icon>
                        </v-row>
                    </div>
                </template>
                <v-list-item @click="usdtStatsClick" :class="selectedTab === 'usdtplus_performance' ? 'selected-page-item' : ''">
                    <v-list-item-title>
                        <label class="navbar-list-label mx-5" :class="selectedTab === 'usdtplus_performance' ? 'selected-page' : ''">Performance</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item @click="usdtCollateralClick" :class="selectedTab === 'usdtplus_collateral' ? 'selected-page-item' : ''">
                    <v-list-item-title>
                        <label class="navbar-list-label mx-5" :class="selectedTab === 'usdtplus_collateral' ? 'selected-page' : ''">Collateral</label>
                    </v-list-item-title>
                </v-list-item>
            </v-list-group>


            <div class="navbar-list-divider mt-1 mb-1"></div>
            <label class="navbar-list-header mx-3">
                OVN TOKEN
            </label>

<!--            <v-list-item @click="buyOvnClick" :class="selectedTab === 'buy-ovn' ? 'selected-page-item' : ''">
                <div class="navbar-page-link">
                    <img :src="require('@/assets/icon/menu/buy-ovn.svg')"
                         class="navbar-page-link" alt="">
                </div>
                <v-list-item-title class="mx-3">
                    <label class="navbar-page-label" :class="selectedTab === 'buy-ovn' ? 'selected-page' : ''">
                        BUY OVN
                    </label>
                </v-list-item-title>
            </v-list-item>-->

            <v-list-item @click="provideLpClick" :class="selectedTab === 'provide-lp' ? 'selected-page-item' : ''">
                <div class="navbar-page-link mt-1">
                    <img :src="require('@/assets/icon/menu/provide-lp.svg')"
                         class="navbar-page-link">
                </div>
                <v-list-item-title class="mx-3">
                    <label :class="selectedTab === 'provide-lp' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        PROVIDE LP
                    </label>
                </v-list-item-title>
            </v-list-item>




            <div class="navbar-list-divider mt-1 mb-1"></div>
            <label class="navbar-list-header mx-3">
                Yield Farming
            </label>

            <v-list-item @click="featuredClick" :class="selectedTab === 'featured' ? 'selected-page-item' : ''">
                <div class="navbar-page-link">
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.99984 12.8251L6.8665 14.7167L7.6915 11.1501L4.92484 8.75008L8.57484 8.44175L9.99984 5.07508L11.4248 8.44175L15.0748 8.75008L12.3082 11.1501L13.1332 14.7167M18.3332 7.70008L12.3415 7.19175L9.99984 1.66675L7.65817 7.19175L1.6665 7.70008L6.20817 11.6417L4.84984 17.5001L9.99984 14.3917L15.1498 17.5001L13.7832 11.6417L18.3332 7.70008Z" fill="#ADB3BD"/>
                    </svg>
                </div>
                <v-list-item-title class="mx-3">
                    <label class="navbar-page-label" :class="selectedTab === 'featured' ? 'selected-page' : ''">FEATURED</label>
                </v-list-item-title>
            </v-list-item>

            <v-list-item @click="usdPlusPoolsClick" :class="selectedTab === 'pools' ? 'selected-page-item' : ''">
                <div class="navbar-page-link mt-1">
                    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5002 3.33325C14.2683 3.33325 15.964 4.03563 17.2142 5.28587C18.4645 6.53612 19.1668 8.23181 19.1668 9.99992C19.1668 11.768 18.4645 13.4637 17.2142 14.714C15.964 15.9642 14.2683 16.6666 12.5002 16.6666C10.7321 16.6666 9.03636 15.9642 7.78612 14.714C6.53587 13.4637 5.8335 11.768 5.8335 9.99992C5.8335 8.23181 6.53587 6.53612 7.78612 5.28587C9.03636 4.03563 10.7321 3.33325 12.5002 3.33325ZM12.5002 14.9999C13.8262 14.9999 15.098 14.4731 16.0357 13.5355C16.9734 12.5978 17.5002 11.326 17.5002 9.99992C17.5002 8.67384 16.9734 7.40207 16.0357 6.46439C15.098 5.5267 13.8262 4.99992 12.5002 4.99992C11.1741 4.99992 9.90231 5.5267 8.96463 6.46439C8.02695 7.40207 7.50016 8.67384 7.50016 9.99992C7.50016 11.326 8.02695 12.5978 8.96463 13.5355C9.90231 14.4731 11.1741 14.9999 12.5002 14.9999ZM2.50016 9.99992C2.50012 11.0332 2.82075 12.041 3.4178 12.8844C4.01485 13.7277 4.8589 14.365 5.8335 14.7083V16.4499C2.9585 15.7083 0.833496 13.1083 0.833496 9.99992C0.833496 6.89159 2.9585 4.29159 5.8335 3.54992V5.29159C3.89183 5.97492 2.50016 7.82492 2.50016 9.99992Z" fill="#ADB3BD"/>
                    </svg>
                </div>
                <v-list-item-title class="mx-3">
                    <label :class="selectedTab === 'pools' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        ALL POOLS
                    </label>
                </v-list-item-title>
            </v-list-item>

            <div class="navbar-list-divider mt-1 mb-1"></div>

            <v-list-item @click="dashBoardClick" :class="selectedTab === 'dashboard' ? 'selected-page-item' : ''">
                <div class="navbar-page-link">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0002 3.33325C8.1585 3.33325 6.66683 4.82492 6.66683 6.66659C6.66683 8.50825 8.1585 9.99992 10.0002 9.99992C11.8418 9.99992 13.3335 8.50825 13.3335 6.66659C13.3335 4.82492 11.8418 3.33325 10.0002 3.33325ZM11.6668 6.66659C11.6668 5.74992 10.9168 4.99992 10.0002 4.99992C9.0835 4.99992 8.3335 5.74992 8.3335 6.66659C8.3335 7.58325 9.0835 8.33325 10.0002 8.33325C10.9168 8.33325 11.6668 7.58325 11.6668 6.66659ZM15.0002 14.1666C14.8335 13.5749 12.2502 12.4999 10.0002 12.4999C7.75016 12.4999 5.16683 13.5749 5.00016 14.1749V14.9999H15.0002V14.1666ZM3.3335 14.1666C3.3335 11.9499 7.77516 10.8333 10.0002 10.8333C12.2252 10.8333 16.6668 11.9499 16.6668 14.1666V16.6666H3.3335V14.1666Z" fill="#ADB3BD"/>
                    </svg>
                </div>
                <v-list-item-title class="ml-3">
                    <label class="navbar-page-label" :class="selectedTab === 'dashboard' ? 'selected-page' : ''">My Dashboard</label>
                </v-list-item-title>
            </v-list-item>

            <v-list-item class="menu-item" >
                <v-list-item-title class="network-select-list-item" @click="openLink('https://docs.overnight.fi/')">
                    Docs
                </v-list-item-title>
                <v-list-item-title @click="aboutEtsClick()">
                    <label class="network-select-list-item">ETS</label>
                </v-list-item-title>
            </v-list-item>
            <v-list-item link class="mb-0">
                <v-list-item-title @click="openLink('https://docs.overnight.fi/advanced/terms-of-service')">
                    <label class="network-select-list-item">Terms of Service</label>
                </v-list-item-title>
            </v-list-item>
            <v-list-item  link class="mb-0">
                <v-list-item-title @click="openLink('https://discord.com/channels/933003627444969552/967813123149033542/967813482684760135/')">
                    <label class="network-select-list-item">Help center in Discord</label>
                </v-list-item-title>
            </v-list-item>
            <v-list-item class="menu-item theme-switch-btn" @click="switchTheme">
                <v-list-item-title class="network-select-list-item">
                    <v-row class="ma-0 fill-height" align="center" justify="center">
                        Switch to {{ light ? 'dark' : 'light' }} mode
                        <v-spacer></v-spacer>
                        <v-icon class="switch-theme-icon" v-if="light">mdi-moon-waxing-crescent</v-icon>
                        <v-icon class="switch-theme-icon" v-else>mdi-white-balance-sunny</v-icon>
                    </v-row>
                </v-list-item-title>
            </v-list-item>
            <v-list-item>
                <img class="footer-social-link ml-n3" :src="require('@/assets/social/twitterSocial.svg')" @click="openLink('https://twitter.com/overnight_fi')">
                <img class="footer-social-link" :src="require('@/assets/social/discordSocial.svg')" @click="openLink('https://discord.gg/overnight-fi')">
                <img class="footer-social-link zealy ml-3" :src="require('@/assets/social/zealySocial.svg')" @click="openLink('https://zealy.io/c/overnight-fi/questboard')">
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>

import {mapActions, mapGetters} from "vuex";

export default {
    name: "MenuSelect",

    components: {},

    data: () => ({
        isShowEts: false,
        isShowUsd: false,
        isShowUsdt: false,
        isShowDai: false,
        closeOnContentClick: false,

      isShowSwipeNotification: false
    }),

    mounted() {
      this.checkIsNotified();
    },
    computed: {
        ...mapGetters('wrapUI', ['showWrap']),
        ...mapGetters('theme', ['light']),
        ...mapGetters('wrapUI', ['showWrap']),
        ...mapGetters('menuUI', ['selectedTab']),
        ...mapGetters('network', ['networkId', "networkName"]),

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
        console.log('lastNotify 1:', lastNotify)

        if (!lastNotify || lastNotify === 'null' || lastNotify === 'undefined') {
          localStorage.setItem('lastNotify', '2');
          this.isShowSwipeNotification = true;
          return;
        }

        lastNotify = lastNotify * 1;
        console.log('lastNotify 2: ', lastNotify)
        if (lastNotify <= 0) {
          console.log('lastNotify 3: ', lastNotify)
          localStorage.setItem('lastNotify', '0');
          this.isShowSwipeNotification = false;
          return;
        }

        if (subscribe) {
          this.subNotifyCount();
          return;
        }

        this.isShowSwipeNotification = true;
        //
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

        goToAction(id) {
            this.$router.push(id);
        },

        goToActionByPath(path, queryParams) {
            this.$router.push({
                path: path,
                query: queryParams ? queryParams : {}
            });
        },

        featuredClick() {
            this.selectTab('featured');
            this.goToActionByPath('/featured');
        },
        swapOdosClick() {
            this.selectTab('swap-odos');
            this.goToActionByPath('/swap', { tabName: 'swap-odos' });

            try {
                this.trackClick({action: 'click_menu_swap_mobile', event_category: 'Click button', event_label: 'Click swap mobile menu button' });
            } catch (e) {
                console.error("Track error:", e);
            }
        },
        swipeOdosClick() {
            this.selectTab('swipe-odos');
            this.goToActionByPath('/swipe', { tabName: 'swipe-odos' });

            try {
                this.trackClick({action: 'click_menu_swipe_mobile', event_category: 'Click button', event_label: 'Click swipe mobile menu button' });
            } catch (e) {
                console.error("Track error:", e);
            }

          this.checkIsNotified(true);
        },
        bridgeClick() {
            this.selectTab('bridge');
            this.goToActionByPath('/bridge', { tabName: 'bridge' });

            try {
                this.trackClick({action: 'click_menu_bridge_mobile', event_category: 'Click button', event_label: 'Click bridge mobile menu button' });
            } catch (e) {
                console.error("Track error:", e);
            }
        },

        dashBoardClick() {
            this.selectTab('dashboard');
            this.goToActionByPath('/dashboard', { tabName: 'dashboard' });
            /*this.trackClick({
                action: 'dashboard-click',
                event_category: 'View Page',
                event_label: 'Open dashboard page',
                value: 1
            });*/
        },

        collateralClick() {
            this.selectTab('usdplus_collateral');
            this.goToActionByPath('/collateral');
            /*this.trackClick({
                action: 'collateral-click',
                event_category: 'View Page',
                event_label: 'Open collateral page',
                value: 1
            });*/
        },

        daiCollateralClick() {
          this.selectTab('daiplus_collateral');
          this.goToActionByPath('/collateral/dai');
          // this.trackClick({action: 'dai-collateral-click', event_category: 'View Page', event_label: 'Open dai collateral page', value: 1 });
        },

        buyOvnClick() {
            this.selectTab('buy-ovn');
            this.goToActionByPath('/buy-ovn');
        },

        provideLpClick() {
            this.selectTab('provide-lp');
            this.goToActionByPath('/provide-lp');
        },


        usdtCollateralClick() {
          this.selectTab('usdtplus_collateral');
          this.goToActionByPath('/collateral/usdt');
          // this.trackClick({action: 'usdt-collateral-click', event_category: 'View Page', event_label: 'Open usdt collateral page', value: 1 });
        },

        usdPlusPoolsClick() {
            this.selectTab('usdplus_pools');
            this.goToActionByPath('/pools', { tabName: 'usdPlusPools' });


            try {
                this.trackClick({action: 'click_menu_pools_mobile', event_category: 'Click button', event_label: 'Click pools mobile menu button' });
            } catch (e) {
                console.error("Track error:", e);
            }
        },

        statsClick() {
            this.selectTab('usdplus_performance');
            this.goToActionByPath('/stats');
          /*  this.trackClick({
                action: 'stats-click',
                event_category: 'View Page',
                event_label: 'Open stats page',
                value: 1
            });*/
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
            // this.trackClick({ action: 'wrap-click', event_category: 'Wrap', event_label: 'Open wrap modal', value: 1 });
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

        redemptionRequestAction() {
            this.showRedemptionRequestModal();
        },

        toggleUsdPlus(isShow) {
            if (isShow) {
                this.toggleEts(false);
                this.toggleDaiPlus(false);
                this.toggleUsdtPlus(false);
            }

            this.isShowUsd = isShow;
        },

        toggleDaiPlus(isShow) {
            if (isShow) {
                this.toggleEts(false);
                this.toggleUsdPlus(false);
                this.toggleUsdtPlus(false);
            }

            this.isShowDai = isShow;
        },

        toggleUsdtPlus(isShow) {
            if (isShow) {
                this.toggleEts(false);
                this.toggleUsdPlus(false);
                this.toggleDaiPlus(false);
            }

            this.isShowUsdt = isShow;
        },

        toggleEts(isShow) {
            if (isShow) {
                this.toggleUsdPlus(false);
                this.toggleDaiPlus(false);
                this.toggleUsdtPlus(false);
            }

            this.isShowEts = isShow;
        },
    }
}
</script>

<style scoped>
/* mobile */
@media only screen and (max-width: 960px) {
    .network-select-list-item {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .select-bar-main-container {
        width: 42px !important;
    }

    .network-select-list {
        width: 50vw !important;
    }

    .switch-theme-icon {
        width: 26px !important;
        height: 26px !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .network-select-list-item {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 18px !important;
        line-height: 24px !important;
    }

    .select-bar-main-container {
        width: 56px !important;
    }

    .network-select-list {
        width: 30vw !important;
    }

    .switch-theme-icon {
        width: 32px !important;
        height: 32px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .network-select-list-item {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 18px !important;
        line-height: 24px !important;
    }

    .select-bar-main-container {
        width: 56px !important;
    }

    .network-select-list {
        width: 20vw !important;
    }

    .switch-theme-icon {
        width: 32px !important;
        height: 32px !important;
    }
}

.network-select-list {
    background-color: var(--secondary) !important;
    border-radius: 10px;
}

.network-select-list-item {
    font-family: 'Roboto', sans-serif !important;
    color: var(--secondary-gray-text) !important;
    cursor: pointer;
}

.text-blue {
    color: var(--links-blue) !important;
}

.select-bar-container {
    background-color: transparent;
    cursor: pointer;
    position: relative;
}

.menu-item {
    cursor: pointer;
}

.menu-icon {
    color: var(--main-gray-text) !important;
}

.switch-theme-icon {
    color: var(--theme-icon-color) !important;
}

.theme-switch-btn {
    background-color: var(--theme-switch-background) !important;
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
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.05em;
    color: var(--main-gray-text);
    cursor: pointer;
}

.navbar-page-label-modal {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--links-blue);
}

.selected-page {
    color: var(--main-gray-text);
    font-weight: 700 !important;
}

.selected-page-item {
    background-color: var(--card-banner-status-container) !important;
}

.navbar-page-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.02em !important;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
    cursor: pointer;
}

.navbar-page-link {
    width: 25px;
    height: 25px;
    margin-right: 0 !important;
}

.main-container {
    background-color: var(--secondary) !important;
}

.list-item-hover:hover {
    color: var(--main-gray-text);
    background: linear-gradient(#28A0F0 100%, #0678C4 99.17%, #FFFFFF 16%);
}

.footer-social-link {
    cursor: pointer;
    height: 48px !important ;
}

.zealy {
    height: 24px !important;
}

.toggleUpDown {
    transition: transform .3s ease-in-out !important;
    color: var(--main-gray-text) !important;
}

.toggleUpDown.rotate {
    transform: rotate(90deg);
}

.navbar-list-divider {
    border-top: 1px solid var(--input-placeholder) !important;
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

.ping-notify {
    position: absolute;
    top: -7px;
    right: -7px;
}
</style>

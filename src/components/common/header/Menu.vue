<template>
    <v-row justify="center">
        <div class="hidden-xs-only">
            <span v-bind:class="activeTabSwap"
                  @click="goToAction('/market')">
                Swap
            </span>

            <span v-bind:class="activeTabWrap"
                  v-if="showWrap"
                  class=" ml-10"
                  @click="goToAction('/wrap')">
                Wrap
            </span>

            <span v-bind:class="activeTabFarm"
                  v-if="showFarm"
                  class=" ml-10"
                  @click="goToAction('/farm')">
                Farm
            </span>

            <span v-bind:class="activeTabStats"
                  v-if="showStats"
                  class=" ml-10"
                  @click="goToAction('/fund')">
                Stats
            </span>

            <span v-bind:class="activeTabDashboard"
                  v-if="showDashboard"
                  class=" ml-10"
                  @click="goToAction('/')">
                Dashboard
            </span>
        </div>
        <div class="hidden-sm-and-up mt-10">
            <v-select class="menu-select" flat solo color="#5686B2" :items="menus" v-model="menu" item-value="to"
                      @input="pushUrl" item-text="name"/>
        </div>
    </v-row>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "Menu",
    data: () => ({
        exitAppShow: false,
        direction: 'top',
        fab: false,
        tab: null,
        currentDate: null,
        showLimitTooltip: false,

        ethLogo: require('../../../assets/currencies/eth.svg'),
        polLogo: require('../../../assets/currencies/pol.svg'),

        tabId: 1,

        menu: null,

        menus: [
            {
                name: 'Earn',
                to: '/',
                id: 1
            },
            {
                name: 'Wrap',
                to: '/wrap',
                id: 2
            },
            {
                name: 'Farm',
                to: '/farm',
                id: 3,
            },
            {
                name: 'Stats performance',
                to: '/fund',
                id: 4,
            },
            {
                name: 'Dashboard',
                to: '/dashboard',
                id: 5,
            },
        ]
    }),


    computed: {

        ...mapGetters('web3', ['web3', 'networkId']),
        ...mapGetters('accountData', ['account']),
        ...mapGetters('farmUI', ['showFarm']),
        ...mapGetters('wrapUI', ['showWrap']),
        ...mapGetters('dashboardUI', ['showDashboard']),
        ...mapGetters('statsUI', ['showStats']),

        activeTabSwap: function () {
            return {
                'active-tab': this.tabId === 1,
                'in-active-tab': this.tabId !== 1,
            }
        },

        activeTabWrap: function () {
            return {
                'active-tab': this.tabId === 2,
                'in-active-tab': this.tabId !== 2,
            }
        },

        activeTabFarm: function () {
            return {
                'active-tab': this.tabId === 3,
                'in-active-tab': this.tabId !== 3,
            }
        },

        activeTabStats: function () {
            return {
                'active-tab': this.tabId === 4,
                'in-active-tab': this.tabId !== 4,
            }
        },

        activeTabDashboard: function () {
            return {
                'active-tab': this.tabId === 5,
                'in-active-tab': this.tabId !== 5,
            }
        },
    },


    created() {
        let path = this.$router.history.current.path;
        let find = this.menus.find(value => value.to === path);
        if (find) {
            this.menu = find;
            this.tabId = find.id;
        }
    },


    methods: {
        goToAction(id) {

            let menu = this.menus.find(value => value.to === id);

            if (menu === this.menu) {
                return;
            } else {
                this.$router.push(id)
                this.menu = menu;
                this.tabId = menu.id;
            }
        },

        pushUrl(to) {
            this.$router.push(to)
        },
    }
}
</script>

<style scoped>
.tabs {
    font-size: 25px;
}

.active-tab {
    color: #FE7F2D;
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 28px;
    cursor: pointer;
    text-transform: capitalize;
}

.in-active-tab {
    color: var(--third-lightgray-text);
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 18px !important;
    line-height: 28px !important;
    cursor: pointer;
    text-transform: capitalize;
}

.menu-select {
    width: 150px;
    font-size: 25px;
    color: #171717;
}


</style>

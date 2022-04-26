<template>
    <v-row justify="center">
        <div class="hidden-xs-only">
            <span v-bind:class="activeTabSave"
                  @click="goToAction('/')">
                Swap
            </span>

            <span v-bind:class="activeTabDashboard"
                  class=" ml-10"
                  @click="goToAction('/fund')">
                Stats
            </span>

            <span v-bind:class="activeTabOvnStatement"
                  class=" ml-10"
                  @click="goToAction('/dashboard')">
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

        ethLogo: require('../../assets/currencies/eth.svg'),
        polLogo: require('../../assets/currencies/pol.svg'),

        tabId: 1,

        menu: null,

        menus: [
            {
                name: 'Earn',
                to: '/',
                id: 1
            },
            {
                name: 'Fund performance',
                to: '/fund',
                id: 2,
            },
            {
                name: 'Dashboard',
                to: '/dashboard',
                id: 3,
            },
        ]
    }),


    computed: {

        ...mapGetters('web3', ['account', 'web3', 'contractNames', 'networkId']),


        activeTabSave: function () {
            return {
                'active-tab': this.tabId === 1,
                'in-active-tab': this.tabId !== 1,
            }
        },

        activeTabDashboard: function () {
            return {
                'active-tab': this.tabId === 2,
                'in-active-tab': this.tabId !== 2,
            }
        },

        activeTabOvnStatement: function () {
            return {
                'active-tab': this.tabId === 3,
                'in-active-tab': this.tabId !== 3,
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
    color: #ADB3BD;
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

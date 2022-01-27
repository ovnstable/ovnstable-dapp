<template>
    <v-menu rounded="lg" offset-y>
        <template v-slot:activator="{ attrs, on }">
            <v-btn
                    :disabled="!isWalletConnected"
                    class="ml-2"
                    v-bind="attrs"
                    v-on="on"
                    icon>
                <v-icon>mdi-cog</v-icon>
            </v-btn>
        </template>

        <v-list>
            <v-list-item>
                <label
                        class="list-label"
                        @click="switchAccountAction">
                    Switch wallet
                </label>
            </v-list-item>
            <v-list-item
                    style="color: #DC3545FF">
                <label
                        class="list-label"
                        @click="disconnectWalletAction">
                    Disconnect wallet
                </label>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "Settings",

    computed: {
        ...mapGetters('web3', ['walletConnected']),

        isWalletConnected: function () {
            return this.walletConnected;
        }
    },

    methods: {

        ...mapActions('web3', ['disconnectWallet', 'switchAccount']),

        disconnectWalletAction() {
            this.disconnectWallet();
        },

        switchAccountAction() {
            this.switchAccount();
        },
    }
}
</script>

<style scoped>

.list-label {
    cursor: pointer;
}

</style>

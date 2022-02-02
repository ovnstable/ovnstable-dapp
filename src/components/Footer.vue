<template>
    <v-footer app bottom fixed padless>
        <v-card
                class="footer-row flex"
                width="100%"
                flat
                tile>
            <v-card-text>
                <v-row justify="center">
                    <v-btn icon href="https://github.com/ovnstable" target="_blank">
                        <v-icon class="footer-icon">mdi-github</v-icon>
                    </v-btn>

                    <v-btn icon href="https://ovnstable.medium.com/" target="_blank" class="footer-icon">
                        <img width="24" height="24" :src="require('../assets/resource/medium.png')">
                    </v-btn>

                    <v-btn icon href="https://twitter.com/ovnstable" target="_blank" class="footer-icon">
                        <v-icon class="footer-icon">mdi-twitter</v-icon>
                    </v-btn>

                    <v-btn icon href="https://t.me/ovnstable" target="_blank" class="footer-icon">
                        <img width="24" height="24" :src="require('../assets/resource/telegram.png')">
                    </v-btn>

                    <v-btn icon href="https://discord.gg/7dEceNJqPq" target="_blank" class="footer-icon">
                        <v-icon class="footer-icon">mdi-discord</v-icon>
                    </v-btn>

                    <v-btn icon @click="$router.push({name: 'Overview'})" class="footer-icon">
                        <v-icon class="footer-icon colored">mdi-account-key</v-icon>
                    </v-btn>
                </v-row>
            </v-card-text>
        </v-card>
    </v-footer>
</template>

<script>
export default {
    name: "Footer"
}
</script>

<style scoped>

.footer-row {
    background-color: var(--main-background) !important;
}

.footer-icon {
    color: var(--logo-color) !important;
    margin-left: 5px;
    margin-right: 5px;
}

.colored {
    background: var(--orange-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

</style>

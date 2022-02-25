<template>
    <v-footer app bottom fixed padless>
        <v-card
                class="footer-row flex"
                width="100%"
                flat
                tile>
            <v-card-text>
                <v-row justify="center" align="center" class="footer-row icons-row">
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

                <v-row justify="start" align="center" class="footer-beta-row">
                    <div class="info-img ml-3 mr-1">
                        <v-img :src="require('@/assets/icon/info.svg')"/>
                    </div>
                    <label class="footer-beta-label">
                        Overnight is currently in <b>beta</b> mode. Please be mindful of the SmartContract risks. Learn more at&nbsp;&nbsp;
                    </label>
                    <label class="footer-beta-label docs-link" @click="openDocsLink">
                        docs.ovnstable.io
                    </label>
                </v-row>
            </v-card-text>
        </v-card>
    </v-footer>
</template>

<script>
export default {
    name: "Footer",

    methods: {
        openDocsLink() {
            window.open(`https://docs.ovnstable.io/`, '_blank').focus();
        },
    }
}
</script>

<style scoped>

.footer-row {
    background-color: var(--main-background) !important;
}

.icons-row {
    height: 44px;
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

.footer-beta-row {
    height: 54px;
    background-color: var(--secondary) !important;
}

.footer-beta-label {
    font-family: 'Lato', sans-serif !important;
    color: white;
    font-weight: normal;
    font-style: normal !important;
    font-size: 14px;
    line-height: 24px;
}

.docs-link {
    cursor: pointer;
    color: var(--link) !important;
}

.docs-link:hover {
    text-decoration: underline;
}

.info-img {
    width: 20px;
    height: 20px;
}

</style>

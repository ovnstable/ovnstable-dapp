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

                    <v-btn icon href="https://blog.overnight.fi/" target="_blank" class="footer-icon">
                        <img width="24" height="24" :src="require('../assets/resource/medium.svg')">
                    </v-btn>

                    <v-btn icon href="https://twitter.com/overnight_fi" target="_blank" class="footer-icon">
                        <v-icon class="footer-icon">mdi-twitter</v-icon>
                    </v-btn>

                    <v-btn icon href="https://t.me/overnight_fi" target="_blank" class="footer-icon">
                        <img width="24" height="24" :src="require('../assets/resource/telegram.png')">
                    </v-btn>

                    <v-btn icon href="https://discord.gg/overnight-fi" target="_blank" class="footer-icon">
                        <v-icon class="footer-icon">mdi-discord</v-icon>
                    </v-btn>

                    <v-btn icon @click="$router.push({name: 'Overview'})" class="footer-icon">
                        <v-icon class="footer-icon">mdi-account-key</v-icon>
                    </v-btn>
                </v-row>

                <v-row justify="center" align="center" class="footer-beta-row">
                    <label class="footer-beta-label">
                        Overnight is currently in <b>beta</b> mode
                    </label>
                    <div>
                        <v-btn
                                text
                                class="footer-btn ml-2"
                                @click="openDocsLink">
                            Docs
                        </v-btn>
                        <v-btn
                                text
                                class="footer-btn ml-2"
                                @click="openLink('https://overnight.canny.io/')">
                            Vote for new features
                        </v-btn>
                    </div>
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
            window.open(`https://docs.overnight.fi/`, '_blank').focus();
        },

        openLink(url) {
            window.open(url, '_blank').focus();
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {
    .icons-row {
        height: 34px;
    }

    .footer-beta-row {
        height: 48px;
    }

    .footer-btn {
        height: 24px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 24px !important;
    }

    .footer-beta-label {
        font-weight: normal;
        font-style: normal !important;
        font-size: 14px;
        line-height: 24px;
    }
}

@media only screen and (min-width: 1400px) {
    .footer-beta-row {
        height: 54px;
    }

    .icons-row {
        height: 44px;
    }

    .footer-btn {
        height: 30px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 24px !important;
    }

    .footer-beta-label {
        font-weight: normal;
        font-style: normal !important;
        font-size: 16px;
        line-height: 24px;
    }
}

.footer-row {
    background-color: var(--main-background) !important;
}

.footer-icon {
    color: var(--logo-color) !important;
    margin-left: 5px;
    margin-right: 5px;
}

.footer-beta-row {
    background-color: var(--main-background) !important;
}

.footer-beta-label {
    font-family: 'Lato', sans-serif !important;
    color: white;
}

.footer-btn {
    border: 1px solid #2C6DDB;
    border-radius: 0;
    font-family: 'Roboto', sans-serif !important;
    font-feature-settings: 'liga' off !important;
    color: #2C6DDB !important;
    text-transform: none !important;
}

</style>

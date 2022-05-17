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

                    <v-btn icon href="https://discord.gg/7dEceNJqPq" target="_blank" class="footer-icon">
                        <v-icon class="footer-icon">mdi-discord</v-icon>
                    </v-btn>

                    <v-btn icon @click="$router.push({name: 'Overview'})" class="footer-icon">
                        <v-icon class="footer-icon">mdi-account-key</v-icon>
                    </v-btn>
                </v-row>

                <v-row justify="start" align="center" class="footer-beta-row">
                    <div class="info-img ml-3 mr-1">
                        <v-img :src="require('@/assets/icon/info.svg')"/>
                    </div>
                    <label class="footer-beta-label">
                        Overnight is currently in <b>beta</b> mode.&nbsp;
                    </label>
                    <label class="footer-beta-label footer-sub-label">
                        Please be mindful of the SmartContract risks.&nbsp;
                    </label>
                    <label class="footer-beta-label footer-sub-label">
                        Learn more at&nbsp;&nbsp;
                    </label>
                    <label class="footer-beta-label docs-link" @click="openDocsLink">
                        docs.overnight.fi
                    </label>
                    <label class="footer-beta-label docs-icon" @click="openDocsLink">
                        &nbsp;Docs
                        <v-icon small class="docs-icon share-icon">
                            mdi-share
                        </v-icon>
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
            window.open(`https://docs.overnight.fi/`, '_blank').focus();
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {
    .footer-beta-row, .icons-row {
        height: 34px;
    }

    .footer-sub-label, .docs-link {
        display: none !important;
    }
}

@media only screen and (min-width: 1400px) {
    .footer-beta-row {
        height: 54px;
    }

    .docs-icon {
        display: none !important;
    }

    .icons-row {
        height: 44px;
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

.colored {
    width: 24px;
    height: 24px;
    color: #FE7F2D !important;
}

.footer-beta-row {
    background-color: #3D4657 !important;
}

.footer-beta-label {
    font-family: 'Lato', sans-serif !important;
    color: white;
    font-weight: normal;
    font-style: normal !important;
    font-size: 14px;
    line-height: 24px;
}

.docs-icon {
    color: var(--link) !important;
    cursor: pointer;
}

.share-icon {
    margin-bottom: 4px;
    margin-left: -2px;
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

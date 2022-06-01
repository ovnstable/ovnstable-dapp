<template>
    <v-dialog
            v-model="show"
            persistent
            width="560">
        <v-card class="container_body">
            <v-toolbar class="container_header" flat>
                <v-spacer></v-spacer>
                <v-btn icon class="ml-auto" @click="close" dark>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="px-5 pt-5">
                <v-row justify="center" class="title-label">
                    <label class="coming-soon-label">Coming soon</label>
                </v-row>
                <v-row justify="center" class="mt-12">
                    <label class="stay-tuned-label">Stay tuned</label>
                </v-row>
                <v-row justify="center" class="mt-7 social-row">
                    <div>
                        <v-img class="social-btn mr-5" :src="require('@/assets/social/discordBtn.svg')" @click="openDiscord" />
                    </div>

                    <div>
                        <v-img class="social-btn mr-5" :src="require('@/assets/social/twitterBtn.svg')" @click="openTwitter" />
                    </div>

                    <div>
                        <v-img class="social-btn" :src="require('@/assets/social/telegramBtn.svg')" @click="openTelegram" />
                    </div>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
    name: "ComingSoonModal",

    props: {
        callbackClose: {
            type: Function,
            default: function () {
            }
        }
    },

    computed: {
    },

    data: () => ({
        show: true,
    }),

    methods: {
        openDiscord() {
            window.open(`https://discord.com/invite/overnight-fi`, '_blank').focus();
        },

        openTwitter() {
            window.open(`https://twitter.com/overnight_fi`, '_blank').focus();
        },

        openTelegram() {
            window.open(`https://t.me/overnight_fi_announcements`, '_blank').focus();
        },

        close() {
            this.show = false;
            this.callbackClose();

            this.$emit('input', false);
            this.$emit('m-close');
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {
    .coming-soon-label {
        font-style: normal;
        font-weight: 800;
        font-size: 28px;
        line-height: 36px;
    }

    .stay-tuned-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
    }

    .social-btn {
        height: 32px !important;
        width: 32px !important;
    }
}

@media only screen and (min-width: 1400px) {
    .coming-soon-label {
        font-style: normal;
        font-weight: 800;
        font-size: 34px;
        line-height: 42px;
    }

    .stay-tuned-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 24px;
    }

    .social-btn {
        height: 40px !important;
        width: 40px !important;
    }
}

.container_body {
    border-radius: 24px !important;
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
}

.coming-soon-label {
    font-family: 'Raleway', sans-serif;
    text-align: center;
    color: #FFFFFF;
}

.stay-tuned-label {
    font-family: 'Lato', sans-serif;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.social-btn {
    cursor: pointer !important;
}

.title-label {
    margin-top: 8px !important;
}

.social-row {
    margin-bottom: 76px !important;
}
</style>

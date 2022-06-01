<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col class="main-col">
                <v-row class="justify-start pt-15">
                    <label class="title-header">
                        <v-icon class="return-btn" @click='goToAction("/farm")'>
                            mdi-reply
                        </v-icon>
                        preOVN token
                    </label>
                    <v-spacer></v-spacer>
                </v-row>

                <v-row class="main-row">
                    <v-col class="pa-0 ma-0" :cols="isMobile ? 12 : 6">
                        <p class="preovn-info-text">
                            preOVN is a temporary token. Its purpose is to represent the protocol's obligation.
                            Each preOVN has a nominal value of 1 USDC, to be converted into OVN with a 25% bonus to the OVN IDO price. preOVN holders will be able to choose to (1) exchange their preOVNs for OVN or (2) receive an OVN value equivalent.
                        </p>
                        <p class="preovn-info-text">
                            For example, if somebody has accumulated 100 preOVNs (nominal value of 100*1 USDC = 100 USDC) and OVN sells at 1 USDC at IDO, the preOVN holder would be able to (1) exchange their 100 preOVNs for 125 OVN or (2) receive 125 USDC
                        </p>
                        <p class="preovn-info-text">
                            preOVNs are intended to be distributed among:
                            <ul>
                                <li>Team members working on the OVN launch</li>
                                <li>Early investors into OVN (rewards)</li>
                                <li>Outside partners, including media, advisors, etc.</li>
                            </ul>
                        </p>
                    </v-col>

                    <v-col v-if="!isMobile" class="pa-0 ma-0" cols="2">
                    </v-col>

                    <v-col class="pa-0 ma-0" :cols="isMobile ? 12 : 4">
                        <v-container fluid class="preovn-swap-container">
                            <v-row align="center" justify="center" class="mt-16">
                                <label class="preovn-card-label mr-3">preOVN</label>
                                <div class="avatar-img">
                                    <v-img :src="require('@/assets/icon/arrows.svg')"/>
                                </div>
                                <label class="preovn-card-label ml-3">OVN</label>
                            </v-row>

                            <v-row align="center" justify="center" class="mt-6">
                                <label class="preovn-card-sub-label mr-3">1 preOVN = 1,25 USDC</label>
                            </v-row>

                            <v-row align="center" justify="center" class="mt-4">
                                <v-col cols="2"></v-col>
                                <v-col cols="8">
                                    <v-btn dark
                                           height="56"
                                           class="buy disabled-buy"
                                           disabled>
                                        Swap soon
                                    </v-btn>
                                </v-col>
                                <v-col cols="2"></v-col>
                            </v-row>

                            <v-row align="center" justify="center" class="mt-10">
                                <v-spacer></v-spacer>
                                <label class="preovn-card-sub-text-label mr-3">Here you can exchange preOVN for OVN soon</label>
                                <v-spacer></v-spacer>
                            </v-row>

                            <v-row align="center" justify="center" class="mt-8">
                                <v-spacer></v-spacer>
                                <label class="preovn-card-sub-text-label mr-3">Stay tuned</label>
                                <v-spacer></v-spacer>
                            </v-row>

                            <v-row align="center" justify="center" class="mt-7 mb-16">
                                <v-spacer></v-spacer>
                                <div class="avatar-img">
                                    <v-img
                                            class="stay-tune-img"
                                            @click="openLink('https://discord.gg/overnight-fi')"
                                            :src="require('@/assets/resource/discord-btn.svg')"
                                    />
                                </div>
                                <div class="avatar-img mx-5">
                                    <v-img
                                            class="stay-tune-img"
                                            @click="openLink('https://twitter.com/overnight_fi')"
                                            :src="require('@/assets/resource/twitter-btn.svg')"
                                    />
                                </div>
                                <div class="avatar-img">
                                    <v-img
                                            class="stay-tune-img"
                                            @click="openLink('https://t.me/overnight_fi')"
                                            :src="require('@/assets/resource/telegram-btn.svg')"
                                    />
                                </div>
                                <v-spacer></v-spacer>
                            </v-row>
                        </v-container>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

export default {
    name: "PreOvnView",

    components: {},

    data: () => ({
    }),


    computed: {
        isMobile() {
            return window.innerWidth < 650;
        }
    },

    methods: {
        goToAction(id) {
            this.$router.push(id);
        },

        openLink(link) {
            window.open(link, '_blank').focus();
        },
    }
}
</script>

<style scoped>

.main-col {
    max-width: 70vw !important;
}

.main-row {
    padding-top: 30px !important;
}

.return-btn {
    color: #FE7F2D !important;
    cursor: pointer;
    margin-top: -6px;
}

.preovn-info-text {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.preovn-swap-container {
    background: #1D2029;
    border-radius: 20px;
}

.preovn-card-label {
    font-family: 'Raleway', sans-serif;
    font-style: normal;
    font-weight: 800;
    font-size: 34px;
    line-height: 42px;
    background: linear-gradient(91.26deg, #FE7F2D 0%, #FCCA46 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
}

.preovn-card-sub-label {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 28px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #4C586D;
}

.preovn-card-sub-text-label {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
    text-align: center;
}

.enabled-buy {
    background: var(--orange-gradient) !important;
}

.disabled-buy {
    background: #181A21 !important;
    box-shadow: none !important;
    border: 1px solid #1D2029 !important;
}

.buy {
    width: 100%;
    border-radius: 40px;
    color: white !important;
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px !important;
    line-height: 24px !important;
    text-transform: none !important;
}

.avatar-img {
    width: 40px;
    height: 40px;
}

.stay-tune-img {
    cursor: pointer !important;
}
</style>

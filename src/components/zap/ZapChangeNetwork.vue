<template>
    <div>
        <div class="change-network-container mb-4">
            <div class="change-network-inner-container">
                <div class="change-network-icon-container mb-10">
                    <img :src="require('@/assets/icon/pool/change-network.svg')"
                         alt="change-network"
                         class="change-network-icon">
                </div>

                <div class="change-network-text-container mb-5 ml-5 mr-5">
                    Please, switch to the chain the pool is on.
                </div>

                <div class="change-network-button-container">
                    <v-row align="center" justify="center" class="ma-0 mt-5">
                        <v-btn class="header-btn btn-filled" @click.stop="setWalletNetwork(zapPool.chain + '')">
                            SWITCH TO {{ getParams(zapPool.chain).networkName.toUpperCase() }}
                        </v-btn>
                    </v-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {mapActions, mapGetters} from "vuex";

export default defineComponent({
    name: "ZapChangeNetwork",
    props: {
      zapPool: {
          type: Object,
          required: true
      }
    },
    computed: {
        ...mapGetters("network", ['getParams']),

    },
    methods: {
        ...mapActions("network", ["setWalletNetwork"]),

    }
})
</script>



<style scoped>
@media only screen and (max-width: 960px) {
    .change-network-text-container {
        font-size: 13px;
    }

    .header-btn {
        width: unset;
        max-width: 200px;
    }

    .change-network-container {
        min-height: 300px;
    }

    .change-network-icon {
        width: 100px;
        height: 50px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .change-network-text-container {
        font-size: 14px;
    }

    .header-btn {
        width: 300px;
        height: 48px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .header-btn {
        width: 300px;
        height: 48px;
    }
}

@media (min-width: 1300px) {

    .header-btn {
        width: 300px;
        height: 48px;
    }
}

div {
    font-family: 'Roboto',serif;
}


.btn-filled {
    background: var(--blue-gradient);
    color: var(--secondary) !important;
}

.header-btn {
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    border-radius: 2px;
}


.change-network-icon {

}

.change-network-container {
    min-height: 420px;

    border: 1px solid var(--main-border);
    border-radius: 12px;

    display: flex;
    justify-content: center;
    align-items: center;

}

.change-network-inner-container {
    text-align: center;
}

.change-network-text-container {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    text-align: center;

    color: var(--main-gray-text);
}

.change-network-text-container {
    font-size: 13px;
}
</style>

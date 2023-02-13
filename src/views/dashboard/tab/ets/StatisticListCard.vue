<template>
    <v-row class="ma-0">
        <v-col cols="7" class="my-1">
            <v-row class="ma-0" justify="start" align="center">
                <div class="icon mr-3">
                  <v-img :src="require('@/assets/currencies/market/ets_' + statistic.ets.name + '.svg')"/>
<!--                    <v-img :src="require('@/assets/network/' + statistic.ets.chainName + '.svg')"-->
<!--                           :title="statistic.ets.chainName.toUpperCase()"/>-->
                </div>
                <div class="card-label-container">
                  <label class="card-label">
                    {{ statistic.name }}
                  </label>
                </div>
            </v-row>
        </v-col>
        <v-col cols="4" class="my-1">
          <v-row class="ma-0" justify="end" align="center">
            <div class="icon mr-3">
              <v-img :src="require('@/assets/network/' + statistic.ets.chainName + '.svg')"
                     :title="statistic.ets.chainName.toUpperCase()"/>
            </div>
            <div class="icon mr-2">
              <v-img :src="require('@/assets/cards/platform/' + statistic.ets.dex + '.svg')"
                     :title="statistic.ets.dex"/>
            </div>
            <div class="icon-token-pair">
              <v-img :src="require('@/assets/cards/token_pair/' + statistic.ets.tokenPair + '.svg')"
                     :title="statistic.ets.poolName"/>
            </div>
          </v-row>
        </v-col>
        <v-col cols="1" class="my-1">
            <v-row class="ma-0" justify="end" align="end">
                 <label>
                   <v-icon color="var(--secondary-gray-text)">
                     {{ statistic.isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                   </v-icon>
                 </label>
            </v-row>
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>

export default {
    name: "StatisticListCard",

    components: {
    },

    props: {

        statistic: {
            type: Object
        },
    },

    computed: {
    },

    data: () => ({
    }),

    watch: {},

    created() {

    },

    methods: {

    }
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {

    .icon {
        height: 20px !important;
        width: 20px !important;
    }

    .icon-token-pair {
        width: 38px !important;
    }

    .button {
        width: 95% !important;
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 14px !important;
        line-height: 18px !important;
        letter-spacing: 0.03em;
    }

    .card-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .card-label-container {
      text-overflow: ellipsis;
      overflow: hidden;
      width: 140px;
      height: 1.2em;
      white-space: nowrap;
    }

    .list-header-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }

}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .icon {
        height: 24px !important;
        width: 24px !important;
    }

    .icon-token-pair {
        width: 46px !important;
    }

    .button {
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 14px !important;
        line-height: 18px !important;
        letter-spacing: 0.03em;
    }

    .card-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
    }

    .list-header-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .icon {
        height: 28px !important;
        width: 28px !important;
    }

    .icon-token-pair {
        width: 54px !important;
    }

    .button {
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 14px !important;
        line-height: 18px !important;
        letter-spacing: 0.03em;
    }

    .card-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
    }

    .list-header-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }
}

.list-card-container {
    width: 100% !important;
    background: var(--secondary);
    border-radius: 8px;
}

* {
    cursor: pointer;
}

.list-card-container:hover {
    filter: none !important;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05), 0 4px 4px 0 rgba(0, 0, 0, 0.05);
}

.button {
    height: 28px !important;
    border-radius: 2px;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
}

.btn-outlined {
    color: var(--links-blue) !important;
}

.open-icon {
    color: #707A8B;
    height: 18px;
    width: 18px;
}

.card-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--main-gray-text);
}

.list-header-label-gray {
    color: var(--third-gray-text);
}

.featured-badge >>> i {
    color: #FE7F2D !important;
}

.card-divider {
    border-color: var(--fourth-gray-text) !important;
}

.list-header-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
}

.button-full-width {
    width: 100% !important;
}

.icon > .v-image {
    border-radius: 9999px !important;

}
</style>

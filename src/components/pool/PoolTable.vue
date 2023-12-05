<template>
  <div>
    <div class="pool-table-container pt-4">
      <div class="pool-table-header">
        <div class="row">
          <div class="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <div class="row">
              <div class="col-3 col-xl-2 col-lg-2 col-md-2 col-sm-3">
                <div class="pool-table-header-item"></div>
              </div>
              <div class="col-3 col-xl-2 col-lg-2 col-md-2 col-sm-3">
                <div class="pool-table-header-item">Chain {{ typeOfPool }}</div>
              </div>
              <div class="col-3 col-xl-2 col-lg-2 col-md-2 col-sm-3">
                <div class="pool-table-header-item">Tokens</div>
              </div>
              <div class="col-3 col-xl-6 col-lg-6 col-md-6 col-sm-3">
                <div class="pool-table-header-item">Pool name</div>
              </div>
            </div>
          </div>

          <!--          Hide on mobile          -->
          <div v-if="!$wu.isMobile()" class="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <div class="row">
              <div class="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-4">
                <div class="pool-table-header-item">Staking platform</div>
              </div>

              <div
                @click="toggleOrderType('APR')"
                class="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-4 cursor-pointer"
              >
                <div
                  :class="
                    orderType.startsWith('APR') ? 'pool-table-header-item-selected' : ''
                  "
                  class="pool-table-header-item"
                >
                  APR
                  <div v-if="light" class="pool-table-header-logo">
                    <img
                      v-if="orderType === 'APR'"
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-filter.svg')"
                      alt="toggle-open-pool"
                    />
                    <img
                      v-else-if="orderType === 'APR_UP'"
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-sort-ascending-black.svg')"
                      alt="toggle-open-pool"
                    />
                    <img
                      v-else-if="orderType === 'APR_DOWN'"
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-sort-descending-black.svg')"
                      alt="toggle-open-pool"
                    />
                    <img
                      v-else
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-filter.svg')"
                      alt="toggle-open-pool"
                    />
                  </div>
                  <div v-else class="pool-table-header-logo">
                    <img
                      v-if="orderType === 'APR'"
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-filter.svg')"
                      alt="toggle-open-pool"
                    />
                    <img
                      v-else-if="orderType === 'APR_UP'"
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-sort-ascending-white.svg')"
                      alt="toggle-open-pool"
                    />
                    <img
                      v-else-if="orderType === 'APR_DOWN'"
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-sort-descending-white.svg')"
                      alt="toggle-open-pool"
                    />
                    <img
                      v-else
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-filter.svg')"
                      alt="toggle-open-pool"
                    />
                  </div>
                </div>
              </div>
              <div
                @click="toggleOrderType('TVL')"
                class="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-4 cursor-pointer"
              >
                <div
                  :class="
                    orderType.startsWith('TVL') ? 'pool-table-header-item-selected' : ''
                  "
                  class="pool-table-header-item"
                >
                  TVL

                  <div v-if="light" class="pool-table-header-logo">
                    <img
                      v-if="orderType === 'TVL'"
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-filter.svg')"
                      alt="toggle-open-pool"
                    />
                    <img
                      v-else-if="orderType === 'TVL_UP'"
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-sort-ascending-black.svg')"
                      alt="toggle-open-pool"
                    />
                    <img
                      v-else-if="orderType === 'TVL_DOWN'"
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-sort-descending-black.svg')"
                      alt="toggle-open-pool"
                    />
                    <img
                      v-else
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-filter.svg')"
                      alt="toggle-open-pool"
                    />
                  </div>
                  <div v-else class="pool-table-header-logo">
                    <img
                      v-if="orderType === 'TVL'"
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-filter.svg')"
                      alt="toggle-open-pool"
                    />
                    <img
                      v-else-if="orderType === 'TVL_UP'"
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-sort-ascending-white.svg')"
                      alt="toggle-open-pool"
                    />
                    <img
                      v-else-if="orderType === 'TVL_DOWN'"
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-sort-descending-white.svg')"
                      alt="toggle-open-pool"
                    />
                    <img
                      v-else
                      class="toggle-open-pool"
                      :src="require('@/assets/icon/pool/mdi-filter.svg')"
                      alt="toggle-open-pool"
                    />
                  </div>
                </div>
              </div>
              <div class="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-12">
                <div class="pool-table-header-item"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pool-table-body">
        <div
          v-for="pool in pools"
          :key="pool.id"
          v-bind:style="poolTableBodyStyle(pool)"
          class="pool-table-body-item-container"
        >
          <div class="row">
            <div
              @click="toggleDetails(pool)"
              class="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-12"
            >
              <div class="row">
                <div class="col-3 col-xl-2 col-lg-2 col-md-2 col-sm-3">
                  <div class="pool-table-body-item text-center">
                    <div v-if="pool.feature">
                      <v-tooltip
                        v-if="pool.feature"
                        color="var(--tooltip-bg)"
                        min-width="50px"
                        min-height="50px"
                        right
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <div
                            :style="{ width: 50 + 'px', height: 30 + 'px' }"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <img
                              :src="require('@/assets/icon/pool/featured.svg')"
                              alt="featured"
                              class="info-icon"
                            />
                          </div>
                        </template>

                        <label style="color: var(--main-gray-text)"> Featured </label>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
                <div class="col-3 col-xl-2 col-lg-2 col-md-2 col-sm-3">
                  <div class="pool-table-body-item">
                    <div class="icon mr-3">
                      <v-img
                        :src="require('@/assets/network/' + pool.chainName + '.svg')"
                        :title="pool.chainName.toUpperCase()"
                        class="chain-icon"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-3 col-xl-2 col-lg-2 col-md-2 col-sm-3">
                  <div class="pool-table-body-item pt-3">
                    <v-row justify="start" align="center">
                      <div v-if="pool.token0Icon" class="icon">
                        <v-img :src="pool.token0Icon" />
                      </div>
                      <div v-if="pool.token1Icon" class="icon ml-n2 mr-2">
                        <v-img :src="pool.token1Icon" />
                      </div>
                      <div v-if="pool.token2Icon" class="icon ml-n2 mr-2">
                        <v-img :src="pool.token2Icon" />
                      </div>
                      <div v-if="pool.token3Icon" class="icon ml-n2 mr-2">
                        <v-img :src="pool.token3Icon" />
                      </div>
                    </v-row>
                  </div>
                </div>
                <div class="col-3 col-xl-6 col-lg-6 col-md-6 col-sm-3">
                  <div
                    v-if="pool.address === '0x4b9f00860d7f42870addeb687fa4e47062df71d9'"
                    class="pool-table-body-item d-inline-block mr-2"
                  >
                    <!--                                        {{pool.name}} LP {{pool.address}}-->
                    {{ pool.name }} LP V1
                  </div>
                  <div
                    v-else-if="
                      pool.address === '0xf5E67261CB357eDb6C7719fEFAFaaB280cB5E2A6'
                    "
                    class="pool-table-body-item d-inline-block mr-2"
                  >
                    <!--                                        {{pool.name}} LP {{pool.address}}-->
                    {{ pool.name }} LP V2
                  </div>
                  <div v-else class="pool-table-body-item d-inline-block mr-2">
                    <!--                                        {{pool.name}} LP {{pool.address}}-->
                    {{ pool.name }} LP
                  </div>

                  <div class="platform-label-container d-inline-block">
                    <div class="platform-label">
                      <div v-if="pool.platform === 'Swapbased'">
                        <Tooltip text="This pool have 1% deposit fee" bottom />
                      </div>

                      <span v-if="pool.poolNameForAgregator">
                        {{ pool.poolNameForAgregator.toUpperCase() }}
                      </span>
                      <span v-else>
                        {{
                            pool.platform === "Shekel"
                            ? "Shekelswap"
                            : pool.platform.toUpperCase()
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!--          Hide on mobile          -->
            <div class="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <PoolTableDetails
                :pool="pool"
                :open-zap-in-func="openZapInFunc"
                :is-show-only-zap="isShowOnlyZap"
                :is-show-apr-limit="isShowAprLimit"
                :toggle-details-func="toggleDetails"
              >
              </PoolTableDetails>
            </div>
          </div>

          <div
            v-if="!isShowOnlyZap && pool.aggregators && pool.aggregators.length"
            @click="toggleDetails(pool)"
            class="toggle-icon-container"
            v-bind:style="$wu.isMobile() ? 'top: 122px;' : ''"
          >
            <img
              :src="require('@/assets/icon/pool/toggle-open-pool.svg')"
              v-bind:style="pool.isOpened ? '' : 'transform: rotate(180deg);'"
              alt="toggle-open-pool"
            />
          </div>
        </div>
      </div>
    </div>
    <resize-observer @notify="$forceUpdate()" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import PoolTableDetails from "@/components/pool/PoolTableDetails.vue";
import { mapGetters } from "vuex";
import Tooltip from "@/components/common/element/Tooltip.vue";

export default defineComponent({
  name: "PoolTable",
  components: { Tooltip, PoolTableDetails },
  props: {
    pools: {
      type: Array,
      required: true,
    },
    openZapInFunc: {
      type: Function,
      required: true,
    },
    orderType: {
      type: String,
      required: true,
      default: "APR", // APR, APR_UP, APR_DOWN, TVL, TVL_UP, TVL_DOWN
    },
    setOrderTypeFunc: {
      type: Function,
      required: true,
    },
    isShowOnlyZap: {
      type: Boolean,
      required: true,
    },
    isShowAprLimit: {
      type: Boolean,
      required: true,
    },
    typeOfPool: {
      // OVN, ALL, null
      type: String,
      required: false,
    },
  },
  computed: {
    ...mapGetters("theme", ["light"]),
    ...mapGetters("network", ["getParams"]),

    poolTableBodyStyle: function () {
      return (pool) => {
        if (!pool) {
          return "";
        }

        if (this.typeOfPool === "OVN") {
          return "";
        }

        let style = pool.feature
          ? "background: linear-gradient(76.21deg, " +
            this.getParams(pool.chain).networkColor +
            " -77%, var(--swap-main-banner-background) 36%);"
          : "";

        style += pool.aggregators && pool.aggregators.length ? "cursor:pointer;" : "";
        return style;
      };
    },
  },
  methods: {
    toggleDetails(pool) {
      if (pool.aggregators && pool.aggregators.length) {
        pool.isOpened = !pool.isOpened;
        return;
      }

      // pools without aggregators always is opened
      pool.isOpened = true;
    },
    toggleOrderType(type) {
      if (type === "APR") {
        if (!this.orderType.startsWith("APR")) {
          this.setOrderTypeFunc("APR");
          this.setOrderTypeFunc("APR_UP");
        }

        if (this.orderType === "APR") {
          this.setOrderTypeFunc("APR_UP");
          return;
        }

        if (this.orderType === "APR_UP") {
          this.setOrderTypeFunc("APR_DOWN");
          return;
        }

        if (this.orderType === "APR_DOWN") {
          this.setOrderTypeFunc("APR");
          return;
        }
      }

      if (type === "TVL") {
        if (!this.orderType.startsWith("TVL")) {
          this.setOrderTypeFunc("TVL");
          this.setOrderTypeFunc("TVL_UP");
        }

        if (this.orderType === "TVL") {
          this.setOrderTypeFunc("TVL_UP");
          return;
        }

        if (this.orderType === "TVL_UP") {
          this.setOrderTypeFunc("TVL_DOWN");
          return;
        }

        if (this.orderType === "TVL_DOWN") {
          this.setOrderTypeFunc("TVL");
          return;
        }
      }

      console.error("Order type not found when toggle order.", type);
    },
  },
});
</script>

<style scoped>
@media only screen and (max-width: 960px) {
  .info-icon {
    width: 20px !important;
    height: 20px !important;
  }

  .chain-icon {
    width: 50px !important;
    height: auto !important;
  }

  .icon-token-pair {
    width: 38px;
  }

  .pool-table-body-item {
    font-style: normal;
    font-weight: 400;
    font-size: 14px !important;
    line-height: 28px;
    color: var(--main-gray-text);
    /* //background: linear-gradient(76.21deg, #29A0F0 -77.16%, transparent 36.33%); */
  }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
  .icon-token-pair {
    width: 46px;
  }

  .pool-table-body-item {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
    color: var(--main-gray-text);
    /* //background: linear-gradient(76.21deg, #29A0F0 -77.16%, transparent 36.33%); */
  }
}

div {
  font-family: "Roboto", serif;
}

.pool-table-container {
}

.pool-table-header {
  margin-bottom: 10px;
}

.pool-table-header-item {
  position: relative;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: var(--third-gray-text);
}

.pool-table-body-item {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 28px;
  color: var(--main-gray-text);
  /* //background: linear-gradient(76.21deg, #29A0F0 -77.16%, transparent 36.33%); */
}

.icon {
  height: 28px;
  width: 28px;
}

.icon-token-pair {
  width: 54px;
}

.pool-table-body-item-container {
  padding: 20px;
  gap: 16px;

  background: var(--swap-main-banner-background);
  border-radius: 8px;
  margin-bottom: 8px;
  position: relative;
}

.platform-label-container {
  padding: 2px 4px;
  background: var(--card-info-background);
  border-radius: 4px;
  max-width: 120px;
}

.platform-label {
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--action-label-text);

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.toggle-icon-container {
  position: absolute;
  right: 23px;
  top: 17px;
}

.pool-table-header-item-selected {
  color: var(--action-header-pool-item);
}

.cursor-pointer {
  cursor: pointer;
}

.pool-table-header-logo {
  position: absolute;
  top: 1px;
  left: 34px;
}

.toggle-open-pool {
  height: 20px;
}
</style>

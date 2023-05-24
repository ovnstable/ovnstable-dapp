<template>
    <div>
        <div class="tokens-container">
           <div class="row">
               <div v-for="token in tokens.filter(item => item.selected)" :key="token.id"
                    @click="toggleToken(token, !token.selected)"
                    class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-6">
                   <div :class="token.selected ? 'token-container-selected' : ''"
                           class="token-container">
                       <div class="token-info-container">
                           <div class="token-image-container">
                               <img :src="token.logoUrl"
                                    :alt="token.symbol"
                                    class="token-image">
                           </div>
                           <div class="token-symbol">
                               {{token.symbol}}
                           </div>
                       </div>
                   </div>
               </div>
           </div>

            <div class="search-container pt-10">
                <div class="search-input-container">
                    <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search by name or paste address"
                            class="input-style"/>
                    <div @click="clearSearchQuery()" class="search-input-close-container">
                        <img src="/assets/icon/swap/search-close.svg"
                             alt="close"
                             class="search-image-close-image">
                    </div>
                </div>
                <div class="search-items-container">
                    <div v-for="token in queryTokens" :key="token.id"
                         @click="toggleToken(token, !token.selected)">
                        <div :class="token.selected ? 'search-token-container-selected' : ''"
                             class="search-token-container">
                           <div class="row">
                               <div class="col-2">
                                   <div class="search-image-container">
                                       <div class="search-token-image-container">
                                           <img :src="token.logoUrl"
                                                :alt="token.symbol"
                                                class="search-token-image">
                                       </div>
                                   </div>
                               </div>
                               <div class="col-6">
                                   <div>
                                       <div>
                                           <div class="search-token-symbol">
                                               {{token.symbol}}
                                           </div>
                                       </div>
                                       <div>
                                           <div class="search-token-symbol-base">
                                               {{token.name}}
                                           </div>
                                       </div>
                                   </div>
                               </div>
                               <div class="col-4">
                                   <div class="balance-container">
                                       <div>
                                          <div class="token-balance">
                                              {{token.balanceData.balance ? $utils.formatMoney(token.balanceData.balance, 2) : '00.00'}}
                                          </div>
                                       </div>
                                       <div>
                                           <div class="token-usd-balance">
                                               ${{token.balanceData.balance ? $utils.formatMoney(token.balanceData.balance * token.price, 2) : '00.00'}}
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "SelectTokenWithSearch",
    props: {
        tokens: {
            type: Array,
            required: true,
        },
        selectTokenFunc: {
            type: Function,
            required: true,
        },
        removeTokenFunc: {
            type: Function,
            required: true,
        },
    },
    data() {
      return {
          maxTokenSelectCount: 6,
          searchQuery: null
      }
    },
    computed: {
      queryTokens: function () {
          if (!this.searchQuery) {
              return this.tokens
                  .sort((a, b) => {
                  if (b.price * b.balanceData.balance < a.price * a.balanceData.balance) {
                      return -1;
                  } else if (b.price * b.balanceData.balance > a.price * a.balanceData.balance) {
                      return 1;
                  } else {
                      if (b.balanceData.balance < a.balanceData.balance) {
                          return -1;
                      } else if (b.balanceData.balance > a.balanceData.balance) {
                          return 1;
                      } else {
                          return 0;
                      }
                  }
              });
          }

          return this.tokens.filter(token =>
              token.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              token.symbol.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              token.address.toLowerCase().includes(this.searchQuery.toLowerCase())
          ).sort((a, b) => {
              if (b.price * b.balanceData.balance < a.price * a.balanceData.balance) {
                  return -1;
              } else if (b.price * b.balanceData.balance > a.price * a.balanceData.balance) {
                  return 1;
              } else {
                  if (b.balanceData.balance < a.balanceData.balance) {
                      return -1;
                  } else if (b.balanceData.balance > a.balanceData.balance) {
                      return 1;
                  } else {
                      return 0;
                  }
              }
          });
      },
      isAvailableCountForSelect: function () {
          return this.selectedCount < this.maxTokenSelectCount;
      },
      selectedCount: function () {
          return this.tokens.filter(item => item.selected).length
      }
    },
    methods: {
        toggleToken(token, isSelect) {
            if (isSelect && this.isAvailableCountForSelect) {
                this.selectTokenFunc(token);
                return;
            }

            this.removeTokenFunc(token);
        },
        clearSearchQuery() {
            this.searchQuery = null;
        }
    },
})
</script>


<style scoped>
@media only screen and (max-width: 960px) {
    .token-symbol {
        font-size: 16px;
        line-height: 22px;

        padding-left: 30px;
        width: 80px;
    }

    .input-style {
        font-size: 16px;
        line-height: 28px;
    }

    .search-token-symbol {
        font-size: 16px;
        line-height: 24px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .token-symbol {
        font-size: 18px;
        line-height: 24px;

        padding-left: 35px;
        width: 80px;
    }

    .input-style {
        font-size: 18px;
        line-height: 28px;
    }

    .search-token-symbol {
        font-size: 18px;
        line-height: 24px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .token-symbol {
        font-size: 18px;
        line-height: 24px;

        padding-left: 35px;
        width: 80px;
    }

    .input-style {
        font-size: 18px;
        line-height: 28px;
    }

    .search-token-symbol {
        font-size: 18px;
        line-height: 24px;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .token-symbol {
        font-size: 18px;
        line-height: 24px;

        padding-left: 35px;
        width: 80px;
    }


    .input-style {
        font-size: 18px;
        line-height: 28px;
    }

    .search-token-symbol {
        font-size: 18px;
        line-height: 24px;
    }
}

div {
    font-family: 'Roboto',serif;
}

.tokens-container {

}

.token-container {
    height: 56px;
    padding-top: 6px;

    background: var(--card-coin-background);
    border-radius: 12px;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
}

.token-container-selected {
    border: 2px solid #1C95E7;
}

.token-info-container {
    text-align: center;
    position: relative;
}

.token-symbol {
    font-style: normal;
    font-weight: 600;
    /* identical to box height, or 120% */

    display: inline-block;

    color: var(--main-gray-text);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.token-image {
    height: 32px;
    width: 32px;
}


.token-image-container {
    display: inline-block;
    position: absolute;
    top: -5px;
    left: 0;
}

.search-token-image-container {
    display: inline-block;
    position: absolute;
    top: 4px;
    left: 14px;
}


.search-items-container {
    padding: 8px;

    height: 370px;

    border: 2px solid var(--theme-toggle-border);
    border-radius: 20px;

    overflow: auto;
    overscroll-behavior: none;
}

.search-input-container {
    position: relative;
    align-items: center;
    padding: 12px 20px;

    height: 52px;

    background: var(--card-info-background);
    border-radius: 12px;
    margin-bottom: 16px;
}

.input-style {
    border:none;
    background: transparent;
    outline: 0;

    width: 100%;

    color: var(--third-gray-text);


    font-weight: 400;
}

.search-token-container {
    align-items: center;
    padding: 12px;
    gap: 12px;

    height: 78px;

    margin-bottom: 4px;

    background: var(--swap-main-banner-background);;
    border-radius: 12px;

    cursor: pointer;
}

.search-token-container-selected {
    background: rgba(28, 149, 231, 0.1);
}

.search-token-symbol {
    font-style: normal;
    font-weight: 600;

    color: var(--main-gray-text);
}

.search-token-symbol-base {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: #707A8B;
}

.token-balance {
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: var(--main-gray-text);
}

.token-usd-balance {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #707A8B;
}

.balance-container {
    text-align: end;
}

.search-image-container {
    position: relative;
}


.search-token-image {
    height: 40px;
    width: 40px;
}


.search-token-image-container {
    display: inline-block;
    position: absolute;
    top: 4px;
    left: 14px;
}


/* mobile */
@media all and (min-width:0px) and (max-width: 650px) {
    .search-token-image-container {
        display: inline-block;
        position: absolute;
        top: 4px;
        left: -6px;
    }
}


/* tablet */
@media only screen and (min-width:650px) and (max-width: 1400px) {
    .search-token-image-container {
        display: inline-block;
        position: absolute;
        top: 4px;
        left: 14px;
    }
}

.search-input-close-container {
    position: absolute;
    right: 15px;
    top: 16px;
    cursor: pointer;
    width: 30px;
    text-align: center
}
</style>

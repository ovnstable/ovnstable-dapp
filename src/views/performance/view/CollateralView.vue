<template>
    <div class="page-container">
        <div class="mt-10">
            <label class="title-label">USD+ Collateral</label>
        </div>

        <v-row v-if="!isCollateralLoading" align="center" justify="start">
            <template v-if="$wu.isMobile()">
                <v-col cols="12" align="center" class="mt-10">
                    <v-btn  class="header-btn btn-filled mr-5" @click="mintAction">
                        Mint USD+
                    </v-btn>
                    <v-btn class="header-btn btn-outlined mr-5" @click="redeemAction">
                        Redeem USD+
                    </v-btn>
                </v-col>
            </template>
            <v-col cols="6">
                <v-row class="ma-0 mt-10 mb-1 toggle-row">
                    <label class="tab-btn mr-4" @click="setTab('optimism')" v-bind:class="activeTabOptimism">Optimism</label>
                    <label class="tab-btn mx-4" @click="setTab('arbitrum')" v-bind:class="activeTabArbitrum">Arbitrum</label>
                    <label class="tab-btn mx-4" @click="setTab('zksync')" v-bind:class="activeTabZkSync">ZkSync</label>
                    <label class="tab-btn mx-4" @click="setTab('bsc')" v-bind:class="activeTabBsc">BSC</label>
                    <label class="tab-btn mx-4" @click="setTab('polygon')" v-bind:class="activeTabPolygon">Polygon</label>
                </v-row>
            </v-col>
            <template v-if="!$wu.isMobile()">
                <v-col align="end" cols="6" class="mt-5">
                    <v-btn  class="header-btn btn-filled mr-5 mx-15" @click="mintAction">
                        Mint USD+
                    </v-btn>
                    <v-btn class="header-btn btn-outlined" @click="redeemAction">
                        Redeem USD+
                    </v-btn>
                </v-col>
            </template>
        </v-row>

        <v-row v-if="isCollateralLoading && isCurrentTotalDataLoading">
            <v-row align="center" justify="center" class="py-15">
                <v-progress-circular
                    width="2"
                    size="24"
                    color="#8FA2B7"
                    indeterminate
                ></v-progress-circular>
            </v-row>
        </v-row>

        <v-row v-else class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-2' : 'mt-2'" justify="start" align="center">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <label class="section-title-label">
                        USD+ collateral assets
                    </label>
                </v-row>

                <v-row align="center" justify="center">
                    <v-col :cols="!$wu.isFull() ? 12 : 8">
                        <TableStablecoins
                            v-if="!$wu.isMobile()"
                            :data="collateralData"
                            :network-name="tab"
                        />

                        <TableStablecoins
                            v-else
                            minimized
                            :data="collateralData"
                            :network-name="tab"
                        />
                    </v-col>

                    <v-col :cols="!$wu.isFull() ? 12 : 4">
                        <PieStablecoins
                            :data="collateralData"
                            :size="!$wu.isFull() ? 200 : 300"
                            :network-name="tab"
                        />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row v-if="isCurrentTotalDataLoading">
            <v-row align="center" justify="center" class="py-15">
                <v-progress-circular
                    width="2"
                    size="24"
                    color="#8FA2B7"
                    indeterminate
                ></v-progress-circular>
            </v-row>
        </v-row>

        <v-row v-else class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-3'" justify="start" align="center">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <label class="section-title-label">USD+ portfolio</label>
                </v-row>

                <v-row align="center" justify="center">
                    <v-col :cols="!$wu.isFull() ? 12 : 8">
                        <TableStrategies
                            v-if="!$wu.isMobile()"
                            :data="currentTotalData"
                            :total-supply="totalValue"
                            :total-title="'Total USD+ in circulation'"
                            :network-name="tab"
                        />

                        <TableStrategies
                            v-else
                            minimized
                            :data="currentTotalData"
                            :total-supply="totalValue"
                            :total-title="'Total USD+ in circulation'"
                            :network-name="tab"
                        />
                    </v-col>

                    <v-col :cols="!$wu.isFull() ? 12 : 4">
                        <DoughnutStrategies
                            :data="currentTotalData"
                            :total-value="totalValue"
                            :size="!$wu.isFull() ? 200 : 300"
                            :network-name="tab"
                        />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row v-if="!isCurrentTotalDataLoading" class=" ma-0 mt-3">
            <v-col class="currency-box" :cols="$wu.isFull() ? 6 : 12" :class="$wu.isFull() ? 'mr-1' : ''">
                <v-row align="center" :class="$wu.isMobile() ? 'ma-2' : 'ma-5'" @click="openLink(explorerLink)">
                    <div>
                        <v-img class="currency" :src="require('@/assets/currencies/USD+.png')" />
                    </div>
                    <label class="currency-text ml-2">USD+ token address</label>

                    <v-spacer></v-spacer>

                    <label class="address-text ml-auto">{{ shortAddress(contractAddress) }}</label>
                    <div class="ml-auto d-flex">
                        <v-img class="open-new mt-0 ml-1" :src="require('@/assets/icon/open-in-new.svg')"/>
                    </div>
                </v-row>
            </v-col>

            <v-col class="currency-box" :cols="$wu.isFull() ? '' : 12" :class="$wu.isFull() ? 'ml-1' : 'mt-3'">
                <v-row align="center" :class="$wu.isMobile() ? 'ma-2' : 'ma-5'" @click="openLink('https://docs.overnight.fi/advanced/audits')">
                    <label class="currency-text ml-2">Audit</label>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <div>
                        <v-img class="currency" :src="require('@/assets/currencies/Hacken.svg')" />
                    </div>
                    <v-spacer></v-spacer>
                    <div>
                        <v-img class="currency-ackee" :src="require('@/assets/currencies/Ackee-Blockchain.svg')" />
                    </div>


                    <v-spacer></v-spacer>

                    <div class="ml-auto d-flex">
                        <v-img class="open-new mt-0 ml-1" :src="require('@/assets/icon/open-in-new.svg')"/>
                    </div>
                </v-row>
            </v-col>
        </v-row>
        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import TableStablecoins from "@/components/stats/pie/TableStablecoins";
import PieStablecoins from "@/components/stats/pie/PieStablecoins";
import TableStrategies from "@/components/stats/doughnut/TableStrategies";
import DoughnutStrategies from "@/components/stats/doughnut/DoughnutStrategies";
import {strategiesApiService} from "@/services/strategies-api-service";
import {collateralApiService} from "@/services/collateral-api-service";

export default {
    name: "CollateralView",

    components: {
        DoughnutStrategies,
        TableStrategies,
        PieStablecoins,
        TableStablecoins
    },

    data: () => ({
        tab: 'optimism',
        isCurrentTotalDataLoading: true,
        isCollateralLoading: true,

        collateralData: null,
        currentTotalData: null,
        totalValue: 0
    }),

    computed: {
        ...mapGetters("statsData", ['currentTotalData', 'stablecoinData']),
        ...mapGetters("network", ['appApiUrl', 'getParams', 'opConfig', 'polygonConfig', 'bscConfig', 'arConfig', 'zkConfig', 'networkName']),
        ...mapGetters("web3", ['contracts']),

        tabNetworkName: function() {
            let params;
            params = this.getParams(this.tab)

            return params.networkName;
        },

        tabApiUrl: function() {
            let params;
            params = this.getParams(this.tab)

            return params.appApiUrl;
        },

        activeTabOptimism: function() {
            return {
                'tab-button': this.tab === 'optimism',
                'tab-button-in-active': this.tab !== 'optimism',
            }
        },

        activeTabArbitrum: function() {
            return {
                'tab-button': this.tab === 'arbitrum',
                'tab-button-in-active': this.tab !== 'arbitrum',
            }
        },

        activeTabZkSync: function() {
            return {
                'tab-button': this.tab === 'zksync',
                'tab-button-in-active': this.tab !== 'zksync',
            }
        },

        activeTabBsc: function() {
            return {
                'tab-button': this.tab === 'bsc',
                'tab-button-in-active': this.tab !== 'bsc',
            }
        },

        activeTabPolygon: function() {
            return {
                'tab-button': this.tab === 'polygon',
                'tab-button-in-active': this.tab !== 'polygon',
            }
        },

        explorerLink: function () {
            if (this.tabNetworkName === 'optimism') {
                return 'https://optimistic.etherscan.io/token/0x73cb180bf0521828d8849bc8CF2B920918e23032'
            }

            if (this.tabNetworkName === 'arbitrum') {
                return 'https://arbiscan.io/token/0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'
            }

            if (this.tabNetworkName === 'zksync') {
                return 'https://explorer.zksync.io/address/0x8E86e46278518EFc1C5CEd245cBA2C7e3ef11557'
            }

            if (this.tabNetworkName === 'bsc') {
                return 'https://bscscan.com/token/0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'
            }

            if (this.tabNetworkName === 'polygon') {
                return 'https://polygonscan.com/token/0x236eeC6359fb44CCe8f97E99387aa7F8cd5cdE1f'
            }

            console.error("Not found networkId type when return usd+ explorer link")
            return null;
        },

        contractAddress: function () {
            if (this.tabNetworkName === 'optimism') {
                return '0x73cb180bf0521828d8849bc8CF2B920918e23032'
            }

            if (this.tabNetworkName === 'arbitrum') {
                return '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'
            }

            if (this.tabNetworkName === 'zksync') {
                return '0x8E86e46278518EFc1C5CEd245cBA2C7e3ef11557'
            }

            if (this.tabNetworkName === 'bsc') {
                return '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'
            }

            if (this.tabNetworkName === 'polygon') {
                return '0x236eeC6359fb44CCe8f97E99387aa7F8cd5cdE1f'
            }

            console.error("Not found networkId type when return usd+ contract address")
            return null;
        },
    },

    watch: {
        networkName: function (newVal, oldVal) {
            this.setTab(newVal);
            this.loadData(newVal);
        }
    },

    mounted() {
        console.log('Tab Name: ', this.$route.query.tabName);
        this.setTab(this.networkName);
        this.loadData();
    },

    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView', 'showRedeemView']),

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        setTab(tabName) {
            this.tab = tabName;
            this.initTabName('/collateral', {tabName: this.tab});
            this.loadData();
            console.log("NetworkParams : ", this.getParams(this.tab));
        },

        initTabName(path, queryParams) {
            this.$router.push({
                path: path,
                query: queryParams ? queryParams : {}
            });
        },

        loadData() {
            this.loadCurrentTotalData(this.tabApiUrl)
            this.loadCollateralData(this.tabApiUrl)
        },

        loadCurrentTotalData(_apiUrl) {
            this.isCurrentTotalDataLoading = true;

            strategiesApiService.getStrategies(_apiUrl)
                .then(data => {
                    let strategies = data;
                    strategies.sort((a,b) => b.netAssetValue - a.netAssetValue);

                    let colors = [
                        "#FCCA46",
                        "#FE7F2D",
                        "#3D8DFF",
                        "#22ABAC",
                        "#B22174",
                        "#2775CA",
                        "#26A17B",
                        "#23DD00",
                        "#6E56C4",
                        "#002868"
                    ];

                    this.currentTotalData = [];
                    this.totalValue = 0;

                    for (let i = 0; i < strategies.length; i++) {
                        let element = strategies[i];

                        this.currentTotalData.push(
                            {
                                label: element.name,
                                fullName: element.fullName,
                                value: element.netAssetValue,
                                liquidationValue: element.liquidationValue,
                                color: colors[i],
                                link: (element.address || element.explorerAddress) ? (process.env.VUE_APP_DEBANK_EXPLORER + 'profile/' + (element.explorerAddress ? element.explorerAddress : element.address)) : ''
                            }
                        );

                        this.totalValue += element.netAssetValue ? element.netAssetValue : 0;
                    }

                    this.isCurrentTotalDataLoading = false;
                })
                .catch(e => {
                    console.error("Error while adding stablecoins to list: " + e);
                    this.isCurrentTotalDataLoading = false;
                })

        },

        loadCollateralData(_apiUrl) {
            this.isCollateralLoading = true;

            collateralApiService.getCollateralData(_apiUrl)
                .then(data => {
                    let stablecoinList = data;
                    stablecoinList.sort((a,b) => b.netAssetValue - a.netAssetValue);
                    stablecoinList = stablecoinList.filter(el => el.netAssetValue > 0);

                    let colors = [
                        "#2775CA",
                        "#26A17B",
                        "#FCCA46",
                        "#6E56C4",
                        "#002868",
                        "#26A17B",
                        "#23DD00",
                        "#3D8DFF",
                        "#FE7F2D",
                        "#B22174"
                    ];

                    this.collateralData = [];
                    for (let i = 0; i < stablecoinList.length; i++) {
                        let element = stablecoinList[i];

                        try {
                            this.collateralData.push(
                                {
                                    label: element.id.tokenName,
                                    value: element.netAssetValue,
                                    link: element.tokenAddress ? element.tokenAddress : '',
                                    color: colors[i],
                                    logo: require('@/assets/currencies/stablecoins/' + element.id.tokenName + '.png')
                                }
                            );
                            console.log("Token name : ", element.id.tokenName);
                        } catch (e) {
                            console.error("Error while adding stablecoin to list: " + e);
                        }
                    }

                    this.isCollateralLoading = false;
                })
                .catch(e => {
                    console.log("Error Strategy Weights: ", e);
                    this.isCollateralLoading = false;
                })
        },

        shortAddress(address) {
            if (address) {
                return address.substring(0, 5) + '...' + address.substring(address.length - 4);
            } else {
                return null;
            }
        },

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        redeemAction() {
            this.showRedeemView();
            this.showSwapModal();
        }
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 32px;
        line-height: 40px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .currency {
        width: 30px ;
        height: 30px;
    }

    .currency-text {
        font-size: 14px;
        line-height: 22px;
    }

    .address-text {
        font-size: 14px;
        line-height: 22px;
    }

    .open-new {
        width: 20px;
        height: 20px;
    }

    .btn-filled, .btn-outlined {
        width: 40% !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .toggle-row {
        width: 100% !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .currency {
        width: 38px;
        height: 38px;
    }

    .currency-text {
        font-size: 18px;
        line-height: 28px;
    }

    .address-text {
        font-size: 18px;
        line-height: 28px;
    }

    .open-new {
        width: 24px;
        height: 24px;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .currency {
        width: 38px !important;
        height: 38px !important;
    }

    .currency-text {
        font-size: 18px;
        line-height: 28px;
    }

    .address-text {
        font-size: 18px;
        line-height: 28px;
    }

    .open-new {
        width: 24px;
        height: 24px;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 48px;
        line-height: 60px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .currency {
        width: 32px !important;
        height: 32px !important;
    }

    .currency-text {
        font-size: 16px;
        line-height: 25px;
    }

    .address-text {
        font-size: 16px;
        line-height: 28px;
    }

    .open-new {
        width: 22px;
        height: 22px;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 28px;
    }
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
    width: 203% !important;
}

.page-container {
    margin-bottom: 5% !important;
}

.tab-chain-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer !important;
}

.tab-chain-button-in-active {
    color: var(--secondary-gray-text) !important;
    cursor: pointer !important;
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
}

.info-link {
    font-weight: 400;
    color: var(--links-blue) !important;
    cursor: pointer;
}

.header-btn {
    border-radius: 4px !important;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
    width: 140px;
    height: 40px;
}

.btn-outlined {
    background-color: var(--main-background) !important;
    color: var(--links-blue);
    border: 1px solid #1C95E7;
    width: 140px;
    height: 40px;
}

.info-card-container {
    background: var(--secondary);
    border-radius: 12px;
}

.currency-box {
    background: var(--secondary);
    border-radius: 12px;
}

.info-card-body-bottom {
    margin: 2% 2% !important;
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.section-title-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    text-transform: none;
    color: var(--secondary-gray-text);
}

.currency-text {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 400;
    color: var(--secondary-gray-text);
}

.open-link {
    width: 18px;
    height: 18px;
}

.address-text {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 300;
    color: var(--secondary-gray-text);
}

.currency-box, .currency-box >>> * {
    cursor: pointer;
}

.currency-ackee {
    width: auto;
}

.tab-btn {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
    margin-bottom: -2px;
    cursor: pointer;
}

.tab-btn-disabled {
    cursor: default;
}

.tab-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer !important;
}

.tab-button-in-active {
    color: var(--secondary-gray-text) !important;
    cursor: pointer !important;
}
</style>
<template>
    <div>

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
                    <label class="section-title-label">
                        Insurance premiums of USD+
                    </label>
                </v-row>
                <v-row class="ma-0 mt-5 align-center">
                </v-row>

                <v-row v-if="currentTotalData" align="center" justify="center">
                    <v-col :cols="!$wu.isFull() ? 12 : 12">
                        <TableInsuranceStrategies
                            :is-insurance="true"
                            v-if="!$wu.isMobile()"
                            :data="currentTotalData"
                            asset-type="USDC"
                            :total-title="'Total USD+ in circulation'"
                            :network-name="tab"
                        />

                        <TableInsuranceStrategies
                            v-else
                            minimized
                            :is-insurance="true"
                            :data="currentTotalData"
                            asset-type="USDC"
                            :total-title="'Total USD+ in circulation'"
                            :network-name="tab"
                        />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row v-if="!isCurrentTotalDataLoading" class=" ma-0 mt-3">
            <v-col class="currency-box" :cols="$wu.isFull() ? 12 : 12" :class="$wu.isFull() ? 'mr-1' : ''">
                <v-row align="center" :class="$wu.isMobile() ? 'ma-2' : 'ma-5'" @click="openLink(explorerLink)">
                    <div>
                        <v-img class="currency" :src="require('@/assets/currencies/insurance/round_insurance_optimism.svg')" />
                    </div>
                    <label class="currency-text ml-2">Insurance token address</label>

                    <v-spacer></v-spacer>

                    <label class="address-text ml-auto">{{ shortAddress(contractAddress) }}</label>
                    <div class="ml-auto d-flex">
                        <v-img class="open-new mt-0 ml-1" :src="require('@/assets/icon/open-in-new.svg')"/>
                    </div>
                </v-row>
            </v-col>

            <v-row class="ml-1 pt-6">
                <v-col class="col-12 col-lg-6 col-md-6 col-sm-12">
                    <template v-if="networkSupport">
                        <v-row>
                            <v-col cols="6">
                                <v-row align="start" justify="start" class="">
                                    <v-btn class="header-btn btn-investor-invest" @click="mintAction">
                                        MINT INSURANCE
                                    </v-btn>
                                </v-row>
                            </v-col>
                            <v-col cols="6">
                                <v-row align="start" justify="start" class="pl-4">
                                    <v-btn class="header-btn btn-investor-invest btn-investor-outline" outlined @click="redeemAction">
                                        REDEMPTION REQUEST
                                    </v-btn>
                                </v-row>
                            </v-col>
                        </v-row>
                    </template>

                    <template v-else>
                        <v-row align="start" justify="start" class="mt-0">
                            <v-btn class="header-btn btn-investor-invest" @click="setWalletNetwork('optimism')">
                                SWITCH TO OPTIMISM TO MINT
                            </v-btn>
                        </v-row>
                    </template>
                </v-col>
                <v-col class="col-12 col-lg-6 col-md-6 col-sm-12">

                </v-col>
            </v-row>
        </v-row>
        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import TableInsuranceStrategies from "@/components/stats/doughnut/TableInsuranceStrategies.vue";
import {strategiesApiService} from "@/services/strategies-api-service";
import {collateralApiService} from "@/services/collateral-api-service";
import {OVN_INS_CONTRACT_ADDRESS_OPTIMISM} from "@/utils/const.js"

export default {
    name: "InsuranceCollateralTab",

    components: {
        TableInsuranceStrategies,
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
        ...mapGetters("network", ['appApiUrl', 'getParams', 'opConfig', 'polygonConfig', 'bscConfig', 'arConfig', 'zkConfig', 'networkName']),
        ...mapGetters("web3", ['contracts']),
        ...mapGetters('insuranceData', ['insuranceRedemptionData']),
        ...mapGetters('etsAction', ['etsList']),
        ...mapGetters('deprecated', ['isDeprecatedShow']),

        networkSupport: function () {
            return this.networkName === 'optimism' ? this.networkName : null;
        },

        tabNetworkName: function() {
            let params;
            params = this.getParams('optimism')

            return params.networkName;
        },

        tabApiUrl: function() {
            let params;
            params = this.getParams('optimism')

            return params.appApiUrl;
        },

        activeTabOptimism: function() {
            return {
                'tab-button': this.tab === 'optimism',
                'tab-button-in-active': this.tab !== 'optimism',
            }
        },

        explorerLink: function () {
            if (this.tabNetworkName === 'optimism') {
                return `https://optimistic.etherscan.io/token/${OVN_INS_CONTRACT_ADDRESS_OPTIMISM}`
            }


            console.error("Not found networkId type when return INSURANCE usd+ explorer link")
            return null;
        },

        contractAddress: function () {
            if (this.tabNetworkName === 'optimism') {
                return OVN_INS_CONTRACT_ADDRESS_OPTIMISM
            }

            console.error("Not found networkId type when return INSURANCE usd+ contract address")
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
        if (!this.$route.query.tabName) {
            this.setTab(this.networkName);
            this.loadData();
        } if (this.$route.query.tabName) {
            this.setTab(this.$route.query.tabName);
            this.loadData();
        }
    },

    methods: {
        ...mapActions('network', ['setWalletNetwork']),
        ...mapActions('insuranceInvestModal', ['showInvestModal', 'showMintView', 'showRedeemView', 'showRedemptionRequestModal']),

        mintAction() {
            this.showMintView();
            this.showInvestModal();
        },

        redeemAction() {
            this.showRedeemView();
            this.showInvestModal();
        },

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        setTab(tabName) {
            this.tab = tabName;
            this.loadData();
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
                        "#002868",
                        "#C8DE42",
                        "#3FEFDA",
                        "#DE42CE"
                    ];

                    this.currentTotalData = [];
                    this.totalValue = 0;

                    for (let i = 0; i < strategies.length; i++) {
                        let element = strategies[i];
                        let currentTotalDataElement = {
                            type: element.type,
                            label: element.name,
                            fullName: element.fullName,
                            value: element.netAssetValue,
                            liquidationValue: element.liquidationValue,
                            riskFactor: element.riskFactor,
                            color: colors[i],
                            link: null
                        }

                        if (element.type === 'CORE' || element.type === 'SMM') {
                            currentTotalDataElement.link = (element.address || element.explorerAddress) ? (process.env.VUE_APP_DEBANK_EXPLORER + 'profile/' + (element.explorerAddress ? element.explorerAddress : element.address)) : ''
                        }

                        if (element.name === 'Pika USDC') {
                            currentTotalDataElement.link = (process.env.VUE_APP_ZAPPER_ACCOUNT + element.address + '?tab=dashboard')
                        }

                        if (element.type === 'ETS') {
                            let etsName = this.getEtsName(element)
                            currentTotalDataElement.link = (process.env.VUE_APP_UD_REDIRECT_URI + 'ets/' + etsName)
                        }

                        this.currentTotalData.push(currentTotalDataElement);
                        this.totalValue += element.netAssetValue ? element.netAssetValue : 0;
                    }

                    this.isCurrentTotalDataLoading = false;
                })
                .catch(e => {
                    console.error("Error while adding stablecoins to list: " + e);
                    this.isCurrentTotalDataLoading = false;
                })

        },

        getEtsName(element) {
            if (!this.etsList || !this.etsList.length) return null;

            for (let i = 0; i < this.etsList.length; i++) {
                let ets = this.etsList[i]
                let etsName;

                if (ets.id === element.id) {
                    etsName = ets.name
                    return etsName
                }
            }
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
                        } catch (e) {
                            console.error("Error while adding stablecoin to list: " + e);
                        }
                    }

                    this.isCollateralLoading = false;
                })
                .catch(e => {
                    console.debug("loadCollateralData: ", e);
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
    }
}
</script>

<style scoped>


/* mobile */
@media only screen and (max-width: 960px) {

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 32px;
        line-height: 40px;
    }

    .info-card-icon {
        width: 20px;
        height: 20px;
    }

    .investor-card-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.03em;
    }

    .investor-card-sub-title-value {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
    }

    .investor-card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.03em;
    }

    .fee-structure-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .fee-structure-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-investor-invest {
        width: 100% !important;
        height: 40px !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .about-link-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .investor-card-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.02em;
    }

    .investor-card-sub-title-value {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
    }

    .investor-card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .fee-structure-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .fee-structure-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .parent-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .current-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .btn-investor-invest {
        width: 100% !important;
        height: 44px !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .parent-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .current-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .about-link-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 18px !important;
        line-height: 24px !important;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
    }

    .hidden-label {
        width: 130px;
        height: 28px;
        background: var(--hide-account);
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .investor-card-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.02em;
    }

    .investor-card-sub-title-value {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
    }

    .investor-card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .fee-structure-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .fee-structure-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-investor-invest {
        width: 100% !important;
        height: 44px !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .parent-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .current-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .about-link-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 18px !important;
        line-height: 24px !important;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .hidden-label {
        width: 130px;
        height: 28px;
        background: var(--hide-account);
    }
}

@media only screen and (min-width: 1300px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 48px;
        line-height: 60px;
    }

    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .investor-card-sub-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 24px;
        letter-spacing: 0.02em;
    }

    .investor-card-sub-title-value {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .investor-card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 15px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .fee-structure-label {
        font-style: normal;
        font-weight: 300;
        font-size: 15px;
        line-height: 24px;
    }

    .fee-structure-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-investor-invest {
        width: 100% !important;
        height: 36px !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 28px;
    }

    .parent-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .current-page-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .about-link-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 18px !important;
        line-height: 24px !important;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.main-container {
    margin-bottom: 5% !important;
}

.parent-page-label {
    cursor: pointer;

    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--links-blue);
}

.current-page-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
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
    cursor: pointer;
}

.tab-button-in-active {
    cursor: pointer;
}

.info-card-container-white {
    background: var(--secondary);
    border-radius: 8px;
}

.info-row {
    border-top: 1px solid var(--secondary-border);
}

.header-btn {
    border-radius: 4px;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-investor-invest {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}

.btn-investor-outline {
    background: none !important;
    color: var(--links-blue) !important;
}

.btn-filled-red {
    width: 100%;
    height: 44px !important;
    background: rgba(207, 63, 146, 0.1) !important;
    color: #CF3F92 !important;
    border-radius: 4px;
}

.success-color {
    color: #22ABAC !important;
}

.sticky {
    margin-right: 4% !important;
    position: fixed !important;
}

.investor-card-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--fourth-gray-text);
}

.investor-card-sub-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
}

.investor-card-sub-title-value {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
}

.value-disabled {
    font-weight: 300 !important;
    text-transform: uppercase !important;
    color: var(--disabled-value) !important;
}

.fee-structure-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.fee-structure-value {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--fee-structure-value);
}

.about-link-label {
    font-family: 'Roboto', sans-serif !important;
    font-feature-settings: 'liga' off !important;
    color: var(--links-blue) !important;
    cursor: pointer !important;
}

.about-link-label:hover {
    text-decoration: underline !important;
}

.disabled-btn {
    background: var(--main-banner-background) !important;
    color: #9DA4B0 !important;
}

.full-status-error-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #CF3F92;
}

.disabled-btn-outline {
    color: var(--progress-text) !important;
    border-color: var(--progress-text) !important;
}

.theme--light.v-btn.v-btn--disabled {
    color: var(--progress-text) !important;
}

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
        max-width: 100% !important;
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

    .toggle-row {
        max-width: 200% !important;
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

    .toggle-row {
        max-width: 200% !important;
    }
}

@media only screen and (min-width: 1300px) {
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

    .toggle-row {
        max-width: 200% !important;
    }
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

.risk-text {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #707A8B;
}

.link-to-docs {
    text-decoration: none;
}

.text-deprecated {
    color: #707a8b;
}
</style>

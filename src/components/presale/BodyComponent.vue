
<template>
    <div>
        <div class="pt-2">
            <div class="row">
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <img src="/assets/icon/presale/step/step1.svg" width="100%" alt="Step1">
                    </div>

                    <div class="step-container">
                        <div>
                            <div class="step-title">
                                Read information
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/title-private-round.svg" alt="Private Round">
                                </div>
                            </div>
                            <div class="step-container-separator"></div>
                        </div>


                        <div class="info-group">
                            <TokenOvnInfo></TokenOvnInfo>
                        </div>

                        <div>
                            <div class="step-info-description info-group">
                                Discover incredible opportunities with Overnight! Join our launchpad and become a part of the core community. With us, you'll consistently lead the way in the DeFi realm, securing access to cutting-edge solutions.
                            </div>

                            <div class="step-container-separator"></div>

                            <div class="info-group">
                                <div class="info-sub-title">
                                    Sale Method
                                </div>
                                <div class="info-text">
                                    Overflow Farming
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-sub-title">
                                    Chains
                                </div>
                                <div class="info-text">
                                    Base
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-sub-title">
                                    Soft cap
                                </div>
                                <div class="info-text-black">
                                    {{ formattedSoftCap }} USD+
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-sub-title">
                                    Hard cap
                                </div>
                                <div class="info-text-black">
                                    {{ formattedHardCap }} USD+
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-sub-title">
                                    Overflow Farming Pool
                                </div>
                                <div class="info-text-black">
                                    {{ formattedOvnTotal }} OVN
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-sub-title">
                                    Farming bonus
                                </div>
                                <div class="info-text-blue">
                                    {{ formattedFarmingBonus }} USD+
                                </div>
                            </div>

                            <div class="step-container-separator"></div>

                            <div class="info-group">
                                <div class="row">
                                    <div class="col-6 col-lg-6 col-md-6 col-sm-6">
                                        <div class="link-container">
                                            <a href="https://overnight.fi/blog/2023/09/11/ovn-token-sale/" target="_blank">
                                                <label class="link-title ml-auto">Article</label>
                                                <div class="link-image">
                                                    <img src="/assets/icon/presale/link-blue.svg" style="width: 15px" alt="->"/>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
<!--                                    <div class="col-6 col-lg-6 col-md-6 col-sm-6">
                                        <div class="link-container">
                                            <a href="/">
                                                <label class="link-title ml-auto">Docs</label>
                                                <div class="link-image">
                                                    <img  src="/assets/icon/presale/link-blue.svg" style="width: 15px" alt="->"/>
                                                </div>
                                            </a>
                                        </div>
                                    </div>-->
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <img src="/assets/icon/presale/step/step2.svg" width="100%" alt="Step1">
                    </div>

                    <div class="step-container">
                        <div class="step-title-container">
                            <div class="step-title">
                                get presale NFT
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/title-nft.svg" alt="nft">
                                </div>
                            </div>

                            <div class="step-container-separator"></div>
                        </div>
                        <div>
                            <div class="step-info-description">
                               With Presale NFT you can participate in the $OVN presale. You can get NFT on Optimism or on Base chain.
                            </div>

                            <div class="step-container-separator"></div>

                            <div class="info-group">
                                <div class="info-title">
                                    Check status
                                </div>

                                <div class="check-nft-status-container">
                                    <div style="position:relative;">
                                        You don’t have Presale NFT

                                        <div class="check-nft-status-image">
                                            <img src="/assets/icon/presale/cancel.svg" alt="X">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-title">
                                    How to get Presale NFT
                                </div>

                                <div class="step-info-description">
                                    <div>
                                        1. Participate in a Galxe campaign
                                    </div>
                                    <div>
                                        2. Via one of our launch partners
                                    </div>
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-title">
                                    Galxe campaign
                                </div>

                                <div class="step-info-description">
                                    There are 2 campaigns on Optimism and on Base. Choose the chain that suits you best.
                                    <div class="info-group pt-10">
                                        As part of the campaign, please complete the following tasks:
                                    </div>

                                    <div>
                                        1. Reach 700 XP in <a href="https://zealy.io/c/overnight-fi/questboard" target="_blank">our Zealy</a>
                                    </div>
                                    <div>
                                        2. Claim Presale participant role in <a href="https://discord.com/invite/overnight-fi" target="_blank">our Discord</a>
                                    </div>
                                    <div>
                                        3. Mint NFT on Galxe
                                    </div>
                                </div>
                            </div>

                            <div class="info-group" style="cursor: pointer">
                                <a href="https://galxe.com/overnight" target="_blank">
                                    <img src="/assets/icon/presale/button-nft-mint.svg" alt="to mint nft">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <img src="/assets/icon/presale/step/step3.svg" width="100%" alt="Step1">
                    </div>

                    <div class="step-container">
                        <div class="step-title-container">
                            <div class="step-title">
                                Participate
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/title-participate.svg" alt="time">
                                </div>
                            </div>

                            <div class="step-container-separator"></div>
                        </div>

                        <div class="timer-container-center">
                            <div class="info-group">
                                <Timer :timestamp="presaleTimestamp" title="Presale starts in"/>
                            </div>
                        </div>

                        <div class="info-group">
                            <div class="info-sub-title">
                                Start Sale
                            </div>
                            <div class="info-text">
                                {{ presaleStartDate }}
                            </div>
                        </div>

                        <div class="info-group">
                            <div class="info-sub-title">
                                End of Sale
                            </div>
                            <div class="info-text">
                                {{ presaleEndDate }}
                            </div>
                        </div>

                        <div class="info-group">
                            <div class="info-sub-title">
                                Duration
                            </div>
                            <div class="info-text">
                                {{ differentdDysBeetwinStartAndEndPresale }} days
                            </div>
                        </div>

                        <div class="step-container-separator"></div>

                        <div class="info-group">
                            <div class="info-title" style="padding-bottom: 10px">
                                Buy $OVN
                            </div>

                            <div>
                                <PresaleBuyForm></PresaleBuyForm>
                            </div>
                        </div>


                        <div class="bottom-contract-info">
<!--                            <div class="step-container-separator"></div>-->

<!--                            <div class="info-group">
                                <div class="row">
                                    <div class="col-6 col-lg-6 col-md-6 col-sm-6">
                                        <div class="info-sub-title" style="position:relative;">
                                            Presale contract
                                            <div class="contract-info-label">
                                                <img src="/assets/icon/presale/base.svg" height="16px" alt="Base">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6 col-lg-6 col-md-6 col-sm-6">
                                        <div class="info-text contract-link">
                                            0x9ff...x9ob
                                            <div class="contract-info-label">
                                                <img src="/assets/icon/presale/link.svg" height="16px" alt="Base">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>-->
                        </div>

                    </div>
                </div>
                <div class="col-12 col-lg-3 col-md-6 col-sm-12">
                    <div>
                        <img src="/assets/icon/presale/step/step4.svg" width="100%" alt="Step1">
                    </div>

                    <div class="step-container">
                        <div class="step-title">
                            <div class="step-title-container">
                                Claim
                                <div class="title-logo">
                                    <img src="/assets/icon/presale/title-claim.svg" alt="claim">
                                </div>
                            </div>

                            <div class="step-container-separator"></div>
                        </div>

<!--                        <div class="timer-container-center">
                            <div class="info-group">
                                <Timer :timestamp="vestingTimestamp" title="Vesting starts in"/>
                            </div>
                        </div>-->

                        <div>
                            <div class="step-info-description">
                                <div class="claim-step-description">
                                    Overflow funds and farming bonus claimable on the End of sale
                                </div>
                                <div class="claim-step-description">
                                    25% of $OVN will be claimable starting 5 days after the End of Sale
                                </div>
                                <div class="claim-step-description">
                                    75% of $OVN will be linearly vested over 4 weeks period, beginning 5 days after the End of sale
                                </div>
                            </div>
                        </div>

                        <div class="step-container-separator"></div>

                        <div class="info-group">
                            <div class="info-sub-title">
                                Total  purchased
                            </div>
                            <div class="info-text-black">
                                {{formattedAccountTotalUsdPurchased}} USD+
                            </div>
                            <div class="info-text-black">
                                {{formattedAccountTotalOvnPurchased}} OVN
                            </div>
                        </div>

                        <div class="info-group">
                            <div class="info-sub-title">
                                Vesting amounts
                            </div>
                            <div class="info-text-black">
                                 {{ formattedAccountVestingAmount }} OVN
                            </div>
                        </div>

                        <div class="info-group">
                            <div class="info-sub-title">
                                Claimable
                            </div>
                            <div class="info-text-black">
                                {{ formattedAccountClaimableAmount }} OVN
                            </div>
                        </div>

                        <div class="info-group">
                            <div class="info-sub-title">
                                Farming bonus
                            </div>
                            <div class="info-text-blue">
                                {{ formattedAccountFarmingBonus }} OVN
                            </div>

                            <div class="info-group">
                                <div @click="claimOvn"
                                     class="button-buy">
                                    CLAIM OVN
                                </div>
                            </div>
                        </div>

                        <div class="step-container-separator"></div>

                        <div class="info-group">
                            <div class="info-sub-title">
                                Overflow funds
                            </div>
                            <div class="info-text-black">
                                {{ formattedAccountOverflowFunds }} OVN
                            </div>
                        </div>

                        <v-btn class="button btn-outlined" @click="claimFunds" outlined>
                            CLAIM FUNDS
                        </v-btn>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Timer from "@/components/presale/tools/Timer.vue";
import TokenOvnInfo from "@/components/presale/tools/TokeOvnInfo.vue";
import PresaleBuyForm from "@/components/presale/tools/PresaleBuyForm.vue";
import {mapGetters} from "vuex";
const moment = require('moment'); // import moment.js


export default {
    name: "BodyComponent",
    components: {PresaleBuyForm, TokenOvnInfo, Timer},
    data() {
        return {
            presaleTimestamp: 1695031200*1000,
            presaleEndTimestamp: 1696068000*1000,
            vestingTimestamp: 1697194117040,

            overflowFarmingPool: 25000,
            farmingBonus: 0,
            softCap: 350000,
            hardCap: 500000,

            // personal data
            accountTotalUsdPurchased: 0,
            accountTotalOvnPurchased: 0,
            accountVestingAmount: 0,
            accountClaimableAmount: 0,
            accountFarmingBonus: 0,
            accountOverflowFunds: 0,

            nftStatus: false,
        }
    },
    mounted() {
        // this.initUserData();
    },

    computed: {
        ...mapGetters('network', ['networkName']),


        presaleStartDate() {
            return moment(this.presaleTimestamp).utc().format('MMMM DD, YYYY hh:mm A [UTC]');
        },
        presaleEndDate() {
            return moment(this.presaleEndTimestamp).utc().format('MMMM DD, YYYY hh:mm A [UTC]');
        },
        differentdDysBeetwinStartAndEndPresale() {
            return moment(this.presaleEndTimestamp).diff(moment(this.presaleTimestamp), 'days');
        },
        vestingStartDate() {
            return moment(this.vestingTimestamp).utc().format('MMMM DD, YYYY hh:mm A [UTC]');
        },
        formattedSoftCap() {
            if (!this.softCap) {
                return "000,000";
            }

            return this.softCap.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        formattedHardCap() {
            if (!this.hardCap) {
                return "000,000";
            }

            return this.hardCap.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        formattedOvnTotal() {
            if (!this.overflowFarmingPool) {
                return "000,000";
            }

            return this.overflowFarmingPool.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        formattedFarmingBonus() {
            if (!this.farmingBonus) {
                return "000,000";
            }

            return this.farmingBonus.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountTotalUsdPurchased() {
            if (!this.accountTotalUsdPurchased) {
                return "000,000.00";
            }

            return this.accountTotalUsdPurchased.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountTotalOvnPurchased() {
            if (!this.accountTotalOvnPurchased) {
                return "000,000.00";
            }

            return this.accountTotalOvnPurchased.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountVestingAmount() {
            if (!this.accountVestingAmount) {
                return "000,000.00";
            }

            return this.accountVestingAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountClaimableAmount() {
            if (!this.accountClaimableAmount) {
                return "000,000.00";
            }

            return this.accountClaimableAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountFarmingBonus() {
            if (!this.accountFarmingBonus) {
                return "000,000.00";
            }

            return this.accountFarmingBonus.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountOverflowFunds() {
            if (!this.accountOverflowFunds) {
                return "000,000.00";
            }

            return this.accountOverflowFunds.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
    },
    methods: {
        buyAndFarm() {
            console.log("buy and farm");
        },
        claimOvn() {
            console.log("claim ovn")
        },
        claimFunds() {
            console.log("claim funds")
        },
        checkNft() {
            console.log("check nft")
            this.nftStatus = false;
        },
    }
}
</script>


<style scoped>
.step-container {
    /* Frame 28910 */
    position: relative;

    /* Auto layout */
    display: flex;
    flex-direction: column;
    padding: 28px;
    gap: 20px;

    min-height: 1100px;

    background: #FFFFFF;
    box-shadow: 0px 10px 20px rgba(9, 55, 98, 0.25);
    border-radius: 20px;
}

.step-container-separator {
    padding: 8px;
    border-bottom: 1px solid #E5E5E5;
    width: 100%;
}

.step-title {
    /* read information */
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 40px;
    /* identical to box height, or 167% */
    letter-spacing: 0.03em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;

    /* Grey/Grey 19_text */
    color: #29323E;

    padding-left: 20px;
    position: relative;
}


.title-logo {
    position: absolute;
    left: -11px;
    top: 3px;
}

.step-info-description {
    /* Secondary text regular */
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    /* or 150% */
    font-feature-settings: 'liga' off;
    /* Grey/Grey 16 */
    color: #4C586D;
}

.claim-step-description {
    padding-top: 15px;
}

.info-group {
    padding-top: 10px;
}

.info-sub-title {

    /* Caption */
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    /* identical to box height, or 157% */
    font-feature-settings: 'pnum' on, 'lnum' on;
    /* Grey/Grey 10 */
    color: #8D95A3;

}

.info-text {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
    /* identical to box height, or 156% */
    font-feature-settings: 'liga' off;
    color: #29323E;
}

.info-text-blue {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    /* or 156% */
    font-feature-settings: 'liga' off;

    /* Main blue */
    color: #1C95E7;
}

.info-text-black {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    /* or 156% */
    font-feature-settings: 'liga' off;

    /* Main blue */
    color: rgba(41, 50, 62, 1);
}

.info-title {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 800;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height, or 150% */
    letter-spacing: 0.5px;
    font-feature-settings: 'liga' off;

    /* Grey/Grey 19_text */
    color: #29323E;
}

.link-container {
    position: relative;
    cursor: pointer;
}

.link-image {
    position: absolute;
    left: 50px;
    top: 2px;
}

.link-title {
    color: #0678C4;
    cursor: pointer;
}

.button-buy {

    /* Auto layout */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 8px;
    gap: 8px;

    height: 40px;
    max-width: 150px;

    /* Blue gradient */
    //background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    background: linear-gradient(91.26deg, #989b9d 0%, rgba(120, 136, 146, 0.99) 100%);
    border-radius: 2px;

    color: white;

    cursor: pointer;
}

.btn-outlined {
    //color: var(--links-blue) !important;
    color: #989b9d;
    max-width: 150px;
}

.timer-container-center {
    display: flex;
    justify-content: center!important;
    align-items: center!important;
}


.bottom-contract-info {
    position: absolute;
    bottom: 30px;
    width: 80%;
}

.contract-info-label {
    position: absolute;
    left: 107px;
    top: 3px;
}

.contract-link {
    position:relative;
    font-size: 18px;
    cursor: pointer
}

.check-nft-status-container {
    /* Auto layout */
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 12px;
    gap: 8px;

    width: 100%;
    height: 52px;

    /* Grey/Grey 1 */
    background: #F5F5F5;
    border-radius: 8px;

    position: relative;
}

.check-nft-status-image {
    position: absolute;
    left: -20px;
    top: 3px;
    //left: 0;
}
</style>


<template>
    <div>
        <div class="pt-10 mb-10">
            <div class="disclaimer-container">
                <div class='disclaimer-title'>
                    Disclaimer
                </div>

                <div class="step-container-separator"></div>

                <div class="disclaimer-content">
                        OVERNIGHT comprises a suite of decentralized contracts spanning multiple chains, including Optimism, Arbitrum, Base, Linea, BSC, and zkSync. As a permissionless protocol, OVERNIGHT disclaims any responsibility for tokens acquired through its contracts. All users are personally accountable for understanding and acknowledging the associated risks when participating in a token that is entirely independent and unrelated to OVERNIGHT. Please note that social media posts and visible information within the OVERNIGHT app should not be construed as an endorsement of any protocol by the OVERNIGHT team. Additionally, NO content shared on any OVERNIGHT platform should be considered as financial advice or recommendations.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "DisclaimerComponent"
}
</script>


<style scoped>
.disclaimer-title {

    /* Title 1 */
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    /* identical to box height, or 122% */
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;

    color: #29323E;
}

.disclaimer-content {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    /* or 150% */
    font-feature-settings: 'liga' off;

    /* Grey/Grey 16 */
    color: #4C586D;
}

.step-container-separator {
    padding: 3px 8px;
    margin-bottom: 6px;
    border-bottom: 1px solid #E5E5E5;
    width: 100%;
}

.disclaimer-container {
    /* Frame 28910 */

    /* Auto layout */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 28px;
    gap: 20px;


    background: #FFFFFF;
    box-shadow: 0px 10px 20px rgba(9, 55, 98, 0.25);
    border-radius: 20px;
}

</style>

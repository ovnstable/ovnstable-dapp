<template>
    <div>
        <div>
            <div class="row">
                <div class="col-3 col-lg-3 col-md-3 col-sm-3">
                    <div class="">
                        <img :src="require('@/assets/icon/presale/logo.svg')" alt="logo">
                    </div>
                </div>
                <div class="col-9 col-lg-9 col-md-9 col-sm-9">
                    <div>
                        <div class="logo-subtitle">
                            Token name
                        </div>
                        <div class="logo-title">
                            Overnight ($OVN)
                        </div>
                    </div>
                    <div>
                        <div class="row">
                            <div class="col-12 col-lg-6 col-md-6 col-sm-12">
                                <div class="info-detail-container">
                                    <div class="logo-subtitle">
                                        FDV
                                    </div>
                                    <div class="logo-title-small">
                                        $20,000,000
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-lg-6 col-md-6 col-sm-12">
                                <div class="info-detail-container">
                                    <div class="logo-subtitle">
                                        Price 1 $OVN
                                    </div>
                                    <div class="logo-title-small">
                                        20 USD+
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
export default {
    name: "TokenOvnInfo"
}
</script>


<style scoped>
.logo-subtitle {

    /* Caption */
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 22px;
    /* or 157% */
    font-feature-settings: 'pnum' on, 'lnum' on;

    /* Grey/Grey 10 */
    color: #8D95A3;
}

.logo-title {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 28px;
    /* identical to box height, or 156% */
    font-feature-settings: 'liga' off;

    /* Grey/Grey 19_text */
    color: #29323E;
}

.logo-title-small {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
    /* identical to box height, or 156% */
    font-feature-settings: 'liga' off;

    /* Grey/Grey 19_text */
    color: #29323E;

}

.info-detail-container {
    border-top: 1px solid #E5E5E5;
}

</style>


<template>
    <div>
        <div class="presale-header">
            <div class="header-container">
               <div class="header-info-container">
<!--                   <img src="/assets/icon/presale/header-logo.svg" class="header-logo" alt="Logo">-->
                   <div class="header-info-text">
                       Get <span class="mark-word">most</span> from your $OVN token
                   </div>
               </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: "ClaimHeaderComponent"
}
</script>


<style scoped>

.mark-word {
    padding: 3px 12px;
    background-color: #0e7ec9;
    border-radius: 10px;
}

.header-container {
    height: 250px;
    background-image: url("/icon/claim-header.svg");
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 20px;

    display: flex;
    justify-content: start; /* align horizontal */
    /* //align-items: center; align vertical */
    /* //height: 100vh; use viewport height, ensures that the parent covers the screen */
    position: relative;
}

.header-info-container {
    width: 50%; /* or any other measurement */
    height: 50%; /* or any other measurement */
    text-align: center;
}

.header-info-text {
    font-style: normal;
    font-weight: 700;
    font-size: 60px;
    line-height: 80px;
    padding-top: 40px;
    padding-left: 40px;

    text-align: left;

    color: #FFFFFF;
}

.network-icon-container {
    position: absolute;
    top: 30px;
    right: 30px;
}


/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .header-info-text {
        padding-top: 80px;
    }

    .header-info-container {
        width: 80%; /* or any other measurement */
        height: 80%; /* or any other measurement */
        text-align: center;
    }
}

@media (max-width: 960px) {
    .header-container {
        height: 200px;
    }


    .header-logo {
        width: 200px;
    }

    .header-info-container {
        width: 100%; /* or any other measurement */
        height: 100%; /* or any other measurement */
        text-align: center;
    }


    .header-info-text {
        line-height: 50px;
        padding-top: 51px;
        padding-left: 40px;
        font-size: 40px;
    }
}
</style>

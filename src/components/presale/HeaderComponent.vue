
<template>
    <div>
        <div class="presale-header">
            <div class="header-container">
               <div class="header-info-container">
                   <img :src="require('@/assets/icon/presale/header-logo.svg')" class="header-logo" alt="Logo">
                   <div class="header-info-text">
                       Private presale round
                   </div>
               </div>

                <div class="network-icon-container">
                    <img :src="require('@/assets/icon/presale/base.svg')" alt="Base">
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: "HeaderComponent"
}
</script>


<style scoped>
.header-container {
    height: 250px;
    background-image: url("/icon/header.svg");
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 20px;

    display: flex;
    justify-content: center; /* align horizontal */
    align-items: center; /* align vertical */
    //height: 100vh; /* use viewport height, ensures that the parent covers the screen */
    position: relative;
}

.header-info-container {
    width: 50%; /* or any other measurement */
    height: 50%; /* or any other measurement */
    text-align: center;
}

.header-info-text {
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #5EAEFB;
}

.network-icon-container {
    position: absolute;
    top: 30px;
    right: 30px;
}


@media (max-width: 768px) {
    .header-container {
        height: 200px;
    }


    .header-logo {
        width: 200px;
    }


    .header-info-text {
        font-size: 20px;
    }
}
</style>

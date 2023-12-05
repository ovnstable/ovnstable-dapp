<template>
    <div>
        <div class="tokens-container">
           <div class="row">
               <div v-for="token in tokens" :key="token.id"
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
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "SelectTokenShort",
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
    methods: {
        toggleToken(token, isSelect) {
            if (isSelect) {
                this.selectTokenFunc(token);
                return;
            }

            this.removeTokenFunc(token);
        }
    }
})
</script>


<style scoped>
@media only screen and (max-width: 960px) {
    .token-symbol {
        font-size: 16px;
        line-height: 24px;
        /* identical to box height, or 120% */

        padding-left: 35px;

        color: var(--main-gray-text);

        width: 95px;
    }

    .token-image {
        height: 28px;
        width: 28px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .token-symbol {
        font-size: 18px;
        line-height: 24px;
        /* identical to box height, or 120% */

        padding-left: 35px;

        width: 95px;
    }

    .token-image {
        height: 32px;
        width: 32px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .token-symbol {
        font-size: 18px;
        line-height: 24px;
        /* identical to box height, or 120% */

        padding-left: 35px;

        width: 95px;
    }

    .token-image {
        height: 32px;
        width: 32px;
    }
}

@media only screen and (min-width: 1300px) {
    .token-symbol {
        font-size: 18px;
        line-height: 24px;
        /* identical to box height, or 120% */

        padding-left: 35px;

        width: 95px;
    }

    .token-image {
        height: 32px;
        width: 32px;
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

.token-image-container {
    display: inline-block;
    position: absolute;
    top: -5px;
    left: 0;
}
</style>

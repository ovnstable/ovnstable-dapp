<template>
    <div class="carousel-container">
        <div>
            <label class="title">Overnight Tips</label>
        </div>
        <div>
            <span
                class="list-items"
                v-html="formatDescription(currentItem.description, currentItem.linkWord, currentItem.link)">
            </span>
        </div>
    </div>

</template>

<script>
export default {
    name: "Carousel",
    data: () => ({
        items: [
            {
                id: 1,
                description: 'Swap Overnight tokens with MINIMAL FEES [here]',
                linkWord: 'here',
                link: 'https://app.overnight.fi/swap'
            },
            {
                id: 2,
                description: 'Find the BEST YIELD on the [All pools] page at a glance',
                linkWord: 'All pools',
                link: 'https://app.overnight.fi/pools'
            },
            {
                id: 3,
                description: 'Join our pools with one click with ["Zap in" button]',
                linkWord: '"Zap in" button',
                link: 'https://app.overnight.fi/featured'
            },
            {
                id: 4,
                description: 'Explore TOP POOLS on the [Featured page]',
                linkWord: 'Featured page',
                link: 'https://app.overnight.fi/featured'
            },
            {
                id: 5,
                description: 'Audit your risks on the [Collateral page]',
                linkWord: 'Collateral page',
                link: 'https://app.overnight.fi/collateral'
            },
            {
                id: 6,
                description: 'Join our [Zealy] to participate in the partner airdrop, token sale',
                linkWord: 'Zealy',
                link: 'https://zealy.io/c/overnight-fi/questboard'
            },
        ],
        currentItemIndex: 0
    }),

    computed: {
        currentItem() {
            return this.items[this.currentItemIndex];
        }
    },

    mounted() {
        this.showNextItem();
    },

    methods: {
        showNextItem() {
            if (this.currentItemIndex === this.items.length) {
                this.currentItemIndex = 0; // Reset to 0 to start over
            }
            setTimeout(() => {
                this.currentItemIndex++;
                this.showNextItem();
            }, 3000); // 3-second delay
        },

        formatDescription(description, linkWord, link) {
            return description.replace(`[${linkWord}]`, `<a href="${link}" target="_blank">${linkWord}</a>`);
        },
    }
}
</script>

<style scoped>
.carousel-container {
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.title {
    font-family: "Roboto", sans-serif;
    font-size: 24px;
    line-height: 36px;
    font-weight: 700;
    color: var(--main-gray-text);
}

.list-items {
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    line-height: 22px;
    font-weight: 400;
    color: var(--main-gray-text);
}
</style>
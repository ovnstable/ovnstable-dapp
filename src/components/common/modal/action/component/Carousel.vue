<template>
    <div class="carousel-container">
        <div>
            <label class="title">Overnight Tips</label>
        </div>
        <div>
            <span
                class="list-items"
                v-html="formatDescription(currentItem.description, currentItem.linkWord, currentItem.link)"
                @click="handleLinkClick(currentItem.link, currentItem.to_swap, currentItem.to_all_pools, currentItem.to_featured, currentItem.to_collateral, currentItem.to_zealy)">            </span>
        </div>
    </div>

</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "Carousel",
    data: () => ({
        items: [
            {
                id: 1,
                description: 'Swap Overnight tokens with MINIMAL FEES [here]',
                linkWord: 'here',
                link: 'https://app.overnight.fi/swap',
                to_all_pools: false,
                to_featured: false,
                to_swap: true,
                to_collateral: false,
                to_zealy: false,
            },
            {
                id: 2,
                description: 'Find the BEST YIELD on the [All pools] page at a glance',
                linkWord: 'All pools',
                link: 'https://app.overnight.fi/pools',
                to_all_pools: true,
                to_featured: false,
                to_swap: false,
                to_collateral: false,
                to_zealy: false,
            },
            {
                id: 3,
                description: 'Join our pools with one click with ["Zap in" button]',
                linkWord: '"Zap in" button',
                link: 'https://app.overnight.fi/featured',
                to_all_pools: false,
                to_featured: true,
                to_swap: false,
                to_collateral: false,
                to_zealy: false,
            },
            {
                id: 4,
                description: 'Explore TOP POOLS on the [Featured page]',
                linkWord: 'Featured page',
                link: 'https://app.overnight.fi/featured',
                to_all_pools: false,
                to_featured: true,
                to_swap: false,
                to_collateral: false,
                to_zealy: false,
            },
            {
                id: 5,
                description: 'Audit your risks on the [Collateral page]',
                linkWord: 'Collateral page',
                link: 'https://app.overnight.fi/collateral',
                to_all_pools: false,
                to_featured: false,
                to_swap: false,
                to_collateral: true,
                to_zealy: false,
            },
            {
                id: 6,
                description: 'Join our [Zealy] to participate in the partner airdrop, token sale',
                linkWord: 'Zealy',
                link: 'https://zealy.io/c/overnight-fi/questboard',
                to_all_pools: false,
                to_featured: false,
                to_swap: false,
                to_collateral: false,
                to_zealy: true,
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
        ...mapActions('track', ['trackClick']),

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

        handleLinkClick(link, toSwap) {
            try {
                let eventLabel = 'Carousel Links Clicked';

                if (toSwap) {
                    eventLabel = 'Swap Link Clicked';
                } else if (toAllPools) {
                    eventLabel = 'All Pools Link Clicked';
                } else if (toFeatured) {
                    eventLabel = 'Featured Link Clicked';
                } else if (toCollateral) {
                    eventLabel = 'Collateral Link Clicked';
                } else if (toZealy) {
                    eventLabel = 'Zealy Link Clicked';
                }

                this.trackClick({
                    action: 'carousel_link_clicked',
                    event_category: 'Carousel link',
                    event_label: eventLabel,
                    link: link,
                });
            } catch (e) {
                console.error("Track error:", e);
            }
        }
    }
}
</script>

<style scoped>
.carousel-container {
    padding-bottom: 30px;
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
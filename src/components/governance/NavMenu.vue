<template>

        <v-navigation-drawer app
                             width="190">
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="text-h6">
                        Governance
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        OVN
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list
                dense
                nav
            >
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    link
                    :to="{name: item.to}"
                >
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
</template>

<script>
export default {
    name: "NavMenu",

    data:()=>({
        items: [
            { title: 'Overview', icon:  require('@/assets/icon/view-dashboard.svg') , to: 'Overview' },
            { title: 'Proposals', icon:  require('@/assets/icon/folder-table-outline.svg'), to: 'Proposals'},
            { title: 'Portfolio Agent', icon:  require('@/assets/icon/chart-bar.svg'), to:  'Finance' },
        ],
    }),
}
</script>

<style scoped>

</style>

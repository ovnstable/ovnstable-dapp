export default async function getClientBalance({context, nextMiddleware}) {
    try {
        console.log('Get client balance changes')

        context.store.dispatch('web3/initWeb3').then(value => {
            context.store.dispatch('web3/initPolygonData').then(value2 => {
                context.store.dispatch('dashboardBalance/refreshClientDashboardData')
            })
        });
    } catch (e) {
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
};

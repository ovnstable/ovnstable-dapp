export default async function getStats({ context, nextMiddleware }) {
    try {
        console.log('Get Dapp/UsdtStats');

        context.store.dispatch('menuUI/selectTab', 'usdtplus_performance');
        // context.store.dispatch('statsData/refreshStats');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
}

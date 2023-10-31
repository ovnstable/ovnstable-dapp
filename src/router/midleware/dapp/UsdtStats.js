export default async function getStats({ context, nextMiddleware }) {
    try {
        console.log('Get Dapp/UsdtStats');

        context.store.dispatch('menuUI/selectTab', 'usdtplus_performance');
    }
    catch(e){
        console.log(e);
        return context.next(false);
    }
    return nextMiddleware()
}

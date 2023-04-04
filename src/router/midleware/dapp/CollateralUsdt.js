export default async function getCollateral({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/UsdtCollateral');

        context.store.dispatch('menuUI/selectTab', 'usdtplus_collateral');
        context.store.dispatch('statsData/refreshStats');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
}

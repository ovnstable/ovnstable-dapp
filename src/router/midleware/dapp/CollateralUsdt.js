export default async function getCollateral({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/UsdtCollateral');

        context.store.dispatch('menuUI/selectTab', 'usdtplus_collateral');
    }
    catch(e){
        console.log(e);
        return context.next(false);
    }
    return nextMiddleware()
}

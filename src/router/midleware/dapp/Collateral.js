export default async function getCollateral({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/Collateral');

        context.store.dispatch('menuUI/selectTab', 'usdplus_collateral');
    }
    catch(e){
        console.log(e);
        return context.next(false);
    }
    return nextMiddleware()
}

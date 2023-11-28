export default async function getCollateral({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/DaiCollateral');

        context.store.dispatch('menuUI/selectTab', 'daiplus_collateral');
    }
    catch(e){
        console.log(e);
        return context.next(false);
    }
    return nextMiddleware()
}

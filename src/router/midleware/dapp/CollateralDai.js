export default async function getCollateral({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/DaiCollateral');

        context.store.dispatch('menuUI/selectTab', 'daiplus_collateral');
        context.store.dispatch('statsData/refreshStats');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
}

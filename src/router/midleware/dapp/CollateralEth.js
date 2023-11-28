export default async function getCollateral({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/EthCollateral');

        context.store.dispatch('menuUI/selectTab', 'ethplus_collateral');
    }
    catch(e){
        console.log(e);
        return context.next(false);
    }
    return nextMiddleware()
}

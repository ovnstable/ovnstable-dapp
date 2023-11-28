export default async function getMarket({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/Market');

        context.store.dispatch('menuUI/selectTab', 'ets');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
}

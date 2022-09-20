export default async function getWmatic({ context, nextMiddleware }){
    try {
        console.debug('Get Dapp/Ets');

        context.store.dispatch('menuUI/selectTab', 'market');
        context.store.dispatch('statsData/refreshStats');
        context.store.dispatch('marketData/refreshMarket');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
};

export default async function getMarket({ context, nextMiddleware }){
    try {
        console.debug('Get Dapp/Market');

        context.store.dispatch('menuUI/selectTab', 'market');
        context.store.dispatch('statsData/refreshStats');

        context.store.dispatch('poolAction/getPoolList');

        await context.store.dispatch('etsAction/initEtsList').then(value => {
            context.store.dispatch('marketData/refreshMarket');
        });
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
};

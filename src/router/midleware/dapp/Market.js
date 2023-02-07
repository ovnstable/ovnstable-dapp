export default async function getMarket({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/Market');

        context.store.dispatch('menuUI/selectTab', 'ets');

        // await context.store.dispatch('etsAction/initEtsList').then(value => {
        //     context.store.dispatch('marketData/refreshMarket');
        // });

        context.store.dispatch('statsData/refreshStats');
        // context.store.dispatch('poolAction/getPoolList');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
}

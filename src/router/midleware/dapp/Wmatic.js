export default async function getWmatic({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/Hedged/WMATIC');

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

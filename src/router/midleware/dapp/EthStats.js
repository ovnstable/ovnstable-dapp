export default async function getStats({ context, nextMiddleware }) {
    try {
        console.log('Get Dapp/EthStats');

        context.store.dispatch('menuUI/selectTab', 'ethplus_performance');
        // context.store.dispatch('statsData/refreshStats');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
}

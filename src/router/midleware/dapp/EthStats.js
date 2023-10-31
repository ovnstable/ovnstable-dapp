export default async function getStats({ context, nextMiddleware }) {
    try {
        console.log('Get Dapp/EthStats');

        context.store.dispatch('menuUI/selectTab', 'ethplus_performance');
    }
    catch(e){
        console.log(e);
        return context.next(false);
    }
    return nextMiddleware()
}

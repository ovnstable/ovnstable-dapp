export default async function getStats({ context, nextMiddleware }) {
    try {
        console.log('Get Dapp/Stats');

        context.store.dispatch('menuUI/selectTab', 'usdplus_performance');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
}

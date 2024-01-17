export default async function getStats({ context, nextMiddleware }) {
    try {
        context.store.dispatch('menuUI/selectTab', 'usdcplus_performance');
    }
    catch(e){
        console.log(e);
        return context.next(false);
    }
    return nextMiddleware()
}

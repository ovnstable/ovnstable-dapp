export default async function getDashboard({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/Dashboard');

        context.store.dispatch('menuUI/selectTab', 'dashboard');
    }
    catch(e){
        console.log(e);
        return context.next(false);
    }
    return nextMiddleware()
}

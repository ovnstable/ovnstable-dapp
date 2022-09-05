export default async function getDashboard({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/Dashboard');

        context.store.dispatch('menuUI/selectTab', 'dashboard');
        context.store.dispatch('dashboardData/refreshDashboard');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
};

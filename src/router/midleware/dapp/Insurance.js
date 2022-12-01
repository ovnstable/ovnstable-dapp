export default async function getInsurance({ context, nextMiddleware }){
    try {
        console.debug('Get Dapp/Insurance');

        context.store.dispatch('menuUI/selectTab', 'insurance');
        context.store.dispatch('insuranceData/refreshInsurance');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
};

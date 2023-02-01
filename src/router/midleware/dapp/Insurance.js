export default async function getInsurance({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/Insurance');

        context.store.dispatch('insuranceData/refreshInsurance');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
}

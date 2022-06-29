export default async function getSwap({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/Wrap');

        context.store.dispatch('wrapData/refreshWrap');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
};

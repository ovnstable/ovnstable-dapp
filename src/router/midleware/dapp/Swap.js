export default async function getSwap({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/Swap');

        context.store.dispatch('swapData/refreshSwap');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
};

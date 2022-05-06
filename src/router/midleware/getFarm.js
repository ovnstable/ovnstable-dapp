export default async function getDapp({ context, nextMiddleware }){
    try {
        console.log('Middleware: Get Farm');
        context.store.dispatch('web3/initWeb3').then(value => {
            context.store.dispatch('farm/loadPools');
        });
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
};

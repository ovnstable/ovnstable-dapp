export default async function getFarm({ context, nextMiddleware }){
    try {
        console.log('Get Dapp/Farm');

        context.store.dispatch('farmData/refreshFarm');

    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
};

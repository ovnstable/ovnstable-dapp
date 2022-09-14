export default async function getDapp({ context, nextMiddleware }){
    try {
        console.debug('Get Dapp');
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
};

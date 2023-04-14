export default async function getAbroad({ context, nextMiddleware }){
    try {
        context.store.dispatch('web3/initWeb3').then(value => {
            context.store.dispatch('governance/getAbroad', 'USD+');
            context.store.dispatch('ethers/initProvider');
        });
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
}

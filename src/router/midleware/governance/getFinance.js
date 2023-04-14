export default async function getFinance({ context, nextMiddleware }){
    try {
        context.store.dispatch('web3/initWeb3').then(value => {
            context.store.dispatch('governance/getFinance', 'USD+');
            context.store.dispatch('ethers/initProvider');
        });
    }
    catch(e){
        console.error(e);
        return context.next(false);
    }
    return nextMiddleware()
}

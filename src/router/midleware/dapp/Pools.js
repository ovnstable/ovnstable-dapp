export default async function getPools({ context, nextMiddleware }){
  try {
    console.debug('Get Dapp/Pools');

    await context.store.dispatch('etsAction/initEtsList').then(value => {
      context.store.dispatch('marketData/refreshMarket');
    });

    context.store.dispatch('statsData/refreshStats')
    context.store.dispatch('poolAction/getPoolList');
  }
  catch(e){
    console.error(e);
    return context.next(false);
  }
  return nextMiddleware()
};

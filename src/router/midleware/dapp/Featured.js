export default async function getFeatured({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/Featured');

    context.store.dispatch('menuUI/selectTab', 'featured');

    await context.store.dispatch('etsAction/initEtsList').then(value => {
      context.store.dispatch('marketData/refreshMarket');
    });

    context.store.dispatch('statsData/refreshStats')
  }
  catch(e){
    console.error(e);
    return context.next(false);
  }
  return nextMiddleware()
}

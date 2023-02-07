export default async function getPools({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/Pools');

    context.store.dispatch('menuUI/selectTab', 'usdplus_pools');

    // await context.store.dispatch('poolAction/getPoolList').then(value => {
    //   context.store.dispatch('statsData/refreshStats')
    // });
  }
  catch(e){
    console.error(e);
    return context.next(false);
  }
  return nextMiddleware()
}

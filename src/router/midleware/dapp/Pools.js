export default async function getPools({ context, nextMiddleware }){
  try {
    console.debug('Get Dapp/Pools');

    context.store.dispatch('menuUI/selectTab', 'pools');

    context.store.dispatch('statsData/refreshStats')
    context.store.dispatch('poolAction/getPoolList');
  }
  catch(e){
    console.error(e);
    return context.next(false);
  }
  return nextMiddleware()
};

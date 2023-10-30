export default async function getPools({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/Pools');

    context.store.dispatch('menuUI/selectTab', 'pools');

  }
  catch(e){
    console.log(e);
    return context.next(false);
  }
  return nextMiddleware()
}

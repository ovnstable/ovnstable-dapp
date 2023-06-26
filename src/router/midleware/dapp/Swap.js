export default async function getSwap({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/Swap');
    context.store.dispatch('menuUI/selectTab', 'swap-odos');
  }
  catch(e){
    console.error(e);
    return context.next(false);
  }
  return nextMiddleware()
}

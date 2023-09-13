export default async function getBridge({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/Bridge');
    context.store.dispatch('menuUI/selectTab', 'bridge');
  }
  catch(e){
    console.error(e);
    return context.next(false);
  }
  return nextMiddleware()
}

export default async function getPools({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/ProvideLp');

    context.store.dispatch('menuUI/selectTab', 'provide-lp');
  }
  catch(e){
    console.error(e);
    return context.next(false);
  }
  return nextMiddleware()
}

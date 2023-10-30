export default async function getPresale({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/Presale');
    context.store.dispatch('menuUI/selectTab', 'presale');
  }
  catch(e){
    console.log(e);
    return context.next(false);
  }
  return nextMiddleware()
}

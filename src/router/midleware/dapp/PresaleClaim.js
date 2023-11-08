export default async function getPresaleClaim({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/PresaleClaim');
    context.store.dispatch('menuUI/selectTab', 'claim');
  }
  catch(e){
    console.log(e);
    return context.next(false);
  }
  return nextMiddleware()
}

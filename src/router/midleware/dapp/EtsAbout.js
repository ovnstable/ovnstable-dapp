export default async function getEtsAbout({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/Ets');

    context.store.dispatch('menuUI/selectTab', 'ets_about');
  }
  catch(e){
    console.log(e);
    return context.next(false);
  }
  return nextMiddleware()
}

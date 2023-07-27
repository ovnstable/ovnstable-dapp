export default async function getSwipe({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/Swipe');
    context.store.dispatch('menuUI/selectTab', 'swipe-odos');
  }
  catch(e){
    console.error(e);
    return context.next(false);
  }
  return nextMiddleware()
}

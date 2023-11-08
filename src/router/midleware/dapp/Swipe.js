export default async function getSwipe({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/Swipe');
    context.store.dispatch('menuUI/selectTab', 'swipe-odos');
  }
  catch(e){
    console.log(e);
    return context.next(false);
  }
  return nextMiddleware()
}

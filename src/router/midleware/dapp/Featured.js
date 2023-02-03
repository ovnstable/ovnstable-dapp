export default async function getFeatured({ context, nextMiddleware }){
  try {
    console.log('Load Featured page');
    context.store.dispatch('menuUI/selectTab', 'featured');
  }
  catch(e){
    console.error(e);
    return context.next(false);
  }
  return nextMiddleware()
}

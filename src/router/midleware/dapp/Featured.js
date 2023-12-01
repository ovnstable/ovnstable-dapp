export default async function getFeatured({ context, nextMiddleware }){
  try {
    context.store.dispatch('menuUI/selectTab', 'featured');
  }
  catch(e){
    console.log(e);
    return context.next(false);
  }
  return nextMiddleware()
}

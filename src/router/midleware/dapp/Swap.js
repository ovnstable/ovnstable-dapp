export default async function getSwap({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/Swap');
  }
  catch(e){
    return context.next(false);
  }
  return nextMiddleware()
}

export default async function getSwap({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/Swap');
  }
  catch(e){
    console.log(e);
    return context.next(false);
  }
  return nextMiddleware()
}

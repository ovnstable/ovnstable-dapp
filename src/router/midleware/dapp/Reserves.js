export default async function getReserves({ context, nextMiddleware }){
  try {
    console.log('Get Dapp/Reserves');

    context.store.dispatch('insuranceData/refreshInsurance');
  }
  catch(e){
    console.error(e);
    return context.next(false);
  }
  return nextMiddleware()
}

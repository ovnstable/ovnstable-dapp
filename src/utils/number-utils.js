import BN from "bn.js";


export function _fromE6(value) {
  return value / 10 ** 6;
}

export function _fromE18(value) {
  return new BN(value.toString()).divRound(new BN(10).pow(new BN(18))).toString();
}
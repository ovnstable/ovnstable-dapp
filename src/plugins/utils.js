import BN from "bn.js";

let accounting = require("accounting-js")
let moment = require("moment");

let accountingEightConfig = {
    symbol: "",
    precision: 8,
    thousand: " ",
}

let accountingConfig = {
    symbol: "",
    precision: 6,
    thousand: " ",
}

let accountingFourConfig = {
    symbol: "",
    precision: 4,
    thousand: " ",
}

let accountingThreeConfig = {
    symbol: "",
    precision: 3,
    thousand: " ",
}

let accountingSecondConfig = {
    symbol: "",
    precision: 2,
    thousand: " ",
}

let accountingFirstConfig = {
    symbol: "",
    precision: 1,
    thousand: " ",
}

let accountingZeroConfig = {
    symbol: "",
    precision: 0,
    thousand: " ",
}

let accountingFourConfigComma = {
    symbol: "",
    precision: 4,
    thousand: ",",
}

let accountingSecondConfigComma = {
    symbol: "",
    precision: 2,
    thousand: ",",
}

let accountingFirstConfigComma = {
    symbol: "",
    precision: 1,
    thousand: ",",
}

let accountingZeroConfigComma = {
    symbol: "",
    precision: 0,
    thousand: ",",
}

export default {

    formatMoney(number = 0, count = 6) {

        if (!number) {
            return 0;
        }

        switch (count){
            case 6:
                return accounting.formatMoney(number, accountingConfig);
            case 4:
                return accounting.formatMoney(number, accountingFourConfig);
            case 3:
                return accounting.formatMoney(number, accountingThreeConfig);
            case 2:
                return accounting.formatMoney(number, accountingSecondConfig);
            case 1:
                return accounting.formatMoney(number, accountingFirstConfig);
            case 0:
                return accounting.formatMoney(number, accountingZeroConfig);
        }
    },

    formatMoneyComma(number = 0, count = 6) {

        if (!number) {
            return 0;
        }

        switch (count){
            case 4:
                return accounting.formatMoney(number, accountingFourConfigComma);
            case 2:
                return accounting.formatMoney(number, accountingSecondConfigComma);
            case 1:
                return accounting.formatMoney(number, accountingFirstConfigComma);
            case 0:
                return accounting.formatMoney(number, accountingZeroConfigComma);

        }
    },

    formatDate(date, pattern){
        return moment(date, pattern, true)
    },

    fromE18: (value) => new BN(value.toString()).divRound(new BN(10).pow(new BN(18))).toString(),
    toE18: (value) => new BN(value).mul(new BN(10).pow(new BN(18))).toString(),

    toE6: (value) => value * 10 ** 6,
    fromE6: (value) => value / 10 ** 6,

    toFixedDown: (fixed, n) => `${fixed}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${n}})?`))[0],
}

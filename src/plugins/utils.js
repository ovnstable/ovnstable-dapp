import BN from "bignumber.js";
import dayjs from "dayjs";

let accounting = require("accounting-js")

let accountingEightConfig = {
    symbol: "",
    precision: 8,
    thousand: " ",
}

let accountingSixConfig = {
    symbol: "",
    precision: 6,
    thousand: " ",
}

let accountingFiveConfig = {
    symbol: "",
    precision: 5,
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

let accountingFiveConfigComma = {
    symbol: "",
    precision: 5,
    thousand: ",",
}

let accountingSixConfigComma = {
    symbol: "",
    precision: 6,
    thousand: ",",
}

let accountingSevenConfigComma = {
    symbol: "",
    precision: 7,
    thousand: ",",
}

let accountingEightConfigComma = {
    symbol: "",
    precision: 8,
    thousand: ",",
}

let accountingNineConfigComma = {
    symbol: "",
    precision: 9,
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

let possibleTextForRandom = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default {
    getRandomString(randomLength = 10) {
        let text = "";

        for (let i = 0; i < randomLength; i++) {
            text += possibleTextForRandom.charAt(Math.floor(Math.random() * possibleTextForRandom.length));
        }

        return text;
    },

    formatNumberToMln(num,  count = 3) {
        let res = num / 1000000;
        if (res < 1) {
            count = 3;
        }

        return (res).toFixed(count);
    },

    formatNumberToThousands(num,  count = 3) {
        let res = num / 1000;
        if (res < 1) {
            count = 3;
        }

        return (res).toFixed(count);
    },

    formatMoney(number = 0, count = 6) {

        if (!number) {
            return 0;
        }

        switch (count){
            case 9:
                return accounting.formatMoney(number, accountingNineConfigComma);
            case 8:
                return accounting.formatMoney(number, accountingEightConfigComma);
            case 7:
                return accounting.formatMoney(number, accountingSevenConfigComma);
            case 6:
                return accounting.formatMoney(number, accountingSixConfig);
            case 5:
                return accounting.formatMoney(number, accountingFiveConfig);
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
            default:
                return accounting.formatMoney(number, accountingSecondConfig);    
        }
    },

    fixedBySymbol(price) {
        if (price==null){
            return 2
        } else {
            const orderOfMagnitude = Math.floor(Math.log10(price));
            return Math.max(2, orderOfMagnitude + 2);
        }
    },
      

    formatMoneyComma(number = 0, count = 6) {

        if (!number) {
            return 0;
        }

        switch (count){
            case 6:
                return accounting.formatMoney(number, accountingSixConfigComma);
            case 5:
                return accounting.formatMoney(number, accountingFiveConfigComma);
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
        return dayjs(date).format(pattern)
    },

    fromE18: (value) => new BN(value.toString()).divRound(new BN(10).pow(new BN(18))).toString(),
    toE18: (value) => new BN(value).mul(new BN(10).pow(new BN(18))).toString(),

    toE6: (value) => value * 10 ** 6,
    fromE6: (value) => value / 10 ** 6,

    toFixedDown: (fixed, n) => `${fixed}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${n}})?`))[0],
}

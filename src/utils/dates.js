import dayjs from "dayjs";

export const unixTsToDateStr = (timestamp, format = "DD.MM.YYYY") => {
  return dayjs.unix(timestamp).format(format);
};

export const differenceInDays = (tsOne, tsTwo) => {
  return dayjs(tsOne).diff(tsTwo, "day");
};

export const getUnixTsNow = () => dayjs().unix();

import dayjs from "dayjs";

export const unixTsToDateStr = (timestamp, format = "DD.MM.YYYY") => {
  return dayjs.unix(timestamp).format(format);
};

export const differenceInDays = (tsOne, tsTwo) => {
  return dayjs(tsOne).diff(tsTwo, "day");
};

export const difference = (time1,time2) => {
  const date1 = dayjs(time1);
  const date2 = dayjs(time2);

  return date1.isBefore(date2) ? 1 : date1.isAfter(date2) ? -1 : 0;
}

export const getUnixTsNow = () => dayjs().unix();

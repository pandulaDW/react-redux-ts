export const addZero = (num: number): string =>
  num < 10 ? `0${num}` : `${num}`;

export const createDateKey = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}-${addZero(month)}-${addZero(day)}`;
};

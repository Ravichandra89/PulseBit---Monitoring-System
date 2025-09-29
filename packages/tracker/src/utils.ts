export const endOfDay = (date: Date): Date => {
  const newDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  newDate.setUTCHours(23, 59, 59, 999);
  return newDate;
};

export const startOfDay = (date: Date): Date => {
  const newDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
};

export const isSameDay = (date1: Date, date2: Date): boolean =>
  startOfDay(date1).toUTCString() === startOfDay(date2).toUTCString();

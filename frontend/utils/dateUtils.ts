export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isBeforeMidnight = (date: Date) => {
  const midnight = new Date(date);
  midnight.setHours(23, 59, 59, 999);
  return date < midnight;
};
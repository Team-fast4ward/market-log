interface getDateInterface {
  date: Date;
  month: string;
  today: string;
}

export const getDate = (): getDateInterface => {
  const today = new Date();

  const dateObj: getDateInterface = {
    date: today,
    month: String(today.getMonth() + 1).padStart(2, '0'),
    today: String(today.getDate()).padStart(2, '0'),
  };

  return dateObj;
};

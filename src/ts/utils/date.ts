interface getDateInterface {
  year: string;
  month: string;
  date: string;
}

export const getDate = (prevDateNum: number = 0): getDateInterface => {
  const today = new Date();

  const dateObj: getDateInterface = {
    year: String(today.getFullYear()),
    month: String(today.getMonth() + 1).padStart(2, '0'),
    date: String(today.getDate()).padStart(2, '0'),
  };

  if (!prevDateNum) return dateObj;
  else {
    const prevDate = new Date(
      Number(dateObj.year),
      Number(dateObj.month) - 1,
      Number(dateObj.date) - prevDateNum,
    );

    const prevDateObj: getDateInterface = {
      year: String(prevDate.getFullYear()),
      month: String(prevDate.getMonth() + 1).padStart(2, '0'),
      date: String(prevDate.getDate()).padStart(2, '0'),
    };

    return prevDateObj;
  }
};

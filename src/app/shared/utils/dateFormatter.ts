
export function dateFormatter(date: Date, format = 'yyyy-mm-dd') {

  const year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let _month = month.toLocaleString().length === 2 ? `${month + 1}` : `0${month + 1}`
  let _day = day.toLocaleString().length === 2 ? `${day}` : `0${day}`

  return `${year}-${_month}-${_day}`;
};

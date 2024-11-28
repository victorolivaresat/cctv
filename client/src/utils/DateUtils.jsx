// dateUtils.js

export const formatDate = (date) => {
  const formattedDate = new Date(date);
  const day = formattedDate.getDate().toString().padStart(2, "0");
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = formattedDate.getFullYear();
  const hours = formattedDate.getHours().toString().padStart(2, "0");
  const minutes = formattedDate.getMinutes().toString().padStart(2, "0");
  const seconds = formattedDate.getSeconds().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const getYesterdayDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 2);
  date.setHours(date.getHours() - 5);
  return date;
};

export const getTomorrowDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(date.getHours() - 5);
  return date;
};

export const formatDateInput = (date) => {
  const formattedDate = new Date(date);
  const day = formattedDate.getDate().toString().padStart(2, "0");
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = formattedDate.getFullYear();
  return `${year}-${month}-${day}`;
};



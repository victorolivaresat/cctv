import { format } from 'date-fns';

export const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm:ss');
};

export const getYesterdayDate = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today.toISOString().split('T')[0];
};

export const getTomorrowDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().split('T')[0];
};

export const formatDateInput = (date) => {
  return format(new Date(date), 'yyyy-MM-dd');
};

export const formatDateInputTime = (date) => {
  return format(new Date(date), 'yyyy-MM-ddTHH:mm:ss');
};

export const validateDateRange = (startDate, endDate, maxDays = 60) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= maxDays;
};

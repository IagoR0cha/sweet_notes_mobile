import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

export function useTransformDate(date: Date | string, format?: string) {
  return dayjs(date).locale('pt-BR').format(format || 'DD/MM/YYYY');
}

export function stringToDate(date: string, split?: string) {
  const arrayDate = date.split(split || '-').map((item) => parseInt(item));
  return new Date(arrayDate[0], arrayDate[1] - 1, arrayDate[2]);
}
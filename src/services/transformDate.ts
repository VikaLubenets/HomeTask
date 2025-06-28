export const transformDate = (dayNum: number): string => {
  if (dayNum == null) return '';

  const baseDate = new Date(2024, 0, 1);
  baseDate.setDate(baseDate.getDate() + dayNum);

  const day = baseDate.getDate();
  const monthTitles = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  const month = baseDate.getMonth();

  return `${day} ${monthTitles[month]}`;
};

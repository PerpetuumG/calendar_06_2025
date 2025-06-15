// Форматировать продолжительность в минутах в формат ("1 час 30 минут")
export function formatEventDescription(durationInMinutes: number): string {
  const hours = Math.floor(durationInMinutes / 60); // Получить количество полных часов
  const minutes = durationInMinutes % 60; //Получить оставшиеся минуты после удаления полных часов

  // Форматирование строки минут (например, «1 мин» или «10 мин»)
  const minutesString = `${minutes} ${minutes > 1 ? 'минуты' : 'минута'}`;
  // Форматирование строки часов (например, «1 ч» или «2 ч»)
  const hoursString = `${hours} ${hours > 1 ? 'часов' : 'час'}`;

  // Возвращение только минут, если нет полных часов
  if (hours === 0) return minutesString;
  // Возвращение только часов, если нет дополнительных минут
  if (minutes === 0) return hoursString;
  // Возвращение часов и минут, если оба параметра присутствуют
  return `${hoursString} ${minutesString}`;
}

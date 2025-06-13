export const DAYS_OF_WEEK_IN_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const PrivateNavLinks = [
  {
    imgURL: '/assets/events.svg',
    route: '/events',
    label: 'Мои события',
  },
  {
    imgURL: '/assets/schedule.svg',
    route: '/schedule',
    label: 'Мое расписание',
  },
  {
    imgURL: '/assets/public.svg',
    route: '/book',
    label: 'Публичный профиль',
  },
] as const;

import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { DAYS_OF_WEEK_IN_ORDER } from '@/constants';
import { relations } from 'drizzle-orm';

// Определить многократно используемый столбец временной метки `createdAt` со значением по умолчанию, установленным на текущее время
const createdAt = timestamp('createdAt').notNull().defaultNow();

// Определить многократно используемый столбец временной метки `updatedAt` с автоматическим обновлением при изменении
const updatedAt = timestamp()
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date()); // автоматически обновляется до текущего времени при обновлении

// Определите таблицу «events(события)» с полями, такими как имя, описание и продолжительность
export const EventTable = pgTable(
  'events', // Имя таблицы в базе данных
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // уникальный идентификатор с UUID по умолчанию
    // uuid(«id»): Определяет столбец с именем «id» типа UUID.

    // .primaryKey(): Делает этот UUID первичным ключом таблицы.

    // .defaultRandom(): Автоматически заполняет этот столбец случайно сгенерированным UUID (v4), если значение не указано.
    name: text('name').notNull(), // название события, notNull означает, что это поле обязательно для заполнения
    description: text('description'), // описание события, может быть пустым (опционально)
    durationInMinutes: integer('durationInMinutes').notNull(), // продолжительность события
    clerkUserId: text('clerkUserId').notNull(), // Идентификатор пользователя, создавшего его (из Clerk)
    isActive: boolean('isActive').notNull().default(true), // является ли событие активным в данный момент
    createdAt, // когда событие было создано
    updatedAt, // когда событие было обновлено
  },
  (table) => [
    index('clerkUserIdIndex').on(table.clerkUserId), // индекс по clerkUserId для ускорения запросов
  ],
);

// Определить таблицу «schedules(расписания)», по одной на каждого пользователя, с часовым поясом и временными метками
export const ScheduleTable = pgTable('schedules', {
  id: uuid('id').primaryKey().defaultRandom(), // первичный ключ со случайным UUID
  timezone: text('timezone').notNull(), // часовой пояс пользователя
  clerkUserID: text('clerkUserId').notNull().unique(), // уникальный идентификатор пользователя от Clerk
  createdAt, // когда был создан график
  updatedAt, // когда расписание было обновлено в последний раз
});

// Определить отношения для ScheduleTable: расписание имеет много доступных вариантов
export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
  availabilities: many(ScheduleAvailabilityTable), // отношение «один ко многим»
}));

// Определить ENUM PostgreSQL для дней недели
export const scheduleDayOfWeekEnum = pgEnum('day', DAYS_OF_WEEK_IN_ORDER);

// Определить таблицу «scheduleAvailabilities», в которой хранятся доступные временные интервалы в день
export const ScheduleAvailabilityTable = pgTable(
  'scheduleAvailabilities',
  {
    id: uuid('id').primaryKey().defaultRandom(), // уникальный ID
    scheduleId: uuid('scheduleId') // внешний ключ к таблице Schedule
      .notNull()
      .references(() => ScheduleTable.id, { onDelete: 'cascade' }), // каскадное удаление при удалении расписания
    startTime: text('startTime').notNull(), // время начала доступности (например, «09:00»)
    endTime: text('endTime').notNull(), // время окончания доступности (например, «17:00»)
    dayOfWeek: scheduleDayOfWeekEnum('dayOfWeek').notNull(), // день недели (ENUM)
  },
  (table) => [index('scheduleIdIndex').on(table.scheduleId)], // индекс на внешнем ключе для более быстрого поиска
);

// Определить обратное отношение: каждая доступность принадлежит расписанию
export const ScheduleAvailabilityRelations = relations(ScheduleAvailabilityTable, ({ one }) => ({
  schedule: one(ScheduleTable, {
    fields: [ScheduleAvailabilityTable.scheduleId], // локальный ключ
    references: [ScheduleTable.id], // внешний ключ
  }),
}));

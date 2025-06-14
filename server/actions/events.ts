'use server';

import { eventFormSchema } from '@/schema/events';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { EventTable } from '@/drizzle/schema';
import { db } from '@/drizzle/db';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';

// Эта функция создает новое событие в базе данных после проверки введенных данных.
export async function createEvent(
  unsafeData: z.infer<typeof eventFormSchema>, // Принимает необработанные данные событий, проверенные схемой zod.
): Promise<void> {
  try {
    // Аутентификация пользователя с помощью Clerk
    const { userId } = await auth();

    // Проверьте входящие данные на соответствие схеме формы события.
    const { success, data } = eventFormSchema.safeParse(unsafeData);

    // Если проверка не прошла или пользователь не прошел аутентификацию, выдать ошибку.
    if (!success || !userId) {
      throw new Error('Неверные данные формы или пользователь не авторизован');
    }

    // Вставьте проверенные данные о событии в базу данных, связав их с авторизованным пользователем.
    await db.insert(EventTable).values({ ...data, clerkUserId: userId });
  } catch (error: any) {
    // Если в процессе происходит какая-либо ошибка, вызывайте новую ошибку с понятным сообщением.
    throw new Error(`Ошибка создания события: ${error.message || error}`);
  } finally {
    // Перепроверьте путь „/events“, чтобы убедиться, что страница загружает свежие данные после операции с базой данных.
    revalidatePath('/events');
  }
}

// Эта функция обновляет существующее событие в базе данных после проверки введенных данных и проверки права собственности.
export async function updateEvent(
  id: string, // Идентификатор события для обновления
  unsafeData: z.infer<typeof eventFormSchema>, // Необработанные данные событий для проверки и обновления
): Promise<void> {
  try {
    // Аутентифицировать пользователя
    const { userId } = await auth();

    // Проверьте входящие данные на соответствие схеме формы события.
    const { success, data } = eventFormSchema.safeParse(unsafeData);

    // Если проверка не прошла или пользователь не прошел аутентификацию, выдать ошибку.
    if (!success || !userId) {
      throw new Error('Недопустимые данные события или пользователь не прошел аутентификацию.');
    }

    // Попытка обновить событие в базе данных
    const { rowCount } = await db
      .update(EventTable)
      .set({ ...data }) // Обновление с подтвержденными данными
      .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId))); // Убедитесь, что пользователь является владельцем события

    // Если событие не было обновлено (либо не найдено, либо не принадлежит пользователю), выдать ошибку.
    if (rowCount === 0) {
      throw new Error('Событие не найдено или пользователь не имеет права обновлять это событие.');
    }
  } catch (error: any) {
    // Если происходит какая-либо ошибка, вызывайте новую ошибку с понятным сообщением
    throw new Error(`Не удалось обновить событие: ${error.message || error}`);
  } finally {
    // Перепроверьте путь „/events“, чтобы убедиться, что страница загружает свежие данные после операции с базой данных.
    revalidatePath('/events');
  }
}

// Эта функция удаляет существующее событие из базы данных после проверки права собственности пользователя.
export async function deleteEvent(
  id: string, // Идентификатор события для удаления
): Promise<void> {
  try {
    // Аутентифицировать пользователя
    const { userId } = await auth();

    // Выдавать ошибку, если нет авторизованного пользователя
    if (!userId) {
      throw new Error('Пользователь не авторизован.');
    }

    // Попытка удалить событие только в том случае, если оно принадлежит авторизованному пользователю
    const { rowCount } = await db
      .delete(EventTable)
      .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

    // Если событие не было удалено (либо не найдено, либо не принадлежит пользователю), выдать ошибку.
    if (rowCount === 0) {
      throw new Error('Событие не найдено или пользователь не имеет права удалять это событие.');
    }
  } catch (error: any) {
    // Если происходит какая-либо ошибка, вызывайте новую ошибку с понятным сообщением.
    throw new Error(`Не удалось удалить событие: ${error.message || error}`);
  } finally {
    // Перепроверьте путь „/events“, чтобы убедиться, что страница загружает свежие данные после операции с базой данных.
    revalidatePath('/events');
  }
}

// Вывести тип строки из схемы EventTable
type EventRow = typeof EventTable.$inferSelect;

// Асинхронная функция для получения всех событий (активных и неактивных) для конкретного пользователя
export async function getEvents(clerkUserId: string): Promise<EventRow[]> {
  // Запрос к базе данных о событиях, в которых clerkUserId совпадает
  const events = await db.query.EventTable.findMany({
    //where: — Это определяет фильтр (условие WHERE) для вашего запроса.

    // clerkUserId — это переменная (вероятно, переданная ранее в запрос).

    // userIdCol — это ссылка на столбец в вашей базе данных (вы просто переименовываете clerkUserId в userIdCol для ясности).
    where: ({ clerkUserId: userIdCol }, { eq }) => eq(userIdCol, clerkUserId),

    // События упорядочены по алфавиту (без учета регистра) по названию
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  });

  // Вернуть полный список событий
  return events;
}

// Получить конкретное событие для заданного пользователя
export async function getEvent(userId: string, eventId: string): Promise<EventRow | undefined> {
  const event = await db.query.EventTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) => and(eq(clerkUserId, userId), eq(id, eventId)), //Создать новый временный файл из выделенного фрагмента
  });

  return event ?? undefined; // Явно возвращает undefined, если не найдено
}

// Определить новый тип для публичных событий, которые всегда активны.
// Удаляет общее поле «isActive» и заменяет его литералом true.
export type PublicEvent = Omit<EventRow, 'isActive'> & { isActive: true };
// «Эта версия события гарантированно активна — без «возможно» и «ложно».

// Асинхронная функция для получения всех активных (публичных) событий для конкретного пользователя
export async function getPublicEvents(clerkUserId: string): Promise<PublicEvent[]> {
  // Запрос к базе данных о событиях, в которых:
  // - clerkUserId совпадает
  // - событие помечено как активное
  // События упорядочены по алфавиту (без учета регистра) по имени
  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  });

  // Преобразуйте результат в тип PublicEvent[] , чтобы указать, что все события активны.
  return events as PublicEvent[];
}

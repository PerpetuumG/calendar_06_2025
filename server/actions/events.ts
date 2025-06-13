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

export async function deleteEvent(e: any) {}

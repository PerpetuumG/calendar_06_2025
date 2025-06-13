'use server';

import { eventFormSchema } from '@/schema/events';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { EventTable } from '@/drizzle/schema';
import { db } from '@/drizzle/db';
import { revalidatePath } from 'next/cache';

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

export async function updateEvent(e: any) {}
export async function deleteEvent(e: any) {}

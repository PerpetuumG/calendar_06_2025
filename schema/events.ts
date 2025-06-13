import { z } from 'zod';

// Определите схему проверки для формы события с помощью Zod
export const eventFormSchema = z.object({
  // «name» должен быть строкой и является обязательным полем (не менее 1 символа)
  name: z.string().min(1, 'Required'),

  // «description» — необязательное строковое поле
  description: z.string().optional(),

  // 'isActive' — это булево значение, которое по умолчанию равно true, если не указано иное.
  isActive: z.boolean(),

  // „durationInMinutes“ будет принудительно преобразовано (конвертировано) в число.
  // Оно должно быть целым числом, больше 0 и меньше или равно 720 (12 часов).
  durationInMinutes: z.coerce
    .number()
    .int()
    .positive('Duration must be greater than 0')
    .max(60 * 12, `Duration must be less than 12 hours (${60 * 12} minutes)`),
});

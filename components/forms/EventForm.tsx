'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { eventFormSchema } from '@/schema/events';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import Link from 'next/link';
import { deleteEvent } from '@/server/actions/events';
import { useRouter } from 'next/router';
import { useTransition } from 'react';

// Компонент для создания, редактирования и удаления событий
const EventForm = ({
  event, // Деструктурируйте объект `event` из пропсов
}: {
  // Определите форму (тип TypeScript) ожидаемых пропсов.
  event?: {
    // Необязательный объект `event` (может быть не определён при создании нового события)
    id: string; // Уникальный идентификатор события
    name: string; //  Название события
    description?: string; // Дополнительное описание мероприятия
    durationInMinutes: number; // Продолжительность мероприятия в минутах
    isActive: boolean; // Указывает, является ли событие активным в данный момент
  };
}) => {
  // useTransition — это React-хук, который помогает управлять состоянием переходов в асинхронных операциях.
  // Он возвращает два значения:
  // 1. `isDeletePending` — это булево значение, которое сообщает нам, продолжается ли удаление.
  // 2. `startDeleteTransition` — это функция, которую мы можем использовать для запуска асинхронной операции, например удаления события.

  const [isDeletePending, startDeleteTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema), // Используйте zodResolver для валидации формы с помощью схемы Zod
    defaultValues: event
      ? {
          // Если указан `event` (режим редактирования), распространить его существующие свойства в качестве значений по умолчанию
          ...event,
        }
      : {
          // Если `event` не указан (режим создания), используйте следующие значения по умолчанию
          isActive: true, // Новые события активны по умолчанию
          durationInMinutes: 30, // По умолчанию продолжительность составляет 30 минут.
          description: '', // Обеспечить контролируемый ввод: по умолчанию пустая строка
          name: '', // Обеспечить контролируемый ввод: по умолчанию пустая строка
        },
  });

  // Функция для обработки отправки формы
  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    const action = event === null ? createEvent : updateEvent.bind(null, event.id);

    try {
      await action(values);
    } catch (e: any) {
      console.error('Ошибка при отправке формы: ', e);
      form.setError('root', {
        message: `Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз позже. ${e.message}`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-6 flex-col'>
        {/* Показать корневую ошибку, если есть */}
        {form.formState.errors.root && (
          <div className='text-destructive text-sm'>{form.formState.errors.root.message}</div>
        )}

        {/* Поле «Название события» */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название события</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Имя, которое пользователи увидят при бронировании</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Продолжительность */}
        <FormField
          control={form.control}
          name='durationInMinutes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Продолжительность</FormLabel>
              <FormControl>
                <Input type='number' {...field} />
              </FormControl>
              <FormDescription>В минутах</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Дополнительное поле описания */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea className='resize-none h-32' {...field} />
              </FormControl>
              <FormDescription>Дополнительное описание события</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Переключатель активного состояния */}
        <FormField
          control={form.control}
          name='isActive'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center gap-2'>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Активно</FormLabel>
              </div>
              <FormDescription>
                Неактивные события не будут отображаться для пользователей при бронировании
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Раздел кнопок: Удалить, Отмена, Сохранить */}
        <div className='flex gap-2 justify-end'>
          {/* Кнопка «Удалить» (отображается только при редактировании существующего события) */}
          {event && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className='cursor-pointer hover:scale-105 hover:bg-red-700'
                  variant='destructive'
                  disabled={isDeletePending || form.formState.isSubmitting}
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Это событие будет удалено без возможности
                    восстановления.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    className='bg-red-500 hover:bg-red-700 cursor-pointer'
                    disabled={isDeletePending || form.formState.isSubmitting}
                    onClick={() => {
                      // Запустите переход React, чтобы интерфейс пользователя оставался отзывчивым во время этой асинхронной операции.
                      startDeleteTransition(async () => {
                        try {
                          // Попытка удалить событие по его ID
                          await deleteEvent(event.id);
                          router.push('/events');
                        } catch (error: any) {
                          // Если что-то пошло не так, отобразите ошибку на корневом уровне формы.
                          form.setError('root', {
                            message: `Произошла ошибка при удалении вашего события: ${error.message}`,
                          });
                        }
                      });
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Кнопка «Отмена» — перенаправляет к списку событий */}
          <Button
            disabled={isDeletePending || form.formState.isSubmitting}
            type='button'
            asChild
            variant='outline'
          >
            <Link href='/events'>Отмена</Link>
          </Button>

          {/* Кнопка «Сохранить» — отправляет форму */}
          <Button
            className='cursor-pointer hover:scale-105 bg-blue-400 hover:bg-blue-600'
            disabled={isDeletePending || form.formState.isSubmitting}
            type='submit'
          >
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;

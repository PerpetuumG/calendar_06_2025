import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarPlus } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { getEvents } from '@/server/actions/events';

const EventsPage = async () => {
  // Получите идентификатор аутентифицированного пользователя
  const { userId, redirectToSignIn } = await auth();
  // Перенаправить на страницу входа, если пользователь не является аутентификацией
  if (!userId) return redirectToSignIn();

  const events = await getEvents(userId);

  return (
    <section className={'flex flex-col items-center gap-16 animate-fade-in'}>
      <div className={'flex gap-4 items-baseline'}>
        <h1 className={'text-4xl xl:text-5xl font-black mb-6'}>События</h1>
        {/*
        Без asChild кнопка будет отображаться следующим образом:
        <button><a href="/dashboard">Go to Dashboard</a></button> <!-- Invalid HTML -->
        С asChild он отображается следующим образом:
        <a href="/dashboard" class="...button styles...">Go to Dashboard</a> <!-- Valid HTML -->
        Это полезно, когда вы хотите, чтобы другой элемент (например, <Link>) выглядел и вел себя как кнопка, не нарушая семантику HTML.*/}
        <Button
          className={
            'bg-blue-500 hover:bg-blue-400 text-white py-6 hover:scale-110 duration-500 border-b-4 border-blue-700 hover:border-blue-500 rounded-2xl shadow-accent-foreground text-2xl font-black'
          }
          asChild
        >
          <Link href={'/events/new'}>
            <CalendarPlus className={'mr-4 size-7'} /> Создать событие
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default EventsPage;

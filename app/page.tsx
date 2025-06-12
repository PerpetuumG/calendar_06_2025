import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import LandingPage from '@/components/LandingPage';

export default async function HomePage() {
  const user = await currentUser();

  // Если пользователь не авторизован, перенаправляем на страницу входа landing page
  if (!user) {
    return <LandingPage />;
  }

  // Если пользователь авторизован, отображаем контент для авторизованных пользователей
  return redirect('/events');
}

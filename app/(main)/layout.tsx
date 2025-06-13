import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import PublicNavBar from '@/components/PublicNavBar';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  return (
    <main className={'relative'}>
      <PublicNavBar />
      {/* Отобразить PrivateNavBar, если пользователь существует, в противном случае PublicNavBar */}
      {/*{user ? <PrivateNavBar /> : <PublicNavBar />}*/}

      <section className={'pt-36'}>{children}</section>
    </main>
  );
};

export default MainLayout;

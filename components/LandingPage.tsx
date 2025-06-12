'use client';

import Image from 'next/image';
import { SignIn } from '@clerk/nextjs';
import { neobrutalism } from '@clerk/themes';

const LandingPage = () => {
  return (
    <main className={'flex items-center p-10 gap-24 animate-fade-in max-md:flex-col'}>
      <section className={'flex flex-col items-center'}>
        <Image src={'/assets/logo.svg'} width={300} height={300} alt={'logo'} />

        {/*Основной заголовок страницы*/}
        <h1 className={'text-2xl font-black lg:text-3xl'}>Ваше время, идеально спланированно </h1>

        {/*Подзаголовок*/}
        <p className={'font-extralight'}>
          Присоединяйтесь к миллионам профессионалов, которые легко бронируют встречи с помощью
          лучшего инструмента для планирования
        </p>

        {/*Иллюстрация ниже текста*/}
        <Image src={'/assets/planning.svg'} width={500} height={500} alt={'Logo'} />
      </section>

      {/* Clerk Sign-In компонент кастомной темой*/}
      <div className={'mt-3'}>
        <SignIn
          routing={'hash'} // Сохраняет интерфейс входа на той же странице с помощью маршрутизации на основе хешей.
          appearance={{ baseTheme: neobrutalism }} // Применяет стиль темы необутализм к интерфейсу входа в систему.
        />
      </div>
    </main>
  );
};

export default LandingPage;

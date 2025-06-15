'use client';

import React, { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';

// Состояние для отслеживания состояния копирования
type CopyState = 'idle' | 'copied' | 'error';

// Определить свойства для компонента CopyEventButton
interface CopyEventButtonProps
  extends Omit<React.ComponentProps<'button'>, 'children' | 'onClick'>, // Наследует все native свойства кнопки, кроме children и onClick
    VariantProps<typeof buttonVariants> {
  // Разрешить пропсы варианта и размера из стиля кнопки
  eventId: string; // Требуется: идентификатор события для ссылки бронирования
  clerkUserId: string; // Требуется: идентификатор пользователя для ссылки бронирования
}

// Инициализация состояния копирования
function getCopyLabel(state: CopyState) {
  switch (state) {
    case 'copied':
      return 'Скопировано!';
    case 'error':
      return 'Ошибка!';
    case 'idle':
    default:
      return 'Скопировать ссылку';
  }
}

const CopyEventButton = ({
  variant,
  eventId,
  clerkUserId,
  className,
  size,
  ...props
}: CopyEventButtonProps) => {
  const [copyState, setCopyState] = useState<CopyState>('idle'); // Изначально состояние - 'idle'

  const handleCopy = () => {
    const url = `${location.origin}/book/${clerkUserId}/${eventId}`; // Создать URL-адрес бронирования

    navigator.clipboard
      .writeText(url) // Попытайтесь скопировать URL-адрес.
      .then(() => {
        setCopyState('copied'); // В случае успеха отобразить состояние «Скопировано!»
        toast('Ссылка скопирована успешно.', {
          duration: 3000,
        });
        setTimeout(() => setCopyState('idle'), 2000); // Сброс через 2 секунды
      })
      .catch(() => {
        setCopyState('error');
        setTimeout(() => setCopyState('idle'), 2000); // Сброс через 2 секунды
      });
  };

  return (
    <Button
      onClick={handleCopy}
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        'cursor-pointer',
        className,
      )} // Применить классы вариантов/размеров + любые пользователи
      variant={variant}
      size={size}
      {...props}
    >
      <CopyIcon className={'size-4 mr-2'} />
      {/* Иконка, которая меняется в зависимости от состояния копирования */}
      {getCopyLabel(copyState)}
      {/* Текстовая метка, которая меняется в зависимости от состояния копирования */}
    </Button>
  );
};

export default CopyEventButton;

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatEventDescription } from '@/lib/formatters';
import CopyEventButton from '@/components/CopyEventButton';

type EventCardProps = {
  id: string;
  isActive: boolean;
  name: string;
  description: string | null;
  durationInMinutes: number;
  clerkUserId: string;
};

// Компонент отображения одной карты события
const EventCard = ({
  id,
  isActive,
  name,
  description,
  durationInMinutes,
  clerkUserId,
}: EventCardProps) => {
  <Card
    className={cn(
      'flex flex-col border-4 border-blue-500/10 shadow-2xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110',
      !isActive && ' bg-accent border-accent',
    )}
  >
    {/* Заголовок карты с заголовком и отформатированной продолжительностью */}
    <CardHeader className={cn(!isActive && 'opacity-50')}>
      <CardTitle>{name}</CardTitle>
      <CardDescription>{formatEventDescription(durationInMinutes)}</CardDescription>
    </CardHeader>

    {/* Показать описание события, если доступно */}
    {description != null && (
      <CardContent className={cn(!isActive && 'opacity-50')}>{description}</CardContent>
    )}

    {/* Нижний колонтитул карты с кнопками копирования и редактирования */}
    <CardFooter className='flex justify-end gap-2 mt-auto'>
      {/* Показывать кнопку копирования только если событие активно */}
      {isActive && <CopyEventButton variant='outline' eventId={id} clerkUserId={clerkUserId} />}
      {/* Кнопка «Редактировать событие» */}
      <Button className='cursor-pointer hover:scale-105 bg-blue-400 hover:bg-blue-600' asChild>
        <Link href={`/events/${id}/edit`}>Edit</Link>
      </Button>
    </CardFooter>
  </Card>;
};

export default EventCard;

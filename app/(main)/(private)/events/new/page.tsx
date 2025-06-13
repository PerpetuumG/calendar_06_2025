// Этот код определяет компонент React под названием `NewEventPage`, который отображает страницу для создания нового события. Он использует макет карты для отображения центрированной формы на экране. Карта включает в себя заголовок с названием «Новое событие» и раздел содержимого, который содержит компонент `EventForm`, который, вероятно, обрабатывает ввод пользователя и логику отправки для создания нового события в календаре. Макет стилизован с помощью классов утилит, чтобы сделать его визуально привлекательным и адаптивным, обеспечивая чистый и сфокусированный пользовательский интерфейс для создания событий.

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventForm from '@/components/forms/EventForm';

const NewEventPage = () => {
  return (
    // Компонент Container Card, выровненный по центру страницы с максимальной шириной
    <Card
      className={'max-w-md mx-auto border-8 border-blue-200 shadow-2xl shadow-accent-foreground'}
    >
      <CardHeader>
        <CardTitle>Новое событие</CardTitle>
      </CardHeader>

      <CardContent>
        <EventForm />
      </CardContent>
    </Card>
  );
};

export default NewEventPage;

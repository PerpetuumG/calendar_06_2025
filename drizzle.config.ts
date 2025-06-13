import { defineConfig } from 'drizzle-kit';

// 🔍 Получить URL базы данных из переменных среды
const databaseUrl = process.env.DATABASE_URL;

// ❌ Если URL базы данных не определен, выдать ошибку, чтобы предотвратить неправильную настройку.
if (!databaseUrl) {
  throw new Error('❌ DATABASE_URL is not defined in environment variables.');
}

// ✅ Экспортируйте конфигурацию Drizzle с помощью вспомогательной функции defineConfig
export default defineConfig({
  // 📁 Путь к вашим определениям схемы (Drizzle ORM просканирует этот файл)
  schema: './drizzle/schema.ts',

  // 🗃️ Каталог, в который Drizzle будет выводить файлы миграции
  out: './drizzle/migrations',

  // 🧠 Укажите, какой диалект SQL вы используете (например, PostgreSQL, MySQL)
  dialect: 'postgresql',

  // 🔒 Включите строгий режим для обеспечения более строгой проверки и типовой безопасности.
  strict: true,

  // 🗯️ Включите подробную регистрацию, чтобы получить больше информации во время действий CLI.
  verbose: true,

  // 🔐 Передача учетных данных базы данных (например, URL подключения)
  dbCredentials: {
    // ✅ Теперь можно безопасно использовать, потому что мы проверили выше, что оно определено.
    url: databaseUrl,
  },
});

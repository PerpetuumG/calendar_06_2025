// Импортируйте бессерверный клиент Neon для PostgreSQL
import { neon } from '@neondatabase/serverless';

// Импорт драйвера Neon HTTP от Drizzle для поддержки ORM
import { drizzle } from 'drizzle-orm/neon-http';

// Импортируйте определения схемы базы данных (например, таблицы) из локального файла схемы
import * as schema from './schema';

// Инициализируйте клиент Neon, используя DATABASE_URL из ваших переменных среды
const sql = neon(process.env.DATABASE_URL!);

// Создать и экспортировать экземпляр Drizzle ORM с клиентом Neon и схемой для типобезопасных запросов
export const db = drizzle(sql, { schema });

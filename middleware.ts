import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Только публичные маршруты
const isPublicRoute = createRouteMatcher(['/', '/login(.*)', 'register(.*)', '/book(.*)']);

// Если не публичный маршрут, то защищаем его
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Пропустить внутренние компоненты Next.js и все статические файлы, если они не найдены в параметрах поиска.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Rotas protegidas que exigem sessão ativa
    '/dashboard/:path*',
    // Rotas de auth que precisam que o middleware processe/propague cookies
    // (sem redirecionamento — a lógica pública é tratada em updateSession)
    '/update-password/:path*',
    '/update-password',
  ],
};

export const dynamic = 'force-dynamic';

import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

  const isRecovery = type === 'recovery' || searchParams.get('next') === '/update-password';
  const redirectUrl = isRecovery ? `${baseUrl}/update-password` : `${baseUrl}/dashboard`;

  const response = NextResponse.redirect(redirectUrl);

  if (code) {
    // CORREÇÃO AQUI: Dando await na Promise de cookies para o Next.js moderno
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options });
            response.cookies.delete({ name, ...options });
          },
        },
        cookieOptions: { path: '/' }
      }
    );

    try {
      if (isRecovery) {
        await supabase.auth.signOut();
        console.log('[auth/callback] Sessão anterior encerrada (recovery).');
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) throw error;

      return response;
    } catch (error: any) {
      console.error('[auth/callback] Erro crítico no exchange:', error);
      return NextResponse.json({ 
        erro: 'Falha no exchange', 
        mensagem: error?.message || error,
        detalhes: error
      }, { status: 400 });
    }
  }

  return NextResponse.redirect(`${baseUrl}/?error=sem_codigo`);
}
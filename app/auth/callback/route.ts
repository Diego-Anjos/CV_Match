import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Supabase envia ?error=access_denied quando o link expirou ou já foi usado
  const errorParam = searchParams.get('error');
  if (errorParam) {
    return NextResponse.redirect(`${origin}/?error=link_invalido`);
  }

  if (code) {
    // Cria a resposta de redirect ANTES para poder injetar os cookies da sessão nela
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Injeta os cookies de sessão diretamente na resposta de redirect
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  // Code inválido, ausente ou expirado
  return NextResponse.redirect(`${origin}/?error=link_invalido`);
}

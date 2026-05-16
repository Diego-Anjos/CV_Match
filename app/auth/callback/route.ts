import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');

  // Usa NEXT_PUBLIC_APP_URL como base quando disponível para garantir
  // que o redirect sempre aponte para o domínio público de produção.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

  // Supabase envia ?error=access_denied quando o link expirou ou já foi usado
  const errorParam = searchParams.get('error');
  if (errorParam) {
    return NextResponse.redirect(`${baseUrl}/?error=link_invalido`);
  }

  // Fluxo de recuperação de senha: type=recovery ou next=/update-password indicam
  // que o usuário clicou no link de redefinição de senha. Nesses casos o destino
  // deve sempre ser /update-password independentemente do parâmetro next.
  const isRecovery =
    type === 'recovery' ||
    searchParams.get('next') === '/update-password';

  const next = isRecovery
    ? '/update-password'
    : (searchParams.get('next') ?? '/dashboard');

  if (code) {
    // Cria a resposta de redirect ANTES para poder injetar os cookies da sessão nela
    const redirectUrl = isRecovery
      ? `${baseUrl}/update-password`
      : `${baseUrl}${next}`;

    const response = NextResponse.redirect(redirectUrl);

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
  return NextResponse.redirect(`${baseUrl}/?error=link_invalido`);
}

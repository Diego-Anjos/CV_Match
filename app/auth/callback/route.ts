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

    console.log('[auth/callback] Fluxo Recovery:', isRecovery);
    console.log('[auth/callback] URL de redirecionamento calculada:', redirectUrl);
    console.log('[auth/callback] Parâmetros recebidos:', { code: code?.slice(0, 8) + '...', type, next: searchParams.get('next') });

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

    // Verifica se o usuário já possui uma sessão ativa antes de tentar trocar o code.
    // Isso cobre o cenário em que o link foi pré-carregado pelo provedor de e-mail
    // (o code já foi consumido), mas o usuário ainda tem uma sessão válida no browser.
    const { data: sessionData } = await supabase.auth.getSession();
    const sessionExistente = !!sessionData?.session;

    console.log('[auth/callback] Sessão prévia detectada:', sessionExistente);

    if (sessionExistente && isRecovery) {
      console.log('[auth/callback] Sessão ativa encontrada em fluxo recovery — redirecionando sem exchange.');
      return response;
    }

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      console.log('[auth/callback] Resultado do exchangeCodeForSession — error:', error ?? 'nenhum');

      if (!error) {
        return response;
      }

      console.error('[auth/callback] Erro crítico no exchange:', error.message);
      console.error('[auth/callback] Detalhes do erro:', error);

      // Se o exchange falhou mas uma sessão foi estabelecida por outra via
      // (ex: o code foi consumido pelo pré-carregamento do e-mail e o cookie
      // persistiu na mesma origem), ainda assim encaminha para /update-password.
      if (isRecovery) {
        const { data: sessionAposErro } = await supabase.auth.getSession();
        if (sessionAposErro?.session) {
          console.log('[auth/callback] Sessão encontrada após erro no exchange — prosseguindo para update-password.');
          return response;
        }
      }

      const errorDestino = isRecovery
        ? `${baseUrl}/recuperar-senha?error=token_falhou`
        : `${baseUrl}/?error=link_invalido`;
      return NextResponse.redirect(errorDestino);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[auth/callback] Erro crítico no exchange:', message);
      console.error('[auth/callback] Exceção completa:', err);
      const errorDestino = isRecovery
        ? `${baseUrl}/recuperar-senha?error=token_falhou`
        : `${baseUrl}/?error=link_invalido`;
      return NextResponse.redirect(errorDestino);
    }
  }

  // Code ausente
  console.warn('[auth/callback] Nenhum code recebido na URL. Params:', Object.fromEntries(searchParams.entries()));
  return NextResponse.redirect(`${baseUrl}/?error=link_invalido`);
}

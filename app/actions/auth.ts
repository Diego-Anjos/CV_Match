'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getErrorMessage } from '@/utils/errorMessages';

export type AuthState = {
  error: string;
  /** Timestamp so the client can re-show the same error on repeated submits. */
  ts?: number;
};

function fail(error: string): AuthState {
  return { error, ts: Date.now() };
}

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  );
}

function fromSupabaseError(error: { message: string; status?: number; code?: string }): string {
  const combined = [error.code, error.message, error.status != null ? String(error.status) : '']
    .filter(Boolean)
    .join(' ');
  return getErrorMessage(combined);
}

export async function signInAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get('email')?.toString().trim().toLowerCase() ?? '';

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: formData.get('password') as string,
  });

  if (error) {
    return fail(fromSupabaseError(error));
  }

  redirect('/dashboard');
}

export async function signUpAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const supabase = await createClient();

    const nome = formData.get('nome')?.toString().trim() ?? '';
    if (!nome) {
      return fail('Por favor, preencha seu nome completo.');
    }

    const email = formData.get('email')?.toString().trim().toLowerCase() ?? '';
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      return fail('As senhas não coincidem.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nome,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      return fail(fromSupabaseError(error));
    }

    // Supabase hides duplicate signups when email confirmation is on
    // (returns a user with empty identities and no session).
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return fail('Este e-mail já está em uso. Tente fazer login.');
    }

    // Email confirmation is enabled: user was created but there is no session yet.
    // Redirecting to /dashboard would bounce them back to login with no explanation.
    if (!data.session) {
      return fail(
        'Conta criada, mas o login automático não foi possível. Desative a confirmação obrigatória de e-mail no painel do Supabase (Authentication → Providers → Email → Confirm email) para testes locais, ou confirme o e-mail enviado.'
      );
    }

    redirect('/dashboard');
  } catch (err) {
    // redirect() throws a special NEXT_REDIRECT error — it must propagate.
    if (isNextRedirect(err)) throw err;

    const raw = err instanceof Error ? err.message : String(err);
    return fail(getErrorMessage(raw) || 'Erro inesperado ao criar conta. Tente novamente.');
  }
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

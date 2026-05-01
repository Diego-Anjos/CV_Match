'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export type AuthState = {
  error: string;
};

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
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function signUpAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const nome = formData.get('nome')?.toString().trim() ?? '';
  if (!nome) {
    return { error: 'Por favor, preencha seu nome completo.' };
  }

  const email = formData.get('email')?.toString().trim().toLowerCase() ?? '';
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return { error: 'As senhas não coincidem.' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: nome,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

const errorMap: Record<string, string> = {
  // Supabase Auth
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'invalid login credentials': 'E-mail ou senha incorretos.',
  'Email not confirmed': 'Por favor, confirme seu e-mail antes de fazer login.',
  'email not confirmed': 'Por favor, confirme seu e-mail antes de fazer login.',
  'User already registered': 'Este e-mail já está em uso. Tente fazer login.',
  'user already registered': 'Este e-mail já está em uso. Tente fazer login.',
  'Email already in use': 'Este e-mail já está em uso. Tente fazer login.',
  'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
  'Signup is disabled': 'Cadastros estão temporariamente desativados.',
  'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  'over_email_send_rate_limit': 'Muitas tentativas de envio. Aguarde alguns minutos.',
  'For security purposes, you can only request this once every 60 seconds':
    'Por segurança, aguarde 60 segundos antes de solicitar novamente.',
  'Token has expired or is invalid': 'O link expirou ou é inválido. Solicite um novo.',
  'token has expired or is invalid': 'O link expirou ou é inválido. Solicite um novo.',
  'New password should be different from the old password':
    'A nova senha deve ser diferente da senha atual.',
  'Auth session missing': 'Sessão expirada. Faça login novamente.',
  'User not found': 'Usuário não encontrado.',
  'Network request failed': 'Falha na conexão. Verifique sua internet e tente novamente.',
  // Genéricos
  'Failed to fetch': 'Falha na conexão. Verifique sua internet e tente novamente.',
  'Internal Server Error': 'Erro interno do servidor. Tente novamente em instantes.',
};

export function getErrorMessage(raw: string | undefined | null): string {
  if (!raw) return 'Ocorreu um erro inesperado. Tente novamente.';

  for (const [key, value] of Object.entries(errorMap)) {
    if (raw.toLowerCase().includes(key.toLowerCase())) return value;
  }

  return raw;
}

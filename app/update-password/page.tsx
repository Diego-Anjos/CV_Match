'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight, Loader2, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { LogoCVMatch } from '../components/LogoCVMatch';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = useRef(createClient()).current;

  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let sessionResolved = false;
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;

    const markReady = () => {
      if (sessionResolved) return;
      sessionResolved = true;
      if (redirectTimer) clearTimeout(redirectTimer);
      setIsCheckingSession(false);
      setIsSessionReady(true);
    };

    const markFailed = () => {
      if (sessionResolved) return;
      sessionResolved = true;
      setIsCheckingSession(false);
      router.replace('/?error=link_invalido');
    };

    // onAuthStateChange registrado ANTES do setup para não perder eventos async.
    // No fluxo PKCE via SSR, PASSWORD_RECOVERY pode não disparar porque a sessão
    // já foi estabelecida server-side. SIGNED_IN é o evento mais confiável aqui.
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      console.log('[update-password] onAuthStateChange evento:', event);
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        markReady();
      }
    });

    const setupSession = async () => {
      // Fluxo PKCE direto: página acessada com ?code= sem passar pelo /auth/callback
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        console.log('[update-password] Código PKCE encontrado na URL — trocando sessão no cliente');
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        window.history.replaceState({}, '', '/update-password');
        if (!error) { markReady(); return; }
        console.error('[update-password] Falha no exchange client-side:', error.message);
        markFailed();
        return;
      }

      // Tentativa 1: getUser() — chamada de rede, autoritativa.
      // Mais confiável que getSession() que pode ler um cache vazio logo após o redirect.
      console.log('[update-password] Verificando usuário via getUser() (rede)...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (user && !userError) {
        console.log('[update-password] Usuário confirmado via getUser():', user.email);
        markReady();
        return;
      }

      console.warn('[update-password] getUser() não encontrou usuário. Erro:', userError?.message ?? 'nenhum');

      // Tentativa 2: retry com backoff — cookies podem demorar alguns ms para propagar
      // entre o redirect do callback e o primeiro render do cliente.
      const retryIntervals = [500, 1000, 2000, 3000];
      for (const delay of retryIntervals) {
        if (sessionResolved) return;
        await new Promise((res) => setTimeout(res, delay));
        if (sessionResolved) return;

        console.log(`[update-password] Retry após ${delay}ms — chamando getUser() novamente...`);
        const { data: { user: retryUser } } = await supabase.auth.getUser();
        if (retryUser) {
          console.log('[update-password] Usuário encontrado no retry:', retryUser.email);
          markReady();
          return;
        }
      }

      // Todos os retries falharam — aguarda mais 3s para o onAuthStateChange disparar
      // (caso o evento ainda esteja em trânsito) antes de redirecionar definitivamente.
      console.warn('[update-password] Todos os retries falharam. Aguardando evento async por 3s...');
      redirectTimer = setTimeout(() => {
        if (!sessionResolved) {
          console.error('[update-password] Sessão não resolvida após todos os retries — redirecionando para /?error=link_invalido');
          markFailed();
        }
      }, 3000);
    };

    setupSession();

    return () => {
      sessionResolved = true; // evita redirect após desmontagem
      if (redirectTimer) clearTimeout(redirectTimer);
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem. Tente novamente.');
      return;
    }

    setIsLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setIsLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2500);
    }
  }

  // Tela de loading enquanto a sessão ainda não foi verificada.
  // Evita que o formulário apareça "piscado" ou que um redirect agressivo
  // expulse o usuário antes dos cookies do callback serem lidos.
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 relative z-10"
        >
          <LogoCVMatch className="w-14 h-14 text-emerald-500" />
          <div className="flex flex-col items-center gap-2 text-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-slate-700 font-semibold text-lg">Validando seu link seguro…</p>
            <p className="text-slate-400 text-sm">Isso leva apenas alguns segundos.</p>
          </div>
          {/* Skeleton do formulário */}
          <div className="w-full space-y-3 mt-2">
            <div className="h-11 w-full rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-11 w-full rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-12 w-full rounded-xl bg-emerald-100 animate-pulse mt-2" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10"
      >
        <div className="p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <LogoCVMatch className="w-16 h-16 text-emerald-500 mb-4" />
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Nova Senha</h1>
            <p className="text-slate-500 text-sm mt-1 text-center">
              Escolha uma nova senha segura para sua conta
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <p className="text-slate-800 font-semibold text-lg">Senha atualizada com sucesso!</p>
                <p className="text-slate-500 text-sm mt-1">Redirecionando para o dashboard...</p>
              </div>
              <Loader2 className="w-5 h-5 text-emerald-500 animate-spin mt-2" />
            </motion.div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Status de validação do link */}
              <motion.div
                initial={false}
                animate={isSessionReady
                  ? { backgroundColor: 'rgb(240 253 244)', borderColor: 'rgb(167 243 208)' }
                  : { backgroundColor: 'rgb(248 250 252)', borderColor: 'rgb(226 232 240)' }
                }
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-colors"
              >
                {isSessionReady ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-emerald-700">Link validado. Você pode definir sua nova senha.</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-4 h-4 text-slate-400 shrink-0 animate-spin" />
                    <span className="text-slate-500">Validando link seguro...</span>
                  </>
                )}
              </motion.div>

              {/* Nova Senha */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 block">Nova Senha</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={!isSessionReady}
                    className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    disabled={!isSessionReady}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
                    tabIndex={-1}
                    aria-label={showNew ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Nova Senha */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 block">Confirmar Nova Senha</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={!isSessionReady}
                    className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    disabled={!isSessionReady}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
                    tabIndex={-1}
                    aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password match indicator */}
              {confirmPassword.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm font-medium flex items-center gap-1.5 ${
                    newPassword === confirmPassword ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {newPassword === confirmPassword ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      As senhas coincidem
                    </>
                  ) : (
                    <>
                      <span className="w-4 h-4 inline-flex items-center justify-center rounded-full border-2 border-current text-xs font-bold">!</span>
                      As senhas não coincidem
                    </>
                  )}
                </motion.p>
              )}

              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={!isSessionReady || isLoading}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : !isSessionReady ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Validando link seguro...
                  </>
                ) : (
                  <>
                    Salvar Nova Senha
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

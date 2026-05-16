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
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let sessionResolved = false;

    const markReady = () => {
      sessionResolved = true;
      setIsSessionReady(true);
    };

    // Listener registrado ANTES do setup para não perder eventos assíncronos
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        markReady();
      }
    });

    const setupSession = async () => {
      // Fluxo PKCE: o /auth/callback já fez o exchangeCodeForSession,
      // mas garantimos a sessão caso a página seja acessada com ?code= diretamente
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        window.history.replaceState({}, '', '/update-password');
        markReady();
        return;
      }

      // Sessão já estabelecida pelo /auth/callback via cookies
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        markReady();
        return;
      }

      // Nenhuma sessão encontrada — aguarda eventos async por 8s antes de redirecionar
      setTimeout(() => {
        if (!sessionResolved) {
          router.replace('/?error=link_invalido');
        }
      }, 8000);
    };

    setupSession();

    return () => {
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

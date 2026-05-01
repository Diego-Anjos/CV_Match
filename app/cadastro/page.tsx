'use client';

import React, { useActionState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, User, Loader2 } from 'lucide-react';
import { LogoCVMatch } from '../components/LogoCVMatch';
import Link from 'next/link';
import { signUpAction, type AuthState } from '@/app/actions/auth';

const initialState: AuthState = { error: '' };

export default function CadastroPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

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
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 my-8"
      >
        <div className="p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <LogoCVMatch className="w-16 h-16 text-emerald-500 mb-4" />
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Criar Conta</h1>
            <p className="text-slate-500 text-sm mt-1 text-center">Junte-se ao CV Match e otimize seu recrutamento</p>
          </div>

          {/* Form */}
          <form className="space-y-4" action={formAction}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 block">Nome Completo</label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="nome"
                  required
                  placeholder="João Silva"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 block">E-mail</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 block">Senha</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 block">Confirmar Senha</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 bg-slate-50 transition-colors cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer">
                Eu concordo com os{' '}
                <Link href="/termos" className="font-medium text-emerald-600 hover:text-emerald-500 hover:underline">
                  Termos de Serviço
                </Link>{' '}
                e a{' '}
                <Link href="/privacidade" className="font-medium text-emerald-600 hover:text-emerald-500 hover:underline">
                  Política de Privacidade
                </Link>
                .
              </label>
            </div>

            {state.error && (
              <p className="text-sm text-red-500 font-medium">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  Criar Conta
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Já tem uma conta?{' '}
            <Link href="/" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
              Entrar
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

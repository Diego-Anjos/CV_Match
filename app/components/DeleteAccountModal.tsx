'use client';

import React, { useState } from 'react';
import { AlertTriangle, Loader2, ShieldAlert, HeartHandshake, Trash2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'retention' | 'confirm' | 'farewell';

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const supabase = createClient();

  const [step, setStep] = useState<Step>('retention');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmEnabled = confirmText === 'EXCLUIR';

  function handleClose() {
    setStep('retention');
    setConfirmText('');
    setIsDeleting(false);
    onClose();
  }

  async function handleDelete() {
    setStep('farewell');
    setIsDeleting(true);

    const { error } = await supabase.rpc('delete_user');

    if (error) {
      console.error('Falha ao apagar usuário no banco:', error);
      setIsDeleting(false);
      setStep('confirm');
      setConfirmText('');
      alert('Erro ao excluir conta: ' + error.message);
      return;
    }

    await supabase.auth.signOut();
    window.location.href = '/';
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className="bg-[#1e2330] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* ── Step 1 · Retention ── */}
        {step === 'retention' && (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mb-5">
              <HeartHandshake className="w-8 h-8 text-emerald-400" />
            </div>

            <h2 className="text-xl font-bold text-white mb-3">
              Tem certeza que deseja nos deixar?
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Poxa, vamos sentir sua falta! Ao excluir sua conta, você perderá acesso ao
              seu&nbsp;<span className="text-slate-200 font-medium">histórico</span>,
              aos&nbsp;<span className="text-slate-200 font-medium">templates premium</span> e
              às&nbsp;<span className="text-slate-200 font-medium">análises de IA</span>.
            </p>

            <button
              onClick={handleClose}
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-[0_4px_14px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.35)] mb-3"
            >
              Mudei de ideia, quero ficar
            </button>

            <button
              onClick={() => setStep('confirm')}
              className="text-red-400 hover:text-red-300 text-sm font-medium py-2 transition-colors"
            >
              Continuar exclusão
            </button>
          </div>
        )}

        {/* ── Step 2 · Security Confirmation ── */}
        {step === 'confirm' && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Zona de Perigo</h2>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Essa ação é&nbsp;
              <span className="text-red-400 font-semibold">irreversível</span>. Para
              confirmar, digite&nbsp;
              <span className="font-mono font-bold text-white bg-slate-700 px-1.5 py-0.5 rounded">
                EXCLUIR
              </span>
              &nbsp;no campo abaixo.
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Digite EXCLUIR aqui"
              autoFocus
              className="w-full bg-slate-800 border border-slate-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none transition-colors mb-6"
            />

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={!isConfirmEnabled}
                className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Definitivamente
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3 · Farewell / Loading ── */}
        {step === 'farewell' && (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-5">
              {isDeleting ? (
                <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              )}
            </div>

            <h2 className="text-xl font-bold text-white mb-3">
              Agradecemos por usar o CV Match!
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed">
              Estamos removendo seus dados com segurança. Você será redirecionado em
              instantes…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

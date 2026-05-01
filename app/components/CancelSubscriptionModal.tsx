import React, { useState } from 'react';
import { AlertTriangle, Minus, Loader2 } from 'lucide-react';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function CancelSubscriptionModal({ isOpen, onClose, onConfirm }: CancelSubscriptionModalProps) {
  const [isCanceling, setIsCanceling] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1e2330] border border-gray-700 rounded-xl p-6 w-full max-w-sm">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        
        <h2 className="text-xl font-bold text-white mt-4">
          Tem certeza que deseja cancelar?
        </h2>
        
        <p className="text-gray-400 text-sm mt-2 mb-4">
          Ao cancelar, você voltará para o Plano Grátis no final do ciclo. Você perderá acesso a:
        </p>

        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center shrink-0">
              <Minus className="w-3 h-3 text-gray-400" />
            </div>
            <span className="text-gray-300 text-sm">Otimizações ilimitadas de IA</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center shrink-0">
              <Minus className="w-3 h-3 text-gray-400" />
            </div>
            <span className="text-gray-300 text-sm">Acesso às Análises de IA e Recomendações de Cursos</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center shrink-0">
              <Minus className="w-3 h-3 text-gray-400" />
            </div>
            <span className="text-gray-300 text-sm">Acesso aos 5 Templates Premium</span>
          </li>
        </ul>

        <button
          onClick={onClose}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg mb-3 mt-6"
        >
          Não, manter meu plano
        </button>
        <button
          disabled={isCanceling}
          onClick={async () => {
            setIsCanceling(true);
            try {
              await onConfirm();
            } catch (err) {
              console.error("Falha no cancelamento:", JSON.stringify(err, null, 2));
              alert("Erro ao cancelar a assinatura. Tente novamente.");
            } finally {
              setIsCanceling(false);
              onClose();
            }
          }}
          className="w-full bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isCanceling ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Cancelando...
            </>
          ) : (
            'Sim, cancelar assinatura'
          )}
        </button>
      </div>
    </div>
  );
}

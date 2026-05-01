import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Zap, BarChart, Star, Check, ArrowLeft, CreditCard, QrCode, CheckCircle, Loader2 
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancelRequest?: () => void;
  initialStep?: 'plans' | 'payment';
}

export function SubscriptionModal({ isOpen, onClose, onCancelRequest, initialStep }: SubscriptionModalProps) {
  const { user, isPro, activateSubscription } = useUser();
  const [checkoutStep, setCheckoutStep] = useState<'plans' | 'payment' | 'success'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<'mensal' | 'anual'>('mensal');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Reset state when opened
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (isOpen) {
      setCheckoutStep(initialStep ?? 'plans');
      setCardNumber('');
      setCardName('');
      setCardExpiry('');
      setCardCvv('');
    }
  }, [isOpen, initialStep]);

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove non-digits
      .substring(0, 16) // Limit to 16 digits
      .replace(/(\d{4})(?=\d)/g, '$1 '); // Add space every 4 digits
  };

  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove non-digits
      .substring(0, 4) // Limit to 4 digits
      .replace(/(\d{2})(?=\d)/g, '$1/'); // Add slash after 2 digits
  };

  const formatCVV = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove non-digits
      .substring(0, 4); // Limit to 3 or 4 digits
  };

  if (!isOpen) return null;

  const progressPercent = Math.min(100, ((user?.creditosUsados || 0) / (user?.creditosTotais === 999999 ? 1 : (user?.creditosTotais || 1))) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        {checkoutStep === 'plans' && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" /> Assinatura e Uso
              </h2>
              <button 
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Usage Section */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <BarChart className="w-4 h-4" /> Uso do Mês
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {user?.creditosUsados} / {user?.creditosTotais === 999999 ? 'Ilimitado' : user?.creditosTotais}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {user?.creditosUsados} de {user?.creditosTotais === 999999 ? 'ilimitados' : user?.creditosTotais} currículos otimizados
                </p>
              </div>

              {/* Plan Section */}
              {isPro ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Plano Pro Ativo</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Próxima renovação: {user?.dataRenovacao}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                    <p className="text-emerald-400 font-medium text-sm">Comece com 14 dias grátis!</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      onClick={() => setSelectedPlan('mensal')}
                      className={`border rounded-xl p-4 cursor-pointer transition-colors ${selectedPlan === 'mensal' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 hover:border-emerald-500/50 bg-slate-900/30'}`}
                    >
                      <p className={`text-sm font-medium mb-1 ${selectedPlan === 'mensal' ? 'text-emerald-400' : 'text-slate-400'}`}>Mensal</p>
                      <p className="text-xl font-bold text-white">R$ 19,99<span className="text-xs font-normal text-slate-400">/mês</span></p>
                    </div>
                    <div 
                      onClick={() => setSelectedPlan('anual')}
                      className={`border rounded-xl p-4 cursor-pointer relative transition-colors ${selectedPlan === 'anual' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 hover:border-emerald-500/50 bg-slate-900/30'}`}
                    >
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                        Economize 25%
                      </span>
                      <p className={`text-sm font-medium mb-1 ${selectedPlan === 'anual' ? 'text-emerald-400' : 'text-slate-400'}`}>Anual</p>
                      <p className="text-xl font-bold text-white">R$ 14,99<span className="text-xs font-normal text-slate-400">/mês</span></p>
                      <p className="text-[10px] text-slate-500 mt-1">Cobrado R$ 179,88 anualmente</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5 pt-2">
                    <li className="flex items-center gap-2.5 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      Otimizações ilimitadas
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      Análises de IA (Dicas, Cursos e Melhorias)
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      Todos os templates
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      Suporte prioritário
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Fechar
              </button>
              {isPro ? (
                <button 
                  onClick={() => {
                    onClose();
                    if (onCancelRequest) {
                      onCancelRequest();
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium bg-slate-700 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-colors"
                >
                  Cancelar Assinatura
                </button>
              ) : (
                <button 
                  onClick={() => {
                    console.log("Iniciando checkout...");
                    setCheckoutStep('payment');
                  }}
                  className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors"
                >
                  Fazer Upgrade
                </button>
              )}
            </div>
          </>
        )}

        {checkoutStep === 'payment' && (
          <>
            <div className="flex items-center p-4 border-b border-slate-700 relative">
              <button 
                onClick={() => setCheckoutStep('plans')}
                className="absolute left-4 p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
              <h2 className="text-lg font-bold text-white w-full text-center">
                Pagamento
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex bg-slate-900 rounded-xl p-1">
                <button
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${paymentMethod === 'credit_card' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <CreditCard className="w-4 h-4" /> Cartão
                </button>
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${paymentMethod === 'pix' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <QrCode className="w-4 h-4" /> Pix
                </button>
              </div>

              {paymentMethod === 'credit_card' ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 block">Número do Cartão</label>
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 block">Nome no Cartão</label>
                    <input 
                      type="text" 
                      placeholder="JOAO SILVA" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm uppercase"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 block">Validade</label>
                      <input 
                        type="text" 
                        placeholder="MM/AA" 
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 block">CVV</label>
                      <input 
                        type="text" 
                        placeholder="123" 
                        value={cardCvv}
                        onChange={(e) => setCardCvv(formatCVV(e.target.value))}
                        maxLength={4}
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                  <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center p-2">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Copiar Código Pix
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-700">
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={async (e) => {
                  e.preventDefault();
                  console.log('Tentando ativar plano...', { selectedPlan, paymentMethod });
                  setIsProcessingPayment(true);
                  try {
                    const planToDatabase = selectedPlan === 'anual' ? 'annual' : 'monthly';
                    console.log('Payload para o banco:', { planToDatabase, paymentMethod });
                    await activateSubscription({
                      planType: planToDatabase,
                      paymentMethod,
                      cardLastFour: cardNumber.replace(/\s/g, '').slice(-4) || undefined,
                    });
                    setCheckoutStep('success');
                  } catch (err: unknown) {
                    console.error("Erro completo do Supabase:", JSON.stringify(err, null, 2));
                    const msg =
                      err instanceof Error
                        ? err.message
                        : (err as Record<string, unknown>)?.message
                          ? String((err as Record<string, unknown>).message)
                          : JSON.stringify(err);
                    alert(`Erro ao ativar assinatura: ${msg}`);
                  } finally {
                    setIsProcessingPayment(false);
                  }
                }}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : isPro ? (
                  'Atualizar Método de Pagamento'
                ) : (
                  'Iniciar Teste Grátis de 14 Dias'
                )}
              </button>
            </div>
          </>
        )}

        {checkoutStep === 'success' && (
          <div className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-3">
              <p className="text-emerald-400 font-semibold text-base tracking-wide">
                ✅ Assinatura ativada com sucesso!
              </p>
              <h2 className="text-2xl font-bold text-white">Parabéns!</h2>
              <p className="text-slate-400 leading-relaxed">
                Sua conta Pro está ativa. Você agora tem acesso a otimizações ilimitadas,{' '}
                <span className="text-emerald-400 font-medium">Análises de IA</span> e todos os templates.
              </p>
            </div>
            <button 
              onClick={() => {
                onClose();
              }}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors"
            >
              Ir para o Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

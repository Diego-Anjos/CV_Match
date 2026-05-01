import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermosPage() {
  const dataAtual = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link 
          href="/cadastro" 
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-500 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Cadastro
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 sm:p-12">
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 mb-2">
            Termos de Serviço - CV Match
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Última atualização: {dataAtual}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            <p className="mb-4">
              Bem-vindo(a) ao CV Match. Ao acessar e utilizar nossa plataforma, você concorda em cumprir e ficar vinculado aos seguintes Termos de Serviço. Se você não concorda com qualquer parte destes termos, não deverá utilizar nossos serviços.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              1. Descrição do Serviço
            </h2>
            <p className="mb-4">
              O CV Match é uma plataforma SaaS (Software as a Service) que utiliza Inteligência Artificial para otimizar e formatar currículos profissionais com base em descrições de vagas específicas. Nosso objetivo é melhorar a apresentação do seu perfil profissional. No entanto, o CV Match não garante entrevistas, contratações ou qualquer resultado específico em processos seletivos, atuando exclusivamente como uma ferramenta de apoio.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              2. Criação de Conta e Segurança
            </h2>
            <p className="mb-4">
              Para utilizar nossos serviços, você deve criar uma conta fornecendo informações precisas e completas. Você é o único responsável por manter a confidencialidade das suas credenciais de acesso (e-mail e senha) e por todas as atividades que ocorrerem sob a sua conta. O CV Match não se responsabiliza por perdas ou danos resultantes do uso não autorizado do seu perfil.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              3. Planos de Assinatura e Pagamentos
            </h2>
            <p className="mb-4">
              O CV Match opera em um modelo Freemium:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Plano Grátis:</strong> Oferece acesso limitado a créditos de otimização e a um número restrito de templates de currículo.</li>
              <li><strong>Plano Pro (Premium):</strong> Oferece otimizações ilimitadas pela IA e acesso a todos os templates exclusivos.</li>
            </ul>
            <p className="mb-4">
              Os pagamentos do Plano Pro são cobrados de forma recorrente (mensal ou anual), conforme escolhido no momento da assinatura.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              4. Cancelamento de Assinatura
            </h2>
            <p className="mb-4">
              Você pode cancelar sua assinatura Pro a qualquer momento através do painel de Configurações.
            </p>
            <p className="mb-4">
              <strong>Acesso após o cancelamento:</strong> O cancelamento interrompe a renovação automática, mas você continuará tendo acesso aos benefícios do Plano Pro até o final do ciclo de faturamento atual.
            </p>
            <p className="mb-4">
              Após o término do ciclo, sua conta retornará automaticamente para o Plano Grátis, perdendo acesso às otimizações ilimitadas e aos templates premium. Não oferecemos reembolsos proporcionais por períodos parcialmente utilizados.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              5. Uso da Inteligência Artificial e Revisão de Conteúdo
            </h2>
            <p className="mb-4">
              A nossa IA gera sugestões de textos e resumos com base nas informações que você insere manualmente na plataforma. É de sua exclusiva responsabilidade revisar, editar e garantir a veracidade de todas as informações geradas antes de exportar e utilizar o documento final. O CV Match não se responsabiliza por dados incorretos, exagerados ou inverídicos gerados no seu currículo.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              6. Privacidade e Proteção de Dados (LGPD)
            </h2>
            <p className="mb-4">
              Nós respeitamos a sua privacidade. Todos os dados inseridos na plataforma (como nome, contato, experiências e histórico acadêmico) são utilizados exclusivamente para o propósito de gerar o seu currículo e treinar o modelo de otimização atrelado à sua conta. Para entender em detalhes como coletamos, usamos e protegemos seus dados, consulte nossa Política de Privacidade.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              7. Propriedade Intelectual
            </h2>
            <p className="mb-4">
              Todo o design da plataforma, código-fonte, algoritmos, logotipos e os layouts visuais dos templates de currículo são de propriedade exclusiva do CV Match. É expressamente proibida a revenda, cópia, distribuição ou engenharia reversa dos nossos templates ou do sistema. Você retém, no entanto, total propriedade sobre os seus dados pessoais e o conteúdo de texto inserido no currículo.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              8. Modificações nos Termos
            </h2>
            <p className="mb-4">
              O CV Match reserva-se o direito de alterar estes Termos de Serviço a qualquer momento. Notificaremos os usuários sobre mudanças significativas através do e-mail cadastrado ou por um aviso claro em nosso painel. O uso contínuo da plataforma após as alterações constitui aceitação dos novos termos.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              9. Contato
            </h2>
            <p className="mb-4">
              Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato com nossa equipe de suporte através do e-mail: <a href="mailto:suporte@cvmatch.com.br" className="text-emerald-600 hover:text-emerald-500 hover:underline">suporte@cvmatch.com.br</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

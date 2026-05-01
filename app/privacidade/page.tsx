import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacidadePage() {
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
            Política de Privacidade - CV Match
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Última atualização: {dataAtual}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            <p className="mb-4">
              A sua privacidade é fundamental para nós. Esta Política de Privacidade descreve como o CV Match coleta, usa, protege e compartilha suas informações pessoais quando você utiliza nossa plataforma e nossos serviços de otimização de currículos por Inteligência Artificial.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              1. Informações que Coletamos
            </h2>
            <p className="mb-4">
              Para fornecer nossos serviços, coletamos os seguintes tipos de informações:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Dados de Cadastro:</strong> Nome completo, endereço de e-mail e senha (criptografada).</li>
              <li><strong>Dados Profissionais:</strong> Informações que você insere voluntariamente na plataforma, como histórico profissional, formação acadêmica, habilidades, contatos e o conteúdo original do seu currículo.</li>
              <li><strong>Dados de Pagamento:</strong> Se você assinar o Plano Pro, informações de faturamento serão processadas. Nota: Não armazenamos os dados completos do seu cartão de crédito; eles são processados de forma segura por nossos parceiros de pagamento.</li>
              <li><strong>Dados de Uso:</strong> Informações automáticas sobre como você interage com a plataforma (ex: templates escolhidos, frequência de uso e logs de erros) para melhorar nosso sistema.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              2. Como Usamos Suas Informações
            </h2>
            <p className="mb-4">
              Utilizamos seus dados exclusivamente para:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Criar e gerenciar sua conta no CV Match.</li>
              <li>Processar as informações através do nosso motor de Inteligência Artificial para gerar sugestões, resumos e otimizações personalizadas para o seu currículo.</li>
              <li>Renderizar e exportar seus currículos nos templates escolhidos.</li>
              <li>Processar pagamentos e gerenciar sua assinatura.</li>
              <li>Enviar comunicações importantes sobre a sua conta, atualizações do sistema ou suporte técnico.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              3. Compartilhamento de Dados e Inteligência Artificial
            </h2>
            <p className="mb-4">
              Nós não vendemos seus dados pessoais para terceiros.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Uso da IA:</strong> Os textos do seu currículo são processados por modelos de Inteligência Artificial para gerar as otimizações. Garantimos que seus dados pessoais sensíveis não são utilizados para treinar modelos de IA públicos de terceiros, sendo restritos ao escopo da sua própria conta.</li>
              <li><strong>Provedores de Serviço:</strong> Podemos compartilhar informações estritamente necessárias com serviços de infraestrutura (como provedores de hospedagem em nuvem e gateways de pagamento) que operam sob rigorosos acordos de confidencialidade.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              4. Armazenamento e Segurança
            </h2>
            <p className="mb-4">
              Adotamos medidas de segurança técnicas e organizacionais (como criptografia e conexões seguras HTTPS) para proteger seus dados contra acesso não autorizado, perda ou alteração. Seus dados são armazenados em servidores seguros de provedores de nuvem reconhecidos no mercado.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              5. Seus Direitos (LGPD)
            </h2>
            <p className="mb-4">
              De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem o direito de:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Acessar os dados que temos sobre você.</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
              <li>Solicitar a exclusão dos seus dados pessoais e da sua conta a qualquer momento.</li>
              <li>Revogar o consentimento para o processamento de dados (o que pode impossibilitar o uso da plataforma).</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              6. Uso de Cookies
            </h2>
            <p className="mb-4">
              Utilizamos cookies e tecnologias semelhantes apenas para manter sua sessão ativa, lembrar suas preferências de idioma e tema (Dark Mode/Light Mode), e entender estatísticas básicas de acesso.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              7. Alterações nesta Política
            </h2>
            <p className="mb-4">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas através de um aviso em nosso painel ou por e-mail.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
              8. Contato
            </h2>
            <p className="mb-4">
              Para exercer seus direitos ou tirar dúvidas sobre como tratamos seus dados, entre em contato com nosso Encarregado de Proteção de Dados (DPO) através do e-mail: <a href="mailto:privacidade@cvmatch.com.br" className="text-emerald-600 hover:text-emerald-500 hover:underline">privacidade@cvmatch.com.br</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

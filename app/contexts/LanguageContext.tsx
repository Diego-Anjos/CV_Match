'use client';

import React, { createContext, useContext, useState } from 'react';

export const translations = {
  pt: {
    // Navigation & titles
    settingsTitle: 'Configurações da Conta',
    myAccount: 'Minha Conta',
    fullName: 'Nome Completo',
    email: 'E-mail',
    changePassword: 'Alterar Senha',
    systemPreferences: 'Preferências do Sistema',
    interfaceTheme: 'Tema da Interface',
    themeDesc: 'Escolha o visual do seu painel',
    light: 'Claro',
    dark: 'Escuro',
    language: 'Idioma',
    languageDesc: 'Idioma principal do sistema',
    subscription: 'Assinatura',
    currentPlan: 'Plano Atual',
    basicFree: 'Básico (Gratuito)',
    upgradePro: 'Fazer Upgrade para Pro',
    integrations: 'Integrações',
    connectLinkedIn: 'Conectar com LinkedIn',
    deleteAccount: 'Excluir Conta',
    navDashboard: 'Dashboard',
    navOpenJobs: 'Oportunidades sob Medida',
    navTalentPool: 'Histórico de Análises',
    navAiAnalyses: 'Análises de IA',
    navSettings: 'Configurações',
    searchPlaceholder: 'Buscar candidatos...',
    analyzeResume: 'Analisar Currículo',
    titleHome: 'Início',
    titleNewOptimization: 'Nova Otimização',
    titleTemplates: 'Templates de Currículo',
    titleOpenJobs: 'Oportunidades sob Medida',
    titleTalentPool: 'Histórico de Análises',
    titleAiAnalyses: 'Análises de IA',
    titleSettings: 'Configurações',
    welcomeTitle: 'Bem-vindo ao CV Match',
    welcomeDesc: 'Otimize seu processo de recrutamento com o poder da Inteligência Artificial. Encontre os melhores talentos em segundos e tome decisões baseadas em dados.',
    startOptimization: 'Iniciar Nova Otimização de Currículo',
    step1Title: 'Passo 1: Seus Dados e o Contexto da Vaga',
    jobContext: 'Contexto da Vaga',
    companyName: 'Nome da Empresa',
    companyPlaceholder: 'Ex: TechNova Solutions',
    jobDescription: 'Descrição da Vaga',
    jobDescPlaceholder: 'Cole aqui a descrição completa da vaga...',
    analyzeWithAI: 'Analisar e Otimizar com IA',
    matchScore: 'Match Score',
    aiSummary: 'Resumo da IA',
    professionalExperience: 'Experiência Profissional',
    skillsAnalysis: 'Análise de Habilidades',
    chooseTemplate: 'Escolher Template',
    redoAnalysis: 'Refazer Análise',
    step2Title: 'Passo 2: Escolha o Visual do seu Currículo Otimizado',
    techProfessional: 'Profissional Tech',
    classicExecutive: 'Executivo Clássico',
    agileMinimalist: 'Minimalista Ágil',
    backToAnalysis: 'Voltar para Análise',
    exportPdf: 'Visualizar e Exportar PDF Final',
    inDevelopment: 'Em Desenvolvimento',
    availableSoon: 'Esta seção estará disponível em breve.',
    myOptimizedResumes: 'Histórico de Análises',
    newOptimizationBtn: '+ Nova Otimização',
    statusSent: 'Enviado',
    statusInterviewing: 'Em Entrevista',
    statusDraft: 'Rascunho',
    createdOn: 'Criado em',
    fileAttached: 'Curriculo_Joao.pdf anexado',
    fillRequiredFields: 'Por favor, anexe um currículo e preencha a descrição da vaga.',
    aiAnalyzing: 'A IA do CV Match está analisando seu perfil...',
    analysisResults: 'Resultados da Análise',
    foundKeywords: 'Palavras-chave Encontradas',
    missingKeywords: 'Sugestões de Palavras-chave Faltantes',
    proceedToTemplates: 'Avançar para Escolha de Templates',
    jobTitle: 'Nome da Vaga',
    jobTitlePlaceholder: 'Ex: Desenvolvedor Front-end Sênior',
    cultureFitTitle: 'Alinhamento Cultural',
    actionableFeedbackTitle: 'Sugestões de Melhoria',
    analysisError: 'Ocorreu um erro ao analisar o currículo. Tente novamente.',
    downloadPdf: 'Baixar PDF',
    close: 'Fechar',
    // Account form
    saveChanges: 'Salvar Alterações',
    saving: 'Salvando...',
    saved: 'Salvo!',
    notEditable: 'Não editável',
    phone: 'Telefone',
    cityState: 'Cidade / Estado',
    portfolioSite: 'Portfólio / Site',
    // Subscription (Pro plan)
    value: 'Valor',
    nextRenewal: 'Próxima Renovação',
    paymentMethod: 'Método de Pagamento',
    changePaymentMethod: 'Alterar Método de Pagamento',
    cancelSubscription: 'Cancelar Assinatura',
    subscriptionUpdated: 'Assinatura atualizada!',
    perMonth: '/mês',
    // Tailored Opportunities empty state
    comingSoon: 'Em Breve',
    newFeatureTitle: 'Novidade chegando em breve!',
    aiTrainingDesc: 'Nossa IA está sendo treinada para varrer o mercado e buscar as vagas que dão o "Match" perfeito com as suas habilidades. Fique de olho nas próximas atualizações!',
    backToDashboard: 'Voltar para o Dashboard',
  },
  en: {
    // Navigation & titles
    settingsTitle: 'Account Settings',
    myAccount: 'My Account',
    fullName: 'Full Name',
    email: 'Email',
    changePassword: 'Change Password',
    systemPreferences: 'System Preferences',
    interfaceTheme: 'Interface Theme',
    themeDesc: 'Choose your dashboard appearance',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    languageDesc: 'Main system language',
    subscription: 'Subscription',
    currentPlan: 'Current Plan',
    basicFree: 'Basic (Free)',
    upgradePro: 'Upgrade to Pro',
    integrations: 'Integrations',
    connectLinkedIn: 'Connect with LinkedIn',
    deleteAccount: 'Delete Account',
    navDashboard: 'Dashboard',
    navOpenJobs: 'Tailored Opportunities',
    navTalentPool: 'Analysis History',
    navAiAnalyses: 'AI Analyses',
    navSettings: 'Settings',
    searchPlaceholder: 'Search candidates...',
    analyzeResume: 'Analyze Resume',
    titleHome: 'Home',
    titleNewOptimization: 'New Optimization',
    titleTemplates: 'Resume Templates',
    titleOpenJobs: 'Tailored Opportunities',
    titleTalentPool: 'Analysis History',
    titleAiAnalyses: 'AI Analyses',
    titleSettings: 'Settings',
    welcomeTitle: 'Welcome to CV Match',
    welcomeDesc: 'Optimize your recruitment process with the power of Artificial Intelligence. Find the best talent in seconds and make data-driven decisions.',
    startOptimization: 'Start New Resume Optimization',
    step1Title: 'Step 1: Your Data and Job Context',
    jobContext: 'Job Context',
    companyName: 'Company Name',
    companyPlaceholder: 'Ex: TechNova Solutions',
    jobDescription: 'Job Description',
    jobDescPlaceholder: 'Paste the full job description here...',
    analyzeWithAI: 'Analyze and Optimize with AI',
    matchScore: 'Match Score',
    aiSummary: 'AI Summary',
    professionalExperience: 'Professional Experience',
    skillsAnalysis: 'Skills Analysis',
    chooseTemplate: 'Choose Template',
    redoAnalysis: 'Redo Analysis',
    step2Title: 'Step 2: Choose Your Optimized Resume Look',
    techProfessional: 'Tech Professional',
    classicExecutive: 'Classic Executive',
    agileMinimalist: 'Agile Minimalist',
    backToAnalysis: 'Back to Analysis',
    exportPdf: 'Preview and Export Final PDF',
    inDevelopment: 'In Development',
    availableSoon: 'This section will be available soon.',
    myOptimizedResumes: 'Analysis History',
    newOptimizationBtn: '+ New Optimization',
    statusSent: 'Sent',
    statusInterviewing: 'Interviewing',
    statusDraft: 'Draft',
    createdOn: 'Created on',
    fileAttached: 'Resume_John.pdf attached',
    fillRequiredFields: 'Please attach a resume and fill in the job description.',
    aiAnalyzing: 'CV Match AI is analyzing your profile...',
    analysisResults: 'Analysis Results',
    foundKeywords: 'Found Keywords',
    missingKeywords: 'Missing Keyword Suggestions',
    proceedToTemplates: 'Proceed to Template Selection',
    jobTitle: 'Job Title',
    jobTitlePlaceholder: 'Ex: Senior Front-end Developer',
    cultureFitTitle: 'Culture Fit',
    actionableFeedbackTitle: 'Actionable Feedback',
    analysisError: 'An error occurred while analyzing the resume. Please try again.',
    downloadPdf: 'Download PDF',
    close: 'Close',
    // Account form
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    saved: 'Saved!',
    notEditable: 'Not editable',
    phone: 'Phone',
    cityState: 'City / State',
    portfolioSite: 'Portfolio / Website',
    // Subscription (Pro plan)
    value: 'Value',
    nextRenewal: 'Next Renewal',
    paymentMethod: 'Payment Method',
    changePaymentMethod: 'Change Payment Method',
    cancelSubscription: 'Cancel Subscription',
    subscriptionUpdated: 'Subscription updated!',
    perMonth: '/month',
    // Tailored Opportunities empty state
    comingSoon: 'Coming Soon',
    newFeatureTitle: 'New feature coming soon!',
    aiTrainingDesc: 'Our AI is being trained to scan the market and find the jobs that are the perfect "Match" for your skills. Stay tuned for upcoming updates!',
    backToDashboard: 'Back to Dashboard',
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.pt;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: TranslationKey): string => {
    return (translations[language][key] as string) ?? (translations.pt[key] as string) ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { LogoCVMatch } from '../components/LogoCVMatch';
import { 
  Briefcase, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  Settings, 
  User,
  BrainCircuit,
  UploadCloud,
  Star,
  TrendingUp,
  LayoutDashboard,
  FileEdit,
  Sparkles,
  Building2,
  LayoutTemplate,
  Download,
  ArrowLeft,
  Sun,
  Moon,
  Globe,
  CreditCard,
  Link as LinkIcon,
  Trash2,
  Lock,
  ChevronDown,
  Loader2,
  FileCheck,
  ArrowRight,
  X,
  Plus,
  Mail,
  Phone,
  MapPin,
  Map,
  PlayCircle,
  LogOut,
  HelpCircle,
  Zap,
  Check,
  BarChart,
  QrCode,
  AlertTriangle,
  Minus,
  Target,
  BookOpen,
  ArrowUpRight,
  Lightbulb,
  History,
  RefreshCw,
  Rocket,
  FileSearch
} from 'lucide-react';
import { useUser, IAAnalysisData } from '../contexts/UserContext';
import { useLanguage, translations } from '../contexts/LanguageContext';
import { CancelSubscriptionModal } from '../components/CancelSubscriptionModal';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { DeleteAccountModal } from '../components/DeleteAccountModal';
import { createClient } from '@/utils/supabase/client';

const mockAiData: IAAnalysisData = {
  matchScore: 85,
  feedbackGeral: "Seu perfil é extremamente sólido na stack de front-end moderno, destacando-se em React e Next.js. No entanto, para vagas de Sênior em grandes corporações, notei uma pequena lacuna em liderança técnica e arquitetura de micro-frontends.",
  habilidadesAderentes: ["React / Next.js", "TypeScript", "Tailwind CSS", "Arquitetura Front-end"],
  trilhaEstudos: [
    { lacuna: "Aprofundar conhecimentos práticos em CI/CD & DevOps.", acao: "Estudar Github Actions ou Gitlab CI", cursoRecomendado: "CI/CD para Front-end", plataforma: "Alura" },
    { lacuna: "Desenvolver soft skills voltadas para mentoria e liderança técnica de times ágeis.", acao: "Praticar mentoria com juniores", cursoRecomendado: "Liderança Técnica", plataforma: "Udemy" },
    { lacuna: "Experiência prática em testes E2E e TDD.", acao: "Implementar testes E2E num projeto", cursoRecomendado: "Cypress na Prática", plataforma: "Coursera" }
  ]
};


function CustomJobsView({ theme, setActiveView }: { theme: string, language?: 'pt' | 'en', setActiveView?: (v: string) => void }) {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 overflow-x-hidden md:max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className={`text-2xl md:text-3xl font-display font-bold flex items-center gap-3 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
          {t('titleOpenJobs')}
          <span className="text-[10px] md:text-xs uppercase font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30">{t('comingSoon')}</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col items-center justify-center text-center py-20"
      >
        <div className="bg-emerald-500/10 p-6 rounded-full mb-6">
          <Rocket className="w-20 h-20 text-emerald-500" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-4">
          {t('newFeatureTitle')}
        </h3>

        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
          {t('aiTrainingDesc')}
        </p>

        <button
          onClick={() => setActiveView?.('dashboard')}
          className="border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg px-6 py-3 mt-8 transition-all"
        >
          {t('backToDashboard')}
        </button>
      </motion.div>
    </div>
  );
}

export default function CVMatchDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState('tech');
  const [theme, setTheme] = useState('light');
  const [generatedCvData, setGeneratedCvData] = useState<any>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardHomeView theme={theme} setActiveView={setActiveView} language={language} />;
      case 'nova-otimizacao':
        return <NewOptimizationView theme={theme} setActiveView={setActiveView} language={language} setGeneratedCvData={setGeneratedCvData} />;
      case 'analises':
        return <AnalysisView theme={theme} setActiveView={setActiveView} language={language} />;
      case 'templates':
        return <TemplatesView theme={theme} setActiveView={setActiveView} language={language} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} generatedCvData={generatedCvData} setShowPlanModal={setShowPlanModal} />;
      case 'vagas':
        return <CustomJobsView theme={theme} language={language} setActiveView={setActiveView} />;
      case 'banco':
        return <OptimizedResumesHistoryView theme={theme} setActiveView={setActiveView} language={language} />;
      case 'configuracoes':
        return <SettingsView theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} setShowPlanModal={setShowPlanModal} />;
      case 'suporte':
        return <SupportView theme={theme} language={language} />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center p-8 h-full min-h-[60vh]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                <Settings className="w-8 h-8" />
              </div>
              <h3 className={`text-xl font-display font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{t.inDevelopment}</h3>
              <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.availableSoon}</p>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} language={language} />

      {/* Main Content */}
      <main className={`flex-1 flex flex-col h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        {/* Top Header */}
        <Header activeView={activeView} theme={theme} language={language} />

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </div>
      </main>

      <SubscriptionModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onCancelRequest={() => setShowPlanModal(false)}
      />
    </div>
  );
}

function DashboardHomeView({ theme, setActiveView, language }: { theme: string, setActiveView: (v: string) => void, language: 'pt' | 'en' }) {
  const t = translations[language];
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 h-full min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className={`text-center max-w-2xl p-8 md:p-12 rounded-3xl shadow-sm border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
          <LogoCVMatch className="w-10 h-10" />
        </div>
        <h2 className={`text-3xl font-display font-bold mb-4 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{t.welcomeTitle}</h2>
        <p className={`text-lg mb-8 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
          {t.welcomeDesc}
        </p>
        <button 
          onClick={() => setActiveView('nova-otimizacao')}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 mx-auto w-full sm:w-auto"
        >
          <UploadCloud className="w-6 h-6" />
          {t.startOptimization}
        </button>
      </motion.div>
    </div>
  );
}

function NewOptimizationView({ theme, setActiveView, language, setGeneratedCvData }: { theme: string, setActiveView: (v: string) => void, language: 'pt' | 'en', setGeneratedCvData: (data: any) => void }) {
  const t = translations[language];
  const { canGenerateCv, addCreditUsage, user } = useUser();
  const [baseCv, setBaseCv] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: '',
    resumo: '',
    experiencia: '',
    formacao: '',
    certificacoes: '',
    habilidades: '',
    experiencias: [{ cargo: '', empresa: '', descricao: '' }]
  });
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<IAAnalysisData | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const handleDemoFill = () => {
    setBaseCv({
      nome: 'Diego dos Anjos',
      email: 'diego.anjos@exemplo.com',
      telefone: '(11) 99999-9999',
      cidade: 'São Paulo',
      estado: 'SP',
      resumo: 'Desenvolvedor Front-end apaixonado por criar interfaces de usuário intuitivas e performáticas. Especialista em React, Next.js e ecossistema JavaScript. Foco em acessibilidade e clean code.',
      experiencia: 'Tech Solutions Inc. | Desenvolvedor Front-end Sênior (2022 – Atual)\n- Liderou migração do sistema legado para React, melhorando performance em 40%.\n- Implementou design system com Tailwind CSS.\n\nAgência Digital | Desenvolvedor Web Pleno (2020 – 2022)\n- Desenvolvimento de landing pages de alta conversão e e-commerces.\n- Integração com APIs RESTful e CMS headless.',
      formacao: 'Análise e Desenvolvimento de Sistemas – FATEC (Concluído, 2020)\nInglês Avançado | Espanhol Básico',
      certificacoes: 'AWS Cloud Practitioner (2023)\nNext.js & React – The Complete Guide (Udemy, 2022)\nBootcamp Front-end – DIO (2021)',
      habilidades: 'React, Next.js, TypeScript, Tailwind CSS, Node.js',
      experiencias: [
        {
          cargo: 'Desenvolvedor Front-end Sênior',
          empresa: 'Tech Solutions Inc.',
          descricao: 'Liderou a migração do sistema legado para React, melhorando a performance em 40%. Implementou design system utilizando Tailwind CSS.'
        },
        {
          cargo: 'Desenvolvedor Web Pleno',
          empresa: 'Agência Digital',
          descricao: 'Desenvolvimento de landing pages de alta conversão e e-commerces. Integração com APIs RESTful e CMS headless.'
        }
      ]
    });
  };

  const handleAddExperience = () => {
    setBaseCv({
      ...baseCv,
      experiencias: [...baseCv.experiencias, { cargo: '', empresa: '', descricao: '' }]
    });
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperiences = [...baseCv.experiencias];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    setBaseCv({ ...baseCv, experiencias: newExperiences });
  };

  const handleAnalyze = async () => {
    if (!canGenerateCv) {
      setIsUpgradeModalOpen(true);
      return;
    }

    if (!baseCv.nome || !jobDescription.trim()) {
      setError(t.fillRequiredFields);
      return;
    }
    setError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseCv,
          jobTitle,
          jobDescription,
          companyName,
          userName: user?.nome
        })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.details || errBody.error || `Erro ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);

      // Build the CV data object from the user's own input so the Templates
      // view is always populated with real data after a successful analysis.
      const habilidadesRaw: string = baseCv.habilidades || '';
      const skillsFromInput = habilidadesRaw
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
      const skillsSource: string[] =
        skillsFromInput.length > 0
          ? skillsFromInput
          : (data.habilidadesAderentes ?? []);

      const cvFromAnalysis = {
        nome: baseCv.nome,
        email: baseCv.email,
        telefone: baseCv.telefone,
        cidade: baseCv.cidade,
        estado: baseCv.estado,
        linkedin: '',
        portfolio: '',
        cargoAlvo: jobTitle || '',
        resumoProfissional: baseCv.resumo || '',
        experiencias: baseCv.experiencias.map((exp) => ({
          empresa: exp.empresa,
          cargo: exp.cargo,
          periodo: '',
          descricao: exp.descricao,
        })),
        competenciasTecnicas: skillsSource.map((name, i) => ({
          name,
          level: Math.max(70, 95 - i * 5),
        })),
      };
      setGeneratedCvData(cvFromAnalysis);

      addCreditUsage();
      setShowResults(true);

      try {
        const supabase = createClient();
        const { data: { user: sbUser } } = await supabase.auth.getUser();
        if (sbUser) {
          await supabase.from('analyses').insert({
            user_id: sbUser.id,
            company_name: companyName,
            job_title: jobTitle,
            match_score: data.matchScore,
            analysis_data: data,
          });
        }
      } catch (saveErr) {
        console.error('[handleAnalyze] Erro ao salvar análise no Supabase:', saveErr);
      }
    } catch (err: any) {
      console.error('[handleAnalyze]', err);
      setError(err.message || t.analysisError);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-full min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center"
        >
          <Loader2 className={`w-16 h-16 animate-spin mb-6 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'}`} />
          <h2 className={`text-2xl font-display font-bold mb-2 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{t.aiAnalyzing}</h2>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Isso pode levar alguns segundos...</p>
        </motion.div>
      </div>
    );
  }

  if (showResults && analysisResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className={`text-2xl md:text-3xl font-display font-bold mb-8 text-center ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
            {t.analysisResults}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Match Score Circular Graph */}
            <div className={`col-span-1 rounded-2xl p-8 shadow-sm border flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{t.matchScore}</h3>
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className={`${theme === 'dark' ? 'text-slate-700' : 'text-slate-100'}`}
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray={`${analysisResult.matchScore}, 100`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className={`text-4xl font-display font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{analysisResult.matchScore}%</span>
                </div>
              </div>
            </div>

            {/* Justificativa */}
            <div className={`col-span-1 md:col-span-2 rounded-2xl p-6 md:p-8 shadow-sm border flex flex-col justify-center ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                <BrainCircuit className="w-5 h-5 text-emerald-500" />
                Justificativa
              </h3>
              <p className={`leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                {analysisResult.feedbackGeral}
              </p>
            </div>
          </div>

          {/* Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`rounded-2xl p-6 md:p-8 shadow-sm border space-y-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Habilidades Aderentes
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.habilidadesAderentes?.map((kw: string) => (
                  <span key={kw} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl p-6 md:p-8 shadow-sm border space-y-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Trilha de Estudos
              </h3>
              <div className="flex flex-col gap-3">
                {analysisResult.trilhaEstudos?.slice(0, 3).map((item) => (
                  <div key={item.lacuna} className={`flex flex-col gap-1 p-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{item.lacuna}</span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{item.cursoRecomendado}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActiveView('templates')}
            className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg rounded-2xl transition-all shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3"
          >
            {t.proceedToTemplates}
            <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={`text-2xl md:text-3xl font-display font-bold mb-6 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
          {t.step1Title}
        </h2>

        {error && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${theme === 'dark' ? 'bg-red-900/20 border-red-800/50 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Lado Esquerdo - Seu Currículo */}
          <div className={`rounded-2xl p-6 md:p-8 shadow-sm border flex flex-col h-[700px] ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-100 dark:border-slate-700">
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{language === 'pt' ? 'Seu Currículo Base' : 'Your Base Resume'}</h3>
              <button 
                onClick={handleDemoFill}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${theme === 'dark' ? 'border-slate-600 hover:bg-slate-700 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-600'}`}
              >
                {language === 'pt' ? 'Preencher Dados (Demo)' : 'Fill Data (Demo)'}
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar">
              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{language === 'pt' ? 'Nome Completo' : 'Full Name'}</label>
                <input 
                  type="text" 
                  value={baseCv.nome}
                  onChange={(e) => setBaseCv({...baseCv, nome: e.target.value})}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{language === 'pt' ? 'E-mail' : 'Email'}</label>
                  <input 
                    type="email" 
                    value={baseCv.email}
                    onChange={(e) => setBaseCv({...baseCv, email: e.target.value})}
                    className={`w-full p-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                    placeholder="Ex: joao@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{language === 'pt' ? 'Telefone' : 'Phone'}</label>
                  <input 
                    type="tel" 
                    value={baseCv.telefone}
                    onChange={(e) => setBaseCv({...baseCv, telefone: e.target.value})}
                    className={`w-full p-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                    placeholder="Ex: (11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{language === 'pt' ? 'Cidade' : 'City'}</label>
                  <input 
                    type="text" 
                    value={baseCv.cidade}
                    onChange={(e) => setBaseCv({...baseCv, cidade: e.target.value})}
                    className={`w-full p-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                    placeholder="Ex: São Paulo"
                  />
                </div>
                <div className="space-y-2">
                  <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{language === 'pt' ? 'Estado' : 'State'}</label>
                  <input 
                    type="text" 
                    value={baseCv.estado}
                    onChange={(e) => setBaseCv({...baseCv, estado: e.target.value})}
                    className={`w-full p-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                    placeholder="Ex: SP"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{language === 'pt' ? 'Resumo Profissional Atual' : 'Current Professional Summary'}</label>
                <textarea 
                  rows={4}
                  value={baseCv.resumo}
                  onChange={(e) => setBaseCv({...baseCv, resumo: e.target.value})}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  placeholder="Fale um pouco sobre sua trajetória..."
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{language === 'pt' ? 'Experiência Profissional' : 'Professional Experience'}</label>
                <textarea
                  rows={5}
                  value={baseCv.experiencia}
                  onChange={(e) => setBaseCv({...baseCv, experiencia: e.target.value})}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  placeholder="Cole aqui o histórico das suas últimas experiências (empresas, cargos e responsabilidades)..."
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{language === 'pt' ? 'Formação Acadêmica e Idiomas' : 'Education & Languages'}</label>
                <textarea
                  rows={3}
                  value={baseCv.formacao}
                  onChange={(e) => setBaseCv({...baseCv, formacao: e.target.value})}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  placeholder="Ex: Gestão de TI na UniFECAF (Cursando), Inglês Intermediário..."
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{language === 'pt' ? 'Cursos e Certificações' : 'Courses & Certifications'}</label>
                <textarea
                  rows={3}
                  value={baseCv.certificacoes}
                  onChange={(e) => setBaseCv({...baseCv, certificacoes: e.target.value})}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  placeholder="Ex: Certificação AWS Cloud Practitioner, Curso de React 19..."
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{language === 'pt' ? 'Habilidades (separadas por vírgula)' : 'Skills (comma separated)'}</label>
                <input 
                  type="text" 
                  value={baseCv.habilidades}
                  onChange={(e) => setBaseCv({...baseCv, habilidades: e.target.value})}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  placeholder="Ex: React, Python, Gestão de Projetos"
                />
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center pt-2">
                  <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{language === 'pt' ? 'Experiências' : 'Experiences'}</label>
                  <button 
                    onClick={handleAddExperience}
                    className="text-xs text-emerald-500 hover:text-emerald-600 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> {language === 'pt' ? 'Adicionar Experiência' : 'Add Experience'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  {baseCv.experiencias.map((exp, index) => (
                    <div key={index} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'pt' ? 'Cargo' : 'Role'}</label>
                          <input 
                            type="text" 
                            value={exp.cargo}
                            onChange={(e) => handleExperienceChange(index, 'cargo', e.target.value)}
                            className={`w-full p-2 text-sm rounded-lg border focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-gray-900 placeholder-gray-400 ${theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300'}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'pt' ? 'Empresa' : 'Company'}</label>
                          <input 
                            type="text" 
                            value={exp.empresa}
                            onChange={(e) => handleExperienceChange(index, 'empresa', e.target.value)}
                            className={`w-full p-2 text-sm rounded-lg border focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-gray-900 placeholder-gray-400 ${theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300'}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'pt' ? 'Descrição' : 'Description'}</label>
                        <textarea 
                          rows={3}
                          value={exp.descricao}
                          onChange={(e) => handleExperienceChange(index, 'descricao', e.target.value)}
                          className={`w-full p-2 text-sm rounded-lg border focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none text-gray-900 placeholder-gray-400 ${theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito - Contexto da Vaga */}
          <div className={`rounded-2xl p-6 md:p-8 shadow-sm border flex flex-col h-[700px] ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-lg font-bold border-b pb-4 mb-6 ${theme === 'dark' ? 'text-slate-200 border-slate-700' : 'text-slate-800 border-slate-100'}`}>{t.jobContext}</h3>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{t.companyName}</label>
                <div className="relative">
                  <Building2 className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={t.companyPlaceholder} 
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{t.jobTitle}</label>
                <div className="relative">
                  <Briefcase className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input 
                    type="text" 
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder={t.jobTitlePlaceholder} 
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  />
                </div>
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{t.jobDescription}</label>
                <textarea 
                  className={`w-full flex-1 min-h-[200px] p-4 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  placeholder={t.jobDescPlaceholder}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleAnalyze}
          className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg rounded-2xl transition-all shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3"
        >
          <Sparkles className="w-6 h-6" />
          {t.analyzeWithAI}
        </button>
      </motion.div>

      <SubscriptionModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onCancelRequest={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}

function AnalysisView({ theme, setActiveView, language }: { theme: string, setActiveView: (v: string) => void, language: 'pt' | 'en' }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IAAnalysisData | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const { user, addToHistory, selectedAnalysis, isPro, supabaseUserId } = useUser();
  const supabase = createClient();

  useEffect(() => {
    if (!isPro) {
      setIsLoading(false);
      return;
    }

    if (selectedAnalysis) {
      setData(selectedAnalysis.analysisData);
      setAnalysisHistory([selectedAnalysis]);
      setIsLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        if (!supabaseUserId) {
          setAnalysisHistory([]);
          setData(null);
          return;
        }
        const { data: rows, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', supabaseUserId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const records = rows ?? [];
        setAnalysisHistory(records);

        if (records.length > 0) {
          const latest = records[0];
          setData(latest.analysis_data as IAAnalysisData);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error('[AnalysisView] Erro ao buscar histórico:', err);
        setAnalysisHistory([]);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnalysis, supabaseUserId, isPro]);

  const handleGenerateAnalysis = async () => {
    setIsLoading(true);
    try {
      const simulatedJobTitle = "Desenvolvedor Front-end Pleno/Sênior";
      const simulatedJobDescription = `${simulatedJobTitle} com ampla experiência em React, Next.js, Tailwind CSS e TypeScript. Capacidade de liderar decisões arquiteturais, focar em performance, acessibilidade e trabalhar em equipe colaborativa ágil. Conhecimentos em CI/CD e testes automatizados são diferenciais.`;
      const simulatedBaseCv = {
        nome: user?.nome || "Candidato",
        email: user?.email || "",
        experiencias: [
          {
            cargo: "Desenvolvedor Front-end Pleno",
            empresa: "Tech Corp",
            descricao: "Desenvolvimento de aplicações web utilizando React, Next.js e TypeScript. Criação de componentes escaláveis e implementação de layouts responsivos com Tailwind CSS."
          },
          {
            cargo: "Desenvolvedor Web Jr",
            empresa: "Web Solutions",
            descricao: "Criação de landing pages e manutenção de sites em HTML, CSS e JavaScript Vanilla."
          }
        ],
        habilidades: "React, Next.js, JavaScript, TypeScript, Tailwind CSS, HTML, CSS, Git"
      };

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseCv: simulatedBaseCv,
          jobTitle: simulatedJobTitle,
          jobDescription: simulatedJobDescription,
        })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      setData(result);
      
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Intl.DateTimeFormat('pt-BR').format(new Date()),
        jobTitle: simulatedJobTitle,
        companyName: "TechNova Solutions",
        status: "statusDraft",
        analysisData: result
      };
      
      addToHistory(newItem);

    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao gerar a análise da IA. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPro) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className={`rounded-2xl p-12 shadow-sm border flex flex-col items-center justify-center text-center w-full max-w-2xl ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className={`text-2xl font-display font-bold mb-4 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
            Desbloqueie o Mentor de Carreira IA
          </h2>
          <p className={`text-center max-w-md mb-8 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Usuários Premium têm acesso a trilhas de estudo personalizadas, feedback detalhado sobre lacunas do currículo e dicas práticas de evolução na carreira.
          </p>
          <button 
            onClick={() => setActiveView('configuracoes')}
            className="w-full sm:w-auto py-3 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(79,70,229,0.2)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.3)]"
          >
            Fazer Upgrade Agora
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className={`rounded-2xl p-6 md:p-8 border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-6 w-full">
            <div className={`w-20 h-20 rounded-full animate-pulse shrink-0 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <div className="flex-1 space-y-3">
              <div className={`h-7 w-56 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <div className={`h-4 w-80 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
            </div>
          </div>
          <div className={`w-full md:w-40 h-36 rounded-xl animate-pulse shrink-0 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className={`rounded-2xl p-6 md:p-8 border space-y-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className={`h-5 w-48 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <div className={`h-4 w-full rounded-lg animate-pulse ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <div className={`h-4 w-5/6 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <div className={`h-4 w-4/6 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
            </div>
            <div className={`rounded-2xl p-6 md:p-8 border space-y-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className={`h-5 w-56 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-20 w-full rounded-xl animate-pulse ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>
          <div className={`rounded-2xl p-6 border space-y-3 h-fit ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className={`h-5 w-40 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-10 w-full rounded-lg animate-pulse ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && analysisHistory.length === 0) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-20 min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <div className={`p-6 rounded-full mb-6 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
            <BrainCircuit className="w-20 h-20 text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Seu Mentor de Carreira IA aguarda!
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto leading-relaxed mb-8">
            Você ainda não realizou nenhuma otimização de currículo. Para que nossa IA analise seu perfil, identifique lacunas e crie uma trilha de estudos personalizada, faça sua primeira análise agora.
          </p>
          <button
            onClick={() => setActiveView('home')}
            className="inline-flex items-center gap-2 py-3 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.35)] active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            Nova Otimização de Currículo
          </button>
        </motion.div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header: Força do Perfil */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 md:p-8 shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
      >
        <div className="flex items-center gap-6">
          <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center shrink-0 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
            <Sparkles className="w-10 h-10 text-emerald-500" />
          </div>
          <div>
            <h2 className={`text-3xl font-display font-bold tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Mentor de Carreira IA</h2>
            <p className={`text-lg mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Feedback e recomendações personalizadas para sua evolução profissional.</p>
          </div>
        </div>
        
        <div className={`flex flex-col items-center px-8 py-6 rounded-xl border w-full md:w-auto shrink-0 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
          <span className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Match Score</span>
          <div className="relative flex items-center justify-center w-28 h-28">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className={`${theme === 'dark' ? 'text-slate-700' : 'text-slate-200'}`}
              />
              {/* Progress Circle */}
              <motion.circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 48}
                initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 48 - (data.matchScore / 100) * (2 * Math.PI * 48) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`${data.matchScore < 50 ? 'text-red-500' : data.matchScore <= 75 ? 'text-amber-500' : 'text-emerald-500'}`}
                strokeLinecap="round"
              />
            </svg>
            <div className={`absolute flex items-end gap-1 ${data.matchScore < 50 ? 'text-red-500' : data.matchScore <= 75 ? 'text-amber-500' : 'text-emerald-500'}`}>
              <span className="text-4xl font-display font-bold leading-none">{data.matchScore}</span>
              <span className="text-lg font-bold mb-1">%</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Feedback Geral */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl p-6 md:p-8 shadow-sm border relative overflow-hidden ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
                <BrainCircuit className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className={`text-xl font-display font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Feedback Geral da IA</h3>
            </div>
            <p className={`leading-relaxed text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              {data.feedbackGeral}
            </p>
          </motion.div>

          {/* Trilha de Estudos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-6 md:p-8 shadow-sm border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
                <Map className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className={`text-xl font-display font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Trilha de Estudos e Plano de Ação</h3>
            </div>
            
            <div className="space-y-4">
              {data.trilhaEstudos?.map((item, idx) => (
                <div key={idx} className={`flex flex-col gap-3 p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-slate-800'}`}>{item.lacuna}</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{item.acao}</p>
                  <div className={`flex items-center gap-2 mt-1 px-3 py-2 rounded-lg border w-fit ${theme === 'dark' ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'}`}>
                    <PlayCircle className="w-4 h-4 text-indigo-500" />
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-700'}`}>
                      {item.cursoRecomendado} - {item.plataforma}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Skills Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl p-6 shadow-sm border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
          >
            <h3 className={`text-lg font-display font-bold mb-5 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Habilidades Aderentes</h3>
            <div className="flex flex-col gap-2">
              {data.habilidadesAderentes?.map((skill: string, idx: number) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-full ${theme === 'dark' ? 'border-slate-700 bg-emerald-900/10' : 'border-emerald-100 bg-emerald-50/50'}`}
                >
                  <CheckCircle className={`w-4 h-4 shrink-0 ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'}`} />
                  <span className={`font-medium ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>{skill}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const optimizedCVData = {
  name: "João Silva",
  email: "joao.silva@exemplo.com",
  telefone: "(11) 98888-8888",
  cidade: "São Paulo",
  estado: "SP",
  linkedin: "joaosilvadev",
  portfolio: "github.com/joaosilva",
  targetRole: "Desenvolvedor Front-end Sênior",
  summary: "Desenvolvedor Front-end com mais de 8 anos de experiência criando interfaces escaláveis e de alta performance. Especialista em React, Next.js e TypeScript. Foco em UX/UI e acessibilidade.",
  experience: [
    {
      company: "TechNova Solutions",
      role: "Desenvolvedor Front-end Sênior",
      period: "2022 - Presente",
      description: "Liderou a arquitetura do novo sistema de design da empresa, reduzindo o tempo de desenvolvimento em 30%. Implementou testes E2E com Cypress."
    },
    {
      company: "Agência Creative",
      role: "Desenvolvedor Web Pleno",
      period: "2018 - 2022",
      description: "Desenvolveu mais de 20 projetos web de alto impacto usando React e Tailwind CSS. Melhorou a performance de carregamento em 40%."
    }
  ],
  skills: [
    { name: "React", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "Next.js", level: 85 },
    { name: "Tailwind CSS", level: 95 },
    { name: "UI/UX", level: 80 }
  ]
};

const templatesList = [
  { id: 'padrao', name: 'Padrão Essencial', isPro: false },
  { id: 'tech', name: 'Profissional Tech', isPro: true },
  { id: 'executivo', name: 'Executivo Clássico', isPro: true },
  { id: 'minimalista', name: 'Minimalista Ágil', isPro: true },
  { id: 'criativo', name: 'Criativo Bold', isPro: true },
  { id: 'estrategico', name: 'Estratégico Moderno', isPro: true },
  { id: 'internacional', name: 'Padrão Internacional', isPro: true },
  { id: 'jovem', name: 'Jovem Talento', isPro: true },
  { id: 'academico', name: 'Perfil Acadêmico', isPro: true },
  { id: 'portfolio', name: 'Portfólio Dinâmico', isPro: true },
  { id: 'clevel', name: 'C-Level Exclusivo', isPro: true },
  { id: 'impacto', name: 'Impacto Visual', isPro: true }
];

function TemplatesView({ theme, setActiveView, language, selectedTemplate, setSelectedTemplate, generatedCvData, setShowPlanModal }: { theme: string, setActiveView: (v: string) => void, language: 'pt' | 'en', selectedTemplate: string, setSelectedTemplate: (v: string) => void, generatedCvData?: any, setShowPlanModal: (v: boolean) => void }) {
  const t = translations[language];
  const { availableTemplates, isPro } = useUser();
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Pre-select 'padrao' if user is Free and selected template is Pro
  useEffect(() => {
    if (!isPro) {
      const currentTemplate = templatesList.find(t => t.id === selectedTemplate);
      if (currentTemplate?.isPro) {
        setSelectedTemplate('padrao');
      }
    }
  }, [isPro, selectedTemplate, setSelectedTemplate]);

  const cvData = generatedCvData ? {
    name: generatedCvData.nome || 'Nome não informado',
    email: generatedCvData.email || '',
    telefone: generatedCvData.telefone || '',
    cidade: generatedCvData.cidade || '',
    estado: generatedCvData.estado || '',
    linkedin: generatedCvData.linkedin || '',
    portfolio: generatedCvData.portfolio || '',
    targetRole: generatedCvData.cargoAlvo || '',
    summary: generatedCvData.resumoProfissional || '',
    experience: (generatedCvData.experiencias ?? []).map((exp: any) => ({
      company: exp.empresa || '',
      role: exp.cargo || '',
      period: exp.periodo || '',
      description: exp.descricao || '',
    })),
    // Normalize every skill to {name, level} regardless of what the AI returns
    skills: (generatedCvData.competenciasTecnicas ?? []).map((skill: any) => {
      if (typeof skill === 'string') return { name: skill, level: 85 };
      return { name: skill.name ?? String(skill), level: skill.level ?? 85 };
    }),
  } : optimizedCVData;

  const cvRef = useRef<HTMLDivElement>(null);
  const handleDownloadPdf = useReactToPrint({
    contentRef: cvRef,
    documentTitle: `Curriculo_Otimizado_${cvData.name.replace(/\s+/g, '_')}_${cvData.targetRole.replace(/\s+/g, '_')}`,
  });

  const handleDownload = () => {
    handleDownloadPdf();
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'padrao':
        return (
          <div className="font-sans text-slate-900 bg-white">
            <div className="mb-8 border-b border-slate-200 pb-6">
              <h1 className="text-4xl font-bold mb-2">{cvData.name}</h1>
              <h2 className="text-xl text-slate-700 mb-4">{cvData.targetRole}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                {cvData.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {cvData.email}</span>}
                {cvData.telefone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {cvData.telefone}</span>}
                {(cvData.cidade || cvData.estado) && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {cvData.cidade}{cvData.cidade && cvData.estado ? ', ' : ''}{cvData.estado}</span>}
                {cvData.linkedin && <span className="flex items-center gap-1.5">in/ {cvData.linkedin}</span>}
                {cvData.portfolio && <span className="flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> {cvData.portfolio}</span>}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-wider border-b border-slate-200 mb-3 pb-1">Resumo Profissional</h3>
              <p className="text-slate-700 leading-relaxed">{cvData.summary}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-wider border-b border-slate-200 mb-4 pb-1">Experiência</h3>
              <div className="space-y-6">
                {cvData.experience.map((exp: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold">{exp.role}</h4>
                      <span className="text-sm text-slate-500">{exp.period}</span>
                    </div>
                    <div className="text-slate-600 mb-2">{exp.company}</div>
                    <p className="text-slate-700 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider border-b border-slate-200 mb-4 pb-1">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill: any, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      case 'tech':
        return (
          <div className="font-sans text-slate-800">
            <div className="border-l-4 border-emerald-500 pl-6 mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{cvData.name}</h1>
              <h2 className="text-xl text-emerald-600 font-medium mb-4">{cvData.targetRole}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                {cvData.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {cvData.email}</span>}
                {cvData.telefone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {cvData.telefone}</span>}
                {(cvData.cidade || cvData.estado) && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {cvData.cidade}{cvData.cidade && cvData.estado ? ', ' : ''}{cvData.estado}</span>}
                {cvData.linkedin && <span className="flex items-center gap-1.5">in/ {cvData.linkedin}</span>}
                {cvData.portfolio && <span className="flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> {cvData.portfolio}</span>}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-wider text-sm border-b-2 border-slate-100 pb-2">Resumo Profissional</h3>
              <p className="text-slate-600 leading-relaxed">{cvData.summary}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm border-b-2 border-slate-100 pb-2">Experiência</h3>
              <div className="space-y-6">
                {cvData.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[29px] top-1.5 w-3 h-3 bg-emerald-500 rounded-full border-4 border-white"></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-900">{exp.role}</h4>
                      <span className="text-sm text-emerald-600 font-medium">{exp.period}</span>
                    </div>
                    <div className="text-slate-500 mb-2 font-medium">{exp.company}</div>
                    <p className="text-slate-700 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm border-b-2 border-slate-100 pb-2">Habilidades Técnicas</h3>
              <div className="grid grid-cols-2 gap-4">
                {cvData.skills.map((skill: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{skill.name}</span>
                      <span className="text-slate-400">{skill.level}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'executivo':
        return (
          <div className="font-serif text-slate-900">
            <div className="text-center mb-8 border-b-2 border-slate-800 pb-6">
              <h1 className="text-4xl font-bold mb-2">{cvData.name}</h1>
              <h2 className="text-xl text-slate-600 italic mb-4">{cvData.targetRole}</h2>
              <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-sm text-slate-700">
                {cvData.email && <span>{cvData.email}</span>}
                {cvData.email && cvData.telefone && <span>|</span>}
                {cvData.telefone && <span>{cvData.telefone}</span>}
                {(cvData.telefone && (cvData.cidade || cvData.estado)) && <span>|</span>}
                {(cvData.cidade || cvData.estado) && <span>{cvData.cidade}{cvData.cidade && cvData.estado ? ', ' : ''}{cvData.estado}</span>}
                {cvData.linkedin && <><span>|</span><span>{cvData.linkedin}</span></>}
                {cvData.portfolio && <><span>|</span><span>{cvData.portfolio}</span></>}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-3 pb-1">Resumo Profissional</h3>
              <p className="leading-relaxed">{cvData.summary}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1">Experiência Profissional</h3>
              <div className="space-y-6">
                {cvData.experience.map((exp: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-lg">{exp.role}</h4>
                      <span className="text-sm font-medium">{exp.period}</span>
                    </div>
                    <div className="text-slate-700 italic mb-2">{exp.company}</div>
                    <p className="text-slate-700 leading-relaxed text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1">Competências</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {cvData.skills.map((skill: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
                    <span className="font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'minimalista':
        return (
          <div className="font-sans text-black">
            <div className="mb-12">
              <h1 className="text-5xl font-light tracking-tight mb-2">{cvData.name}</h1>
              <h2 className="text-lg tracking-widest uppercase text-gray-500 mb-4">{cvData.targetRole}</h2>
              <div className="text-sm text-gray-500 font-light tracking-wide">
                {[
                  (cvData.cidade || cvData.estado) ? `${cvData.cidade}${cvData.cidade && cvData.estado ? '/' : ''}${cvData.estado}` : null,
                  cvData.telefone,
                  cvData.email,
                  cvData.linkedin,
                  cvData.portfolio
                ].filter(Boolean).join(' | ')}
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-8 mb-10">
              <div className="col-span-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Perfil</h3>
              </div>
              <div className="col-span-9">
                <p className="leading-relaxed font-light">{cvData.summary}</p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8 mb-10">
              <div className="col-span-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Experiência</h3>
              </div>
              <div className="col-span-9 space-y-8">
                {cvData.experience.map((exp: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-medium">{exp.role}</h4>
                      <span className="text-xs text-gray-500">{exp.period}</span>
                    </div>
                    <div className="text-gray-500 text-sm mb-3">{exp.company}</div>
                    <p className="text-slate-700 leading-relaxed font-light text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Skills</h3>
              </div>
              <div className="col-span-9">
                <div className="flex flex-wrap gap-3">
                  {cvData.skills.map((skill: any, idx: number) => (
                    <span key={idx} className="px-3 py-1 border border-gray-200 rounded-full text-sm font-light">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'criativo':
        return (
          <div className="font-sans text-slate-800">
            <div className="bg-emerald-600 text-white p-8 rounded-2xl mb-8 print:bg-emerald-600 print:text-white" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
              <h1 className="text-4xl font-bold mb-2">{cvData.name}</h1>
              <h2 className="text-xl text-emerald-100 mb-4">{cvData.targetRole}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-emerald-50">
                {cvData.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {cvData.email}</span>}
                {cvData.telefone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {cvData.telefone}</span>}
                {(cvData.cidade || cvData.estado) && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {cvData.cidade}{cvData.cidade && cvData.estado ? ', ' : ''}{cvData.estado}</span>}
                {cvData.linkedin && <span className="flex items-center gap-1.5">in/ {cvData.linkedin}</span>}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-emerald-600 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" /> Resumo
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{cvData.summary}</p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" /> Experiência
                  </h3>
                  <div className="space-y-6">
                    {cvData.experience.map((exp: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-slate-900">{exp.role}</h4>
                          <span className="text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">{exp.period}</span>
                        </div>
                        <div className="text-slate-500 mb-2 font-medium">{exp.company}</div>
                        <p className="text-slate-700 text-sm leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="col-span-1">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5" /> Skills
                  </h3>
                  <div className="flex flex-col gap-3">
                    {cvData.skills.map((skill: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-700">{skill.name}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${skill.level}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'estrategico':
        return (
          <div className="font-sans flex min-h-[297mm] -m-12 print:m-0">
            {/* Sidebar */}
            <div className="w-1/3 bg-slate-800 text-white p-8 print:bg-slate-800 print:text-white" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 leading-tight">{cvData.name}</h1>
                <h2 className="text-emerald-400 font-medium">{cvData.targetRole}</h2>
              </div>
              
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-700 pb-2">Contato</h3>
                <div className="flex flex-col gap-3 text-sm text-slate-300">
                  {cvData.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" /> <span className="break-all">{cvData.email}</span></span>}
                  {cvData.telefone && <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-400" /> {cvData.telefone}</span>}
                  {(cvData.cidade || cvData.estado) && <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> {cvData.cidade}{cvData.cidade && cvData.estado ? ', ' : ''}{cvData.estado}</span>}
                  {cvData.linkedin && <span className="flex items-center gap-2">in/ <span className="break-all">{cvData.linkedin}</span></span>}
                  {cvData.portfolio && <span className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-emerald-400" /> <span className="break-all">{cvData.portfolio}</span></span>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-700 pb-2">Habilidades</h3>
                <div className="flex flex-col gap-3">
                  {cvData.skills.map((skill: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1 text-slate-200">
                        <span>{skill.name}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${skill.level}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-2/3 bg-white text-slate-800 p-8">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                  <User className="w-5 h-5 text-emerald-500" /> Perfil
                </h3>
                <p className="text-slate-600 leading-relaxed">{cvData.summary}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                  <Briefcase className="w-5 h-5 text-emerald-500" /> Experiência
                </h3>
                <div className="space-y-6">
                  {cvData.experience.map((exp: any, idx: number) => (
                    <div key={idx} className="relative pl-4 border-l-2 border-slate-200">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-slate-900">{exp.role}</h4>
                        <span className="text-sm text-slate-500 font-medium">{exp.period}</span>
                      </div>
                      <div className="text-emerald-600 mb-2 font-medium">{exp.company}</div>
                      <p className="text-slate-700 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'internacional':
        return (
          <div className="font-sans text-slate-900 bg-white p-8">
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl font-bold mb-2 text-black">{cvData.name}</h1>
              <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-slate-800">
                {cvData.email && <span>{cvData.email}</span>}
                {cvData.email && cvData.telefone && <span>|</span>}
                {cvData.telefone && <span>{cvData.telefone}</span>}
                {(cvData.telefone || cvData.email) && (cvData.cidade || cvData.estado) && <span>|</span>}
                {(cvData.cidade || cvData.estado) && <span>{cvData.cidade}{cvData.cidade && cvData.estado ? ', ' : ''}{cvData.estado}</span>}
                {cvData.linkedin && <span>|</span>}
                {cvData.linkedin && <span>in/{cvData.linkedin}</span>}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold uppercase tracking-wider text-black border-b border-black mt-2 mb-4 pb-1">Professional Summary</h3>
              <p className="text-slate-800 leading-relaxed text-sm">{cvData.summary}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold uppercase tracking-wider text-black border-b border-black mt-2 mb-4 pb-1">Experience</h3>
              <div className="space-y-5">
                {cvData.experience.map((exp: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-black">{exp.role}</h4>
                      <span className="text-sm text-slate-600">{exp.period}</span>
                    </div>
                    <div className="text-slate-800 font-medium mb-1">{exp.company}</div>
                    <p className="text-slate-700 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-black border-b border-black mt-2 mb-4 pb-1">Skills</h3>
              <p className="text-slate-800 text-sm leading-relaxed">
                {cvData.skills.map((s: any) => s.name).join(', ')}
              </p>
            </div>
          </div>
        );
      case 'jovem':
        return (
          <div className="font-sans text-slate-900 bg-white p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-1 text-emerald-600">{cvData.name}</h1>
              <h2 className="text-xl text-slate-700 mb-4 font-medium">{cvData.targetRole}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                {cvData.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {cvData.email}</span>}
                {cvData.telefone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {cvData.telefone}</span>}
                {(cvData.cidade || cvData.estado) && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {cvData.cidade}{cvData.cidade && cvData.estado ? ', ' : ''}{cvData.estado}</span>}
                {cvData.linkedin && <span className="flex items-center gap-1.5">in/{cvData.linkedin}</span>}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-3">Sobre Mim</h3>
              <p className="text-slate-600 leading-relaxed">{cvData.summary}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Habilidades & Tecnologias</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill: any, idx: number) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Experiência</h3>
              <div className="space-y-6">
                {cvData.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="relative pl-4 border-l-2 border-emerald-200">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-800">{exp.role}</h4>
                      <span className="text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">{exp.period}</span>
                    </div>
                    <div className="text-slate-600 mb-2">{exp.company}</div>
                    <p className="text-slate-700 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'academico':
        return (
          <div className="font-sans text-slate-900 bg-white flex min-h-[297mm]">
            <div className="w-1/3 bg-slate-50 p-8 border-r border-slate-200">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-slate-800 leading-tight">{cvData.name}</h1>
                <h2 className="text-lg text-emerald-600 font-medium">{cvData.targetRole}</h2>
              </div>
              
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-200 pb-2">Contato</h3>
                <div className="space-y-3 text-sm text-slate-600">
                  {cvData.email && <div className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0" /> <span className="break-all">{cvData.email}</span></div>}
                  {cvData.telefone && <div className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0" /> <span>{cvData.telefone}</span></div>}
                  {(cvData.cidade || cvData.estado) && <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> <span>{cvData.cidade}{cvData.cidade && cvData.estado ? ', ' : ''}{cvData.estado}</span></div>}
                  {cvData.linkedin && <div className="flex items-start gap-2"><span className="font-bold shrink-0">in</span> <span className="break-all">{cvData.linkedin}</span></div>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-200 pb-2">Competências</h3>
                <div className="flex flex-col gap-2">
                  {cvData.skills.map((skill: any, idx: number) => (
                    <div key={idx} className="text-sm text-slate-700 font-medium">
                      • {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="w-2/3 p-8">
              <div className="mb-8">
                <h3 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-200 pb-2">Resumo Profissional</h3>
                <p className="text-slate-700 leading-relaxed text-sm">{cvData.summary}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-200 pb-2">Experiência</h3>
                <div className="space-y-6">
                  {cvData.experience.map((exp: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-slate-900">{exp.role}</h4>
                        <span className="text-sm text-slate-500">{exp.period}</span>
                      </div>
                      <div className="text-emerald-600 mb-2 text-sm font-medium">{exp.company}</div>
                      <p className="text-slate-700 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'portfolio':
        return (
          <div className="font-sans text-slate-900 bg-white p-8">
            <div className="flex justify-between items-start mb-8 border-b border-slate-200 pb-6">
              <div className="max-w-[60%]">
                <h1 className="text-4xl font-bold mb-2 text-slate-900">{cvData.name}</h1>
                <h2 className="text-xl text-emerald-600 font-medium">{cvData.targetRole}</h2>
              </div>
              <div className="text-right text-sm text-slate-600 space-y-1">
                {cvData.email && <div>{cvData.email}</div>}
                {cvData.telefone && <div>{cvData.telefone}</div>}
                {(cvData.cidade || cvData.estado) && <div>{cvData.cidade}{cvData.cidade && cvData.estado ? ', ' : ''}{cvData.estado}</div>}
                {cvData.portfolio && <div className="text-emerald-600 font-medium">{cvData.portfolio}</div>}
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-slate-700 leading-relaxed text-lg">{cvData.summary}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Projetos & Experiência</h3>
              <div className="space-y-4">
                {cvData.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-5 bg-slate-50/50">
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="font-bold text-lg text-slate-900">{exp.role}</h4>
                      <span className="text-sm text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">{exp.period}</span>
                    </div>
                    <div className="text-emerald-600 mb-3 font-medium">{exp.company}</div>
                    <p className="text-slate-700 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Stack de Tecnologias</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill: any, idx: number) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-sm font-medium">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      case 'clevel':
        return (
          <div className="font-sans text-slate-900 bg-white p-10">
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold mb-3 text-slate-900 tracking-tight">{cvData.name}</h1>
              <h2 className="text-xl text-slate-600 uppercase tracking-widest font-medium mb-6">{cvData.targetRole}</h2>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-medium">
                {cvData.email && <span>{cvData.email}</span>}
                {cvData.telefone && <span>{cvData.telefone}</span>}
                {(cvData.cidade || cvData.estado) && <span>{cvData.cidade}{cvData.cidade && cvData.estado ? ', ' : ''}{cvData.estado}</span>}
                {cvData.linkedin && <span>in/{cvData.linkedin}</span>}
              </div>
            </div>
            
            <div className="mb-10">
              <p className="text-lg italic text-slate-700 leading-relaxed text-center max-w-3xl mx-auto">
                &quot;{cvData.summary}&quot;
              </p>
            </div>

            <div className="mb-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-6 border-b-2 border-slate-900 pb-2">Experiência Executiva</h3>
              <div className="space-y-8">
                {cvData.experience.map((exp: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-xl font-bold text-slate-900">{exp.role}</h4>
                      <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">{exp.period}</span>
                    </div>
                    <div className="text-slate-800 mb-3 font-medium text-lg">{exp.company}</div>
                    <p className="text-slate-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-6 border-b-2 border-slate-900 pb-2">Competências Core</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                {cvData.skills.map((skill: any, idx: number) => (
                  <div key={idx} className="text-slate-700 font-medium flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'impacto':
        return (
          <div className="font-sans text-slate-900 bg-white">
            <div className="bg-emerald-600 text-white p-10">
              <h1 className="text-5xl font-bold mb-3">{cvData.name}</h1>
              <h2 className="text-2xl text-emerald-100 mb-6 font-medium">{cvData.targetRole}</h2>
              <div className="flex flex-wrap gap-6 text-sm text-emerald-50">
                {cvData.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {cvData.email}</span>}
                {cvData.telefone && <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {cvData.telefone}</span>}
                {(cvData.cidade || cvData.estado) && <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {cvData.cidade}{cvData.cidade && cvData.estado ? ', ' : ''}{cvData.estado}</span>}
                {cvData.linkedin && <span className="flex items-center gap-2">in/{cvData.linkedin}</span>}
              </div>
            </div>
            
            <div className="p-10">
              <div className="mb-10">
                <h3 className="text-xl font-bold text-emerald-600 mb-4">Resumo Profissional</h3>
                <p className="text-slate-700 leading-relaxed text-lg">{cvData.summary}</p>
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-bold text-emerald-600 mb-6">Experiência</h3>
                <div className="space-y-8">
                  {cvData.experience.map((exp: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="text-xl font-bold text-slate-900">{exp.role}</h4>
                        <span className="text-sm text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">{exp.period}</span>
                      </div>
                      <div className="text-slate-600 mb-3 font-medium text-lg">{exp.company}</div>
                      <p className="text-slate-700 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-emerald-600 mb-6">Competências</h3>
                <div className="flex flex-wrap gap-3">
                  {cvData.skills.map((skill: any, idx: number) => (
                    <span key={idx} className="px-4 py-2 border-2 border-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTemplatePreview = (id: string) => {
    switch (id) {
      case 'padrao':
        return (
          <div className={`rounded-xl overflow-hidden aspect-[1/1.414] border p-4 flex flex-col gap-3 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`w-1/2 h-4 rounded-md mb-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <div className={`w-full h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-full h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-3/4 h-1.5 rounded-full mb-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-full h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-5/6 h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          </div>
        );
      case 'tech':
        return (
          <div className={`rounded-xl overflow-hidden aspect-[1/1.414] border p-4 flex flex-col gap-3 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-full h-8 bg-emerald-500/20 rounded-md mb-2"></div>
            <div className={`w-3/4 h-2 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-1/2 h-2 rounded-full mb-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-full h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-full h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-4/5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          </div>
        );
      case 'executivo':
        return (
          <div className={`rounded-xl overflow-hidden aspect-[1/1.414] border p-4 flex flex-col gap-3 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-1/2 h-6 bg-blue-500/20 rounded-md mb-1 mx-auto"></div>
            <div className={`w-1/3 h-1.5 rounded-full mx-auto mb-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-full h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-full h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-full h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          </div>
        );
      case 'minimalista':
        return (
          <div className={`rounded-xl overflow-hidden aspect-[1/1.414] border p-4 flex flex-col gap-3 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`w-1/3 h-4 rounded-md mb-4 ${theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300/50'}`}></div>
            <div className={`w-full h-1 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-full h-1 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-5/6 h-1 rounded-full mb-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-full h-1 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-4/5 h-1 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          </div>
        );
      case 'criativo':
        return (
          <div className={`rounded-xl overflow-hidden aspect-[1/1.414] border p-4 flex flex-col gap-3 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex gap-2 mb-2">
              <div className="w-1/3 h-12 bg-purple-500/20 rounded-md"></div>
              <div className="flex-1 flex flex-col gap-2">
                <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                <div className={`w-3/4 h-2 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
              </div>
            </div>
            <div className={`w-full h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-full h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className={`w-5/6 h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          </div>
        );
      case 'estrategico':
        return (
          <div className={`rounded-xl overflow-hidden aspect-[1/1.414] border p-4 flex flex-col gap-3 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-full h-4 bg-slate-800/20 rounded-md mb-2"></div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className={`col-span-1 h-16 rounded-md ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
              <div className="col-span-2 flex flex-col gap-2">
                <div className={`w-full h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                <div className={`w-full h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                <div className={`w-3/4 h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
              </div>
            </div>
            <div className={`w-full h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          </div>
        );
      case 'internacional':
      case 'jovem':
      case 'academico':
      case 'portfolio':
      case 'clevel':
      case 'impacto':
        return (
          <div className={`rounded-xl overflow-hidden aspect-[1/1.414] border p-4 flex flex-col gap-3 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`w-1/2 h-3 rounded-md mb-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <div className={`w-full h-1 rounded-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
            <div className={`w-3/4 h-1 rounded-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
            <div className={`w-full h-1 rounded-full mt-2 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
            <div className={`w-5/6 h-1 rounded-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={`text-2xl md:text-3xl font-display font-bold mb-8 text-center ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
          {t.step2Title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {templatesList.map((template) => {
            const isLocked = template.isPro && !isPro;
            const isSelected = selectedTemplate === template.id;

            return (
              <div 
                key={template.id}
                onClick={() => {
                  if (isLocked) {
                    setShowPlanModal(true);
                  } else {
                    setSelectedTemplate(template.id);
                  }
                }}
                className={`cursor-pointer group relative rounded-2xl p-4 transition-all border-2 
                  ${isSelected 
                    ? 'border-emerald-500 bg-emerald-50/30 shadow-md' 
                    : theme === 'dark' 
                      ? 'border-slate-700 hover:border-emerald-500/50 bg-slate-800' 
                      : 'border-slate-200 hover:border-emerald-300 bg-white'
                  } 
                  ${isLocked ? 'opacity-60' : ''}
                `}
              >
                {isLocked && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="bg-slate-900/80 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                      <Lock className="w-3 h-3" /> Pro
                    </div>
                  </div>
                )}
                
                {renderTemplatePreview(template.id)}
                
                <div className="text-center mt-4">
                  <span className={`font-bold ${isSelected ? 'text-emerald-500' : theme === 'dark' ? 'text-slate-300 group-hover:text-emerald-400' : 'text-slate-700 group-hover:text-emerald-600'}`}>
                    {template.name}
                  </span>
                </div>
                
                {isSelected && (
                  <div className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-1 shadow-md">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          <button 
            onClick={() => setActiveView('analises')}
            className={`w-full sm:w-auto py-4 px-8 border font-bold text-lg rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            {t.backToAnalysis}
          </button>
          <button 
            onClick={() => setShowPreviewModal(true)}
            className="w-full sm:w-auto py-4 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg rounded-2xl transition-all shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Baixar PDF – Template Básico
          </button>
          <button
            onClick={() => isPro ? setShowPreviewModal(true) : setShowPlanModal(true)}
            className={`w-full sm:w-auto py-4 px-8 font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-2 ${
              isPro
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-[0_4px_14px_rgba(245,158,11,0.2)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.3)]'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600'
            }`}
          >
            <Star className={`w-5 h-5 ${isPro ? 'text-slate-900' : 'text-amber-400'}`} />
            Baixar PDF – Templates Premium
            {!isPro && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 ml-1">
                PRO
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <>
          {/* Dark overlay — hidden when printing so it never bleeds into the PDF */}
          <div className="fixed inset-0 z-50 bg-black/80 print:hidden" />

          {/* Modal shell — becomes a normal block container on print */}
          <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto print:static print:overflow-visible print:z-auto print:block">
            {/* Header bar — hidden on print */}
            <div className="print:hidden sticky top-0 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 p-4 flex justify-between items-center z-10">
              <h3 className="text-white font-bold text-lg">Preview</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t.downloadPdf}
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  {t.close}
                </button>
              </div>
            </div>

            {/* A4 Paper Container */}
            <div className="p-8 flex-1 flex justify-center print:p-0 print:block print:flex-none">
              <div
                ref={cvRef}
                className="w-full max-w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-2xl print:w-[210mm] print:min-h-[297mm] print:m-0 print:p-8 print:shadow-none print:border-none print:absolute print:top-0 print:left-0"
                style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
              >
                {renderTemplate()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface SupabaseAnalysis {
  id: string;
  company_name: string;
  job_title: string;
  match_score: number;
  analysis_data: IAAnalysisData;
  created_at: string;
}

function ScoreCircle({ score, theme }: { score: number; theme: string }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <svg width="64" height="64" className="-rotate-90">
        <circle
          cx="32" cy="32" r={radius}
          fill="none"
          strokeWidth="5"
          className={theme === 'dark' ? 'stroke-slate-700' : 'stroke-slate-200'}
        />
        <circle
          cx="32" cy="32" r={radius}
          fill="none"
          strokeWidth="5"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>{score}%</span>
    </div>
  );
}

function OptimizedResumesHistoryView({ theme, setActiveView, language }: { theme: string, setActiveView: (v: string) => void, language: 'pt' | 'en' }) {
  const t = translations[language];
  const { setSelectedAnalysis } = useUser();
  const [analyses, setAnalyses] = useState<SupabaseAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState<SupabaseAnalysis | null>(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data: { user: sbUser } } = await supabase.auth.getUser();
        if (!sbUser) { setIsLoading(false); return; }

        const { data, error } = await supabase
          .from('analyses')
          .select('id, company_name, job_title, match_score, analysis_data, created_at')
          .eq('user_id', sbUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAnalyses(data ?? []);
      } catch (err) {
        console.error('[HistoryView] Erro ao buscar análises:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <h2 className={`text-2xl md:text-3xl font-display font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
          {t.myOptimizedResumes}
        </h2>
        <button
          onClick={() => setActiveView('nova-otimizacao')}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] flex items-center gap-2 text-sm"
        >
          {t.newOptimizationBtn}
        </button>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : analyses.length === 0 ? (
        <div className={`p-8 text-center rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <History className="w-12 h-12 mx-auto mb-4 text-emerald-500 opacity-50" />
          <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Você ainda não realizou nenhuma análise.</h3>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Otimize seu primeiro currículo para começar!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {analyses.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className={`rounded-2xl border p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className={`text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    {formatDate(item.created_at)}
                  </span>
                  <h3 className={`text-base font-bold leading-tight truncate ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                    {item.job_title || 'Cargo não informado'}
                  </h3>
                  <div className={`flex items-center gap-1.5 text-sm mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.company_name || 'Empresa Confidencial'}</span>
                  </div>
                </div>
                <ScoreCircle score={item.match_score} theme={theme} />
              </div>

              {/* Footer */}
              <button
                onClick={() => {
                  setSelectedDetail(item);
                  setSelectedAnalysis({
                    id: item.id,
                    date: formatDate(item.created_at),
                    jobTitle: item.job_title,
                    companyName: item.company_name,
                    status: 'statusAnalyzed',
                    analysisData: item.analysis_data,
                  });
                  setActiveView('analises');
                }}
                className={`mt-auto w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Ver Detalhes
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active = false, badge, onClick }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`shrink-0 flex items-center justify-center ${active ? 'text-emerald-400' : 'text-slate-400'}`}>
          {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
        </div>
        <span className="text-left whitespace-nowrap truncate">{label}</span>
      </div>
      {badge && (
        <span className={`shrink-0 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
          badge === 'PRO' 
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
            : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function Sidebar({ activeView, setActiveView, language }: { activeView: string, setActiveView: (v: string) => void, language: 'pt' | 'en' }) {
  const t = translations[language];
  const { user, updateUser, isLoaded, isLoadingProfile, logout, cancelSubscription, isPro } = useUser();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'plans' | 'payment' | 'success'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<'mensal' | 'anual'>('mensal');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempTelefone, setTempTelefone] = useState('');
  const [tempCidadeEstado, setTempCidadeEstado] = useState('');
  const [tempLinkedin, setTempLinkedin] = useState('');
  const [tempPortfolio, setTempPortfolio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync form fields as soon as user profile data arrives from context (after login/signup).
  // Runs independently of showProfileSettings so the fields are ready the moment the modal opens.
  useEffect(() => {
    if (!isLoadingProfile && user) {
      setTempName(user.nome || '');
      setTempEmail(user.email || '');
      setTempTelefone(user.telefone || '');
      setTempCidadeEstado(user.cidadeEstado || '');
      setTempLinkedin(user.linkedin || '');
      setTempPortfolio(user.portfolio || '');
    }
  }, [isLoadingProfile, user]);

  // Credit Card Form States
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Formatting Functions
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '').substring(0, 11);
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
  };

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

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setShowSuccess(false);
    try {
      const supabase = createClient();
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (!sbUser) throw new Error('Usuário não autenticado');

      const { error } = await supabase.from('profiles').upsert({
        id: sbUser.id,
        full_name: tempName,
        phone: tempTelefone,
        location: tempCidadeEstado,
        linkedin_url: tempLinkedin,
        portfolio_url: tempPortfolio,
      });

      if (error) throw error;

      updateUser({
        nome: tempName,
        email: tempEmail,
        telefone: tempTelefone,
        cidadeEstado: tempCidadeEstado,
        linkedin: tempLinkedin,
        portfolio: tempPortfolio,
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowProfileSettings(false);
      }, 2000);
    } catch (err) {
      console.error('[Sidebar] Erro ao salvar perfil:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const progressPercent = user ? Math.min(100, (user.creditosUsados / user.creditosTotais) * 100) : 0;

  return (
    <aside className="w-full md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 print:hidden relative z-50">
      <div className="p-6 flex items-center gap-3">
        <LogoCVMatch className="w-10 h-10 text-emerald-500" />
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">CV Match</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem 
          icon={<LayoutDashboard />} 
          label={t.navDashboard} 
          active={activeView === 'dashboard'} 
          onClick={() => setActiveView('dashboard')} 
        />
        <NavItem 
          icon={<Briefcase />} 
          label={t.navOpenJobs} 
          active={activeView === 'vagas'} 
          badge="BETA"
          onClick={() => setActiveView('vagas')} 
        />
        <NavItem 
          icon={<History />} 
          label={t.navTalentPool} 
          active={activeView === 'banco'} 
          onClick={() => setActiveView('banco')} 
        />
        <NavItem 
          icon={<TrendingUp />} 
          label={t.navAiAnalyses} 
          active={activeView === 'analises'} 
          badge="PRO"
          onClick={() => isPro ? setActiveView('analises') : setShowPlanModal(true)} 
        />
        <NavItem 
          icon={<Settings />} 
          label={t.navSettings} 
          active={activeView === 'configuracoes'} 
          onClick={() => setActiveView('configuracoes')} 
        />
      </nav>
      
      <div className="p-4 border-t border-slate-800 relative">
        {showUserMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden py-1 z-50">
            <button 
              onClick={() => { 
                setTempName(user?.nome || '');
                setTempEmail(user?.email || '');
                setTempTelefone(user?.telefone || '');
                setTempCidadeEstado(user?.cidadeEstado || '');
                setTempLinkedin(user?.linkedin || '');
                setTempPortfolio(user?.portfolio || '');
                setShowProfileSettings(true); 
                setShowUserMenu(false); 
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left"
            >
              <User className="w-4 h-4" /> Meu Perfil
            </button>
            <button 
              onClick={() => { setShowPlanModal(true); setShowUserMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left"
            >
              <Star className="w-4 h-4" /> Meu Plano
            </button>
            <button 
              onClick={() => { setActiveView('suporte'); setShowUserMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left"
            >
              <HelpCircle className="w-4 h-4" /> Suporte
            </button>
            <div className="h-px bg-slate-700 my-1"></div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-slate-700 transition-colors text-left font-medium"
            >
              <LogOut className="w-4 h-4" /> Sair da conta
            </button>
          </div>
        )}

        <div 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 text-white text-sm font-bold select-none">
            {(user?.nome || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {isLoadingProfile ? (
              <div className="h-4 w-24 bg-slate-700 animate-pulse rounded" />
            ) : (
              <p className="text-sm font-medium text-white truncate">
                {user?.nome || user?.email || 'Usuário'}
              </p>
            )}
            <p className={`text-xs font-medium truncate inline-block px-1.5 py-0.5 rounded mt-0.5 ${isPro ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-slate-800'}`}>
              {isLoaded ? (isPro ? 'Plano Pro' : 'Plano Grátis') : '...'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-bold text-white">Configurações da Conta</h2>
              <button 
                onClick={() => setShowProfileSettings(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {isLoadingProfile ? (
              /* Skeleton shown while profile is being fetched from Supabase */
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
                  <div className="h-11 bg-slate-700 rounded-xl animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-slate-700 rounded animate-pulse" />
                  <div className="h-11 bg-slate-700 rounded-xl animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-slate-700 rounded animate-pulse" />
                    <div className="h-11 bg-slate-700 rounded-xl animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
                    <div className="h-11 bg-slate-700 rounded-xl animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
                  <div className="h-11 bg-slate-700 rounded-xl animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
                  <div className="h-11 bg-slate-700 rounded-xl animate-pulse" />
                </div>
                <p className="text-center text-xs text-slate-500 pt-1">Carregando dados do perfil...</p>
              </div>
            ) : (
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 block">Nome de Exibição</label>
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 block">E-mail de Cadastro</label>
                  <input 
                    type="email" 
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Telefone / WhatsApp
                    </label>
                    <input 
                      type="text" 
                      placeholder="(11) 99999-9999"
                      value={tempTelefone}
                      onChange={(e) => setTempTelefone(formatPhone(e.target.value))}
                      maxLength={15}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Localização
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ex: São Paulo, SP"
                      value={tempCidadeEstado}
                      onChange={(e) => setTempCidadeEstado(e.target.value)}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> LinkedIn URL
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://linkedin.com/in/seu-perfil"
                    value={tempLinkedin}
                    onChange={(e) => setTempLinkedin(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Portfólio / GitHub
                  </label>
                  <input 
                    type="url" 
                    placeholder="Link para seu portfólio"
                    value={tempPortfolio}
                    onChange={(e) => setTempPortfolio(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                  />
                </div>
              </div>
            )}
            <div className="p-4 border-t border-slate-700 flex flex-col gap-3">
              {showSuccess && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2">
                  ✅ Perfil atualizado com sucesso!
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowProfileSettings(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving || showSuccess || isLoadingProfile}
                  className="px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 rounded-xl transition-colors"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Plan Details Modal */}
      <SubscriptionModal 
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onCancelRequest={() => {
          setShowPlanModal(false);
          setIsCancelModalOpen(true);
        }}
      />
      <CancelSubscriptionModal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        onConfirm={async () => {
          await cancelSubscription();
          setIsCancelModalOpen(false);
        }} 
      />
    </aside>
  );
}

function Header({ activeView, theme, language }: { activeView: string, theme: string, language: 'pt' | 'en' }) {
  const t = translations[language];
  const getHeaderTitle = () => {
    switch (activeView) {
      case 'dashboard': return t.titleHome;
      case 'nova-otimizacao': return t.titleNewOptimization;
      case 'templates': return t.titleTemplates;
      case 'vagas': return t.titleOpenJobs;
      case 'banco': return t.titleTalentPool;
      case 'analises': return t.titleAiAnalyses;
      case 'configuracoes': return t.titleSettings;
      default: return t.titleHome;
    }
  };

  return (
    <header className={`h-20 border-b flex items-center justify-between px-8 shrink-0 print:hidden ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
        <span>{getHeaderTitle()}</span>
        {activeView === 'analises' && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className={`font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>Desenvolvedor Front-end Sênior</span>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Espaço reservado para futuro Avatar ou Theme Toggle */}
      </div>
    </header>
  );
}

function SettingsView({ theme, setTheme, language, setLanguage, setShowPlanModal }: { theme: string, setTheme: (v: string) => void, language: 'pt' | 'en', setLanguage: (v: 'pt' | 'en') => void, setShowPlanModal: (v: boolean) => void }) {
  const t = translations[language];
  const { user, isPro, cancelSubscription } = useUser();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeModalStep, setUpgradeModalStep] = useState<'plans' | 'payment'>('plans');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidadeEstado, setCidadeEstado] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Password change modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordChange = async () => {
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess(true);
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordSuccess(false);
        }, 1800);
      }
    } catch (err) {
      console.error('Erro ao atualizar senha:', err);
      setPasswordError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user: sbUser } } = await supabase.auth.getUser();

        if (sbUser) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sbUser.id)
            .single();

          if (profile) {
            setNome(profile.full_name || sbUser.user_metadata?.full_name || sbUser.email || '');
            setTelefone(profile.phone || '');
            setCidadeEstado(profile.location || '');
            setLinkedin(profile.linkedin_url || '');
            setPortfolio(profile.portfolio_url || '');
          } else {
            // Fallback se o usuário acabou de criar a conta e o perfil ainda não existe
            setNome(sbUser.user_metadata?.full_name || sbUser.email || '');
          }

          if (error && error.code !== 'PGRST116') {
            console.error('[SettingsView] Erro ao carregar perfil:', error);
          }
        }
      } catch (err) {
        console.error('[SettingsView] Erro ao carregar perfil:', err);
      }
    };

    loadUserProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveProfile = async () => {
    console.log("CLIQUEI NO BOTAO AGORA");
    setIsSaving(true);
    setShowSuccess(false);
    try {
      const supabase = createClient();
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (!sbUser) throw new Error('Usuário não autenticado');

      const { error } = await supabase.from('profiles').upsert({
        id: sbUser.id,
        full_name: nome,
        phone: telefone,
        location: cidadeEstado,
        linkedin_url: linkedin,
        portfolio_url: portfolio,
      });

      if (error) {
        console.error('Erro ao salvar perfil:', error);
        throw error;
      }
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('[SettingsView] Erro ao salvar perfil:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const inputBase = `w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={`text-2xl md:text-3xl font-display font-bold mb-8 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
          {t.settingsTitle}
        </h2>

        <div className="space-y-6">
          {/* Minha Conta */}
          <div className={`rounded-2xl p-6 md:p-8 shadow-sm border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-emerald-500" />
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{t.myAccount}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{t.fullName}</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  className={inputBase}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t.email}
                  <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{t.notEditable}</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  disabled
                  className={`${inputBase} opacity-50 cursor-not-allowed`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  <Phone className="w-3.5 h-3.5 inline mr-1.5" />
                  {t.phone}
                </label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={inputBase}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  <MapPin className="w-3.5 h-3.5 inline mr-1.5" />
                  {t.cityState}
                </label>
                <input
                  type="text"
                  value={cidadeEstado}
                  onChange={(e) => setCidadeEstado(e.target.value)}
                  placeholder="São Paulo, SP"
                  className={inputBase}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  <LinkIcon className="w-3.5 h-3.5 inline mr-1.5" />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/seu-perfil"
                  className={inputBase}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  <Globe className="w-3.5 h-3.5 inline mr-1.5" />
                  {t.portfolioSite}
                </label>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://meusite.com"
                  className={inputBase}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="button"
                disabled={isSaving || showSuccess}
                onClick={(e) => { e.preventDefault(); handleSaveProfile(); }}
                className={`font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg ${
                  showSuccess
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'
                }`}
              >
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t.saving}</>
                ) : showSuccess ? (
                  <>✅ {t.saved}</>
                ) : (
                  <><Check className="w-4 h-4" /> {t.saveChanges}</>
                )}
              </button>

              <button
                onClick={() => { setIsPasswordModalOpen(true); setPasswordError(null); setPasswordSuccess(false); }}
                className={`ml-auto px-6 py-2.5 border-2 rounded-xl transition-colors flex items-center gap-2 font-bold ${theme === 'dark' ? 'border-slate-600 hover:border-slate-500 text-slate-300' : 'border-slate-200 hover:border-slate-300 text-slate-700'}`}
              >
                <Lock className="w-4 h-4" />
                {t.changePassword}
              </button>
            </div>
          </div>

          {/* Preferências do Sistema */}
          <div className={`rounded-2xl p-6 md:p-8 shadow-sm border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-emerald-500" />
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{t.systemPreferences}</h3>
            </div>
            <div className="space-y-6">
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{t.interfaceTheme}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.themeDesc}</p>
                </div>
                <div className={`flex items-center p-1 rounded-xl ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Sun className="w-4 h-4" /> {t.light}
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'dark' ? 'bg-slate-700 text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Moon className="w-4 h-4" /> {t.dark}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{t.language}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.languageDesc}</p>
                </div>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'pt' | 'en')}
                    className={`appearance-none w-full sm:w-56 pl-10 pr-10 py-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  >
                    <option value="pt">Português (Brasil)</option>
                    <option value="en">English</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Assinatura */}
          <div className={`rounded-2xl p-6 md:p-8 shadow-sm border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{t.subscription}</h3>
              </div>
              {showCancelSuccess && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full animate-pulse">
                  ✅ {t.subscriptionUpdated}
                </span>
              )}
            </div>
            
            {!isPro ? (
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                <div>
                  <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.currentPlan}</p>
                  <p className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{t.basicFree}</p>
                </div>
                <button 
                  onClick={() => { setUpgradeModalStep('plans'); setIsUpgradeModalOpen(true); }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {t.upgradePro}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <div>
                    <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.currentPlan}</p>
                    <p className={`text-base font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Pro ({user?.cicloFaturamento || 'Mensal'})</p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.value}</p>
                    <p className={`text-base font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{user?.valorPlano || 'R$ 19,99'}{t.perMonth}</p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.nextRenewal}</p>
                    <p className={`text-base font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{user?.dataRenovacao || 'N/A'}</p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.paymentMethod}</p>
                    <div className="flex items-center gap-2">
                      {user?.metodoPagamento === 'Pix' ? <QrCode className="w-4 h-4 text-emerald-500" /> : <CreditCard className="w-4 h-4 text-emerald-500" />}
                      <p className={`text-base font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{user?.metodoPagamento || 'Cartão'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={() => { setUpgradeModalStep('payment'); setIsUpgradeModalOpen(true); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                  >
                    <CreditCard className="w-4 h-4" />
                    {t.changePaymentMethod}
                  </button>
                  <button 
                    onClick={() => setIsCancelModalOpen(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}
                  >
                    {t.cancelSubscription}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Excluir Conta */}
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setIsDeleteAccountModalOpen(true)}
              className={`flex items-center gap-2 text-red-500 hover:text-red-600 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${theme === 'dark' ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}
            >
              <Trash2 className="w-4 h-4" />
              {t.deleteAccount}
            </button>
          </div>

        </div>
      </motion.div>

      <SubscriptionModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => { setIsUpgradeModalOpen(false); setUpgradeModalStep('plans'); }}
        initialStep={upgradeModalStep}
        onCancelRequest={() => {
          setIsUpgradeModalOpen(false);
          setIsCancelModalOpen(true);
        }}
      />
      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={async () => {
          await cancelSubscription();
          setIsCancelModalOpen(false);
          setShowCancelSuccess(true);
          setTimeout(() => setShowCancelSuccess(false), 4000);
        }}
      />
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
      />

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">Alterar Senha</h2>
              <button
                onClick={() => { setIsPasswordModalOpen(false); setNewPassword(''); setConfirmPassword(''); setPasswordError(null); setPasswordSuccess(false); }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordSuccess ? (
              <div className="flex flex-col items-center py-6 gap-3">
                <CheckCircle className="w-14 h-14 text-emerald-500" />
                <p className="text-white font-semibold text-lg">✅ Senha atualizada com sucesso!</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Nova Senha</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  {passwordError && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {passwordError}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setIsPasswordModalOpen(false); setNewPassword(''); setConfirmPassword(''); setPasswordError(null); }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    disabled={isUpdatingPassword}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    {isUpdatingPassword ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
                    ) : (
                      'Salvar Nova Senha'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SupportView({ theme, language }: { theme: string, language: 'pt' | 'en' }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { supabaseUserId } = useUser();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let attachmentUrl: string | null = null;

      if (file) {
        const filePath = `${supabaseUserId}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('support_attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('support_attachments')
          .getPublicUrl(filePath);

        attachmentUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('support_tickets')
        .insert({
          user_id: supabaseUserId,
          subject,
          message,
          attachment_url: attachmentUrl,
        });

      if (insertError) throw insertError;

      setSubject('');
      setMessage('');
      setFile(null);
      setShowSuccessModal(true);
    } catch (err: unknown) {
      console.error('Erro ao enviar ticket de suporte:', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert('Não foi possível enviar sua mensagem. Tente novamente em instantes.\n\nDetalhe: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  const faqs = [
    {
      q: "Como cancelar minha assinatura?",
      a: "Você pode cancelar a qualquer momento acessando a aba Configurações > Assinatura. Seu plano Pro continuará ativo até o fim do ciclo."
    },
    {
      q: "Quais as formas de pagamento?",
      a: "Aceitamos Cartão de Crédito e Pix."
    },
    {
      q: "Como funciona o upgrade de plano?",
      a: "A mudança é imediata e o valor é cobrado proporcionalmente."
    },
    {
      q: "Onde vejo minhas faturas?",
      a: "Todas as notas fiscais são enviadas para o seu e-mail cadastrado logo após a aprovação do pagamento."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className={`text-2xl md:text-3xl font-display font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
          Suporte e Atendimento
        </h2>
        <p className={`mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          Encontre respostas rápidas para dúvidas de assinaturas ou envie uma mensagem direta para nossa equipe.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Coluna Esquerda - FAQ */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <h3 className={`text-xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
            <HelpCircle className="w-5 h-5 text-emerald-500" />
            Dúvidas Frequentes sobre Planos
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className={`w-full flex items-center justify-between p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500`}
                  aria-expanded={openFaq === idx}
                >
                  <span className={`font-medium pr-4 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-emerald-500' : (theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}`} />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className={`p-4 pt-0 text-sm leading-relaxed border-t ${theme === 'dark' ? 'text-slate-400 border-slate-700/50' : 'text-slate-600 border-slate-200/50'}`}>
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Coluna Direita - Formulário */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full">
          <div className={`p-6 md:p-8 rounded-2xl border shadow-sm h-full ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-5 h-5 text-emerald-500" />
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                Envie uma Mensagem
              </h3>
            </div>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              
              <div className="space-y-2">
                <label htmlFor="subject" className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Assunto da Mensagem <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    id="subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`w-full appearance-none p-3 pr-10 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  >
                    <option value="" disabled>Selecione um assunto...</option>
                    <option value="cobranca">Dúvida sobre Cobrança</option>
                    <option value="bug">Problema Técnico / Bug</option>
                    <option value="sugestao">Sugestão de Melhoria</option>
                    <option value="outros">Outros</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                    <ChevronDown className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Sua Mensagem <span className="text-red-500">*</span>
                </label>
                <textarea 
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descreva detalhadamente como podemos te ajudar..."
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Anexo <span className="font-normal opacity-70">(Opcional)</span>
                </label>
                <div className={`border-2 border-dashed rounded-xl p-4 transition-colors flex items-center justify-center cursor-pointer ${file ? (theme === 'dark' ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-emerald-400 bg-emerald-50') : (theme === 'dark' ? 'border-slate-700 hover:border-emerald-500/50 bg-slate-900/50' : 'border-slate-300 hover:border-emerald-400 bg-slate-50')}`}>
                  <label htmlFor="attachment" className="w-full h-full flex flex-col justify-center items-center gap-2 cursor-pointer">
                    <UploadCloud className={`w-6 h-6 ${file ? 'text-emerald-500' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-400')}`} />
                    {file ? (
                      <span className={`text-sm font-medium text-center break-all ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {file.name}
                      </span>
                    ) : (
                      <>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          Clique para fazer upload
                        </span>
                        <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                          PNG, JPG ou PDF (Max. 5MB)
                        </span>
                      </>
                    )}
                    <input
                      id="attachment"
                      type="file"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] mt-2 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Mensagem'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Mensagem Enviada!</h2>
            <p className="text-slate-300 mb-6">
              Nossa equipe retornará o contato por e-mail em até 6 horas.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

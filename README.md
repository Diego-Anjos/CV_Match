<div align="center">

# CV Match

**Plataforma Inteligente de Análise e Otimização de Currículos**

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

[![Expo Tech 2026](https://img.shields.io/badge/Expo_Tech_2026-UniFECAF-orange?style=for-the-badge)](https://www.unifecaf.com.br/)
[![Curso GTI](https://img.shields.io/badge/GTI-5%C2%BA_Semestre-blue?style=for-the-badge)]()
[![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?style=for-the-badge)]()

</div>

---

## Visão Geral

O **CV Match** é uma plataforma web inteligente voltada para a **transformação digital do setor de Recursos Humanos**. O sistema utiliza **Inteligência Artificial** (Google Gemini 2.5 Flash) para analisar, pontuar e otimizar currículos de candidatos com base no contexto específico de uma vaga de emprego.

Por meio de uma interface moderna e intuitiva, o CV Match atua como um headhunter digital: recebe o currículo do candidato e a descrição da vaga, e retorna uma análise estruturada contendo:

- **Score de compatibilidade** (0–100) entre o candidato e a vaga
- **Feedback geral** detalhado sobre pontos fortes e lacunas do perfil
- **Habilidades aderentes** identificadas automaticamente pela IA
- **Trilha de estudos personalizada** com sugestões de desenvolvimento para aumentar a empregabilidade

O sistema também oferece **templates de currículo profissionais** para impressão em PDF, histórico de análises, modelo freemium com créditos gratuitos e plano Pro, além de suporte via tickets integrado ao banco de dados.

---

## Alinhamento Estratégico — Expo Tech 2026

> **Trilha: BI e Transformação Digital**
> Curso de Gestão da Tecnologia da Informação — 5º Semestre · UniFECAF

O CV Match se posiciona diretamente na trilha de **BI e Transformação Digital** por entregar valor concreto à tomada de decisão baseada em dados no contexto do RH. Em vez de depender de triagens manuais e subjetivas, a plataforma fornece aos **gestores de RH e à liderança executiva** métricas objetivas e acionáveis sobre cada candidato — reduzindo o tempo de triagem, padronizando critérios de avaliação e democratizando o acesso a análises de nível profissional.

A solução demonstra como tecnologias emergentes (IA Generativa, Cloud Backend, SaaS freemium) podem ser combinadas para digitalizar e otimizar processos críticos de negócio, alinhando-se aos objetivos da disciplina de transformação organizacional via tecnologia.

---

## Arquitetura e Tecnologias

### Stack Principal

| Camada | Tecnologia |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) |
| **Linguagem** | [TypeScript 5.9](https://www.typescriptlang.org/) |
| **Estilização** | [Tailwind CSS v4](https://tailwindcss.com/) + `tw-animate-css` + `motion` |
| **Autenticação** | [Supabase Auth](https://supabase.com/docs/guides/auth) (`@supabase/ssr`) |
| **Banco de Dados** | [Supabase Postgres](https://supabase.com/docs/guides/database) (tabelas: `profiles`, `analyses`, `subscriptions`, `support_tickets`) |
| **Armazenamento** | [Supabase Storage](https://supabase.com/docs/guides/storage) (anexos de suporte) |
| **Inteligência Artificial** | [Google Gemini 2.5 Flash](https://ai.google.dev/) via `@google/generative-ai` |
| **Ícones** | [Lucide React](https://lucide.dev/) |
| **Notificações** | [Sonner](https://sonner.emilkowal.ski/) (toasts) |
| **PDF / Impressão** | [react-to-print](https://github.com/MatthewHerbst/react-to-print) |

### Diagrama de Arquitetura

```
┌──────────────────────────────────────────────────────────┐
│                    Usuário (Browser)                     │
└────────────────────┬─────────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼─────────────────────────────────────┐
│                  Next.js (App Router)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐ │
│  │   Pages /   │  │  Middleware │  │  Server Actions  │ │
│  │  Dashboard  │  │  (Auth Guard│  │  (auth.ts)       │ │
│  └─────────────┘  └─────────────┘  └──────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              API Route: /api/analyze                 │ │
│  └────────────────────────┬─────────────────────────────┘ │
└───────────────────────────┼──────────────────────────────┘
              ┌─────────────┘
   ┌──────────▼──────────┐        ┌────────────────────┐
   │   Google Gemini AI  │        │     Supabase       │
   │  (gemini-2.5-flash) │        │  Auth + Postgres   │
   │  Análise de CV/Vaga │        │  Storage + RPC     │
   └─────────────────────┘        └────────────────────┘
```

---

## Como Executar o Projeto Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/) v9 ou superior
- Uma conta no [Supabase](https://supabase.com/) (gratuita)
- Uma chave de API do [Google AI Studio](https://aistudio.google.com/) (gratuita)

---

### Passo a Passo

**1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/cv-match.git
cd cv-match
```

**2. Instale as dependências**

```bash
npm install
```

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto copiando o arquivo de exemplo:

```bash
cp .env.example .env.local
```

Abra o `.env.local` e preencha com suas credenciais:

```env
# URL pública da sua aplicação (em desenvolvimento, use http://localhost:3000)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Credenciais do Supabase (encontradas em: Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui

# Chave da API do Google Gemini (gerada em: https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=sua_gemini_api_key_aqui
```

> **Onde obter as credenciais do Supabase:**
> Acesse o [Dashboard do Supabase](https://app.supabase.com/) → selecione seu projeto → **Project Settings** → **API**.

**4. Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

**5. Acesse a aplicação**

Abra [http://localhost:3000](http://localhost:3000) no seu navegador. Crie uma conta e comece a usar!

---

## Funcionalidades Principais

| Funcionalidade | Descrição |
|---|---|
| **Análise de CV com IA** | Score de compatibilidade + feedback detalhado gerado pelo Gemini |
| **Trilha de Estudos** | Recomendações personalizadas de desenvolvimento para a vaga |
| **Histórico de Análises** | Todas as análises salvas no banco de dados (Supabase) |
| **Templates de Currículo** | Templates profissionais com exportação para PDF |
| **Modelo Freemium** | 3 créditos gratuitos; plano Pro com créditos ilimitados |
| **Tickets de Suporte** | Sistema de chamados com upload de arquivos |
| **Modo Claro / Escuro** | Tema configurável por preferência do usuário |
| **Interface Bilíngue** | Suporte a Português e Inglês (`LanguageContext`) |

---

## Estrutura do Projeto

```
cv-match/
├── app/
│   ├── api/
│   │   └── analyze/          # Rota da API de IA (Gemini)
│   ├── auth/
│   │   └── callback/         # Callback OAuth e recuperação de senha
│   ├── actions/
│   │   └── auth.ts           # Server Actions de autenticação
│   ├── components/           # Componentes reutilizáveis (modais, logo)
│   ├── contexts/             # UserContext, LanguageContext
│   ├── hooks/                # useSubscription
│   ├── dashboard/            # Painel principal da aplicação (~3.7k linhas)
│   ├── cadastro/             # Página de registro
│   ├── recuperar-senha/      # Recuperação de senha
│   ├── termos/               # Termos de uso
│   └── privacidade/          # Política de privacidade
├── utils/
│   └── supabase/             # Clientes Supabase (browser, server, middleware)
├── lib/
│   └── utils.ts              # Utilitário cn() (clsx + tailwind-merge)
├── hooks/
│   └── use-mobile.ts         # Hook de breakpoint mobile
├── middleware.ts             # Proteção de rotas autenticadas
├── next.config.ts
├── .env.example
└── README.md
```

---

## Equipe de Desenvolvimento

<div align="center">

**Desenvolvido com dedicação para a Expo Tech 2026**

| Desenvolvedor | RA |
|:---:|:---:|
| Diego dos Anjos | 7961 |
| Gustavo Ribeiro | 90044 |
| Ian Meirelles | 94838 |

**Turma:** GTI.5NA — Gestão da Tecnologia da Informação, 5º Semestre

**Instituição:** Centro Universitário UniFECAF

</div>

---

<div align="center">

Feito com tecnologia e propósito · Expo Tech 2026 · UniFECAF

</div>

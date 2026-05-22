<div align="center">

# CV Match

**Plataforma Inteligente de Análise e Otimização de Currículos**

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

[![Expo Tech 2026](https://img.shields.io/badge/Expo_Tech_2026-UniFECAF-orange?style=for-the-badge)](https://www.unifecaf.com.br/)
[![Trilha](https://img.shields.io/badge/Trilha-BI_%26_Transformação_Digital-purple?style=for-the-badge)]()
[![GTI 5º Semestre](https://img.shields.io/badge/GTI-5%C2%BA_Semestre-blue?style=for-the-badge)]()

</div>

---

## 📋 Visão Geral

O **CV Match** é uma plataforma web inteligente voltada para a **transformação digital da jornada de empregabilidade e gestão de carreira**. O sistema utiliza **Inteligência Artificial** (Google Gemini 2.5 Flash) para empoderar profissionais, permitindo que eles analisem, pontuem e otimizem seus próprios currículos com base no contexto específico da vaga que almejam.

Por meio de uma interface moderna e intuitiva, o CV Match atua como um **mentor de carreira digital**: recebe o currículo do candidato e a descrição da vaga desejada, e retorna uma análise estruturada contendo:

- 🎯 **Score de compatibilidade** (0–100) entre o candidato e a vaga
- 📝 **Feedback geral** detalhado sobre pontos fortes e lacunas do perfil
- ✅ **Habilidades aderentes** identificadas automaticamente pela IA
- 📚 **Trilha de estudos personalizada** com sugestões de desenvolvimento para aumentar a empregabilidade

O sistema também oferece **templates de currículo profissionais** para impressão em PDF, histórico de análises, modelo freemium com créditos gratuitos e plano Pro, além de suporte via tickets integrado ao banco de dados.

---

## 🚀 Alinhamento Estratégico — Expo Tech 2026

> **Trilha: BI e Transformação Digital**
> Curso de Gestão da Tecnologia da Informação — 5º Semestre · UniFECAF

O CV Match se posiciona diretamente na trilha de **BI e Transformação Digital** por aplicar a inteligência de dados na tomada de decisão estratégica da própria carreira do usuário. Em vez de participar de processos seletivos às cegas, a plataforma fornece ao candidato **métricas objetivas e acionáveis** sobre seu nível de aderência ao mercado — reduzindo a assimetria de informação e democratizando o acesso a análises preditivas que antes eram exclusivas de recrutadores *(Tech Recruiters)*.

A solução demonstra como tecnologias emergentes (IA Generativa, Cloud Backend, SaaS freemium) podem ser combinadas para digitalizar, otimizar e **criar vantagem competitiva no mercado de trabalho**, alinhando-se aos objetivos de transformação organizacional e inovação previstos na disciplina.

---

## 🛠️ Arquitetura e Tecnologias

### Tech Stack

| Camada | Tecnologia |
|:---|:---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) |
| **Linguagem** | [TypeScript 5.9](https://www.typescriptlang.org/) |
| **Estilização** | [Tailwind CSS v4](https://tailwindcss.com/) + `tw-animate-css` + `motion` |
| **Autenticação** | [Supabase Auth](https://supabase.com/docs/guides/auth) via `@supabase/ssr` |
| **Banco de Dados** | [Supabase Postgres](https://supabase.com/docs/guides/database) — tabelas `profiles`, `analyses`, `subscriptions`, `support_tickets` |
| **Armazenamento** | [Supabase Storage](https://supabase.com/docs/guides/storage) — anexos de suporte |
| **Inteligência Artificial** | [Google Gemini 2.5 Flash](https://ai.google.dev/) via `@google/generative-ai` |
| **Ícones** | [Lucide React](https://lucide.dev/) |
| **Notificações** | [Sonner](https://sonner.emilkowal.ski/) |
| **Impressão em PDF** | [react-to-print](https://github.com/MatthewHerbst/react-to-print) |

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                   Usuário (Browser)                     │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼─────────────────────────────────┐
│                 Next.js 15 — App Router                 │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Pages /     │  │  Middleware  │  │    Server     │  │
│  │  Dashboard   │  │  Auth Guard  │  │   Actions     │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              API Route — /api/analyze               │ │
│  └────────────────────────┬────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────┘
               ┌────────────┘
   ┌───────────▼──────────┐        ┌───────────────────┐
   │  Google Gemini AI    │        │     Supabase      │
   │  gemini-2.5-flash    │        │  Auth · Postgres  │
   │  Análise CV × Vaga   │        │  Storage · RPC    │
   └──────────────────────┘        └───────────────────┘
```

---

## ⚙️ Como Executar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/) v9 ou superior
- Conta gratuita no [Supabase](https://supabase.com/)
- Chave de API gratuita do [Google AI Studio](https://aistudio.google.com/)

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

Crie o arquivo `.env.local` na raiz do projeto a partir do exemplo disponível:

```bash
cp .env.example .env.local
```

Abra `.env.local` e preencha com suas credenciais:

```env
# URL pública da aplicação (desenvolvimento local)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Credenciais do Supabase — Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_supabase_anon_key_aqui

# Chave da API do Google Gemini — https://aistudio.google.com/app/apikey
GEMINI_API_KEY=sua_gemini_api_key_aqui
```

> 💡 **Supabase:** acesse o [Dashboard](https://app.supabase.com/) → selecione seu projeto → **Project Settings** → **API**.
>
> 💡 **Gemini:** acesse o [Google AI Studio](https://aistudio.google.com/app/apikey) e gere uma chave gratuita.

**4. Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

**5. Acesse a aplicação**

Abra [http://localhost:3000](http://localhost:3000) no navegador, crie sua conta e comece a usar. ✅

---

## 👥 Equipe de Desenvolvimento

<div align="center">

**Desenvolvedores — Turma GTI.5NA**

| Desenvolvedor | RA |
|:---:|:---:|
| Diego dos Anjos | 7961 |
| Gustavo Ribeiro | 90044 |
| Ian Meirelles | 94838 |

**Instituição:** Centro Universitário UniFECAF

---

*Projeto desenvolvido para a **Expo Tech 2026** · UniFECAF*

</div>

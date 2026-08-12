/**
 * Teste temporário da rota /api/analyze (Gemini 2.5 Flash).
 * Uso: node test-ai.js
 * Requer: npm run dev rodando em http://localhost:3000 e GEMINI_API_KEY no .env.local
 */

const fs = require('fs');
const path = require('path');

function loadEnvLocal() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local não encontrado na raiz do projeto.');
  }
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey || apiKey.includes('sua_chave')) {
  console.error('GEMINI_API_KEY ausente ou ainda é o placeholder no .env.local');
  process.exit(1);
}

const payload = {
  userName: 'Maria Santos',
  jobTitle: 'Desenvolvedora Front-end Pleno',
  companyName: 'Nexus Digital',
  jobDescription:
    'Buscamos uma pessoa desenvolvedora front-end pleno para atuar com React, Next.js e TypeScript. É desejável experiência com Tailwind CSS, testes automatizados e consumo de APIs REST. O time valoriza comunicação clara e entrega incremental.',
  baseCv: {
    nome: 'Maria Santos',
    email: 'maria.santos@email.com',
    telefone: '11988887777',
    cidade: 'São Paulo',
    estado: 'SP',
    resumo:
      'Desenvolvedora front-end com 3 anos de experiência em React e JavaScript, atuação em produtos SaaS e interfaces responsivas.',
    formacao: 'Bacharelado em Ciência da Computação',
    habilidades: 'JavaScript, React, HTML, CSS, Git',
    experiencias: [
      {
        cargo: 'Desenvolvedora Front-end Júnior',
        empresa: 'Agência Pixel',
        descricao:
          'Implementação de landing pages e dashboards em React, integração com APIs REST e manutenção de componentes reutilizáveis.',
      },
    ],
  },
};

async function testDirectGemini() {
  console.log('\n=== 1) Chamada direta ao Gemini 2.5 Flash ===');
  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: 'Responda apenas este JSON: {"ok": true, "model": "gemini-2.5-flash"}' }],
        },
      ],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  const text = await res.text();
  console.log('HTTP', res.status);
  if (!res.ok) {
    console.error('Falha na chamada direta:', text.slice(0, 800));
    return false;
  }

  const data = JSON.parse(text);
  const modelText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log('Resposta do modelo:', modelText);
  return true;
}

async function testLocalRoute() {
  console.log('\n=== 2) POST http://localhost:3000/api/analyze ===');
  const res = await fetch('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  console.log('HTTP', res.status);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error('Resposta não é JSON:', text.slice(0, 800));
    return false;
  }

  console.log(JSON.stringify(data, null, 2));

  const looksValid =
    typeof data.matchScore === 'number' &&
    typeof data.feedbackGeral === 'string' &&
    Array.isArray(data.habilidadesAderentes) &&
    Array.isArray(data.trilhaEstudos);

  if (looksValid) {
    console.log('\nJSON da análise válido.');
    return true;
  }

  console.error('\nJSON inesperado (sem matchScore/feedbackGeral/trilhaEstudos).');
  return false;
}

(async () => {
  try {
    const directOk = await testDirectGemini();
    const routeOk = await testLocalRoute();
    process.exit(directOk && routeOk ? 0 : 1);
  } catch (err) {
    console.error('Erro no teste:', err.message ?? err);
    process.exit(1);
  }
})();

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  // Validate environment variable before any work
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    console.error('[API_ANALYZE_ERROR]: GEMINI_API_KEY não está configurada no servidor.');
    return NextResponse.json(
      { error: 'Chave de API da IA não configurada no servidor.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { baseCv, jobTitle, jobDescription, companyName, userName } = body;

    console.log('[API_ANALYZE] Payload recebido:', { temCV: !!baseCv, temVaga: !!jobDescription, userName });
    console.log('[DEBUG] Iniciando IA com a chave:', process.env.GEMINI_API_KEY?.substring(0, 15) + '...');

    // Server-side guard: reject obviously invalid inputs before spending any API quota
    const hasRealContent = (text: string, minLen: number, minWords: number) => {
      const trimmed = (text || '').trim();
      if (trimmed.length < minLen) return false;
      const realWords = trimmed
        .split(/\s+/)
        .filter((w) => /[a-záàâãéèêíïóôõöúüçña-z]{2,}/i.test(w));
      return realWords.length >= minWords;
    };

    if (!hasRealContent(jobDescription, 20, 3)) {
      console.warn('[API_ANALYZE] Descrição da vaga rejeitada pela validação do servidor.');
      return NextResponse.json(
        {
          error: true,
          message:
            'Não conseguimos identificar a vaga informada. Por favor, forneça mais detalhes ou o nome correto do cargo para que possamos gerar sua análise.',
        },
        { status: 200 }
      );
    }

    const systemInstruction = `
INSTRUÇÃO PRIORITÁRIA — VALIDAÇÃO DE ENTRADA:
Antes de qualquer análise, avalie se o título da vaga e a descrição fornecidos pelo usuário são compreensíveis e fazem sentido no contexto profissional.
SE o título da vaga ou a descrição for incompreensível, contiver apenas caracteres aleatórios (ex: "ayta", "asdasd", "xzxzxz"), repetições sem sentido ou claramente não representar um cargo ou oportunidade de trabalho real, retorne IMEDIATAMENTE e EXCLUSIVAMENTE este JSON, sem mais nada:
{"error": true, "message": "Não conseguimos identificar a vaga informada. Por favor, forneça mais detalhes ou o nome correto do cargo para que possamos gerar sua análise."}
Somente prossiga com a análise completa abaixo se a entrada fizer sentido profissional.

Você é um Headhunter Sênior e Especialista em Carreira com foco em RH Digital. Sua missão é analisar a compatibilidade de um currículo com uma vaga de emprego.

DIRETRIZES DE PERSONALIZAÇÃO:
- Enderece o usuário diretamente pelo nome (${userName}) no início do campo feedbackGeral. (Ex: 'Olá, ${userName}, analisei seu perfil e...').
- Não dê conselhos genéricos como 'Melhore suas habilidades'. Em vez disso, SEJA ESPECÍFICO nos contrastes. Analise Hard Skills (ferramentas, tecnologias), Soft Skills e Senioridade.

EXEMPLOS DE CONTRASTE QUE VOCÊ DEVE GERAR (no campo feedbackGeral):
- Se a vaga pede Senior e o CV é Junior: '${userName}, a vaga exige autonomia e liderança que não ficaram claras nas suas experiências atuais. Recomendo focar nos resultados que você gerou, não apenas nas tarefas.'
- Se a vaga pede uma tecnologia que o CV não tem: 'A vaga exige AWS, mas seu CV lista apenas Azure. Sugiro mencionar que você tem facilidade em migrar entre provedores de Cloud, ${userName}'.
- Se o resumo é fraco: '${userName}, seu resumo profissional é muito técnico. A vaga pede um perfil de liderança. Reescreva seu resumo para focar mais em gestão de times e menos em código.'

REGRA CRÍTICA: Sua resposta deve ser PURAMENTE UM JSON VÁLIDO. NÃO USE formatação Markdown, nem crases \`\`\`json, nada disso. APENAS retorne a string do JSON.
A estrutura obrigatória é:
{
  "matchScore": Number,
  "feedbackGeral": "String com o texto de avaliação do perfil",
  "habilidadesAderentes": ["Array", "de", "Strings", "com", "habilidades"],
  "trilhaEstudos": [
    {
      "lacuna": "String apontando o que falta (ex: Pouca experiência com testes)",
      "acao": "String com dica prática",
      "cursoRecomendado": "String com nome de um curso real",
      "plataforma": "String com nome da plataforma (Udemy, Coursera, Alura, etc)"
    }
  ]
}
`;

    const prompt = `
Contexto da Análise:
Nome do Usuário: ${userName}
Vaga: ${jobTitle}
Empresa: ${companyName}
Descrição da Vaga: ${jobDescription}

Currículo do Candidato:
${JSON.stringify(baseCv, null, 2)}
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    if (!rawText) {
      throw new Error('A resposta do Gemini não contém texto.');
    }

    // Strip markdown code fences that some models add despite the instruction
    const sanitized = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let parsedData;
    try {
      parsedData = JSON.parse(sanitized);
    } catch (parseError: any) {
      console.error('[API_ANALYZE_ERROR] JSON.parse falhou:', parseError.message);
      console.error('[API_ANALYZE_ERROR] Texto recebido:', sanitized);
      throw new Error(`Falha ao fazer parse do JSON da IA: ${parseError.message}`);
    }

    return NextResponse.json(parsedData, { status: 200 });

  } catch (error: any) {
    console.error('[API_ANALYZE_ERROR]:', error);
    return NextResponse.json(
      {
        error: 'Falha na comunicação com a IA',
        details: error.message ?? String(error),
      },
      { status: 500 }
    );
  }
}

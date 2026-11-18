import { CLINICA, horariosLivres, textoClinica } from './clinica.js'

// Assistente virtual do negócio fictício. A IA (Google Gemini) só interpreta e redige;
// horários e agendamentos são consultados e validados aqui no servidor.

type Msg = { role: 'user' | 'assistente'; texto: string }
type Acao =
  | { tipo: 'agendamento'; protocolo: string; servico: string; data: string; hora: string; nome: string }
  | { tipo: 'transferencia'; motivo: string; resumo: string }

// Usa a API do Google direto. No Netlify, o AI Gateway também pode injetar GOOGLE_GEMINI_BASE_URL.
const BASE = (process.env.GOOGLE_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com').replace(/\/$/, '')
// Modelos tentados em ordem; o primeiro aceito fica guardado enquanto a função estiver quente.
// O "lite" vem primeiro: no plano grátis do Google é o que responde rápido e sem limite apertado.
const CANDIDATOS = [process.env.GEMINI_MODEL, 'gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3-flash-preview'].filter(Boolean) as string[]
let modeloOk: string | null = null
const MAX_MSGS = 30
const MAX_CHARS = 600

// Limite simples por IP (por instância da função) para a demo pública não ser abusada.
const uso = new Map<string, number[]>()
function limitado(ip: string) {
  const agora = Date.now()
  const janela = (uso.get(ip) || []).filter((t) => agora - t < 10 * 60_000)
  janela.push(agora)
  uso.set(ip, janela)
  return janela.length > 40
}

function hojeSP() {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date())
}

function instrucoes() {
  return `Você é a ${CLINICA.assistente}, assistente virtual do ${CLINICA.nome}, um ${CLINICA.tipo} em São Carlos. Atenda tutores pelo chat do site, em português do Brasil, com carinho, bom humor leve e objetividade.

Agora é ${hojeSP()} (horário de Brasília).

INFORMAÇÕES DO PET SHOP (a única fonte que você pode usar):
${textoClinica()}

REGRAS:
- Responda de forma curta: no máximo 3 frases ou uma lista curta.
- Os preços dependem do porte. Se a pessoa não disse o porte, pergunte o nome, a raça ou o peso do pet e deduza o porte pela tabela de portes. Diga sempre o valor do porte certo, nunca a tabela inteira sem necessidade.
- Use SOMENTE as informações acima. Nunca invente preço, serviço, horário ou profissional. Se não souber, ofereça falar com a equipe.
- Para falar de horários disponíveis, SEMPRE chame ver_horarios e ofereça no máximo 4 opções.
- Para agendar: confirme serviço, dia, hora, nome do pet, porte e o primeiro nome do tutor. Depois chame agendar_servico. Lembre que as vacinas precisam estar em dia para banho e tosa. Não peça CPF, telefone, e-mail nem endereço (é uma demonstração).
- Se a ferramenta disser que o horário não está livre, peça desculpas e ofereça outros.
- Não faça diagnóstico nem indique remédio. Se o tutor descrever sintoma (vômito, diarreia, apatia, ferida), ofereça a consulta veterinária mais próxima. Em emergência (sangramento, convulsão, envenenamento, falta de ar), oriente procurar um hospital veterinário 24h agora.
- Se a pessoa pedir atendente humano, reclamar, ou o assunto fugir do que você sabe, chame transferir_para_equipe.
- Se perguntarem se você é uma IA ou se o pet shop é real: diga que é uma assistente de IA de demonstração e que o pet shop é fictício, criado por Alan Souza para mostrar como funciona um atendimento com IA.
- Pode usar **negrito** para valores e horários. Não use títulos.`
}

const FERRAMENTAS = [
  {
    functionDeclarations: [
      {
        name: 'ver_horarios',
        description: 'Lista horários livres na agenda. Use antes de oferecer qualquer horário.',
        parameters: {
          type: 'OBJECT',
          properties: {
            data: { type: 'STRING', description: 'Data desejada no formato AAAA-MM-DD (opcional).' },
            periodo: { type: 'STRING', enum: ['manha', 'tarde', 'qualquer'] },
          },
        },
      },
      {
        name: 'agendar_servico',
        description: 'Agenda um serviço depois que o tutor confirmou serviço, dia, hora, pet e porte.',
        parameters: {
          type: 'OBJECT',
          properties: {
            servico_id: { type: 'STRING', enum: CLINICA.servicos.map((s) => s.id) },
            porte: { type: 'STRING', enum: ['P', 'M', 'G'] },
            pet: { type: 'STRING', description: 'Nome do pet' },
            data: { type: 'STRING', description: 'AAAA-MM-DD' },
            hora: { type: 'STRING', description: 'HH:MM' },
            nome: { type: 'STRING', description: 'Primeiro nome do tutor' },
          },
          required: ['servico_id', 'porte', 'pet', 'data', 'hora', 'nome'],
        },
      },
      {
        name: 'transferir_para_equipe',
        description: 'Encaminha a conversa para uma pessoa da equipe.',
        parameters: {
          type: 'OBJECT',
          properties: {
            motivo: { type: 'STRING' },
            resumo: { type: 'STRING', description: 'Resumo curto do que o tutor quer' },
          },
          required: ['motivo', 'resumo'],
        },
      },
    ],
  },
]

function executar(nome: string, args: any, ocupados: string[], acoes: Acao[]) {
  if (nome === 'ver_horarios') {
    let lista = horariosLivres(new Date(), 7, ocupados)
    if (args?.data) lista = lista.filter((h) => h.data === args.data)
    if (args?.periodo === 'manha') lista = lista.filter((h) => h.hora < '12:00')
    if (args?.periodo === 'tarde') lista = lista.filter((h) => h.hora >= '13:00')
    return { horarios: lista.slice(0, 8), observacao: lista.length ? undefined : 'Nenhum horário livre com esse filtro.' }
  }
  if (nome === 'agendar_servico') {
    const servico = CLINICA.servicos.find((s) => s.id === args?.servico_id)
    const porte = (['P', 'M', 'G'].includes(args?.porte) ? args.porte : 'P') as 'P' | 'M' | 'G'
    const hora = String(args?.hora || '').slice(0, 5)
    const livre = horariosLivres(new Date(), 7, ocupados).some((h) => h.data === args?.data && h.hora === hora)
    if (!servico) return { ok: false, erro: 'Serviço inválido.' }
    if (!livre) return { ok: false, erro: 'Esse horário não está livre. Consulte ver_horarios de novo.' }
    const tutor = String(args?.nome || '').trim().split(/\s+/)[0]?.slice(0, 30) || 'Tutor'
    const pet = String(args?.pet || 'Pet').trim().slice(0, 30)
    const protocolo = 'VP' + Math.random().toString(36).slice(2, 7).toUpperCase()
    const valor = servico.precos[porte]
    ocupados.push(`${args.data} ${hora}`)
    acoes.push({ tipo: 'agendamento', protocolo, servico: `${servico.nome} · ${pet} (porte ${porte}) · R$ ${valor}`, data: args.data, hora, nome: tutor })
    return { ok: true, protocolo, servico: servico.nome, pet, porte, valor, data: args.data, hora, tutor }
  }
  if (nome === 'transferir_para_equipe') {
    acoes.push({ tipo: 'transferencia', motivo: String(args?.motivo || '').slice(0, 200), resumo: String(args?.resumo || '').slice(0, 300) })
    return { ok: true, mensagem: 'Conversa enviada para a equipe. Em horário comercial, alguém responde em poucos minutos.' }
  }
  return { ok: false, erro: 'Ferramenta desconhecida.' }
}

function json(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), { status, headers: { 'content-type': 'application/json; charset=utf-8' } })
}

export async function atender(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ erro: 'Use POST.' }, 405)
  const chave = process.env.GEMINI_API_KEY
  if (!chave) return json({ resposta: 'A assistente está em manutenção no momento. Tente de novo mais tarde.', acoes: [] })

  const ip = req.headers.get('x-real-ip') || req.headers.get('x-nf-client-connection-ip') || (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim()
  if (limitado(ip)) return json({ resposta: 'Muitas mensagens em pouco tempo. Aguarde alguns minutos e tente de novo.', acoes: [] }, 429)

  let corpo: { mensagens?: Msg[]; agendados?: string[] }
  try {
    corpo = await req.json()
  } catch {
    return json({ erro: 'JSON inválido.' }, 400)
  }
  const mensagens = (corpo.mensagens || []).slice(-MAX_MSGS).filter((m) => m && typeof m.texto === 'string' && (m.role === 'user' || m.role === 'assistente'))
  if (!mensagens.length || mensagens[mensagens.length - 1].role !== 'user') return json({ erro: 'Envie a mensagem do usuário.' }, 400)
  const ocupados = (corpo.agendados || []).filter((s) => typeof s === 'string').slice(0, 50)

  const contents: any[] = mensagens.map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.texto.slice(0, MAX_CHARS) }] }))
  const acoes: Acao[] = []

  for (let passo = 0; passo < 5; passo++) {
    const corpoReq = JSON.stringify({
      systemInstruction: { parts: [{ text: instrucoes() }] },
      contents,
      tools: FERRAMENTAS,
      generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
    })
    const fila = modeloOk ? [modeloOk, ...CANDIDATOS.filter((m) => m !== modeloOk)] : CANDIDATOS
    const chamar = async (modelo: string, ms: number, cancelar?: AbortSignal): Promise<Response> => {
      try {
        const sinais = [AbortSignal.timeout(ms), ...(cancelar ? [cancelar] : [])]
        const resp = await fetch(`${BASE}/v1beta/models/${modelo}:generateContent`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': chave },
          body: corpoReq,
          signal: AbortSignal.any(sinais),
        })
        if (!resp.ok) console.log('MODELO_FALHOU ' + modelo + ' ' + resp.status + ' ' + (await resp.clone().text()).slice(0, 160).replace(/\s+/g, ' '))
        return resp
      } catch {
        return new Response('{}', { status: 504 })
      }
    }

    // Um modelo por vez (chamadas em paralelo gastam o dobro da cota grátis do Google).
    // Se um estiver sobrecarregado, sem cota ou travado, passa para o próximo.
    let r: Response = new Response('{}', { status: 504 })
    for (const modelo of fila) {
      r = await chamar(modelo, 8000)
      if (r.ok) {
        modeloOk = modelo
        break
      }
      if (r.status >= 500 || r.status === 429) continue
      const txt = await r.clone().text()
      if (!/unknown_model|not found|suitable provider|not supported|no longer available/i.test(txt)) break
    }
    if (!r.ok) {
      console.log('ERRO_GEMINI status=' + r.status + ' corpo=' + (await r.text()).slice(0, 300).replace(/\s+/g, ' '))
      const msg = r.status === 429 ? 'A demonstração atingiu o limite de uso por agora. Tente de novo em alguns minutos.' : 'Tive um problema para responder agora. Pode tentar de novo?'
      return json({ resposta: msg, acoes })
    }
    const dados: any = await r.json()
    const partes: any[] = dados?.candidates?.[0]?.content?.parts || []
    const chamadas = partes.filter((p) => p.functionCall)
    if (!chamadas.length) {
      const texto = partes.map((p) => p.text || '').join('').trim()
      return json({ resposta: texto || 'Desculpe, não entendi. Pode reformular?', acoes })
    }
    contents.push({ role: 'model', parts: partes })
    contents.push({
      role: 'user',
      parts: chamadas.map((p) => ({
        functionResponse: { name: p.functionCall.name, response: executar(p.functionCall.name, p.functionCall.args, ocupados, acoes) },
      })),
    })
  }
  return json({ resposta: 'Desculpe, me enrolei aqui. Pode repetir o que precisa?', acoes })
}


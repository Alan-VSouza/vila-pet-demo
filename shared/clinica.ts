// Dados do pet shop FICTÍCIO usado na demonstração. Tudo o que a IA pode dizer sai daqui.

export type Porte = 'P' | 'M' | 'G'

export const CLINICA = {
  nome: 'Vila Pet Banho & Cuidado',
  tipo: 'pet shop com banho, tosa e clínica veterinária',
  assistente: 'Nina',
  cidade: 'São Carlos - SP',
  endereco: 'Rua Exemplo, 321, Vila Prado, São Carlos - SP (endereço fictício)',
  horarios: 'Banho e tosa de segunda a sábado, das 8h às 18h. Veterinária de segunda a sexta, das 9h às 19h, e sábado até 13h.',
  agenda: { semana: [8, 18], sabado: [8, 13], pausa: 12 },
  pagamento: 'Pix, débito e crédito. Pacote mensal de 4 banhos com 15% de desconto.',
  portes: 'P: até 10 kg (ex.: shih-tzu, yorkshire, gatos). M: de 10 a 25 kg (ex.: beagle, border collie). G: acima de 25 kg (ex.: labrador, golden).',
  leva_e_traz: 'Leva e traz grátis na Vila Prado, Centro e Jardim São Carlos; R$ 15 nos demais bairros de São Carlos.',
  cuidados: 'Vacinas em dia são obrigatórias para banho e tosa (V8/V10 e antirrábica). Pets agressivos ou muito ansiosos: avisar antes, usamos horário mais tranquilo. Emergência veterinária fora do horário: procurar um hospital veterinário 24h.',
  servicos: [
    { id: 'banho', nome: 'Banho', precos: { P: 55, M: 75, G: 100 }, duracao: 60, descricao: 'Shampoo neutro, secagem, corte de unhas, limpeza de ouvidos e perfume.' },
    { id: 'banho_tosa_hig', nome: 'Banho + tosa higiênica', precos: { P: 70, M: 95, G: 125 }, duracao: 75, descricao: 'Banho completo e tosa das patas, barriga e região íntima.' },
    { id: 'banho_tosa', nome: 'Banho + tosa completa', precos: { P: 95, M: 130, G: 170 }, duracao: 120, descricao: 'Tosa na máquina ou na tesoura, no estilo que você preferir.' },
    { id: 'hidratacao', nome: 'Hidratação de pelagem', precos: { P: 30, M: 40, G: 50 }, duracao: 20, descricao: 'Adicional ao banho, para pelo ressecado ou com nós.' },
    { id: 'consulta', nome: 'Consulta veterinária', precos: { P: 150, M: 150, G: 150 }, duracao: 30, descricao: 'Clínica geral para cães e gatos, com retorno em até 15 dias.' },
    { id: 'vacina', nome: 'Vacina V10 ou antirrábica', precos: { P: 110, M: 110, G: 110 }, duracao: 15, descricao: 'Aplicação com avaliação rápida antes. Carteirinha atualizada na hora.' },
  ] as { id: string; nome: string; precos: Record<Porte, number>; duracao: number; descricao: string }[],
  equipe: [
    { nome: 'Dra. Renata Lima', area: 'Médica-veterinária, CRMV-SP 00000 (fictício)' },
    { nome: 'Diego Martins', area: 'Banho e tosa, especialista em raças de pelo longo' },
    { nome: 'Carol Souza', area: 'Banho e tosa, cães ansiosos e gatos' },
  ],
}

const TZ = 'America/Sao_Paulo'
function partes(d: Date) {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', hourCycle: 'h23' })
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]))
  return { data: `${p.year}-${p.month}-${p.day}`, semana: p.weekday as string, hora: Number(p.hour) }
}
function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return (h >>> 0) % 100
}
export type Horario = { data: string; diaSemana: string; hora: string }
const NOMES_DIA: Record<string, string> = { Mon: 'segunda', Tue: 'terça', Wed: 'quarta', Thu: 'quinta', Fri: 'sexta', Sat: 'sábado', Sun: 'domingo' }

export function horariosLivres(agora = new Date(), dias = 7, ocupados: string[] = []): Horario[] {
  const out: Horario[] = []
  const hoje = partes(agora)
  const { semana: hSemana, sabado: hSabado, pausa } = CLINICA.agenda
  for (let i = 0; i < dias + 3 && out.length < 400; i++) {
    const d = new Date(agora.getTime() + i * 86400000)
    const { data, semana } = partes(d)
    if (semana === 'Sun') continue
    const [abre, fecha] = semana === 'Sat' ? hSabado : hSemana
    for (let h = abre; h < fecha; h++) {
      if (h === pausa && semana !== 'Sat') continue
      if (data === hoje.data && h <= hoje.hora + 1) continue
      const hora = `${String(h).padStart(2, '0')}:00`
      const chave = `${data} ${hora}`
      if (hash(chave) < 45 || ocupados.includes(chave)) continue
      out.push({ data, diaSemana: NOMES_DIA[semana] ?? semana, hora })
    }
  }
  return out
}

export function textoClinica(): string {
  const c = CLINICA
  return [
    `Nome: ${c.nome} (${c.tipo}, fictício, de demonstração) - ${c.cidade}`,
    `Endereço: ${c.endereco}`,
    `Horários: ${c.horarios}`,
    `Pagamento: ${c.pagamento}`,
    `Portes: ${c.portes}`,
    `Leva e traz: ${c.leva_e_traz}`,
    `Regras e cuidados: ${c.cuidados}`,
    'Serviços e preços por porte (P / M / G):',
    ...c.servicos.map((s) => `- ${s.nome} (id: ${s.id}): R$ ${s.precos.P} / R$ ${s.precos.M} / R$ ${s.precos.G}. Duração: ${s.duracao} min. ${s.descricao}`),
    'Equipe:',
    ...c.equipe.map((e) => `- ${e.nome}: ${e.area}`),
  ].join('\n')
}

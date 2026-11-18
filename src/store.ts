// Guarda agendamentos e transferências no navegador (é só uma demo, sem banco de dados).

export type Agendamento = { protocolo: string; servico: string; data: string; hora: string; nome: string; criadoEm: string }
export type Transferencia = { motivo: string; resumo: string; criadoEm: string }

const K_AG = 'demo-clinica:agendamentos'
const K_TR = 'demo-clinica:transferencias'

function ler<T>(k: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(k) || '[]')
  } catch {
    return []
  }
}
function gravar<T>(k: string, v: T[]) {
  try {
    localStorage.setItem(k, JSON.stringify(v.slice(-50)))
  } catch {
    /* modo privado: ignora */
  }
}

export const lerAgendamentos = () => ler<Agendamento>(K_AG)
export const lerTransferencias = () => ler<Transferencia>(K_TR)
export const salvarAgendamento = (a: Agendamento) => gravar(K_AG, [...lerAgendamentos(), a])
export const salvarTransferencia = (t: Transferencia) => gravar(K_TR, [...lerTransferencias(), t])
export function limparTudo() {
  gravar(K_AG, [])
  gravar(K_TR, [])
}

export function formatarData(iso: string) {
  const [a, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(a, m - 1, d, 12))
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(dt)
}

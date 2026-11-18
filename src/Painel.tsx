import { useEffect, useState } from 'react'
import { formatarData, lerAgendamentos, lerTransferencias, limparTudo, type Agendamento, type Transferencia } from './store'

export default function Painel() {
  const [ag, setAg] = useState<Agendamento[]>([])
  const [tr, setTr] = useState<Transferencia[]>([])

  const carregar = () => {
    setAg(lerAgendamentos().sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora)))
    setTr(lerTransferencias().reverse())
  }
  useEffect(() => {
    carregar()
    const t = setInterval(carregar, 3000)
    return () => clearInterval(t)
  }, [])

  const hora = (iso: string) => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="painel">
      <header className="painel-topo">
        <div>
          <p className="sobretitulo">Vila Pet · Recepção</p>
          <h1>Painel do atendimento</h1>
          <p className="lead">O que a assistente fez no chat aparece aqui. Nesta demo os dados ficam só no seu navegador.</p>
        </div>
        <div className="painel-acoes">
          <a className="btn fantasma" href="/">Voltar ao site</a>
          <button className="btn fantasma" onClick={() => { limparTudo(); carregar() }}>Limpar demo</button>
        </div>
      </header>

      <div className="painel-resumo">
        <div><strong>{ag.length}</strong><span>horários marcados pela IA</span></div>
        <div><strong>{tr.length}</strong><span>conversas passadas à recepção</span></div>
      </div>

      <section className="painel-bloco">
        <h2>Horários marcados</h2>
        {ag.length === 0 ? (
          <p className="vazio">Nenhuma ainda. <a href="/">Abra o chat</a> e peça para marcar um banho.</p>
        ) : (
          <div className="tabela-rolagem">
            <table>
              <thead><tr><th>Dia</th><th>Hora</th><th>Tutor</th><th>Serviço e pet</th><th>Protocolo</th></tr></thead>
              <tbody>
                {ag.map((a) => (
                  <tr key={a.protocolo}><td>{formatarData(a.data)}</td><td>{a.hora}</td><td>{a.nome}</td><td>{a.servico}</td><td><code>{a.protocolo}</code></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="painel-bloco">
        <h2>Para a recepção responder</h2>
        {tr.length === 0 ? (
          <p className="vazio">Nada pendente. Peça "quero falar com um atendente" no chat para ver como chega.</p>
        ) : (
          <ul className="lista-tr">
            {tr.map((t, i) => (
              <li key={i}><span className="quando">{hora(t.criadoEm)}</span><strong>{t.motivo}</strong><p>{t.resumo}</p></li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

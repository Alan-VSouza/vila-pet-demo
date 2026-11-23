// Prévia estática do painel da recepção: o que o dono do negócio recebe quando a assistente trabalha à noite.
export type Previa = {
  painel: string
  resumo: [string, string][]
  listaTitulo: string
  itens: [string, string, string, string][]
  pedidoTitulo: string
  pedido: [string, string]
}

export default function PainelPrevia({ p }: { p: Previa }) {
  return (
    <div className="previa span-6 start-7" data-visual aria-label={`Exemplo do ${p.painel.toLowerCase()}`}>
      <div className="previa__barra"><span className="previa__pontos" aria-hidden="true"><i /><i /><i /></span><span>{p.painel}, exemplo</span></div>
      <div className="previa__corpo">
        <div className="previa__resumo">
          {p.resumo.map(([n, t]) => <div key={t}><strong>{n}</strong><span>{t}</span></div>)}
        </div>
        <p className="previa__titulo">{p.listaTitulo}</p>
        <ul className="previa__lista">
          {p.itens.map(([quando, nome, detalhe, dia]) => (
            <li key={nome}><span className="previa__hora">{quando}</span><span className="previa__nome">{nome}<small>{detalhe}</small></span><span className="previa__dia">{dia}</span></li>
          ))}
        </ul>
        <p className="previa__titulo">{p.pedidoTitulo}</p>
        <div className="previa__pedido"><strong>{p.pedido[0]}</strong><span>{p.pedido[1]}</span></div>
      </div>
    </div>
  )
}

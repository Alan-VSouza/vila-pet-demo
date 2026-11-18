import { useEffect } from 'react'
import Chat, { focarChat } from './Chat'
import { CLINICA } from '../shared/clinica'

function irParaChat(e?: React.MouseEvent) {
  e?.preventDefault()
  document.getElementById('atendimento')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setTimeout(focarChat, 450)
}

const ESTETICA = CLINICA.servicos.filter((s) => !['consulta', 'vacina'].includes(s.id))
const VET = CLINICA.servicos.filter((s) => ['consulta', 'vacina'].includes(s.id))

export default function App() {
  useEffect(() => {
    const alvo = document.getElementById('atendimento')
    if (!alvo || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver(([e]) => document.body.classList.toggle('chat-visivel', e.isIntersecting), { threshold: 0.15 })
    obs.observe(alvo)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <p className="aviso-demo">
        Site de demonstração: o Vila Pet não existe. A assistente de IA é real. <a href="#para-empresas">Entenda</a>
      </p>

      <header className="topo">
        <a className="marca" href="/" aria-label="Vila Pet, início">
          <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
            <circle cx="24" cy="24" r="23" fill="var(--laranja)" />
            <g fill="#fff">
              <ellipse cx="24" cy="30" rx="8" ry="6.5" />
              <ellipse cx="14.5" cy="21" rx="3.4" ry="4.4" />
              <ellipse cx="20" cy="14.5" rx="3.4" ry="4.4" />
              <ellipse cx="28" cy="14.5" rx="3.4" ry="4.4" />
              <ellipse cx="33.5" cy="21" rx="3.4" ry="4.4" />
            </g>
          </svg>
          <span className="marca-nome">Vila Pet<small>banho · tosa · veterinária</small></span>
        </a>
        <nav aria-label="Seções">
          <a href="#precos">Preços</a>
          <a href="#veterinaria">Veterinária</a>
          <a href="#leva-e-traz">Leva e traz</a>
        </nav>
        <a className="btn" href="#atendimento" onClick={irParaChat}>Agendar</a>
      </header>

      <section className="hero">
        <div className="hero-texto">
          <p className="rotulo">Vila Prado · São Carlos</p>
          <h1>Banho marcado<br />em uma conversa.</h1>
          <p className="lead">A Nina sabe o preço certo para o porte do seu pet, vê os horários livres e agenda banho, tosa ou consulta na hora. Até de madrugada, quando você lembra que amanhã ele tem que estar cheiroso.</p>
          <ul className="selos">
            <li><strong>Leva e traz</strong> grátis na Vila Prado e no Centro</li>
            <li><strong>Veterinária</strong> no mesmo lugar</li>
          </ul>
          <div className="hero-fotos" aria-hidden="true">
            <img src="/img/corgi.jpg" alt="" />
            <img src="/img/bichon.jpg" alt="" />
          </div>
        </div>
        <div className="hero-chat" id="atendimento">
          <Chat />
        </div>
      </section>

      <section id="precos" className="precos">
        <div className="precos-dentro">
          <div className="precos-cabeca">
            <p className="rotulo claro">Preços por porte</p>
            <h2>Quanto custa,<br />sem precisar ligar.</h2>
            <p>{CLINICA.portes}</p>
          </div>
          <div className="tabela-rolagem">
            <table className="tabela-precos">
              <thead>
                <tr><th scope="col">Serviço</th><th scope="col">P <small>até 10 kg</small></th><th scope="col">M <small>10–25 kg</small></th><th scope="col">G <small>+25 kg</small></th></tr>
              </thead>
              <tbody>
                {ESTETICA.map((s) => (
                  <tr key={s.id}>
                    <th scope="row">{s.nome}<span>{s.descricao}</span></th>
                    <td>R$ {s.precos.P}</td>
                    <td>R$ {s.precos.M}</td>
                    <td>R$ {s.precos.G}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="nota-clara">{CLINICA.pagamento}</p>
        </div>
      </section>

      <main>
        <section id="veterinaria" className="bloco vet">
          <img src="/img/vet.jpg" alt="Veterinária examinando a pata de um cachorro" loading="lazy" />
          <div>
            <p className="rotulo">Veterinária</p>
            <h2>Consulta e vacina<br />no mesmo endereço.</h2>
            <ul className="vet-lista">
              {VET.map((s) => (
                <li key={s.id}><strong>{s.nome}</strong><span>R$ {s.precos.P}</span><p>{s.descricao}</p></li>
              ))}
            </ul>
            <p className="aviso-saude"><strong>Emergência fora do horário?</strong> Procure um hospital veterinário 24h. A Nina indica a consulta mais próxima para sintomas leves.</p>
          </div>
        </section>

        <section id="leva-e-traz" className="bloco tres">
          <div>
            <img src="/img/dupla.jpg" alt="Dois cachorros sentados na frente de girassóis" loading="lazy" />
          </div>
          <div>
            <p className="rotulo">Leva e traz</p>
            <h2>A gente busca.</h2>
            <p>{CLINICA.leva_e_traz}</p>
            <p className="rotulo espaco">Equipe</p>
            <ul className="equipe">
              {CLINICA.equipe.map((e) => (
                <li key={e.nome}><strong>{e.nome}</strong><span>{e.area}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="rotulo">Antes de vir</p>
            <h2>Combinado.</h2>
            <p className="nota">{CLINICA.cuidados}</p>
            <p className="endereco">{CLINICA.endereco}</p>
            <p className="nota">{CLINICA.horarios}</p>
            <a className="btn" href="#atendimento" onClick={irParaChat}>Ver horários livres</a>
          </div>
        </section>
      </main>

      <section id="para-empresas" className="empresas">
        <div className="empresas-dentro">
          <p className="rotulo claro">Para pet shops, clínicas veterinárias e banho e tosa</p>
          <h2>Este pet shop não existe.<br /><span>A Nina, sim.</span></h2>
          <p className="lead">Uma assistente de IA feita para o seu pet shop. Atende no site e no WhatsApp a qualquer hora, calcula o preço pelo porte, agenda banho, tosa e consulta conferindo a agenda e lembra das vacinas.</p>
          <ul className="empresas-lista">
            <li><strong>Agenda cheia, telefone livre.</strong>Os pedidos de "quanto fica o banho?" e "tem horário amanhã?" saem do WhatsApp da equipe.</li>
            <li><strong>Preço certo sempre.</strong>Ela usa a sua tabela por porte e não inventa desconto nem serviço.</li>
            <li><strong>Equipe no controle.</strong>Agendamentos e pedidos de atendimento chegam num painel. <a href="/painel">Veja o painel desta demo</a>.</li>
          </ul>
          <a className="btn claro" href="https://alansouza.netlify.app" target="_blank" rel="noreferrer">Quero uma assistente assim</a>
          <p className="assinatura">Projeto de Alan Souza, desenvolvedor de IA em São Carlos.</p>
        </div>
      </section>

      <footer className="rodape">Vila Pet é um negócio fictício criado para demonstração. Fotos: Unsplash.</footer>

      <a className="flutuante" href="#atendimento" onClick={irParaChat}>Agendar com a Nina</a>
    </>
  )
}

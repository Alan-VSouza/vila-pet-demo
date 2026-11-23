import { useEffect } from 'react'
import Chat from './Chat'
import PainelPrevia, { type Previa } from './PainelPrevia'
import { iniciarPolimento } from './polimento'
import { CLINICA } from '../shared/clinica'

const s = (id: string) => CLINICA.servicos.find((x) => x.id === id)!
const portes = (id: string) => {
  const p = s(id).precos
  return p.P === p.G ? `R$ ${p.P}` : `R$ ${p.P} · ${p.M} · ${p.G}`
}

const KIT = ['/assets/system.js', '/assets/motion/motion.js', '/assets/layout/layout.js']

function usarKit() {
  useEffect(() => {
    if (document.querySelector('script[data-kit]')) return
    for (const src of KIT) {
      const el = document.createElement('script')
      el.type = 'module'
      el.src = src
      el.dataset.kit = ''
      document.head.appendChild(el)
    }
  }, [])
}

const PREVIA: Previa = { painel: 'Painel da recepção', resumo: [['3', 'banhos e consultas marcados fora do horário'], ['1', 'caso para a veterinária']], listaTitulo: 'Marcados pela Nina esta noite', itens: [['21:30', 'Thor, golden', 'Banho e tosa, porte G', 'Sex 9h'], ['22:05', 'Mel, shih-tzu', 'Banho, porte P', 'Sex 14h'], ['06:40', 'Bob, vira-lata', 'Consulta veterinária', 'Sáb 8h']], pedidoTitulo: 'Para a veterinária responder', pedido: ['Cachorro vomitando desde ontem', 'A Nina não deu palpite: avisou a veterinária e passou o contato do plantão.'] }

export default function App() {
  usarKit()
  useEffect(() => iniciarPolimento(), [])

  return (
    <>
      <header className="nav">
        <div className="wrap nav__bar">
          <a className="skip-link" href="#top">Pular para o conteúdo</a>
          <a className="nav__logo" href="#top">Vila Pet</a>
          <nav className="nav__links" aria-label="Principal">
            <div className="nav__item">
              <a className="nav__link" href="#precos">Preços <svg className="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
              <div className="nav__menu">
                <div className="wrap grid">
                  <a className="menu-card span-4" href="#precos">
                    <div className="panel"><img className="frame__img" src="/img/bichon.jpg" alt="Bichon branco de gravata depois do banho" /></div>
                    <span className="t-card">Banho e tosa</span>
                    <span className="t-small muted">Banho desde R$ 55, porte P</span>
                  </a>
                  <a className="menu-card span-4" href="#precos">
                    <div className="panel"><img className="frame__img" src="/img/vet.jpg" alt="Veterinárias examinando a pata de um cachorro" /></div>
                    <span className="t-card">Veterinária</span>
                    <span className="t-small muted">Consulta R$ 150, com retorno</span>
                  </a>
                  <a className="menu-card span-4" href="#visit">
                    <div className="panel"><img className="frame__img" src="/img/filhote.jpg" alt="Filhote de cavalier deitado numa manta" /></div>
                    <span className="t-card">Leva e traz</span>
                    <span className="t-small muted">Grátis na Vila Prado e no Centro</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="nav__item"><a className="nav__link" href="#visit">Visite</a></div>
            <div className="nav__item"><a className="nav__link" href="#agendar">Agenda</a></div>
            <div className="nav__item"><a className="nav__link" href="#para-empresas">Empresas</a></div>
          </nav>
          <div className="nav__actions">
            <a className="btn btn--primary" href="#agendar">Agendar banho com a Nina</a>
          </div>
          <button className="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero hero--place" data-enter aria-labelledby="hero-h">
          <img className="hero__bg" data-phone-fill src="/img/toalha.jpg" alt="Lulu da pomerânia enrolado numa toalha rosa sendo escovado depois do banho" style={{ ['--ly-pos' as string]: '50% 35%' }} {...{ fetchpriority: 'high' }} />
          <div className="wrap"><div className="hero-text">
            <div className="hero__text">
              <h1 id="hero-h">Pet shop na Vila Prado, São Carlos</h1>
              <p className="hero__lead">Banho, tosa e veterinária de segunda a sábado, a partir das 8h.</p>
              <div className="btn-row"><a className="btn btn--primary" href="#agendar">Agendar banho com a Nina</a></div>
            </div>
          </div></div>
        </section>

        <section className="section" id="visit" data-place="visit" aria-labelledby="visit-h">
          <div className="wrap">
            <div className="section-head"><h2 id="visit-h">Visite o Vila Pet</h2></div>
            <div className="grid grid--top">
            <div className="visit visit--card span-6">
              <div className="visit__cols">
                <div className="visit__col stack-4">
                  <address className="visit__address">Vila Prado<br />São Carlos</address>
                  <a className="btn btn--secondary" href="https://www.openstreetmap.org/search?query=Vila%20Prado%20S%C3%A3o%20Carlos">Ver a região</a>
                </div>
                <div className="visit__col">
                  <dl className="hours" data-tz="America/Sao_Paulo" data-assumed="">
                    <dt data-days="mon-fri">Segunda a sexta</dt><dd>8h às 18h</dd>
                    <dt data-days="sat">Sábado</dt><dd>8h às 13h</dd>
                    <dt data-days="sun">Domingo</dt><dd>Fechado</dd>
                  </dl>
                </div>
              </div>
              <ul className="visit__rows">
                <li><span>Leva e traz</span><span>Grátis na Vila Prado, Centro e Jardim São Carlos</span></li>
                <li><span>Veterinária</span><span>Até 19h de segunda a sexta</span></li>
              </ul>
            </div>
            <figure className="develop span-6 start-7" data-moment="picture-develops"><img src="/img/dupla.jpg" alt="Corgi e cachorro de pelo claro sentados na calçada em frente a um canteiro de flores" width="1067" height="1600" loading="lazy" /></figure>
            </div>
          </div>
        </section>

        <section className="section ground-surface" id="precos" aria-labelledby="precos-h" style={{ ['--hm' as string]: 2 }}>
          <div className="wrap">
            <div className="section-head">
              <h2 id="precos-h">Preços por porte</h2>
              <p>Em reais. P até 10 kg, M até 25 kg, G acima. <a className="link" href="#agendar">Ver horários livres</a></p>
            </div>
            <div className="grid grid--top">
              <div className="span-3">
                <p className="t-label">Banho e tosa</p>
                <ul className="rows">
                  {[['banho', 'Banho', 'Unhas e ouvidos'], ['banho_tosa_hig', 'Tosa higiênica', 'Com o banho'], ['banho_tosa', 'Tosa completa', 'Com o banho'], ['hidratacao', 'Hidratação', 'Adicional ao banho']].map(([id, nome, linha]) => (
                    <li key={id}><span className="rows__name">{nome}<small>{linha}</small></span><span className="rows__value">{portes(id).replace('R$ ', '')}</span></li>
                  ))}
                </ul>
              </div>
              <div className="span-3">
                <p className="t-label">Veterinária e extras</p>
                <ul className="rows">
                  <li><span className="rows__name">Consulta<small>Retorno em 15 dias</small></span><span className="rows__value">R$ 150</span></li>
                  <li><span className="rows__name">Vacina V10<small>Ou antirrábica</small></span><span className="rows__value">R$ 110</span></li>
                  <li><span className="rows__name">Leva e traz<small>Grátis em 3 bairros</small></span><span className="rows__value">R$ 15</span></li>
                  <li><span className="rows__name">4 banhos no mês<small>Pacote mensal</small></span><span className="rows__value">−15%</span></li>
                </ul>
              </div>
              <a className="pl-photo foto-preco span-3" href="#agendar"><img src="/img/banheira.jpg" alt="Cachorro de pelo marrom dentro da banheira ao lado de uma toalha verde" loading="lazy" /></a>
              <a className="pl-photo foto-preco span-3" href="#agendar"><img src="/img/secagem.jpg" alt="Cocker spaniel sendo secado e escovado no colo da tosadora" loading="lazy" /></a>
            </div>
          </div>
        </section>


        <section className="section" id="agendar" aria-labelledby="agendar-h" style={{ ['--hm' as string]: 2 }}>
          <div className="wrap">
            <div className="grid grid--top">
              <div className="span-6 stack-4">
                <h2 id="agendar-h">Agendamento com a Nina</h2>
                <p className="t-lead">Diga o nome, a raça e o porte do pet. A Nina passa o preço, mostra os horários livres e marca banho, tosa ou consulta.</p>
                <p>Sintoma de saúde vai direto para a veterinária: ela não dá diagnóstico pelo chat.</p>
              </div>
              <div className="span-6 start-7 chat-frame" id="atendimento" data-visual data-ui="nina">
                <Chat />
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="para-empresas" aria-labelledby="para-empresas-h" style={{ ['--hm' as string]: 2 }}>
          <div className="wrap grid grid--top">
            <div className="span-6 stack-4">
              <p className="t-label">Para pet shops e clínicas veterinárias</p>
              <h2 id="para-empresas-h">Uma Nina para o seu pet shop</h2>
              <p>O Vila Pet é fictício; a Nina, não. Ela atende no site e no WhatsApp com os seus preços por porte e marca na sua agenda.</p>
              <ul className="rows">
                <li><span className="rows__name">Agenda cheia sem telefone</span><p>Quem pergunta às 22h já sai com banho marcado.</p></li>
                <li><span className="rows__name">Sintoma vai para o veterinário</span><p>Ela não dá diagnóstico: marca consulta ou indica um hospital 24h.</p></li>
                <li><span className="rows__name">Painel para a recepção</span><p>Banhos marcados e pedidos de atendimento num só lugar. <a className="link" href="/painel">Abrir o painel desta demo</a></p></li>
              </ul>
              <div className="btn-row"><a className="btn btn--primary" href="https://wa.me/5519994450160?text=Oi%2C%20Alan%21%20Vi%20a%20demonstra%C3%A7%C3%A3o%20da%20Nina%20e%20quero%20uma%20assistente%20assim%20para%20o%20meu%20pet%20shop." target="_blank" rel="noreferrer">Quero uma Nina no meu pet shop</a></div>
              <p className="t-small">Fala direto com o Alan Souza, desenvolvedor de IA em São Carlos, pelo WhatsApp. <a className="link" href="https://alansouza.netlify.app" target="_blank" rel="noreferrer">Ver o portfólio</a></p>
            </div>
            <PainelPrevia p={PREVIA} />
          </div>
        </section>
      </main>

      <footer className="footer closing" id="contact" aria-labelledby="close-h">
        <div className="wrap">
          <div className="closing__cta close--word">
            <div className="section-head--split">
              <div><h2 id="close-h">Banho desde R$ 55, porte P</h2><p className="t-lead">Segunda a sábado, a partir das 8h.</p></div>
              <a className="btn btn--primary" href="#agendar">Agendar banho com a Nina</a>
            </div>
            <p className="close__word" aria-hidden="true">Vila Pet</p>
          </div>
          <div className="closing__links">
            <div className="grid">
              <div className="span-4 stack-4">
                <address className="footer__address"><a className="link" href="https://www.openstreetmap.org/search?query=Vila%20Prado%20S%C3%A3o%20Carlos">Vila Prado, São Carlos</a></address>
                <p className="footer__lede">Pet shop fictício, criado para demonstrar uma assistente de IA.</p>
              </div>
              <div className="span-2 footer__col"><h3>Serviços</h3><ul><li><a href="#precos">Preços</a></li><li><a href="#visit">Leva e traz</a></li></ul></div>
              <div className="span-2 footer__col"><h3>Visite</h3><ul><li><a href="#visit">Horários</a></li><li><a href="#atendimento">Chat com a Nina</a></li></ul></div>
              <div className="span-2 footer__col"><h3>Recepção</h3><ul><li><a href="/painel">Painel</a></li></ul></div>
              <div className="span-2 footer__col"><h3>Empresas</h3><ul><li><a href="#para-empresas">Como funciona</a></li></ul></div>
            </div>
            <div className="footer__legal">
              <span>&copy; 2026 Vila Pet, negócio fictício</span>
              <div className="socials" />
              <span className="credits">Fotos via Unsplash</span>
            </div>
          </div>
        </div>
      </footer>

      <nav className="actionbar" aria-label="Ações rápidas">
        <a className="btn btn--primary" href="#agendar">Agendar banho com a Nina</a>
      </nav>
    </>
  )
}

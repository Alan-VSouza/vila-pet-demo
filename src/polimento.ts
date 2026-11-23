// Movimento da página: entradas na rolagem, fotos com profundidade e a barra de navegação
// (fixa no topo, marca a seção atual e mostra o progresso da leitura).
// Sem script ou com "reduzir movimento", a página fica inteira e parada.

export function iniciarPolimento(): () => void {
  const html = document.documentElement
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const limpar: (() => void)[] = []

  // ---------- entradas na rolagem ----------
  if (!reduz) {
    html.classList.add('pl-js')
    const marcar = (el: Element | null, tipo: 'rv' | 'rv-media', i = 0) => {
      if (!el || el.closest('[data-moment]') || el.classList.contains('rv') || el.classList.contains('rv-media')) return
      el.classList.add(tipo)
      ;(el as HTMLElement).style.setProperty('--rv-i', String(i))
    }
    const blocos = [...document.querySelectorAll('main > section:not(.hero), .closing__cta')]
    for (const s of blocos) {
      let i = 0
      s.querySelectorAll('.section-head > *, .section-head--split > div > *, .stack-4 > :not(.rows)').forEach((el) => marcar(el, 'rv', i++))
      s.querySelectorAll('.rows > li').forEach((el, j) => marcar(el, 'rv', i + j))
      s.querySelectorAll('.card').forEach((el, j) => marcar(el, 'rv', j * 1.5))
      s.querySelectorAll('.section-head--split > .btn').forEach((el) => marcar(el, 'rv', 2))
      s.querySelectorAll('.frame--photo, .chat-frame, .close__media, .previa, .pl-photo').forEach((el) => marcar(el, 'rv-media', 1))
    }
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue
          const el = e.target as HTMLElement
          el.classList.add('is-in')
          io.unobserve(el)
          // terminada a entrada, o elemento volta às transições do kit (o hover não herda os 800ms)
          if (el.classList.contains('rv')) {
            const espera = Number(el.style.getPropertyValue('--rv-i') || 0) * 70 + 900
            setTimeout(() => { el.classList.remove('rv', 'is-in'); el.style.removeProperty('--rv-i') }, espera)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )
    document.querySelectorAll('.rv, .rv-media').forEach((el) => io.observe(el))
    // o teclado nunca cai em algo ainda escondido: o foco mostra o bloco na hora
    const foco = (e: FocusEvent) => {
      const alvo = (e.target as Element).closest?.('.rv:not(.is-in), .rv-media:not(.is-in)')
      if (alvo) { (alvo as HTMLElement).style.transition = 'none'; alvo.querySelectorAll<HTMLElement>('img').forEach((i) => (i.style.transition = 'none')); alvo.classList.add('is-in'); io.unobserve(alvo) }
    }
    document.addEventListener('focusin', foco)
    limpar.push(() => document.removeEventListener('focusin', foco))
    limpar.push(() => io.disconnect())
  }

  // ---------- navegação ----------
  const nav = document.querySelector<HTMLElement>('header.nav')
  let barra: HTMLSpanElement | null = null
  if (nav) {
    barra = document.createElement('span')
    barra.className = 'nav__progress'
    barra.setAttribute('aria-hidden', 'true')
    nav.appendChild(barra)
    limpar.push(() => barra?.remove())
  }

  // no celular, a barra fixa de ação sai quando os links do rodapé chegam, para não cobrir nenhum deles
  // (o mesmo botão já está no fechamento logo acima)
  const rodape = document.querySelector('.closing__links')
  limpar.push(() => html.classList.remove('pl-rodape'))

  // seção atual sublinhada na navegação
  const links: [HTMLElement, HTMLAnchorElement][] = []
  document.querySelectorAll<HTMLAnchorElement>('.nav__links .nav__link').forEach((a) => {
    const id = a.getAttribute('href')?.slice(1)
    const s = id ? document.querySelector<HTMLElement>(`main > section[id="${id}"]`) : null
    if (s) links.push([s, a])
  })
  let atual: HTMLAnchorElement | null = null
  const marcarAtual = (vh: number) => {
    const linha = vh * 0.4
    const achado = links.find(([s]) => { const r = s.getBoundingClientRect(); return r.top <= linha && r.bottom > linha })
    const novo = achado ? achado[1] : null
    if (novo === atual) return
    atual?.removeAttribute('aria-current')
    novo?.setAttribute('aria-current', 'location')
    atual = novo
  }
  limpar.push(() => atual?.removeAttribute('aria-current'))

  // fotos com profundidade: a imagem anda um pouco mais devagar que a moldura
  const fotos = reduz ? [] : [...document.querySelectorAll<HTMLImageElement>('.hero__media img, .frame--photo .frame__img, .close__media img')]

  let pedido = 0
  const quadro = () => {
    pedido = 0
    const y = window.scrollY
    const alto = document.documentElement.scrollHeight - window.innerHeight
    barra?.style.setProperty('--pl-p', String(alto > 0 ? Math.min(1, y / alto) : 0))
    if (nav) {
      nav.classList.toggle('is-scrolled', y > 8)
    }
    const vh = window.innerHeight
    marcarAtual(vh)
    if (rodape) html.classList.toggle('pl-rodape', rodape.getBoundingClientRect().top < vh - 40)
    for (const img of fotos) {
      const r = img.parentElement!.getBoundingClientRect()
      if (r.bottom < -100 || r.top > vh + 100) continue
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2) // -1 em cima, 1 embaixo
      img.style.setProperty('--pl-y', `${(p * 4).toFixed(2)}%`)
    }
  }
  const rolar = () => { if (!pedido) pedido = requestAnimationFrame(quadro) }
  window.addEventListener('scroll', rolar, { passive: true })
  window.addEventListener('resize', rolar)
  quadro()
  limpar.push(() => {
    window.removeEventListener('scroll', rolar)
    window.removeEventListener('resize', rolar)
    cancelAnimationFrame(pedido)
  })

  return () => limpar.forEach((f) => f())
}

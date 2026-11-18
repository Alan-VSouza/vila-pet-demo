# Nina · assistente de IA para pet shops (demo)

Site de um pet shop **fictício** (Vila Pet Banho & Cuidado, São Carlos-SP) com uma assistente de IA que passa o preço certo pelo porte, agenda banho, tosa, consulta e vacina e orienta em caso de sintomas.

**Teste ao vivo:** https://vila-pet-demo-alan.vercel.app

- Deduz o porte (P, M ou G) pela raça ou pelo peso e informa o valor da tabela.
- Agenda com nome do pet, porte e tutor, conferindo a agenda no servidor.
- Para sintomas, oferece consulta; em emergência, orienta procurar um hospital veterinário 24h.
- Painel da recepção em `/painel`.

React 18 + TypeScript + Vite, função serverless na Vercel e Google Gemini com *function calling*. Dados em `shared/clinica.ts`.

Feito por **Alan Souza**, desenvolvedor full-stack e de IA em São Carlos-SP. O Vila Pet não existe. Fotos: Unsplash.

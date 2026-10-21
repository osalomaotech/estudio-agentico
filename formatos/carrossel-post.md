# Formato: carrossel + post (LinkedIn / Instagram)

Conteúdo para o feed, com um CTA definido no briefing (bloco 6). O objetivo é parar a rolagem, entregar uma ideia útil e gerar a ação combinada.

## Fases
| Fase | Agentes | Parada |
|---|---|---|
| C1 Pesquisa (se houver dado) | `pesquisa-checagem` | — |
| C2 Texto: páginas, post e legenda | `narrativa` (modo carrossel: escreve `carrossel.json` e os textos, sem notas nem tempos) | **Sim: texto e CTA** |
| C3 Montagem | `designer` (motor `carrossel.js` + `render.py --px 1080`) | **Sim: imagens** |
| C4 QA | `qa-independente` (os itens H e J não se aplicam; confira se o CTA é idêntico no post, na legenda e na última página) | Entrega |

## Carrossel (`carrossel.json` → `motor/carrossel.js`)
De 8 a 10 páginas, no formato 4:5 (1080x1350):
1. **Capa** (`capa`): a tese ou promessa em uma frase, com o destaque e um "→" que convida a deslizar.
2. **Miolo** (`item`, `lista` ou `dado`): uma ideia por página, em frases curtas. Uma página por parte do framework funciona bem. Número sempre na página `dado`, com a fonte.
3. **Síntese** (`matriz` ou `lista`): o mapa da ideia.
4. **Pergunta** (`pergunta`): a reflexão que fica.
5. **CTA** (`cta`): a ação combinada no briefing, exatamente como vai aparecer no post.

## Post
- **Gancho:** a primeira linha precisa funcionar sozinha, porque é o que aparece antes do "ver mais".
- **Concretude:** caso, número ou situação real com fonte. Concretude gera confiança e passa nos detectores de texto de IA.
- **CTA:** no fim, igual ao da última página do carrossel.
- **Momento:** o texto respeita quando o post sai. Antes do evento é "hoje vou…"; depois é "hoje eu…". Não afirme reações da plateia que ainda não aconteceram.
- **Experiência pessoal:** só a que o autor confirmou.
- **Revisão:** se uma skill de humanizar texto existir (como `li-human`), passe o texto por ela. Regras dela feitas para o LinkedIn (como "hashtags demais") não valem para a legenda do Instagram, que leva de 3 a 5 hashtags.

## Diferenças por rede
| | LinkedIn | Instagram |
|---|---|---|
| Carrossel | PDF como documento | PNG por página (`render.py <pptx> --px 1080`) |
| Texto | post de 120 a 250 palavras | legenda curta + 3 a 5 hashtags no fim |
| Extra | — | roteiro de Reels de 20 a 40 s (cenas + texto na tela), se pedido |

## CTA e entrega
- **Mensagem padrão:** prepare a resposta para quem comentar ou chamar ("Oi, [nome]! Aqui está…").
- **Kit de entrega:** se o CTA promete material, gere o material também (guia, ebook, modelo editável). Para guias e ebooks, use `motor/documento.js` (A4).
- **Entrega:** a forma mais simples é mandar por mensagem o link de um arquivo compartilhado (Google Drive, OneDrive, Dropbox) com permissão de visualização. Escreva essa instrução para o usuário. Se o perfil tiver `extras.md` com outra forma de entrega, ofereça-a.

**Paradas:** o texto e o carrossel, antes de publicar. A skill nunca publica sozinha.

# Layouts do motor

O `slides.json` tem `meta` e `slides`. Exemplo completo, com todos os layouts e a imagem de cada um: `exemplos/catalogo-layouts/` (abra `saida/catalogo_layouts_render/grade_1.png` e `grade_2.png`).

```json
{
  "meta": { "titulo": "…", "autor": "…", "brand": "caminho/para/brand.json", "arquivo": "nome_do_arquivo" },
  "slides": [ { "id": "S01", "layout": "capa", "nome": "Capa", "titulo": "…", "notas": "…", "cortavel": false, "segundosSemFala": 0 } ]
}
```

**Campos comuns a todos os slides:**
- `id`: S01, S02…
- `layout`
- `nome`: título curto no roteiro de falas
- `notas`: a fala, com as regras de `licoes.md`
- `cortavel`: sai da versão curta
- `segundosSemFala`: pausa ou mídia, entra no tempo
- `limpo`: força o slide sem rodapé

**Texto com destaque:** escreva `**palavra**`. Use um destaque por slide.

| Layout | Campos | Uso |
|---|---|---|
| `capa` | rotulo, titulo, subtitulo, para (destinatário), foto (false para tirar) | Abertura. Usa `fotos.retrato` do brand em coluna à direita |
| `frase` | texto, tamanho, sobretitulo | Pergunta, virada, conclusão, exercício. Centralizado, sem rodapé |
| `tese` | texto (use `\n` e `**…**` na 2ª linha) | A frase-tese, alinhada à esquerda |
| `case-evidencia` | rotulo, titulo, imagem (caminho relativo ao projeto), texto, fonte | Caso com screenshot real e crédito |
| `stat` | rotulo, numeros [{valor, legenda}] (1 ou 2), texto, fonte | Números grandes. Só o 1º leva destaque |
| `contraste` | rotulo, lados [{rotulo, titulo, texto}] x2, fonte | Antes/depois, A x B. O 2º lado é o destaque |
| `secao` | numero, rotulo, nome, linha, destaque, fonte | Abertura de parte numerada de um framework |
| `afirmacao` | rotulo, texto | "O que muda", definição, aprendizado |
| `cards-grid` | rotulo, itens ["Título\|subtítulo"…] (2 a 6), destaque (índice) | Lista de práticas, controles, pilares |
| `fluxo` | rotulo, titulo, itens [..] (3 a 6), destaque, texto | Etapas ligadas por setas |
| `tabela` | rotulo, linhas [[cabeçalho…], [...]…], larguras (opcional) | Comparativos. Exceção à regra das 25 palavras |
| `item` | rotulo, numero, titulo, texto | Item de lista longa (técnica, passo) |
| `matriz-2x2` | rotulo, titulo, texto, quadrantes [{titulo, legenda, exemplo}] x4, destaque, eixo | Matrizes de decisão |
| `linha-do-tempo` | rotulo, titulo, itens [[ano, texto]…], foto (false para tirar), larguraAno (padrão 0.9) | Trajetória do autor, cronograma |
| `autoridade` | rotulo, numeros [{valor, legenda}] (até 6), destaque, fundo (false para tirar) | Credenciais. Usa `fotos.fundo`; sem fundo, 3 colunas |
| `investimento` | rotulo, titulo, opcoes [{nome, valor, inclui[]}], destaque, selo (padrão "Recomendado"), nota | Propostas comerciais |
| `escopo` | rotulo, titulo, incluido [], fora [], tituloIncluido, tituloFora | O que entra e o que fica fora |
| `cta-qr` | titulo, texto, url, urlVisivel, mostrarContato, contato (sobrepõe campos do brand) | Fechamento com QR e contato do brand. Campos vazios ou "PREENCHER" não aparecem |

## Carrossel (`carrossel.json`)
```json
{ "meta": { "brand": "…", "arquivo": "carrossel" }, "paginas": [ { "tipo": "capa", "rotulo": "…", "titulo": "…", "texto": "…" } ] }
```

**Tipos de página:**
- `capa`: rotulo, titulo, texto
- `dado`: rotulo, valor, texto, fonte (número com fonte)
- `item`: numero, rotulo, nome, texto (se o texto tiver `**destaque**`, o nome fica neutro)
- `lista`: rotulo, titulo, itens, destaque
- `matriz`: rotulo, titulo, quadrantes x4
- `pergunta`: rotulo, texto
- `cta`: nome, subtitulo, texto

## brand.json
- **Cores:** obrigatórias `bg`, `text` e `accent`. As outras (`surface`, `surface2`, `border`, `secondary`, `text2`, `muted`, `accentSoft`) são derivadas se faltarem.
- `fonte`, `rodape`.
- `logo`, `logoEmTodos` (true: logo também na capa, nas frases e no fechamento).
- `fotos` {retrato, redonda, fundo}.
- `contato` {site, whatsapp, email, linkedin, instagram}.
- `herda`: caminho de outro brand.json, do qual herda tudo que não for redefinido.

## Quando falta um layout
Escolha o mais próximo e adapte o conteúdo, sem forçar o visual. Se o mesmo layout faltar várias vezes, adicione-o em `motor/layouts.js` seguindo o padrão dos outros:
- recebe `(s, d, { B, h, dir })`;
- usa só as cores de `B.T`;
- recorta imagens com `cobrir()`.

Depois, documente o layout aqui e no exemplo.

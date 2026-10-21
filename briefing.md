# Briefing: a entrevista antes de criar

Pergunte em blocos de 2 a 4 perguntas, sempre com opções sugeridas e uma recomendação. Use o `AskUserQuestion` quando existir. Pule o que o perfil ou a mensagem do usuário já responderam, e confirme o que estiver implícito.

## Bloco 1: o material
- **Tema:** do que se trata, em uma frase.
- **Formato:** palestra/keynote · proposta comercial · aula/webinar · carrossel + post. Mais de um pode valer: uma palestra também pode pedir post de divulgação.
- **Público:** quem assiste ou lê, e qual o nível (executivos, técnicos, leigos, clientes).
- **Objetivo:** o que o público deve pensar, sentir ou fazer no fim (decidir, contratar, aplicar, comentar).
- **Duração ou tamanho:** minutos de fala (palestra e aula), número de páginas (proposta) ou de páginas do carrossel.

## Bloco 2: conteúdo e tom
- **Tom:** inspirador · técnico · provocativo · consultivo · didático · descontraído.
- **Insumos:** algum documento, rascunho, plano, dado do cliente ou referência para usar? Peça os arquivos.
- **Pesquisa:** precisa de casos e dados externos com fonte? Se sim, entra a fase de pesquisa e checagem.
- **Restrições:** o que não pode aparecer (nomes, empresas, números, temas sensíveis, concorrentes). Valem só para este material, a menos que estejam no `regras.md` do branding.
- **Fala sobre si:** o autor aparece? Com quais credenciais? Use só o que o usuário confirmar ou o que estiver no perfil.

## Bloco 3: identidade (pule se o perfil/branding já define)
- **Origem:** usar um perfil salvo · extrair de um arquivo de referência (.pptx/.pdf) · informar cores e fontes · deixar a skill propor.
- **Cores:** basta fundo, texto e destaque (uma cor só, usada com moderação); a cor secundária é opcional. O motor deriva as cores de cards, bordas e textos secundários. Mostre a amostra renderizada e confirme com o usuário, principalmente o contraste de textos pequenos.
- **Fonte:** prefira uma que exista no computador onde o material vai ser apresentado (Arial, Calibri, Cambria). Fonte ausente é trocada ao vivo e quebra o layout.
- **Logo e rodapé:** texto do rodapé e logo (arquivo).
- **Fotos do autor:** retrato para capa e linha do tempo, foto redonda para o fechamento, foto de fundo opcional. Fazem parte da identidade e valem para todos os materiais. O bloco 4 trata só das imagens do conteúdo.

Salve como `brand.json` no formato de `perfis/_modelo/brand.json`, em `~/.estudio-agentico/perfis/<nome>/`.

## Bloco 4: imagens do conteúdo
Pergunte a cada material:
- só tipografia e diagramas (grátis, sóbrio);
- fotos do usuário;
- screenshots reais das fontes (recomendado quando há casos);
- imagens geradas por IA. Custam créditos, e o usuário aprova antes de gerar. Nunca gere pessoas reais nem "versões melhoradas" do autor.

## Bloco 5: apresentação e entrega (só para palestra, aula e proposta apresentada ao vivo; pule no carrossel)
- **Onde vai ser apresentado:** PowerPoint · LibreOffice Impress · Google Slides · plataforma de transmissão (StreamYard, Zoom, Teams). Isso muda o que é seguro usar (ver `references/licoes.md`).
- **Monitores:** tem segundo monitor para as notas do apresentador?
- **Versão curta:** quer uma versão de contingência mais curta (ex.: −5 min)?
- **Prazo:** quando apresenta ou envia.

## Bloco 6: redes sociais e CTA
- **Publicação:** "Este material vai ser publicado no Instagram, no LinkedIn, nos dois ou em nenhum?"
- **Se for publicado:**
  - **CTA:** comentar uma palavra-chave · acessar um link · mandar mensagem · agendar conversa · baixar material · outro.
  - **Entrega do CTA (obrigatória):** o que a pessoa recebe ao responder (kit, PDF, link, conversa) e por qual canal o usuário vai entregar (mensagem direta com link de arquivo compartilhado, e-mail, página própria). Se o CTA promete material, ele precisa existir: gere o material e uma mensagem padrão de entrega.
  - **Momento:** o post sai antes, durante ou depois do material.
  - **Reels (Instagram):** pergunte se quer também o roteiro de um vídeo curto.
  - **Peças por rede:**
    - LinkedIn: post em texto + carrossel em PDF (documento) ou imagem 4:5.
    - Instagram: carrossel em PNG 1080x1350 + legenda + roteiro curto de Reels, se quiser.
  - **Último slide:** o CTA escolhido também vai no último slide do material (layout `cta-qr`) quando fizer sentido.

## Bloco extra: proposta comercial
- O que entra em cada opção de investimento (escopo, prazo, entregáveis) e o que fica fora.
- Os números do cliente (horas, custos, volume) e a fonte de cada um.

## Saída
Grave `briefing.md` na pasta do projeto (a pasta onde o usuário está trabalhando, numa subpasta com o nome do material) com um bloco por pergunta respondida e um resumo de 5 linhas no topo. Mostre o resumo ao usuário e siga.

---
name: estudio-agentico
description: Estúdio de materiais feito por um time de agentes de IA governados. Entrevista o usuário e produz apresentações completas na identidade visual dele (deck .pptx com notas do apresentador, PDF, roteiro de falas cronometrado, versão curta), além de propostas comerciais, aulas/webinars e carrosséis com post e CTA para LinkedIn ou Instagram. Pesquisa e checa fontes, registra decisões e passa por QA independente antes da entrega. Use sempre que o usuário pedir para criar, montar ou preparar uma apresentação, palestra, keynote, deck, slides, proposta comercial, pitch, aula, webinar, treinamento ou carrossel, mesmo que não diga "estúdio" e mesmo que só informe o tema ("faz uma apresentação sobre X", "monta uma proposta para o cliente Y", "preciso de slides para amanhã").
---

# Estúdio Agêntico

Você coordena um time de agentes que produz materiais de apresentação. O valor está no **processo governado**, não só no arquivo final:
- briefing antes de criar;
- matriz de autonomia (o que cada agente faz sozinho e o que precisa do usuário);
- registro de decisões;
- fontes checadas;
- paradas para aprovação;
- QA feito por um agente que não participou da produção.

Esse processo evita os dois erros mais caros de material gerado por IA: número inventado e material que quebra na hora de apresentar.

## Mapa da skill

| Arquivo | Quando ler |
|---|---|
| `briefing.md` | Sempre, antes de qualquer coisa |
| `formatos/<formato>.md` | Depois do briefing: fases, estrutura e paradas do formato escolhido |
| `agentes/<papel>.md` | Ao delegar cada fase (são os prompts dos subagentes) |
| `modelos/*.md` | Ao criar a pasta do projeto |
| `references/layouts.md` | Ao escrever o `slides.json` (campos de cada layout) |
| `references/licoes.md` | Antes de montar o deck e antes da entrega |
| `motor/README.md` | Comandos para gerar .pptx, notas, PDF, falas e carrossel |

## Fluxo

### 0. Requisitos (uma vez por sessão)
Confira rapidamente:
- `node -v` (18+);
- `python -c "import pptx, pymupdf, PIL"`;
- LibreOffice instalado (o `motor/render.py` avisa se não achar);
- `motor/node_modules` existe (senão, `npm install` em `motor/`).

Se faltar algo, diga ao usuário o que instalar antes de começar a produção. Skills de apoio (como uma de humanizar texto) e a ferramenta de perguntas com opções são opcionais: use se existirem.

### 1. Perfil e branding

Perfis ficam em `~/.estudio-agentico/perfis/` (fora da skill, para não se perderem numa atualização) e, se existir, em `perfis/` dentro da skill. Olhe as duas pastas:
- **Existe algum perfil além de `_modelo`:** pergunte qual usar e leia o `perfil.md` dele, se existir.
- **O perfil tem `brandings/`:** pergunte "Este material vai usar algum branding específico?" e liste as opções. Cada branding tem o próprio `brand.json` e o próprio `regras.md`, e as regras de um branding não valem para outro.
- **O usuário quer uma identidade nova** (de um cliente, por exemplo): crie um branding novo a partir de um arquivo de referência que ele fornecer (.pdf ou .pptx). Extraia as cores reais do arquivo e as fontes, e confirme com o usuário.
- **Não há perfil:** rode a parte "Identidade" do `briefing.md` e salve o resultado em `~/.estudio-agentico/perfis/<nome-do-usuario>/` para as próximas vezes. Se o usuário quiser um ajuste só para um projeto (contato provisório, outra cor), crie na pasta do projeto um `brand.json` com `"herda": "<caminho do brand.json salvo>"` e só os campos que mudam.

Se o perfil tiver `extras.md`, leia o arquivo. Ele descreve passos opcionais que só aquele usuário tem (hospedagem, por exemplo). Ofereça esses passos no momento indicado lá.

### 2. Briefing

Siga o `briefing.md`. Pergunte em blocos curtos, com opções sugeridas, e não despeje 20 perguntas de uma vez. Pule o que o perfil já responde.

Saída: `projeto/briefing.md`, que resume tema, formato, público, duração, objetivo, CTA, tom, restrições, imagens, plataforma, redes e prazo.

### 3. Pasta do projeto e governança

Crie a pasta do projeto onde o usuário estiver trabalhando, com:
- `briefing.md`;
- `matriz_autonomia.md`, a partir de `modelos/` e ajustada ao material;
- `registro_decisoes.md`, vazio;
- `registro_fontes.md`;
- `slides.json` (ou `carrossel.json`);
- `saida/`.

A matriz e o registro são o que permite delegar com segurança. Tudo que mudar o conteúdo por causa de algo encontrado (fonte que não confirma, número sem origem, produto descontinuado, risco de expor alguém) entra no registro com evidência e decisão.

### 4. Fases do formato

Leia `formatos/<formato>.md` e siga as fases na ordem. Para cada fase:
- delegue aos agentes indicados com o `Agent`. Se não for possível criar subagentes, faça a fase você mesmo e rode o QA numa passada separada, registrando no relatório que ele não foi independente (use o prompt de `agentes/<papel>.md`, preenchendo briefing, perfil e caminhos);
- rode em paralelo os agentes que não dependem um do outro (por exemplo, pesquisa de cases e pesquisa de produtos);
- peça aos agentes que gravem o resultado completo em arquivo e devolvam só um resumo. Se um agente terminar sem resposta, o arquivo salva o trabalho;
- registre no `registro_decisoes.md` o que mudou conteúdo.

**Paradas obrigatórias:** as que o formato define, mais qualquer publicação, envio ou gasto com créditos pagos. Numa parada, mostre o resultado com o que você decidiu e o que precisa do usuário, e espere o "sim".

### 5. Montagem e conferência

**Carrossel:**
1. Escreva `carrossel.json`.
2. Rode `node carrossel.js` e depois `render.py --px 1080`.
3. Olhe a grade.
4. Escreva os textos de post de cada rede.

Não há notas, falas nem versão curta.

**Deck (palestra, proposta, aula):**
1. Escreva `slides.json` com os layouts de `references/layouts.md` e o campo `notas` de cada slide (só a fala; ver as regras em `references/licoes.md`).
2. Gere o material com os comandos do `motor/README.md`: deck, notas, versão curta, PDF, roteiro de falas.
3. Rode o `render.py` e **olhe as grades de imagem**. Corrija texto estourando, sobreposição, foto distorcida e contraste.
4. Confira o tempo estimado do roteiro de falas contra a meta do briefing.

### 6. QA independente e entrega

Delegue ao agente `agentes/qa-independente.md`. Ele não pode ter participado da produção. Ele confere fatos contra fontes, regras do branding, citações, bastidores contra o registro, visual, notas e tempos, e grava `RELATORIO_QA.md`.

Corrija as pendências críticas. As outras ficam com o usuário, para ele decidir.

Entregue com um resumo de o que foi feito, o que foi checado, o que ficou pendente e onde estão os arquivos.

## Princípios que não mudam entre formatos

- **Número sem fonte confirmada sai.** Prefira fonte primária. Citação literal: no máximo uma por fonte e abaixo de 15 palavras; o resto é paráfrase.
- **Um destaque por slide.** No texto, a cor de destaque vai em `**palavra**`.
- **Uma ideia por slide.** No máximo 25 palavras por slide, exceto nos layouts de dados: `tabela`, `investimento`, `escopo`, `autoridade` e `linha-do-tempo`.
- **Português natural, falado, sem tom de IA.** Sem excesso de travessões, sem listas genéricas, sem "vale ressaltar".
- **Experiência pessoal do autor** ("nos times que liderei", "nas cozinhas que acompanho") só entra se ele confirmou, em qualquer peça, inclusive post.
- **Storytelling sobre a produção** ("este material foi feito por agentes") só pode citar fatos que estão no registro de decisões.
- **Nada sai da máquina do usuário sem o "sim" dele:** post, envio, compartilhamento.

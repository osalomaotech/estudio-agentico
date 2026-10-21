# Estúdio Agêntico

Uma skill para o Claude Code que transforma um tema numa apresentação completa, produzida por um time de agentes de IA governados.

Você responde a uma entrevista curta: tema, público, objetivo, tom, identidade visual, imagens, onde vai apresentar e se vai publicar em redes. Os agentes entregam:
- deck .pptx na sua identidade visual, com notas do apresentador (só a fala, com ênfase marcada);
- versão curta para contingência e PDF plano B;
- roteiro de falas cronometrado (PDF e Word);
- propostas comerciais, aulas e webinars;
- carrossel e post com o CTA que você escolher, no formato do LinkedIn ou do Instagram;
- relatório de QA feito por um agente que não participou da produção.

## Por que "governado"
Material gerado por IA costuma errar em dois pontos: número inventado e arquivo que quebra na hora de apresentar. A skill trata os dois com processo:
- **Matriz de autonomia:** define o que cada agente faz sozinho e o que precisa da sua aprovação.
- **Registro de fontes:** número sem fonte confirmada sai do material.
- **Registro de decisões:** tudo que mudou o conteúdo fica anotado, com evidência.
- **Paradas obrigatórias:** roteiro, identidade, rascunho e qualquer publicação passam pela sua aprovação.
- **QA independente** antes da entrega.

## Instalação
1. Copie esta pasta para `~/.claude/skills/estudio-agentico/`.
2. Instale as dependências:
   - Node 18+;
   - Python 3.10+ com `pip install python-pptx pymupdf pillow`;
   - LibreOffice (para PDF e imagens).
3. Rode `npm install` em `motor/`.
4. Teste com `node deck.js ../exemplos/catalogo-layouts` (dentro de `motor/`).

## Como usar
Peça ao Claude Code, por exemplo:
- "Cria uma palestra de 30 minutos sobre segurança de dados para gestores."
- "Monta uma proposta comercial para o cliente X."
- "Quero um carrossel sobre produtividade para o LinkedIn."

A skill começa pela entrevista. Na primeira vez, ela monta o seu perfil de marca (cores, fonte, rodapé, fotos) e salva em `perfis/<seu-nome>/`. Você pode ter mais de uma identidade (pessoal, empresa, cliente) em `perfis/<seu-nome>/brandings/`.

## Estrutura
- `SKILL.md`: orquestrador.
- `briefing.md`: a entrevista.
- `formatos/`: palestra, proposta, carrossel + post, webinar.
- `agentes/`: os 11 papéis (narrativa, pesquisa e checagem, evidências, diretor de arte, designer, imagem, motion, demo, compliance, coach, QA independente).
- `motor/`: gera .pptx, notas, PDF, falas e carrossel a partir de JSON (17 layouts). Tem um módulo opcional de animações em Remotion.
- `modelos/`: matriz de autonomia, registros e relatório de QA.
- `references/`: catálogo de layouts e lições aprendidas.
- `exemplos/`: catálogo visual de todos os layouts.

## Licença
MIT. Veja `LICENSE`.

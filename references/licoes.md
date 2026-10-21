# Lições: o que já quebrou e como evitar

Cada regra veio de um problema real em produção.

## Arquivo e apresentação
- **Imagens:** recorte na proporção exata antes de inserir. O LibreOffice Impress ignora o recorte interno do .pptx e estica a foto. O motor já faz isso com `cobrir()`; não insira fotos com `sizing` direto.
- **Vídeo embutido:** não embuta vídeo no .pptx se a apresentação for no LibreOffice Impress, porque o programa trava ao chegar no slide. Use slide estático com o quadro final e entregue o MP4 separado. No PowerPoint funciona, mas teste antes.
- **Fontes:** use fontes instaladas no computador de apresentação (Arial, Calibri, Cambria). Fonte ausente é trocada e o texto estoura.
- **Teste no app de verdade:** pergunte no briefing onde o material vai ser apresentado e peça ao usuário para testar no app de verdade antes do dia (notas, vídeo, troca de slides).
- **Notas no Impress:** aparecem em Exibir > Notas, ou no Console do apresentador. O console precisa estar ativado em Ferramentas > Opções > Impress > Geral e de dois monitores.
- **Transmissão:** recurso de "slides" de plataformas de transmissão costuma virar imagem estática, sem vídeo e sem áudio. Compartilhe a janela da apresentação. Áudio de vídeo normalmente só sai compartilhando uma aba do navegador com "compartilhar áudio".

## Notas do apresentador
- **Conteúdo:** só a fala. Instrução de motion, nota de produção e ID de fonte poluem e atrapalham ao vivo; vão para o roteiro.md.
- **Formato:**
  - um parágrafo por ideia, com linha em branco entre eles;
  - **negrito** só no que pede ênfase;
  - "(corta na versão curta)" no início do parágrafo cortável;
  - "(pausa)" sozinho na linha.
- **Arquivo à parte:** entregue também o roteiro de falas em PDF (`falas.py`). Muita gente prefere ler impresso ou num tablet.

## Conteúdo
- **Números:** número sem fonte confirmada sai. Números que circulam muito na internet costumam não ter origem primária.
- **Citações:** no máximo uma por fonte, abaixo de 15 palavras. Confirme a redação literal; frases "famosas" costumam ser paráfrases.
- **Credenciais do autor:** prêmios, cargos e números passam pela mesma checagem. Um prêmio pode ser da organização, não da pessoa.
- **Restrições de marca:** valem para o branding e o material escolhidos. O que é proibido numa palestra pode ser obrigatório numa proposta comercial.
- **Tempo verbal:** respeite o momento da publicação. Um post publicado antes do evento não pode dizer "hoje eu fiz".
- **Promessas:** não prometa em slide ou fala algo que ainda não existe (demo, link, post). O QA confere isso.
- **Bastidores:** o storytelling sobre a produção só cita o que está no registro de decisões.

## Processo
- **Agentes:** gravam o resultado em arquivo e devolvem só um resumo. Se um agente terminar sem resposta, o arquivo salva o trabalho.
- **Dependências externas:** confira login, chave de API e acesso antes de montar um pipeline que depende disso.
- **Ações externas:** nada sai sem "sim" explícito do usuário: publicar, enviar, colocar no ar, gastar crédito.
- **Processos de outros programas:** não encerre processos do LibreOffice que o usuário pode estar usando. Use timeout nas conversões em vez de matar processos.

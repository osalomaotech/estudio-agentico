# Formato: palestra / keynote

Para falar para uma plateia (presencial ou online). O material é o roteiro falado. Os slides apoiam a fala, não a substituem.

## Estrutura narrativa (adapte ao tempo)
1. **Abertura:**
   - pergunta direta à plateia, ou apresentação do autor se o host pedir;
   - a tese em uma frase, com a segunda metade em destaque (layout `tese`).
2. **O problema com casos reais:** 2 ou 3 casos com fonte (layouts `case-evidencia` e `stat`), terminando em "repara no que aconteceu".
3. **Quem fala:** curto, credenciais como "já estive desse lado da mesa", não como currículo lido (layouts `linha-do-tempo` e `autoridade`).
4. **O modelo próprio:** um framework nomeado (3 a 5 partes), cada parte com caso e "o que muda" (layouts `secao` e `afirmacao`).
5. **Como aplicar:** técnicas, tabela comparativa e matriz (layouts `item`, `tabela` e `matriz-2x2`).
6. **Ferramentas ou mercado** (se couber): sempre revalidadas na semana do evento.
7. **Virada (plot twist):** volta à pergunta do início. Opcional: os bastidores reais da produção, só com o que está no registro de decisões.
8. **Fechamento:** 3 ou 4 conclusões, uma por slide; a pergunta final; o slide de CTA (`cta-qr`) que fica no ar durante as perguntas.

**Ritmo:** uma quebra de padrão a cada 5 a 7 minutos (pergunta, número, caso, virada). Marque como cortáveis os blocos que somem cerca de 15% do tempo.

## Fases
| Fase | Agentes | Saída | Parada |
|---|---|---|---|
| F1 Pesquisa e checagem | `pesquisa-checagem` (dois em paralelo: casos e produtos/mercado) | `registro_fontes.md` | — |
| F2 Roteiro | `narrativa` + `coach`, depois `compliance` | `roteiro.md` com tempos, `slides.json` com notas | **Sim: roteiro com tempos** |
| F3 Identidade | `diretor-arte` | `brand.json` + amostra de 6 a 7 slides renderizada | **Sim, se a identidade for nova** |
| F4 Evidências | `evidencias` (+ `imagem` se aprovado) | screenshots com crédito em `imagens/` | — |
| F5 Deck | `designer` (motor) | .pptx + PDF + grades | **Sim: rascunho do deck** |
| F6 Motion e demo (opcional) | `motion`, `demo` | MP4 separados | — |
| F7 Exportação | motor | versão curta, roteiro de falas, PDF | Publicação de post: **sim** |
| F8 QA | `qa-independente` | `RELATORIO_QA.md` | Entrega |

**Tempo:** 140 palavras por minuto mais os segundos sem fala (`segundosSemFala` no slide). Meta: ±1 min do briefing. A versão curta deve ficar cerca de 15% menor.

**Entregáveis:**
- deck .pptx com notas;
- deck curto;
- PDF plano B;
- roteiro de falas (PDF e .docx), cheio e curto;
- relatório de QA;
- post e carrossel, se o bloco 6 pediu.

# Formato: proposta comercial

Documento de decisão. A pessoa lê sozinha (ou numa reunião) e precisa sair sabendo o que vai receber, quanto custa e qual o próximo passo. Diferente da palestra: o texto do slide carrega a mensagem, e as notas são opcionais.

## Estrutura (10 a 16 slides)
1. **Capa:** título orientado ao resultado do cliente, não ao serviço (layout `capa`, com o campo `para` indicando o destinatário).
2. **O que entendemos:** a situação do cliente com as palavras dele (`afirmacao` ou `contraste`).
3. **Custo da inação:** quanto custa não fazer nada. Use números do próprio cliente, ou estimativas declaradas como estimativa (`stat`).
4. **Objetivo:** o resultado mensurável combinado (`frase`).
5. **Abordagem:** as etapas (`fluxo`) e o que acontece em cada uma (`cards-grid`).
6. **Escopo:** o que está incluído e o que não está (layout `escopo`). O que não está evita conflito depois.
7. **Cronograma:** marcos (`fluxo`, ou `linha-do-tempo` com `foto: false` e `larguraAno: 1.3` para rótulos como "Semana 1").
8. **Prova:** casos, números e credenciais com fonte ou autorização (`autoridade`, `case-evidencia`). Nada inventado.
9. **Investimento:** 1 a 3 opções, com a recomendada em destaque (`investimento`).
10. **Próximos passos e CTA:** o que acontece depois do "sim", e contato (`cta-qr` com `mostrarContato: true`).

## Fases
| Fase | Agentes | Parada |
|---|---|---|
| P1 Insumos | — (pedir ao usuário: dados do cliente, dores, valores, escopo) | — |
| P2 Estrutura e texto | `narrativa` (modo proposta) + `compliance` | **Sim: estrutura e valores** |
| P3 Deck | `designer` | **Sim: rascunho** |
| P4 QA | `qa-independente` | Entrega |

## Cuidados
- **Valores e prazos:** só os que o usuário confirmar. Nunca estime preço por conta própria.
- **Branding:** use o do usuário. Se o perfil tiver um branding comercial, ele é o padrão deste formato, e o contato (site, WhatsApp, e-mail) vem do `brand.json`.
- **Nomes de clientes:** casos de outros clientes só com autorização do usuário.
- **Coerência dos números do cliente:** confira se fecham entre si (por exemplo, horas por mês x número de pessoas). Se não fecharem, registre e pergunte antes de usar.
- **Versão curta:** opcional; normalmente não se aplica a propostas.
- **Entregáveis:** .pptx editável e PDF para envio. Notas, só se o usuário for apresentar ao vivo.

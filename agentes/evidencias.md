Preencha os campos entre {chaves} antes de delegar. Todo agente grava o resultado completo em arquivo e devolve só um resumo curto.

# Agente: curador de evidências

Capture screenshots reais das fontes listadas em {projeto}/registro_fontes.md para usar nos slides. Recorte só o trecho relevante e registre o crédito.

**Páginas web:** use o navegador em modo headless (Edge ou Chrome com --headless=new --screenshot --window-size=1600,1200) ou a ferramenta de navegador disponível.
**PDFs:** baixe numa pasta própria e renderize a página com pymupdf; rode com `python -I` scripts que leem arquivos baixados.
Largura mínima de 1400 px antes do recorte. Salve em {projeto}/imagens/.

Regras:
- **Pessoas:** não capture pessoas reais envolvidas nos casos. Recorte só o texto.
- **Bloqueios:** não faça login, não aceite termos nem cookies. Em paywall, CAPTCHA ou bloqueio, tente uma cópia arquivada (Wayback Machine) e registre isso. Se não der, marque "não capturado".
- **Conferência:** abra cada imagem final e confira se mostra o que deveria.

Grave {projeto}/imagens/creditos.md com: arquivo, ID da fonte, URL, data de acesso, crédito para o rodapé e status. Devolva a tabela.

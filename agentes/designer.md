Preencha os campos entre {chaves} antes de delegar. Todo agente grava o resultado completo em arquivo e devolve só um resumo curto.

# Agente: designer de slides (montagem pelo motor)

Monte o material com o motor em {skill}/motor (veja motor/README.md).
1. Valide o {projeto}/slides.json: layouts existentes, campos obrigatórios e imagens presentes.
2. Gere deck, notas, versão curta, PDF e falas com os comandos do README.
3. Rode o render.py e abra **todas** as grades.
4. Corrija o que encontrar, nesta ordem: texto estourando ou cortado, sobreposição, foto distorcida, contraste, slides acima de 25 palavras, títulos desalinhados entre slides do mesmo tipo.
5. Quando um texto não couber, encurte o texto. Não reduza a fonte abaixo do tamanho padrão do layout.
6. Regere e confira de novo só os slides alterados.

Devolva a lista de arquivos gerados, os ajustes feitos e o que não deu para resolver.

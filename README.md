GRÁFICA RABBIT FINANCEIRO — PROJETO DESKTOP INICIAL
==================================================

O que este pacote é
------------------
Projeto inicial para empacotar a interface HTML atual como aplicativo de desktop
com Electron. Inclui configuração para gerar instalador Windows (NSIS) e imagem
DMG para macOS. Ainda é uma versão de desenvolvimento, não um instalador pronto.

IMPORTANTE SOBRE OS DADOS
------------------------
O app usa localStorage do Chromium/Electron. O armazenamento do app é separado
do armazenamento do Chrome/Safari; os dados não são transferidos automaticamente.
Antes de migrar:
1. Abra a versão atual no navegador.
2. Vá a Configurações e exporte um backup JSON.
3. Guarde uma cópia do arquivo JSON em local seguro.
4. Abra o app desktop e use Configurações > Importar backup para importar o JSON.
5. Confira contas, serviços, vendas, despesas e relatórios antes de continuar.

Não apague nem substitua a versão antiga até conferir a importação. Continue
fazendo backups regulares. Esta etapa inicial ainda não migra para SQLite e não
inclui login ou sincronização em nuvem. O fluxo de atualização automática está em configuração inicial e ainda precisa de testes reais.

REQUISITOS PARA COMPILAR
-----------------------
- Node.js LTS instalado.
- Conexão com a internet na primeira instalação das dependências.
- Para gerar instalador Windows, prefira compilar no Windows.
- Para gerar o DMG do macOS, compile em um Mac. A assinatura/notarização da Apple
  é uma etapa separada caso queira distribuir o app para outros usuários.

COMO EXECUTAR PARA TESTE
------------------------
1. Extraia a pasta deste ZIP.
2. Abra o Terminal/PowerShell dentro da pasta GraficaRabbitDesktop.
3. Execute:
     npm install
     npm start

GERAR INSTALADORES
------------------
No Windows:
     npm run build:win
O instalador será criado na pasta dist.

No macOS (Apple Silicon, normalmente M1/M2/M3/M4):
     npm run build:mac:arm64

No macOS Intel:
     npm run build:mac:x64

O arquivo gerado estará na pasta dist.

PRÓXIMAS ETAPAS RECOMENDADAS
----------------------------
1. Testar o app e confirmar a importação de backup.
2. Implementar armazenamento local mais robusto (por exemplo, SQLite) com migração
   testada e backup/restore antes de remover o localStorage.
3. Adicionar ícone oficial e finalizar a estratégia de versões.
4. Testar cada instalador e o ciclo de atualização no sistema operacional correspondente.
5. Avaliar senha/login local e proteção adicional conforme o uso pretendido.


ATUALIZAÇÕES AUTOMÁTICAS — CONFIGURAÇÃO INICIAL
-----------------------------------------------
Esta versão adiciona a base técnica do electron-updater e aponta as publicações para:
  GitHub: willolivers/grafica-rabbit-financeiro

Como funciona:
- O app empacotado verifica atualizações alguns segundos após abrir.
- Se houver uma versão nova publicada como GitHub Release, pergunta se deseja baixar.
- Após o download, pergunta se deseja reiniciar para instalar.
- Se escolher “Depois”, a atualização não será instalada automaticamente ao fechar o app.
- Falhas de download são registradas e apresentadas sem bloquear o uso normal.
- O código HTML e o localStorage não foram alterados por esta configuração.

IMPORTANTE — A CONFIGURAÇÃO AINDA NÃO ESTÁ PRONTA PARA DISTRIBUIÇÃO:
1. É necessário instalar dependências com `npm install`.
2. Cada publicação precisa ter um número de versão maior no package.json.
3. Para Windows, gerar o instalador NSIS e publicar os artefatos da versão no GitHub Releases.
4. Para macOS, o pacote inclui DMG e ZIP, mas atualização automática requer assinatura válida do aplicativo (Developer ID) e, para distribuir amplamente, normalmente notarização da Apple. Esta configuração não cria certificados nem assina o aplicativo.
5. Testar o ciclo completo com uma versão de teste antes de usar no dia a dia.

SEGURANÇA DOS DADOS:
- Não envie backups JSON, dados financeiros, tokens, senhas ou certificados/chaves privadas ao GitHub.
- O app continua usando localStorage do Electron, no perfil local do aplicativo. Não há sincronização em nuvem.
- Faça backup JSON antes de instalar qualquer nova versão.
- O atualizador baixa versões publicadas no repositório configurado; proteja a conta GitHub com autenticação em dois fatores e não publique releases que não tenham sido conferidas.

JARDIM DOS GATINHOS — PUSH COM NAVEGADOR FECHADO

IMPORTANTE: o HTML sozinho não consegue enviar notificações com o navegador fechado. O pacote inclui o Service Worker e a Cloud Function, mas precisa ser configurado e publicado no Firebase/hosting.

1) No Firebase Console do projeto jardim-gatos-teste, abra Project settings > Cloud Messaging > Web Push certificates e gere/veja a chave pública VAPID.
2) Abra gatinhos_conectados_notificacoes.html e substitua COLE_AQUI_SUA_CHAVE_PUBLICA_VAPID pela chave pública VAPID.
3) Publique o HTML e firebase-messaging-sw.js na mesma raiz de um site HTTPS (ou teste em localhost). O Service Worker precisa estar em /firebase-messaging-sw.js.
4) Na pasta functions, execute `npm install`.
5) Instale/execute Firebase CLI, entre na conta e selecione o projeto correto: `firebase login` e `firebase use jardim-gatos-teste`.
6) Publique a função: `firebase deploy --only functions:notifyNewLetter`. Se o CLI pedir para habilitar APIs ou faturamento, siga as instruções do Firebase; Cloud Functions pode exigir plano Blaze.
7) Abra o site publicado em cada dispositivo, selecione o papel correto (Gatinho 1 ou Gatinha 2) e clique em 🔔 Avisos. Permita notificações. Faça isso em ambos os dispositivos para habilitar o recebimento em cada um.
8) Teste enviando uma cartinha do outro papel. O navegador/sistema precisa permitir notificações e o dispositivo precisa estar conectado à internet.

OBSERVAÇÕES
- A função monitora o documento Firestore `artifacts/jardim-dos-gatos-casal/public/data/rooms/ninho_de_amor_fixo` e envia para o token do papel destinatário.
- O sistema atual guarda um token por papel. Se quiser receber em vários dispositivos simultaneamente por papel, a estrutura precisa ser alterada para armazenar vários tokens.
- Revise as regras de segurança do Firestore antes de produção. O app atual usa autenticação anônima e um documento compartilhado; a Cloud Function não substitui regras de acesso adequadas.
- O navegador pode limitar notificações por modo de economia de bateria, permissões do sistema ou políticas do dispositivo.

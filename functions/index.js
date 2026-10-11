const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();

// Dispara quando o documento compartilhado do casal muda.
exports.notifyNewLetter = onDocumentWritten(
  'artifacts/jardim-dos-gatos-casal/public/data/rooms/ninho_de_amor_fixo',
  async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!after || !Array.isArray(after.letters)) return;

    const previousIds = new Set((before?.letters || []).map((letter) => String(letter.id)));
    const newLetters = after.letters.filter((letter) => letter && letter.id != null && !previousIds.has(String(letter.id)));
    if (!newLetters.length) return;

    const tokens = after.pushTokens || {};
    const nicknames = after.nicknames || {};
    for (const letter of newLetters) {
      if (!['cat1', 'cat2'].includes(letter.from)) continue;
      const recipientRole = letter.from === 'cat1' ? 'cat2' : 'cat1';
      const token = tokens[recipientRole];
      if (!token) continue; // Destinatário ainda não ativou push neste dispositivo.

      const sender = nicknames[letter.from] || (letter.from === 'cat1' ? 'Gatinho 1' : 'Gatinha 2');
      const text = String(letter.text || 'Seu amor mandou uma cartinha!').slice(0, 160);
      try {
        await getMessaging().send({
          token,
          notification: {
            title: `💌 Nova cartinha de ${sender}`,
            body: text
          },
          data: { letterId: String(letter.id), senderRole: String(letter.from) },
          webpush: { fcmOptions: { link: '/' }, notification: { icon: '/favicon.ico', tag: `carta-${letter.id}`, renotify: true } }
        });
      } catch (error) {
        // Tokens expirados serão ignorados aqui; remover manualmente o token salvo se necessário.
        console.error('Falha ao enviar push:', error.code || error.message);
      }
    }
  }
);

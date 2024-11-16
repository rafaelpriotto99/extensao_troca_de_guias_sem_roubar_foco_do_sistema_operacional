// Função para ativar uma aba com índice dinâmico
function ativarAbaPorIndice(indice, sendResponse) {
  chrome.tabs.query({}, (tabs) => {
    if (tabs[indice]) {
      chrome.tabs.update(tabs[indice].id, { active: true }, () => {
        if (chrome.runtime.lastError) {
          sendResponse({ status: `Erro ao ativar a aba ${indice + 1}: ${chrome.runtime.lastError.message}` });
        } else {
          sendResponse({ status: `Aba ${indice + 1} ativada com sucesso` });
        }
      });
    } else {
      sendResponse({ status: `Aba ${indice + 1} não encontrada` });
    }
  });
}

// Listener para mensagens externas
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.action && request.action.startsWith("ativartab")) {
    const indiceStr = request.action.replace("ativartab", "");
    const indice = parseInt(indiceStr, 10) - 1; // Converte para índice baseado em 0

    if (!isNaN(indice) && indice >= 0) {
      ativarAbaPorIndice(indice, sendResponse);
    } else {
      sendResponse({ status: "Índice inválido" });
    }

    // Indica que a resposta será enviada de forma assíncrona
    return true;
  } else {
    sendResponse({ status: "Ação desconhecida" });
  }
});

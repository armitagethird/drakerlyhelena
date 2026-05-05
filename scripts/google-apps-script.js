// Google Apps Script — Cole este código em script.google.com
// Depois publique como Web App: Executar como "Eu" / Acesso "Qualquer pessoa"
// Cole a URL /exec gerada em LEAD_ENDPOINT no main.js

const SHEET_ID = "17r9T0ok1q_LWZp-QnwdFz4FH2AAKBSNRlqYiku20OCg";

// Índice das colunas (base 1)
const COL = {
  TIMESTAMP:   1,
  NOME:        2,
  WHATSAPP:    3,
  EMAIL:       4,
  IDADE:       5,
  FASE:        6,
  DIM_PRINC:   7,
  DIM_SEC:     8,
  SC_ENERGIA:  9,
  SC_DESCANSO: 10,
  SC_PRESENCA: 11,
  SC_VITALID:  12,
  ORIGEM:      13,
  AGENDOU_WA:  14,
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

    // Garante cabeçalho
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Nome", "WhatsApp", "E-mail", "Idade", "Fase de vida",
        "Dimensão principal", "Dimensão secundária",
        "Score ENERGIA", "Score DESCANSO", "Score PRESENÇA", "Score VITALIDADE",
        "Origem", "Clicou no botão WhatsApp"
      ]);
    }

    if (data.event === 'whatsapp_click') {
      const lastRow = sheet.getLastRow();
      if (lastRow >= 2) {
        const target = String(data.phone || "").replace(/\D/g, "");
        const phones = sheet.getRange(2, COL.WHATSAPP, lastRow - 1, 1).getValues();
        for (let i = phones.length - 1; i >= 0; i--) {
          const sheetPhone = String(phones[i][0]).replace(/\D/g, "");
          if (sheetPhone && sheetPhone === target) {
            sheet.getRange(i + 2, COL.AGENDOU_WA).setValue("Sim");
            break;
          }
        }
      }
    } else {
      // Novo lead: adiciona linha
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name || "",
        data.phone || "",
        data.email || "",
        data.age || "",
        data.phase || "",
        (data.topDimensions && data.topDimensions[0]) || "",
        (data.topDimensions && data.topDimensions[1]) || "",
        (data.scores && data.scores.ENERGIA) || 0,
        (data.scores && data.scores.DESCANSO) || 0,
        (data.scores && data.scores.PRESENCA) || 0,
        (data.scores && data.scores.VITALIDADE) || 0,
        data.page || "",
        "Não"
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

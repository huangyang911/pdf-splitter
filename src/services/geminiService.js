// src/services/geminiService.js

/**
 * Call Gemini API
 */
export async function callGemini(apiKey, messages, systemPrompt, pdfFile = null, maxTokens = "2048", pdfText = "", fileToBase64Fn) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const contents = [];
  const allMessages = messages.filter(m => m.role === "user" || m.role === "assistant");

  let firstUserSeen = false;
  for (const m of allMessages) {
    const role = m.role === "assistant" ? "model" : "user";
    const parts = [];

    if (role === "user") {
      const PDF_SIZE_LIMIT = 50 * 1024 * 1024;
      if (pdfFile && !firstUserSeen) {
        firstUserSeen = true;
        if (pdfText) {
          parts.push({ text: `【附帶的 PDF 文字內容 (部分擷取)】\n\n${pdfText}` });
        } else if (pdfFile.size <= PDF_SIZE_LIMIT && fileToBase64Fn) {
          try {
            const base64 = await fileToBase64Fn(pdfFile);
            parts.push({ inlineData: { mimeType: "application/pdf", data: base64 } });
          } catch (e) {
            console.warn("PDF base64 轉換失敗，將僅以文字對話:", e);
          }
        }
      }
      parts.push({ text: m.content });
    } else {
      parts.push({ text: m.content });
    }

    contents.push({ role, parts });
  }

  if (contents.length === 0 || contents[0].role !== "user") {
    contents.unshift({ role: "user", parts: [{ text: "開始" }] });
  }

  const body = {
    contents,
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: { 
      temperature: 0.2, 
      maxOutputTokens: parseInt(maxTokens) || 2048,
      responseMimeType: "text/plain" 
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

/**
 * System prompt construction
 */
export function buildSystemPrompt(fileName, totalPages) {
  return `你是一個 PDF 分割助理。使用者已上傳一份名為「${fileName}」共 ${totalPages} 頁的 PDF 檔案。

【重要】你會收到 PDF 檔案的文字大綱（包含自動識別的目錄區域）。請精確分析章節與標題階層。

你的工作是透過對話，理解使用者想如何分割這份 PDF，並在確定方案時產生計畫 JSON。

【對話規則】
- 用繁體中文回應
- 友善、簡潔
- 【嚴格要求】請務必正確區分「主章節」與「子節」。切勿將子節標題誤判為新的主章節開始。
- 當你確定分割方案時，在回應末尾加上一個 JSON 區塊：

\`\`\`split-plan
[
  {"name": "第一章_緒論", "pages": [1, 2, 3, 4, 5]},
  {"name": "第二章_文獻探討", "pages": [6, 7, 8, 9, 10]}
]
\`\`\`

【注意】
- name 避免空格，用底線代替
- pages 必須在 1 到 ${totalPages} 之間
- 若使用者說「每頁獨立」，產生每頁一個物件
- 確認計畫前先用自然語言描述讓使用者確認。`;
}

/**
 * Extract split plan JSON from text
 */
export function extractSplitPlan(text) {
  const match = text.match(/```split-plan\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch {
    return null;
  }
}

/**
 * Remove JSON block from assistant reply
 */
export function cleanText(text) {
  return text.replace(/```split-plan[\s\S]*?```/g, "").trim();
}

/**
 * Safe HTML formatting to prevent XSS
 */
export function safeFormatMsg(text) {
  if (!text) return "";
  
  // 1. 轉義基本 HTML 標籤
  let safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // 2. 還原安全的 Markdown 風格標記 (粗體與程式碼)
  safe = safe
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // 粗體
    .replace(/`([^`]+)`/g, "<code>$1</code>")      // 程式碼
    .replace(/\n/g, "<br/>");                      // 斷行

  return safe;
}

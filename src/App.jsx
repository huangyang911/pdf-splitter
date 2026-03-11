import { useState, useRef, useEffect, useCallback } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;600;700;800&family=Noto+Serif+TC:wght@400;700;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --mono: 'DM Mono', monospace;
  --sans: 'Syne', sans-serif;
  --serif: 'Noto Serif TC', serif;
}

/* Dark theme (default) */
[data-theme="dark"] {
  --bg: #0e0e12;
  --surface: #16161c;
  --surface2: #1e1e26;
  --border: #2a2a38;
  --accent: #7c6af7;
  --accent2: #f06292;
  --green: #4ade80;
  --text: #e8e8f0;
  --muted: #6b6b88;
  --drop-hover: #1a1730;
  --result-hover: #1a1730;
  --chip-hover: #1a1730;
  --user-bubble: linear-gradient(135deg, #2d2560, #3d2050);
  --user-bubble-border: #4a3a80;
  --selected-pill: #2d2560;
  --dl-btn: linear-gradient(135deg, #2d2560, #1a1730);
  --grid-line: transparent;
}

/* Light theme */
[data-theme="light"] {
  --bg: #f0ebe0;
  --surface: #faf6f0;
  --surface2: #e8e0d4;
  --border: #d0c8bc;
  --accent: #b5281c;
  --accent2: #c0392b;
  --green: #2d7a4f;
  --text: #1c1410;
  --muted: #8a7d70;
  --drop-hover: #f5e8e6;
  --result-hover: #f5e8e6;
  --chip-hover: #f5e8e6;
  --user-bubble: linear-gradient(135deg, #f5e8e6, #faeaea);
  --user-bubble-border: #d9a8a4;
  --selected-pill: #f5e8e6;
  --dl-btn: linear-gradient(135deg, #f5e8e6, #f0ebe0);
  --grid-line: rgba(180, 168, 155, 0.5);
}

/* System follows OS preference */
@media (prefers-color-scheme: dark) {
  [data-theme="system"] {
    --bg: #0e0e12;
    --surface: #16161c;
    --surface2: #1e1e26;
    --border: #2a2a38;
    --accent: #7c6af7;
    --accent2: #f06292;
    --green: #4ade80;
    --text: #e8e8f0;
    --muted: #6b6b88;
    --drop-hover: #1a1730;
    --result-hover: #1a1730;
    --chip-hover: #1a1730;
    --user-bubble: linear-gradient(135deg, #2d2560, #3d2050);
    --user-bubble-border: #4a3a80;
    --selected-pill: #2d2560;
    --dl-btn: linear-gradient(135deg, #2d2560, #1a1730);
    --grid-line: transparent;
  }
}
@media (prefers-color-scheme: light) {
  [data-theme="system"] {
    --bg: #f0ebe0;
    --surface: #faf6f0;
    --surface2: #e8e0d4;
    --border: #d0c8bc;
    --accent: #b5281c;
    --accent2: #c0392b;
    --green: #2d7a4f;
    --text: #1c1410;
    --muted: #8a7d70;
    --drop-hover: #f5e8e6;
    --result-hover: #f5e8e6;
    --chip-hover: #f5e8e6;
    --user-bubble: linear-gradient(135deg, #f5e8e6, #faeaea);
    --user-bubble-border: #d9a8a4;
    --selected-pill: #f5e8e6;
    --dl-btn: linear-gradient(135deg, #f5e8e6, #f0ebe0);
    --grid-line: rgba(180, 168, 155, 0.5);
  }
}

html, body { height: 100%; background: var(--bg); }

.app {
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-template-rows: 56px 1fr;
  height: 100vh;
  font-family: var(--mono);
  color: var(--text);
  background-color: var(--bg);
  background-image: linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 32px 32px;
  overflow: hidden;
}

/* ── Top Bar ── */
.topbar {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  gap: 16px;
}

.topbar-logo {
  font-family: var(--serif);
  font-weight: 900;
  font-size: 30px;
  letter-spacing: -0.5px;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.topbar-logo .dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

.topbar-sep { flex: 1; }

.api-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0 12px;
  height: 34px;
}

.api-input-wrap label {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 1px;
  white-space: nowrap;
}

.api-input-wrap input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-family: var(--mono);
  font-size: 12px;
  width: 200px;
}

.api-input-wrap input::placeholder { color: var(--muted); }

.status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--muted);
  flex-shrink: 0;
}
.status-dot.ok { background: var(--green); box-shadow: 0 0 6px var(--green); }
.status-dot.err { background: var(--accent2); box-shadow: 0 0 6px var(--accent2); }

/* ── Left Panel ── */
.left-panel {
  border-right: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-header span { color: var(--accent); }

/* Drop Zone */
.drop-zone {
  margin: 16px;
  border: 1.5px dashed var(--border);
  border-radius: 8px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  background: var(--bg);
}

.drop-zone:hover, .drop-zone.over {
  border-color: var(--accent);
  background: var(--drop-hover);
}

.drop-zone input {
  position: absolute; inset: 0;
  opacity: 0; cursor: pointer;
  width: 100%; height: 100%;
}

.drop-icon {
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.drop-text {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.6;
}

/* File card */
.file-card {
  margin: 0 16px 16px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
  position: relative;
}

.file-card-name {
  font-size: 12px;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.file-card-meta {
  font-size: 10px;
  color: var(--muted);
  display: flex;
  gap: 12px;
}

.file-card-meta .pages { color: var(--accent); }

.file-card-close {
  position: absolute;
  top: 8px; right: 10px;
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 14px;
  padding: 2px 4px;
  line-height: 1;
}

.file-card-close:hover { color: var(--accent2); }

/* Page preview strip */
.pages-strip {
  padding: 0 16px 12px;
  flex: 1;
  overflow-y: auto;
}

.pages-strip-title {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.page-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.page-pill {
  width: 32px; height: 32px;
  border-radius: 4px;
  background: var(--surface2);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--muted);
  transition: all 0.15s;
}

.page-pill.selected {
  background: var(--selected-pill);
  border-color: var(--accent);
  color: var(--accent);
}

/* Results */
.results-section {
  padding: 0 16px 16px;
  overflow-y: auto;
  max-height: 220px;
}

.results-title {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 2px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 5px;
  text-decoration: none;
  transition: all 0.15s;
  cursor: pointer;
}

.result-item:hover {
  border-color: var(--accent);
  background: var(--result-hover);
}

.result-item-icon { font-size: 14px; opacity: 0.6; }

.result-item-info { flex: 1; min-width: 0; }

.result-item-name {
  font-size: 11px;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-item-meta { font-size: 10px; color: var(--muted); }

.result-item-dl {
  font-size: 10px;
  color: var(--accent);
  padding: 3px 8px;
  border: 1px solid var(--accent);
  border-radius: 4px;
}

.dl-all-btn {
  width: 100%;
  background: var(--dl-btn);
  border: 1px solid var(--accent);
  color: var(--accent);
  font-family: var(--mono);
  font-size: 11px;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  letter-spacing: 1px;
  transition: all 0.2s;
  margin-top: 8px;
}

.dl-all-btn:hover { background: var(--selected-pill); box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 30%, transparent); }

/* ── Right Panel - Chat ── */
.chat-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-track { background: transparent; }
.chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.msg {
  display: flex;
  gap: 12px;
  max-width: 80%;
  animation: fadeUp 0.3s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.msg.user { align-self: flex-end; flex-direction: row-reverse; }
.msg.assistant { align-self: flex-start; }

.msg-avatar {
  width: 30px; height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
}

.msg.user .msg-avatar {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
}

.msg.assistant .msg-avatar {
  background: var(--surface2);
  border: 1px solid var(--border);
}

.msg-bubble {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.65;
}

.msg.user .msg-bubble {
  background: var(--user-bubble);
  border: 1px solid var(--user-bubble-border);
  color: var(--text);
}

.msg.assistant .msg-bubble {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
}

.msg-bubble code {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 1px 5px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--accent);
}

.msg-bubble pre {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 12px;
  margin-top: 8px;
  font-size: 11px;
  overflow-x: auto;
  color: var(--green);
  white-space: pre-wrap;
}

.msg-action-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 6px 14px;
  background: linear-gradient(135deg, var(--accent), #6050e0);
  border: none;
  border-radius: 5px;
  color: white;
  font-family: var(--mono);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;
}

.msg-action-btn:hover { opacity: 0.85; transform: translateY(-1px); }

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--muted);
  animation: bounce 1.2s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)}
}

/* Input area */
.chat-input-area {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.chat-input-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.chat-textarea {
  flex: 1;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--text);
  font-family: var(--mono);
  font-size: 13px;
  resize: none;
  outline: none;
  min-height: 42px;
  max-height: 120px;
  line-height: 1.5;
  transition: border-color 0.2s;
}

.chat-textarea:focus { border-color: var(--accent); }
.chat-textarea::placeholder { color: var(--muted); }

.send-btn {
  width: 42px; height: 42px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--accent), #6050e0);
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 16px #7c6af740; }
.send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.hint-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.hint-chip {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 11px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.hint-chip:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--chip-hover);
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0.4;
}

.empty-state .big-icon { font-size: 48px; }
.empty-state p { font-size: 12px; color: var(--muted); text-align: center; line-height: 1.8; }

/* scrollbar left */
.pages-strip::-webkit-scrollbar { width: 3px; }
/* scrollbar left */
.pages-strip::-webkit-scrollbar { width: 3px; }
.pages-strip::-webkit-scrollbar-thumb { background: var(--border); }
.results-section::-webkit-scrollbar { width: 3px; }
.results-section::-webkit-scrollbar-thumb { background: var(--border); }
.pages-strip-custom::-webkit-scrollbar { width: 3px; }
.pages-strip-custom::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }


/* ── Settings Modal ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.settings-modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 400px; max-width: 90vw;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

.settings-title {
  font-family: var(--sans);
  font-size: 16px; font-weight: 700;
  margin-bottom: 20px;
  display: flex; align-items: center; justify-content: space-between;
}

.settings-close {
  background: none; border: none; color: var(--muted); cursor: pointer; font-size: 18px;
}
.settings-close:hover { color: var(--accent2); }

.settings-field { margin-bottom: 16px; }
.settings-field label { display: block; font-size: 11px; color: var(--muted); margin-bottom: 6px; letter-spacing: 1px; }
.settings-input {
  width: 100%; background: var(--surface2); border: 1px solid var(--border);
  border-radius: 6px; padding: 10px 12px; color: var(--text); font-family: var(--mono); font-size: 13px; outline: none; transition: border-color 0.2s;
}
.settings-input:focus { border-color: var(--accent); }

.settings-actions {
  display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;
}

.btn {
  padding: 8px 16px; border-radius: 6px; font-family: var(--mono); font-size: 12px; cursor: pointer; transition: all 0.2s; border: none;
}
.btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
.btn-secondary:hover { background: #2a2a38; }
.btn-primary { background: linear-gradient(135deg, var(--accent), #6050e0); color: white; }
.btn-primary:hover { opacity: 0.9; }
.btn-danger { background: rgba(240, 98, 146, 0.1); color: var(--accent2); border: 1px solid rgba(240, 98, 146, 0.3); }
.btn-danger:hover { background: rgba(240, 98, 146, 0.2); }

/* ── Theme Switcher ── */
.theme-switcher {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 3px;
}

.theme-btn {
  width: 30px; height: 30px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  position: relative;
}

.theme-btn:hover {
  background: var(--border);
  color: var(--text);
}

.theme-btn.active {
  background: var(--accent);
  color: white;
  box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 50%, transparent);
}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function range(a, b) {
  const r = [];
  for (let i = a; i <= b; i++) r.push(i);
  return r;
}

// Build structured split plan from Gemini JSON response
function parseSplitPlan(json, totalPages) {
  // Accepts: [{name, pages: [1,2,3]}, ...]  OR  [{name, from, to}, ...]
  return json.map((item) => {
    let pages = item.pages;
    if (!pages && item.from && item.to) pages = range(item.from, item.to);
    if (!pages) return null;
    pages = pages.filter((p) => p >= 1 && p <= totalPages);
    return { name: item.name || `section`, pages };
  }).filter(Boolean);
}

async function doSplit(pdfLib, file, chunks) {
  const buf = await file.arrayBuffer();
  const srcDoc = await pdfLib.PDFDocument.load(buf);
  const results = [];
  for (const chunk of chunks) {
    const doc = await pdfLib.PDFDocument.create();
    const copied = await doc.copyPages(srcDoc, chunk.pages.map((p) => p - 1));
    copied.forEach((p) => doc.addPage(p));
    const bytes = await doc.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    results.push({
      name: chunk.name.endsWith(".pdf") ? chunk.name : chunk.name + ".pdf",
      pages: chunk.pages,
      size: (bytes.length / 1024).toFixed(1),
      url: URL.createObjectURL(blob),
    });
  }
  return results;
}

// File to base64 for Gemini inline PDF
async function fileToBase64(file) {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// Extract text using pdf.js to save tokens and handle large files
async function extractPdfText(file) {
  try {
    if (!window.pdfjsLib) return "";
    const buf = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
    const maxPages = Math.min(pdf.numPages, 500); // 支援大約 500 頁長度的文件
    let text = "";
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      let pageText = content.items.map(item => item.str).join(" ").trim();

      // 為了節省 Token，每頁只擷取前 100 字 (通常章節標題會在頁首)
      if (pageText.length > 100) {
        pageText = pageText.substring(0, 100) + "...";
      }

      text += `\n[第 ${i} 頁]\n${pageText}\n`;
    }
    if (pdf.numPages > maxPages) {
      text += `\n... (省略後續 ${pdf.numPages - maxPages} 頁內容) ...\n`;
    }
    // 整體字數上限 (以 500 頁每頁 100 字來說，最多也僅約 50000 字)
    return text.substring(0, 60000);
  } catch (e) {
    console.error("Text extraction failed:", e);
    return "";
  }
}

// ─── Gemini call ──────────────────────────────────────────────────────────────
async function callGemini(apiKey, messages, systemPrompt, pdfFile = null, maxTokens = "2048", pdfText = "") {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const contents = [];
  const allMessages = messages.filter(m => m.role === "user" || m.role === "assistant");

  let firstUserSeen = false;
  for (const m of allMessages) {
    const role = m.role === "assistant" ? "model" : "user";
    const parts = [];

    if (role === "user") {
      // 第一則 user 訊息：如果有純文字大綱就傳文字，否則才傳 base64 的 PDF (限制 50MB)
      const PDF_SIZE_LIMIT = 50 * 1024 * 1024;
      if (pdfFile && !firstUserSeen) {
        firstUserSeen = true;
        if (pdfText) {
          parts.push({ text: `【附帶的 PDF 文字內容 (部分)】\n\n${pdfText}` });
        } else if (pdfFile.size <= PDF_SIZE_LIMIT) {
          try {
            const base64 = await fileToBase64(pdfFile);
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

  // Gemini 要求第一則必須是 user
  if (contents.length === 0 || contents[0].role !== "user") {
    contents.unshift({ role: "user", parts: [{ text: "開始" }] });
  }

  const body = {
    contents,
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: { temperature: 0.2, maxOutputTokens: parseInt(maxTokens) || 2048 },
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

// ─── System prompt ────────────────────────────────────────────────────────────
function buildSystemPrompt(fileName, totalPages) {
  return `你是一個 PDF 分割助理。使用者已上傳一份名為「${fileName}」共 ${totalPages} 頁的 PDF 檔案。

【重要】你會收到 PDF 檔案的內容（如果有提供純文字大綱，請以此純文字為準，這樣能省去分析龐大檔案的資源）。請藉此分析其結構（章節、標題、目錄、版面等）。

你的工作是透過對話，理解使用者想如何分割這份 PDF，然後產生分割計畫。

【對話規則】
- 用繁體中文回應
- 友善、簡潔地與使用者對話
- 當使用者說「依章節分割」「按架構分割」「依目錄分割」等，請直接分析 PDF 內容，仔細辨識章節與標題階層的邊界。
- 【嚴格要求】請務必正確區分「主章節」（如：第一章、第1章、Chapter 1等）與「子節」（如：1.1、7.2.7 等次要標題）。切勿將子節標題誤判為新的主章節開始，更不可將不同數字的章節混淆（例如分割第9章時誤判跑到7.x節）。請根據內文的編號邏輯與上下文準確判斷起始頁碼，產出分割計畫。
- 若使用者說「每頁獨立」「前半後半」等規則，依其指示處理
- 當你確定分割方案時，在回應末尾加上一個 JSON 區塊，格式如下：

\`\`\`split-plan
[
  {"name": "第一章_緒論", "pages": [1, 2, 3, 4, 5]},
  {"name": "第二章_文獻探討", "pages": [6, 7, 8, 9, 10, 11, 12]}
]
\`\`\`

【注意】
- name 用於輸出檔名，避免空格，用底線代替
- pages 必須在 1 到 ${totalPages} 之間
- 若使用者說「每頁獨立」，產生每頁一個物件
- 若使用者說「前半後半」，按頁數平均分
- 若使用者沒有附帶 JSON，就繼續對話詢問細節
- 確認分割方案前先用自然語言描述計畫讓使用者確認`;
}

// Parse assistant reply to extract split plan
function extractSplitPlan(text) {
  const match = text.match(/```split-plan\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch {
    return null;
  }
}

function cleanText(text) {
  return text.replace(/```split-plan[\s\S]*?```/g, "").trim();
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const HINTS = [
  "依章節/架構分割",
  "每頁獨立輸出",
  "前半、後半各一份",
  "每 3 頁一組",
  "奇數頁 / 偶數頁",
  "第 1-5 頁一份，其餘一份",
];

const WELCOME = {
  role: "assistant",
  content: "👋 你好！請先上傳一份 PDF 檔案，然後告訴我你想怎麼分割它。\n\n例如：「每頁獨立」、「前三頁一份、後面全部一份」、「奇偶頁分開」⋯⋯ 我會幫你搞定！",
  id: "welcome",
};

const LS_KEY = "gemini_pdf_splitter_apikey";
const LS_TOKEN_KEY = "gemini_pdf_splitter_maxtokens";
const LS_HISTORY_KEY = "gemini_pdf_splitter_history";

const LS_THEME_KEY = "gemini_pdf_splitter_theme";

export default function App() {
  const [apiKey, setApiKey] = useState(() => {
    try { return localStorage.getItem(LS_KEY) || ""; } catch { return ""; }
  });
  const [maxTokens, setMaxTokens] = useState(() => {
    try { return localStorage.getItem(LS_TOKEN_KEY) || "2048"; } catch { return "2048"; }
  });
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(LS_THEME_KEY) || "light"; } catch { return "light"; }
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(LS_THEME_KEY, theme); } catch { }
  }, [theme]);
  const [tempApiKey, setTempApiKey] = useState("");
  const [tempMaxTokens, setTempMaxTokens] = useState("2048");

  const [apiStatus, setApiStatus] = useState("idle"); // idle | ok | err
  const [keySaved, setKeySaved] = useState(() => {
    try { return !!localStorage.getItem(LS_KEY); } catch { return false; }
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [pdfLib, setPdfLib] = useState(null);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch { }
    return [WELCOME];
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [dragging, setDragging] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(messages));
    } catch { }
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Load pdf-lib
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
    s.onload = () => setPdfLib(window.PDFLib);
    document.head.appendChild(s);
  }, []);

  const saveKey = (key) => {
    try {
      if (key) { localStorage.setItem(LS_KEY, key); setKeySaved(true); }
      else { localStorage.removeItem(LS_KEY); setKeySaved(false); }
    } catch { }
  };

  const clearKey = () => {
    setApiKey("");
    setApiStatus("idle");
    setKeySaved(false);
    try { localStorage.removeItem(LS_KEY); } catch { }
  };

  const openSettings = () => {
    setTempApiKey(apiKey);
    setTempMaxTokens(maxTokens);
    setShowSettings(true);
  };

  const saveSettings = async () => {
    setApiKey(tempApiKey);
    setMaxTokens(tempMaxTokens);
    saveKey(tempApiKey);
    try { localStorage.setItem(LS_TOKEN_KEY, tempMaxTokens); } catch { }

    if (tempApiKey) {
      setApiStatus("idle");
      try {
        await callGemini(tempApiKey, [{ role: "user", content: "hi" }], "Reply OK", null, tempMaxTokens);
        setApiStatus("ok");
        setKeySaved(true);
      } catch {
        setApiStatus("err");
        setKeySaved(false);
      }
    } else {
      setApiStatus("idle");
    }
    setShowSettings(false);
  };

  const handleFile = async (file) => {
    if (!file?.name.endsWith(".pdf")) return;
    setPdfFile(file);
    setResults([]);
    setSelectedPages([]);

    if (!pdfLib) {
      await new Promise((res) => {
        const t = setInterval(() => { if (window.PDFLib) { setPdfLib(window.PDFLib); clearInterval(t); res(); } }, 100);
      });
    }
    const lib = window.PDFLib || pdfLib;
    const buf = await file.arrayBuffer();
    const doc = await lib.PDFDocument.load(buf);
    const n = doc.getPageCount();
    setPageCount(n);

    setMessages([
      WELCOME,
      {
        role: "assistant",
        content: `✅ 已載入 **${file.name}**，共 **${n} 頁**。${file.size > 50 * 1024 * 1024 ? "\n\n⚠️ 檔案超過 50MB，無法傳送給 AI 分析結構，僅能依頁碼規則分割。" : ""}\n\n你想怎麼分割？可以說：\n- 「**依章節/架構分割**」— 我會分析 PDF 內容辨識章節\n- 「每頁獨立」「每5頁一組」\n- 「第1-10頁一份，其餘一份」\n- 或描述你的需求`,
        id: Date.now().toString(),
      },
    ]);
  };

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || typing) return;
    if (!apiKey) { alert("請先輸入 Gemini API Key"); return; }
    if (!pdfFile) { alert("請先上傳 PDF 檔案"); return; }

    const userMsg = { role: "user", content: text, id: Date.now().toString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setTyping(true);

    try {
      const sysPrompt = buildSystemPrompt(pdfFile.name, pageCount);
      let extractedText = "";
      if (window.pdfjsLib) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: "*(正在從 PDF 擷取純文字內容...)*",
          id: Date.now().toString() + "extracting",
        }]);
        extractedText = await extractPdfText(pdfFile);
        setMessages((prev) => prev.filter(m => !m.id.endsWith("extracting")));
      }

      const reply = await callGemini(apiKey, newMessages.filter(m => m.id !== "welcome"), sysPrompt, pdfFile, maxTokens, extractedText);

      const plan = extractSplitPlan(reply);
      const displayText = cleanText(reply);

      const assistantMsg = {
        role: "assistant",
        content: displayText,
        plan,
        id: Date.now().toString() + "a",
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (plan) {
        const chunks = parseSplitPlan(plan, pageCount);
        const allPages = [...new Set(chunks.flatMap((c) => c.pages))].sort((a, b) => a - b);
        setSelectedPages(allPages);
      }
    } catch (e) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `❌ 發生錯誤：${e.message}`,
        id: Date.now().toString() + "e",
      }]);
    }
    setTyping(false);
  }, [messages, apiKey, pdfFile, pageCount, typing]);

  const executeSplit = async (msgId, plan) => {
    if (!pdfLib || !pdfFile) return;
    const chunks = parseSplitPlan(plan, pageCount);
    const lib = window.PDFLib || pdfLib;
    const res = await doSplit(lib, pdfFile, chunks);
    setResults(res);

    setMessages((prev) => prev.map(m => m.id === msgId ? { ...m, splitDone: true, finalPlan: plan } : m));

    setMessages((prev) => [...prev, {
      role: "assistant",
      content: `🎉 分割完成！共產生 **${res.length}** 個檔案，請在左側下載。`,
      id: Date.now().toString() + "done",
    }]);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatMsg = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-logo">
            <div className="dot" />
            智慧分割PDF
          </div>
          <span style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1 }}>
            × GEMINI 2.5
          </span>
          <div className="topbar-sep" />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="theme-switcher">
              <button
                className={`theme-btn ${theme === "system" ? "active" : ""}`}
                onClick={() => setTheme("system")}
                title="系統預設"
              >
                ○
              </button>
              <button
                className={`theme-btn ${theme === "light" ? "active" : ""}`}
                onClick={() => setTheme("light")}
                title="亮色"
              >
                ✳
              </button>
              <button
                className={`theme-btn ${theme === "dark" ? "active" : ""}`}
                onClick={() => setTheme("dark")}
                title="暗色"
              >
                ☽
              </button>
            </div>
            <div className={`status-dot ${apiStatus}`} title={apiStatus === "ok" ? "已連線" : apiStatus === "err" ? "連線失敗" : "未驗證"} />
            <button onClick={openSettings} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
              ⚙️ 設定
            </button>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="settings-modal" onClick={e => e.stopPropagation()}>
              <div className="settings-title">
                設定 (Settings)
                <button className="settings-close" onClick={() => setShowSettings(false)}>✕</button>
              </div>
              <div className="settings-field">
                <label>Gemini API 金鑰 (API Key)</label>
                <input
                  type="password"
                  className="settings-input"
                  value={tempApiKey}
                  onChange={e => setTempApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                />
              </div>
              <div className="settings-field">
                <label>最大生成 Token 數量 (Max Output Tokens)</label>
                <input
                  type="number"
                  className="settings-input"
                  value={tempMaxTokens}
                  onChange={e => setTempMaxTokens(e.target.value)}
                  placeholder="2048"
                />
              </div>
              <div className="settings-actions">
                <button className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={() => {
                  setTempApiKey(""); setTempMaxTokens("2048"); clearKey();
                  try { localStorage.removeItem(LS_TOKEN_KEY); } catch { }
                }}>
                  清除設定
                </button>
                <button className="btn btn-secondary" onClick={() => setShowSettings(false)}>取消</button>
                <button className="btn btn-primary" onClick={saveSettings}>儲存並測試</button>
              </div>
            </div>
          </div>
        )}

        {/* Left Panel */}
        <div className="left-panel">
          <div className="panel-header">
            PDF 檔案 <span>{pageCount ? `${pageCount} PAGES` : "—"}</span>
          </div>

          {!pdfFile ? (
            <div
              className={`drop-zone${dragging ? " over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            >
              <input type="file" accept=".pdf" onChange={(e) => handleFile(e.target.files[0])} />
              <div className="drop-icon">📄</div>
              <div className="drop-text">拖放 PDF 至此<br />或點擊選擇檔案</div>
            </div>
          ) : (
            <div className="file-card" style={{ margin: "12px 16px 8px" }}>
              <div className="file-card-name">{pdfFile.name}</div>
              <div className="file-card-meta">
                <span>{(pdfFile.size / 1024).toFixed(0)} KB</span>
                <span className="pages">{pageCount} 頁</span>
              </div>
              <button className="file-card-close" onClick={() => {
                setPdfFile(null); setPageCount(null);
                setResults([]); setSelectedPages([]);
                setMessages([WELCOME]);
              }}>✕</button>
            </div>
          )}

          {pageCount && (
            <div className="pages-strip" style={{ flex: selectedPages.length ? "0 0 auto" : 1, maxHeight: 160 }}>
              <div className="pages-strip-title">PAGE MAP</div>
              <div className="page-pills">
                {Array.from({ length: pageCount }, (_, i) => (
                  <div key={i} className={`page-pill${selectedPages.includes(i + 1) ? " selected" : ""}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="results-section" style={{ flex: 1 }}>
              <div className="results-title">
                輸出檔案
                <span style={{ color: "var(--accent)" }}>{results.length} FILES</span>
              </div>
              {results.map((r, i) => (
                <a key={i} className="result-item" href={r.url} download={r.name}>
                  <span className="result-item-icon">📑</span>
                  <div className="result-item-info">
                    <div className="result-item-name">{r.name}</div>
                    <div className="result-item-meta">頁 {r.pages[0]}–{r.pages[r.pages.length - 1]} · {r.size} KB</div>
                  </div>
                  <span className="result-item-dl">↓</span>
                </a>
              ))}
              <button className="dl-all-btn" onClick={() => {
                results.forEach((r, i) => setTimeout(() => {
                  const a = document.createElement("a");
                  a.href = r.url; a.download = r.name; a.click();
                }, i * 200));
              }}>↓ 全部下載</button>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div className="chat-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1 }}>CHAT HISTORY</span>
            <button
              onClick={() => { if (confirm("確定要清除所有對話紀錄嗎？")) setMessages([WELCOME]); }}
              style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 11, cursor: "pointer" }}
            >
              🗑️ 清除紀錄
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((m) => (
              <div key={m.id} className={`msg ${m.role}`}>
                <div className="msg-avatar">
                  {m.role === "user" ? "你" : "✦"}
                </div>
                <div className="msg-bubble">
                  <span dangerouslySetInnerHTML={{ __html: formatMsg(m.content) }} />
                  {m.plan && !m.splitDone && (
                    <div style={{ marginTop: 12 }}>
                      <pre>{JSON.stringify(m.plan, null, 2)}</pre>
                      <button
                        className="msg-action-btn"
                        onClick={() => executeSplit(m.id, m.plan)}
                      >
                        ▶ 執行分割
                      </button>
                    </div>
                  )}
                  {m.plan && m.splitDone && (
                    <div style={{ marginTop: 12, padding: 8, background: 'var(--surface2)', borderRadius: 6, border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 10, color: 'var(--green)', marginBottom: 4 }}>✓ 已執行分割設定</div>
                      <pre style={{ margin: 0 }}>{JSON.stringify(m.finalPlan || m.plan, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="msg assistant">
                <div className="msg-avatar">✦</div>
                <div className="msg-bubble">
                  <div className="typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-area">
            {!pdfFile && (
              <div className="hint-chips">
                <span style={{ fontSize: 11, color: "var(--muted)", alignSelf: "center", marginRight: 4 }}>快速提示：</span>
                {HINTS.map((h) => (
                  <button key={h} className="hint-chip" onClick={() => setInput(h)}>{h}</button>
                ))}
              </div>
            )}
            {pdfFile && messages.length <= 2 && (
              <div className="hint-chips">
                {HINTS.map((h) => (
                  <button key={h} className="hint-chip" onClick={() => sendMessage(h)}>{h}</button>
                ))}
              </div>
            )}
            <div className="chat-input-row">
              <textarea
                ref={textareaRef}
                className="chat-textarea"
                placeholder={pdfFile ? "告訴我怎麼分割這份 PDF..." : "請先上傳 PDF 檔案..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                disabled={!pdfFile || typing}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || typing || !pdfFile}
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, useRef, useEffect, useCallback } from "react";
import * as pdfService from "./services/pdfService";
import * as geminiService from "./services/geminiService";

import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import SettingsModal from "./components/SettingsModal";

const KEY_NAME = "GEMINI_API_KEY";
const LS_TOKEN_KEY = "MAX_OUTPUT_TOKENS";

const WELCOME = {
  role: "assistant",
  content: "你好！我是 PDF 分割助理。請上傳 PDF 檔案，我會幫你分析章節並產出分割計畫。例如：你可以說「幫我依章節分割並命名」。",
  id: "welcome",
};

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(KEY_NAME) || "");
  const [maxTokens, setMaxTokens] = useState(() => localStorage.getItem(LS_TOKEN_KEY) || "2048");
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [tempMaxTokens, setTempMaxTokens] = useState(maxTokens);
  const [apiStatus, setApiStatus] = useState("idle");

  const [pdfLib, setPdfLib] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (window.PDFLib) setPdfLib(window.PDFLib);
    if (apiKey) setApiStatus("ok");
  }, [apiKey]);

  const saveSettings = async () => {
    setApiKey(tempApiKey);
    setMaxTokens(tempMaxTokens);
    localStorage.setItem(KEY_NAME, tempApiKey);
    localStorage.setItem(LS_TOKEN_KEY, tempMaxTokens);

    if (tempApiKey) {
      setApiStatus("idle");
      try {
        await geminiService.callGemini(tempApiKey, [{ role: "user", content: "hi" }], "Reply OK", null, tempMaxTokens);
        setApiStatus("ok");
      } catch {
        setApiStatus("err");
      }
    }
    setShowSettings(false);
  };

  const clearSettings = () => {
    setTempApiKey("");
    setTempMaxTokens("2048");
    setApiKey("");
    setMaxTokens("2048");
    localStorage.removeItem(KEY_NAME);
    localStorage.removeItem(LS_TOKEN_KEY);
    setApiStatus("idle");
  };

  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") return;
    setPdfFile(file);
    setResults([]);
    setSelectedPages([]);
    setMessages([WELCOME]);
    
    if (window.pdfjsLib) {
      const buf = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
      setPageCount(pdf.numPages);
    }
  };

  const resetApp = () => {
    setPdfFile(null);
    setPageCount(null);
    setResults([]);
    setSelectedPages([]);
    setMessages([WELCOME]);
  };

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || !apiKey || typing || !pdfFile) return;

    const userMsg = { role: "user", content: text, id: Date.now().toString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setTyping(true);

    try {
      const sysPrompt = geminiService.buildSystemPrompt(pdfFile.name, pageCount);
      let extractedText = "";
      
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "*(正在從 PDF 擷取大綱與結構...)*",
        id: "extracting",
      }]);
      
      extractedText = await pdfService.extractPdfText(pdfFile);
      setMessages((prev) => prev.filter(m => m.id !== "extracting"));

      const reply = await geminiService.callGemini(apiKey, newMessages.filter(m => m.id !== "welcome"), sysPrompt, pdfFile, maxTokens, extractedText, pdfService.fileToBase64);

      const plan = geminiService.extractSplitPlan(reply);
      const displayText = geminiService.cleanText(reply);

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: displayText,
        plan,
        id: Date.now().toString() + "a",
      }]);

      if (plan) {
        const chunks = pdfService.parseSplitPlan(plan, pageCount);
        setSelectedPages([...new Set(chunks.flatMap(c => c.pages))].sort((a, b) => a - b));
      }
    } catch (e) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `❌ 發生錯誤：${e.message}`,
        id: "err-" + Date.now(),
      }]);
    }
    setTyping(false);
  }, [messages, apiKey, pdfFile, pageCount, typing, maxTokens]);

  const onExecuteSplit = async (msgId, plan) => {
    if (!pdfLib || !pdfFile) return;
    try {
      const chunks = pdfService.parseSplitPlan(plan, pageCount);
      const res = await pdfService.doSplit(pdfLib, pdfFile, chunks);
      setResults(res);
      setMessages((prev) => prev.map(m => m.id === msgId ? { ...m, splitDone: true } : m));
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `🎉 分割完成！共產生 **${res.length}** 個檔案，請在左側下載。`,
        id: "done-" + Date.now(),
      }]);
    } catch (e) {
      alert("分割失敗: " + e.message);
    }
  };

  return (
    <div className="app">
      <TopBar 
        theme={theme} 
        setTheme={setTheme} 
        apiStatus={apiStatus} 
        openSettings={() => { setTempApiKey(apiKey); setTempMaxTokens(maxTokens); setShowSettings(true); }} 
      />
      
      <SettingsModal 
        show={showSettings}
        onClose={() => setShowSettings(false)}
        tempApiKey={tempApiKey}
        setTempApiKey={setTempApiKey}
        tempMaxTokens={tempMaxTokens}
        setTempMaxTokens={setTempMaxTokens}
        onSave={saveSettings}
        onClear={clearSettings}
      />

      <Sidebar 
        pdfFile={pdfFile}
        handleFile={handleFile}
        pageCount={pageCount}
        selectedPages={selectedPages}
        results={results}
        resetApp={resetApp}
      />

      <ChatPanel 
        messages={messages}
        typing={typing}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        handleKey={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
        onExecuteSplit={onExecuteSplit}
        clearHistory={() => setMessages([WELCOME])}
      />
    </div>
  );
}

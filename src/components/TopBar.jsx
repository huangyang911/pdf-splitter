// src/components/TopBar.jsx
import React from 'react';

const TopBar = ({ theme, setTheme, apiStatus, openSettings, provider, model }) => {
  return (
    <div className="topbar">
      <div className="topbar-logo">
        <div className="dot" />
        智慧分割PDF
      </div>
      <span style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1, textTransform: 'uppercase' }}>
        × {provider === 'gemini' ? 'Gemini' : 'Generic LLM'} {model ? `(${model})` : ''}
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
        <div 
          className={`status-dot ${apiStatus}`} 
          title={apiStatus === "ok" ? "已連線" : apiStatus === "err" ? "連線失敗" : "未驗證"} 
        />
        <button 
          onClick={openSettings} 
          style={{ 
            background: "var(--surface2)", 
            border: "1px solid var(--border)", 
            color: "var(--text)", 
            padding: "6px 12px", 
            borderRadius: 6, 
            cursor: "pointer", 
            fontFamily: "var(--mono)", 
            fontSize: 11, 
            display: "flex", 
            alignItems: "center", 
            gap: 6 
          }}
        >
          ⚙️ 設定
        </button>
      </div>
    </div>
  );
};

export default TopBar;

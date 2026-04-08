// src/components/ChatPanel.jsx
import React from 'react';
import MessageItem from './MessageItem';

const HINTS = [
  "依章節/架構分割",
  "每頁獨立輸出",
  "前半、後半各一份",
  "每 3 頁一組",
  "奇數頁 / 偶數頁",
];

const ChatPanel = ({ 
  messages, 
  typing, 
  input, 
  setInput, 
  sendMessage, 
  handleKey, 
  onExecuteSplit,
  clearHistory
}) => {
  return (
    <div className="chat-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1 }}>CHAT HISTORY</span>
        <button
          onClick={() => { if (confirm("確定要清除所有對話紀錄嗎？")) clearHistory(); }}
          style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 11, cursor: "pointer" }}
        >
          🗑️ 清除紀錄
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((m) => (
          <MessageItem key={m.id} message={m} onExecuteSplit={onExecuteSplit} />
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
      </div>

      <div className="chat-input-area">
        <div className="hint-chips">
          {HINTS.map((h) => (
            <div key={h} className="hint-chip" onClick={() => sendMessage(h)}>
              {h}
            </div>
          ))}
        </div>
        <div className="chat-input-row">
          <textarea
            className="chat-textarea"
            placeholder="輸入指令，例如：依章節分割..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || typing}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;

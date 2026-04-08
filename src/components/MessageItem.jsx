// src/components/MessageItem.jsx
import React from 'react';
import * as llmService from '../services/llmService';

const MessageItem = ({ message, onExecuteSplit }) => {
  return (
    <div className={`msg ${message.role}`}>
      <div className="msg-avatar">
        {message.role === "user" ? "你" : "✦"}
      </div>
      <div className="msg-bubble">
        <span dangerouslySetInnerHTML={{ __html: llmService.safeFormatMsg(message.content) }} />
        {message.plan && !message.splitDone && (
          <div style={{ marginTop: 12 }}>
            <pre>{JSON.stringify(message.plan, null, 2)}</pre>
            <button
              className="msg-action-btn"
              onClick={() => onExecuteSplit(message.id, message.plan)}
            >
              🚀 執行此分割計畫
            </button>
          </div>
        )}
        {message.plan && message.splitDone && (
          <div style={{ marginTop: 8, fontSize: 11, color: "var(--green)", opacity: 0.8 }}>
            ✓ 已執行分割
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;

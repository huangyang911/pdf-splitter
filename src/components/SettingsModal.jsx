// src/components/SettingsModal.jsx
import React from 'react';

const SettingsModal = ({ 
  show, 
  onClose, 
  tempApiKey, 
  setTempApiKey, 
  tempMaxTokens, 
  setTempMaxTokens, 
  onSave, 
  onClear 
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-title">
          設定 (Settings)
          <button className="settings-close" onClick={onClose}>✕</button>
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
          <button 
            className="btn btn-danger" 
            style={{ marginRight: 'auto' }} 
            onClick={onClear}
          >
            清除設定
          </button>
          <button className="btn btn-secondary" onClick={onClose}>取消</button>
          <button className="btn btn-primary" onClick={onSave}>儲存並測試</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

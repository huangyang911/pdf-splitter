// src/components/SettingsModal.jsx
import React, { useState, useEffect } from 'react';
import * as llmService from '../services/llmService';

const SettingsModal = ({ 
  show, 
  onClose, 
  tempApiKey, 
  setTempApiKey, 
  tempMaxTokens, 
  setTempMaxTokens, 
  tempProvider,
  setTempProvider,
  tempApiBase,
  setTempApiBase,
  tempModel,
  setTempModel,
  onSave, 
  onClear 
}) => {
  const [models, setModels] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (show) {
      setModels([]); // 清空舊資料，避免 provider 與 models 對應錯誤
      if (tempApiKey) {
        handleFetchModels();
      }
    }
  }, [show, tempProvider]);

  const handleFetchModels = async () => {
    if (!tempApiKey) return;
    setFetching(true);
    try {
      const list = await llmService.fetchModels(tempProvider, tempApiKey, tempApiBase);
      setModels(list);
      if (list.length === 0 && tempApiKey) {
        console.warn('Fetched models list is empty');
      }
    } catch (e) {
      let msg = e.message;
      if (msg === 'Failed to fetch' && window.location.protocol === 'https:') {
        msg = '連線被瀏覽器攔截 (HTTPS 網頁無法存取 HTTP API)。\n\n請點擊網址列左側鎖頭 -> 「網站設定」 -> 將「不安全內容」改為「允許」，然後重新整理網頁。';
      }
      alert(`讀取失敗: ${msg}`);
    } finally {
      setFetching(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-title">
          設定 (Settings)
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-field">
          <label>供應商 (Provider)</label>
          <select 
            className="settings-input" 
            value={tempProvider} 
            onChange={e => setTempProvider(e.target.value)}
          >
            <option value="gemini">Google Gemini</option>
            <option value="llm">通用 LLM (OpenAI 相容)</option>
          </select>
        </div>

        {tempProvider === 'llm' && (
          <div className="settings-field">
            <label>API Base URL</label>
            <input
              type="text"
              className="settings-input"
              value={tempApiBase}
              onChange={e => setTempApiBase(e.target.value)}
              placeholder="https://api.openai.com/v1"
            />
          </div>
        )}

        <div className="settings-field">
          <label>API 金鑰 (API Key)</label>
          <input
            type="password"
            className="settings-input"
            value={tempApiKey}
            onChange={e => setTempApiKey(e.target.value)}
            placeholder={tempProvider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
          />
        </div>

        <div className="settings-field">
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            模型 ID (Model ID)
            <button 
              className="btn-text" 
              onClick={handleFetchModels} 
              disabled={fetching || !tempApiKey}
            >
              {fetching ? '讀取中...' : '重新讀取'}
            </button>
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              list="model-list"
              className="settings-input"
              value={tempModel}
              onChange={e => setTempModel(e.target.value)}
              placeholder={tempProvider === 'gemini' ? 'gemini-2.0-flash' : 'gpt-4o'}
            />
            <datalist id="model-list">
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </datalist>
          </div>
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

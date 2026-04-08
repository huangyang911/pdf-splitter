// src/components/Sidebar.jsx
import React, { useState } from 'react';

const Sidebar = ({ 
  pdfFile, 
  handleFile, 
  pageCount, 
  selectedPages, 
  results, 
  resetApp 
}) => {
  const [dragging, setDragging] = useState(false);

  return (
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
          <button className="file-card-close" onClick={resetApp}>✕</button>
        </div>
      )}

      {pageCount > 0 && (
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
  );
};

export default Sidebar;

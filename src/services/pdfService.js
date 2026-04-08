// src/services/pdfService.js

/**
 * Helper to generate page range array
 */
export function range(a, b) {
  const r = [];
  for (let i = a; i <= b; i++) r.push(i);
  return r;
}

/**
 * Build structured split plan from Gemini JSON response
 */
export function parseSplitPlan(json, totalPages) {
  if (!Array.isArray(json)) return [];
  
  return json.map((item) => {
    let pages = item.pages;
    
    // 如果 pages 是字串 (例如 "1-10" 或 "1,2,3")，將其轉換為陣列
    if (typeof pages === 'string') {
      if (pages.includes('-')) {
        const [start, end] = pages.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          pages = range(start, end);
        }
      } else if (pages.includes(',')) {
        pages = pages.split(',').map(Number).filter(n => !isNaN(n));
      } else {
        const n = Number(pages);
        if (!isNaN(n)) pages = [n];
      }
    }

    if (!pages && item.from && item.to) pages = range(item.from, item.to);
    if (!Array.isArray(pages)) return null;
    
    pages = pages.filter((p) => p >= 1 && p <= totalPages);
    return { name: item.name || `section`, pages };
  }).filter(Boolean);
}

/**
 * Perform PDF splitting using pdf-lib
 */
export async function doSplit(pdfLib, file, chunks) {
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

/**
 * Optimized file to base64 using FileReader
 */
export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Extract text with dynamic density adjustment (TOC detection)
 */
export async function extractPdfText(file) {
  try {
    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsLib) return "";
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    
    // 限制處理前 500 頁
    const maxPages = Math.min(pdf.numPages, 500);
    let extractedText = "";
    let totalTokensEstimate = 0;
    const GLOBAL_LIMIT = 200000; // 總字數上限
    for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const fullPageText = content.items.map(item => item.str).join(" ").trim();

        // 判定是否為目錄頁或結構密集頁面 (TOC detection)
        const isToc = /目錄|目次|Contents|CHAPTER|第.*[章節]|Index/i.test(fullPageText) || 
                      (fullPageText.split(/\.{3,}/).length > 3); // 偵測點點點 (....)

        const limit = isToc ? 3000 : 500; // 目錄頁抓更多，正文頁抓標題即可
        let pageText = fullPageText.substring(0, limit);
        
        if (fullPageText.length > limit) {
          pageText += "...";
        }

        const formattedPage = `\n[第 ${i} 頁${isToc ? " - 可能為目錄" : ""}]\n${pageText}\n`;
        
        if (extractedText.length + formattedPage.length > GLOBAL_LIMIT) {
          extractedText += `\n... (達到字數上限，省略後續內容) ...\n`;
          break;
        }
        
        extractedText += formattedPage;
    }

    return extractedText;
  } catch (e) {
    console.error("Text extraction failed:", e);
    return "";
  }
}

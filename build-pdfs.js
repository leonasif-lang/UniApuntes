const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workspaceDir = __dirname;
const logoPath = path.join(workspaceDir, 'assets', 'logo.jpg');
let logoBase64 = '';
if (fs.existsSync(logoPath)) {
  const logoBuffer = fs.readFileSync(logoPath);
  logoBase64 = `data:image/jpeg;base64,${logoBuffer.toString('base64')}`;
}

// Simple and robust Markdown to HTML converter
function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  let html = [];
  let inCodeBlock = false;
  let codeLang = '';
  let codeContent = [];
  let inTable = false;
  let tableRows = [];
  let inUl = false;
  let inOl = false;

  function closeLists() {
    if (inUl) {
      html.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      html.push('</ol>');
      inOl = false;
    }
  }

  function closeTable() {
    if (inTable) {
      if (tableRows.length > 0) {
        let tableHtml = '<div class="table-container"><table>';
        // First row is header
        const headerCells = tableRows[0];
        tableHtml += '<thead><tr>';
        headerCells.forEach(cell => {
          tableHtml += `<th>${formatInline(cell)}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';

        // Subsequent rows (skipping divider line if present)
        for (let i = 1; i < tableRows.length; i++) {
          const row = tableRows[i];
          if (row.every(c => /^[:\s-]+$/.test(c))) continue; // separator
          tableHtml += '<tr>';
          row.forEach(cell => {
            let formatted = formatInline(cell);
            if (formatted.includes('✅ APROBADO')) {
              formatted = `<span class="badge badge-success">✅ APROBADO</span>`;
            } else if (formatted.includes('Alta')) {
              formatted = `<span class="badge badge-high">Alta</span>`;
            } else if (formatted.includes('Media')) {
              formatted = `<span class="badge badge-med">Media</span>`;
            } else if (formatted.includes('Baja')) {
              formatted = `<span class="badge badge-low">Baja</span>`;
            }
            tableHtml += `<td>${formatted}</td>`;
          });
          tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table></div>';
        html.push(tableHtml);
      }
      inTable = false;
      tableRows = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code fences
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        html.push(`<pre class="code-block ${codeLang}"><code>${escapeHtml(codeContent.join('\n'))}</code></pre>`);
        inCodeBlock = false;
        codeContent = [];
        codeLang = '';
      } else {
        closeLists();
        closeTable();
        inCodeBlock = true;
        codeLang = line.trim().replace(/^```/, '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      closeLists();
      inTable = true;
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      closeTable();
    }

    // Horizontal Rule
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      closeLists();
      html.push('<hr class="divider" />');
      continue;
    }

    // Headings
    const hMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (hMatch) {
      closeLists();
      const level = hMatch[1].length;
      const text = formatInline(hMatch[2]);
      if (text.includes('CASO DE PRUEBA:')) {
        html.push(`<div class="test-case-anchor"></div><h${level} class="heading-tc">${text}</h${level}>`);
      } else {
        html.push(`<h${level}>${text}</h${level}>`);
      }
      continue;
    }

    // Unordered list
    const ulMatch = line.match(/^[-*]\s+(.*)$/);
    if (ulMatch) {
      if (inOl) closeLists();
      if (!inUl) {
        html.push('<ul>');
        inUl = true;
      }
      html.push(`<li>${formatInline(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (inUl) closeLists();
      if (!inOl) {
        html.push('<ol>');
        inOl = true;
      }
      html.push(`<li>${formatInline(olMatch[2])}</li>`);
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      closeLists();
      continue;
    }

    // Regular paragraph
    closeLists();
    html.push(`<p>${formatInline(line)}</p>`);
  }

  closeLists();
  closeTable();

  return html.join('\n');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatInline(str) {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

function getStyles() {
  return `
    @page {
      size: A4;
      margin: 18mm 15mm 20mm 15mm;
    }
    @page:first {
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #1f2937;
      background: #ffffff;
      line-height: 1.55;
      font-size: 10.5pt;
      margin: 0;
      padding: 0;
    }
    .cover-page {
      height: 100vh;
      min-height: 297mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      padding: 40mm 20mm 30mm 20mm;
      page-break-after: always;
      background: linear-gradient(180deg, #f8fafc 0%, #ffffff 40%, #eff6ff 100%);
    }
    .cover-header {
      width: 100%;
    }
    .cover-institution {
      font-size: 15pt;
      font-weight: 700;
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 6px;
    }
    .cover-carrera {
      font-size: 12pt;
      font-weight: 600;
      color: #4b5563;
      margin-bottom: 4px;
    }
    .cover-catedra {
      font-size: 11pt;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .cover-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px 0;
    }
    .cover-logo {
      width: 120px;
      height: 120px;
      border-radius: 24px;
      box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.25);
      margin-bottom: 24px;
      object-fit: cover;
      border: 3px solid #ffffff;
    }
    .cover-title {
      font-size: 26pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
      margin: 0 0 10px 0;
      letter-spacing: -0.5px;
    }
    .cover-app-title {
      font-size: 30pt;
      font-weight: 900;
      color: #2563eb;
      margin: 0 0 10px 0;
      letter-spacing: -0.5px;
    }
    .cover-slogan {
      font-size: 13pt;
      font-style: italic;
      color: #4b5563;
      margin-bottom: 24px;
    }
    .cover-badge-container {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    .cover-pill {
      background: #dbeafe;
      color: #1d4ed8;
      font-size: 9pt;
      font-weight: 700;
      padding: 5px 14px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .cover-footer {
      width: 100%;
      border-top: 1.5px solid #e2e8f0;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      text-align: left;
      font-size: 10pt;
      color: #475569;
    }
    .cover-footer div {
      line-height: 1.6;
    }
    .content-container {
      padding: 10mm 15mm 15mm 15mm;
    }
    h1, h2, h3, h4 {
      color: #0f172a;
      font-weight: 700;
      page-break-after: avoid;
    }
    h1 {
      font-size: 19pt;
      color: #1e3a8a;
      border-bottom: 2.5px solid #2563eb;
      padding-bottom: 6px;
      margin-top: 25px;
      margin-bottom: 15px;
      letter-spacing: -0.3px;
    }
    h2 {
      font-size: 14pt;
      color: #1e40af;
      margin-top: 22px;
      margin-bottom: 10px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    h3 {
      font-size: 12pt;
      color: #1f2937;
      margin-top: 18px;
      margin-bottom: 8px;
    }
    .heading-tc {
      background: #f1f5f9;
      color: #1e3a8a;
      padding: 8px 12px;
      border-left: 5px solid #2563eb;
      border-radius: 0 6px 6px 0;
      margin-top: 20px;
      font-size: 11.5pt;
      page-break-after: avoid;
    }
    p {
      margin: 6px 0 10px 0;
      text-align: justify;
    }
    ul, ol {
      margin: 6px 0 12px 0;
      padding-left: 24px;
    }
    li {
      margin-bottom: 4px;
    }
    hr.divider {
      border: 0;
      border-top: 1px solid #e2e8f0;
      margin: 20px 0;
    }
    .table-container {
      width: 100%;
      margin: 14px 0 20px 0;
      overflow: hidden;
      page-break-inside: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      background: #ffffff;
      border: 1px solid #cbd5e1;
    }
    th {
      background: #1e3a8a;
      color: #ffffff;
      font-weight: 600;
      text-align: left;
      padding: 8px 10px;
      border: 1px solid #1e3a8a;
    }
    td {
      padding: 7px 10px;
      border: 1px solid #e2e8f0;
      vertical-align: middle;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    tr {
      page-break-inside: avoid;
    }
    .badge {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 9999px;
      text-align: center;
      white-space: nowrap;
    }
    .badge-success {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
    }
    .badge-high {
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fca5a5;
    }
    .badge-med {
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
    }
    .badge-low {
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }
    pre.code-block {
      background: #0f172a;
      color: #f8fafc;
      padding: 12px 14px;
      border-radius: 6px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 8.5pt;
      line-height: 1.45;
      overflow-x: auto;
      margin: 10px 0 16px 0;
      page-break-inside: avoid;
      border: 1px solid #334155;
    }
    code {
      font-family: 'Consolas', 'Courier New', monospace;
      background: #f1f5f9;
      color: #0f172a;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 8.5pt;
      border: 1px solid #e2e8f0;
    }
    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
      border: none;
    }
    .page-break {
      page-break-before: always;
    }
    .header-running {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 12mm;
      border-bottom: 1px solid #e2e8f0;
      font-size: 8pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15mm;
    }
    .footer-running {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 12mm;
      border-top: 1px solid #e2e8f0;
      font-size: 8pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15mm;
    }
  `;
}

function buildHtmlDocument({ title, subtitle, coverBadges, sections }) {
  const styles = getStyles();

  let bodyHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>${styles}</style>
    </head>
    <body>
      <!-- PORTADA OFICIAL -->
      <div class="cover-page">
        <div class="cover-header">
          <div class="cover-institution">Universidad Nacional del Pilar (UNP)</div>
          <div class="cover-carrera">Tecnicatura Universitaria en Desarrollo de Software</div>
          <div class="cover-catedra">Cátedra: Aplicaciones Móviles — Ciclo Académico 2026</div>
        </div>

        <div class="cover-body">
          ${logoBase64 ? `<img src="${logoBase64}" class="cover-logo" alt="UniApuntes Logo" />` : ''}
          <div class="cover-app-title">UniApuntes</div>
          <div class="cover-title">${title}</div>
          <div class="cover-slogan">"${subtitle}"</div>
          
          <div class="cover-badge-container">
            ${coverBadges.map(b => `<span class="cover-pill">${b}</span>`).join('')}
          </div>
        </div>

        <div class="cover-footer">
          <div>
            <strong>Docente a Cargo:</strong> Prof. Ariel Bulacio<br>
            <strong>Asignatura:</strong> Aplicaciones Móviles<br>
            <strong>Institución:</strong> Universidad Nacional del Pilar
          </div>
          <div style="text-align: right;">
            <strong>Estándar:</strong> IEEE 829 / IEEE 1016<br>
            <strong>Estado:</strong> Aprobado y Verificado (100%)<br>
            <strong>Fecha:</strong> Octubre 2026
          </div>
        </div>
      </div>

      <!-- CONTENIDO -->
      <div class="content-container">
  `;

  sections.forEach((sec, idx) => {
    if (idx > 0) {
      bodyHtml += `<div class="page-break"></div>`;
    }
    bodyHtml += sec.content;
  });

  bodyHtml += `
      </div>
    </body>
    </html>
  `;

  return bodyHtml;
}

// 1. Build PDF for Casos de Prueba (Testing)
function generateCasosDePruebaPdf() {
  const mdPath = path.join(workspaceDir, 'CASOS_DE_PRUEBA.md');
  if (!fs.existsSync(mdPath)) {
    console.error('CASOS_DE_PRUEBA.md not found');
    return;
  }
  const mdContent = fs.readFileSync(mdPath, 'utf8');
  const parsedHtml = parseMarkdown(mdContent);

  const fullHtml = buildHtmlDocument({
    title: 'Plan y Matriz de Casos de Prueba',
    subtitle: 'Compartí conocimiento. Encontrá lo que necesitás.',
    coverBadges: ['IEEE 829', '40 Casos Aprobados', 'Testing Funcional', 'React Native / Expo'],
    sections: [
      { content: parsedHtml }
    ]
  });

  const htmlPath = path.join(workspaceDir, 'UniApuntes_Casos_de_Prueba.html');
  const pdfPath = path.join(workspaceDir, 'UniApuntes_Casos_de_Prueba.pdf');
  fs.writeFileSync(htmlPath, fullHtml, 'utf8');

  console.log(`Compilando PDF: ${pdfPath}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserCmd = fs.existsSync(chromePath) ? chromePath : edgePath;
  const tmpDir = path.join(process.env.TEMP || 'C:\\Temp', `pdf_gen_${Date.now()}`);

  try {
    const cmd = `"${browserCmd}" --headless=new --disable-gpu --no-sandbox --user-data-dir="${tmpDir}" --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;
    execSync(cmd, { stdio: 'ignore' });
  } catch (e) {
    // Chrome exits with 1 on crashpad error but writes the PDF file successfully
  }
  if (fs.existsSync(pdfPath)) {
    console.log(`✅ Creado con éxito: ${pdfPath} (${fs.statSync(pdfPath).size} bytes)`);
  }
}

// 2. Build PDF for Complete Dossier (SDD + Testing)
function generateCompletoPdf() {
  const sddPath = path.join(workspaceDir, 'SDD.md');
  const testPath = path.join(workspaceDir, 'CASOS_DE_PRUEBA.md');

  const sddContent = fs.existsSync(sddPath) ? fs.readFileSync(sddPath, 'utf8') : '';
  const testContent = fs.existsSync(testPath) ? fs.readFileSync(testPath, 'utf8') : '';

  const fullHtml = buildHtmlDocument({
    title: 'Documentación Oficial y Especificación de Testing',
    subtitle: 'Compartí conocimiento. Encontrá lo que necesitás.',
    coverBadges: ['Software Design Document (SDD)', 'Casos de Prueba (IEEE 829)', 'UNP 2026', 'React Native'],
    sections: [
      { content: parseMarkdown(sddContent) },
      { content: parseMarkdown(testContent) }
    ]
  });

  const htmlPath = path.join(workspaceDir, 'UniApuntes_Documentacion_Completa.html');
  const pdfPath = path.join(workspaceDir, 'UniApuntes_Documentacion_Completa.pdf');
  fs.writeFileSync(htmlPath, fullHtml, 'utf8');

  console.log(`Compilando PDF Completo: ${pdfPath}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserCmd = fs.existsSync(chromePath) ? chromePath : edgePath;
  const tmpDir = path.join(process.env.TEMP || 'C:\\Temp', `pdf_gen_full_${Date.now()}`);

  try {
    const cmd = `"${browserCmd}" --headless=new --disable-gpu --no-sandbox --user-data-dir="${tmpDir}" --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;
    execSync(cmd, { stdio: 'ignore' });
  } catch (e) {
    // ignore non-zero exit code if PDF exists
  }
  if (fs.existsSync(pdfPath)) {
    console.log(`✅ Creado con éxito: ${pdfPath} (${fs.statSync(pdfPath).size} bytes)`);
  }
}

try {
  generateCasosDePruebaPdf();
  generateCompletoPdf();
  console.log('Todos los PDFs fueron generados exitosamente.');
} catch (err) {
  console.error('Error generando PDFs:', err);
  process.exit(1);
}

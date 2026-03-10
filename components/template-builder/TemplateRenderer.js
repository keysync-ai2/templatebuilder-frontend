'use client';

export function renderTemplateToHTML(template) {
  if (!template || !template.data || !template.data.body) {
    return '<div>No template data</div>';
  }

  const renderColumn = (column) => {
    const style = column.Style || {};
    const padding = style.padding || { top: 10, bottom: 10, left: 10, right: 10 };
    const margin = style.margin || { top: 0, bottom: 0, left: 0, right: 0 };

    const cellStyle = `
      padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;
      margin: ${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px;
      background-color: ${style.backgroundColor || '#ffffff'};
      font-family: ${style.fontFamily || 'Arial, sans-serif'};
      font-size: ${style.fontSize || 16}px;
      color: ${style.color || '#000000'};
      text-align: ${style.textAlign || 'left'};
      ${style.fontWeight ? `font-weight: ${style.fontWeight};` : ''}
      ${style.border ? `border: ${style.border.width}px ${style.border.style} ${style.border.color};` : ''}
    `.trim();

    let content = '';

    switch (column.Type) {
      case 'Text':
        content = column.Text || '';
        break;
      case 'Image':
        content = `<img src="${column.Image || 'https://via.placeholder.com/150'}" alt="${column.Name || 'Image'}" style="width: 100%; height: auto;" />`;
        break;
      case 'Button':
        const buttonStyle = `
          display: inline-block;
          padding: 10px 20px;
          background-color: ${style.backgroundColor || '#000000'};
          color: ${style.color || '#ffffff'};
          text-decoration: none;
          border-radius: 4px;
          font-family: ${style.fontFamily || 'Arial, sans-serif'};
          font-size: ${style.fontSize || 16}px;
          font-weight: ${style.fontWeight || 600};
        `.trim();
        content = `<a href="${column.URL || '#'}" style="${buttonStyle}">${column.Text || 'Button'}</a>`;
        break;
      default:
        content = 'Unknown component';
    }

    return `
      <td style="${cellStyle}">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="${cellStyle}">
              ${content}
            </td>
          </tr>
        </table>
      </td>
    `;
  };

  const renderRow = (row) => {
    const rowStyle = row.Style || {};
    const padding = rowStyle.padding || { top: 10, bottom: 10, left: 10, right: 10 };

    const rowStyleString = `
      padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;
    `.trim();

    const columns = row.Columns || [];
    const columnsHTML = columns.map(renderColumn).join('');

    return `
      <table width="100%" cellspacing="0" cellpadding="0" style="${rowStyleString}">
        <tr>
          ${columnsHTML}
        </tr>
      </table>
    `;
  };

  const rows = template.data.body || [];
  const rowsHTML = rows.map(renderRow).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.name || 'Email Template'}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e0e0e0;">
          <tr>
            <td>
              ${rowsHTML}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export default function TemplateRenderer({ template }) {
  const html = renderTemplateToHTML(template);

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-100">HTML Preview</h3>
        <button
          onClick={() => {
            navigator.clipboard.writeText(html);
            alert('HTML copied to clipboard!');
          }}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
        >
          Copy HTML
        </button>
      </div>
      <pre className="bg-gray-950 text-gray-300 p-4 rounded overflow-x-auto text-xs max-h-96">
        <code>{html}</code>
      </pre>
    </div>
  );
}

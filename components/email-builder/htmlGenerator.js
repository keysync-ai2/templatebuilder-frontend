import { COMPONENT_TYPES } from './componentLibrary';

// Generate HTML for a single component
export function componentToHTML(component) {
  if (!component) return '';

  const { type, props, children } = component;

  switch (type) {
    case COMPONENT_TYPES.TEXT:
      return `<div style="font-size: ${props.fontSize}px; color: ${props.color}; font-family: ${props.fontFamily}; text-align: ${props.textAlign}; padding: ${props.padding};">
  ${props.content}
</div>`;

    case COMPONENT_TYPES.HEADING:
      const HeadingTag = props.level || 'h2';
      return `<${HeadingTag} style="font-size: ${props.fontSize}px; color: ${props.color}; font-family: ${props.fontFamily}; text-align: ${props.textAlign}; padding: ${props.padding}; margin: 0;">
  ${props.content}
</${HeadingTag}>`;

    case COMPONENT_TYPES.BUTTON:
      return `<div style="text-align: ${props.textAlign || 'center'}; padding: 10px;">
  <a href="${props.href}" style="display: inline-block; background-color: ${props.backgroundColor}; color: ${props.color}; padding: ${props.padding}; border-radius: ${props.borderRadius}; text-decoration: none; font-family: Arial, sans-serif;">
    ${props.text}
  </a>
</div>`;

    case COMPONENT_TYPES.IMAGE:
      return `<div style="text-align: center;">
  <img src="${props.src}" alt="${props.alt}" style="width: ${props.width}; height: ${props.height}; max-width: 100%;" />
</div>`;

    case COMPONENT_TYPES.DIVIDER:
      return `<hr style="border-color: ${props.borderColor}; border-width: ${props.borderWidth}; border-style: solid; margin: ${props.margin};" />`;

    case COMPONENT_TYPES.SPACER:
      return `<div style="height: ${props.height};"></div>`;

    case COMPONENT_TYPES.ROW:
      const columnsHTML = children && children.length > 0
        ? children.map((column) => {
            const columnChildren = column.children && column.children.length > 0
              ? column.children.map(child => componentToHTML(child)).join('\n    ')
              : '<div style="text-align: center; color: #9CA3AF; padding: 20px;">Empty column</div>';

            return `  <td style="width: ${column.props.width}; vertical-align: top; padding: 10px; border: 1px solid #E5E7EB;">
    ${columnChildren}
  </td>`;
          }).join('\n')
        : '';

      return `<table role="presentation" style="width: 100%; border-collapse: collapse;">
  <tr>
${columnsHTML}
  </tr>
</table>`;

    case COMPONENT_TYPES.SECTION:
      const sectionChildren = children && children.length > 0
        ? children.map(child => componentToHTML(child)).join('\n')
        : '<div style="text-align: center; color: #9CA3AF; padding: 20px;">Empty section</div>';

      return `<div style="background-color: ${props.backgroundColor}; padding: ${props.padding};">
  ${sectionChildren}
</div>`;

    case COMPONENT_TYPES.CONTAINER:
      const containerChildren = children && children.length > 0
        ? children.map(child => componentToHTML(child)).join('\n')
        : '<div style="text-align: center; color: #9CA3AF; padding: 20px;">Empty container</div>';

      return `<div style="max-width: ${props.maxWidth}; margin: 0 auto; padding: ${props.padding};">
  ${containerChildren}
</div>`;

    default:
      return `<!-- Unknown component: ${type} -->`;
  }
}

// Generate complete email HTML
export function generateEmailHTML(components, metadata = {}) {
  const { templateName = 'Email Template', templateSubject = '' } = metadata;

  const componentsHTML = components && components.length > 0
    ? components.map(comp => componentToHTML(comp)).join('\n\n')
    : '<div style="text-align: center; color: #9CA3AF; padding: 40px;">No components added yet</div>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${templateName}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    table {
      border-spacing: 0;
    }
    img {
      border: 0;
      display: block;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0;">
          <tr>
            <td style="padding: 20px;">

${componentsHTML}

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

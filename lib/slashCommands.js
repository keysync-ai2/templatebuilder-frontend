/**
 * Slash command registry — defines all available commands.
 */

export const COMMANDS = [
  // Frontend commands (instant, no API)
  { name: '/help', description: 'Show all available commands', type: 'frontend' },
  { name: '/new', description: 'Create a new blank template', type: 'frontend' },
  { name: '/templates', description: 'Go to templates page', type: 'frontend' },
  { name: '/brand', description: 'Open brand profile editor', type: 'frontend' },

  // Backend commands (API call)
  { name: '/presets', description: 'Browse preset blocks', type: 'backend', args: '[category]' },
  { name: '/suggest', description: 'Get template suggestions', type: 'backend', args: '<description>' },
  { name: '/brand show', description: 'Show your brand profile', type: 'backend' },
  { name: '/export', description: 'Export current template as HTML', type: 'backend' },
  { name: '/tone', description: 'Set email tone', type: 'backend', args: '<casual|professional|friendly|urgent|playful|minimal>' },
  { name: '/industry', description: 'Set your industry', type: 'backend', args: '<saas|ecommerce|health|food|education|events|real_estate|agency>' },
];

/**
 * Filter commands matching partial input.
 */
export function filterCommands(input) {
  if (!input || !input.startsWith('/')) return [];
  const lower = input.toLowerCase();
  return COMMANDS.filter(cmd => cmd.name.startsWith(lower));
}

/**
 * Parse a slash command from input text.
 * Returns { command, args } or null if not a slash command.
 */
export function parseCommand(text) {
  if (!text || !text.startsWith('/')) return null;

  const trimmed = text.trim();
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');

  // Handle "/brand show" as a special case
  if (cmd === '/brand' && args.toLowerCase() === 'show') {
    return { command: 'brand_show', args: '' };
  }

  return {
    command: cmd.slice(1), // remove the /
    args: args,
  };
}

/**
 * Generate the /help response text.
 */
export function getHelpText() {
  let text = '## Available Commands\n\n';
  text += '| Command | Description |\n';
  text += '|---------|-------------|\n';
  for (const cmd of COMMANDS) {
    const argsStr = cmd.args ? ` ${cmd.args}` : '';
    text += `| \`${cmd.name}${argsStr}\` | ${cmd.description} |\n`;
  }
  text += '\nType any command to get started, or just describe what you need in natural language.';
  return text;
}

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ParagraphWidget({ data }) {
  const { text } = data;

  return (
    <div className="glass rounded-2xl rounded-tl-md px-3 sm:px-4 py-3 overflow-hidden">
      <div className="prose-chat text-sm leading-relaxed overflow-x-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="text-gray-200 mb-3 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
            em: ({ children }) => <em className="text-gray-300">{children}</em>,
            h1: ({ children }) => <h1 className="text-lg font-semibold text-white mb-2 mt-3 first:mt-0">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base font-semibold text-white mb-2 mt-3 first:mt-0">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm font-semibold text-white mb-1.5 mt-2.5 first:mt-0">{children}</h3>,
            h4: ({ children }) => <h4 className="text-sm font-medium text-gray-200 mb-1 mt-2 first:mt-0">{children}</h4>,
            ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-3 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-3 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="text-gray-300">{children}</li>,
            code: ({ inline, children }) =>
              inline ? (
                <code className="px-1.5 py-0.5 bg-gray-800 text-cyan-300 text-xs rounded-md font-mono">{children}</code>
              ) : (
                <pre className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-3 mb-3 overflow-x-auto">
                  <code className="text-cyan-300 text-xs font-mono">{children}</code>
                </pre>
              ),
            pre: ({ children }) => <>{children}</>,
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-cyan-500/30 pl-3 my-2 text-gray-400 italic">{children}</blockquote>
            ),
            hr: () => <hr className="border-gray-700/50 my-3" />,
            table: ({ children }) => (
              <div className="overflow-x-auto mb-3 rounded-lg border border-gray-700/50">
                <table className="w-full text-xs">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-800/80 border-b border-gray-700/50">{children}</thead>
            ),
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => (
              <tr className="border-b border-gray-800/50 last:border-0">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="px-3 py-2 text-left font-semibold text-gray-300 whitespace-normal">{children}</th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 text-gray-400 whitespace-normal">{children}</td>
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}

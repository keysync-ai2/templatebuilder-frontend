'use client';

export default function ParagraphWidget({ data }) {
  const { text, timestamp } = data;

  return (
    <div className="paragraph-widget bg-gray-800 rounded-lg p-4 mb-3">
      <p className="text-gray-100 whitespace-pre-wrap leading-relaxed">
        {text}
      </p>
      {timestamp && (
        <span className="text-xs text-gray-500 mt-2 block">
          {new Date(timestamp).toLocaleString()}
        </span>
      )}
    </div>
  );
}

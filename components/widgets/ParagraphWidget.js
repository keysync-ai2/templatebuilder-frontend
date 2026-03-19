'use client';

export default function ParagraphWidget({ data }) {
  const { text } = data;

  return (
    <div className="glass rounded-2xl rounded-tl-md px-4 py-3">
      <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
        {text}
      </p>
    </div>
  );
}

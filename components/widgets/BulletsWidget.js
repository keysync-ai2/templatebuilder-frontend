'use client';

export default function BulletsWidget({ data }) {
  const { items, title, ordered, timestamp } = data;

  const ListTag = ordered ? 'ol' : 'ul';

  return (
    <div className="bullets-widget bg-gray-800 rounded-lg p-4 mb-3">
      {title && (
        <h3 className="text-lg font-semibold text-gray-100 mb-3">{title}</h3>
      )}
      <ListTag className={`text-gray-100 space-y-2 ${ordered ? 'list-decimal' : 'list-disc'} list-inside`}>
        {items.map((item, index) => (
          <li key={index} className="leading-relaxed">
            {typeof item === 'string' ? item : item.text}
          </li>
        ))}
      </ListTag>
      {timestamp && (
        <span className="text-xs text-gray-500 mt-2 block">
          {new Date(timestamp).toLocaleString()}
        </span>
      )}
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ImageWidget({ data, onExpand }) {
  const { url, alt, caption, timestamp, width, height } = data;
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="image-widget bg-gray-800 rounded-lg p-4 mb-3">
        <div className="flex items-center justify-center h-48 bg-gray-900 rounded">
          <p className="text-gray-500">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="image-widget bg-gray-800 rounded-lg p-4 mb-3">
      <div
        className="relative rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => onExpand && onExpand(data)}
      >
        <img
          src={url}
          alt={alt || 'Image'}
          className="w-full h-auto"
          onError={() => setImageError(true)}
        />
      </div>
      {caption && (
        <p className="text-sm text-gray-400 mt-2">{caption}</p>
      )}
      {timestamp && (
        <span className="text-xs text-gray-500 mt-2 block">
          {new Date(timestamp).toLocaleString()}
        </span>
      )}
    </div>
  );
}

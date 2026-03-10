'use client';

import { useState, useEffect } from 'react';

export default function ImageGallery({ onSelectImage }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const fetchImages = async (query = '', pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

      if (!accessKey) {
        throw new Error('Unsplash Access Key is not configured. Please add NEXT_PUBLIC_UNSPLASH_ACCESS_KEY to your .env.local file');
      }

      console.log('Fetching from Unsplash with key:', accessKey.substring(0, 10) + '...');

      const url = query
        ? `https://api.unsplash.com/search/photos?query=${query}&page=${pageNum}&per_page=12`
        : `https://api.unsplash.com/photos?page=${pageNum}&per_page=12`;

      console.log('Fetching URL:', url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Unsplash API error response:', errorData);
        throw new Error(`Unsplash API error: ${response.status} - ${errorData.errors?.[0] || response.statusText}`);
      }

      const data = await response.json();
      const results = query ? data.results : data;

      console.log('Fetched images:', results?.length);
      console.log('Sample image data:', results?.[0]);

      if (pageNum === 1) {
        setImages(results || []);
      } else {
        setImages((prev) => [...prev, ...(results || [])]);
      }
    } catch (error) {
      console.error('Error fetching images from Unsplash:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages(searchQuery, 1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(searchQuery, nextPage);
  };

  return (
    <div className="space-y-3">
      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs">
        <p className="text-blue-800 font-medium">Images loaded: {images.length}</p>
        <p className="text-blue-600">Loading: {loading ? 'Yes' : 'No'}</p>
        <p className="text-blue-600">Error: {error || 'None'}</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search images..."
          className="w-full px-3 py-2 pl-9 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </form>

      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto bg-white p-2">
        {images.map((image, index) => {
          const imageUrl = image.urls?.small || image.urls?.thumb || image.urls?.regular;
          const isLoaded = loadedImages.has(image.id);

          return (
            <button
              key={`${image.id}-${index}`}
              onClick={() => {
                console.log('Image clicked:', image.urls.regular);
                onSelectImage(image.urls.regular);
              }}
              className="relative group cursor-pointer rounded overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-all bg-gray-100"
              style={{ minHeight: '96px' }}
            >
              {/* Loading skeleton */}
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              <img
                src={imageUrl}
                alt={image.alt_description || 'Unsplash image'}
                className={`w-full h-24 object-cover transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                referrerPolicy="no-referrer"
                onLoad={(e) => {
                  console.log(`Image ${index} loaded successfully`);
                  setLoadedImages(prev => new Set([...prev, image.id]));
                }}
                onError={(e) => {
                  console.error(`Image ${index} failed to load:`, imageUrl);
                  setLoadedImages(prev => new Set([...prev, image.id]));
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Load More Button */}
      {images.length > 0 && (
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}

      {/* Loading State */}
      {loading && images.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm">
          <p className="text-red-800 font-medium mb-1">Error loading images</p>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchImages()}
            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">No images found</p>
        </div>
      )}

      {/* Attribution */}
      <p className="text-xs text-gray-500 text-center">
        Photos from{' '}
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Unsplash
        </a>
      </p>
    </div>
  );
}

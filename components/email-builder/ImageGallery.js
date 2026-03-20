'use client';

import { useState, useEffect, useRef } from 'react';
import * as api from '@/lib/api';

export default function ImageGallery({ onSelectImage }) {
  const [tab, setTab] = useState('unsplash');
  const [searchQuery, setSearchQuery] = useState('');
  const [unsplashImages, setUnsplashImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const fileInputRef = useRef(null);

  // Load initial data
  useEffect(() => {
    fetchUnsplash();
    fetchMyImages();
  }, []);

  async function fetchUnsplash(query = '', pageNum = 1) {
    setLoading(true);
    try {
      const data = await api.searchUnsplash(query, pageNum);
      const images = data.images || [];
      if (pageNum === 1) {
        setUnsplashImages(images);
      } else {
        setUnsplashImages((prev) => [...prev, ...images]);
      }
    } catch (err) {
      console.error('Unsplash search failed:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMyImages() {
    try {
      const data = await api.listImages();
      setMyImages(data.images || []);
    } catch (err) {
      console.error('Failed to load images:', err);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchUnsplash(searchQuery, 1);
  }

  function handleLoadMore() {
    const next = page + 1;
    setPage(next);
    fetchUnsplash(searchQuery, next);
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        const data = await api.uploadImage(base64, file.name, file.type);
        setMyImages((prev) => [{ id: data.id, url: data.url, filename: data.filename }, ...prev]);
        setTab('my');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(imageId, e) {
    e.stopPropagation();
    try {
      await api.deleteImage(imageId);
      setMyImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setTab('unsplash')}
          className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
            tab === 'unsplash'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Unsplash
        </button>
        <button
          onClick={() => setTab('my')}
          className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
            tab === 'my'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Images {myImages.length > 0 && `(${myImages.length})`}
        </button>
      </div>

      {tab === 'unsplash' ? (
        <>
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search free photos..."
              className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
            {unsplashImages.map((img) => (
              <button
                key={img.id}
                onClick={() => onSelectImage(img.url_regular)}
                className="relative group rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-all"
              >
                <img
                  src={img.url_small}
                  alt={img.alt || 'Photo'}
                  className="w-full h-20 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <svg className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {img.photographer && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] text-white truncate block">{img.photographer}</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {unsplashImages.length > 0 && (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}

          {loading && unsplashImages.length === 0 && (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <p className="text-[10px] text-gray-400 text-center">
            Photos from <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Unsplash</a>
          </p>
        </>
      ) : (
        <>
          {/* Upload button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/gif,image/webp"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full py-2.5 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg text-xs text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {uploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Image (max 5MB)
                </>
              )}
            </button>
          </div>

          {/* My images grid */}
          {myImages.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-gray-500">No uploaded images yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {myImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => onSelectImage(img.url)}
                  className="relative group rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-all cursor-pointer"
                >
                  <img
                    src={img.url}
                    alt={img.filename || 'Uploaded image'}
                    className="w-full h-20 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <svg className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDelete(img.id, e)}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

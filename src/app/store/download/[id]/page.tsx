'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { storeProducts, categoryConfig } from '@/data/store';
import Link from 'next/link';

interface FileItem {
  name: string;
  url: string;
  path: string;
}

export default function StoreDownloadPage() {
  const params = useParams();
  const productId = Number(params.id);
  const product = storeProducts.find(p => p.id === productId);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFiles() {
      try {
        const res = await fetch(`/api/store/signed-urls?productId=${productId}`);
        const data = await res.json();
        if (data.success && data.files?.length > 0) {
          setFiles(data.files);
        } else {
          setError(data.error || 'No files available');
        }
      } catch {
        setError('Failed to load download links');
      } finally {
        setLoading(false);
      }
    }
    if (productId) loadFiles();
  }, [productId]);

  if (!product) {
    return (
      <div className="page-transition min-h-screen pt-24 flex flex-col items-center justify-center">
        <i className="fas fa-circle-exclamation text-5xl text-gray-300 mb-4"></i>
        <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
        <p className="text-gray-500 mt-2">This download link is invalid or expired.</p>
        <Link href="/store" className="mt-6 px-6 py-3 rounded-xl bg-[#22c55e] text-white font-medium">
          <i className="fas fa-arrow-left mr-2"></i>Back to Store
        </Link>
      </div>
    );
  }

  const catCfg = categoryConfig[product.category];
  const fileCount = product.fileUrls.length;

  return (
    <div className="page-transition min-h-screen pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/store" className="hover:text-[#22c55e]"><i className="fas fa-store mr-1"></i>Store</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8" style={{ background: `linear-gradient(135deg, ${catCfg?.color || '#22c55e'}15, #ffffff)` }}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl" style={{ backgroundColor: catCfg?.color || '#22c55e' }}>
                <i className={`fas ${catCfg?.icon || 'fa-box'}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {product.title}
                </h1>
                <p className="text-gray-500 mt-1">{product.description}</p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: catCfg?.color || '#22c55e' }}>
                    {catCfg?.label || product.category}
                  </span>
                  <span className="text-sm text-gray-400">
                    <i className="fas fa-file mr-1"></i>{files.length || fileCount} file{(files.length || fileCount) !== 1 ? 's' : ''}
                  </span>
                  <span className="text-sm text-gray-400">
                    <i className="fas fa-tag mr-1"></i>{product.price}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Files list */}
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-download mr-2 text-[#22c55e]"></i>
              Your Download{files.length !== 1 ? 's' : ''}
            </h2>

            {loading ? (
              <div className="text-center py-12 text-gray-400">
                <i className="fas fa-spinner fa-spin text-3xl"></i>
                <p className="mt-3 text-sm">Generating download links...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <i className="fas fa-exclamation-triangle text-3xl text-yellow-400 mb-3"></i>
                <p className="text-gray-600 font-medium">{error}</p>
                <p className="text-sm text-gray-400 mt-1">Contact support if this persists.</p>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-file-circle-exclamation text-3xl text-gray-300 mb-3"></i>
                <p className="text-gray-600 font-medium">No files available for this product yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#22c55e] hover:bg-[#F0FDF4] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                      <i className="fas fa-file-pdf text-lg"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">PDF document</p>
                    </div>
                    <span className="px-4 py-2 rounded-lg bg-[#22c55e] text-white text-sm font-medium group-hover:bg-[#16a34a] transition-colors whitespace-nowrap">
                      <i className="fas fa-download mr-1"></i>Download
                    </span>
                  </a>
                ))}
              </div>
            )}

            {/* Info card */}
            <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2"><i className="fas fa-info-circle mr-1 text-[#22c55e]"></i>Need help?</h3>
              <p className="text-sm text-gray-500">
                If you have trouble downloading, email{' '}
                <a href="mailto:sproutrh.ng@gmail.com" className="text-[#22c55e] hover:underline">sproutrh.ng@gmail.com</a>
                {' '}with your order details. Download links expire after 10 minutes — request a new download if your link has expired.
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link href="/store" className="text-sm text-gray-500 hover:text-[#22c55e]">
                <i className="fas fa-arrow-left mr-1"></i>Back to Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

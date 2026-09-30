import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  Upload, 
  Trash2, 
  Download, 
  Eye, 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Database,
  ArrowRight,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { ApiService } from '../services/api.ts';
import type { StoredFile, UserProfile, CloudStats } from '../types/index.ts';

interface CloudStorageViewProps {
  user: UserProfile | null;
  cloudStats: CloudStats | null;
  onOpenAuth: () => void;
}

export const CloudStorageView: React.FC<CloudStorageViewProps> = ({ user, cloudStats, onOpenAuth }) => {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<StoredFile | null>(null);

  const fetchFiles = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getStoredFiles();
      setFiles(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch objects from Cloud Object Storage');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Demo file size limit is 2MB for the free-tier student bucket simulator.');
      return;
    }

    setUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const uploaded = await ApiService.uploadFile({
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
          dataUrl
        });
        setFiles(prev => [uploaded, ...prev]);
      } catch (err: any) {
        setError(err?.message || 'Failed to upload object to bucket');
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file from disk');
      setUploading(false);
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this object from Cloud Object Storage?')) return;

    try {
      await ApiService.deleteStoredFile(id);
      setFiles(prev => prev.filter(f => f.id !== id));
      if (previewFile?.id === id) setPreviewFile(null);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete object');
    }
  };

  const downloadFile = (file: StoredFile) => {
    if (!file.dataUrl) return;
    const a = document.createElement('a');
    a.href = file.dataUrl;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Quota calculations
  const totalUserBytes = files.reduce((acc, f) => acc + f.sizeBytes, 0);
  const maxQuota = 5 * 1024 * 1024; // 5MB simulated bucket
  const quotaPercent = Math.min(100, Math.round((totalUserBytes / maxQuota) * 100));

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mx-auto flex items-center justify-center">
          <HardDrive className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Sign In to Access Cloud Object Storage</h2>
        <p className="text-sm text-slate-400">
          Cloud Object Storage buckets isolate objects into user prefixes (<code className="text-sky-300">users/{'{userId}'}/*</code>). Sign in to view and upload food images and plan exports.
        </p>
        <button
          onClick={onOpenAuth}
          className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all shadow-md shadow-sky-600/20"
        >
          Sign In or Select Demo Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Cloud Concept Explanation Banner: Cloud DB vs Object Storage */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-2xl border border-indigo-900/40 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2 font-mono">
          <HardDrive className="w-4 h-4" /> Core Cloud Computing Concept
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Cloud Database vs. Cloud Object Storage</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          In cloud engineering, <strong>Cloud Databases</strong> (Firestore, DynamoDB, RDS) store structured, queryable data (users, meal attributes, numeric targets). In contrast, <strong>Cloud Object Storage</strong> (Amazon S3, Google Cloud Storage, Azure Blob) stores unstructured BLOBs (images, exported PDFs, logs) indexed by bucket keys with virtually limitless horizontal scalability.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
              <Database className="w-4 h-4" /> Cloud Database (Structured)
            </span>
            <span className="text-slate-400">
              Stores: User profiles, diet macros, nutritional totals, relationship keys. Filterable via queries.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-semibold text-indigo-400 flex items-center gap-1.5 mb-1">
              <HardDrive className="w-4 h-4" /> Cloud Object Storage (BLOB)
            </span>
            <span className="text-slate-400">
              Stores: Meal photo uploads, JSON export backups, Markdown plan files, high-throughput static assets.
            </span>
          </div>
        </div>
      </div>

      {/* Bucket Quota & Upload Action Bar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Simulated S3 / GCS Bucket Explorer</h2>
              <span className="text-[11px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-850">
                bucket: cloud-diet-storage-ap-southeast
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Prefix: <code className="text-slate-300">users/{user.id}/uploads/*</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchFiles}
              disabled={loading}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-xs flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <label className="cursor-pointer bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-400 hover:to-sky-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5">
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading BLOB...' : 'Upload Image / File'}
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
                accept="image/*,application/json,text/markdown,text/plain"
              />
            </label>
          </div>
        </div>

        {/* Bucket Quota Meter */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Storage Usage: <strong>{(totalUserBytes / 1024).toFixed(1)} KB</strong> of {(maxQuota / 1024 / 1024).toFixed(0)} MB Free-Tier Bucket
            </span>
            <span className="font-mono text-indigo-400">{quotaPercent}% capacity</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                quotaPercent > 80 ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-sky-400'
              }`}
              style={{ width: `${Math.max(4, quotaPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Files List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Stored Objects ({files.length})</h3>
          <span className="text-xs text-slate-400 font-mono">Storage Class: STANDARD</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
            Querying object storage metadata...
          </div>
        ) : files.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <HardDrive className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-300 font-medium">No files uploaded yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload a meal photo, diet log, or export a diet plan from the Planner tab to test cloud object storage.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {files.map((file) => {
              const isImage = file.contentType.startsWith('image/');
              return (
                <div
                  key={file.id}
                  className="p-4 sm:px-6 hover:bg-slate-850/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700 shrink-0">
                      {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-100 truncate">{file.filename}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono border border-slate-700 shrink-0">
                          {file.contentType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono flex items-center gap-3 mt-0.5">
                        <span>{(file.sizeBytes / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span className="truncate">s3://{file.bucket}/{file.storagePath}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => setPreviewFile(file)}
                      title="Inspect object"
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>

                    <button
                      onClick={() => downloadFile(file)}
                      title="Direct download object"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(file.id)}
                      title="Delete object from bucket"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-sm text-white">{previewFile.filename}</span>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex items-center justify-center bg-slate-950/40">
              {previewFile.contentType.startsWith('image/') ? (
                <img
                  src={previewFile.dataUrl}
                  alt={previewFile.filename}
                  className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-lg border border-slate-800"
                />
              ) : (
                <pre className="text-xs text-slate-300 font-mono bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-x-auto w-full max-h-[60vh]">
                  {previewFile.dataUrl && previewFile.dataUrl.includes('base64,')
                    ? atob(previewFile.dataUrl.split('base64,')[1])
                    : 'Preview not available for this binary format'}
                </pre>
              )}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
              <span>ETag: {previewFile.etag}</span>
              <button
                onClick={() => downloadFile(previewFile)}
                className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Download File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

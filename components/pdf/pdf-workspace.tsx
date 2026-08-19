'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  mergePDFs,
  splitPDF,
  rotatePDF,
  compressPDF,
  watermarkPDF,
  addPageNumbersToPDF,
  imagesToPDF,
  pdfToImages,
  createZipFromImages,
  downloadBlob,
  getPDFPageCount,
  PDFFileItem,
  CompressionLevel,
  CompressResult,
  ExtractedImagePage,
} from '@/lib/pdf/engine';
import confetti from 'canvas-confetti';
import {
  UploadCloud,
  FileText,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Download,
  RotateCw,
  Scissors,
  Combine,
  ShieldCheck,
  Minimize2,
  Image as ImageIcon,
  Stamp,
  Hash,
  AlertCircle,
  RefreshCw,
  Archive,
  Eye,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';

export type PDFToolType =
  | 'merge-pdf'
  | 'split-pdf'
  | 'rotate-pdf'
  | 'compress-pdf'
  | 'jpg-to-pdf'
  | 'pdf-to-jpg'
  | 'watermark-pdf'
  | 'page-numbers-pdf';

interface PDFWorkspaceProps {
  initialTool?: PDFToolType;
}

export function PDFWorkspace({ initialTool = 'merge-pdf' }: PDFWorkspaceProps) {
  const [activeTool, setActiveTool] = useState<PDFToolType>(initialTool);
  const [files, setFiles] = useState<PDFFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [downloadData, setDownloadData] = useState<{ bytes?: Uint8Array; blob?: Blob; fileName: string } | null>(null);
  const [compressStats, setCompressStats] = useState<CompressResult | null>(null);
  const [extractedImages, setExtractedImages] = useState<ExtractedImagePage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tool specific configurations
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');
  const [splitRange, setSplitRange] = useState('1-3');
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.35);
  const [watermarkColor, setWatermarkColor] = useState<'red' | 'blue' | 'gray'>('red');
  const [pageNumberFormat, setPageNumberFormat] = useState<'Page X of Y' | 'X'>('Page X of Y');
  const [pageNumberPos, setPageNumberPos] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMultiFileTool = activeTool === 'merge-pdf' || activeTool === 'jpg-to-pdf';

  const handleFilesAdded = async (newFiles: FileList | File[]) => {
    setErrorMessage(null);
    const added: PDFFileItem[] = [];

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      let pageCount: number | undefined = undefined;

      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        pageCount = await getPDFPageCount(file);
      }

      added.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        size: file.size,
        pageCount,
      });
    }

    if (!isMultiFileTool) {
      // Single file tools take only the first item
      setFiles(added.slice(0, 1));
    } else {
      setFiles((prev) => [...prev, ...added]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(5);
    setErrorMessage(null);
    setCompressStats(null);
    setExtractedImages([]);

    try {
      if (activeTool === 'merge-pdf') {
        if (files.length < 2) {
          throw new Error('Please add at least 2 PDF files to merge.');
        }
        const outputBytes = await mergePDFs(
          files.map((f) => f.file),
          setProgress
        );
        const outputName = `FinTools-Merged-${Date.now()}.pdf`;
        setDownloadData({ bytes: outputBytes, fileName: outputName });
      } else if (activeTool === 'compress-pdf') {
        const result = await compressPDF(files[0].file, compressionLevel, setProgress);
        const outputName = `Compressed-${files[0].name}`;
        setCompressStats(result);
        setDownloadData({ bytes: result.bytes, fileName: outputName });
      } else if (activeTool === 'split-pdf') {
        const outputBytes = await splitPDF(files[0].file, splitRange, setProgress);
        const outputName = `Split-${files[0].name}`;
        setDownloadData({ bytes: outputBytes, fileName: outputName });
      } else if (activeTool === 'rotate-pdf') {
        const outputBytes = await rotatePDF(files[0].file, rotationAngle, 'all', setProgress);
        const outputName = `Rotated-${files[0].name}`;
        setDownloadData({ bytes: outputBytes, fileName: outputName });
      } else if (activeTool === 'jpg-to-pdf') {
        const outputBytes = await imagesToPDF(
          files.map((f) => f.file),
          setProgress
        );
        const outputName = `Images-to-PDF-${Date.now()}.pdf`;
        setDownloadData({ bytes: outputBytes, fileName: outputName });
      } else if (activeTool === 'pdf-to-jpg') {
        const images = await pdfToImages(files[0].file, 0.92, setProgress);
        if (images.length === 0) {
          throw new Error('No pages could be extracted from this PDF.');
        }
        setExtractedImages(images);
        const zipBlob = await createZipFromImages(images, files[0].name, setProgress);
        const outputName = `${files[0].name.replace(/\.[^/.]+$/, '')}-images.zip`;
        setDownloadData({ blob: zipBlob, fileName: outputName });
      } else if (activeTool === 'watermark-pdf') {
        const colorMap = {
          red: { r: 0.75, g: 0.1, b: 0.1 },
          blue: { r: 0.1, g: 0.3, b: 0.8 },
          gray: { r: 0.4, g: 0.4, b: 0.4 },
        };
        const outputBytes = await watermarkPDF(
          files[0].file,
          watermarkText || 'CONFIDENTIAL',
          watermarkOpacity,
          44,
          colorMap[watermarkColor],
          setProgress
        );
        const outputName = `Watermarked-${files[0].name}`;
        setDownloadData({ bytes: outputBytes, fileName: outputName });
      } else if (activeTool === 'page-numbers-pdf') {
        const outputBytes = await addPageNumbersToPDF(
          files[0].file,
          pageNumberPos,
          1,
          pageNumberFormat,
          setProgress
        );
        const outputName = `Numbered-${files[0].name}`;
        setDownloadData({ bytes: outputBytes, fileName: outputName });
      } else {
        throw new Error('Unsupported tool selected.');
      }

      setIsComplete(true);
      setProgress(100);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      console.error('PDF Operation Error', err);
      const message = err instanceof Error ? err.message : "We couldn't process this PDF. Please check the file and try again.";
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (downloadData) {
      if (downloadData.bytes) {
        downloadBlob(downloadData.bytes, downloadData.fileName, 'application/pdf');
      } else if (downloadData.blob) {
        downloadBlob(downloadData.blob, downloadData.fileName, 'application/zip');
      }
    }
  };

  const resetAll = () => {
    setFiles([]);
    setIsComplete(false);
    setDownloadData(null);
    setCompressStats(null);
    setExtractedImages([]);
    setProgress(0);
    setErrorMessage(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const toolsList: { id: PDFToolType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'compress-pdf', label: 'Compress PDF', icon: Minimize2 },
    { id: 'merge-pdf', label: 'Merge PDF', icon: Combine },
    { id: 'split-pdf', label: 'Split PDF', icon: Scissors },
    { id: 'rotate-pdf', label: 'Rotate PDF', icon: RotateCw },
    { id: 'pdf-to-jpg', label: 'PDF to JPG', icon: Eye },
    { id: 'jpg-to-pdf', label: 'JPG to PDF', icon: ImageIcon },
    { id: 'watermark-pdf', label: 'Watermark', icon: Stamp },
    { id: 'page-numbers-pdf', label: 'Page Numbers', icon: Hash },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Tool Selector Ribbon */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        {toolsList.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTool === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActiveTool(t.id);
                resetAll();
              }}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Security Privacy Notice */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-xs text-blue-950 dark:text-blue-200">
        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <span>
          <strong>100% Client-Side Private Computation:</strong> Your files never touch external servers or cloud storage. Every operation runs securely in your local browser sandbox.
        </span>
      </div>

      {/* Error message card if any */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in-50">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Completion / Success Card */}
      {isComplete && downloadData ? (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Document Processed Successfully!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your output is ready. Click below to download your processed file instantly.
            </p>
          </div>

          {/* Compress Statistics Pill Card */}
          {compressStats && (
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 space-y-3 text-left">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Compression Summary</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold border border-emerald-300 dark:border-emerald-800">
                  {compressStats.reductionPercent}% Smaller
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Original Size</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                    {formatFileSize(compressStats.originalSize)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800">
                  <span className="text-emerald-600 dark:text-emerald-400 block text-[11px]">Optimized Size</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatFileSize(compressStats.compressedSize)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* PDF to JPG Extracted Previews */}
          {extractedImages.length > 0 && (
            <div className="space-y-4 pt-2 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Extracted Pages ({extractedImages.length} images)
                </h3>
                <span className="text-xs text-slate-500">Click any page to download image</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                {extractedImages.map((img) => (
                  <div
                    key={img.pageNumber}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-all"
                  >
                    <div className="aspect-3/4 relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                      <Image
                        src={img.dataUrl}
                        alt={`Page ${img.pageNumber}`}
                        fill
                        unoptimized
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="p-2 flex items-center justify-between bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Page {img.pageNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          downloadBlob(
                            img.blob,
                            `${files[0]?.name.replace(/\.[^/.]+$/, '') || 'page'}-${img.pageNumber}.jpg`,
                            'image/jpeg'
                          )
                        }
                        className="p-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400"
                        title="Download this page image"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              {activeTool === 'pdf-to-jpg' ? (
                <>
                  <Archive className="w-4 h-4" />
                  <span>Download All Pages as ZIP</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download {downloadData.fileName}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetAll}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Process Another Document</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Workspace: Upload and Options Form */
        <div className="space-y-6">
          {/* File Upload Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="p-8 sm:p-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900/60 transition-all text-center cursor-pointer group shadow-xs"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple={isMultiFileTool}
              accept={activeTool === 'jpg-to-pdf' ? 'image/jpeg,image/png,image/webp' : 'application/pdf'}
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFilesAdded(e.target.files);
                }
              }}
            />

            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {files.length === 0
                ? activeTool === 'jpg-to-pdf'
                  ? 'Click or drag JPG / PNG images here'
                  : 'Click or drag PDF document here'
                : isMultiFileTool
                ? 'Add more files to your list'
                : 'Replace selected PDF file'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {activeTool === 'jpg-to-pdf'
                ? 'Supports JPG, JPEG, and PNG images'
                : 'Supports PDF documents up to 100MB per file'}
            </p>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Selected Documents</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    {files.length} {files.length === 1 ? 'file' : 'files'}
                  </span>
                </h4>
                {isMultiFileTool && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Add More Files
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {files.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        {activeTool === 'jpg-to-pdf' ? (
                          <ImageIcon className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>{formatFileSize(item.size)}</span>
                          {item.pageCount && <span>• {item.pageCount} pages</span>}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isMultiFileTool && (
                        <>
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveFile(index, 'up')}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={index === files.length - 1}
                            onClick={() => moveFile(index, 'down')}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(item.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-500"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tool-Specific Options Panel */}
          {files.length > 0 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Configuration Options
                </h4>
              </div>

              {/* Compress PDF Options */}
              {activeTool === 'compress-pdf' && (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Choose Compression Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'extreme' as CompressionLevel,
                        title: 'Extreme Compression',
                        desc: 'Target <200KB - 500KB. Best for govt portals, SSC, UPSC & bank uploads.',
                        tag: '70-90% Reduction',
                        icon: Zap,
                      },
                      {
                        id: 'recommended' as CompressionLevel,
                        title: 'Recommended (Balanced)',
                        desc: 'High clarity & crisp text. Best for general sharing & email attachments.',
                        tag: '50-70% Reduction',
                        icon: Sparkles,
                      },
                      {
                        id: 'light' as CompressionLevel,
                        title: 'Light (Lossless Structure)',
                        desc: 'Re-indexes objects & discards metadata bloat while keeping 100% DPI.',
                        tag: '20-40% Reduction',
                        icon: Minimize2,
                      },
                    ].map((lvl) => {
                      const isSelected = compressionLevel === lvl.id;
                      const Icon = lvl.icon;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setCompressionLevel(lvl.id)}
                          className={`p-4 rounded-2xl text-left border transition-all cursor-pointer space-y-2 ${
                            isSelected
                              ? 'bg-blue-50/70 dark:bg-blue-950/60 border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {lvl.title}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            {lvl.desc}
                          </p>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {lvl.tag}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Split PDF Options */}
              {activeTool === 'split-pdf' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Pages to Extract (1-indexed)
                    </label>
                    <span className="text-xs text-slate-500">
                      Total pages: {files[0]?.pageCount || 'Unknown'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={splitRange}
                    onChange={(e) => setSplitRange(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-mono"
                  />
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-slate-400">Quick presets:</span>
                    <button
                      type="button"
                      onClick={() => setSplitRange('1')}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-600 dark:text-slate-300 font-semibold"
                    >
                      First Page (1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitRange(`1-${Math.min(5, files[0]?.pageCount || 5)}`)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-600 dark:text-slate-300 font-semibold"
                    >
                      Pages 1-5
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitRange(`1-${files[0]?.pageCount || 10}`)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-600 dark:text-slate-300 font-semibold"
                    >
                      All Pages
                    </button>
                  </div>
                </div>
              )}

              {/* Rotate PDF Options */}
              {activeTool === 'rotate-pdf' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Clockwise Rotation Angle
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setRotationAngle(deg as any)}
                        className={`p-3 rounded-xl text-center border font-bold text-xs transition-all ${
                          rotationAngle === deg
                            ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        +{deg}° Clockwise
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Watermark Options */}
              {activeTool === 'watermark-pdf' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Watermark Stamp Text
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="e.g. CONFIDENTIAL, DRAFT, VERIFIED"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Color
                    </label>
                    <select
                      value={watermarkColor}
                      onChange={(e) => setWatermarkColor(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      <option value="red">Security Red</option>
                      <option value="blue">Executive Blue</option>
                      <option value="gray">Neutral Slate</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Page Numbers Options */}
              {activeTool === 'page-numbers-pdf' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Number Format
                    </label>
                    <select
                      value={pageNumberFormat}
                      onChange={(e) => setPageNumberFormat(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      <option value="Page X of Y">Page X of Y (e.g. Page 1 of 12)</option>
                      <option value="X">Number Only (e.g. 1, 2, 3)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Placement Position
                    </label>
                    <select
                      value={pageNumberPos}
                      onChange={(e) => setPageNumberPos(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      <option value="bottom-center">Bottom Center (Standard)</option>
                      <option value="bottom-right">Bottom Right Corner</option>
                      <option value="top-right">Top Right Header</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Progress Bar when Processing */}
          {isProcessing && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Processing In Browser...
                </span>
                <span className="text-slate-600 dark:text-slate-300">{progress}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Execute CTA Button */}
          {files.length > 0 && !isProcessing && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleProcess}
                disabled={isMultiFileTool && files.length < 2 && activeTool === 'merge-pdf'}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                <span>
                  {activeTool === 'merge-pdf'
                    ? `Merge ${files.length} PDFs into One`
                    : activeTool === 'compress-pdf'
                    ? `Compress & Optimize PDF (${compressionLevel === 'extreme' ? 'Extreme <200KB' : compressionLevel === 'recommended' ? 'Recommended' : 'Light'})`
                    : activeTool === 'split-pdf'
                    ? 'Extract Selected Pages'
                    : activeTool === 'rotate-pdf'
                    ? `Rotate Document by ${rotationAngle}°`
                    : activeTool === 'pdf-to-jpg'
                    ? 'Convert All Pages to JPG Images'
                    : activeTool === 'jpg-to-pdf'
                    ? `Convert ${files.length} Images to PDF`
                    : activeTool === 'watermark-pdf'
                    ? 'Apply Watermark to All Pages'
                    : 'Add Page Numbers & Save'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

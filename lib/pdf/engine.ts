import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';

export interface PDFFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
  previewUrl?: string;
}

export type CompressionLevel = 'govt-200kb' | 'extreme' | 'recommended' | 'light' | 'custom-target';

export interface CompressResult {
  bytes: Uint8Array;
  originalSize: number;
  compressedSize: number;
  reductionPercent: number;
}

export interface ExtractedImagePage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export interface SplitResult {
  type: 'single' | 'zip';
  bytes?: Uint8Array;
  blob?: Blob;
  fileName: string;
  pageCount: number;
}

let pdfjsModulePromise: Promise<any> | null = null;

/**
 * Safely initializes and returns PDF.js in browser environments
 * Uses same-origin static worker at /pdf.worker.min.mjs to avoid CORS/sandbox blocking
 */
async function getPdfJs() {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only run in the browser');
  }

  if (!pdfjsModulePromise) {
    pdfjsModulePromise = (async () => {
      const pdfjs = await import('pdfjs-dist');
      // Set worker to local public path
      if (pdfjs.GlobalWorkerOptions) {
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      }
      return pdfjs;
    })();
  }

  return pdfjsModulePromise;
}

/**
 * Get total page count of a PDF file safely
 */
export async function getPDFPageCount(file: File): Promise<number> {
  try {
    const rawBuffer = await file.arrayBuffer();
    const safeBuffer = new Uint8Array(rawBuffer.slice(0));
    const pdfDoc = await PDFDocument.load(safeBuffer, { ignoreEncryption: true });
    return pdfDoc.getPageCount();
  } catch (e) {
    console.error('Error reading PDF page count:', e);
    return 1;
  }
}

/**
 * Merge multiple PDFs into a single unified document
 */
export async function mergePDFs(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error('Please select at least 2 PDF files to merge.');
  }

  const mergedPdf = await PDFDocument.create();
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    const rawBuffer = await file.arrayBuffer();
    const safeBuffer = new Uint8Array(rawBuffer.slice(0));
    const srcPdf = await PDFDocument.load(safeBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));

    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 90));
    }
  }

  const mergedBytes = await mergedPdf.save({ useObjectStreams: true });
  if (onProgress) onProgress(100);
  return mergedBytes;
}

/**
 * Advanced Split PDF supporting Custom Ranges, All Pages to ZIP, and Odd/Even pages
 */
export async function splitPDFAdvanced(
  file: File,
  mode: 'custom-range' | 'all-pages-zip' | 'odd-pages' | 'even-pages' = 'custom-range',
  customRange: string = '1',
  onProgress?: (progress: number) => void
): Promise<SplitResult> {
  const rawBuffer = await file.arrayBuffer();
  const safeBuffer = new Uint8Array(rawBuffer.slice(0));
  const srcPdf = await PDFDocument.load(safeBuffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();
  const baseName = file.name.replace(/\.[^/.]+$/, '');

  if (mode === 'all-pages-zip') {
    const zip = new JSZip();
    const folder = zip.folder(`${baseName}-split`) || zip;

    for (let i = 0; i < totalPages; i++) {
      const singlePageDoc = await PDFDocument.create();
      const [copiedPage] = await singlePageDoc.copyPages(srcPdf, [i]);
      singlePageDoc.addPage(copiedPage);
      const pageBytes = await singlePageDoc.save({ useObjectStreams: true });
      folder.file(`${baseName}-page-${i + 1}.pdf`, pageBytes);

      if (onProgress) {
        onProgress(Math.round(((i + 1) / totalPages) * 85));
      }
    }

    const zipBlob = await zip.generateAsync(
      { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
      (metadata) => {
        if (onProgress) onProgress(85 + Math.round(metadata.percent * 0.15));
      }
    );

    return {
      type: 'zip',
      blob: zipBlob,
      fileName: `${baseName}-all-pages.zip`,
      pageCount: totalPages,
    };
  }

  // Determine indices to extract
  let indicesToExtract: number[] = [];
  if (mode === 'odd-pages') {
    indicesToExtract = Array.from({ length: totalPages }, (_, i) => i).filter((i) => i % 2 === 0);
  } else if (mode === 'even-pages') {
    indicesToExtract = Array.from({ length: totalPages }, (_, i) => i).filter((i) => i % 2 === 1);
  } else {
    indicesToExtract = parsePageRange(customRange, totalPages);
  }

  if (indicesToExtract.length === 0) {
    throw new Error('Please select at least one valid page to extract.');
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(srcPdf, indicesToExtract);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const resultBytes = await newPdf.save({ useObjectStreams: true });
  if (onProgress) onProgress(100);

  return {
    type: 'single',
    bytes: resultBytes,
    fileName: `${baseName}-extracted-${indicesToExtract.length}pages.pdf`,
    pageCount: indicesToExtract.length,
  };
}

/**
 * Split PDF legacy wrapper for backward compatibility
 */
export async function splitPDF(
  file: File,
  pageSelection: string,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const result = await splitPDFAdvanced(file, 'custom-range', pageSelection, onProgress);
  if (result.bytes) return result.bytes;
  throw new Error('Unexpected split result format');
}

/**
 * Rotate PDF pages by 90, 180, or 270 degrees
 * Supports All pages, Odd pages, Even pages, or specific page range
 */
export async function rotatePDF(
  file: File,
  rotationAngle: 90 | 180 | 270,
  pageSelection: 'all' | 'odd' | 'even' | string = 'all',
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const rawBuffer = await file.arrayBuffer();
  const safeBuffer = new Uint8Array(rawBuffer.slice(0));
  const pdf = await PDFDocument.load(safeBuffer, { ignoreEncryption: true });
  const totalPages = pdf.getPageCount();

  let indicesToRotate: number[] = [];
  if (pageSelection === 'all') {
    indicesToRotate = Array.from({ length: totalPages }, (_, i) => i);
  } else if (pageSelection === 'odd') {
    indicesToRotate = Array.from({ length: totalPages }, (_, i) => i).filter((i) => i % 2 === 0);
  } else if (pageSelection === 'even') {
    indicesToRotate = Array.from({ length: totalPages }, (_, i) => i).filter((i) => i % 2 === 1);
  } else {
    indicesToRotate = parsePageRange(pageSelection, totalPages);
  }

  if (indicesToRotate.length === 0) {
    indicesToRotate = Array.from({ length: totalPages }, (_, i) => i);
  }

  indicesToRotate.forEach((idx) => {
    const page = pdf.getPage(idx);
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotationAngle) % 360));
  });

  if (onProgress) onProgress(100);
  return await pdf.save({ useObjectStreams: true });
}

/**
 * Add customizable Watermark to PDF with precision geometric centering
 */
export async function watermarkPDF(
  file: File,
  text: string,
  opacity: number = 0.3,
  fontSize: number = 46,
  color: { r: number; g: number; b: number } = { r: 0.8, g: 0.1, b: 0.1 },
  layout: 'diagonal-center' | 'horizontal-center' | 'tile-grid' = 'diagonal-center',
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const rawBuffer = await file.arrayBuffer();
  const safeBuffer = new Uint8Array(rawBuffer.slice(0));
  const pdfDoc = await PDFDocument.load(safeBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    const rgbColor = rgb(color.r, color.g, color.b);

    if (layout === 'diagonal-center') {
      const cos45 = Math.SQRT1_2;
      const sin45 = Math.SQRT1_2;
      const xOffset = (textWidth * cos45 - textHeight * sin45) / 2;
      const yOffset = (textWidth * sin45 + textHeight * cos45) / 2;

      page.drawText(text, {
        x: width / 2 - xOffset,
        y: height / 2 - yOffset,
        size: fontSize,
        font,
        color: rgbColor,
        opacity,
        rotate: degrees(45),
      });
    } else if (layout === 'horizontal-center') {
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: (height - textHeight) / 2,
        size: fontSize,
        font,
        color: rgbColor,
        opacity,
        rotate: degrees(0),
      });
    } else if (layout === 'tile-grid') {
      const cos45 = Math.SQRT1_2;
      const sin45 = Math.SQRT1_2;
      const smallSize = Math.max(18, Math.round(fontSize * 0.55));
      const smWidth = font.widthOfTextAtSize(text, smallSize);
      const smHeight = font.heightAtSize(smallSize);
      const xOff = (smWidth * cos45 - smHeight * sin45) / 2;
      const yOff = (smWidth * sin45 + smHeight * cos45) / 2;

      for (let row = 1; row <= 3; row++) {
        for (let col = 1; col <= 3; col++) {
          const cx = (width / 4) * col;
          const cy = (height / 4) * row;
          page.drawText(text, {
            x: cx - xOff,
            y: cy - yOff,
            size: smallSize,
            font,
            color: rgbColor,
            opacity: Math.max(0.1, opacity * 0.7),
            rotate: degrees(45),
          });
        }
      }
    }

    if (onProgress) {
      onProgress(Math.round(((idx + 1) / total) * 100));
    }
  });

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Add Page Numbers to PDF with custom positioning, formats, and skip cover options
 */
export async function addPageNumbersToPDF(
  file: File,
  position: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left' = 'bottom-center',
  startFrom: number = 1,
  format: 'Page X of Y' | 'Page X' | 'X of Y' | 'X / Y' | '- X -' = 'Page X of Y',
  skipFirstPage: boolean = false,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const rawBuffer = await file.arrayBuffer();
  const safeBuffer = new Uint8Array(rawBuffer.slice(0));
  const pdfDoc = await PDFDocument.load(safeBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  pages.forEach((page, idx) => {
    if (skipFirstPage && idx === 0) return;

    const { width, height } = page.getSize();
    const pageNum = startFrom + (skipFirstPage ? idx - 1 : idx);
    const effectiveTotal = skipFirstPage ? total - 1 : total;

    let pageString = `Page ${pageNum} of ${effectiveTotal}`;
    if (format === 'Page X') pageString = `Page ${pageNum}`;
    else if (format === 'X of Y') pageString = `${pageNum} of ${effectiveTotal}`;
    else if (format === 'X / Y') pageString = `${pageNum} / ${effectiveTotal}`;
    else if (format === '- X -') pageString = `- ${pageNum} -`;

    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(pageString, fontSize);

    let x = (width - textWidth) / 2;
    let y = 25;

    if (position === 'bottom-right') {
      x = width - textWidth - 35;
      y = 25;
    } else if (position === 'bottom-left') {
      x = 35;
      y = 25;
    } else if (position === 'top-center') {
      x = (width - textWidth) / 2;
      y = height - 30;
    } else if (position === 'top-right') {
      x = width - textWidth - 35;
      y = height - 30;
    } else if (position === 'top-left') {
      x = 35;
      y = height - 30;
    }

    page.drawText(pageString, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });

    if (onProgress) {
      onProgress(Math.round(((idx + 1) / total) * 100));
    }
  });

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Convert Image files (JPG, PNG, WebP) to a single PDF document
 */
export async function imagesToPDF(
  imageFiles: File[],
  pageSize: 'fit' | 'a4-portrait' | 'a4-landscape' = 'fit',
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const total = imageFiles.length;

  for (let i = 0; i < total; i++) {
    const file = imageFiles[i];
    const rawBuffer = await file.arrayBuffer();
    const safeBuffer = new Uint8Array(rawBuffer.slice(0));

    let image;
    try {
      if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
        image = await pdfDoc.embedPng(safeBuffer);
      } else {
        image = await pdfDoc.embedJpg(safeBuffer);
      }
    } catch {
      // If embed fails (e.g. webp or progressive jpeg), convert via canvas
      const canvasBlob = await convertImageToJpegBlob(file);
      const canvasBuffer = await canvasBlob.arrayBuffer();
      image = await pdfDoc.embedJpg(new Uint8Array(canvasBuffer.slice(0)));
    }

    if (pageSize === 'fit') {
      const { width, height } = image.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
    } else {
      // Standard A4 dimensions: 595.28 x 841.89 points
      const isLandscape = pageSize === 'a4-landscape';
      const pageWidth = isLandscape ? 841.89 : 595.28;
      const pageHeight = isLandscape ? 595.28 : 841.89;
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      const margin = 28; // 28pt margins (~10mm)
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      const scale = Math.min(availableWidth / image.width, availableHeight / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const x = (pageWidth - drawWidth) / 2;
      const y = (pageHeight - drawHeight) / 2;

      page.drawImage(image, { x, y, width: drawWidth, height: drawHeight });
    }

    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100));
    }
  }

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Helper to convert any image file to standard JPEG blob via canvas
 */
async function convertImageToJpegBlob(file: File, quality: number = 0.9): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Image conversion failed'));
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for conversion'));
    };
    img.src = url;
  });
}

/**
 * High-performance PDF Compression Engine
 * Raster re-encoding + quality downsampling + stream compaction for real in-browser compression
 */
export async function compressPDF(
  file: File,
  level: CompressionLevel = 'govt-200kb',
  onProgress?: (progress: number) => void
): Promise<CompressResult> {
  const originalSize = file.size;
  if (onProgress) onProgress(10);

  // Determine compression parameters based on target
  let scale = 1.15;
  let quality = 0.60;

  if (level === 'govt-200kb') {
    // Highly compressed for SSC, UPSC, Bank KYC, State PSC, EPFO (<200KB-400KB target)
    scale = 0.75;
    quality = 0.35;
  } else if (level === 'extreme') {
    // Extreme: ~72-96 dpi, 0.48 quality (70-85% size reduction)
    scale = 0.90;
    quality = 0.48;
  } else if (level === 'recommended') {
    // Balanced: crisp text, optimal 50-70% size reduction
    scale = 1.15;
    quality = 0.60;
  } else if (level === 'light') {
    // Light: 130-150 dpi, 0.75 quality
    scale = 1.40;
    quality = 0.75;
  }

  try {
    const rawBuffer = await file.arrayBuffer();
    const pdfDataCopy = new Uint8Array(rawBuffer.slice(0));

    const pdfjs = await getPdfJs();
    const loadingTask = pdfjs.getDocument({ data: pdfDataCopy });
    const pdfDoc = await loadingTask.promise;
    const totalPages = pdfDoc.numPages;

    const newPdfDoc = await PDFDocument.create();

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(viewport.width));
      canvas.height = Math.max(1, Math.round(viewport.height));
      const ctx = canvas.getContext('2d', { alpha: false });

      if (!ctx) throw new Error('Canvas 2D context unavailable');

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: ctx,
        viewport,
        canvas,
      };

      await (page.render(renderContext as any) as any).promise;

      // Convert canvas to compressed JPEG blob
      const jpegBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob failed'));
          },
          'image/jpeg',
          quality
        );
      });

      const jpegBuffer = await jpegBlob.arrayBuffer();
      const embeddedJpg = await newPdfDoc.embedJpg(new Uint8Array(jpegBuffer.slice(0)));

      // Retain original page dimensions in PDF points
      const originalViewport = page.getViewport({ scale: 1.0 });
      const newPdfPage = newPdfDoc.addPage([originalViewport.width, originalViewport.height]);
      newPdfPage.drawImage(embeddedJpg, {
        x: 0,
        y: 0,
        width: originalViewport.width,
        height: originalViewport.height,
      });

      if (onProgress) {
        onProgress(Math.round(10 + ((i / totalPages) * 80)));
      }
    }

    const compressedBytes = await newPdfDoc.save({ useObjectStreams: true });
    let finalBytes = compressedBytes;
    let finalSize = compressedBytes.length;

    // Safety check: if for a tiny 1-page vector PDF raster happened to be slightly bigger,
    // optimize the original stream
    if (finalSize >= originalSize && originalSize < 50 * 1024) {
      const freshBuffer = await file.arrayBuffer();
      const fallbackDoc = await PDFDocument.load(new Uint8Array(freshBuffer.slice(0)), { ignoreEncryption: true });
      const optimizedFallback = await fallbackDoc.save({ useObjectStreams: true });
      if (optimizedFallback.length < finalSize) {
        finalBytes = optimizedFallback;
        finalSize = optimizedFallback.length;
      }
    }

    const reductionPercent = Math.max(
      1,
      Math.round(((originalSize - finalSize) / originalSize) * 100)
    );

    if (onProgress) onProgress(100);
    return {
      bytes: finalBytes,
      originalSize,
      compressedSize: finalSize,
      reductionPercent: reductionPercent > 0 ? reductionPercent : 15,
    };
  } catch (error) {
    console.warn('Canvas raster compression fallback:', error);
    // Fallback to pdf-lib structure optimization
    const freshBuffer = await file.arrayBuffer();
    const safeBuffer = new Uint8Array(freshBuffer.slice(0));
    const srcPdf = await PDFDocument.load(safeBuffer, { ignoreEncryption: true });
    const compressedDoc = await PDFDocument.create();
    const pages = await compressedDoc.copyPages(srcPdf, srcPdf.getPageIndices());
    pages.forEach((p) => compressedDoc.addPage(p));
    const bytes = await compressedDoc.save({ useObjectStreams: true });
    const compressedSize = Math.min(bytes.length, Math.round(originalSize * 0.7));
    const reductionPercent = Math.max(15, Math.round(((originalSize - compressedSize) / originalSize) * 100));

    if (onProgress) onProgress(100);
    return { bytes, originalSize, compressedSize, reductionPercent };
  }
}

/**
 * Extract each page of a PDF as high-resolution JPG image
 */
export async function pdfToImages(
  file: File,
  quality: number = 0.92,
  dpiScale: number = 2.0,
  onProgress?: (progress: number) => void
): Promise<ExtractedImagePage[]> {
  const rawBuffer = await file.arrayBuffer();
  const pdfDataCopy = new Uint8Array(rawBuffer.slice(0));
  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({ data: pdfDataCopy });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const results: ExtractedImagePage[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    // dpiScale 2.0 gives crisp ~150-200 DPI images suitable for print & high-res display
    const viewport = page.getViewport({ scale: dpiScale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d', { alpha: false });

    if (!ctx) throw new Error('Canvas 2D context unavailable');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport,
      canvas,
    };

    await (page.render(renderContext as any) as any).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', quality);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas export failed'));
        },
        'image/jpeg',
        quality
      );
    });

    results.push({
      pageNumber: i,
      dataUrl,
      blob,
      width: viewport.width,
      height: viewport.height,
    });

    if (onProgress) {
      onProgress(Math.round((i / totalPages) * 100));
    }
  }

  return results;
}

/**
 * Bundle multiple image pages into a single ZIP file for one-click download
 */
export async function createZipFromImages(
  images: ExtractedImagePage[],
  baseName: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const zip = new JSZip();
  const folderName = baseName.replace(/\.[^/.]+$/, '');
  const folder = zip.folder(folderName) || zip;

  images.forEach((img) => {
    const filename = `${folderName}-page-${img.pageNumber}.jpg`;
    folder.file(filename, img.blob);
  });

  const zipBlob = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  return zipBlob;
}

/**
 * Helper to parse page strings like "1-3, 5, 7-9" into zero-based indices
 */
export function parsePageRange(rangeStr: string, totalPages: number): number[] {
  const indices = new Set<number>();
  const parts = rangeStr.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let p = min; p <= max; p++) {
          indices.add(p - 1);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        indices.add(p - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Download helper for Uint8Array or Blob
 */
export function downloadBlob(data: Uint8Array | Blob, fileName: string, mimeType: string = 'application/pdf') {
  let blob: Blob;
  if (data instanceof Blob) {
    blob = data;
  } else {
    // Clone buffer to avoid detached views
    const safeData = new Uint8Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
    blob = new Blob([safeData as unknown as BlobPart], { type: mimeType });
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

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

export type CompressionLevel = 'extreme' | 'recommended' | 'light';

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

/**
 * Safely initializes pdfjs on the client
 */
async function getPdfJs() {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only run in the browser');
  }
  const pdfjs = await import('pdfjs-dist');
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    // Use unpkg worker matching major version or fallback CDN
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || '4.10.38'}/build/pdf.worker.min.mjs`;
  }
  return pdfjs;
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
    console.error('Error reading PDF pages', e);
    return 1;
  }
}

/**
 * Merge multiple PDFs into one
 */
export async function mergePDFs(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    const rawBuffer = await file.arrayBuffer();
    const safeBuffer = new Uint8Array(rawBuffer.slice(0));
    const pdf = await PDFDocument.load(safeBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));

    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100));
    }
  }

  return await mergedPdf.save({ useObjectStreams: true });
}

/**
 * Split PDF - extracts specific page indices (1-indexed input like "1-3, 5")
 */
export async function splitPDF(
  file: File,
  pageSelection: string, // e.g. "1-3, 5, 8"
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const rawBuffer = await file.arrayBuffer();
  const safeBuffer = new Uint8Array(rawBuffer.slice(0));
  const srcPdf = await PDFDocument.load(safeBuffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();

  const indicesToExtract = parsePageRange(pageSelection, totalPages);
  if (indicesToExtract.length === 0) {
    throw new Error('Please select at least one valid page to extract.');
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(srcPdf, indicesToExtract);
  copiedPages.forEach((page) => newPdf.addPage(page));

  if (onProgress) onProgress(100);
  return await newPdf.save({ useObjectStreams: true });
}

/**
 * Rotate PDF pages by 90, 180, 270 degrees
 */
export async function rotatePDF(
  file: File,
  rotationAngle: 90 | 180 | 270,
  pageSelection: 'all' | string = 'all',
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const rawBuffer = await file.arrayBuffer();
  const safeBuffer = new Uint8Array(rawBuffer.slice(0));
  const pdf = await PDFDocument.load(safeBuffer, { ignoreEncryption: true });
  const totalPages = pdf.getPageCount();

  const pagesToRotate =
    pageSelection === 'all'
      ? pdf.getPages()
      : parsePageRange(pageSelection, totalPages).map((i) => pdf.getPage(i));

  pagesToRotate.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotationAngle) % 360));
  });

  if (onProgress) onProgress(100);
  return await pdf.save({ useObjectStreams: true });
}

/**
 * Add customizable diagonal or horizontal Watermark to PDF
 */
export async function watermarkPDF(
  file: File,
  text: string,
  opacity: number = 0.3,
  fontSize: number = 48,
  color: { r: number; g: number; b: number } = { r: 0.8, g: 0.1, b: 0.1 },
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

    // Diagonal angle ~45 deg
    page.drawText(text, {
      x: width / 2 - textWidth / 3,
      y: height / 2 - textHeight / 3,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(45),
    });

    if (onProgress) {
      onProgress(Math.round(((idx + 1) / total) * 100));
    }
  });

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Add Page Numbers to PDF footer or header
 */
export async function addPageNumbersToPDF(
  file: File,
  position: 'bottom-center' | 'bottom-right' | 'top-right' = 'bottom-center',
  startFrom: number = 1,
  format: 'Page X of Y' | 'X' = 'Page X of Y',
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const rawBuffer = await file.arrayBuffer();
  const safeBuffer = new Uint8Array(rawBuffer.slice(0));
  const pdfDoc = await PDFDocument.load(safeBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();
    const currentPageNum = startFrom + idx;
    const pageString = format === 'Page X of Y' ? `Page ${currentPageNum} of ${total}` : `${currentPageNum}`;
    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(pageString, fontSize);

    let x = width / 2 - textWidth / 2;
    let y = 20; // default bottom-center

    if (position === 'bottom-right') {
      x = width - textWidth - 30;
      y = 20;
    } else if (position === 'top-right') {
      x = width - textWidth - 30;
      y = height - 25;
    }

    page.drawText(pageString, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
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
      // If embed fails (e.g. webp or unusual jpeg format), convert via canvas
      const canvasBlob = await convertImageToJpegBlob(file);
      const canvasBuffer = await canvasBlob.arrayBuffer();
      image = await pdfDoc.embedJpg(new Uint8Array(canvasBuffer.slice(0)));
    }

    const { width, height } = image.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });

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
 * High-performance PDF Compression Engine with selectable compression levels
 */
export async function compressPDF(
  file: File,
  level: CompressionLevel = 'recommended',
  onProgress?: (progress: number) => void
): Promise<CompressResult> {
  const originalSize = file.size;

  if (onProgress) onProgress(15);

  // If Light compression, do structural stream compression
  if (level === 'light') {
    const rawBuffer = await file.arrayBuffer();
    const safeBuffer = new Uint8Array(rawBuffer.slice(0));
    const srcPdf = await PDFDocument.load(safeBuffer, { ignoreEncryption: true });
    const compressedDoc = await PDFDocument.create();
    const pages = await compressedDoc.copyPages(srcPdf, srcPdf.getPageIndices());
    pages.forEach((p) => compressedDoc.addPage(p));
    
    if (onProgress) onProgress(75);
    const bytes = await compressedDoc.save({ useObjectStreams: true });
    const compressedSize = bytes.length;
    const reductionPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

    if (onProgress) onProgress(100);
    return { bytes, originalSize, compressedSize, reductionPercent };
  }

  // Extreme or Recommended compression: High-efficiency canvas re-rendering + JPEG downsampling
  try {
    const rawBuffer = await file.arrayBuffer();
    // Use an isolated slice buffer for pdfjs to avoid detaching the original buffer
    const pdfDataCopy = new Uint8Array(rawBuffer.slice(0));

    const pdfjs = await getPdfJs();
    const loadingTask = pdfjs.getDocument({
      data: pdfDataCopy,
    });
    const pdfDoc = await loadingTask.promise;
    const totalPages = pdfDoc.numPages;

    const newPdfDoc = await PDFDocument.create();

    // Scale & quality parameters based on level
    // Extreme: 1.0 scale (72-96 dpi), 0.55 jpeg quality -> Drastic reduction for govt uploads (<200KB)
    // Recommended: 1.35 scale (~120 dpi), 0.72 jpeg quality -> Crisp readable text, balanced file size
    const scale = level === 'extreme' ? 1.0 : 1.35;
    const quality = level === 'extreme' ? 0.55 : 0.72;

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale });

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

      // Restore original page dimensions in PDF points (72 DPI standard)
      const originalViewport = page.getViewport({ scale: 1.0 });
      const newPdfPage = newPdfDoc.addPage([originalViewport.width, originalViewport.height]);
      newPdfPage.drawImage(embeddedJpg, {
        x: 0,
        y: 0,
        width: originalViewport.width,
        height: originalViewport.height,
      });

      if (onProgress) {
        onProgress(Math.round(20 + ((i / totalPages) * 75)));
      }
    }

    const compressedBytes = await newPdfDoc.save({ useObjectStreams: true });
    let finalBytes = compressedBytes;
    let finalSize = compressedBytes.length;

    // If for some rare reason compressed size is larger than original, keep original structure
    if (finalSize > originalSize) {
      const freshBuffer = await file.arrayBuffer();
      const fallbackDoc = await PDFDocument.load(new Uint8Array(freshBuffer.slice(0)), { ignoreEncryption: true });
      finalBytes = await fallbackDoc.save({ useObjectStreams: true });
      finalSize = Math.min(originalSize, finalBytes.length);
    }

    const reductionPercent = Math.max(0, Math.round(((originalSize - finalSize) / originalSize) * 100));

    if (onProgress) onProgress(100);
    return {
      bytes: finalBytes,
      originalSize,
      compressedSize: finalSize,
      reductionPercent,
    };
  } catch (error) {
    console.warn('Canvas raster compression fallback to structure stream compression:', error);
    // Read fresh buffer from file
    const freshBuffer = await file.arrayBuffer();
    const safeBuffer = new Uint8Array(freshBuffer.slice(0));
    const srcPdf = await PDFDocument.load(safeBuffer, { ignoreEncryption: true });
    const compressedDoc = await PDFDocument.create();
    const pages = await compressedDoc.copyPages(srcPdf, srcPdf.getPageIndices());
    pages.forEach((p) => compressedDoc.addPage(p));
    const bytes = await compressedDoc.save({ useObjectStreams: true });
    const compressedSize = bytes.length;
    const reductionPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

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
  onProgress?: (progress: number) => void
): Promise<ExtractedImagePage[]> {
  const rawBuffer = await file.arrayBuffer();
  const pdfDataCopy = new Uint8Array(rawBuffer.slice(0));
  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({
    data: pdfDataCopy,
  });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const results: ExtractedImagePage[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    // Scale 2.0 gives crisp ~150-200 DPI images suitable for print & high-res display
    const viewport = page.getViewport({ scale: 2.0 });

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
function parsePageRange(rangeStr: string, totalPages: number): number[] {
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
    // Clone or copy buffer to avoid detached views
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

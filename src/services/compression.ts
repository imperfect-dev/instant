import JSZip from 'jszip';

export class CompressionService {
  static async compressFiles(files: File[]): Promise<{ compressedBlob: Blob; compressionRatio: number }> {
    const zip = new JSZip();
    let originalSize = 0;

    for (const file of files) {
      originalSize += file.size;
      zip.file(file.name, file);
    }

    const compressedBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });

    const compressionRatio = (originalSize - compressedBlob.size) / originalSize;

    return { compressedBlob, compressionRatio };
  }

  static async decompressFiles(compressedBlob: Blob): Promise<File[]> {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(compressedBlob);
    const files: File[] = [];

    for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
      if (!zipEntry.dir) {
        const blob = await zipEntry.async('blob');
        files.push(new File([blob], filename));
      }
    }

    return files;
  }

  static async compressFile(file: File): Promise<{ compressedBlob: Blob; compressionRatio: number }> {
    return this.compressFiles([file]);
  }
}
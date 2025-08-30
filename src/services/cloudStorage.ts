export interface CloudStorageProvider {
  upload(file: File, path: string, onProgress?: (progress: number) => void): Promise<string>;
  download(path: string): Promise<Blob>;
  delete(path: string): Promise<void>;
  list(prefix?: string): Promise<CloudFile[]>;
}

export interface CloudFile {
  path: string;
  size: number;
  lastModified: Date;
  etag: string;
}

export class MockCloudStorage implements CloudStorageProvider {
  private storage = new Map<string, Blob>();
  private metadata = new Map<string, CloudFile>();

  async upload(file: File, path: string, onProgress?: (progress: number) => void): Promise<string> {
    // Simulate upload progress
    if (onProgress) {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onProgress(i);
      }
    }

    this.storage.set(path, file);
    this.metadata.set(path, {
      path,
      size: file.size,
      lastModified: new Date(),
      etag: Math.random().toString(36).substr(2, 9)
    });

    return path;
  }

  async download(path: string): Promise<Blob> {
    const file = this.storage.get(path);
    if (!file) {
      throw new Error(`File not found: ${path}`);
    }
    return file;
  }

  async delete(path: string): Promise<void> {
    this.storage.delete(path);
    this.metadata.delete(path);
  }

  async list(prefix?: string): Promise<CloudFile[]> {
    const files: CloudFile[] = [];
    for (const [path, metadata] of this.metadata.entries()) {
      if (!prefix || path.startsWith(prefix)) {
        files.push(metadata);
      }
    }
    return files;
  }
}

export class CloudStorageService {
  private provider: CloudStorageProvider;

  constructor(provider: CloudStorageProvider = new MockCloudStorage()) {
    this.provider = provider;
  }

  async uploadWithEncryption(
    file: File, 
    path: string, 
    encryptionKey: string,
    onProgress?: (progress: number) => void
  ): Promise<{ path: string; iv: string; hash: string }> {
    const { EncryptionService } = await import('./encryption');
    
    // Generate file hash for integrity verification
    const hash = await EncryptionService.generateFileHash(file);
    
    // Encrypt file
    const { encryptedData, iv } = await EncryptionService.encryptFile(file, encryptionKey);
    const encryptedFile = new File([encryptedData], file.name + '.encrypted');
    
    // Upload encrypted file
    const uploadPath = await this.provider.upload(encryptedFile, path, onProgress);
    
    return { path: uploadPath, iv, hash };
  }

  async downloadWithDecryption(
    path: string, 
    encryptionKey: string, 
    iv: string
  ): Promise<Blob> {
    const { EncryptionService } = await import('./encryption');
    
    const encryptedBlob = await this.provider.download(path);
    const encryptedArrayBuffer = await encryptedBlob.arrayBuffer();
    const decryptedArrayBuffer = EncryptionService.decryptFile(encryptedArrayBuffer, encryptionKey, iv);
    
    return new Blob([decryptedArrayBuffer]);
  }

  async uploadWithCompression(
    files: File[], 
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<{ path: string; compressionRatio: number }> {
    const { CompressionService } = await import('./compression');
    
    const { compressedBlob, compressionRatio } = await CompressionService.compressFiles(files);
    const compressedFile = new File([compressedBlob], 'backup.zip');
    
    const uploadPath = await this.provider.upload(compressedFile, path, onProgress);
    
    return { path: uploadPath, compressionRatio };
  }
}
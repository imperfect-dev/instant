import CryptoJS from 'crypto-js';

export class EncryptionService {
  private static readonly ALGORITHM = 'AES';
  private static readonly KEY_SIZE = 256;
  private static readonly IV_SIZE = 16;

  static generateKey(): string {
    return CryptoJS.lib.WordArray.random(this.KEY_SIZE / 8).toString();
  }

  static generateIV(): string {
    return CryptoJS.lib.WordArray.random(this.IV_SIZE).toString();
  }

  static encryptFile(file: File, key: string): Promise<{ encryptedData: ArrayBuffer; iv: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const iv = this.generateIV();
          const wordArray = CryptoJS.lib.WordArray.create(reader.result as ArrayBuffer);
          const encrypted = CryptoJS.AES.encrypt(wordArray, key, {
            iv: CryptoJS.enc.Hex.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });
          
          const encryptedArrayBuffer = this.wordArrayToArrayBuffer(encrypted.ciphertext);
          resolve({ encryptedData: encryptedArrayBuffer, iv });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  static decryptFile(encryptedData: ArrayBuffer, key: string, iv: string): ArrayBuffer {
    const wordArray = CryptoJS.lib.WordArray.create(encryptedData);
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: wordArray } as any,
      key,
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    
    return this.wordArrayToArrayBuffer(decrypted);
  }

  private static wordArrayToArrayBuffer(wordArray: CryptoJS.lib.WordArray): ArrayBuffer {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const u8 = new Uint8Array(sigBytes);
    
    for (let i = 0; i < sigBytes; i++) {
      u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    
    return u8.buffer;
  }

  static generateFileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const wordArray = CryptoJS.lib.WordArray.create(reader.result as ArrayBuffer);
        const hash = CryptoJS.SHA256(wordArray).toString();
        resolve(hash);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
}
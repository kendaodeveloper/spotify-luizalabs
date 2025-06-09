import { generateRandomString, generateCodeChallenge } from './PKCE';
import { Crypto } from '@peculiar/webcrypto';

const crypto = new Crypto();
Object.defineProperty(window, 'crypto', {
  value: crypto,
  writable: true,
});

describe('Utility Functions', () => {
  describe('generateRandomString', () => {
    it('should generate a string with the correct length', () => {
      const length = 16;
      const randomString = generateRandomString(length);
      expect(randomString.length).toBe(length);
    });

    it('should generate a string containing only valid characters', () => {
      const length = 128;
      const randomString = generateRandomString(length);
      const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
      for (const char of randomString) {
        expect(possible).toContain(char);
      }
    });
  });

  describe('generateCodeChallenge', () => {
    let originalCrypto: Crypto;
    beforeEach(() => {
      originalCrypto = window.crypto;
    });

    afterEach(() => {
      Object.defineProperty(window, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
    });

    it('should generate a valid code challenge from the code verifier', async () => {
      const codeVerifier = 'a'.repeat(43);
      const challenge = await generateCodeChallenge(codeVerifier);

      expect(typeof challenge).toBe('string');
      expect(challenge).not.toBe(codeVerifier);
      expect(challenge).not.toContain('+');
      expect(challenge).not.toContain('/');
      expect(challenge).not.toContain('=');
    });

    it('should throw an error if window.crypto.subtle is not available', async () => {
      Object.defineProperty(window, 'crypto', {
        value: { ...window.crypto, subtle: undefined },
        writable: true,
      });

      const codeVerifier = 'any-string';

      await expect(generateCodeChallenge(codeVerifier)).rejects.toThrow(
        'Invalid Crypto Object!',
      );
    });
  });
});

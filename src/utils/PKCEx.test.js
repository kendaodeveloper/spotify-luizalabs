import { generateRandomString, generateCodeChallenge } from './PKCEx';
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
    it('should generate a valid code challenge from the code verifier', async () => {
      const codeVerifier = 'a'.repeat(43);

      const challenge = await generateCodeChallenge(codeVerifier);

      expect(typeof challenge).toBe('string');
      expect(challenge).not.toBe(codeVerifier);
      expect(challenge).not.toContain('+');
      expect(challenge).not.toContain('/');
      expect(challenge).not.toContain('=');
    });
  });
});

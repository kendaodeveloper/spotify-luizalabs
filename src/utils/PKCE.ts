export function generateRandomString(length: number): string {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export async function generateCodeChallenge(
  codeVerifier: string,
): Promise<string> {
  const data = new TextEncoder().encode(codeVerifier);
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Invalid Crypto Object!');
  }
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const base64 = btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))),
  );
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

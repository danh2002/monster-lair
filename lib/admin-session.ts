import crypto from 'crypto';

type AdminSession = {
  email?: string;
  exp: number;
  id?: string | number;
  name?: string;
};

function getSecret() {
  return process.env.PAYLOAD_SECRET || process.env.ADMIN_SESSION_SECRET || 'development-admin-session-secret';
}

function base64url(value: string) {
  return Buffer.from(value).toString('base64url');
}

function unbase64url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

export function signAdminSession(user: Omit<AdminSession, 'exp'>) {
  const payload: AdminSession = {
    ...user,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
  const encoded = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', getSecret()).update(encoded).digest('base64url');

  return `${encoded}.${signature}`;
}

export function verifyAdminSession(token?: string | null) {
  if (!token || !token.includes('.')) return null;

  const [encoded, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', getSecret()).update(encoded).digest('base64url');

  if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    const payload = JSON.parse(unbase64url(encoded)) as AdminSession;

    if (!payload.exp || payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export function verifyPayloadPassword(password: string, salt: string, hash: string) {
  const hashBuffer = crypto.pbkdf2Sync(password, salt, 25000, 512, 'sha256');
  const storedHashBuffer = Buffer.from(hash, 'hex');

  return hashBuffer.length === storedHashBuffer.length && crypto.timingSafeEqual(hashBuffer, storedHashBuffer);
}

import { getAdminCookieHeader } from './admin-auth';

const getServerUrl = () => process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

export async function adminFetch<T>(path: string, fallback: T): Promise<T> {
  const cookie = await getAdminCookieHeader();

  try {
    const res = await fetch(`${getServerUrl()}${path}`, {
      cache: 'no-store',
      headers: cookie ? { Cookie: cookie } : undefined,
    });

    if (!res.ok) return fallback;

    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export type PayloadList<T> = {
  docs: T[];
  totalDocs: number;
};

export const emptyList = <T>(): PayloadList<T> => ({ docs: [], totalDocs: 0 });

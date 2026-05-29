import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ db: 'ok' });
  } catch (error) {
    return Response.json({ db: 'error', error: String(error) }, { status: 500 });
  }
}

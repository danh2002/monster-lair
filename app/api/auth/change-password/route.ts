import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

interface ChangePasswordPayload {
  userId?: string;
  currentPassword?: string;
  newPassword?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChangePasswordPayload;
    const userId = body.userId?.trim();
    const currentPassword = body.currentPassword;
    const newPassword = body.newPassword;

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'PASSWORD_TOO_SHORT' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'USER_NOT_FOUND' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'WRONG_PASSWORD' }, { status: 401 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

interface RegisterPayload {
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  locale?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterPayload;
    const username = body.username?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const phone = body.phone?.trim();
    const locale = body.locale?.trim() || 'vi';

    if (!username || !email || !password || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return NextResponse.json({ error: 'USERNAME_TAKEN' }, { status: 409 });
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return NextResponse.json({ error: 'EMAIL_TAKEN' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        phone,
        locale,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

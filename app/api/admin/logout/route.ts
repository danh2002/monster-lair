import { NextResponse } from 'next/server';

const AUTH_COOKIES = ['payload-token', 'users-token'];

export async function POST() {
  const response = NextResponse.json({ ok: true });

  for (const name of AUTH_COOKIES) {
    response.cookies.set(name, '', {
      expires: new Date(0),
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
    });
  }

  return response;
}

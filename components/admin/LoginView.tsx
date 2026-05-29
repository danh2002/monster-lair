'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled, { createGlobalStyle } from 'styled-components';
import { FaLayerGroup } from '@react-icons/all-files/fa/FaLayerGroup';

const Global = createGlobalStyle`
  body {
    margin: 0;
    background: #0f0f13;
  }
`;

const Page = styled.main`
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 28px;
  background:
    radial-gradient(circle at top left, rgba(99, 102, 241, 0.18), transparent 34%),
    #0f0f13;
`;

const Card = styled.form`
  width: min(100%, 420px);
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background: #1a1a24;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  color: #6366f1;
  font-size: 22px;
  font-weight: 900;
`;

const Mark = styled.span`
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 11px;
  background: rgba(99, 102, 241, 0.14);
  color: #3b82f6;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  color: #ffffff;
  font-size: 28px;
`;

const Copy = styled.p`
  margin: 0 0 24px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  font-weight: 800;
`;

const Input = styled.input`
  width: 100%;
  height: 44px;
  margin-bottom: 16px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: #0f0f13;
  color: #ffffff;
  outline: none;
`;

const Button = styled.button`
  width: 100%;
  height: 46px;
  margin-top: 6px;
  border: 0;
  border-radius: 10px;
  background: #6366f1;
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    cursor: progress;
    opacity: 0.72;
  }
`;

const ErrorText = styled.div`
  margin-top: 14px;
  color: #f87171;
  font-size: 13px;
`;

export function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@dinoisland.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/users/login', {
      body: JSON.stringify({ email, password }),
      credentials: 'same-origin',
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setLoading(false);
      setError(data?.message ?? 'Login failed');
      return;
    }

    if (data?.token) {
      document.cookie = `payload-token=${data.token}; path=/; samesite=lax`;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <Page>
      <Global />
      <Card onSubmit={onSubmit}>
        <Brand>
          <Mark>
            <FaLayerGroup />
          </Mark>
          MyCMS
        </Brand>
        <Title>Welcome back</Title>
        <Copy>Sign in with your Payload admin account.</Copy>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button disabled={loading} type="submit">
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
        {error ? <ErrorText>{error}</ErrorText> : null}
      </Card>
    </Page>
  );
}

'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useLocale, useTranslations } from 'next-intl';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth, type AuthUser } from '@/context/AuthContext';
import { useRouter } from '@/i18n/navigation';
import { theme } from '@/styles/theme';

type SectionKey = 'personal' | 'password';

const STORAGE_KEY = 'authUser';

const PageShell = styled.div`
  min-height: 100vh;
  padding-top: 58px;
  background: #1a1a1a;
  color: #fff;
`;

const Main = styled.main`
  width: min(100%, 1180px);
  min-height: calc(100vh - 58px);
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem);
`;

const Title = styled.h1`
  margin: 0 0 2rem;
  color: #fff;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-style: italic;
  font-weight: 900;
  text-transform: uppercase;
`;

const AccountGrid = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;
  align-items: start;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  overflow: hidden;
`;

const SidebarButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  background: ${(props) => (props.$active ? 'rgba(255, 106, 0, 0.1)' : 'transparent')};
  border: 0;
  border-left: 3px solid ${(props) => (props.$active ? theme.colors.primary.main : 'transparent')};
  color: ${(props) => (props.$active ? theme.colors.primary.main : 'rgba(255, 255, 255, 0.68)')};
  font-size: 0.86rem;
  font-weight: 800;
  text-align: left;
  cursor: pointer;
  transition: background ${theme.transitions.fast}, color ${theme.transitions.fast};

  &:hover {
    background: rgba(255, 106, 0, 0.08);
    color: ${theme.colors.primary.main};
  }
`;

const ContentPanel = styled.section`
  background: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: clamp(1.25rem, 3vw, 2rem);
`;

const SectionTitle = styled.h2`
  margin: 0 0 1.5rem;
  color: #fff;
  font-size: clamp(1.45rem, 2.5vw, 2rem);
  font-weight: 900;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.78rem;
  font-weight: 800;
`;

const ReadOnlyBox = styled.div`
  min-height: 46px;
  display: flex;
  align-items: center;
  padding: 0 0.9rem;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
`;

const PasswordForm = styled.form`
  display: grid;
  gap: 1rem;
  max-width: 520px;
`;

const Input = styled.input`
  height: 46px;
  padding: 0 0.9rem;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: border-color ${theme.transitions.fast};

  &:focus {
    border-color: rgba(255, 106, 0, 0.7);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  margin-top: 0.35rem;
  border: 0;
  border-radius: 6px;
  background: ${theme.colors.primary.main};
  color: #fff;
  font-size: 0.92rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  transition: background ${theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${theme.colors.primary.light};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const Message = styled.div<{ $error?: boolean }>`
  color: ${(props) => (props.$error ? '#ff6b6b' : '#6ee7a8')};
  font-size: 0.84rem;
  font-weight: 800;
`;

function maskEmail(email?: string | null) {
  if (!email) return '-';

  const [name, domain = ''] = email.split('@');
  const [domainName, ...suffixParts] = domain.split('.');
  const suffix = suffixParts.length ? `.${suffixParts.join('.')}` : '';
  const safeName = name.slice(0, 3);
  const safeDomain = domainName.slice(0, 2);

  return `${safeName}*****@${safeDomain}***${suffix}`;
}

function maskPhone(phone?: string | null) {
  if (!phone) return '-';
  if (phone.length <= 5) return phone;
  return `${phone.slice(0, 3)}*****${phone.slice(-2)}`;
}

function formatCreatedAt(value: string | undefined, locale: string) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export default function AccountPage() {
  const t = useTranslations('account');
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const [storedUser, setStoredUser] = useState<AuthUser | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('personal');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const rawUser = localStorage.getItem(STORAGE_KEY);
    if (!rawUser) {
      router.replace('/auth?mode=login');
      return;
    }

    try {
      setStoredUser(JSON.parse(rawUser) as AuthUser);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      router.replace('/auth?mode=login');
    }
  }, [router]);

  const currentUser = user ?? storedUser;

  const fields = useMemo(
    () => [
      { label: t('username'), value: currentUser?.username ?? '-' },
      { label: t('email'), value: maskEmail(currentUser?.email) },
      { label: t('phone'), value: maskPhone(currentUser?.phone) },
      { label: t('created_at'), value: formatCreatedAt(currentUser?.createdAt, locale) },
      { label: t('gold_coins'), value: (currentUser?.goldCoins ?? 0).toLocaleString(locale) },
      { label: t('gems'), value: (currentUser?.gems ?? 0).toLocaleString(locale) },
    ],
    [currentUser, locale, t]
  );

  const showMessage = (text: string, error = true) => {
    setMessage(text);
    setIsError(error);
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentUser?.id) {
      router.replace('/auth?mode=login');
      return;
    }

    if (newPassword.length < 6) {
      showMessage(t('error_password_min'));
      return;
    }

    if (newPassword === currentPassword) {
      showMessage(t('error_password_same'));
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage(t('error_password_mismatch'));
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          currentPassword,
          newPassword,
        }),
      });

      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        if (data.error === 'WRONG_PASSWORD') {
          showMessage(t('error_wrong_password'));
        } else {
          showMessage(t('error_password_failed'));
        }
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showMessage(t('success_password'), false);
    } catch {
      showMessage(t('error_password_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <Navbar onAuthClick={(type) => router.push(`/auth?mode=${type}`)} />
      <Main>
        <Title>{t('page_title')}</Title>
        <AccountGrid>
          <Sidebar>
            <SidebarButton type="button" $active={activeSection === 'personal'} onClick={() => setActiveSection('personal')}>
              {t('personal_info')}
            </SidebarButton>
            <SidebarButton type="button" $active={activeSection === 'password'} onClick={() => setActiveSection('password')}>
              {t('change_password')}
            </SidebarButton>
          </Sidebar>

          <ContentPanel>
            {activeSection === 'personal' ? (
              <>
                <SectionTitle>{t('personal_info')}</SectionTitle>
                <FieldGrid>
                  {fields.map((field) => (
                    <Field key={field.label}>
                      {field.label}
                      <ReadOnlyBox>{field.value}</ReadOnlyBox>
                    </Field>
                  ))}
                </FieldGrid>
              </>
            ) : (
              <>
                <SectionTitle>{t('change_password')}</SectionTitle>
                <PasswordForm onSubmit={handlePasswordSubmit}>
                  <Field>
                    {t('current_password')}
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      autoComplete="current-password"
                    />
                  </Field>
                  <Field>
                    {t('new_password')}
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      autoComplete="new-password"
                    />
                  </Field>
                  <Field>
                    {t('confirm_new_password')}
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      autoComplete="new-password"
                    />
                  </Field>
                  {message && <Message $error={isError}>{message}</Message>}
                  <SubmitButton type="submit" disabled={isSubmitting}>
                    {t('save_changes')}
                  </SubmitButton>
                </PasswordForm>
              </>
            )}
          </ContentPanel>
        </AccountGrid>
      </Main>
      <Footer />
    </PageShell>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { FaChevronRight } from '@react-icons/all-files/fa/FaChevronRight';
import { FaGamepad } from '@react-icons/all-files/fa/FaGamepad';
import { FaUser } from '@react-icons/all-files/fa/FaUser';
import { FaSignOutAlt } from '@react-icons/all-files/fa/FaSignOutAlt';
import { theme } from '@/styles/theme';
import { useAuth } from '@/context/AuthContext';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 58px;
  background: rgba(18, 19, 19, 0.96);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  padding: 0 clamp(1rem, 6vw, 5rem);
  z-index: 100;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.32);

  @media (max-width: ${theme.breakpoints.lg}) {
    padding: 0 ${theme.spacing.lg};
  }
`;

const LogoContainer = styled(Link)`
  width: 76px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  flex: 0 0 auto;
`;

const MarkWrap = styled.span`
  position: relative;
  width: 52px;
  height: 52px;
  display: block;
  opacity: 0.86;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(1.2rem, 2.5vw, 2rem);
  height: 100%;

  @media (max-width: ${theme.breakpoints.lg}) {
    gap: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }

  a {
    height: 100%;
    display: inline-flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.55);
    text-decoration: none;
    font-size: 0.75rem;
    font-weight: 600;
    transition: color ${theme.transitions.fast};
    text-transform: uppercase;
    position: relative;
    white-space: nowrap;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 17px;
      height: 2px;
      background: ${theme.colors.primary.main};
      transform: scaleX(0);
      transform-origin: left;
      transition: transform ${theme.transitions.normal};
    }

    &:hover,
    &.active {
      color: ${theme.colors.primary.main};

      &::after {
        transform: scaleX(1);
      }
    }
  }
`;

const NavActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
  margin-left: auto;

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: 0.35rem;
  }
`;

const LanguageWrapper = styled.div`
  position: relative;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const LanguageButton = styled.button<{ $open?: boolean }>`
  height: 26px;
  min-width: 124px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  padding: 0 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.58rem;
  font-weight: 500;
  cursor: pointer;

  svg {
    font-size: 0.48rem;
    transition: transform 0.2s ease;
    transform: ${(props) => (props.$open ? 'rotate(90deg)' : 'rotate(0deg)')};
  }
`;

const LanguageDropdown = styled.div<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 100%;
  background: #1a1b1b;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  overflow: hidden;
  z-index: 200;
  opacity: ${(props) => (props.$open ? 1 : 0)};
  pointer-events: ${(props) => (props.$open ? 'all' : 'none')};
  transform: ${(props) => (props.$open ? 'translateY(0)' : 'translateY(-6px)')};
  transition: opacity 0.15s ease, transform 0.15s ease;
`;

const LanguageOption = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${(props) => (props.$active ? 'rgba(255,255,255,0.06)' : 'transparent')};
  border: none;
  color: ${(props) => (props.$active ? '#fff' : 'rgba(255,255,255,0.65)')};
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  transition: background 0.12s ease, color 0.12s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  span.flag {
    font-size: 0.9rem;
    line-height: 1;
  }
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  height: 31px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 1rem;
  border: 0;
  border-radius: ${(props) => (props.$primary ? '0' : '3px')};
  background: ${(props) => (props.$primary ? '#e85d00' : '#111315')};
  color: #fff;
  font-size: 0.62rem;
  font-style: italic;
  font-weight: 800;
  text-transform: uppercase;
  clip-path: ${(props) =>
    props.$primary ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)' : 'none'};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  svg {
    color: ${(props) => (props.$primary ? '#fff' : 'rgba(255, 255, 255, 0.55)')};
    font-size: 0.72rem;
  }

  &:hover {
    background: ${(props) => (props.$primary ? '#ff6600' : '#1a1a1a')};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 0.7rem;

    span {
      display: none;
    }
  }
`;

const UserProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  height: 31px;
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
`;

const UserAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${theme.colors.primary.main};
`;

const UserUsername = styled.span`
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.primary.main};
  }
`;

const LANGUAGES = [
  { code: 'vi', label: 'Việt Nam', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
] as const;

interface NavbarProps {
  currentPage?: string;
  onAuthClick?: (type: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onAuthClick }) => {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('nav');
  const { isAuthenticated, user, logout } = useAuth();

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const activePage = currentPage ?? (
    pathname.startsWith('/arena')
      ? 'arena'
      : pathname.startsWith('/topup')
        ? 'topup'
        : pathname.startsWith('/support')
          ? 'support'
          : 'home'
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  const handleLogout = () => {
    logout();
  };

  return (
    <NavContainer>
      <LogoContainer href="/" aria-label={t('home')}>
        <MarkWrap>
          <Image src="/images/dinosaur-mark.png" alt="" fill sizes="52px" style={{ objectFit: 'contain' }} priority />
        </MarkWrap>
      </LogoContainer>

      <NavLinks>
        <Link href="/" className={activePage === 'home' ? 'active' : ''}>
          {t('home')}
        </Link>
        <Link href="/arena" className={activePage === 'arena' ? 'active' : ''}>
          {t('arena')}
        </Link>
        <Link href="/topup" className={activePage === 'topup' ? 'active' : ''}>
          {t('topup')}
        </Link>
        <Link href="/guide">{t('guide')}</Link>
        <Link href="/support" className={activePage === 'support' ? 'active' : ''}>
          {t('support')}
        </Link>
      </NavLinks>

      <NavActions>
        <LanguageWrapper ref={langRef}>
          <LanguageButton
            type="button"
            $open={langOpen}
            onClick={() => setLangOpen((v) => !v)}
          >
            <span>{currentLang.flag} {currentLang.label}</span>
            <FaChevronRight />
          </LanguageButton>

          <LanguageDropdown $open={langOpen}>
            {LANGUAGES.map((lang) => (
              <LanguageOption
                key={lang.code}
                $active={locale === lang.code}
                onClick={() => {
                  router.replace(pathname, { locale: lang.code });
                  setLangOpen(false);
                }}
              >
                <span className="flag">{lang.flag}</span>
                {lang.label}
              </LanguageOption>
            ))}
          </LanguageDropdown>
        </LanguageWrapper>

        {!isAuthenticated ? (
          <>
            <ActionButton type="button" onClick={() => onAuthClick?.('login')}>
              <FaUser />
              <span>{t('login')}</span>
            </ActionButton>
            <ActionButton type="button" $primary onClick={() => onAuthClick?.('register')}>
              <FaGamepad />
              <span>{t('register')}</span>
            </ActionButton>
          </>
        ) : (
          <UserProfileSection>
            {user?.avatar && <UserAvatar src={user.avatar} alt={user.username} />}
            <UserUsername>{user?.username}</UserUsername>
            <LogoutButton onClick={handleLogout} title={t('logout')}>
              <FaSignOutAlt />
            </LogoutButton>
          </UserProfileSection>
        )}
      </NavActions>
    </NavContainer>
  );
};

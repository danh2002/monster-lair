'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';
import { FaCalendar } from '@react-icons/all-files/fa/FaCalendar';
import { FaBullhorn } from '@react-icons/all-files/fa/FaBullhorn';
import { FaComments } from '@react-icons/all-files/fa/FaComments';
import { FaChevronDown } from '@react-icons/all-files/fa/FaChevronDown';
import { FaCog } from '@react-icons/all-files/fa/FaCog';
import { FaExternalLinkAlt } from '@react-icons/all-files/fa/FaExternalLinkAlt';
import { FaFolder } from '@react-icons/all-files/fa/FaFolder';
import { FaHistory } from '@react-icons/all-files/fa/FaHistory';
import { FaHome } from '@react-icons/all-files/fa/FaHome';
import { FaImage } from '@react-icons/all-files/fa/FaImage';
import { FaLayerGroup } from '@react-icons/all-files/fa/FaLayerGroup';
import { FaNewspaper } from '@react-icons/all-files/fa/FaNewspaper';
import { FaFileAlt } from '@react-icons/all-files/fa/FaFileAlt';
import { FaRegWindowRestore } from '@react-icons/all-files/fa/FaRegWindowRestore';
import { FaDragon } from '@react-icons/all-files/fa/FaDragon';
import { FaGift } from '@react-icons/all-files/fa/FaGift';
import { FaServer } from '@react-icons/all-files/fa/FaServer';
import { FaStickyNote } from '@react-icons/all-files/fa/FaStickyNote';
import { FaSignOutAlt } from '@react-icons/all-files/fa/FaSignOutAlt';
import { FaTag } from '@react-icons/all-files/fa/FaTag';
import { FaUsers } from '@react-icons/all-files/fa/FaUsers';

type User = {
  email?: string;
  name?: string;
};

const Aside = styled.aside`
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 20;
  display: flex;
  width: 240px;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  background: #13131a;

  @media (max-width: 820px) {
    display: none;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #6366f1;
  text-decoration: none;
`;

const LogoText = styled.span`
  color: #6366f1;
  font-size: 18px;
  font-weight: 800;
`;

const Nav = styled.nav`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 24px;
  padding: 18px 12px;
`;

const SectionLabel = styled.div`
  padding: 0 12px 8px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 0 12px;
  border-left: 3px solid ${({ $active }) => ($active ? '#6366f1' : 'transparent')};
  border-radius: 0 8px 8px 0;
  background: ${({ $active }) => ($active ? 'rgba(99,102,241,0.15)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : 'rgba(255,255,255,0.55)')};
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition:
    background 160ms ease,
    color 160ms ease;

  &:hover {
    background: ${({ $active }) => ($active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)')};
    color: #ffffff;
  }
`;

const UserWrap = styled.div`
  position: relative;
  margin: 12px;
`;

const UserCard = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  color: #ffffff;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

const Avatar = styled.div`
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  border-radius: 50%;
  background: #6366f1;
  color: #ffffff;
  font-weight: 800;
`;

const UserMeta = styled.div`
  min-width: 0;
  flex: 1;
`;

const UserName = styled.div`
  overflow: hidden;
  font-size: 13px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserEmail = styled.div`
  overflow: hidden;
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserMenu = styled.div`
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  left: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: #1a1a24;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.38);
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border: 0;
  background: transparent;
  color: #f87171;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  text-align: left;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  &:disabled {
    cursor: progress;
    opacity: 0.65;
  }
`;

const groups = [
  {
    label: 'Content',
    items: [
      { href: '/admin', icon: FaHome, label: 'Dashboard' },
      { href: '/admin/pages', icon: FaFileAlt, label: 'Pages' },
      { href: '/admin/posts', icon: FaNewspaper, label: 'Posts' },
      { href: '/admin/comments', icon: FaComments, label: 'Comments' },
      { href: '/admin/events', icon: FaCalendar, label: 'Events' },
      { href: '/admin/patch-notes', icon: FaStickyNote, label: 'Patch Notes' },
      { href: '/admin/dinosaurs', icon: FaDragon, label: 'Dinosaurs' },
      { href: '/admin/packages', icon: FaGift, label: 'Packages' },
      { href: '/admin/server-status', icon: FaServer, label: 'Server Status' },
      { href: '/admin/banners', icon: FaBullhorn, label: 'Banners' },
      { href: '/admin/popups', icon: FaRegWindowRestore, label: 'Popups' },
      { href: '/admin/categories', icon: FaFolder, label: 'Categories' },
      { href: '/admin/tags', icon: FaTag, label: 'Tags' },
      { href: '/admin/media', icon: FaImage, label: 'Media Library' },
      { href: '/admin/users', icon: FaUsers, label: 'Users' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/settings', icon: FaCog, label: 'Settings' },
      { href: '/admin/audit-logs', icon: FaHistory, label: 'Audit Logs' },
      { href: '/cms', icon: FaExternalLinkAlt, label: 'Payload Admin', external: true },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return href === '/admin' ? pathname === href : pathname.startsWith(href);
}

export function Sidebar({ user }: { user?: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const name = user?.name || user?.email?.split('@')[0] || 'Admin';
  const email = user?.email || 'admin@dinoisland.com';

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch('/api/admin/logout', {
        credentials: 'include',
        method: 'POST',
      });
    } finally {
      document.cookie = 'payload-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
      document.cookie = 'users-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
      router.replace('/admin/login');
      router.refresh();
    }
  }

  return (
    <Aside>
      <Logo href="/admin">
        <FaLayerGroup color="#6366f1" size={24} />
        <LogoText>MyCMS</LogoText>
      </Logo>
      <Nav>
        {groups.map((group) => (
          <div key={group.label}>
            <SectionLabel>{group.label}</SectionLabel>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavItem
                  href={item.href}
                  key={item.href}
                  target={item.external ? '_blank' : undefined}
                  $active={isActive(pathname, item.href)}
                >
                  <Icon />
                  {item.label}
                </NavItem>
              );
            })}
          </div>
        ))}
      </Nav>
      <UserWrap>
        {menuOpen ? (
          <UserMenu>
            <LogoutButton disabled={loggingOut} onClick={handleLogout} type="button">
              <FaSignOutAlt />
              {loggingOut ? 'Signing out...' : 'Dang xuat'}
            </LogoutButton>
          </UserMenu>
        ) : null}
        <UserCard aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} type="button">
          <Avatar>{name.charAt(0).toUpperCase()}</Avatar>
          <UserMeta>
            <UserName>{name}</UserName>
            <UserEmail>{email}</UserEmail>
          </UserMeta>
          <FaChevronDown color="rgba(255,255,255,0.35)" size={12} />
        </UserCard>
      </UserWrap>
    </Aside>
  );
}

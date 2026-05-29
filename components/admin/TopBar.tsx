'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaBell } from '@react-icons/all-files/fa/FaBell';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';

type User = {
  email?: string;
  name?: string;
};

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(260px, 460px) minmax(120px, 1fr);
  align-items: center;
  gap: 20px;
  min-height: 76px;
  padding: 0 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(15, 15, 19, 0.86);
  backdrop-filter: blur(18px);

  @media (max-width: 980px) {
    grid-template-columns: 1fr auto;
  }
`;

const Breadcrumb = styled.div`
  color: rgba(255, 255, 255, 0.35);
  font-size: 13px;
  font-weight: 700;
`;

const CrumbCurrent = styled.span`
  color: #ffffff;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 42px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.45);
  font-size: 13px;

  @media (max-width: 980px) {
    display: none;
  }
`;

const Shortcut = styled.span`
  margin-left: auto;
  padding: 3px 7px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.35);
  font-size: 11px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

const IconButton = styled.button`
  position: relative;
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  background: #1a1a24;
  color: rgba(255, 255, 255, 0.62);
  cursor: pointer;
`;

const Count = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  display: grid;
  min-width: 20px;
  height: 20px;
  place-items: center;
  padding: 0 5px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  font-weight: 900;
`;

const NotificationWrap = styled.div`
  position: relative;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 30;
  width: min(360px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  background: #1a1a24;
  box-shadow: 0 18px 50px rgba(0,0,0,0.45);
`;

const DropdownHeader = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  color: #fff;
  font-size: 13px;
  font-weight: 900;
`;

const NoticeLink = styled(Link)`
  display: block;
  padding: 11px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.72);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    background: rgba(255,255,255,0.05);
    color: #fff;
  }
`;

type NotificationItem = {
  href: string;
  label: string;
  type: string;
};

const Avatar = styled.div`
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 50%;
  background: #6366f1;
  color: #ffffff;
  font-weight: 800;
`;

function getBreadcrumb(pathname: string) {
  if (pathname === '/admin') return ['Dashboard'];

  return [
    'Dashboard',
    ...pathname
      .replace(/^\/admin\/?/, '')
      .split('/')
      .filter(Boolean)
      .map((part) =>
        part === 'new'
          ? 'New'
          : part
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' '),
      ),
  ];
}

export function TopBar({ user }: { user?: User | null }) {
  const pathname = usePathname();
  const breadcrumb = getBreadcrumb(pathname);
  const name = user?.name || user?.email || 'Admin';
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    fetch('/api/admin/notifications', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setCount(Number(data.count) || 0);
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch(() => {
        setCount(0);
        setItems([]);
      });
  }, []);

  return (
    <Bar>
      <Breadcrumb>
        {breadcrumb.map((crumb, index) =>
          index === breadcrumb.length - 1 ? (
            <CrumbCurrent key={`${crumb}-${index}`}>{crumb}</CrumbCurrent>
          ) : (
            <span key={`${crumb}-${index}`}>{crumb} &gt; </span>
          ),
        )}
      </Breadcrumb>
      <Search>
        <FaSearch />
        Search...
        <Shortcut>⌘K</Shortcut>
      </Search>
      <Actions>
        <NotificationWrap>
          <IconButton aria-label="Notifications" onClick={() => setOpen((value) => !value)} type="button">
            <FaBell />
            {count ? <Count>{count > 99 ? '99+' : count}</Count> : null}
          </IconButton>
          {open ? (
            <Dropdown>
              <DropdownHeader>Notifications ({count})</DropdownHeader>
              {items.length ? items.map((item, index) => <NoticeLink href={item.href} key={`${item.type}-${index}`}>{item.label}</NoticeLink>) : <DropdownHeader>No pending items</DropdownHeader>}
            </Dropdown>
          ) : null}
        </NotificationWrap>
        <Avatar>{name.charAt(0).toUpperCase()}</Avatar>
      </Actions>
    </Bar>
  );
}

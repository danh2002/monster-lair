'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

type FaqCategory = 'all' | 'account' | 'payment' | 'game' | 'tech';
type FaqItem = { cat: Exclude<FaqCategory, 'all'>; q: string; a: string };

// ─── Styled Components ────────────────────────────────────────────────────────

const Page = styled.div`
  position: relative;
  background: #0a0a0b;
  color: #f5f0e8;
  min-height: 100vh;
  overflow-x: hidden;
  padding-top: 58px;
`;

const Hero = styled.section`
  position: relative;
  min-height: 520px;
  padding: 120px 1rem 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  @media (max-width: 700px) {
    padding-top: 100px;
    min-height: 440px;
  }
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,101,10,0.18) 0%, transparent 70%),
    radial-gradient(ellipse 60% 40% at 20% 80%, rgba(100,20,0,0.3) 0%, transparent 60%),
    linear-gradient(180deg, #1a0d04 0%, #0a0a0b 100%);
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle 1px at 20% 30%, rgba(232,101,10,0.4) 0%, transparent 100%),
      radial-gradient(circle 1px at 80% 20%, rgba(232,101,10,0.3) 0%, transparent 100%),
      radial-gradient(circle 1px at 60% 70%, rgba(232,101,10,0.2) 0%, transparent 100%);
    background-size: 200px 200px, 300px 300px, 250px 250px;
  }
`;

const Container = styled.div`
  width: min(1160px, 100%);
  margin: 0 auto;
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 760px;
`;

const HeroLabel = styled.div`
  display: inline-block;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,140,46,1);
  background: rgba(232,101,10,0.1);
  border: 1px solid rgba(232,101,10,0.3);
  padding: 5px 16px;
  border-radius: 999px;
  margin-bottom: 1.25rem;
`;

const HeroTitle = styled.h1`
  font-size: clamp(52px, 8vw, 88px);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  span { color: rgba(255,140,46,1); }
`;

const HeroSub = styled.p`
  color: rgba(245,240,232,0.6);
  font-size: 17px;
  max-width: 520px;
  margin: 0 auto 2.5rem;
  line-height: 1.65;
`;

const SearchBar = styled.div`
  display: flex;
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  overflow: hidden;
  &:focus-within { border-color: rgba(232,101,10,0.5); }
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #f5f0e8;
  font-size: 15px;
  padding: 14px 10px;
  &::placeholder { color: rgba(245,240,232,0.35); }
`;

const SearchButton = styled.button`
  border: none;
  background: #e8650a;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 0 24px;
  cursor: pointer;
  letter-spacing: 0.04em;
  &:hover { background: #ff8c2e; }
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 1.25rem;
`;

const Tag = styled.button`
  font-size: 13px;
  color: rgba(245,240,232,0.6);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 4px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  &:hover { color: #ff8c2e; border-color: rgba(232,101,10,0.4); }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(232,101,10,0.3), transparent);
`;

const Section = styled.section`
  padding: 80px 1rem;
`;

const SectionLabel = styled.div`
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,140,46,1);
  margin-bottom: 0.6rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(36px, 5vw, 54px);
  font-weight: 900;
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0.02em;
  margin-bottom: 0.4rem;
  span { color: rgba(255,140,46,1); }
`;

const SectionSub = styled.p`
  color: rgba(245,240,232,0.6);
  font-size: 15px;
  max-width: 460px;
  line-height: 1.6;
  margin-bottom: 3rem;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
`;

const CategoryCard = styled.a`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 28px 24px;
  cursor: pointer;
  transition: background 0.25s, border-color 0.25s, transform 0.2s;
  display: flex;
  align-items: flex-start;
  gap: 18px;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  &:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(232,101,10,0.4);
    transform: translateY(-3px);
  }
`;

const CategoryIcon = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: rgba(232,101,10,0.1);
  border: 1px solid rgba(232,101,10,0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff8c2e;
`;

const CategoryInfo = styled.div`flex: 1;`;
const CategoryTitle = styled.div`
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  margin-bottom: 6px;
`;
const CategoryDesc = styled.div`
  color: rgba(245,240,232,0.6);
  font-size: 14px;
  line-height: 1.55;
`;
const CategoryCount = styled.span`
  font-size: 12px;
  color: rgba(255,140,46,1);
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-top: 10px;
  display: inline-block;
`;

const FaqSection = styled.section`
  background: rgba(255,255,255,0.015);
  padding: 80px 1rem;
`;

const FaqTabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: ${({ $active }) => ($active ? '#e8650a' : 'transparent')};
  border: 1px solid ${({ $active }) => ($active ? '#e8650a' : 'rgba(255,255,255,0.08)')};
  color: ${({ $active }) => ($active ? '#fff' : 'rgba(245,240,232,0.6)')};
  padding: 7px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: rgba(255,255,255,0.2); color: #f5f0e8; }
`;

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FaqCard = styled.div<{ $open?: boolean }>`
  background: rgba(255,255,255,0.04);
  border: 1px solid ${({ $open }) => ($open ? 'rgba(232,101,10,0.35)' : 'rgba(255,255,255,0.08)')};
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.25s;
`;

const FaqQuestion = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: #f5f0e8;
  text-align: left;
  gap: 16px;
`;

const PlusIcon = styled.span<{ $open?: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(232,101,10,0.25);
  background: rgba(232,101,10,0.08);
  color: #ff8c2e;
  transform: rotate(${({ $open }) => ($open ? 45 : 0)}deg);
  transition: transform 0.3s;
`;

const FaqAnswer = styled.div<{ $open?: boolean }>`
  max-height: ${({ $open }) => ($open ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
`;

const FaqAnswerInner = styled.div`
  padding: 14px 22px 18px;
  color: rgba(245,240,232,0.6);
  font-size: 15px;
  line-height: 1.7;
  border-top: 1px solid rgba(255,255,255,0.06);
`;

const GuidesSection = styled.section`padding: 80px 1rem;`;
const GuidesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
`;

const GuideCard = styled.div`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 28px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.25s, transform 0.25s, background 0.25s;
  &:hover {
    border-color: rgba(232,101,10,0.4);
    transform: translateY(-4px);
    background: rgba(255,255,255,0.07);
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #e8650a, #ff8c2e);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s;
  }
  &:hover::after { transform: scaleX(1); }
`;

const GuideNum = styled.div`
  font-size: 48px;
  font-weight: 900;
  color: rgba(232,101,10,0.12);
  line-height: 1;
  position: absolute;
  top: 16px;
  right: 20px;
  pointer-events: none;
`;

const GuideStepBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
`;

const GuideBadgePill = styled.span`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #e8650a;
  background: rgba(232,101,10,0.1);
  border: 1px solid rgba(232,101,10,0.22);
  padding: 3px 10px;
  border-radius: 4px;
`;

const GuideLine = styled.div`
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.06);
  width: 40px;
`;

const GuideTitle = styled.div`
  font-weight: 800;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
`;

const GuideDesc = styled.div`
  color: rgba(245,240,232,0.5);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 18px;
`;

const Steps = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
`;

const StepItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: rgba(245,240,232,0.6);
`;

const StepDot = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  background: rgba(232,101,10,0.12);
  border: 1px solid rgba(232,101,10,0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: #ff8c2e;
  margin-top: 1px;
`;

const ContactSection = styled.section`padding: 80px 1rem;`;
const ContactWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 60px;
  align-items: start;
  @media (max-width: 900px) { grid-template-columns: 1fr; gap: 36px; }
`;

const StickyInfo = styled.div`
  position: sticky;
  top: 90px;
  @media (max-width: 900px) { position: static; }
`;

const ContactTitle = styled.h2`
  font-size: 32px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.75rem;
  line-height: 1.1;
  span { color: #ff8c2e; }
`;

const ContactP = styled.p`
  color: rgba(245,240,232,0.6);
  font-size: 15px;
  line-height: 1.65;
  margin-bottom: 2rem;
`;

const Channels = styled.div`display: flex; flex-direction: column; gap: 12px;`;

const ChannelLink = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 14px 16px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s;
  &:hover { border-color: rgba(232,101,10,0.4); }
`;

const ChannelIcon = styled.div<{ $kind: 'email' | 'discord' | 'facebook' }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $kind }) =>
    $kind === 'email' ? 'rgba(59,130,246,0.12)' :
    $kind === 'discord' ? 'rgba(88,101,242,0.12)' :
    'rgba(24,119,242,0.12)'};
`;

const ChannelLabel = styled.div`
  font-size: 11px;
  color: rgba(245,240,232,0.35);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
`;

const ChannelValue = styled.div`font-size: 14px; color: #f5f0e8; font-weight: 600; margin-top: 2px;`;
const ChannelMeta = styled.div`font-size: 12px; color: rgba(255,140,46,0.8); margin-top: 2px;`;

const FormWrap = styled.div`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 36px;
  @media (max-width: 600px) { padding: 24px; }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const Field = styled.div<{ $hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(245,240,232,0.5);
    span { color: #e8650a; margin-left: 2px; }
  }
`;

const Control = styled.input<{ $error?: boolean }>`
  background: rgba(0,0,0,0.3);
  border: 1px solid ${({ $error }) => ($error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)')};
  border-radius: 8px;
  padding: 12px 14px;
  color: #f5f0e8;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  &:focus { border-color: rgba(232,101,10,0.5); background: rgba(232,101,10,0.04); }
  &::placeholder { color: rgba(245,240,232,0.25); }
`;

const ControlTextArea = styled.textarea<{ $error?: boolean }>`
  background: rgba(0,0,0,0.3);
  border: 1px solid ${({ $error }) => ($error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)')};
  border-radius: 8px;
  padding: 12px 14px;
  color: #f5f0e8;
  font-size: 15px;
  outline: none;
  resize: vertical;
  min-height: 130px;
  line-height: 1.6;
  transition: border-color 0.2s, background 0.2s;
  &:focus { border-color: rgba(232,101,10,0.5); background: rgba(232,101,10,0.04); }
  &::placeholder { color: rgba(245,240,232,0.25); }
`;

const ControlSelect = styled.select<{ $error?: boolean }>`
  background: rgba(0,0,0,0.3);
  border: 1px solid ${({ $error }) => ($error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)')};
  border-radius: 8px;
  padding: 12px 14px;
  color: #f5f0e8;
  font-size: 15px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  &:focus { border-color: rgba(232,101,10,0.5); background: rgba(232,101,10,0.04); }
  option { background: #1a1008; color: #f5f0e8; }
`;

const FieldErrorText = styled.span<{ $show?: boolean }>`
  font-size: 12px;
  color: #f87171;
  display: ${({ $show }) => ($show ? 'block' : 'none')};
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #e8650a;
  border: none;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  transition: background 0.2s, transform 0.15s;
  &:hover:not(:disabled) { background: #ff8c2e; transform: translateY(-1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const FormMsg = styled.div<{ $kind: 'success' | 'error' }>`
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  ${({ $kind }) =>
    $kind === 'success'
      ? 'background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25); color: #4ade80;'
      : 'background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #f87171;'}
`;

const Ico = ({ children, color = 'currentColor', size = 22 }: { children: React.ReactNode; color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// ─── Page Component ───────────────────────────────────────────────────────────

export default function SupportPage() {
  const router = useRouter();
  const t = useTranslations('support');

  const [activeTab, setActiveTab] = useState<FaqCategory>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const rawFaqs = t.raw('faq.items') as FaqItem[];

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rawFaqs.filter((x) => {
      const matchCat = activeTab === 'all' || x.cat === activeTab;
      if (!matchCat) return false;
      if (!q) return true;
      return `${x.q} ${x.a}`.toLowerCase().includes(q);
    });
  }, [activeTab, search, rawFaqs]);

  const [form, setForm] = useState({ name: '', email: '', subject: '', msg: '' });
  const [touched, setTouched] = useState({ name: false, email: false, subject: false, msg: false });
  const [submitting, setSubmitting] = useState(false);
  const [msgKind, setMsgKind] = useState<'success' | 'error' | null>(null);

  const errors = useMemo(() => ({
    name: form.name.trim().length < 2,
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    subject: form.subject === '',
    msg: form.msg.trim().length < 20,
  }), [form]);

  const hasError = Object.values(errors).some(Boolean);

  const handleSubmit = () => {
    setTouched({ name: true, email: true, subject: true, msg: true });
    if (hasError) return;
    setSubmitting(true);
    setMsgKind(null);
    setTimeout(() => {
      setSubmitting(false);
      if (Math.random() > 0.1) {
        setMsgKind('success');
        setForm({ name: '', email: '', subject: '', msg: '' });
        setTouched({ name: false, email: false, subject: false, msg: false });
      } else {
        setMsgKind('error');
      }
    }, 2000);
  };

  const tagCatMap: Record<string, FaqCategory> = {
    [t('hero.tags.0')]: 'payment',
    [t('hero.tags.1')]: 'account',
    [t('hero.tags.2')]: 'account',
    [t('hero.tags.3')]: 'payment',
    [t('hero.tags.4')]: 'tech',
  };

  const categoryDefs = [
    { key: 'faq',     tab: 'all' as FaqCategory,  href: '#faq',     icon: <Ico><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Ico> },
    { key: 'account', tab: 'account' as FaqCategory, href: '#faq',  icon: <Ico><circle cx="12" cy="8" r="3.5" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></Ico> },
    { key: 'payment', tab: 'payment' as FaqCategory, href: '#faq',  icon: <Ico><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /><line x1="6" y1="15" x2="9" y2="15" /></Ico> },
    { key: 'game',    tab: 'game' as FaqCategory,   href: '#faq',   icon: <Ico><rect x="2" y="7" width="20" height="12" rx="3" /><line x1="12" y1="11" x2="12" y2="15" /><line x1="10" y1="13" x2="14" y2="13" /></Ico> },
    { key: 'tech',    tab: 'tech' as FaqCategory,   href: '#faq',   icon: <Ico><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></Ico> },
    { key: 'contact', tab: null,                    href: '#contact',icon: <Ico><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Ico> },
  ];

  const guideItems = t.raw('guides.items') as { num: string; title: string; desc: string; steps: string[] }[];

  return (
    <>
      <Navbar currentPage="support" onAuthClick={(type) => router.push(`/auth?mode=${type}`)} />

      <Page>
        {/* HERO */}
        <Hero>
          <HeroBg />
          <HeroInner>
            <HeroLabel>{t('hero.label')}</HeroLabel>
            <HeroTitle>{t('hero.title1')} <span>{t('hero.title2')}</span></HeroTitle>
            <HeroSub>{t('hero.sub')}</HeroSub>
            <SearchBar>
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 14, paddingRight: 4 }}>
                <Ico size={18} color="rgba(245,240,232,0.35)">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" />
                </Ico>
              </div>
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                aria-label={t('hero.searchAriaLabel')}
              />
              <SearchButton type="button" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                {t('hero.searchBtn')}
              </SearchButton>
            </SearchBar>
            <TagRow>
              {(t.raw('hero.tags') as string[]).map((label) => (
                <Tag key={label} type="button" onClick={() => {
                  setActiveTab(tagCatMap[label] ?? 'all');
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}>
                  {label}
                </Tag>
              ))}
            </TagRow>
          </HeroInner>
        </Hero>

        <Divider />

        {/* CATEGORIES */}
        <Section>
          <Container>
            <SectionLabel>{t('categories.label')}</SectionLabel>
            <SectionTitle>{t('categories.title1')} <span>{t('categories.title2')}</span></SectionTitle>
            <SectionSub>{t('categories.sub')}</SectionSub>
            <CategoriesGrid>
              {categoryDefs.map((c) => (
                <Link key={c.key} href={c.href} scroll={false} style={{ textDecoration: 'none' }}>
                  <CategoryCard
                    onClick={() => {
                      if (c.tab) setActiveTab(c.tab);
                      else document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    aria-label={t(`categories.${c.key}.title`)}
                  >
                    <CategoryIcon>{c.icon}</CategoryIcon>
                    <CategoryInfo>
                      <CategoryTitle>{t(`categories.${c.key}.title`)}</CategoryTitle>
                      <CategoryDesc>{t(`categories.${c.key}.desc`)}</CategoryDesc>
                      <CategoryCount>{t(`categories.${c.key}.count`)}</CategoryCount>
                    </CategoryInfo>
                  </CategoryCard>
                </Link>
              ))}
            </CategoriesGrid>
          </Container>
        </Section>

        <Divider />

        {/* FAQ */}
        <FaqSection id="faq">
          <Container>
            <SectionLabel>{t('faq.label')}</SectionLabel>
            <SectionTitle>{t('faq.title1')} <span>{t('faq.title2')}</span></SectionTitle>
            <SectionSub>{t('faq.sub')}</SectionSub>
            <FaqTabs>
              {(['all', 'account', 'payment', 'game', 'tech'] as const).map((key) => (
                <TabButton key={key} $active={activeTab === key} type="button"
                  onClick={() => { setActiveTab(key); setOpenIndex(0); }}>
                  {t(`faq.tabs.${key}`)}
                </TabButton>
              ))}
            </FaqTabs>
            <FaqList>
              {filteredFaqs.length === 0 && (
                <div style={{ color: 'rgba(245,240,232,0.4)', padding: '20px 4px', fontSize: 15 }}>
                  {t('faq.noResult')}
                </div>
              )}
              {filteredFaqs.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <FaqCard key={`${item.cat}-${idx}`} $open={isOpen}>
                    <FaqQuestion type="button" onClick={() => setOpenIndex(isOpen ? null : idx)} aria-expanded={isOpen}>
                      <span>{item.q}</span>
                      <PlusIcon $open={isOpen}>
                        <Ico size={14} color="#ff8c2e">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </Ico>
                      </PlusIcon>
                    </FaqQuestion>
                    <FaqAnswer $open={isOpen}>
                      <FaqAnswerInner dangerouslySetInnerHTML={{ __html: item.a }} />
                    </FaqAnswer>
                  </FaqCard>
                );
              })}
            </FaqList>
          </Container>
        </FaqSection>

        <Divider />

        {/* GUIDES */}
        <GuidesSection id="guides">
          <Container>
            <SectionLabel>{t('guides.label')}</SectionLabel>
            <SectionTitle>{t('guides.title1')} <span>{t('guides.title2')}</span></SectionTitle>
            <SectionSub>{t('guides.sub')}</SectionSub>
            <GuidesGrid>
              {guideItems.map((g) => (
                <GuideCard key={g.num}>
                  <GuideNum>{g.num}</GuideNum>
                  <GuideStepBadge>
                    <GuideBadgePill>{t('guides.stepBadge')} {g.num}</GuideBadgePill>
                    <GuideLine />
                  </GuideStepBadge>
                  <GuideTitle>{g.title}</GuideTitle>
                  <GuideDesc>{g.desc}</GuideDesc>
                  <Steps>
                    {g.steps.map((s, i) => (
                      <StepItem key={i}><StepDot>{i + 1}</StepDot>{s}</StepItem>
                    ))}
                  </Steps>
                </GuideCard>
              ))}
            </GuidesGrid>
          </Container>
        </GuidesSection>

        <Divider />

        {/* CONTACT */}
        <ContactSection id="contact">
          <Container>
            <ContactWrap>
              <StickyInfo>
                <SectionLabel>{t('contact.label')}</SectionLabel>
                <ContactTitle>{t('contact.title1')} <span>{t('contact.title2')}</span></ContactTitle>
                <ContactP>{t('contact.desc')}</ContactP>
                <Channels>
                  {(['email', 'discord', 'facebook'] as const).map((kind) => (
                    <ChannelLink key={kind} href={kind === 'email' ? `mailto:${t(`contact.channels.${kind}.value`)}` : '#'} aria-label={t(`contact.channels.${kind}.label`)}>
                      <ChannelIcon $kind={kind}>
                        <Ico size={20} color={kind === 'email' ? '#60a5fa' : kind === 'discord' ? '#818cf8' : '#3b82f6'}>
                          {kind === 'email' && <><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></>}
                          {kind === 'discord' && <><path d="M9 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" fill="currentColor" stroke="none" /><path d="M8.5 4.5S6 5 4 8c-1 3-1 6-1 6s1.5 2 4 2.5l1-2s-1.5-.5-2-1.5c1 .5 2.5.5 6 .5s5-.2 6-.5c-.5 1-2 1.5-2 1.5l1 2c2.5-.5 4-2.5 4-2.5s0-3-1-6c-2-3-4.5-3.5-4.5-3.5L15 6H9L8.5 4.5z" /></>}
                          {kind === 'facebook' && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
                        </Ico>
                      </ChannelIcon>
                      <div>
                        <ChannelLabel>{t(`contact.channels.${kind}.label`)}</ChannelLabel>
                        <ChannelValue>{t(`contact.channels.${kind}.value`)}</ChannelValue>
                        <ChannelMeta>{t(`contact.channels.${kind}.meta`)}</ChannelMeta>
                      </div>
                    </ChannelLink>
                  ))}
                </Channels>
              </StickyInfo>

              <div>
                <FormWrap>
                  {msgKind === 'success' && <FormMsg $kind="success">{t('contact.form.successMsg')}</FormMsg>}
                  {msgKind === 'error' && <FormMsg $kind="error">{t('contact.form.errorMsg')}</FormMsg>}

                  <FormRow>
                    <Field $hasError={touched.name && errors.name}>
                      <label>{t('contact.form.nameLabel')} <span>*</span></label>
                      <Control value={form.name} $error={touched.name && errors.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                        placeholder={t('contact.form.namePlaceholder')} />
                      <FieldErrorText $show={touched.name && errors.name}>{t('contact.form.nameError')}</FieldErrorText>
                    </Field>
                    <Field $hasError={touched.email && errors.email}>
                      <label>{t('contact.form.emailLabel')} <span>*</span></label>
                      <Control value={form.email} type="email" $error={touched.email && errors.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                        placeholder={t('contact.form.emailPlaceholder')} />
                      <FieldErrorText $show={touched.email && errors.email}>{t('contact.form.emailError')}</FieldErrorText>
                    </Field>
                  </FormRow>

                  <Field $hasError={touched.subject && errors.subject}>
                    <label>{t('contact.form.subjectLabel')} <span>*</span></label>
                    <ControlSelect value={form.subject} $error={touched.subject && errors.subject}
                      onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                      onBlur={() => setTouched((p) => ({ ...p, subject: true }))}>
                      <option value="">{t('contact.form.subjectPlaceholder')}</option>
                      {(['account', 'payment', 'bug', 'gameplay', 'appeal', 'other'] as const).map((k) => (
                        <option key={k} value={k}>{t(`contact.form.subjectOptions.${k}`)}</option>
                      ))}
                    </ControlSelect>
                    <FieldErrorText $show={touched.subject && errors.subject}>{t('contact.form.subjectError')}</FieldErrorText>
                  </Field>

                  <Field $hasError={touched.msg && errors.msg}>
                    <label>{t('contact.form.msgLabel')} <span>*</span></label>
                    <ControlTextArea value={form.msg} $error={touched.msg && errors.msg}
                      onChange={(e) => setForm((p) => ({ ...p, msg: e.target.value }))}
                      onBlur={() => setTouched((p) => ({ ...p, msg: true }))}
                      placeholder={t('contact.form.msgPlaceholder')} />
                    <FieldErrorText $show={touched.msg && errors.msg}>{t('contact.form.msgError')}</FieldErrorText>
                  </Field>

                  <SubmitButton type="button" disabled={submitting} onClick={handleSubmit}>
                    {submitting && <Spinner />}
                    <span>{submitting ? t('contact.form.submitting') : t('contact.form.submitBtn')}</span>
                  </SubmitButton>
                </FormWrap>
              </div>
            </ContactWrap>
          </Container>
        </ContactSection>

        <div style={{ height: 40 }} />
      </Page>

      <Footer />
    </>
  );
}
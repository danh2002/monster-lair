'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

type FaqCategory = 'all' | 'account' | 'payment' | 'game' | 'tech';
type FaqItem = { cat: Exclude<FaqCategory, 'all'>; q: string; a: string };

const faqs: FaqItem[] = [
  {
    cat: 'account',
    q: 'Làm thế nào để khôi phục mật khẩu tài khoản?',
    a: `Truy cập trang đăng nhập và nhấp vào <strong>"Quên mật khẩu?"</strong>. Nhập số điện thoại hoặc email đã đăng ký. Bạn sẽ nhận được mã OTP trong vòng 2 phút. Nhập mã và đặt mật khẩu mới. Nếu không nhận được mã, hãy kiểm tra hộp thư rác hoặc liên hệ hỗ trợ trực tiếp.`,
  },
  {
    cat: 'account',
    q: 'Tài khoản của tôi bị khóa, phải làm gì?',
    a: `Tài khoản có thể bị khóa do vi phạm điều khoản sử dụng hoặc hoạt động bất thường. Vui lòng liên hệ đội hỗ trợ qua email <strong>support@daokhunglong.vn</strong> hoặc Discord để được xem xét và giải quyết trong vòng 48 giờ làm việc.`,
  },
  {
    cat: 'payment',
    q: 'Các phương thức thanh toán nào được hỗ trợ?',
    a: `Hiện tại Đảo Khủng Long hỗ trợ đầy đủ: <strong>Thẻ ATM nội địa, Visa/Mastercard, MoMo, ZaloPay, VNPay, thẻ cào điện thoại (Viettel, Vinaphone, Mobifone)</strong>. Chúng tôi liên tục cập nhật thêm phương thức thanh toán mới.`,
  },
  {
    cat: 'payment',
    q: 'Giao dịch thành công nhưng chưa nhận được xu, phải làm gì?',
    a: `Thông thường xu sẽ được cộng ngay lập tức. Trong một số trường hợp hiếm gặp, quá trình xử lý có thể mất đến <strong>15 phút</strong>. Nếu sau 30 phút vẫn chưa nhận, hãy kiểm tra lịch sử đơn hàng. Nếu giao dịch ở trạng thái "Pending", hãy chờ thêm. Nếu "Rejected", liên hệ hỗ trợ kèm mã đơn hàng để được xử lý.`,
  },
  {
    cat: 'game',
    q: 'Lôi Đài Chiến là gì và cách tham gia như thế nào?',
    a: `Lôi Đài Chiến là sự kiện PvP quy mô lớn, nơi các phe <strong>Hoá Long</strong> và <strong>Tu Tiên</strong> đối đầu nhau. Mỗi mùa giải kéo dài 10 ngày. Tham gia bằng cách đăng ký trong game, tích lũy điểm thông qua trận đấu và leo BXH để nhận phần thưởng xu độc quyền.`,
  },
  {
    cat: 'game',
    q: 'Làm sao để tải game về máy tính?',
    a: `Nhấn vào nút <strong>"Tải Game Miễn Phí"</strong> trên trang chủ. Chọn phiên bản phù hợp (Windows 10/11 64-bit, tối thiểu 8GB RAM, GPU NVIDIA GTX 1060 trở lên). File cài đặt khoảng 35GB. Sau khi tải xong, chạy installer và làm theo hướng dẫn.`,
  },
  {
    cat: 'tech',
    q: 'Game bị lag hoặc giật, cách khắc phục như thế nào?',
    a: `Thử các bước sau: <strong>1.</strong> Giảm chất lượng đồ họa trong Settings. <strong>2.</strong> Tắt các ứng dụng chạy ngầm. <strong>3.</strong> Kiểm tra kết nối mạng và đổi sang server gần nhất. <strong>4.</strong> Cập nhật driver GPU mới nhất. <strong>5.</strong> Xóa cache game trong thư mục cài đặt.`,
  },
  {
    cat: 'tech',
    q: 'Cấu hình máy tính tối thiểu để chơi game là gì?',
    a: `<strong>Tối thiểu:</strong> Windows 10 64-bit, CPU Intel i5-8400 / AMD Ryzen 5 2600, RAM 8GB, GPU NVIDIA GTX 1060 6GB, SSD 50GB trống.<br><br><strong>Đề xuất:</strong> CPU Intel i7-10700K / Ryzen 7 5800X, RAM 16GB, GPU RTX 3070 / RX 6700 XT để trải nghiệm tốt nhất ở 1080p 60fps.`,
  },
];

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

const GuidesSection = styled.section`
  padding: 80px 1rem;
`;

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

const ContactSection = styled.section`
  padding: 80px 1rem;
`;

const ContactWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 60px;
  align-items: start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
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

const Channels = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

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

const ChannelValue = styled.div`
  font-size: 14px;
  color: #f5f0e8;
  font-weight: 600;
  margin-top: 2px;
`;

const ChannelMeta = styled.div`
  font-size: 12px;
  color: rgba(255,140,46,0.8);
  margin-top: 2px;
`;

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
  &:focus {
    border-color: rgba(232,101,10,0.5);
    background: rgba(232,101,10,0.04);
  }
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
  &:focus {
    border-color: rgba(232,101,10,0.5);
    background: rgba(232,101,10,0.04);
  }
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
  &:focus {
    border-color: rgba(232,101,10,0.5);
    background: rgba(232,101,10,0.04);
  }
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

// ─── SVG Icon helpers ─────────────────────────────────────────────────────────

const Ico = ({ children, color = 'currentColor', size = 22 }: { children: React.ReactNode; color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// ─── Page Component ───────────────────────────────────────────────────────────

export default function SupportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FaqCategory>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqs.filter((x) => {
      const matchCat = activeTab === 'all' || x.cat === activeTab;
      if (!matchCat) return false;
      if (!q) return true;
      return `${x.q} ${x.a}`.toLowerCase().includes(q);
    });
  }, [activeTab, search]);

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

  const categories = [
    {
      tab: 'all' as FaqCategory, href: '#faq', count: '24 bài viết',
      title: 'Câu Hỏi Thường Gặp',
      desc: 'Giải đáp nhanh các thắc mắc phổ biến nhất từ cộng đồng người chơi.',
      icon: <Ico><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Ico>,
    },
    {
      tab: 'account' as FaqCategory, href: '#faq', count: '18 bài viết',
      title: 'Vấn Đề Tài Khoản',
      desc: 'Khôi phục tài khoản, đổi mật khẩu, xác minh danh tính và bảo mật.',
      icon: <Ico><circle cx="12" cy="8" r="3.5" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></Ico>,
    },
    {
      tab: 'payment' as FaqCategory, href: '#faq', count: '31 bài viết',
      title: 'Thanh Toán & Nạp Game',
      desc: 'Hướng dẫn nạp tiền, các phương thức thanh toán và xử lý giao dịch lỗi.',
      icon: <Ico><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /><line x1="6" y1="15" x2="9" y2="15" /></Ico>,
    },
    {
      tab: 'game' as FaqCategory, href: '#faq', count: '47 bài viết',
      title: 'Gameplay & Tính Năng',
      desc: 'Hướng dẫn chiến đấu, xây dựng quân đoàn, tham gia Lôi Đài Chiến.',
      icon: <Ico><rect x="2" y="7" width="20" height="12" rx="3" /><line x1="12" y1="11" x2="12" y2="15" /><line x1="10" y1="13" x2="14" y2="13" /></Ico>,
    },
    {
      tab: 'tech' as FaqCategory, href: '#faq', count: 'Gửi báo cáo',
      title: 'Báo Cáo Lỗi',
      desc: 'Gặp sự cố kỹ thuật? Gửi báo cáo lỗi để đội ngũ xử lý nhanh nhất.',
      icon: <Ico><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></Ico>,
    },
    {
      tab: null, href: '#contact', count: 'Phản hồi trong 24h',
      title: 'Liên Hệ Hỗ Trợ',
      desc: 'Không tìm thấy câu trả lời? Gửi yêu cầu trực tiếp đến đội hỗ trợ của chúng tôi.',
      icon: <Ico><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Ico>,
    },
  ];

  const guides = [
    {
      num: '01', title: 'Tạo Tài Khoản & Đăng Nhập',
      desc: 'Bắt đầu hành trình sinh tồn trong thế giới khủng long ngay hôm nay.',
      steps: ['Nhấn "Tạo Tài Khoản" trên menu', 'Nhập tên tài khoản & mật khẩu', 'Xác minh số điện thoại (OTP)', 'Hoàn tất & đăng nhập lần đầu'],
    },
    {
      num: '02', title: 'Nạp Game Lần Đầu',
      desc: 'Hỗ trợ đầy đủ phương thức thanh toán phổ biến tại Việt Nam.',
      steps: ['Truy cập trang "Nạp Game"', 'Chọn gói xu phù hợp', 'Chọn phương thức thanh toán', 'Nhận xu ngay lập tức'],
    },
    {
      num: '03', title: 'Tham Gia Lôi Đài Chiến',
      desc: 'Chiến đấu quy mô lớn giữa các phe phái để giành danh hiệu tối thượng.',
      steps: ['Đăng nhập & vào trang Lôi Đài', 'Xem thông tin mùa giải hiện tại', 'Chọn phe (Hoá Long / Tu Tiên)', 'Tham gia trận và tích điểm'],
    },
    {
      num: '04', title: 'Leo BXH Top Nạp',
      desc: 'Chinh phục bảng xếp hạng để nhận các phần thưởng độc quyền theo mùa.',
      steps: ['Nạp game để tích điểm BXH', 'Kiểm tra thứ hạng trên trang chủ', 'Top 3 nhận thưởng đặc biệt', 'Phần thưởng phát sau mùa kết thúc'],
    },
  ];

  return (
    <>
      <Navbar
        currentPage="support"
        onAuthClick={(type) => router.push(`/auth?mode=${type}`)}
      />

      <Page>

        {/* ── HERO ── */}
        <Hero>
          <HeroBg />
          <HeroInner>
            <HeroLabel>Trung Tâm Hỗ Trợ</HeroLabel>
            <HeroTitle>HỖ TRỢ &amp; <span>GIẢI ĐÁP</span></HeroTitle>
            <HeroSub>
              Tìm câu trả lời nhanh chóng cho mọi thắc mắc. Đội ngũ hỗ trợ luôn sẵn sàng đồng hành
              cùng bạn trên hành trình chinh phục Đảo Khủng Long.
            </HeroSub>
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
                placeholder="Tìm kiếm bài viết hỗ trợ..."
                aria-label="Tìm kiếm"
              />
              <SearchButton
                type="button"
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Tìm kiếm
              </SearchButton>
            </SearchBar>
            <TagRow>
              {(['Nạp game', 'Quên mật khẩu', 'Lỗi đăng nhập', 'Hoàn tiền', 'Báo lỗi'] as const).map((label) => {
                const map: Record<string, FaqCategory> = {
                  'Nạp game': 'payment', 'Quên mật khẩu': 'account',
                  'Lỗi đăng nhập': 'account', 'Hoàn tiền': 'payment', 'Báo lỗi': 'tech',
                };
                return (
                  <Tag key={label} type="button" onClick={() => {
                    setActiveTab(map[label]);
                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}>
                    {label}
                  </Tag>
                );
              })}
            </TagRow>
          </HeroInner>
        </Hero>

        <Divider />

        {/* ── CATEGORIES ── */}
        <Section>
          <Container>
            <SectionLabel>Danh mục hỗ trợ</SectionLabel>
            <SectionTitle>CHỌN <span>CHỦ ĐỀ</span></SectionTitle>
            <SectionSub>Chọn danh mục phù hợp để tìm câu trả lời nhanh nhất.</SectionSub>
            <CategoriesGrid>
              {categories.map((c) => (
                <Link key={c.title} href={c.href} scroll={false} style={{ textDecoration: 'none' }}>
                  <CategoryCard
                    onClick={() => {
                      if (c.tab) setActiveTab(c.tab);
                      else document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    aria-label={c.title}
                  >
                    <CategoryIcon>{c.icon}</CategoryIcon>
                    <CategoryInfo>
                      <CategoryTitle>{c.title}</CategoryTitle>
                      <CategoryDesc>{c.desc}</CategoryDesc>
                      <CategoryCount>{c.count}</CategoryCount>
                    </CategoryInfo>
                  </CategoryCard>
                </Link>
              ))}
            </CategoriesGrid>
          </Container>
        </Section>

        <Divider />

        {/* ── FAQ ── */}
        <FaqSection id="faq">
          <Container>
            <SectionLabel>Giải đáp thắc mắc</SectionLabel>
            <SectionTitle>CÂU HỎI <span>THƯỜNG GẶP</span></SectionTitle>
            <SectionSub>Những câu hỏi phổ biến nhất từ cộng đồng Đảo Khủng Long.</SectionSub>
            <FaqTabs>
              {([
                ['all', 'Tất cả'], ['account', 'Tài khoản'],
                ['payment', 'Thanh toán'], ['game', 'Gameplay'], ['tech', 'Kỹ thuật'],
              ] as const).map(([key, label]) => (
                <TabButton key={key} $active={activeTab === key} type="button"
                  onClick={() => { setActiveTab(key); setOpenIndex(0); }}>
                  {label}
                </TabButton>
              ))}
            </FaqTabs>
            <FaqList>
              {filteredFaqs.length === 0 && (
                <div style={{ color: 'rgba(245,240,232,0.4)', padding: '20px 4px', fontSize: 15 }}>
                  Không tìm thấy câu trả lời phù hợp.
                </div>
              )}
              {filteredFaqs.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <FaqCard key={`${item.cat}-${idx}`} $open={isOpen}>
                    <FaqQuestion type="button"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}>
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

        {/* ── GUIDES ── */}
        <GuidesSection id="guides">
          <Container>
            <SectionLabel>Hướng dẫn nhanh</SectionLabel>
            <SectionTitle>BẮT ĐẦU <span>DỄ DÀNG</span></SectionTitle>
            <SectionSub>Các hướng dẫn từng bước để làm quen với Đảo Khủng Long trong vài phút.</SectionSub>
            <GuidesGrid>
              {guides.map((g) => (
                <GuideCard key={g.num}>
                  <GuideNum>{g.num}</GuideNum>
                  <GuideStepBadge>
                    <GuideBadgePill>Bước {g.num}</GuideBadgePill>
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

        {/* ── CONTACT ── */}
        <ContactSection id="contact">
          <Container>
            <ContactWrap>
              <StickyInfo>
                <SectionLabel>Liên hệ trực tiếp</SectionLabel>
                <ContactTitle>CẦN THÊM <span>TRỢ GIÚP?</span></ContactTitle>
                <ContactP>
                  Không tìm thấy câu trả lời? Đội ngũ hỗ trợ tận tâm của chúng tôi luôn sẵn sàng
                  giải quyết mọi vấn đề của bạn.
                </ContactP>
                <Channels>
                  <ChannelLink href="mailto:support@daokhunglong.vn" aria-label="Email hỗ trợ">
                    <ChannelIcon $kind="email">
                      <Ico size={20} color="#60a5fa">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <polyline points="2,4 12,13 22,4" />
                      </Ico>
                    </ChannelIcon>
                    <div>
                      <ChannelLabel>Email hỗ trợ</ChannelLabel>
                      <ChannelValue>support@daokhunglong.vn</ChannelValue>
                      <ChannelMeta>Phản hồi trong 24h làm việc</ChannelMeta>
                    </div>
                  </ChannelLink>
                  <ChannelLink href="#" aria-label="Discord Server">
                    <ChannelIcon $kind="discord">
                      <Ico size={20} color="#818cf8">
                        <path d="M9 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" fill="currentColor" stroke="none" />
                        <path d="M8.5 4.5S6 5 4 8c-1 3-1 6-1 6s1.5 2 4 2.5l1-2s-1.5-.5-2-1.5c1 .5 2.5.5 6 .5s5-.2 6-.5c-.5 1-2 1.5-2 1.5l1 2c2.5-.5 4-2.5 4-2.5s0-3-1-6c-2-3-4.5-3.5-4.5-3.5L15 6H9L8.5 4.5z" />
                      </Ico>
                    </ChannelIcon>
                    <div>
                      <ChannelLabel>Discord Server</ChannelLabel>
                      <ChannelValue>discord.gg/daokhunglong</ChannelValue>
                      <ChannelMeta>Hỗ trợ trực tuyến 24/7</ChannelMeta>
                    </div>
                  </ChannelLink>
                  <ChannelLink href="#" aria-label="Facebook Fanpage">
                    <ChannelIcon $kind="facebook">
                      <Ico size={20} color="#3b82f6">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </Ico>
                    </ChannelIcon>
                    <div>
                      <ChannelLabel>Facebook Fanpage</ChannelLabel>
                      <ChannelValue>fb.com/DaoKhungLongVN</ChannelValue>
                      <ChannelMeta>Cập nhật tin tức mới nhất</ChannelMeta>
                    </div>
                  </ChannelLink>
                </Channels>
              </StickyInfo>

              <div>
                <FormWrap>
                  {msgKind === 'success' && (
                    <FormMsg $kind="success">
                      Yêu cầu hỗ trợ đã được gửi thành công. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
                    </FormMsg>
                  )}
                  {msgKind === 'error' && (
                    <FormMsg $kind="error">
                      Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin và thử lại.
                    </FormMsg>
                  )}

                  <FormRow>
                    <Field $hasError={touched.name && errors.name}>
                      <label>Họ và tên <span>*</span></label>
                      <Control value={form.name} $error={touched.name && errors.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                        placeholder="Nguyễn Văn A" />
                      <FieldErrorText $show={touched.name && errors.name}>Vui lòng nhập họ và tên.</FieldErrorText>
                    </Field>
                    <Field $hasError={touched.email && errors.email}>
                      <label>Email <span>*</span></label>
                      <Control value={form.email} type="email" $error={touched.email && errors.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                        placeholder="example@gmail.com" />
                      <FieldErrorText $show={touched.email && errors.email}>Vui lòng nhập email hợp lệ.</FieldErrorText>
                    </Field>
                  </FormRow>

                  <Field $hasError={touched.subject && errors.subject}>
                    <label>Chủ đề <span>*</span></label>
                    <ControlSelect value={form.subject} $error={touched.subject && errors.subject}
                      onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                      onBlur={() => setTouched((p) => ({ ...p, subject: true }))}>
                      <option value="">-- Chọn chủ đề --</option>
                      <option value="account">Vấn đề tài khoản</option>
                      <option value="payment">Thanh toán / Nạp game</option>
                      <option value="bug">Báo cáo lỗi kỹ thuật</option>
                      <option value="gameplay">Hỏi về gameplay / tính năng</option>
                      <option value="appeal">Kháng cáo lệnh cấm</option>
                      <option value="other">Khác</option>
                    </ControlSelect>
                    <FieldErrorText $show={touched.subject && errors.subject}>Vui lòng chọn chủ đề.</FieldErrorText>
                  </Field>

                  <Field $hasError={touched.msg && errors.msg}>
                    <label>Nội dung <span>*</span></label>
                    <ControlTextArea value={form.msg} $error={touched.msg && errors.msg}
                      onChange={(e) => setForm((p) => ({ ...p, msg: e.target.value }))}
                      onBlur={() => setTouched((p) => ({ ...p, msg: true }))}
                      placeholder="Mô tả chi tiết vấn đề bạn gặp phải. Bao gồm tên tài khoản, thời điểm xảy ra sự cố..." />
                    <FieldErrorText $show={touched.msg && errors.msg}>Vui lòng nhập nội dung (tối thiểu 20 ký tự).</FieldErrorText>
                  </Field>

                  <SubmitButton type="button" disabled={submitting} onClick={handleSubmit}>
                    {submitting && <Spinner />}
                    <span>{submitting ? 'Đang gửi...' : 'Gửi yêu cầu hỗ trợ'}</span>
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
'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { TopupPricingCard } from '@/components/game/TopupPricingCard';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FaChevronDown } from '@react-icons/all-files/fa/FaChevronDown';
import Link from 'next/link';
import { FaRegClock } from '@react-icons/all-files/fa/FaRegClock';


const PageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  isolation: isolate;
  min-height: 100vh;
  background: #0d0d0d;
  padding-top: 58px;
  font-family: 'Inter', 'Google Sans', sans-serif;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -3;
    background-image: url('/images/feature-war.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.25;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(13, 13, 13, 0.95) 50%, rgba(0, 0, 0, 0.9) 100%);
  }
`;

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px 60px 40px;
  width: 100%;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: 50px 30px 50px 30px;
  }

  @media (max-width: 768px) {
    padding: 40px 20px 40px 20px;
  }
`;

const PreTitle = styled.div`
  text-align: center;
  color: ${theme.colors.primary.main};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
`;

const PageTitle = styled.h1`
  font-size: clamp(3rem, 8vw, 5rem);
  text-align: center;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 900;
  font-style: italic;
  color: #fff;
  line-height: 1.1;

  span {
    color: ${theme.colors.primary.main};
    background: none;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin-top: 24px;
  margin-bottom: 0;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  letter-spacing: 0.5px;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 60px;
  margin-bottom: 60px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const ServerSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ServerSelectLabel = styled.label`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ServerSelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const ServerSelect = styled.select`
  width: 100%;
  padding: 14px 40px 14px 16px;
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  appearance: none;
  font-family: 'Inter', 'Google Sans', sans-serif;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(30, 30, 30, 0.95);
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    background: rgba(30, 30, 30, 0.95);
    box-shadow: 0 0 12px rgba(255, 106, 0, 0.2);
  }

  option {
    background: #1a1a1a;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
  }

  option:checked {
    background: linear-gradient(${theme.colors.primary.main}, ${theme.colors.primary.main});
    color: #fff;
  }
`;

const ServerSelectChevron = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  svg {
    width: 16px;
    height: 16px;
  }
`;


const PricingPackages = [
  {
    title: 'GÓI KHỞI ĐẦU',
    price: '130.000',
    gems: 50,
    image: '/images/goikhoidau.png',
    badge: 'PHỐ BIẾN NHẤT',
  },
  {
    title: 'GÓI KHỦNG LONG CHIẾN',
    price: '250.000',
    gems: 100,
    image: '/images/goikhunglongchien.png',
    badge: '',
  },
  {
    title: 'GÓI CHÚA TỂ ĐẢO HOANG',
    price: '2.200.000',
    gems: 1000,
    image: '/images/goichuatedaohoang.png',
    badge: '',
  },
  {
    title: 'GÓI CHÍ TÔN KHỦNG LONG TIỀN SỬ',
    price: '9.000.000',
    gems: 5000,
    image: '/images/goichitonkhunglongtiensu.png',
    badge: '',
  },
];

export default function TopUpPage() {
  const [selectedPackage, setSelectedPackage] = useState<(typeof PricingPackages)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string>('');

  const handlePurchase = (pkg: (typeof PricingPackages)[0]) => {
    setSelectedPackage(pkg);
    setSelectedServer('');
    setIsModalOpen(true);
  };

  return (
    <PageWrapper>
      <PageContainer>
        <PreTitle>Chọn gói nạp</PreTitle>
        <PageTitle>
          NẠP GAME <span>NGAY</span>
        </PageTitle>
        <Subtitle>Hỗ trợ đầy đủ tất cả phương thức thanh toán</Subtitle>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28, marginBottom: 24 }}>
          <Link href="/orders" style={{ textDecoration: 'none' }} aria-label="Xem lịch sử đơn hàng">
            <Button variant="secondary">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <FaRegClock />
                Lịch sử đơn hàng
              </span>
            </Button>
          </Link>
        </div>

        <PricingGrid>

          {PricingPackages.map((pkg, idx) => (
            <TopupPricingCard
              key={idx}
              title={pkg.title}
              price={pkg.price}
              gems={pkg.gems}
              image={pkg.image}
              badge={pkg.badge || undefined}
              onClick={() => handlePurchase(pkg)}
            />
          ))}
        </PricingGrid>
      </PageContainer>

      <Modal
        isOpen={isModalOpen}
        title={`Thanh Toán - ${selectedPackage?.title}`}
        onClose={() => setIsModalOpen(false)}
        width="90%"
      >
        <ModalContent>
          <div>
            <h3 style={{ color: theme.colors.text.primary, marginBottom: theme.spacing.lg }}>
              Thông Tin Gói Nạp
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.lg }}>
              <div>
                <p style={{ color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.sm }}>
                  Gói
                </p>
                <p style={{ color: theme.colors.text.primary, fontSize: theme.typography.fontSize.lg, fontWeight: 700 }}>
                  {selectedPackage?.title}
                </p>
                </div>
              </div>
            </div>

            <div>
                <p style={{ color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.sm }}>
                  Gems Nhận
                </p>
                <p style={{ color: theme.colors.text.primary, fontSize: theme.typography.fontSize.lg, fontWeight: 700 }}>
                  +{selectedPackage?.gems} Gems
                </p>
                </div>

              <div>
                <h3 style={{ color: theme.colors.text.primary, marginBottom: theme.spacing.lg }}>
              Phương Thức Thanh Toán
            </h3>
            <ServerSelectWrapper>
              <ServerSelectLabel htmlFor="server-select">Chọn máy chủ</ServerSelectLabel>
              <ServerSelectContainer>
                <ServerSelect
                  id="server-select"
                  value={selectedServer}
                  onChange={(e) => setSelectedServer(e.target.value)}
                >
                  <option value="">Chọn máy chủ của bạn</option>
                  <option value="quan-doan-chien">Quân Đoàn Chiến</option>
                  <option value="khung-long-chi-chien">Khủng Long Chi Chiến</option>
                </ServerSelect>
                <ServerSelectChevron>
                  <FaChevronDown />
                </ServerSelectChevron>
              </ServerSelectContainer>
            </ServerSelectWrapper>
          </div>

          <div style={{ display: 'flex', gap: theme.spacing.lg }}>
            <Button variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" fullWidth onClick={() => setIsModalOpen(false)}>
              Tiến Hành Thanh Toán
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </PageWrapper>
    
  );
}

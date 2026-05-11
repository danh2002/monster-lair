'use client';

import styled from 'styled-components';
import Image from 'next/image';
import { FaCode } from '@react-icons/all-files/fa/FaCode';
import { FaDiscord } from '@react-icons/all-files/fa/FaDiscord';
import { FaFacebookF } from '@react-icons/all-files/fa/FaFacebookF';
import { FaGlobe } from '@react-icons/all-files/fa/FaGlobe';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { theme } from '@/styles/theme';

const footerColumns = [
  {
    title: 'Game',
    links: ['Tải Game', 'Patch Notes', 'Lộ trình', 'Phân Hạng', 'Mùa Giải'],
  },
  {
    title: 'Cộng đồng',
    links: ['Discord Server', 'Diễn đàn', 'Hướng dẫn', 'Fanart', 'Streamer'],
  },
  {
    title: 'Hỗ trợ',
    links: ['Trung tâm hỗ trợ', 'Báo lỗi', 'Điều khoản', 'Bảo mật', 'Liên hệ'],
  },
];

const FooterContainer = styled.footer`
  background: #030303;
  border-top: 1px solid rgba(255, 106, 0, 0.18);
  color: rgba(255, 255, 255, 0.45);
`;

const FooterInner = styled.div`
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: clamp(3.4rem, 6vw, 5.2rem) clamp(1rem, 3vw, 2rem) 2rem;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: minmax(270px, 1.45fr) repeat(3, minmax(150px, 1fr));
  gap: clamp(2rem, 5vw, 5.6rem);
  padding-bottom: 3.8rem;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const BrandBlock = styled.div`
  max-width: 360px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.4rem;
  color: #fff;
  font-size: clamp(1.55rem, 3vw, 2.15rem);
  font-weight: 900;
  letter-spacing: 0.02rem;
  text-transform: uppercase;
`;

const BrandMark = styled.div`
  position: relative;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  opacity: 0.9;
`;

const BrandText = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.46);
  font-size: 0.94rem;
  line-height: 1.75;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const SocialButton = styled.a`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17191d;
  color: rgba(255, 255, 255, 0.62);
  text-decoration: none;
  clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 0 100%);
  transition:
    background ${theme.transitions.fast},
    color ${theme.transitions.fast},
    transform ${theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    background: ${theme.colors.primary.main};
    color: #fff;
  }
`;

const FooterColumn = styled.div`
  h3 {
    margin: 0 0 1.7rem;
    color: #fff;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: 0.18rem;
    text-transform: uppercase;
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.88rem;
  }

  a {
    color: rgba(255, 255, 255, 0.42);
    text-decoration: none;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primary.main};
    }
  }
`;

const FooterBottom = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: center;
  padding-top: 1.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.35rem;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 54px;
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06rem;

  strong {
    display: block;
    color: #fff;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.13rem;
  }
`;

const BadgeIcon = styled.div<{ $accent?: boolean }>`
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => (props.$accent ? 'rgba(255, 106, 0, 0.62)' : 'rgba(255, 255, 255, 0.15)')};
  background: rgba(255, 255, 255, 0.04);
  color: ${(props) => (props.$accent ? theme.colors.primary.main : '#fff')};
  font-weight: 900;
`;

const Copyright = styled.div`
  text-align: right;
  color: rgba(255, 255, 255, 0.34);
  font-size: 0.78rem;
  line-height: 1.8;

  @media (max-width: ${theme.breakpoints.lg}) {
    text-align: left;
  }
`;

export const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterInner>
        <FooterTop>
          <BrandBlock>
            <Brand>
              <BrandMark>
                <Image src="/images/dinosaur-mark.png" alt="" fill sizes="42px" style={{ objectFit: 'contain' }} />
              </BrandMark>
              Đảo Khủng Long
            </Brand>
            <BrandText>Trò chơi sinh tồn khủng long AAA thế hệ tiếp theo. Powered by Unreal Engine 5. Survive. Hunt. Dominate.</BrandText>
            <SocialRow>
              <SocialButton href="#facebook" aria-label="Facebook">
                <FaFacebookF />
              </SocialButton>
              <SocialButton href="#community" aria-label="Community">
                ⌾
              </SocialButton>
              <SocialButton href="#youtube" aria-label="Youtube">
                <FaPlay />
              </SocialButton>
              <SocialButton href="#discord" aria-label="Discord">
                <FaDiscord />
              </SocialButton>
              <SocialButton href="#tiktok" aria-label="Tiktok">
                ♪
              </SocialButton>
            </SocialRow>
          </BrandBlock>

          {footerColumns.map((column) => (
            <FooterColumn key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#footer">{link}</a>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          ))}
        </FooterTop>

        <FooterBottom>
          <Badges>
            <Badge>
              <BadgeIcon>T</BadgeIcon>
              <span>
                <strong>ESRB</strong>
                Teen
              </span>
            </Badge>
            <Badge>
              <BadgeIcon $accent>12</BadgeIcon>
              <span>
                <strong>PEGI</strong>
                Rated
              </span>
            </Badge>
            <Badge>
              <BadgeIcon $accent>
                <FaCode />
              </BadgeIcon>
              <span>
                <strong>Primal Studios</strong>
                Developer
              </span>
            </Badge>
            <Badge>
              <BadgeIcon $accent>
                <FaGlobe />
              </BadgeIcon>
              <span>
                <strong>Nexus Games</strong>
                Publisher
              </span>
            </Badge>
          </Badges>

          <Copyright>
            © 2025 Monster Lair. All Rights Reserved.
            <br />
            Unreal® Engine 5. All trademarks are property of their respective owners.
          </Copyright>
        </FooterBottom>
      </FooterInner>
    </FooterContainer>
  );
};

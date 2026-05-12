'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/styles/theme';
import { AiOutlineEye } from '@react-icons/all-files/ai/AiOutlineEye';
import { AiOutlineEyeInvisible } from '@react-icons/all-files/ai/AiOutlineEyeInvisible';
import { useTranslations } from 'next-intl';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

const FormContainer = styled.div`
  background: linear-gradient(135deg, rgba(180, 100, 40, 0.25), rgba(200, 120, 50, 0.15));
  backdrop-filter: blur(10px);
  border: 2px solid rgba(220, 140, 80, 0.3);
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const LogoArea = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const FormTitle = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const FormSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  margin: 0;
  font-weight: 500;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputFieldWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const InputField = styled.input`
  width: 100%;
  padding: 14px 40px 14px 42px;
  background: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: all ${theme.transitions.normal};
  font-family: 'Inter', 'Google Sans', sans-serif;

  &::placeholder {
    color: rgba(51, 51, 51, 0.6);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.2);
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const VerificationFieldWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const VerificationInput = styled.input`
  width: 100%;
  padding: 14px 170px 14px 42px;
  background: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: all ${theme.transitions.normal};
  font-family: 'Inter', 'Google Sans', sans-serif;

  &::placeholder {
    color: rgba(51, 51, 51, 0.6);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.2);
  }
`;

const VerificationButton = styled.button`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: #ff6a00;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 10px 12px;
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    background: #ff7700;
    box-shadow: 0 8px 20px rgba(255, 106, 0, 0.3);
  }

  &:active {
    transform: translateY(-50%) scale(0.98);
  }
`;

const VisibilityToggle = styled.button`
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(51, 51, 51, 0.6);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color ${theme.transitions.normal};

  &:hover {
    color: rgba(51, 51, 51, 0.9);
  }
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, ${theme.colors.primary.main}, #ff7700);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Inter', 'Google Sans', sans-serif;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%);

  &:hover {
    background: linear-gradient(135deg, #ff7722, #ff5500);
    box-shadow: 0 8px 24px rgba(255, 106, 0, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(135deg, #999, #777);
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  margin-top: 20px;

  a {
    color: ${theme.colors.primary.main};
    font-weight: 700;
    cursor: pointer;
    transition: color ${theme.transitions.normal};
    border-bottom: 1px solid transparent;

    &:hover {
      color: #ff9944;
      border-bottom-color: #ff9944;
    }
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 12px;
  margin: 0;
  padding: 8px 12px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
  border-left: 3px solid #ff6b6b;
`;

const SuccessMessage = styled.p`
  color: #00cc00;
  font-size: 12px;
  margin: 0;
  padding: 8px 12px;
  background: rgba(0, 204, 0, 0.1);
  border-radius: 4px;
  border-left: 3px solid #00cc00;
`;

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth();
  const t = useTranslations('auth');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    verificationCode: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username || !formData.email || !formData.password || !formData.phone) {
      setError(t('errorRegisterRequired'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('errorRegisterPasswordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('errorRegisterPasswordMin'));
      return;
    }

    if (!formData.verificationCode) {
      setError(t('errorRegisterVerificationRequired'));
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.username, formData.email, formData.password, formData.phone);
      setSuccess(t('successRegister'));
      setTimeout(() => {
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          verificationCode: '',
        });
      }, 1500);
    } catch {
      setError(t('errorRegisterFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetVerificationCode = () => {
    if (!formData.phone) {
      setError(t('errorRegisterPhoneRequired'));
      return;
    }
    setSuccess(t('verificationSent', { phone: formData.phone }));
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <FormContainer>
      <HeaderSection>
        <LogoArea>
          <Image
            src="/images/logo.png"
            alt={t('registerLogoAlt')}
            width={120}
            height={120}
            priority
            style={{ objectFit: 'contain' }}
          />
        </LogoArea>

        <FormTitle>{t('registerTitle')}</FormTitle>
        <FormSubtitle>{t('registerSubtitle')}</FormSubtitle>
      </HeaderSection>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <InputFieldWrapper>
            <InputIcon>
              <Image src="/images/user.png" alt={t('userAlt')} width={18} height={18} />
            </InputIcon>
            <InputField
              type="text"
              name="username"
              placeholder={t('username')}
              value={formData.username}
              onChange={handleChange}
            />
          </InputFieldWrapper>

          <InputFieldWrapper>
            <InputIcon>
              <Image
                src="/images/padlock.png"
                alt={t('passwordAlt')}
                width={18}
                height={18}
              />
            </InputIcon>
            <InputField
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder={t('password')}
              value={formData.password}
              onChange={handleChange}
            />
            <VisibilityToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? t('visibilityHide') : t('visibilityShow')}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </VisibilityToggle>
          </InputFieldWrapper>

          <InputFieldWrapper>
            <InputIcon>
              <Image
                src="/images/padlock.png"
                alt={t('confirmPasswordAlt')}
                width={18}
                height={18}
              />
            </InputIcon>
            <InputField
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder={t('confirmPassword')}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <VisibilityToggle
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title={showConfirmPassword ? t('visibilityHide') : t('visibilityShow')}
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </VisibilityToggle>
          </InputFieldWrapper>

          <InputFieldWrapper>
            <InputIcon>
              <Image
                src="/images/phone-call.png"
                alt={t('phoneAlt')}
                width={18}
                height={18}
                priority
              />
            </InputIcon>
            <InputField
              type="tel"
              name="phone"
              placeholder={t('phone')}
              value={formData.phone}
              onChange={handleChange}
            />
          </InputFieldWrapper>

          <VerificationFieldWrapper>
            <InputIcon style={{ left: 14, zIndex: 2 }}>
              <Image
                src="/images/OTP.png"
                alt={t('otpAlt')}
                width={18}
                height={18}
                priority
              />
            </InputIcon>
            <VerificationInput
              type="text"
              name="verificationCode"
              placeholder={t('verificationCode')}
              value={formData.verificationCode}
              onChange={handleChange}
              maxLength={6}
            />
            <VerificationButton type="button" onClick={handleGetVerificationCode}>
              {t('getVerificationCode')}
            </VerificationButton>
          </VerificationFieldWrapper>

          <RegisterButton type="submit" disabled={isLoading}>
            {isLoading ? t('registerLoading') : t('registerButton')}
          </RegisterButton>

          <LoginLink>
            {t('signupPrompt')}{' '}
            <a onClick={onSwitchToLogin}>{t('switchToLogin')}</a>
          </LoginLink>
        </FormGroup>
      </form>
    </FormContainer>
  );
}

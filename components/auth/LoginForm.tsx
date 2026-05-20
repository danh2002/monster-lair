'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/styles/theme';
import { AiOutlineEye } from '@react-icons/all-files/ai/AiOutlineEye';
import { AiOutlineEyeInvisible } from '@react-icons/all-files/ai/AiOutlineEyeInvisible';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
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
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;

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
  /* leave space for left icon + keep room for right visibility toggle */
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

const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  cursor: pointer;
  user-select: none;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: ${theme.colors.primary.main};
  }
`;

const ForgotPasswordLink = styled.a`
  color: ${theme.colors.primary.main};
  font-size: 13px;
  text-decoration: none;
  cursor: pointer;
  transition: color ${theme.transitions.normal};
  font-weight: 600;

  &:hover {
    color: #ff9944;
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
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

const SignUpLink = styled.div`
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

function getLoginErrorMessage(error: unknown, t: ReturnType<typeof useTranslations<'auth'>>) {
  if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
    return t('errorInvalidCredentials');
  }

  return t('errorLoginInvalid');
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth();
  const t = useTranslations('auth');
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

    if (!formData.username || !formData.password) {
      setError(t('errorLoginRequired'));
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.username, formData.password);
      setSuccess(t('successLogin'));
      setFormData({ username: '', password: '' });
      if (rememberMe) {
        localStorage.setItem('rememberMe', formData.username);
      }
      router.push('/');
    } catch (err) {
      setError(getLoginErrorMessage(err, t));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.username) {
      setError(t('errorLoginUsernameRequired'));
      return;
    }
    setSuccess(t('forgotSuccess'));
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <FormContainer>
      <HeaderSection>
        <LogoArea>
          <Image
            src="/images/logo.png"
            alt={t('loginLogoAlt')}
            width={96}
            height={96}
            priority
            style={{ objectFit: 'contain' }}
          />
        </LogoArea>

        <FormTitle>{t('loginTitle')}</FormTitle>
        <FormSubtitle>{t('loginSubtitle')}</FormSubtitle>
      </HeaderSection>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <InputFieldWrapper>
            <InputIcon>
              <Image src="/images/user.png" alt="User icon" width={18} height={18} priority />
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
                alt="Password icon"
                width={18}
                height={18}
                priority
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

          <OptionsRow>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              {t('rememberPassword')}
            </CheckboxLabel>
            <ForgotPasswordLink onClick={handleForgotPassword}>
              {t('forgotPassword')}
            </ForgotPasswordLink>
          </OptionsRow>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? t('loginLoading') : t('loginButton')}
          </LoginButton>

          <SignUpLink>
            {t('signupPrompt')}{' '}
            <a onClick={onSwitchToRegister}>{t('signupLink')}</a>
          </SignUpLink>
        </FormGroup>
      </form>
    </FormContainer>
  );
}


import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledInput = styled.input`
  width: 100%;
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.ui.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.base};
  font-family: ${theme.typography.fontFamily.primary};
  transition: all ${theme.transitions.normal};
  backdrop-filter: blur(10px);

  &::placeholder {
    color: ${theme.colors.text.secondary};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.1);
    background: linear-gradient(
      135deg,
      rgba(255, 106, 0, 0.05) 0%,
      rgba(0, 102, 204, 0.05) 100%
    );
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    color: ${theme.colors.text.secondary};
    cursor: not-allowed;
  }
`;

export const InputIcon = styled.span`
  position: absolute;
  right: ${theme.spacing.lg};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.text.secondary};
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, ...props }) => {
  return (
    <InputContainer>
      {label && <label style={{ display: 'block', marginBottom: theme.spacing.sm, fontSize: '0.875rem' }}>{label}</label>}
      <StyledInput {...props} />
      {icon && <InputIcon>{icon}</InputIcon>}
    </InputContainer>
  );
};

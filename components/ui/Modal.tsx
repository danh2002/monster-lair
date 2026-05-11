import styled from 'styled-components';
import { theme } from '@/styles/theme';

export interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div<{ $width?: string }>`
  background: linear-gradient(135deg, rgba(20, 25, 50, 0.95) 0%, rgba(30, 40, 70, 0.95) 100%);
  border: 2px solid ${theme.colors.primary.main};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  width: ${(props) => props.$width || '90%'};
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px ${theme.colors.primary.main}40;
  animation: slideUp 0.3s ease-in-out;
  backdrop-filter: blur(20px);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${theme.colors.primary.main}, transparent);
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  padding-bottom: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.ui.border};

  h2 {
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize['2xl']};
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.xl};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.md};

  &:hover {
    color: ${theme.colors.primary.main};
    background: rgba(255, 106, 0, 0.1);
  }
`;

const ModalBody = styled.div`
  color: ${theme.colors.text.primary};
`;

export const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose, width }) => {
  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent $width={width} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>{title}</h2>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Overlay>
  );
};

import styled from 'styled-components';

const VARIANTS = {
  primary: { bg: '#4f46e5', color: 'white', border: '#4f46e5', hoverBg: '#4338ca', hoverBorder: '#4338ca' },
  danger:  { bg: '#fee2e2', color: '#dc2626', border: '#fee2e2', hoverBg: '#fecaca', hoverBorder: '#fecaca' },
  ghost:   { bg: '#f3f4f6', color: '#6b7280', border: '#f3f4f6', hoverBg: '#e5e7eb', hoverBorder: '#e5e7eb' },
  soft:    { bg: '#e0e7ff', color: '#4f46e5', border: '#e0e7ff', hoverBg: '#c7d2fe', hoverBorder: '#c7d2fe' },
};

const StyledButton = styled.button`
  padding: ${({ $size }) => ($size === 'sm' ? '6px 14px' : '12px 24px')};
  font-size: ${({ $size }) => ($size === 'sm' ? '13px' : '15px')};
  font-weight: 600;
  border: 2px solid;
  border-radius: ${({ $pill }) => ($pill ? '20px' : '8px')};
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${({ $variant, $active }) =>
    $variant === 'filter' ? ($active ? '#4f46e5' : 'transparent') : VARIANTS[$variant]?.bg};

  color: ${({ $variant, $active }) =>
    $variant === 'filter' ? ($active ? 'white' : '#666') : VARIANTS[$variant]?.color};

  border-color: ${({ $variant, $active }) =>
    $variant === 'filter' ? ($active ? '#4f46e5' : '#e0e0e0') : VARIANTS[$variant]?.border};

  &:hover:not(:disabled) {
    background-color: ${({ $variant, $active }) =>
      $variant === 'filter' ? ($active ? '#4338ca' : '#e0e7ff') : VARIANTS[$variant]?.hoverBg};
    border-color: ${({ $variant, $active }) =>
      $variant === 'filter' ? '#4f46e5' : VARIANTS[$variant]?.hoverBorder};
    color: ${({ $variant, $active }) =>
      $variant === 'filter' && !$active ? '#4f46e5' : undefined};
  }

  &:active:not(:disabled) { transform: scale(0.96); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export function Button({ children, onClick, variant = 'primary', size = 'md', pill = false, active = false, disabled = false }) {
  return (
    <StyledButton onClick={onClick} disabled={disabled} $variant={variant} $size={size} $pill={pill} $active={active}>
      {children}
    </StyledButton>
  );
}

export default Button;
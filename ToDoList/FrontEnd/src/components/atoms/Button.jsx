import styled from 'styled-components';

// Paleta de colores relajantes (Azules nórdicos y sutiles)
const VARIANTS = {
  primary: { 
    bg: '#1e40af',          // Azul marino profundo y elegante
    color: '#ffffff', 
    border: '#1e40af', 
    hoverBg: '#1d4ed8',     // Un toque más claro al pasar el mouse
    hoverBorder: '#1d4ed8' 
  },
  danger: { 
    bg: '#fef2f2',          // Fondo rojo pastel muy suave
    color: '#991b1b',       // Texto vino/coral oscuro
    border: '#fee2e2', 
    hoverBg: '#fee2e2', 
    hoverBorder: '#fca5a5' 
  },
  ghost: { 
    bg: 'transparent', 
    color: '#64748b',       // Gris azulado (Slate)
    border: 'transparent', 
    hoverBg: '#f1f5f9',     // Fondo gris nube muy suave
    hoverBorder: '#f1f5f9' 
  },
  soft: { 
    bg: '#e0f2fe',          // Azul cielo sutil, transmite paz
    color: '#0369a1',       // Texto azul intermedio
    border: '#e0f2fe', 
    hoverBg: '#bae6fd', 
    hoverBorder: '#bae6fd' 
  },
};

const StyledButton = styled.button`
  /* Ajuste de padding para hacerlo más estilizado y ligero */
  padding: ${({ $size }) => ($size === 'sm' ? '6px 16px' : '10px 22px')};
  font-size: ${({ $size }) => ($size === 'sm' ? '13px' : '14px')}; // 14px es más sutil y elegante
  font-weight: 500; // Reducido de 600 a 500 para un look más limpio y menos tosco
  font-family: inherit;
  
  border: 1px solid; // Cambiado de 2px a 1px para mayor finura
  border-radius: ${({ $pill }) => ($pill ? '999px' : '10px')}; // Bordes un poco más redondeados (10px) para suavidad visual
  
  cursor: pointer;
  transition: all 0.25s ease-in-out; // Transición un poco más suave
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  /* Estilos dinámicos por Variant */
  background-color: ${({ $variant, $active }) =>
    $variant === 'filter' ? ($active ? '#0284c7' : '#f8fafc') : VARIANTS[$variant]?.bg};

  color: ${({ $variant, $active }) =>
    $variant === 'filter' ? ($active ? '#ffffff' : '#64748b') : VARIANTS[$variant]?.color};

  border-color: ${({ $variant, $active }) =>
    $variant === 'filter' ? ($active ? '#0284c7' : '#e2e8f0') : VARIANTS[$variant]?.border};

  /* Hovers relajados */
  &:hover:not(:disabled) {
    background-color: ${({ $variant, $active }) =>
      $variant === 'filter' ? ($active ? '#0369a1' : '#e0f2fe') : VARIANTS[$variant]?.hoverBg};
    
    border-color: ${({ $variant, $active }) =>
      $variant === 'filter' ? ($active ? '#0369a1' : '#bae6fd') : VARIANTS[$variant]?.hoverBorder};
    
    color: ${({ $variant, $active }) =>
      $variant === 'filter' && !$active ? '#0369a1' : undefined};
      
    /* Un sutil sombreado azulado al pasar el cursor sobre el botón primario */
    box-shadow: ${({ $variant }) => 
      $variant === 'primary' ? '0 4px 12px rgba(30, 64, 175, 0.15)' : 'none'};
  }

  /* Micro-interacción fluida al hacer click */
  &:active:not(:disabled) { 
    transform: translateY(1px); // En lugar de encogerse (scale), baja 1px. Es más elegante.
  }
  
  &:disabled { 
    opacity: 0.4; 
    cursor: not-allowed; 
    box-shadow: none;
  }
`;

export function Button({ children, onClick, variant = 'primary', size = 'md', pill = false, active = false, disabled = false }) {
  return (
    <StyledButton onClick={onClick} disabled={disabled} $variant={variant} $size={size} $pill={pill} $active={active}>
      {children}
    </StyledButton>
  );
}

export default Button;
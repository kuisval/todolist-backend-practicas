import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  /* Mantenemos la lógica de tamaños, pero estilizando los paddings */
  padding: ${({ $size }) => ($size === 'sm' ? '8px 12px' : '12px 18px')};
  
  /* Borde fino de 1px en lugar de 2px para mayor elegancia */
  border: 1px solid #e2e8f0; 
  border-radius: ${({ $size }) => ($size === 'sm' ? '8px' : '12px')}; /* Bordes ligeramente más suaves */
  
  font-size: 14px; /* Un punto menos para que se vea más estilizado */
  font-family: inherit;
  color: #1e293b; /* Texto gris oscuro profundo (Slate), más suave que el negro puro */
  background-color: #f8fafc; /* Fondo gris-azul nube muy tenue para invitar a escribir */
  
  outline: none;
  /* Transición fluida para que el cambio al enfocar sea relajante */
  transition: all 0.25s ease-in-out;

  /* --- ESTADO: CUANDO EL USUARIO HACE CLICK (FOCUS) --- */
  &:focus { 
    border-color: #0284c7; /* Azul cielo relajante */
    background-color: #ffffff; /* El fondo se vuelve blanco puro al escribir */
    
    /* Un sombreado suave que da un efecto de iluminación premium */
    box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.12); 
  }

  /* --- TEXTO DE RELLENO (PLACEHOLDER) --- */
  &::placeholder { 
    color: #94a3b8; /* Gris azulado claro, perfectamente legible pero discreto */
  }

  /* Desactivado por si acaso */
  &:disabled {
    background-color: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

export function Input({ value, onChange, onKeyDown, placeholder = '', size = 'md', autoFocus = false, disabled = false }) {
  return (
    <StyledInput
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      $size={size}
      autoFocus={autoFocus}
      disabled={disabled}
    />
  );
}

export default Input;
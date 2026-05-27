import styled from 'styled-components';

const StyledCheckbox = styled.input`
  /* Desactivamos el diseño feo y nativo del navegador */
  appearance: none;
  -webkit-appearance: none;
  
  width: 20px;  /* Lo hacemos un milímetro más grande para que sea cómodo dar click */
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
  
  /* Bordes muy redondeados (casi un círculo) para transmitir calma */
  border-radius: 6px; 
  border: 2px solid #cbd5e1; /* Gris azulado muy suave de fondo */
  background-color: #ffffff;
  
  /* Centrado interno para el icono de "check" */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  /* Transición fluida para que los colores se relajen al cambiar */
  transition: all 0.25s ease-in-out;

  /* --- ESTADO: CUANDO ESTÁ MARCADO (CHECKED) --- */
  &:checked {
    background-color: #0284c7;  /* Azul cielo vibrante pero relajado */
    border-color: #0284c7;
    
    /* Pequeña sombra azulada brillante que da sensación de "completado con éxito" */
    box-shadow: 0 2px 8px rgba(2, 132, 199, 0.25); 
  }

  /* --- EL SÍMBOLO DE RECHECK (✓) HECHO EN CSS --- */
  &::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0; /* Dibuja una L */
    transform: rotate(45deg) scale(0); /* Oculto por defecto */
    opacity: 0;
    margin-top: -1px; /* Ajuste milimétrico de centrado */
    transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
  }

  /* Mostrar el símbolo cuando se marque */
  &:checked::after {
    transform: rotate(45deg) scale(1);
    opacity: 1;
  }

  /* --- EFECTO HOVER (PASAR EL MOUSE) --- */
  &:hover:not(:disabled) {
    border-color: #0284c7; /* Se ilumina en azul antes de hacer click */
    background-color: #f0f9ff; /* Un sutil destello azul claro de fondo */
  }

  /* Si el checkbox está marcado y pasas el mouse, se vuelve un azul un poco más profundo */
  &:checked:hover:not(:disabled) {
    background-color: #0369a1;
    border-color: #0369a1;
  }

  /* --- ESTADO DESACTIVADO --- */
  &:disabled {
    opacity: 0.5;
    background-color: #f1f5f9;
    border-color: #e2e8f0;
    cursor: not-allowed;
  }
`;

export function Checkbox({ checked, onChange, disabled = false }) {
  return (
    <StyledCheckbox 
      type="checkbox" 
      checked={checked} 
      onChange={onChange} 
      disabled={disabled}
    />
  );
}

export default Checkbox;
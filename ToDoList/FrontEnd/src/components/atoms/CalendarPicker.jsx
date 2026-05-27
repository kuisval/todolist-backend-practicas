import styled from 'styled-components';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

const Wrapper = styled.div`
  position: absolute;
  z-index: 100;
  background: #ffffff;
  border-radius: 16px; /* Esquinas más suaves y modernas */
  border: 1px solid #f1f5f9; /* Un borde casi imperceptible para delimitarlo */
  
  /* Sombra flotante muy fina y sutil con un ligero matiz azul profundo (Slate) */
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); 
  padding: 16px;
  margin-top: 8px;

  /* --- PERSONALIZACIÓN COMPLETA DEL CALENDARIO --- */
  .rdp {
    --rdp-accent-color: #0284c7;      /* Nuestro azul cielo relajante para el día seleccionado */
    --rdp-background-color: #e0f2fe;  /* Fondo azul claro suave para el hover o estados intermedios */
    margin: 0;
    font-family: inherit;
  }

  /* Estilizado fino de los días de la semana y títulos */
  .rdp-caption_label {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b; /* Gris oscuro elegante */
    text-transform: capitalize; /* Convierte el mes en Mayúscula inicial (ej: "Mayo 2026") */
  }

  /* Botones de navegación (Flechas mes anterior/siguiente) */
  .rdp-nav_button {
    color: #64748b;
    border-radius: 8px;
    transition: all 0.2s;
    
    &:hover {
      background-color: #f1f5f9;
      color: #0284c7;
    }
  }

  /* Nombre de los días (Lu, Ma, Mi...) */
  .rdp-head_cell {
    font-size: 12px;
    font-weight: 500;
    color: #94a3b8; /* Gris azulado suave */
    text-transform: uppercase;
  }

  /* Estilo general para cada celda de día */
  .rdp-day {
    font-size: 13px;
    border-radius: 10px; /* Días con esquinas redondeadas suaves en lugar de círculos totales */
    transition: all 0.2s ease;
    color: #334155;

    /* Día de hoy (actual) */
    &.rdp-day_today {
      font-weight: bold;
      color: #0284c7;
      border: 1px solid #bae6fd;
    }

    /* Al pasar el mouse por encima de un día normal */
    &:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
      background-color: #f0f9ff;
      color: #0369a1;
    }
  }

  /* El día seleccionado */
  .rdp-day_selected {
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2); /* Brillo azul relajado */
    
    &:hover {
      background-color: #0284c7 !important; /* Mantiene el color base */
    }
  }

  /* Días deshabilitados (pasados) */
  .rdp-day_disabled {
    color: #cbd5e1;
    opacity: 0.4;
  }
`;

export function CalendarPicker({ selected, onSelect, onClose }) {
  return (
    <Wrapper>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => { 
          if (date) { // Verificación por seguridad
            onSelect(date); 
            onClose(); 
          }
        }}
        locale={es}
        disabled={{ before: new Date() }}
      />
    </Wrapper>
  );
}

export default CalendarPicker;
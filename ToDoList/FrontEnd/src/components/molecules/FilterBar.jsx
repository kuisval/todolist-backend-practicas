import styled from 'styled-components';
import { Button } from '../../index';
import useTaskStore from '../../store/useTaskStore';

const Bar = styled.div`
  display: inline-flex; /* Cambiado a inline-flex para que ocupe solo el espacio necesario */
  gap: 4px;             /* Un espacio más cerrado entre botones luce más integrado */
  background-color: #f1f5f9; /* Fondo gris-azul nube que agrupa los filtros */
  padding: 4px;         /* Espaciado interno para crear un efecto de "cápsula" */
  border-radius: 999px; /* Totalmente curvo para hacer juego con los botones tipo "pill" */
  margin-bottom: 24px;  /* Un poco más de separación con la lista para dar aire */
  border: 1px solid #e2e8f0; /* Borde ultra sutil para dar definición */
`;

const FILTERS = [
  { value: 'all',     label: 'Todas'      },
  { value: 'pending', label: 'Pendientes' },
];

export function FilterBar() {
  const filter      = useTaskStore((state) => state.filter);
  const setFilter   = useTaskStore((state) => state.setFilter);

  return (
    <Bar>
      {FILTERS.map(({ value, label }) => (
        <Button
          key={value}
          variant="filter"
          pill
          size="sm" /* Cambiado a 'sm' para un look más refinado y de barra de control */
          active={filter === value}
          onClick={() => setFilter(value)}
        >
          {label}
        </Button>
      ))}
    </Bar>
  );
}

export default FilterBar;
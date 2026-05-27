import styled from 'styled-components';
import { Button } from '../../index';
import useTaskStore from '../../store/useTaskStore';

const Bar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
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
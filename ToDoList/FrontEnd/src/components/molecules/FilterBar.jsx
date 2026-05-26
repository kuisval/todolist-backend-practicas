import styled from 'styled-components';
import { Button} from '../../index';

const Bar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
];

export function FilterBar({ filter, onFilterChange }) {
  return (
    <Bar>
      {FILTERS.map(({ value, label }) => (
        <Button
          key={value}
          variant="filter"
          pill
          active={filter === value}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </Button>
      ))}
    </Bar>
  );
}

export default FilterBar;
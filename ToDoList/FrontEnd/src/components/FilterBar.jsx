import styled from 'styled-components';

const Bar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const FilterBtn = styled.button`
  padding: 8px 20px;
  border-radius: 20px;
  border: 2px solid ${({ $active }) => ($active ? '#4f46e5' : '#e0e0e0')};
  background-color: ${({ $active }) => ($active ? '#4f46e5' : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : '#666')};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4f46e5;
    color: ${({ $active }) => ($active ? 'white' : '#4f46e5')};
  }
`;

function FilterBar({ filter, onFilterChange }) {
  return (
    <Bar>
      <FilterBtn
        $active={filter === 'all'}
        onClick={() => onFilterChange('all')}
      >
        Todas
      </FilterBtn>
      <FilterBtn
        $active={filter === 'pending'}
        onClick={() => onFilterChange('pending')}
      >
        Pendientes
      </FilterBtn>
    </Bar>
  );
}

export default FilterBar;

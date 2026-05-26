import styled from 'styled-components';

const StyledCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4f46e5;
  flex-shrink: 0;
`;

export function Checkbox({ checked, onChange }) {
  return <StyledCheckbox type="checkbox" checked={checked} onChange={onChange} />;
}

export default Checkbox;
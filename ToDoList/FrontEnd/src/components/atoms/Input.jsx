import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ $size }) => ($size === 'sm' ? '6px 10px' : '12px 16px')};
  border: 2px solid #e0e0e0;
  border-radius: ${({ $size }) => ($size === 'sm' ? '6px' : '10px')};
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;

  &:focus { border-color: #4f46e5; }
  &::placeholder { color: #aaa; }
`;

export function Input({ value, onChange, onKeyDown, placeholder = '', size = 'md', autoFocus = false }) {
  return (
    <StyledInput
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      $size={size}
      autoFocus={autoFocus}
    />
  );
}

export default Input;
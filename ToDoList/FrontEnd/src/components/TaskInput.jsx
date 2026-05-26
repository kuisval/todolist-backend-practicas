import { useState } from 'react';
import styled from 'styled-components';

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4f46e5;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const SaveButton = styled.button`
  padding: 12px 24px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #4338ca;
  }

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    background-color: #a5b4fc;
    cursor: not-allowed;
  }
`;

function TaskInput({ onAdd }) {
  const [text, setText] = useState('');

  const handleSave = async () => {
    if (!text.trim()) return;
    await onAdd(text);
    setText(''); // Limpiar el input después de guardar
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <InputRow>
      <StyledInput
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe una nueva tarea..."
      />
      <SaveButton onClick={handleSave} disabled={!text.trim()}>
        Guardar
      </SaveButton>
    </InputRow>
  );
}

export default TaskInput;

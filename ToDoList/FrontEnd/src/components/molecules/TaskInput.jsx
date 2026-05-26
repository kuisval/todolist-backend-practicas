import { useState } from 'react';
import styled from 'styled-components';
import { Input, Button } from '../../index';

const Row = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
`;

export function TaskInput({ onAdd }) {
  const [text, setText] = useState('');

  const handleSave = async () => {
    if (!text.trim()) return;
    await onAdd(text);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <Row>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe una nueva tarea..."
      />
      <Button onClick={handleSave} disabled={!text.trim()}>
        Guardar
      </Button>
    </Row>
  );
}

export default TaskInput;
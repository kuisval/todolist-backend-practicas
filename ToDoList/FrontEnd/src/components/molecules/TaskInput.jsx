import { useState } from 'react';
import styled from 'styled-components';
import { Input, Button } from '../../index';
import useTaskStore from '../../store/useTaskStore';

const Row = styled.div`
  display: flex;
  gap: 10px;            /* Unir ligeramente los elementos (de 12px a 10px) da una sensación de bloque unificado */
  align-items: center; /* Garantiza que el input y el botón estén perfectamente centrados en el eje vertical */
  margin-bottom: 32px;  /* Ampliamos un poco el margen inferior para que la zona de entrada "respire" respecto a la lista */
  width: 100%;
`;

export function TaskInput() {
  const [text, setText] = useState('');
  const addTask = useTaskStore((state) => state.addTask);

  const handleSave = async () => {
    if (!text.trim()) return;
    await addTask(text);
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
        placeholder="Añadir una nueva tarea..." /* Un verbo más ligero y cercano */
      />
      <Button 
        onClick={handleSave} 
        disabled={!text.trim()}
        variant="primary" /* Nos aseguramos de usar el azul marino profundo */
      >
        Añadir
      </Button>
    </Row>
  );
}

export default TaskInput;
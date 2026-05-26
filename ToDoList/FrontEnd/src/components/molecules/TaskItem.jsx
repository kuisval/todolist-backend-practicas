import { useState } from 'react';
import styled from 'styled-components';
import { Checkbox, Input, Button } from '../../index';

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1.5px solid #e8e8e8;
  background: #fff;
  transition: box-shadow 0.2s;

  &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
`;

const TaskLabel = styled.span`
  flex: 1;
  font-size: 15px;
  color: ${({ $completed }) => ($completed ? '#aaa' : '#1a1a1a')};
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
  transition: color 0.2s;
`;

const InputWrapper = styled.div`
  flex: 1;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

export function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    await onEdit(task.id, editText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') handleCancelEdit();
  };

  return (
    <Item>
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task.id, !task.completed)}
      />

      {isEditing ? (
        <InputWrapper>
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            size="sm"
            autoFocus
          />
        </InputWrapper>
      ) : (
        <TaskLabel $completed={task.completed}>{task.text}</TaskLabel>
      )}

      <Actions>
        {isEditing ? (
          <>
            <Button size="sm" onClick={handleSaveEdit}>Guardar</Button>
            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancelar</Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="soft" onClick={() => setIsEditing(true)}>Editar</Button>
            <Button size="sm" variant="danger" onClick={() => onDelete(task.id)}>Borrar</Button>
          </>
        )}
      </Actions>
    </Item>
  );
}

export default TaskItem;
import { useState } from 'react';
import styled from 'styled-components';

// ──────── Estilos ────────

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1.5px solid #e8e8e8;
  background: #fff;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4f46e5;
  flex-shrink: 0;
`;

const TaskLabel = styled.span`
  flex: 1;
  font-size: 15px;
  color: ${({ $completed }) => ($completed ? '#aaa' : '#1a1a1a')};
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
  transition: color 0.2s;
`;

const EditInput = styled.input`
  flex: 1;
  padding: 6px 10px;
  border: 2px solid #4f46e5;
  border-radius: 6px;
  font-size: 15px;
  outline: none;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const ActionBtn = styled.button`
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;

  &:active {
    transform: scale(0.95);
  }
`;

const EditBtn = styled(ActionBtn)`
  background-color: #e0e7ff;
  color: #4f46e5;

  &:hover {
    background-color: #c7d2fe;
  }
`;

const DeleteBtn = styled(ActionBtn)`
  background-color: #fee2e2;
  color: #dc2626;

  &:hover {
    background-color: #fecaca;
  }
`;

const SaveEditBtn = styled(ActionBtn)`
  background-color: #4f46e5;
  color: white;

  &:hover {
    background-color: #4338ca;
  }
`;

const CancelBtn = styled(ActionBtn)`
  background-color: #f3f4f6;
  color: #6b7280;

  &:hover {
    background-color: #e5e7eb;
  }
`;

// ──────── Componente ────────

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    await onEdit(task.id, editText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(task.text); // Restaurar texto original
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') handleCancelEdit();
  };

  return (
    <Item>
      {/* Checkbox para marcar como completada */}
      <Checkbox
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, !task.completed)}
      />

      {/* Si está editando: input; si no: label */}
      {isEditing ? (
        <EditInput
          autoFocus
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <TaskLabel $completed={task.completed}>{task.text}</TaskLabel>
      )}

      {/* Botones de acción */}
      <Actions>
        {isEditing ? (
          <>
            <SaveEditBtn onClick={handleSaveEdit}>Guardar</SaveEditBtn>
            <CancelBtn onClick={handleCancelEdit}>Cancelar</CancelBtn>
          </>
        ) : (
          <>
            <EditBtn onClick={() => setIsEditing(true)}>Editar</EditBtn>
            <DeleteBtn onClick={() => onDelete(task.id)}>Borrar</DeleteBtn>
          </>
        )}
      </Actions>
    </Item>
  );
}

export default TaskItem;

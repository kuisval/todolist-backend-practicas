import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Checkbox, Input, Button, CalendarPicker } from '../../index';
import useTaskStore from '../../store/useTaskStore';

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1.5px solid #e8e8e8;
  background: #fff;
  transition: box-shadow 0.2s;
  position: relative;
  &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
`;

const TaskLabel = styled.span`
  flex: 1;
  font-size: 15px;
  color: ${({ $completed }) => ($completed ? '#aaa' : '#1a1a1a')};
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
  transition: color 0.2s;
  cursor: ${({ $clickable }) => ($clickable ? 'text' : 'default')};
  &:hover { color: ${({ $clickable }) => ($clickable ? '#4f46e5' : undefined)}; }
`;

const InputWrapper = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 300px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  margin-left: auto;
`;

const DueDateBadge = styled.span`
  font-size: 12px;
  color: ${({ $overdue }) => ($overdue ? '#dc2626' : '#6b7280')};
  background: ${({ $overdue }) => ($overdue ? '#fee2e2' : '#f3f4f6')};
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
`;

const CalendarWrapper = styled.div`
  position: relative;
`;

export function TaskItem({ task }) {
  const [isEditing, setIsEditing]       = useState(false);
  const [editText, setEditText]         = useState(task.text);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef                     = useRef(null);

  const { toggleTask, editTask, deleteTask, setDueDate } = useTaskStore();

  // Cerrar calendario al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    await editTask(task.id, editText);
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

  const handleSelectDate = async (date) => {
    const formatted = date ? format(date, 'yyyy-MM-dd') : null;
    await setDueDate(task.id, formatted);
  };

  const isOverdue = task.due_date && !task.completed
    && new Date(task.due_date + 'T00:00:00') < new Date();

  return (
    <Item>
      <Checkbox
        checked={task.completed}
        onChange={() => toggleTask(task.id, !task.completed)}
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
        <TaskLabel
          $completed={task.completed}
          $clickable={!task.completed}
          onClick={() => !task.completed && setIsEditing(true)}
        >
          {task.text}
        </TaskLabel>
      )}

      {/* Badge de fecha */}
      {task.due_date && !isEditing && (
        <DueDateBadge $overdue={isOverdue}>
          {isOverdue ? '⚠️ ' : '📅 '}
          {format(new Date(task.due_date + 'T00:00:00'), 'dd MMM', { locale: es })}
        </DueDateBadge>
      )}

      <Actions>
        {isEditing ? (
          <>
            <Button size="sm" onClick={handleSaveEdit}>Guardar</Button>
            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancelar</Button>
          </>
        ) : (
          <>
            {/* Botón calendario */}
            <CalendarWrapper ref={calendarRef}>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                📅
              </Button>
              {showCalendar && (
                <CalendarPicker
                  selected={task.due_date ? new Date(task.due_date + 'T00:00:00') : undefined}
                  onSelect={handleSelectDate}
                  onClose={() => setShowCalendar(false)}
                />
              )}
            </CalendarWrapper>
            <Button size="sm" variant="soft" onClick={() => setIsEditing(true)}>Editar</Button>
            <Button size="sm" variant="danger" onClick={() => deleteTask(task.id)}>Borrar</Button>
          </>
        )}
      </Actions>
    </Item>
  );
}

export default TaskItem;
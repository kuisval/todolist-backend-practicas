import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Checkbox, Input, Button, CalendarPicker } from '../../index';
import useTaskStore from '../../store/useTaskStore';

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  border-radius: 12px;
  
  border: 1px solid ${({ $completed }) => ($completed ? '#f1f5f9' : '#e2e8f0')};
  background: ${({ $completed }) => ($completed ? '#f8fafc' : '#ffffff')};
  opacity: ${({ $completed }) => ($completed ? 0.75 : 1)};
  
  position: relative;
  transition: all 0.25s ease-in-out;

  /* --- LA SOLUCIÓN AL BUG --- */
  /* Si esta tarea específica tiene el calendario abierto, forzamos un z-index altísimo */
  z-index: ${({ $hasCalendarOpen }) => ($hasCalendarOpen ? 50 : 1)};

  &:hover { 
    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.04);
    transform: translateY(-1px);
    
    /* Cuando pasamos el mouse por encima de CUALQUIER tarea, le subimos un pelín el z-index 
       para la animación, pero SIEMPRE respetando si otra tarea tiene el calendario abierto */
    z-index: ${({ $hasCalendarOpen }) => ($hasCalendarOpen ? 50 : 2)};
  }
`;

const TaskLabel = styled.span`
  flex: 1;
  font-size: 14px; /* Un punto menor para estilizar la línea */
  font-weight: 400;
  
  /* Slate para tareas activas (más suave que el negro) y gris azulado para completadas */
  color: ${({ $completed }) => ($completed ? '#94a3b8' : '#334155')};
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
  
  transition: color 0.2s ease;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  
  /* Hover sutil con el azul de nuestra paleta */
  &:hover { 
    color: ${({ $clickable }) => ($clickable ? '#0284c7' : undefined)}; 
  }
`;

const InputWrapper = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 340px;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px; /* Botones de acción un poco más juntos se ven más ordenados */
  flex-shrink: 0;
  margin-left: auto;
`;

const DueDateBadge = styled.span`
  font-size: 11px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px; /* Totalmente tipo píldora */
  white-space: nowrap;
  transition: all 0.2s;

  /* Colores condicionales elegantes (Rojo coral sutil vs Azul cielo zen) */
  color: ${({ $overdue }) => ($overdue ? '#991b1b' : '#0369a1')};
  background: ${({ $overdue }) => ($overdue ? '#fef2f2' : '#e0f2fe')};
  border: 1px solid ${({ $overdue }) => ($overdue ? '#fee2e2' : '#bae6fd')};
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
      <Item $completed={task.completed} $hasCalendarOpen={showCalendar}>
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

      {/* Badge de fecha refinado */}
      {task.due_date && !isEditing && (
        <DueDateBadge $overdue={isOverdue}>
          {isOverdue ? '⚠️ Vencido' : '📅'} {format(new Date(task.due_date + 'T00:00:00'), 'dd MMM', { locale: es })}
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
            {!task.completed && (
              <Button size="sm" variant="soft" onClick={() => setIsEditing(true)}>Editar</Button>
            )}
            <Button size="sm" variant="danger" onClick={() => deleteTask(task.id)}>Borrar</Button>
          </>
        )}
      </Actions>
    </Item>
  );
}

export default TaskItem;
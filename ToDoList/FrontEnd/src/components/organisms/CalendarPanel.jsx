import styled from 'styled-components';
import { DayPicker } from 'react-day-picker';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import 'react-day-picker/dist/style.css';
import useTaskStore from '../../store/useTaskStore';

const Panel = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px; /* Un poco más de espacio interno para que respire */
  /* Sombra flotante idéntica a los otros componentes premium */
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
  border: 1px solid #e2e8f0;
  width: 320px;
  flex-shrink: 0;
  height: fit-content;

  /* --- REESCRITURA DE VARIABLES DEL CALENDARIO --- */
  .rdp {
    --rdp-accent-color: #0284c7;      /* Azul cielo relajante */
    --rdp-background-color: #e0f2fe;  /* Hover suave */
    margin: 0;
    font-family: inherit;
  }

  .rdp-caption_label {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    text-transform: capitalize;
  }

  .rdp-nav_button {
    color: #64748b;
    border-radius: 8px;
    &:hover {
      background-color: #f1f5f9;
      color: #0284c7;
    }
  }

  .rdp-head_cell {
    font-size: 11px;
    font-weight: 500;
    color: #94a3b8;
    text-transform: uppercase;
  }

  .rdp-day {
    font-size: 13px;
    border-radius: 8px;
    color: #334155;
    position: relative; /* Importante para posicionar el puntito indicador */

    &.rdp-day_today {
      font-weight: bold;
      color: #0284c7;
      border: 1px solid #bae6fd;
    }

    &:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
      background-color: #f0f9ff;
      color: #0369a1;
    }
  }

  .rdp-day_selected {
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2);
    &:hover { background-color: #0284c7 !important; }
  }

  /* --- INDICADOR ELEGANTE PARA DÍAS CON TAREAS --- */
  .rdp-day_hasTasks:not(.rdp-day_selected) {
    color: #0284c7;
    font-weight: 600;
    
    /* En lugar de un borde tosco, creamos un puntito minimalista debajo del número */
    &::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #0284c7;
    }
  }
`;

const PanelTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: #1e293b; /* Slate oscuro elegante */
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TasksOfDay = styled.div`
  margin-top: 20px;
  border-top: 1px solid #f1f5f9; /* Línea divisoria más delgada y clara */
  padding-top: 16px;
`;

const DayTitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #0284c7; /* Azul guía */
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* Un poco de tracking para un look editorial premium */
`;

const DayTaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f8fafc;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  /* Gris para completado, azul cielo zen para pendiente */
  background: ${({ $completed }) => ($completed ? '#cbd5e1' : '#0284c7')};
  transition: background-color 0.2s;
`;

const DayTaskText = styled.span`
  font-size: 13px;
  flex: 1;
  color: ${({ $completed }) => ($completed ? '#94a3b8' : '#334155')};
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
  transition: all 0.2s;
  
  /* Cortar texto largo elegantemente con puntos suspensivos si no cabe */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DayTaskDate = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
`;

const EmptyDay = styled.p`
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
  padding: 16px 0;
  font-style: italic;
`;

export function CalendarPanel() {
  const tasks = useTaskStore((state) => state.tasks);
  const [selectedDay, setSelectedDay] = useState(new Date());

  const tasksWithDate = tasks.filter((t) => t.due_date);

  const daysWithTasks = tasksWithDate.map((t) =>
    new Date(t.due_date + 'T00:00:00')
  );

  const tasksOfDay = tasksWithDate.filter((t) =>
    isSameDay(new Date(t.due_date + 'T00:00:00'), selectedDay)
  );

  return (
    <Panel>
      <PanelTitle>
        <span>📅</span> Calendario
      </PanelTitle>

      <DayPicker
        key={tasksWithDate.map((t) => t.id + t.due_date).join(',')}
        mode="single"
        selected={selectedDay}
        onSelect={(date) => date && setSelectedDay(date)}
        locale={es}
        modifiers={{ hasTasks: daysWithTasks }}
        modifiersClassNames={{ hasTasks: 'rdp-day_hasTasks' }}
      />

      <TasksOfDay>
        <DayTitle>
          {format(selectedDay, "dd 'de' MMMM yyyy", { locale: es })}
        </DayTitle>

        {tasksOfDay.length === 0 ? (
          <EmptyDay>Sin tareas para este día</EmptyDay>
        ) : (
          tasksOfDay.map((task) => (
            <DayTaskItem key={task.id}>
              <Dot $completed={task.completed} />
              <DayTaskText $completed={task.completed} title={task.text}>
                {task.text}
              </DayTaskText>
              <DayTaskDate>
                {format(new Date(task.due_date + 'T00:00:00'), 'dd MMM', { locale: es })}
              </DayTaskDate>
            </DayTaskItem>
          ))
        )}
      </TasksOfDay>
    </Panel>
  );
}

export default CalendarPanel;
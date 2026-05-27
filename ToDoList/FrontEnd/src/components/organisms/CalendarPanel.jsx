import styled from 'styled-components';
import { DayPicker } from 'react-day-picker';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import 'react-day-picker/dist/style.css';
import useTaskStore from '../../store/useTaskStore';

const Panel = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  width: 320px;
  flex-shrink: 0;
  height: fit-content;

  .rdp {
    --rdp-accent-color: #4f46e5;
    --rdp-background-color: #e0e7ff;
    margin: 0;
  }

  /* Días con tareas — círculo morado tenue */
  .rdp-day_hasTasks:not(.rdp-day_selected) {
    border: 2px solid #4f46e5;
    border-radius: 70%;
    color: #4f46e5;
    font-weight: 700;
  }
`;

const PanelTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px;
`;

const TasksOfDay = styled.div`
  margin-top: 16px;
  border-top: 1.5px solid #f3f4f6;
  padding-top: 14px;
`;

const DayTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #4f46e5;
  margin: 0 0 10px;
`;

const DayTaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid #f9f9f9;
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $completed }) => ($completed ? '#d1d5db' : '#4f46e5')};
`;

const DayTaskText = styled.span`
  font-size: 13px;
  flex: 1;
  color: ${({ $completed }) => ($completed ? '#aaa' : '#333')};
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
`;

const DayTaskDate = styled.span`
  font-size: 11px;
  color: #aaa;
`;

const EmptyDay = styled.p`
  font-size: 13px;
  color: #ccc;
  text-align: center;
  padding: 12px 0;
`;

export function CalendarPanel() {
  const tasks = useTaskStore((state) => state.tasks);
  const [selectedDay, setSelectedDay] = useState(new Date());

  const tasksWithDate = tasks.filter((t) => t.due_date);

  // Días que tienen tareas para marcarlos
  const daysWithTasks = tasksWithDate.map((t) =>
    new Date(t.due_date + 'T00:00:00')
  );

  // Tareas del día seleccionado
  const tasksOfDay = tasksWithDate.filter((t) =>
    isSameDay(new Date(t.due_date + 'T00:00:00'), selectedDay)
  );

  return (
    <Panel>
      <PanelTitle>📆 Calendario</PanelTitle>

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
              <DayTaskText $completed={task.completed}>
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
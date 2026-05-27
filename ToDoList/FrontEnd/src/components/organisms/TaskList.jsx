import styled from 'styled-components';
import { TaskItem, FilterBar } from '../../index';
import useTaskStore from '../../store/useTaskStore';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px; /* Subimos de 10px a 12px para dar un milímetro extra de aire entre tarjetas */
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #94a3b8; /* Gris azulado suave en vez de gris plano */
  font-size: 14px; /* Un toque más pequeño y estilizado */
  font-weight: 400;
  font-style: italic; /* Le da un aire más tranquilo y editorial */
  padding: 48px 0; /* Aumentamos el padding para que el vacío se sienta intencional y limpio */
  
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  /* Agregamos un emoji sutil integrado por CSS para dar un feedback amigable */
  &::before {
    font-size: 20px;
    font-style: normal;
  }
`;

export function TaskList() {
  const tasks  = useTaskStore((state) => state.tasks);
  const filter = useTaskStore((state) => state.filter);

  const filteredTasks = filter === 'pending'
    ? tasks.filter((t) => !t.completed)
    : tasks;

  return (
    <>
      <FilterBar />

      {filteredTasks.length === 0 ? (
        <EmptyMessage>
          {filter === 'pending'
            ? 'Todo al día. ¡Disfruta tu momento de calma!'
            : 'Tu lista está vacía. Añade una tarea para comenzar.'}
        </EmptyMessage>
      ) : (
        <List>
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </List>
      )}
    </>
  );
}

export default TaskList;
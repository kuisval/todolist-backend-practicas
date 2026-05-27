import styled from 'styled-components';
import { TaskItem, FilterBar } from '../../index';
import useTaskStore from '../../store/useTaskStore';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #bbb;
  font-size: 15px;
  padding: 40px 0;
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
            ? '¡No hay tareas pendientes!'
            : 'Agrega tu primera tarea arriba.'}
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
import styled from 'styled-components';
import { TaskItem, FilterBar } from '../../index'

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

export function TaskList({ tasks, filter, onFilterChange, onToggle, onEdit, onDelete }) {
  const filteredTasks = filter === 'pending'
    ? tasks.filter((t) => !t.completed)
    : tasks;

  return (
    <>
      <FilterBar filter={filter} onFilterChange={onFilterChange} />

      {filteredTasks.length === 0 ? (
        <EmptyMessage>
          {filter === 'pending'
            ? '¡No hay tareas pendientes!'
            : 'Agrega tu primera tarea arriba.'}
        </EmptyMessage>
      ) : (
        <List>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </List>
      )}
    </>
  );
}

export default TaskList;
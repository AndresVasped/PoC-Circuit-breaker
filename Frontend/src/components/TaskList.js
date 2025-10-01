// src/components/TaskList.js
import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onDelete, onEdit }) => {
  return (
    <div className="task-cards-container">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TaskList;

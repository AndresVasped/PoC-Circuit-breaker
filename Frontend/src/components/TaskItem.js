// src/components/TaskItem.js
import React from 'react';

const TaskItem = ({ task, onDelete, onEdit }) => {
  const statusClass = task.status === 'pendiente' ? 'status-pendiente' : task.status === 'en proceso' ? 'status-en-proceso' : 'status-completado';

  return (
    <div className="task-card">
      <div className="task-header">
        <h4>{task.title}</h4>
      </div>
      <div className="task-body">
        <p>{task.description}</p>
        <p className={`status ${statusClass}`}>{task.status}</p>
      </div>
      <div className="task-footer">
        <button className="btn-edit" onClick={() => onEdit(task)}>Editar</button>
        <button className="btn-delete" onClick={() => onDelete(task.id)}>Eliminar</button>
      </div>
    </div>
  );
};

export default TaskItem;

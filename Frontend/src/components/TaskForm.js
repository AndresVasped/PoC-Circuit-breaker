// src/components/TaskForm.js
import React, { useState, useEffect } from 'react';

const TaskForm = ({ task, onSubmit }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pendiente'
  });

  useEffect(() => {
    if (task) {
      setNewTask({
        title: task.title,
        description: task.description,
        status: task.status
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newTask);
    setNewTask({ title: '', description: '', status: 'pendiente' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Título de la tarea" 
        value={newTask.title} 
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
      />
      <textarea
        placeholder="Descripción de la tarea"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
      />
      <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
        <option value="pendiente">Pendiente</option>
        <option value="en proceso">En proceso</option>
        <option value="completado">Completado</option>
      </select>
      <button type="submit">{task ? 'Guardar Cambios' : 'Agregar Tarea'}</button>
    </form>
  );
};

export default TaskForm;

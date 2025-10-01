// src/components/ClientDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClientInfo from './ClientInfo';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import './styles.css';

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState({});
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // CAMBIO: Apuntamos al proxy en el puerto 3000
        const response = await fetch(`http://localhost:3000/clients/${id}`);
        const clientData = await response.json();
        setClient(clientData);

        // CAMBIO: Apuntamos al proxy en el puerto 3000
        const taskResponse = await fetch(`http://localhost:3000/clients/${id}/tasks`);
        const tasksData = await taskResponse.json();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchClientData();
  }, [id]);

  // Función para agregar una tarea (YA CORREGIDA)
  const handleAddTask = async (newTask) => {
    try {
      // CAMBIO: Apuntamos al proxy en el puerto 3000
      const taskResponse = await fetch('http://localhost:3000/tasks');
      const tasksData = await taskResponse.json();
      const highestId = tasksData.length > 0 ? Math.max(...tasksData.map(task => task.id)) : 0;

      const taskData = {
        id: highestId + 1,
        clientId: client.id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
      };
      
      // CAMBIO: Apuntamos al proxy en el puerto 3000
      const response = await fetch(`http://localhost:3000/clients/${client.id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: taskData })
      });

      const newTaskFromBackend = await response.json();
      setTasks(prevTasks => [...prevTasks, newTaskFromBackend]);

    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  // Función para eliminar una tarea
  const handleDeleteTask = async (taskId) => {
    try {
      // CAMBIO: Apuntamos al proxy en el puerto 3000
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  // Función para manejar la edición de una tarea
  const handleEditTask = (task) => {
    setEditTask(task);
  };

  // Función para guardar los cambios de la tarea editada
  const handleSaveTask = async (updatedTask) => {
    try {
      // CAMBIO: Apuntamos al proxy en el puerto 3000
      const response = await fetch(`http://localhost:3000/tasks/${editTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: updatedTask })
      });

      const updatedTaskFromBackend = await response.json();
      setTasks(tasks.map(task => task.id === updatedTaskFromBackend.id ? updatedTaskFromBackend : task));
      setEditTask(null);
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  return (
    <div>
      <ClientInfo client={client} />
      <TaskList tasks={tasks} onDelete={handleDeleteTask} onEdit={handleEditTask} />
      <TaskForm task={editTask} onSubmit={editTask ? handleSaveTask : handleAddTask} />
    </div>
  );
};

export default ClientDetails;
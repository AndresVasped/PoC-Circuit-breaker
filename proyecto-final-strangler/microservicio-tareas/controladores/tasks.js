const data = require('../../data-dummy/data.json');


// Obtener todas las tareas
const getAllTasks = (clientId = null) => {
    if (clientId) {
      return data.tasks.filter(task => task.clientId == clientId); // Filtra tareas por cliente
    }
    return data.tasks; // Devuelve todas las tareas si no se pasa un cliente
  };
  
// Crear una nueva tarea (como en el de `player`)
const createTask = (task) => {
  if(task) {
    data.tasks.push(task);  // Agregar la tarea directamente al arreglo
    return { message: "Tarea creada", error: false, task };
  } else {
    return { message: "No se proporcionaron los datos de la tarea", error: true };
  }
};

// Editar una tarea por ID
const updateTask = (id, task) => {
  const taskIndex = data.tasks.findIndex(t => t.id == id);
  if (taskIndex === -1) {
    return { message: "Tarea no encontrada", error: true };
  } else {
    data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...task }; // Actualizar tarea
    return { message: "Tarea actualizada", error: false, task: data.tasks[taskIndex] };
  }
};

// Eliminar una tarea por ID
const deleteTask = (id) => {
  const taskIndex = data.tasks.findIndex(t => t.id == id);
  if (taskIndex === -1) {
    return { message: "Tarea no encontrada", error: true };
  } else {
    const deletedTask = data.tasks.splice(taskIndex, 1); // Eliminar tarea
    return { message: "Tarea eliminada", error: false, task: deletedTask };
  }
};

module.exports = 
{ 
    getAllTasks, 
    createTask, 
    updateTask, 
    deleteTask 
};


import Proyectos from "./modulos/proyectos";
import Tareas from "./modulos/tareas";
import Funciones from "./funciones/funciones";

document.addEventListener("click", (e) => {
  let objClicked = e.target.dataset.accion;

  switch (objClicked) {
    case "eliminar-proyecto":
      Proyectos.btnEliminar(e);
      break;
    case "cambiar-estado":
      Tareas.btnCambiarEstado(e);
      break;
    case "eliminar-tarea":
      Tareas.btnEliminarTarea(e);
    default:
      break;
  }
});

document.addEventListener("DOMContentLoaded", (e) => {
  Funciones.porcentaje();
});

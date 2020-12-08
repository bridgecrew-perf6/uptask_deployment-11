import Swal from "sweetalert2";
import axios from "axios";
import funciones from "../funciones/funciones";

const btnCambiarEstado = (e) => {
  e.preventDefault();

  let id = e.target.dataset.id;
  let urlProyecto = window.location.pathname.split("/")[2];

  axios
    .put(`/tareas/${id}`, {
      data: {
        url: urlProyecto,
      },
    })
    .then(() => {
      // Swal.fire({
      //   icon: "success",
      //   title: "Felicidades",
      //   text: resp.data,
      // }).then(() => {
      // });
      e.target.classList.toggle("completo");
      funciones.porcentaje();
    })
    .catch(() => {
      Swal.fire({
        icon: "error",
        title: "Hubo un problema",
        text: "No se pudo cambiar el estado de la tarea",
      });
    });
};

const btnEliminarTarea = (e) => {
  e.preventDefault();

  const id = e.target.dataset.id;
  let urlProyecto = window.location.pathname.split("/")[2];

  Swal.fire({
    icon: "warning",
    title: "¿Deseas eliminar la tarea?",
    text: "Una tarea eliminada no se puede recuperar",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar",
    cancelButtonText: "No, cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`/tareas/${id}`, {
          data: {
            url: urlProyecto,
          },
        })
        .then((resp) => {
          Swal.fire({
            icon: "success",
            title: "¡Eliminadó!",
            text: resp.data,
          }).then(() => {
            e.target.parentElement.parentElement.remove();
            funciones.porcentaje();
          });
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Hubo un error",
            text: "No se pudo eliminar la tarea",
          });
        });
    }
  });
};

export default {
  btnCambiarEstado,
  btnEliminarTarea,
};

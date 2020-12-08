import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = (e) => {
  e.preventDefault();

  let urlProyecto = e.target.dataset.proyectoUrl;

  Swal.fire({
    title: "¿Deseas eliminar este proyecto?",
    text: "Un proyecto eliminado no se puede recuperar",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar",
    cancelButtonText: "No, cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // petición con axios
      const url = `${location.origin}/proyectos/${urlProyecto}`;
      console.log(url);
      axios
        .delete(url)
        .then((respuesta) => {
          Swal.fire("¡Elimiado!", respuesta.data, "success").then(() => {
            window.location.href = "/";
          });
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Hubo un error",
            text: "No se pudo eliminar el proyecto",
          });
        });
    }
  });
};

export default {
  btnEliminar,
};

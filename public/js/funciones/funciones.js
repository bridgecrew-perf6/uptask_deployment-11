import Swal from "sweetalert2";

const porcentaje = () => {
  const $porcentaje = document.getElementById("porcentaje");

  const $tareas = document.querySelectorAll("li.tarea");

  const $tareasCompletas = document.querySelectorAll("i.completo");

  if ($porcentaje && $tareas && $tareasCompletas) {
    let porcentaje = Math.round(
      ($tareasCompletas.length / $tareas.length) * 100
    );

    $porcentaje.style.width = `${porcentaje}%`;

    if (porcentaje === 100)
      Swal.fire("Felicidades", "Haz completado el proyecto", "success");
  }
};

export default {
  porcentaje,
};

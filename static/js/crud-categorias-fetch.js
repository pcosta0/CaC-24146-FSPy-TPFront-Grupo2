let BASEURL = "http://127.0.0.1:5000";

// Determina si la página esta alojada en githubpages
function isRunningOnGitHubPages() {
  return window.location.hostname.endsWith(".github.io");
}

/**
 * Función para realizar una petición fetch con JSON.
 * @param {string} url - La URL a la que se realizará la petición.
 * @param {string} method - El método HTTP a usar (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [data=null] - Los datos a enviar en el cuerpo de la petición.
 * @returns {Promise<Object>} - Una promesa que resuelve con la respuesta en formato JSON.
 */
async function fetchData(url, method, data = null) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : null, // Si hay datos, los convierte a JSON y los incluye en el cuerpo
  };
  try {
    const response = await fetch(url, options); // Realiza la petición fetch
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json(); // Devuelve la respuesta en formato JSON
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Error obteniendo datos: \n" + error);
  }
}

/**
 * Funcion que permite crear un elemento <tr> para la tabla de peliculas
 * por medio del uso de template string de JS.
 */
async function showCategorias() {
  let categorias = await fetchData(BASEURL + "/api/categorias/", "GET");
  const tableCategorias = document.querySelector(
    "#list-table-categorias tbody"
  );
  tableCategorias.innerHTML = "";
  categorias.forEach((categoria, index) => {
    let tr = `<tr>
    <td>${categoria.nombre}</td>
    <td>${categoria.descripcion}</td>
    <td>${categoria.activo}</td>
    <td>
    <button class="" onclick='updateCategoria(${categoria.id_categoria})'><i class="fa fa-pencil" ></button></i>
    <button class="" onclick='deleteCategoria(${categoria.id_categoria})'><i class="fa fa-trash" ></button></i>
    </td>
    </tr>`;
    tableCategorias.insertAdjacentHTML("beforeend", tr);
  });
}

/**
 * Función para comunicarse con el servidor para poder Crear o Actualizar
 * un registro de categoria
 * @returns
 */
async function saveCategoria() {
  const idCategoria = document.querySelector("#id_categoria").value;
  const nombre = document.querySelector("#nombre").value;
  const descripcion = document.querySelector("#descripcion").value;
  const activo = document.querySelector("#activo").checked ? 1 : 0;
  // VALIDACION DE FORMULARIO
  if (!nombre || !descripcion) {
    Swal.fire({
      title: "Error!",
      text: "Por favor completa todos los campos.",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
    return;
  }
  // Crea un objeto con los datos de la película
  const CategoriaData = {
    nombre: nombre,
    descripcion: descripcion,
    activo: activo,
  };
  const formCategoria = document.querySelector("#form-categoria");
  formCategoria.reset();
  document.querySelector("#id_categoria").value = null;
  let result = null;
  // Si hay un idCategoria, realiza una petición PUT para actualizar la Categoria existente
  if (idCategoria !== "") {
    result = await fetchData(
      `${BASEURL}/api/categorias/${idCategoria}`,
      "PUT",
      CategoriaData
    );
  } else {
    // Si no hay idCategoria, realiza una petición POST para crear una nueva Categoria
    result = await fetchData(
      `${BASEURL}/api/categorias/`,
      "POST",
      CategoriaData
    );
  }
  showCategorias();
  Swal.fire({
    title: "Exito!",
    text: result.message,
    icon: "success",
    confirmButtonText: "Cerrar",
  });
}

/**
 * Function que permite cargar el formulario con los datos de la categoria
 * para su edición
 * @param {number} id Id de la categoria que se quiere editar
 */
async function updateCategoria(id) {
  // Buscamos en el servidor la categoria de acuerdo al id
  let response = await fetchData(`${BASEURL}/api/categorias/${id}`, "GET");
  const idCategoria = document.querySelector("#id_categoria");
  const nombre = document.querySelector("#nombre");
  const descripcion = document.querySelector("#descripcion");
  const activo = document.querySelector("#activo");
  idCategoria.value = response.id_categoria;
  nombre.value = response.nombre;
  descripcion.value = response.descripcion;
  activo.checked = response.activo != 0;
  window.scrollTo({ top: 0, behavior: "smooth" });
  nombre.focus();
}

/**
 * Function que permite eliminar una categoria del array del localstorage
 * de acuedo al indice del mismo
 * @param {number} id posición del array que se va a eliminar
 */
function deleteCategoria(id) {
  Swal.fire({
    title: "Esta seguro de eliminar la categoria?",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let response = await fetchData(
        `${BASEURL}/api/categorias/${id}`,
        "DELETE"
      );
      showCategorias();
      Swal.fire(response.message, "", "success");
    }
  });
}

/**
 * Funcion para limpiar el formulario
 */
function limpiarFormulario() {
  const formCategoria = document.querySelector("#form-categoria");
  formCategoria.reset();
  document.querySelector("#id_categoria").value = null;
}

// Escuchar el evento 'DOMContentLoaded' que se dispara cuando el
// contenido del DOM ha sido completamente cargado y parseado.
document.addEventListener("DOMContentLoaded", function () {
  // Determina si el front esta corriendo en githubpages para usar la API en linea
  if (isRunningOnGitHubPages()) {
    BASEURL = "https://cac-24146-fspy-tpback-grupo2.onrender.com";
  }
  const btnSaveCategoria = document.querySelector("#btn-save-categoria");
  const btnLimpiarFormulario = document.querySelector("#btn-limpiar-formulario");
  // ASOCIAR UNA FUNCION AL EVENTO CLICK DEL BOTON
  btnSaveCategoria.addEventListener("click", saveCategoria);
  btnLimpiarFormulario.addEventListener("click", limpiarFormulario);
  showCategorias();
});

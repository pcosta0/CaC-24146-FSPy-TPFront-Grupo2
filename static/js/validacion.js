function validateForm() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;
    var motivo = document.getElementById("motivo").value;

    if (
        name == "" ||
        email == "" ||
        message == "" ||
        motivo == ""
    ) {
        alert("Todos los campos son obligatorios.");
        return false;
    }
    return true;
}

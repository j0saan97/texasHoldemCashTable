<?php

// 1. Configuración de la base de datos
$servername = "localhost"; // La mayoría de los servidores usan "localhost"
$username = "tu_usuario_db"; // Reemplaza con tu usuario de la base de datos
$password = "tu_contraseña_db"; // Reemplaza con tu contraseña de la base de datos
$dbname = "nombre_de_tu_db"; // Reemplaza con el nombre de tu base de datos

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// 2. Recopilar y sanear los datos del formulario
// Si el formulario se envió por POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Asignar los datos del formulario a variables y sanearlos para prevenir inyecciones SQL
    $nombre = $conn->real_escape_string($_POST['nombre']);
    $apellidos = $conn->real_escape_string($_POST['apellidos']);
    $username = $conn->real_escape_string($_POST['username']);
    $alias = $conn->real_escape_string($_POST['alias']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password']; // La contraseña se hashea, no se sanea con real_escape_string
    $direccion = $conn->real_escape_string($_POST['direccion']);
    $ciudad = $conn->real_escape_string($_POST['ciudad']);
    $pais = $conn->real_escape_string($_POST['pais']);
    $telefono = $conn->real_escape_string($_POST['telefono']);
    
    // 3. Hashear la contraseña para mayor seguridad
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // 4. Preparar la consulta SQL para insertar los datos
    $sql = "INSERT INTO usuarios (nombre, apellidos, username, alias, email, password, direccion, ciudad, pais, telefono)
            VALUES ('$nombre', '$apellidos', '$username', '$alias', '$email', '$hashed_password', '$direccion', '$ciudad', '$pais', '$telefono')";

    // 5. Ejecutar la consulta y verificar si fue exitosa
    if ($conn->query($sql) === TRUE) {
        echo "¡Registro exitoso! 🎉";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// 6. Cerrar la conexión
$conn->close();

?>
<?php
// Configuración de la base de datos

// Cambia estos valores por los de credentials.txt
$host = "localhost";
$user = "tu_usuario_db";
$pass = "tu_password_db";
$db   = "tu_nombre_db";

$conn = new mysqli($host, $user, $pass, $db);

// 1. Procesar la Imagen
$directorio_subida = 'uploads/';
if (!file_exists($directorio_subida)) { mkdir($directorio_subida, 0777, true); }

$nombre_archivo = time() . "_" . basename($_FILES["foto_mano"]["name"]);
$ruta_final = $directorio_subida . $nombre_archivo;

if (move_uploaded_file($_FILES["foto_mano"]["tmp_name"], $ruta_final)) {
    
    // 2. Insertar datos en SQL
    $mod    = $_POST['modalidad'];
    $var    = $_POST['variedad'];
    $sub    = $_POST['subtipo'];
    $nivel  = $_POST['nivel'];
    $rival  = $_POST['rival'];
    $notas  = $_POST['notas'];

    $sql = "INSERT INTO manos (modalidad, variedad, subtipo, nivel_stake, tipo_rival, notas, ruta_imagen) 
            VALUES ('$mod', '$var', '$sub', '$nivel', '$rival', '$notas', '$ruta_final')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Guardado correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Error al subir la imagen"]);
}

$conn->close();
?>
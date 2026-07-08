<?php
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit();
}

$conn = getDB();

// ── 1. RECOGER CAMPOS DEL FORMULARIO ──────────────────────────────────────
$modalidad  = $_POST['modalidad']  ?? null;
$variedad   = $_POST['variedad']   ?? null;
$subtipo    = $_POST['subtipo']    ?? null;
$nivel      = $_POST['nivel']      ?? null;
$rival      = $_POST['rival']      ?? null;
$notas      = $_POST['notas']      ?? null;
$duda       = $_POST['duda']       ?? null;
$posicion   = $_POST['posicion']   ?? 'all';
$categorias = $_POST['categorias'] ?? '[]';
$nick       = $_POST['nick']       ?? null;
$password   = $_POST['password']   ?? null;

$categoriasArray = json_decode($categorias, true) ?: [];

// ── 2. VALIDAR JUGADOR (opcional) ─────────────────────────────────────────
$jugador_alias = null;
if ($nick && $password) {
    $stmt = $conn->prepare('SELECT nick FROM users_hand_review WHERE nick = ? AND password = ?');
    $stmt->bind_param('ss', $nick, $password);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows > 0) {
        $jugador_alias = $res->fetch_assoc()['nick'];
    }
    $stmt->close();
}

// ── 3. SUBIR IMAGEN ───────────────────────────────────────────────────────
$foto_path = null;
if (isset($_FILES['foto_mano']) && $_FILES['foto_mano']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $originalName = basename($_FILES['foto_mano']['name']);
    $uniqueName   = time() . '_' . substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 6) . '_' . $originalName;
    $destPath     = $uploadDir . $uniqueName;

    if (!move_uploaded_file($_FILES['foto_mano']['tmp_name'], $destPath)) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Error al mover el archivo subido']);
        exit();
    }
    $foto_path = $uniqueName;
}

// ── 4. VARIEDAD: buscar o insertar ────────────────────────────────────────
$variedad_id = null;
$stmt = $conn->prepare('SELECT id FROM variedades WHERE nombre = ?');
$stmt->bind_param('s', $variedad);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows > 0) {
    $variedad_id = $res->fetch_assoc()['id'];
} else {
    $stmt2 = $conn->prepare('INSERT INTO variedades (nombre) VALUES (?)');
    $stmt2->bind_param('s', $variedad);
    $stmt2->execute();
    $variedad_id = $stmt2->insert_id;
    $stmt2->close();
}
$stmt->close();

// ── 5. SUBTIPO: buscar o insertar ─────────────────────────────────────────
$subtipo_id = null;
$stmt = $conn->prepare('SELECT id FROM subtipos WHERE nombre = ? AND variedad_id = ?');
$stmt->bind_param('si', $subtipo, $variedad_id);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows > 0) {
    $subtipo_id = $res->fetch_assoc()['id'];
} else {
    $stmt2 = $conn->prepare('INSERT INTO subtipos (variedad_id, nombre) VALUES (?, ?)');
    $stmt2->bind_param('is', $variedad_id, $subtipo);
    $stmt2->execute();
    $subtipo_id = $stmt2->insert_id;
    $stmt2->close();
}
$stmt->close();

// ── 6. INSERTAR MANO ──────────────────────────────────────────────────────
$stmt = $conn->prepare(
    'INSERT INTO manos_review 
        (modalidad, variedad_id, subtipo_id, nivel_stake, tipo_rival, notas, duda, posicion, ruta_imagen, jugador_alias) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
$stmt->bind_param('siisssssss', $modalidad, $variedad_id, $subtipo_id, $nivel, $rival, $notas, $duda, $posicion, $foto_path, $jugador_alias);
$stmt->execute();
$mano_id = $stmt->insert_id;
$stmt->close();

// ── 7. INSERTAR CATEGORÍAS ────────────────────────────────────────────────
foreach ($categoriasArray as $catId) {
    $catId = (int)$catId;
    $stmt = $conn->prepare('INSERT INTO mano_categorias (mano_id, categoria_id) VALUES (?, ?)');
    $stmt->bind_param('ii', $mano_id, $catId);
    $stmt->execute();
    $stmt->close();
}

$conn->close();
echo json_encode(['status' => 'success', 'message' => 'Mano guardada con éxito']);

<?php
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // Usamos POST en vez de PUT porque algunos hostings bloquean PUT
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit();
}

$body     = json_decode(file_get_contents('php://input'), true);
$nick      = $body['nick']       ?? null;
$password  = $body['password']   ?? null;
$comentario = $body['comentario'] ?? null;
$mano_id   = (int)($body['mano_id'] ?? 0);

if (!$nick || !$password || !$mano_id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Faltan campos requeridos']);
    exit();
}

$conn = getDB();

// ── VALIDAR QUE ES top_reg ────────────────────────────────────────────────
$stmt = $conn->prepare(
    'SELECT nick FROM users_hand_review WHERE nick = ? AND password = ? AND user_type = ?'
);
$tipo = 'top_reg';
$stmt->bind_param('sss', $nick, $password, $tipo);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'No autorizado']);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// ── GUARDAR COMENTARIO Y MARCAR COMO REVISADA ─────────────────────────────
$stmt = $conn->prepare(
    'UPDATE manos_review SET comentario = ?, estado_revision = ? WHERE id = ?'
);
$estado = 'revisada';
$stmt->bind_param('ssi', $comentario, $estado, $mano_id);
$stmt->execute();
$stmt->close();

$conn->close();
echo json_encode(['status' => 'success', 'message' => 'Comentario guardado']);

<?php
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit();
}

$body = json_decode(file_get_contents('php://input'), true);
$nick     = $body['nick']     ?? null;
$password = $body['password'] ?? null;

if (!$nick || !$password) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Nick y password requeridos']);
    exit();
}

$conn = getDB();

$stmt = $conn->prepare(
    'SELECT nick FROM users_hand_review WHERE nick = ? AND password = ? AND user_type = ?'
);
$tipo = 'top_reg';
$stmt->bind_param('sss', $nick, $password, $tipo);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    echo json_encode(['status' => 'ok']);
} else {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Credenciales incorrectas']);
}

$stmt->close();
$conn->close();

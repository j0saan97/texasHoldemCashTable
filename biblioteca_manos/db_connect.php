<?php
// ──────────────────────────────────────────────
//  CONFIGURACIÓN DE CONEXIÓN A BANAHOSTING
//  Rellena con tus datos del panel de BanaHosting
// ──────────────────────────────────────────────
define('DB_HOST',   'localhost');
define('DB_USER',   'nofxdyfx_jose');
define('DB_PASS',   'S@pUo(#9dYf9a3er');
define('DB_NAME',   'nofxdyfx_texas_holdem_cash_table');

function getDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode(['status' => 'error', 'message' => 'Error de conexión: ' . $conn->connect_error]));
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

// Cabeceras CORS para todos los endpoints
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

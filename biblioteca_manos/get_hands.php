<?php
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit();
}

$conn = getDB();

// ── CONSTRUCCIÓN DINÁMICA DE FILTROS ──────────────────────────────────────
$conditions = [];
$params     = [];
$types      = '';

if (!empty($_GET['modalidad'])) {
    $conditions[] = 'm.modalidad = ?';
    $params[]     = $_GET['modalidad'];
    $types       .= 's';
}
if (!empty($_GET['variedad'])) {
    $conditions[] = 'v.nombre = ?';
    $params[]     = $_GET['variedad'];
    $types       .= 's';
}
if (!empty($_GET['subtipo'])) {
    $conditions[] = 's.nombre = ?';
    $params[]     = $_GET['subtipo'];
    $types       .= 's';
}
if (!empty($_GET['nivel'])) {
    $conditions[] = 'm.nivel_stake = ?';
    $params[]     = $_GET['nivel'];
    $types       .= 's';
}
if (!empty($_GET['rival'])) {
    $conditions[] = 'm.tipo_rival = ?';
    $params[]     = $_GET['rival'];
    $types       .= 's';
}
if (!empty($_GET['posicion']) && $_GET['posicion'] !== 'all') {
    $conditions[] = 'm.posicion = ?';
    $params[]     = $_GET['posicion'];
    $types       .= 's';
}
if (!empty($_GET['clasificacion'])) {
    $conditions[] = 'mc.categoria_id = ?';
    $params[]     = (int)$_GET['clasificacion'];
    $types       .= 'i';
}
if (!empty($_GET['estado'])) {
    $conditions[] = 'm.estado_revision = ?';
    $params[]     = $_GET['estado']; // 'pendiente' o 'revisada'
    $types       .= 's';
}
if (!empty($_GET['jugador_alias'])) {
    $conditions[] = 'm.jugador_alias = ?';
    $params[]     = $_GET['jugador_alias'];
    $types       .= 's';
}

// ── FILTRO DE FECHAS ──────────────────────────────────────────────────────
$rango = $_GET['rangoDeFechas'] ?? null;
if ($rango === 'today') {
    $conditions[] = 'DATE(m.fecha_registro) = CURDATE()';
} elseif ($rango === 'yesterday') {
    $conditions[] = 'DATE(m.fecha_registro) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)';
} elseif ($rango === 'this_month') {
    $conditions[] = 'YEAR(m.fecha_registro) = YEAR(CURDATE()) AND MONTH(m.fecha_registro) = MONTH(CURDATE())';
} elseif ($rango === 'this_year') {
    $conditions[] = 'YEAR(m.fecha_registro) = YEAR(CURDATE())';
} elseif ($rango === 'since' && !empty($_GET['fechaInicio'])) {
    $conditions[] = 'DATE(m.fecha_registro) >= ?';
    $params[]     = $_GET['fechaInicio'];
    $types       .= 's';
} elseif ($rango === 'before' && !empty($_GET['fechaFin'])) {
    $conditions[] = 'DATE(m.fecha_registro) <= ?';
    $params[]     = $_GET['fechaFin'];
    $types       .= 's';
} elseif ($rango === 'select_date' && !empty($_GET['fechaExacta'])) {
    $conditions[] = 'DATE(m.fecha_registro) = ?';
    $params[]     = $_GET['fechaExacta'];
    $types       .= 's';
} elseif ($rango === 'between' && !empty($_GET['fechaInicio']) && !empty($_GET['fechaFin'])) {
    $conditions[] = 'DATE(m.fecha_registro) BETWEEN ? AND ?';
    $params[]     = $_GET['fechaInicio'];
    $params[]     = $_GET['fechaFin'];
    $types       .= 'ss';
}

$whereClause = count($conditions) > 0 ? 'WHERE ' . implode(' AND ', $conditions) : '';

// ── QUERY PRINCIPAL ───────────────────────────────────────────────────────
$sql = "
    SELECT
        m.id,
        m.modalidad,
        v.nombre            AS variedad,
        s.nombre            AS subtipo,
        m.nivel_stake,
        m.tipo_rival,
        m.posicion,
        m.duda,
        m.estado_revision,
        m.comentario,
        m.notas,
        m.ruta_imagen,
        m.jugador_alias,
        m.fecha_registro,
        GROUP_CONCAT(c.nombre ORDER BY c.nombre SEPARATOR ', ') AS categorias
    FROM manos_review m
    LEFT JOIN variedades      v  ON m.variedad_id   = v.id
    LEFT JOIN subtipos        s  ON m.subtipo_id    = s.id
    LEFT JOIN mano_categorias mc ON m.id            = mc.mano_id
    LEFT JOIN categorias      c  ON mc.categoria_id = c.id
    $whereClause
    GROUP BY
        m.id, m.modalidad, v.nombre, s.nombre,
        m.nivel_stake, m.tipo_rival, m.posicion,
        m.jugador_alias, m.duda, m.estado_revision,
        m.comentario, m.notas, m.ruta_imagen, m.fecha_registro
    ORDER BY m.fecha_registro DESC
";

$stmt = $conn->prepare($sql);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$manos = [];
while ($row = $result->fetch_assoc()) {
    $manos[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode([
    'error'   => 'N/A',
    'message' => 'Correcto',
    'manos'   => $manos,
    'count'   => count($manos)
]);

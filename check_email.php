<?php
require 'config.php';
header('Content-Type: application/json');
$email = trim($_GET['email'] ?? '');
$exists = false;
if ($email) {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $exists = (bool)$stmt->fetch();
}
echo json_encode(['exists' => $exists]);
?>

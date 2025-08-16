<?php
require 'config.php';
require 'auth.php';
header('Content-Type: application/json');

$response = ['premium' => false];
$userId = current_user_id();
if ($userId) {
    $stmt = $pdo->prepare('SELECT status FROM billing_subscriptions WHERE user_id = ? AND status = "active" ORDER BY id DESC LIMIT 1');
    $stmt->execute([$userId]);
    $sub = $stmt->fetch();
    if ($sub && $sub['status'] === 'active') {
        $response['premium'] = true;
    }
}

echo json_encode($response);
?>

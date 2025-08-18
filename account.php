<?php
require 'config.php';
require 'auth.php';
require_login();

$userId = current_user_id();
$stmt = $pdo->prepare('SELECT email FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div style="max-width:420px;margin:40px auto;">
        <div class="panel">
            <h3>Account</h3>
            <p class="mb-4">Logged in as: <?= htmlspecialchars($user['email'] ?? '') ?></p>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
                <a href="logout.php" class="btn btn-ghost">Logout</a>
            </div>
        </div>
    </div>
</body>
</html>

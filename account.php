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
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto p-8 max-w-md">
        <h1 class="text-2xl font-bold mb-4 text-center">Account</h1>
        <p class="mb-4">Logged in as: <?= htmlspecialchars($user['email'] ?? '') ?></p>
        <div class="text-center"><a href="logout.php" class="text-blue-600">Logout</a></div>
    </div>
</body>
</html>

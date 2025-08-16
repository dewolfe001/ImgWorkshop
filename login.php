<?php
require 'config.php';
session_start();

$next = $_GET['next'] ?? 'index.html';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    if ($email && $password) {
        $stmt = $pdo->prepare('SELECT id, password_hash FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['is_admin'] = 0;
            header('Location: ' . $next);
            exit;
        } else {
            $error = 'Invalid credentials';
        }
    } else {
        $error = 'Email and password required';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto p-8 max-w-md">
        <h1 class="text-2xl font-bold mb-4 text-center">Login</h1>
        <?php if (!empty($error)) echo '<p class="text-red-600 mb-4">' . htmlspecialchars($error) . '</p>'; ?>
        <form method="post" class="bg-white p-6 rounded shadow">
            <input class="border p-2 w-full mb-2" type="email" name="email" placeholder="Email" required />
            <input class="border p-2 w-full mb-4" type="password" name="password" placeholder="Password" required />
            <button class="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">Login</button>
        </form>
    </div>
</body>
</html>

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
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div style="max-width:420px;margin:40px auto;">
        <div class="panel">
            <h3>Login</h3>
            <?php if (!empty($error)) echo '<p class="small" style="color:var(--danger)">' . htmlspecialchars($error) . '</p>'; ?>
            <form method="post">
                <input class="input" type="email" name="email" placeholder="Email" required />
                <input class="input" type="password" name="password" placeholder="Password" required />
                <button class="btn btn-primary" type="submit">Login</button>
            </form>
        </div>
    </div>
</body>
</html>

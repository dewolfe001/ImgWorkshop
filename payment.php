<?php
require 'config.php';
session_start();

$domain = $_GET['domain'] ?? '';
$uploadId = isset($_GET['upload_id']) ? (int)$_GET['upload_id'] : 0;
$loggedIn = isset($_SESSION['user_id']);
$next = urlencode('payment.php?domain=' . $domain . '&upload_id=' . $uploadId);
if ($domain === '') {
    die('Domain not specified');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $plan = $_POST['plan'] ?? 'monthly';
    if (!in_array($plan, ['monthly', 'yearly'])) {
        $plan = 'monthly';
    }
    if ($loggedIn) {
        header('Location: subscribe.php?plan=' . urlencode($plan) . '&domain=' . urlencode($domain) . '&upload_id=' . $uploadId);
        exit;
    }
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    if ($email && $password) {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $error = 'Email already registered. Please login.';
        } else {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $insert = $pdo->prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
            $insert->execute([$email, $hash]);
            $_SESSION['user_id'] = $pdo->lastInsertId();
            $_SESSION['is_admin'] = 0;
            header('Location: subscribe.php?plan=' . urlencode($plan) . '&domain=' . urlencode($domain) . '&upload_id=' . $uploadId);
            exit;
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
    <title>Choose Plan</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <form method="post" style="max-width:420px;margin:40px auto;display:flex;flex-direction:column;gap:20px;">
        <div class="panel">
            <h3><?= $loggedIn ? 'Choose Plan for ' . htmlspecialchars($domain) : 'Register ' . htmlspecialchars($domain) ?></h3>
            <?php if (!empty($error)) echo '<p class="small" style="color:var(--danger)">' . htmlspecialchars($error) . '</p>'; ?>
            <?php if (!$loggedIn): ?>
            <input id="email" class="input" type="email" name="email" placeholder="Email" required />
            <p id="email-msg" class="small"></p>
            <input class="input" type="password" name="password" placeholder="Password" required />
            <?php endif; ?>
            <div class="segmented" id="plan-tabs">
                <label class="seg active">
                    <input type="radio" name="plan" value="monthly" checked hidden>
                    Monthly
                </label>
                <label class="seg">
                    <input type="radio" name="plan" value="yearly" hidden>
                    Yearly
                </label>
            </div>
        </div>

        <div class="panel">
            <h3>Actions</h3>
            <div style="display:flex; gap:10px; flex-wrap:wrap">
                <button class="btn btn-primary" type="submit">Checkout</button>
                <?php if (!$loggedIn): ?>
                <a href="login.php?next=<?= $next ?>" class="btn btn-ghost">Returning User? Login</a>
                <?php else: ?>
                <a href="logout.php" class="btn btn-ghost">Logout</a>
                <?php endif; ?>
            </div>
        </div>
    </form>
    <?php if (!$loggedIn): ?>
    <script>
    document.getElementById('email').addEventListener('blur', function() {
        fetch('check_email.php?email=' + encodeURIComponent(this.value))
            .then(r => r.json())
            .then(data => {
                const msg = document.getElementById('email-msg');
                if (data.exists) {
                    msg.textContent = 'Email already registered. Please use Returning User to login.';
                    msg.style.color = 'var(--danger)';
                } else {
                    msg.textContent = '';
                    msg.style.color = '';
                }
            });
    });
    </script>
    <?php endif; ?>
    <script>
    document.querySelectorAll('#plan-tabs input[name="plan"]').forEach(r => {
        r.addEventListener('change', () => {
            document.querySelectorAll('#plan-tabs .seg').forEach(l => l.classList.remove('active'));
            r.closest('.seg').classList.add('active');
        });
    });
    </script>
</body>
</html>


<?php
function loadEnv(string $dir): void {
    $file = rtrim($dir, DIRECTORY_SEPARATOR) . '/.env';
    if (!is_readable($file)) {
        return;
    }
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        if (!strpos($line, '=')) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value, " \"'\t\n\r");
        putenv("{$name}={$value}");
        $_ENV[$name] = $value;
    }
}
?>

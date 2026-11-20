<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? 'list';

if ($method === 'GET' && $action === 'list') {
    json_response(['ok' => true, 'products' => load_products()]);
}

if ($method === 'GET' && $action === 'status') {
    json_response(['ok' => true, 'authenticated' => !empty($_SESSION['is_admin'])]);
}

if ($method === 'POST' && $action === 'login') {
    $body = read_json_body();
    $username = (string) ($body['username'] ?? '');
    $password = (string) ($body['password'] ?? '');
    $passwordHashParts = explode(':', ADMIN_PASSWORD_HASH, 2);
    $passwordMatchesHash = count($passwordHashParts) === 2
        && strlen($passwordHashParts[0]) === 32
        && strlen($passwordHashParts[1]) === 64
        && ctype_xdigit($passwordHashParts[0])
        && ctype_xdigit($passwordHashParts[1])
        && hash_equals(
            $passwordHashParts[1],
            hash_pbkdf2('sha256', $password, hex2bin($passwordHashParts[0]), 600000, 64)
        );
    $passwordMatchesLegacyOverride = ADMIN_PASSWORD !== ''
        && hash_equals(ADMIN_PASSWORD, $password);

    if (
        hash_equals(ADMIN_USERNAME, $username)
        && ($passwordMatchesHash || $passwordMatchesLegacyOverride)
    ) {
        session_regenerate_id(true);
        $_SESSION['is_admin'] = true;
        json_response(['ok' => true]);
    }

    json_response(['ok' => false, 'error' => 'Invalid credentials'], 401);
}

if ($method === 'POST' && $action === 'logout') {
    $_SESSION = [];
    session_destroy();
    json_response(['ok' => true]);
}

if ($method === 'POST' && $action === 'save') {
    require_admin();
    $body = read_json_body();
    $products = normalize_products($body['products'] ?? []);
    save_products($products);
    json_response(['ok' => true, 'products' => $products]);
}

if ($method === 'POST' && $action === 'reset') {
    require_admin();
    save_products([]);
    json_response(['ok' => true, 'products' => []]);
}

json_response(['ok' => false, 'error' => 'Not found'], 404);

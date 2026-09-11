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

    if (hash_equals(ADMIN_USERNAME, $username) && hash_equals(ADMIN_PASSWORD, $password)) {
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

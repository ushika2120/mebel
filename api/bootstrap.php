<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Strict',
]);

function json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function require_admin(): void
{
    if (empty($_SESSION['is_admin'])) {
        json_response(['ok' => false, 'error' => 'Unauthorized'], 401);
    }
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);

    if (!is_array($data)) {
        json_response(['ok' => false, 'error' => 'Invalid JSON'], 400);
    }

    return $data;
}

function ensure_data_file(): void
{
    $directory = dirname(DATA_FILE);

    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    if (!is_file(DATA_FILE)) {
        file_put_contents(DATA_FILE, "[]\n", LOCK_EX);
    }
}

function load_products(): array
{
    ensure_data_file();
    $contents = file_get_contents(DATA_FILE);
    $products = json_decode($contents ?: '[]', true);

    return is_array($products) ? $products : [];
}

function clean_text(mixed $value, int $limit = 250): string
{
    $text = trim((string) $value);
    $text = preg_replace('/[\x00-\x1F\x7F]/u', '', $text) ?? '';

    if (function_exists('mb_substr')) {
        return mb_substr($text, 0, $limit, 'UTF-8');
    }

    return substr($text, 0, $limit);
}

function normalize_products(array $products): array
{
    $allowedCategories = ['living-room', 'bedroom', 'dining-room', 'office'];
    $clean = [];

    foreach ($products as $product) {
        if (!is_array($product)) {
            continue;
        }

        $category = clean_text($product['category'] ?? '');
        if (!in_array($category, $allowedCategories, true)) {
            continue;
        }

        $nameKa = clean_text($product['nameKa'] ?? '');
        $nameEn = clean_text($product['nameEn'] ?? '');
        $image = clean_text($product['image'] ?? '', 500);

        if ($nameKa === '' && $nameEn === '') {
            continue;
        }

        if ($image === '') {
            continue;
        }

        $clean[] = [
            'id' => clean_text($product['id'] ?? ('product-' . bin2hex(random_bytes(8))), 80),
            'category' => $category,
            'nameKa' => $nameKa,
            'nameEn' => $nameEn,
            'price' => clean_text($product['price'] ?? '', 80),
            'image' => $image,
        ];
    }

    return $clean;
}

function save_products(array $products): void
{
    ensure_data_file();
    $json = json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    if ($json === false || file_put_contents(DATA_FILE, $json . "\n", LOCK_EX) === false) {
        json_response(['ok' => false, 'error' => 'Could not save products'], 500);
    }
}

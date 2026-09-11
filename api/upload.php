<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

require_admin();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

if (empty($_FILES['image']) || !is_uploaded_file($_FILES['image']['tmp_name'])) {
    json_response(['ok' => false, 'error' => 'No image uploaded'], 400);
}

$file = $_FILES['image'];

if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
    json_response(['ok' => false, 'error' => 'Upload failed'], 400);
}

if (($file['size'] ?? 0) > 4 * 1024 * 1024) {
    json_response(['ok' => false, 'error' => 'Image is too large'], 400);
}

$info = getimagesize($file['tmp_name']);
if ($info === false) {
    json_response(['ok' => false, 'error' => 'File is not an image'], 400);
}

$extensions = [
    IMAGETYPE_JPEG => 'jpg',
    IMAGETYPE_PNG => 'png',
    IMAGETYPE_WEBP => 'webp',
    IMAGETYPE_GIF => 'gif',
];

$extension = $extensions[$info[2]] ?? null;
if ($extension === null) {
    json_response(['ok' => false, 'error' => 'Unsupported image type'], 400);
}

if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

$name = 'product-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $extension;
$target = UPLOAD_DIR . '/' . $name;

if (!move_uploaded_file($file['tmp_name'], $target)) {
    json_response(['ok' => false, 'error' => 'Could not save image'], 500);
}

json_response([
    'ok' => true,
    'path' => './photo/' . $name,
]);

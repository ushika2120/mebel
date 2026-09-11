<?php
declare(strict_types=1);

// Change these credentials before uploading the site to mebel.com.ge.
define('ADMIN_USERNAME', getenv('MEBEL_ADMIN_USER') ?: 'Shorena');
define('ADMIN_PASSWORD', getenv('MEBEL_ADMIN_PASSWORD') ?: 'Shorena123');

const DATA_FILE = __DIR__ . '/../data/products.json';
const UPLOAD_DIR = __DIR__ . '/../photo';

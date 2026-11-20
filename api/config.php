<?php
declare(strict_types=1);

define('ADMIN_USERNAME', getenv('MEBEL_ADMIN_USER') ?: 'shorena11');
define('ADMIN_PASSWORD', getenv('MEBEL_ADMIN_PASSWORD') ?: '');
define(
    'ADMIN_PASSWORD_HASH',
    getenv('MEBEL_ADMIN_PASSWORD_HASH')
        ?: '5d155a47f6cc15b0dad8c3318ebb1655:ffdfd217848cddf8caa245c4726be57dffd58e97c0890c7707d67b5e2e0b8304'
);

const DATA_FILE = __DIR__ . '/../data/products.json';
const UPLOAD_DIR = __DIR__ . '/../photo';

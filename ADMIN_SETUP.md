# Admin Panel Setup

Admin Panel URL:

```text
https://mebel.com.ge/admin.html
```

Default login is set in `api/config.php`:

```php
define('ADMIN_USERNAME', getenv('MEBEL_ADMIN_USER') ?: 'admin');
define('ADMIN_PASSWORD', getenv('MEBEL_ADMIN_PASSWORD') ?: 'change-this-password');
```

Before uploading to production, change `change-this-password` to a strong password.

The backend stores products in:

```text
data/products.json
```

Uploaded product photos are saved in:

```text
photo/
```

The hosting account must support PHP and must allow write access to `data/products.json` and the `photo/` folder.

Public catalog API:

```text
api/products.php?action=list
```

Admin actions are protected by session login.

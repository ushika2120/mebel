# Admin Panel Setup

Admin Panel URL:

```text
https://mebel.com.ge/admin.html
```

The default username and password hash are set in `api/config.php`. The password
is stored as a PBKDF2-SHA256 hash, not as plain text.

You can override the username with `MEBEL_ADMIN_USER` and provide a password hash
in `32-character-hex-salt:64-character-hex-hash` format with
`MEBEL_ADMIN_PASSWORD_HASH`. The legacy
`MEBEL_ADMIN_PASSWORD` plain-text environment override is also supported.

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

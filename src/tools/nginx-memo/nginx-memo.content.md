**nginx** is a web server, reverse proxy and load balancer. Configuration is a tree of *contexts* — `main` → `events` / `http` → `server` → `location` — and a directive is only valid in the contexts that define it.

## 🛠 Service & CLI

```bash
# check the configuration before you break production
sudo nginx -t

# print the entire resolved configuration, includes and all
sudo nginx -T

# reload without dropping connections
sudo nginx -s reload
sudo systemctl reload nginx

# start, stop, restart, status
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl status nginx

# version, and the modules it was built with
nginx -V

# enable a site (Debian/Ubuntu layout)
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

# watch the requests come in
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

> 💡 `nginx -t` then `nginx -s reload` — never `restart` on a live server if you can avoid it. A reload keeps existing connections alive; a restart drops them.

## 📁 Where Things Live

| Path                          | What it holds                                        |
|-------------------------------|------------------------------------------------------|
| `/etc/nginx/nginx.conf`       | The main file — worker settings and the `http` block |
| `/etc/nginx/conf.d/*.conf`    | Included by default on RHEL-style installs           |
| `/etc/nginx/sites-available/` | Site configs on Debian/Ubuntu                        |
| `/etc/nginx/sites-enabled/`   | Symlinks to the sites that are actually live         |
| `/var/log/nginx/access.log`   | Every request                                        |
| `/var/log/nginx/error.log`    | Errors, and anything the workers complain about      |
| `/var/www/html`               | The conventional document root                       |

## 🧱 Config Skeleton

```nginx
user www-data;
worker_processes auto;

events {
  worker_connections 1024;
}

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;
  sendfile      on;
  keepalive_timeout 65;

  server {
    listen 80;
    server_name example.com;

    location / {
      root /var/www/html;
      index index.html;
    }
  }
}
```

## 🎧 listen & server_name

```nginx
server {
  # plain HTTP
  listen 80;

  # HTTPS, with HTTP/2
  listen 443 ssl;
  http2 on;

  # IPv6 as well, or IPv6 only
  listen [::]:80;
  listen [::]:80 ipv6only=on;

  # the fallback server for requests that match no other server_name
  listen 80 default_server;

  # one name, several names, wildcards, or a regex
  server_name example.com;
  server_name example.com www.example.com;
  server_name *.example.com;
  server_name ~^(?<sub>.+)\.example\.com$;

  # requests that arrive with no Host header
  server_name "";
}
```

## 📄 Serving Files

```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/example.com;
  index index.html index.htm;

  # try the file, then the directory, then fall back — the SPA pattern
  location / {
    try_files $uri $uri/ /index.html;
  }

  # cache fingerprinted assets hard
  location ~* \.(js|css|png|jpe?g|gif|svg|woff2?)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
  }

  # a directory listing, when you actually want one
  location /downloads/ {
    autoindex on;
  }

  # a single file
  location = /robots.txt {
    root /var/www/example.com;
    log_not_found off;
  }
}
```

> ⚠️ **`root` vs `alias`**: `root` appends the whole URI to the path, `alias` replaces the matched prefix. With `location /static/ { root /var/www; }` a request for `/static/a.png` reads `/var/www/static/a.png`; with `alias /var/www/assets/;` it reads `/var/www/assets/a.png`. Always end an `alias` path with `/`.

## 📍 Location Matching

nginx does not pick locations top to bottom — it picks by modifier, in this order:

| Modifier | Example                  | Meaning                                             | Priority             |
|----------|--------------------------|-----------------------------------------------------|----------------------|
| `=`      | `location = /health`     | Exact match                                         | 1 — wins immediately |
| `^~`     | `location ^~ /static/`   | Prefix match that stops regex matching              | 2                    |
| `~`      | `location ~ \.php$`      | Case-sensitive regex, first match in file order     | 3                    |
| `~*`     | `location ~* \.(jpe?g)$` | Case-insensitive regex                              | 3                    |
| *(none)* | `location /images/`      | Prefix match — the longest one wins if no regex did | 4                    |

```nginx
location = /health { return 200 "ok\n"; }   # checked first, cheapest
location ^~ /assets/ { root /var/www; }     # never falls through to the regex below
location ~* \.(png|jpg)$ { expires 30d; }
location / { try_files $uri $uri/ =404; }   # the catch-all
```

## 🔀 Redirects & Rewrites

```nginx
# permanent redirect to the canonical host
server {
  listen 80;
  server_name www.example.com;
  return 301 https://example.com$request_uri;
}

# force HTTPS
server {
  listen 80;
  server_name example.com;
  return 301 https://$host$request_uri;
}

# temporary redirect of a single path
location /old-page {
  return 302 /new-page;
}

# rewrite with a captured segment
location /blog/ {
  rewrite ^/blog/(.*)$ /articles/$1 permanent;
}

# serve a maintenance page for everyone but your own IP
location / {
  if ($remote_addr != 203.0.113.7) {
    return 503;
  }
}
```

> 💡 Prefer `return` over `rewrite` — it is faster and clearer. Reach for `rewrite` only when you need to transform the path.

## 🔁 Reverse Proxy

```nginx
server {
  listen 80;
  server_name app.example.com;

  location / {
    proxy_pass http://127.0.0.1:3000;

    # pass the client's details through to the app
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # timeouts: raise these for slow backends
    proxy_connect_timeout 60s;
    proxy_send_timeout    60s;
    proxy_read_timeout    60s;

    # buffering off for streaming responses (SSE, logs)
    proxy_buffering on;
  }

  # WebSockets need the upgrade headers
  location /ws/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 3600s;
  }
}
```

> ⚠️ The trailing slash on `proxy_pass` changes everything. `proxy_pass http://backend;` forwards `/api/users` as `/api/users`; `proxy_pass http://backend/;` strips the matched location prefix first.

## ⚖️ Load Balancing

```nginx
upstream backend {
  # least_conn;              # send to the server with the fewest connections
  # ip_hash;                 # sticky sessions by client IP
  # hash $request_uri;       # sticky by URI

  server 10.0.0.1:3000 weight=3;
  server 10.0.0.2:3000;
  server 10.0.0.3:3000 max_fails=3 fail_timeout=30s;
  server 10.0.0.4:3000 backup;

  keepalive 32;              # reuse upstream connections
}

server {
  listen 80;
  location / {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Connection "";   # required for keepalive to work
  }
}
```

| Method                  | Behaviour                                       |
|-------------------------|-------------------------------------------------|
| *(default)*             | Round robin, honouring `weight`                 |
| `least_conn`            | Fewest active connections wins                  |
| `ip_hash`               | Same client IP always reaches the same server   |
| `hash <key>`            | Distribute by any variable, e.g. `$request_uri` |
| `random two least_conn` | Pick two at random, then the less busy one      |

## 🔐 HTTPS

```nginx
server {
  listen 443 ssl;
  http2 on;
  server_name example.com;

  ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers off;
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 1d;
  ssl_stapling on;
  ssl_stapling_verify on;

  # tell browsers to stay on HTTPS
  add_header Strict-Transport-Security "max-age=63072000" always;
}
```

```bash
# get and renew certificates automatically
sudo certbot --nginx -d example.com -d www.example.com
sudo certbot renew --dry-run
```

## 🚦 Limits & Access Control

```nginx
http {
  # 10 MB of state ≈ 160k addresses; 10 requests/second per IP
  limit_req_zone $binary_remote_addr zone=req_limit:10m rate=10r/s;
  limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

  server {
    # allow short bursts, queue the rest without delaying legitimate users
    location /api/ {
      limit_req zone=req_limit burst=20 nodelay;
      limit_conn conn_limit 10;
    }

    # the size of the largest upload you accept
    client_max_body_size 25m;

    # HTTP basic auth (htpasswd -c /etc/nginx/.htpasswd user)
    location /admin/ {
      auth_basic "Restricted";
      auth_basic_user_file /etc/nginx/.htpasswd;
    }

    # allow a subnet, deny the rest
    location /internal/ {
      allow 10.0.0.0/8;
      deny  all;
    }

    # do not serve dotfiles
    location ~ /\.(?!well-known) {
      deny all;
    }
  }
}
```

## 🗜 Performance

```nginx
http {
  # compress text responses
  gzip on;
  gzip_vary on;
  gzip_min_length 1024;
  gzip_types text/plain text/css application/json application/javascript
             text/xml application/xml image/svg+xml;

  # kernel-level file sending
  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;

  # keep connections around for reuse
  keepalive_timeout 65;
  keepalive_requests 1000;

  # cache open file handles
  open_file_cache max=10000 inactive=30s;
  open_file_cache_valid 60s;

  # a proxy cache for upstream responses
  proxy_cache_path /var/cache/nginx keys_zone=app_cache:10m max_size=1g inactive=60m;

  server {
    location / {
      proxy_cache app_cache;
      proxy_cache_valid 200 10m;
      add_header X-Cache-Status $upstream_cache_status;
    }
  }
}
```

## 🧪 Useful Variables

| Variable                     | Holds                                            |
|------------------------------|--------------------------------------------------|
| `$host`                      | The Host header, or the server name that matched |
| `$uri`                       | The normalised path, without the query string    |
| `$request_uri`               | The original path **with** the query string      |
| `$args` / `$arg_name`        | The whole query string / one named parameter     |
| `$scheme`                    | `http` or `https`                                |
| `$remote_addr`               | The client's IP address                          |
| `$proxy_add_x_forwarded_for` | The existing chain plus `$remote_addr`           |
| `$http_<name>`               | Any request header, e.g. `$http_user_agent`      |
| `$request_method`            | `GET`, `POST`, …                                 |
| `$status`                    | The response status                              |
| `$upstream_addr`             | Which backend actually served the request        |
| `$upstream_response_time`    | How long the backend took                        |
| `$request_time`              | How long nginx took, start to finish             |

## 🩺 Troubleshooting

| Symptom                          | Usual cause                                                                      |
|----------------------------------|----------------------------------------------------------------------------------|
| `502 Bad Gateway`                | The backend is down, or refused the connection — check the app and `proxy_pass`  |
| `504 Gateway Timeout`            | The backend is too slow — raise `proxy_read_timeout`, then fix the app           |
| `413 Request Entity Too Large`   | Raise `client_max_body_size`                                                     |
| `403 Forbidden` on a static file | The worker user cannot read the path, or a directory lacks `x`                   |
| The wrong site is served         | No `server_name` matched, so the `default_server` answered                       |
| Changes have no effect           | The config was never reloaded, or the file is not symlinked into `sites-enabled` |

```bash
# see the config nginx is actually running, includes resolved
sudo nginx -T | less

# which worker user needs read access
ps -o user= -C nginx | sort -u

# turn up the error log while debugging
# error_log /var/log/nginx/error.log debug;
```

## 📚 Resources

- [Official documentation](https://nginx.org/en/docs/)
- [Directive index](https://nginx.org/en/docs/dirindex.html)
- [Variable index](https://nginx.org/en/docs/varindex.html)
- [Mozilla SSL configuration generator](https://ssl-config.mozilla.org/)
- [Certbot — Let's Encrypt](https://certbot.eff.org/)

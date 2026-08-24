```bash
##############################################################################
# NGINX
# 文档: https://nginx.org/en/docs/
##############################################################################

sudo nginx -t # 检查语法
sudo systemctl status nginx # nginx 当前状态
sudo systemctl reload nginx # 重新加载 nginx
sudo systemctl restart nginx  # 重启 nginx
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/ # 链接网站
sudo tail -f /var/log/nginx/access.log # 实时查看日志以检查请求

# *****************************************************************************
# 常规设置
# *****************************************************************************

# 端口

server {
  # 使用 HTTP 协议
  listen 80;
  
  # 使用 HTTPS 协议
  listen 443 ssl;
  
  # 使用 IPv6 监听 80 端口
  listen [::]:80;
  
  # 仅使用 IPv6 监听 80 端口
  listen [::]:80 ipv6only=on;
}

# 域名 (server_name)

server {
  # 监听 example.com
  server_name example.com;
  
  # 监听多个域名
  server_name example.com www.example.com;
  
  # 监听所有子域名
  server_name *.example.com;
  
  # 监听所有顶级域名
  server_name example.*;
  
  # 监听未指定的主机名（监听 IP 地址本身）
  server_name "";
}

# *****************************************************************************
# 提供文件服务 
# *****************************************************************************

# 静态资源（传统 Web 服务器）

server {
    listen 80;
    server_name example.com;

    root /path/to/website;
    # 例如 root /www/data/

    # 如果内部没有 'root'，将查找 /www/data/index.html
    location / {
    }

    # 如果内部没有 'root'，将查找 /www/data/images/index.html
    location /images/ {
    }

    # 由于内部有 'root'，将查找 /www/media/videos/index.html
    location /videos/ {
        root /www/media;
    }
}

# *****************************************************************************
# 重定向
# *****************************************************************************

# 301 永久重定向

server {
    # 将 www.example.com 重定向到 example.com
    listen 80;
    server_name www.example.com;
    return 301 http://example.com$request_uri;
}

server {
    # 将 http 重定向到 https
    listen 80;
    server_name example.com;
    return 301 https://example.com$request_uri;
}

# 302 临时重定向

server {
  listen 80;
  server_name yourdomain.com;
  return 302 http://otherdomain.com;
}

# *****************************************************************************
# 反向代理
# *****************************************************************************

# 适用于 Node.js、Streamlit、Jupyter 等

# 基础配置

server {
  listen 80;
  server_name example.com;
  
  location / {
    proxy_pass http://0.0.0.0:3000;
    # 其中 0.0.0.0:3000 是绑定在 0.0.0.0 上监听 3000 端口的 Node.js 服务器
  }
}

# 基础配置 + (upstream)

upstream node_js {
  server 0.0.0.0:3000;
  # 其中 0.0.0.0:3000 是绑定在 0.0.0.0 上监听 3000 端口的 Node.js 服务器
}

server {
  listen 80;
  server_name example.com;
  
  location / {
    proxy_pass http://node_js;
  }
}

# 升级连接（适用于支持 WebSocket 的应用程序）

upstream node_js {
  server 0.0.0.0:3000;
}

server {
  listen 80;
  server_name example.com;
  
  location / {
    proxy_pass http://node_js;
    proxy_redirect off;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
	
    }
}

# *****************************************************************************
# HTTPS 协议
# *****************************************************************************

# 大多数 SSL 选项取决于应用程序的功能或需求

server {
    listen 443 ssl http2;
    server_name example.com;

    ssl on;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/privkey.pem;

    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /path/to/fullchain.pem;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    add_header Strict-Transport-Security max-age=15768000;
}

# 永久重定向到 HTTPS 安全域名

server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://$host$request_uri;
}

# 你可以使用 Let's Encrypt 轻松保护你的网站/应用。
# 访问 https://certbot.eff.org/lets-encrypt/ubuntuxenial-nginx.html 获取更多信息

# *****************************************************************************
# 负载均衡
# *****************************************************************************

# 适用于运行多个实例的大型应用。以下示例用于反向代理
upstream node_js {
  server 0.0.0.0:3000;
  server 0.0.0.0:4000;
  server 127.155.142.421;
}

server {
  listen 80;
  server_name example.com;
  
  location / {
    proxy_pass http://node_js;
  }
}
```